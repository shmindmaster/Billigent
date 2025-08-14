import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

export async function runFullSeed() {
  // Users (idempotent via email)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@billigent.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@billigent.com',
      role: 'admin',
    },
  });

  const clinician = await prisma.user.upsert({
    where: { email: 'doctor@billigent.com' },
    update: {},
    create: {
      name: 'Dr. Sarah Johnson',
      email: 'doctor@billigent.com',
      role: 'clinician',
    },
  });

  // Patients (idempotent via MRN)
  const patient1 = await prisma.patient.upsert({
    where: { mrn: 'MRN001' },
    update: {},
    create: {
      name: 'John Doe',
      mrn: 'MRN001',
      dob: new Date('1980-05-15'),
      gender: 'M',
    },
  });
  const patient2 = await prisma.patient.upsert({
    where: { mrn: 'MRN002' },
    update: {},
    create: {
      name: 'Jane Smith',
      mrn: 'MRN002',
      dob: new Date('1975-08-22'),
      gender: 'F',
    },
  });

  // A case (ensure single by title + assigned clinician)
  let case1 = await prisma.case.findFirst({
    where: { title: 'Cardiology Consultation Review', assignedUserId: clinician.id },
  });
  if (!case1) {
    case1 = await prisma.case.create({
      data: {
        title: 'Cardiology Consultation Review',
        description: 'Review cardiology consultation for accuracy and billing optimization',
        status: 'open',
        priority: 'high',
        assignedUserId: clinician.id,
      },
    });
  }

  // Encounters (idempotent via encounterId)
  const encounter1 = await prisma.encounter.upsert({
    where: { encounterId: 'ENC001' },
    update: {
      patientId: patient1.id,
      caseId: case1.id,
      chiefComplaint: 'Chest pain and shortness of breath',
      admissionDate: new Date('2024-01-15'),
      status: 'active',
    },
    create: {
      encounterId: 'ENC001',
      patientId: patient1.id,
      caseId: case1.id,
      chiefComplaint: 'Chest pain and shortness of breath',
      admissionDate: new Date('2024-01-15'),
      status: 'active',
    },
  });

  const demoEncounter = await prisma.encounter.upsert({
    where: { encounterId: 'demo-encounter-001' },
    update: {
      patientId: patient2.id,
      caseId: case1.id,
      chiefComplaint: 'Abdominal pain with nausea and vomiting',
      admissionDate: new Date('2024-02-20'),
      status: 'active',
    },
    create: {
      encounterId: 'demo-encounter-001',
      patientId: patient2.id,
      caseId: case1.id,
      chiefComplaint: 'Abdominal pain with nausea and vomiting',
      admissionDate: new Date('2024-02-20'),
      status: 'active',
    },
  });
  // Diagnoses (idempotent by unique [encounterId+icdCode])
  const diag1Exists = await prisma.diagnosis.findFirst({
    where: { encounterId: encounter1.id, icdCode: 'I25.10' },
    select: { id: true },
  });
  if (!diag1Exists) {
    await prisma.diagnosis.create({
      data: {
        encounterId: encounter1.id,
        icdCode: 'I25.10',
        description:
          'Atherosclerotic heart disease of native coronary artery without angina pectoris',
        isPrimary: true,
      },
    });
  }

  const demoDiag1Exists = await prisma.diagnosis.findFirst({
    where: { encounterId: demoEncounter.id, icdCode: 'K59.00' },
    select: { id: true },
  });
  if (!demoDiag1Exists) {
    await prisma.diagnosis.create({
      data: {
        encounterId: demoEncounter.id,
        icdCode: 'K59.00',
        description: 'Constipation, unspecified',
        isPrimary: true,
      },
    });
  }

  const demoDiag2Exists = await prisma.diagnosis.findFirst({
    where: { encounterId: demoEncounter.id, icdCode: 'R11.10' },
    select: { id: true },
  });
  if (!demoDiag2Exists) {
    await prisma.diagnosis.create({
      data: {
        encounterId: demoEncounter.id,
        icdCode: 'R11.10',
        description: 'Vomiting, unspecified',
        isPrimary: false,
      },
    });
  }

  // Procedures (idempotent by unique [encounterId+cptCode])
  const proc1Exists = await prisma.procedure.findFirst({
    where: { encounterId: encounter1.id, cptCode: '93458' },
    select: { id: true },
  });
  if (!proc1Exists) {
    await prisma.procedure.create({
      data: {
        encounterId: encounter1.id,
        cptCode: '93458',
        description:
          'Catheter placement in coronary artery(s) for coronary angiography',
      },
    });
  }

  const demoProcExists = await prisma.procedure.findFirst({
    where: { encounterId: demoEncounter.id, cptCode: '43235' },
    select: { id: true },
  });
  if (!demoProcExists) {
    await prisma.procedure.create({
      data: {
        encounterId: demoEncounter.id,
        cptCode: '43235',
        description:
          'Esophagogastroduodenoscopy, flexible, transoral; diagnostic',
      },
    });
  }

  // ----------------------------------
  // Denials seed (only if not already) to support baseline metrics
  // We'll create a small distribution across reasons and statuses.
  const existingDenials = await prisma.denial.count();
  if (existingDenials === 0) {
    const denialReasons = [
      { reason: 'Missing documentation', code: 'MD01' },
      { reason: 'Incorrect coding', code: 'IC10' },
      { reason: 'Medical necessity', code: 'MN05' },
      { reason: 'Late filing', code: 'LF02' },
    ];
    const statuses = ['pending', 'appealed', 'resolved'];

    for (let i = 0; i < 12; i++) {
      const r = denialReasons[i % denialReasons.length];
      const status = statuses[i % statuses.length];
      const amount = 100 + (i * 37) % 450; // varied amount 100-549
      await prisma.denial.create({
        data: {
          caseId: case1.id,
            denialReason: r.reason,
            amount,
            status,
            denialReasonCode: r.code,
            deniedAmount: status === 'resolved' ? amount * 0.4 : undefined,
            appealDate: status !== 'pending' ? new Date(Date.now() - (i + 3) * 86400000) : undefined,
            resolution: status === 'resolved' ? 'Approved partial payment' : undefined,
        }
      });
    }
  }

  // Basic analytics events for baseline testing (idempotent simplistic)
  const existingAnalytics = await prisma.analytics.count();
  if (existingAnalytics === 0) {
    await prisma.analytics.createMany({
      data: [
        { metric: 'denials.total', value: 12 },
        { metric: 'denials.amount.total', value: 12 * 300 },
        { metric: 'denials.appealed', value: 4 },
      ]
    });
  }

  console.log('Seed data ensured successfully (including denials).');
}

// If executed directly (pnpm prisma db seed), run the full seed
if (require.main === module) {
  runFullSeed()
    .catch((e) => {
    console.error(e);
    process.exit(1);
  })
    .finally(async () => {
      await prisma.$disconnect();
    });
}


import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Create sample users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@billigent.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@billigent.com',
      role: 'admin'
    }
  });

  const clinician = await prisma.user.upsert({
    where: { email: 'doctor@billigent.com' },
    update: {},
    create: {
      name: 'Dr. Sarah Johnson',
      email: 'doctor@billigent.com',
      role: 'clinician'
    }
  });

  // Create sample patients
  const patient1 = await prisma.patient.upsert({
    where: { mrn: 'MRN001' },
    update: {},
    create: {
      name: 'John Doe',
      mrn: 'MRN001',
      dob: new Date('1980-05-15'),
      gender: 'M'
    }
  });

  const patient2 = await prisma.patient.upsert({
    where: { mrn: 'MRN002' },
    update: {},
    create: {
      name: 'Jane Smith',
      mrn: 'MRN002',
      dob: new Date('1975-08-22'),
      gender: 'F'
    }
  });

  // Create sample cases
  const case1 = await prisma.case.create({
    data: {
      title: 'Cardiology Consultation Review',
      description: 'Review cardiology consultation for accuracy and billing optimization',
      status: 'open',
      priority: 'high',
      assignedUserId: clinician.id
    }
  });

  // Create sample encounters
  const encounter1 = await prisma.encounter.create({
    data: {
      encounterId: 'ENC001',
      patientId: patient1.id,
      caseId: case1.id,
      chiefComplaint: 'Chest pain and shortness of breath',
      admissionDate: new Date('2024-01-15'),
      status: 'active'
    }
  });

  // Create demo encounter for testing CDI analysis
  const demoEncounter = await prisma.encounter.create({
    data: {
      encounterId: 'demo-encounter-001',
      patientId: patient2.id,
      caseId: case1.id,
      chiefComplaint: 'Abdominal pain with nausea and vomiting',
      admissionDate: new Date('2024-02-20'),
      status: 'active'
    }
  });

  // Create sample diagnoses
  await prisma.diagnosis.create({
    data: {
      encounterId: encounter1.id,
      icdCode: 'I25.10',
      description: 'Atherosclerotic heart disease of native coronary artery without angina pectoris',
      isPrimary: true
    }
  });

  // Create demo encounter diagnoses
  await prisma.diagnosis.create({
    data: {
      encounterId: demoEncounter.id,
      icdCode: 'K59.00',
      description: 'Constipation, unspecified',
      isPrimary: true
    }
  });

  await prisma.diagnosis.create({
    data: {
      encounterId: demoEncounter.id,
      icdCode: 'R11.10',
      description: 'Vomiting, unspecified',
      isPrimary: false
    }
  });

  // Create sample procedures
  await prisma.procedure.create({
    data: {
      encounterId: encounter1.id,
      cptCode: '93458',
      description: 'Catheter placement in coronary artery(s) for coronary angiography'
    }
  });

  // Create demo encounter procedures
  await prisma.procedure.create({
    data: {
      encounterId: demoEncounter.id,
      cptCode: '43235',
      description: 'Esophagogastroduodenoscopy, flexible, transoral; diagnostic'
    }
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
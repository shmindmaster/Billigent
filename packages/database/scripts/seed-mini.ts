/*
 * Mini synthetic seed script (DEV tier) to quickly light up the app with realistic-looking data.
 * Safe, self-contained, no external downloads. Creates:
 *  - Users (2)
 *  - Patients (~50)
 *  - Encounters (~80)
 *  - Diagnoses (~120)
 *  - Procedures (~30)
 *  - Cases (~40) referencing encounters
 *  - Denials (~12) referencing cases
 *  - PreBillAnalyses (~10) for selected encounters
 *
 * Idempotent-ish: if run multiple times it ADDS more data (no truncation by default) unless CLEAR_DB=true.
 * To wipe before seeding: set CLEAR_DB=true environment variable.
 *
 * NOTE: This produces synthetic data ONLY (no real PHI). Label any derivative analytics as synthetic.
 */
import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
});

interface RandomOpts { min?: number; max?: number; }
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T>(arr: T[]) => arr[randInt(0, arr.length - 1)];

function randomDateWithinPast(days: number): Date {
  const now = Date.now();
  const delta = randInt(0, days) * 24 * 60 * 60 * 1000;
  return new Date(now - delta);
}

const genders = ['male', 'female', 'other'];
const denialReasons = [
  'Charge exceeds fee schedule (CO45)',
  'Information missing (CO16)',
  'Benefit not covered (CO97)',
  'Non-covered service (CO50)',
  'Duplicate claim (CO18)',
  'Authorization required (CO197)',
];

async function maybeClear() {
  if (process.env.CLEAR_DB === 'true') {
    console.log('CLEAR_DB=true → truncating key tables');
    await prisma.$transaction([
      prisma.preBillAnalysis.deleteMany(),
      prisma.denial.deleteMany(),
      prisma.case.deleteMany(),
      prisma.procedure.deleteMany(),
      prisma.diagnosis.deleteMany(),
      prisma.encounter.deleteMany(),
      prisma.patient.deleteMany(),
      prisma.user.deleteMany(),
      prisma.analytics.deleteMany(),
    ]);
  }
}

async function seedUsers() {
  const existing = await prisma.user.count();
  if (existing > 0) return; // keep lightweight
  await prisma.user.createMany({ data: [
    { id: crypto.randomUUID(), name: 'Alice', email: 'alice@example.test', role: 'admin', fullName: 'Alice Admin' },
    { id: crypto.randomUUID(), name: 'Bob', email: 'bob@example.test', role: 'user', fullName: 'Bob User' },
  ]});
}

async function seedPatients(count = 50) {
  const patients = Array.from({ length: count }).map(() => ({
    id: crypto.randomUUID(),
    name: `Patient ${crypto.randomUUID().slice(0,8)}`,
    mrn: `MRN${Date.now().toString().slice(-6)}${randInt(100,999)}`,
    dob: randomDateWithinPast(365 * randInt(25, 80)),
    gender: pick(genders)
  }));
  await prisma.patient.createMany({ data: patients, skipDuplicates: true });
  return patients.map(p => p.id);
}

async function seedEncounters(patientIds: string[], target = 80) {
  const encounters: any[] = [];
  for (let i = 0; i < target; i++) {
    const admission = randomDateWithinPast(120);
    const discharge = new Date(admission.getTime() + randInt(0,5) * 24*60*60*1000);
    encounters.push({
      id: crypto.randomUUID(),
      patientId: pick(patientIds),
      encounterId: `ENC-${crypto.randomUUID().slice(0,8)}`,
      chiefComplaint: pick(['Chest pain','Abdominal pain','Shortness of breath','Fatigue','Headache']),
      admissionDate: admission,
      dischargeDate: randInt(0,10) > 2 ? discharge : null,
      status: 'active'
    });
  }
  await prisma.encounter.createMany({ data: encounters, skipDuplicates: true });
  return encounters.map(e => e.id);
}

async function seedDiagnoses(encounterIds: string[], approx = 120) {
  const dxCodes = ['I10','E11.9','J45.909','K21.9','M54.5','R53.1','R07.9','N39.0'];
  const dx: any[] = [];
  for (let i = 0; i < approx; i++) {
    dx.push({
      id: crypto.randomUUID(),
      encounterId: pick(encounterIds),
      icdCode: pick(dxCodes),
      description: 'Synthetic diagnosis',
      isPrimary: randInt(0,10) === 0
    });
  }
  await prisma.diagnosis.createMany({ data: dx, skipDuplicates: true });
}

async function seedProcedures(encounterIds: string[], approx = 30) {
  const cpts = ['99213','93000','71020','80050','93010','96372'];
  const procs: any[] = [];
  for (let i = 0; i < approx; i++) {
    procs.push({
      id: crypto.randomUUID(),
      encounterId: pick(encounterIds),
      cptCode: pick(cpts),
      description: 'Synthetic procedure'
    });
  }
  await prisma.procedure.createMany({ data: procs, skipDuplicates: true });
}

async function seedCases(encounterIds: string[]) {
  const selected = encounterIds.filter((_id, idx) => idx % 2 === 0); // half
  const cases: any[] = selected.map(encId => ({
    id: crypto.randomUUID(),
    title: `Case for ${encId.slice(0,8)}`,
    encounterFhirId: encId, // reuse as FHIR reference surrogate
    patientFhirId: 'FHIR-' + encId.slice(0,8),
    status: pick(['open','active','closed']),
    priority: pick(['low','medium','high'])
  }));
  await prisma.case.createMany({ data: cases, skipDuplicates: true });
  return cases.map(c => c.id);
}

async function seedDenials(caseIds: string[], approx = 12) {
  const denials: any[] = [];
  for (let i = 0; i < approx && i < caseIds.length; i++) {
    const reason = pick(denialReasons);
    const charge = randInt(500, 12000);
    const deniedPortion = charge * (Math.random() * 0.5 + 0.1);
    denials.push({
      id: crypto.randomUUID(),
      caseId: caseIds[i],
      denialReason: reason,
      amount: charge,
      deniedAmount: deniedPortion,
      denialReasonCode: reason.match(/\((.*?)\)/)?.[1] || null,
      status: pick(['pending','appealed','resolved'])
    });
  }
  if (denials.length) await prisma.denial.createMany({ data: denials, skipDuplicates: true });
}

async function seedPreBill(encounterIds: string[], approx = 10) {
  const subset = encounterIds.slice(0, approx);
  for (const encId of subset) {
    await prisma.preBillAnalysis.create({
      data: {
        id: crypto.randomUUID(),
        encounterId: encId,
        confidence: Math.random() * 0.3 + 0.6,
        recommendations: 'Review secondary diagnoses for potential MCC capture. Ensure documentation completeness.',
        riskFactors: '"hypertension","diabetes"',
        potentialFinancialImpact: Math.round(Math.random()*5000),
        status: 'completed',
      }
    }).catch(() => {/* ignore duplicates */});
  }
}

async function seedAnalyticsSnapshot() {
  const denialCount = await prisma.denial.count();
  await prisma.analytics.create({
    data: { metric: 'synthetic_seed_run', value: 1, description: `Seed run at ${new Date().toISOString()}` }
  });
  await prisma.analytics.create({
    data: { metric: 'denials_total', value: denialCount }
  });
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('\n[seed-mini] DATABASE_URL not set. Please set a valid SQL Server connection string before seeding.');
    console.error('Example (PowerShell):');
    console.error('  $env:DATABASE_URL="sqlserver://USER:PASSWORD@HOST:1433;database=DB;encrypt=true"');
    console.error('Then run:');
    console.error('  pnpm -F @billigent/database run db:seed:mini');
    process.exit(1);
  }
  console.log('Starting mini synthetic seed...');
  await maybeClear();

  await seedUsers();
  const patientIds = await seedPatients();
  const encounterIds = await seedEncounters(patientIds);
  await seedDiagnoses(encounterIds);
  await seedProcedures(encounterIds);
  const caseIds = await seedCases(encounterIds);
  await seedDenials(caseIds);
  await seedPreBill(encounterIds);
  await seedAnalyticsSnapshot();

  console.log('Mini seed complete');
}

main()
  .catch(err => {
    console.error('Seed failed (likely DB not reachable / auth):', err.message);
    process.exit(1);
  })
  .finally(async () => { await prisma.$disconnect(); });

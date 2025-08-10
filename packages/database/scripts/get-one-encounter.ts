import { PrismaClient } from '../src/generated/prisma/index.js';

async function main() {
  const prisma = new PrismaClient();
  try {
    const reviews = await prisma.cDI_Reviews.findMany({ include: { case: true }, take: 10 });
    for (const r of reviews) {
      console.log(JSON.stringify({ caseId: r.caseId, encounterFhirId: (r as any).case?.encounterFhirId }));
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });



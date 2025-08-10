import { PrismaClient } from '../src/generated/prisma/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve backend workflow relative to this script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendWorkflowPath = new URL('../../../apps/backend/src/workflows/pre-bill.workflow.ts', import.meta.url).pathname;

async function main() {
  const prisma = new PrismaClient();
  try {
    const { runPreBillAnalysisForEncounter, persistPreBillResults } = await import(backendWorkflowPath);
    const cdiCases = await prisma.cDI_Reviews.findMany({ select: { caseId: true }, take: 10 });
    for (const c of cdiCases) {
      try {
        const theCase = await prisma.cases.findUnique({ where: { caseId: c.caseId } });
        if (!theCase) continue;
        const analysis = await runPreBillAnalysisForEncounter(theCase.encounterFhirId);
        await persistPreBillResults(c.caseId, analysis);
        console.log(`Enriched case ${c.caseId}`);
      } catch (e: any) {
        console.warn(`Enrichment failed for ${c.caseId}:`, e?.message || e);
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});



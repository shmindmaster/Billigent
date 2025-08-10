import { PrismaClient } from '@billigent/database';
import { getClinicalEvidence } from '../services/datalake.service';
import { generateAppealLetter } from '../services/responses-api.service';

const prisma = new PrismaClient();

export async function generateDenialAppeal(denialId: number) {
  const denial = await prisma.denials.findUnique({ where: { denialId } });
  if (!denial) throw new Error('Denial not found');
  const parentCase = await prisma.cases.findUnique({ where: { caseId: denial.caseId } });
  if (!parentCase) throw new Error('Parent case not found');

  const clinicalHistory = await getClinicalEvidence(parentCase.encounterFhirId);
  const letter = await generateAppealLetter(denial, clinicalHistory);
  await prisma.denials.update({ where: { denialId }, data: { appealLetterDraft: letter } });
  return letter;
}



import { PrismaClient } from '@billigent/database';
import { getClinicalEvidence } from '../services/datalake.service';
import { generateAppealLetter } from '../services/responses-api.service';

const prisma = new PrismaClient();

export async function generateDenialAppeal(denialId: string) {
  const denial = await prisma.denial.findUnique({ where: { id: denialId } });
  if (!denial) throw new Error('Denial not found');
  
  if (!denial.caseId) throw new Error('Denial has no associated case');
  
  const parentCase = await prisma.case.findUnique({ where: { id: denial.caseId } });
  if (!parentCase) throw new Error('Parent case not found');

  if (!parentCase.encounterFhirId) throw new Error('Case has no encounter FHIR ID');

  const clinicalHistory = await getClinicalEvidence(parentCase.encounterFhirId);
  const appealResponse = await generateAppealLetter(denial, clinicalHistory);
  const appealLetterText = appealResponse.data?.answer || appealResponse.error || 'Appeal letter generation failed';
  await prisma.denial.update({ where: { id: denialId }, data: { appealLetterDraft: appealLetterText } });
  return appealResponse;
}




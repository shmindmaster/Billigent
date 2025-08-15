// Purged legacy Prisma-based pre-bill workflow. Pending Cosmos rewrite.
export interface PreBillAnalysisResult { encounterId: string; confidence: number; recommendations: any; riskFactors: string[]; notes: string; }
export async function runPreBillAnalysisForEncounter(_encounterId: string): Promise<PreBillAnalysisResult> { throw new Error('pre-bill workflow removed during purge'); }
export async function persistPreBillResults(_results: PreBillAnalysisResult): Promise<void> { throw new Error('pre-bill workflow removed during purge'); }

import { PrismaClient } from '@billigent/database';
import { ragService } from '../services/rag.service';

const prisma = new PrismaClient();

export interface PreBillAnalysisResult {
  encounterId: string;
  confidence: number;
  recommendations: {
    icdCodes: Array<{
      code: string;
      description: string;
      confidence: number;
    }>;
    cptCodes: Array<{
      code: string;
      description: string;
      confidence: number;
    }>;
  };
  riskFactors: string[];
  notes: string;
}

export async function runPreBillAnalysisForEncounter(encounterId: string): Promise<PreBillAnalysisResult> {
  try {
    // Fetch encounter data
    const encounter = await prisma.encounter.findUnique({
      where: { id: encounterId },
      include: {
        patient: true,
        diagnoses: true,
        procedures: true
      }
    });

    if (!encounter) {
      throw new Error(`Encounter ${encounterId} not found`);
    }

    // Prepare query for RAG
    const query = `Analyze medical encounter for patient: ${encounter.patient?.name || 'Unknown'}
    Chief Complaint: ${encounter.chiefComplaint || 'Not specified'}
    Diagnoses: ${encounter.diagnoses.map(d => d.description).join(', ')}
    Procedures: ${encounter.procedures.map(p => p.description).join(', ')}
    
    Provide ICD-10 and CPT code recommendations with confidence scores.`;

    // Get AI analysis
    const ragResponse = await ragService.query(query);

    // Parse response and extract structured data
    const result: PreBillAnalysisResult = {
      encounterId,
      confidence: ragResponse.confidence,
      recommendations: {
        icdCodes: extractIcdCodes(ragResponse.answer),
        cptCodes: extractCptCodes(ragResponse.answer)
      },
      riskFactors: extractRiskFactors(ragResponse.answer),
      notes: ragResponse.answer
    };

    return result;
  } catch (error) {
    console.error('Error in pre-bill analysis:', error);
    throw error;
  }
}

export async function persistPreBillResults(results: PreBillAnalysisResult): Promise<void> {
  try {
    await prisma.preBillAnalysis.create({
      data: {
        encounterId: results.encounterId,
        confidence: results.confidence,
        recommendations: JSON.stringify(results.recommendations),
        riskFactors: results.riskFactors.join(', '),
        notes: results.notes,
        status: 'completed'
      }
    });
  } catch (error) {
    console.error('Error persisting pre-bill results:', error);
    throw error;
  }
}

function extractIcdCodes(text: string): Array<{ code: string; description: string; confidence: number }> {
  // Simple pattern matching for ICD codes (would be more sophisticated in production)
  const icdPattern = /([A-Z]\d{2}(?:\.\d{1,2})?)\s*[-:]\s*([^\n]+)/g;
  const codes: Array<{ code: string; description: string; confidence: number }> = [];
  
  let match;
  while ((match = icdPattern.exec(text)) !== null) {
    codes.push({
      code: match[1],
      description: match[2].trim(),
      confidence: 0.8 // Default confidence
    });
  }
  
  return codes;
}

function extractCptCodes(text: string): Array<{ code: string; description: string; confidence: number }> {
  // Simple pattern matching for CPT codes
  const cptPattern = /(\d{5})\s*[-:]\s*([^\n]+)/g;
  const codes: Array<{ code: string; description: string; confidence: number }> = [];
  
  let match;
  while ((match = cptPattern.exec(text)) !== null) {
    codes.push({
      code: match[1],
      description: match[2].trim(),
      confidence: 0.8 // Default confidence
    });
  }
  
  return codes;
}

function extractRiskFactors(text: string): string[] {
  // Extract potential risk factors from the analysis
  const riskKeywords = [
    'complication', 'risk', 'contraindication', 'adverse',
    'warning', 'caution', 'monitor', 'follow-up'
  ];
  
  const factors: string[] = [];
  const sentences = text.split(/[.!?]+/);
  
  sentences.forEach(sentence => {
    const lowerSentence = sentence.toLowerCase();
    if (riskKeywords.some(keyword => lowerSentence.includes(keyword))) {
      factors.push(sentence.trim());
    }
  });
  
  return factors;
}

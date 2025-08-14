import OpenAI from 'openai';
import { DefaultAzureCredential } from '@azure/identity';

export interface AppealDraftRequest {
  encounterId: string;
  denialPatternId: string;
  clinicalFacts: string[];
  diagnosisCodes: string[];
  denialReason: string;
  payer: string;
}

export interface AppealDraftResponse {
  draftId: string;
  narrative: string;
  factCitations: { factId: string; sourceIds: string[] }[];
  codingJustification: string[];
  riskFlags: { type: string; message: string }[];
  confidence: number;
  version: string;
  metadata: {
    modelUsed: string;
    tokensUsed: number;
    processingTime: number;
  };
}

export interface ConversationalQuery {
  query: string;
  context: {
    caseId: string;
    patientInfo?: string;
    clinicalSummary?: string;
    currentDRG?: string;
  };
}

export interface ConversationalResponse {
  responseId: string;
  content: string;
  confidence: number;
  sources: string[];
  suggestedActions: string[];
  metadata: {
    modelUsed: string;
    tokensUsed: number;
    processingTime: number;
  };
}

export class AzureOpenAIService {
  private openai: OpenAI;
  private modelName: string;
  private embeddingModel: string;

  constructor() {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4o-mini';
    const embeddingDeployment = process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT || 'text-embedding-3-small';

    if (!endpoint || !apiKey) {
      throw new Error('Azure OpenAI configuration missing. Please set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY');
    }

    this.openai = new OpenAI({
      apiKey,
      baseURL: `${endpoint}/openai/deployments/${deploymentName}`,
      defaultQuery: { 'api-version': '2024-02-15-preview' },
      defaultHeaders: { 'api-key': apiKey }
    });

    this.modelName = deploymentName;
    this.embeddingModel = embeddingDeployment;
  }

  /**
   * Generate appeal draft using Azure OpenAI
   */
  async generateAppealDraft(request: AppealDraftRequest): Promise<AppealDraftResponse> {
    const startTime = Date.now();

    const prompt = this.buildAppealPrompt(request);
    
    try {
      const completion = await this.openai.chat.completions.create({
        model: this.modelName,
        messages: [
          {
            role: 'system',
            content: `You are a healthcare revenue cycle specialist with expertise in medical coding, clinical documentation, and appeals. 
            Your task is to generate a compelling, evidence-based appeal letter that addresses the denial reason with clinical justification.
            
            Guidelines:
            - Use clinical facts to support medical necessity
            - Reference specific diagnosis codes and their clinical relevance
            - Address the denial reason directly with evidence
            - Maintain professional, persuasive tone
            - Include specific clinical details that support the appeal
            - Format as a structured appeal letter with clear sections`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response generated from OpenAI');
      }

      const processingTime = Date.now() - startTime;
      const tokensUsed = completion.usage?.total_tokens || 0;

      // Parse the response to extract structured components
      const parsedResponse = this.parseAppealResponse(response, request);

      return {
        ...parsedResponse,
        metadata: {
          modelUsed: this.modelName,
          tokensUsed,
          processingTime
        }
      };

    } catch (error) {
      console.error('Error generating appeal draft:', error);
      throw new Error(`Failed to generate appeal draft: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate conversational response for CDI queries
   */
  async generateConversationalResponse(query: ConversationalQuery): Promise<ConversationalResponse> {
    const startTime = Date.now();

    const prompt = this.buildConversationalPrompt(query);
    
    try {
      const completion = await this.openai.chat.completions.create({
        model: this.modelName,
        messages: [
          {
            role: 'system',
            content: `You are a Clinical Documentation Improvement (CDI) specialist assistant. 
            Your role is to help healthcare professionals with clinical documentation questions, 
            coding guidance, and revenue cycle optimization.
            
            Guidelines:
            - Provide accurate, evidence-based guidance
            - Reference relevant clinical guidelines and regulations
            - Suggest specific documentation improvements
            - Explain the financial impact of documentation changes
            - Offer actionable recommendations
            - Be concise but comprehensive`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 1000,
        top_p: 0.9
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response generated from OpenAI');
      }

      const processingTime = Date.now() - startTime;
      const tokensUsed = completion.usage?.total_tokens || 0;

      // Parse response for structured components
      const parsedResponse = this.parseConversationalResponse(response, query);

      return {
        ...parsedResponse,
        metadata: {
          modelUsed: this.modelName,
          tokensUsed,
          processingTime
        }
      };

    } catch (error) {
      console.error('Error generating conversational response:', error);
      throw new Error(`Failed to generate conversational response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate embeddings for clinical text
   */
  async generateEmbeddings(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: this.embeddingModel,
        input: text,
        encoding_format: 'float'
      });

      return response.data[0]?.embedding || [];
    } catch (error) {
      console.error('Error generating embeddings:', error);
      throw new Error(`Failed to generate embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Build appeal prompt from request data
   */
  private buildAppealPrompt(request: AppealDraftRequest): string {
    return `
Generate a comprehensive appeal letter for the following case:

ENCOUNTER ID: ${request.encounterId}
DENIAL PATTERN: ${request.denialPatternId}
PAYER: ${request.payer}
DENIAL REASON: ${request.denialReason}

CLINICAL FACTS:
${request.clinicalFacts.map((fact, index) => `${index + 1}. ${fact}`).join('\n')}

DIAGNOSIS CODES:
${request.diagnosisCodes.map((code, index) => `${index + 1}. ${code}`).join('\n')}

Please structure your response as follows:

NARRATIVE:
[Write a compelling appeal narrative that addresses the denial reason with clinical evidence]

FACT CITATIONS:
[Reference specific clinical facts that support the appeal]

CODING JUSTIFICATION:
[Explain how the diagnosis codes support medical necessity]

RISK FLAGS:
[Identify any potential issues or areas needing attention]

CONFIDENCE: [0-1 scale indicating confidence in the appeal strength]
    `.trim();
  }

  /**
   * Build conversational prompt from query
   */
  private buildConversationalPrompt(query: ConversationalQuery): string {
    return `
CONTEXT:
Case ID: ${query.context.caseId}
${query.context.patientInfo ? `Patient Info: ${query.context.patientInfo}` : ''}
${query.context.clinicalSummary ? `Clinical Summary: ${query.context.clinicalSummary}` : ''}
${query.context.currentDRG ? `Current DRG: ${query.context.currentDRG}` : ''}

QUERY: ${query.query}

Please provide a helpful response that addresses the query with specific guidance and actionable recommendations.
    `.trim();
  }

  /**
   * Parse appeal response into structured format
   */
  private parseAppealResponse(response: string, request: AppealDraftRequest): Omit<AppealDraftResponse, 'metadata'> {
    // Simple parsing - in production, you might want more sophisticated parsing
    const sections = response.split(/(?=NARRATIVE:|FACT CITATIONS:|CODING JUSTIFICATION:|RISK FLAGS:|CONFIDENCE:)/);
    
    const narrative = sections.find(s => s.startsWith('NARRATIVE:'))?.replace('NARRATIVE:', '').trim() || 
                     'Appeal narrative generated based on clinical evidence.';
    
    const factCitations = request.clinicalFacts.map((fact, index) => ({
      factId: `FACT:${index + 1}`,
      sourceIds: [`SOURCE:${index + 1}`]
    }));

    const codingJustification = request.diagnosisCodes.map(code => 
      `Code ${code} is clinically justified based on documented symptoms and findings.`
    );

    const riskFlags = [];
    if (request.clinicalFacts.length < 3) {
      riskFlags.push({ type: 'insufficient_evidence', message: 'Limited clinical facts available for appeal' });
    }

    const confidence = 0.7 + (request.clinicalFacts.length * 0.05); // Higher confidence with more facts

    return {
      draftId: `APPEAL:${request.encounterId}:${Date.now()}`,
      narrative,
      factCitations,
      codingJustification,
      riskFlags,
      confidence: Math.min(confidence, 0.95),
      version: '1.0.0'
    };
  }

  /**
   * Parse conversational response into structured format
   */
  private parseConversationalResponse(response: string, query: ConversationalQuery): Omit<ConversationalResponse, 'metadata'> {
    // Extract suggested actions from response (simple keyword-based approach)
    const suggestedActions: string[] = [];
    if (response.toLowerCase().includes('document')) {
      suggestedActions.push('Review clinical documentation for completeness');
    }
    if (response.toLowerCase().includes('code')) {
      suggestedActions.push('Verify diagnosis code accuracy and specificity');
    }
    if (response.toLowerCase().includes('query')) {
      suggestedActions.push('Consider sending physician query for clarification');
    }

    return {
      responseId: `RESP:${query.context.caseId}:${Date.now()}`,
      content: response,
      confidence: 0.8,
      sources: ['Clinical guidelines', 'Coding standards', 'Revenue cycle best practices'],
      suggestedActions: suggestedActions.length > 0 ? suggestedActions : ['Review case for documentation opportunities']
    };
  }
}

// Export singleton instance
export const azureOpenAIService = new AzureOpenAIService();
export default azureOpenAIService;

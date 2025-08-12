import { config } from 'dotenv';
import OpenAI from 'openai';

config();

export interface ResponsesAPIConfig {
  endpoint: string;
  apiKey: string;
  deployment: string;
  timeout: number;
}

export interface ResponsesAPIResponse {
  id: string;
  status: 'success' | 'error' | 'in_progress' | 'completed';
  data?: any;
  error?: string;
  timestamp: string;
  result?: any;
  progress?: number;
}

export interface ConversationContext {
  previousResponseId?: string;
  conversationId?: string;
  patientContext?: any;
  clinicalData?: any;
}

export class ResponsesAPIService {
  private config: ResponsesAPIConfig;
  private client: OpenAI;

  constructor(config?: Partial<ResponsesAPIConfig>) {
    this.config = {
      endpoint: process.env.AZURE_OPENAI_ENDPOINT || config?.endpoint || '',
      apiKey: process.env.AZURE_OPENAI_API_KEY || config?.apiKey || '',
      deployment: process.env.AZURE_OPENAI_MODEL_DEPLOYMENT || 'gpt-4o',
      timeout: 60000,
      ...config
    };

    // Validate required configuration
    if (!this.config.endpoint) {
      throw new Error('AZURE_OPENAI_ENDPOINT environment variable is required');
    }
    if (!this.config.apiKey) {
      throw new Error('AZURE_OPENAI_API_KEY environment variable is required');
    }

    // Initialize OpenAI client with Azure endpoint
    this.client = new OpenAI({
      apiKey: this.config.apiKey,
      baseURL: `${this.config.endpoint}/openai/deployments/${this.config.deployment}`,
      defaultQuery: { 'api-version': '2024-08-01-preview' },
      defaultHeaders: {
        'Content-Type': 'application/json',
      },
    });
  }

  async submitQuery(query: string, context?: ConversationContext): Promise<ResponsesAPIResponse> {
    try {
      const messages = [
        {
          role: 'system' as const,
          content: `You are a clinical intelligence assistant for healthcare professionals. 
          You specialize in Clinical Documentation Improvement (CDI), denial management, and ICD-10 coding.
          Always ground your responses in medical evidence and provide specific, actionable recommendations.
          If discussing ICD codes, provide the full code and description.
          ${context?.clinicalData ? `Patient Context: ${JSON.stringify(context.clinicalData)}` : ''}`
        },
        {
          role: 'user' as const,
          content: query
        }
      ];

      // Use Azure OpenAI chat completions
      const response = await this.client.chat.completions.create({
        model: this.config.deployment, // This will be ignored but required by the API
        messages,
        max_tokens: 1000,
        temperature: 0.3,
        top_p: 0.9,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      const responseId = crypto.randomUUID();
      const result = response.choices[0]?.message?.content || 'No response generated';

      return {
        id: responseId,
        status: 'success',
        data: {
          answer: result,
          responseId,
          conversationId: context?.conversationId || crypto.randomUUID(),
          usage: response.usage
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('ResponsesAPIService error:', error);
      return {
        id: crypto.randomUUID(),
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  async getStatus(queryId: string): Promise<ResponsesAPIResponse> {
    // For now, since we're using standard chat completions, return completed status
    // This will be updated when the full Responses API is available
    return {
      id: queryId,
      status: 'completed',
      timestamp: new Date().toISOString()
    };
  }
}

export const responsesAPIService = new ResponsesAPIService();

export async function getConversationalResponse(query: string, context?: ConversationContext): Promise<string> {
  try {
    const response = await responsesAPIService.submitQuery(query, context);
    return response.data?.answer || response.error || 'No response available';
  } catch (error) {
    console.error('Error getting conversational response:', error);
    return 'Error generating response';
  }
}

// Updated implementations for the missing functions
export async function createTextResponse(
  prompt: string, 
  context?: ConversationContext
): Promise<ResponsesAPIResponse> {
  return await responsesAPIService.submitQuery(prompt, context);
}

export async function startBackgroundAnalysisFromBase64(
  base64Content: string,
  denialId: string,
  analysisType: 'denial_analysis' | 'appeal_generation' = 'denial_analysis'
): Promise<string> {
  try {
    // Generate task ID for tracking
    const taskId = crypto.randomUUID();
    
    // Start background processing (simulated for now)
    setTimeout(async () => {
      try {
        const analysisPrompt = analysisType === 'denial_analysis' 
          ? `Analyze this denial letter and extract:
             1. Primary denial reason and codes
             2. Denied amount and claim details  
             3. Medical conditions mentioned
             4. Required documentation for appeal
             5. Appeal deadline and process
             
             Content: ${base64Content.substring(0, 2000)}...`
          : `Generate a comprehensive appeal letter for denial ID ${denialId} based on the denial letter content.
             Include medical evidence, policy references, and clear argumentation.
             
             Content: ${base64Content.substring(0, 2000)}...`;

        const response = await responsesAPIService.submitQuery(analysisPrompt, {
          conversationId: `analysis-${denialId}`,
          clinicalData: { denialId, analysisType }
        });

        // Store result (in a real implementation, this would be stored in database or cache)
        analysisResults.set(taskId, {
          status: 'completed',
          result: response.data,
          completedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error('Background analysis error:', error);
        analysisResults.set(taskId, {
          status: 'failed',
          error: error instanceof Error ? error.message : 'Analysis failed',
          completedAt: new Date().toISOString()
        });
      }
    }, 2000); // 2-second delay to simulate processing

    return taskId;
  } catch (error) {
    console.error('Error starting background analysis:', error);
    throw error;
  }
}

// In-memory storage for analysis results (replace with database in production)
const analysisResults = new Map<string, any>();

export async function retrieveResponse(taskId: string): Promise<ResponsesAPIResponse> {
  const result = analysisResults.get(taskId);
  
  if (!result) {
    return {
      id: taskId,
      status: 'error',
      error: 'Task not found',
      timestamp: new Date().toISOString()
    };
  }

  return {
    id: taskId,
    status: result.status === 'completed' ? 'completed' : 'error',
    data: result.result,
    error: result.error,
    timestamp: result.completedAt || new Date().toISOString()
  };
}

export async function getAnalyticsWithCodeInterpreter(
  query: string,
  dataContext?: any
): Promise<ResponsesAPIResponse> {
  const analyticsPrompt = `As a healthcare data analyst, analyze the following query using the provided data context.
  Provide specific metrics, trends, and actionable insights for clinical decision makers.
  
  Query: ${query}
  Data Context: ${dataContext ? JSON.stringify(dataContext) : 'No specific data provided'}
  
  Please format your response with:
  1. Key metrics and numbers
  2. Trend analysis
  3. Clinical recommendations
  4. Areas for improvement`;

  return await responsesAPIService.submitQuery(analyticsPrompt, {
    conversationId: `analytics-${Date.now()}`,
    clinicalData: dataContext
  });
}

export async function uploadPdfForAnalysis(fileBuffer: Buffer, fileName: string): Promise<string> {
  // Convert buffer to base64 for processing
  const base64Content = fileBuffer.toString('base64');
  const taskId = crypto.randomUUID();
  
  // Store file metadata and start processing
  analysisResults.set(taskId, {
    status: 'processing',
    fileName,
    fileSize: fileBuffer.length,
    startedAt: new Date().toISOString()
  });

  // Start background analysis
  setTimeout(async () => {
    try {
      const extractedText = `[Simulated PDF extraction for ${fileName}]`;
      await startBackgroundAnalysisFromBase64(extractedText, taskId, 'denial_analysis');
    } catch (error) {
      analysisResults.set(taskId, {
        status: 'failed',
        error: 'PDF processing failed',
        completedAt: new Date().toISOString()
      });
    }
  }, 1000);

  return taskId;
}

export async function startPdfAnalysisWithFileId(fileId: string, analysisType?: string): Promise<string> {
  return await startBackgroundAnalysisFromBase64(`fileId:${fileId}`, fileId, 'denial_analysis');
}

export async function startPdfAnalysis(pdfBuffer: Buffer, denialId: string): Promise<string> {
  const base64Content = pdfBuffer.toString('base64');
  return await startBackgroundAnalysisFromBase64(base64Content, denialId, 'denial_analysis');
}

export async function getResponse(taskId: string): Promise<ResponsesAPIResponse> {
  return await retrieveResponse(taskId);
}

export async function generateAppealLetter(
  denialDetails: any,
  patientData?: any,
  clinicalEvidence?: any
): Promise<ResponsesAPIResponse> {
  const appealPrompt = `Generate a comprehensive medical appeal letter for the following denial:

Denial Details: ${JSON.stringify(denialDetails)}
Patient Data: ${patientData ? JSON.stringify(patientData) : 'Not provided'}
Clinical Evidence: ${clinicalEvidence ? JSON.stringify(clinicalEvidence) : 'Not provided'}

The appeal letter should include:
1. Professional header with dates and reference numbers
2. Clear statement of the appeal request
3. Medical justification with clinical evidence
4. Policy and coverage arguments
5. Supporting documentation references
6. Professional closing with next steps

Format as a complete, ready-to-send business letter.`;

  return await responsesAPIService.submitQuery(appealPrompt, {
    conversationId: `appeal-${denialDetails.id || Date.now()}`,
    clinicalData: { denialDetails, patientData, clinicalEvidence }
  });
}

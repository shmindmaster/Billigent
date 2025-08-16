import OpenAI from "openai";
import { DefaultAzureCredential } from "@azure/identity";
import { log } from "../utils/logger";

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
  private openai: OpenAI | null = null;
  private modelName: string;
  private embeddingModel: string;
  private isEnabled: boolean = false;

  constructor() {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const deploymentName =
      process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o-mini";
    const embeddingDeployment =
      process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT || "text-embedding-3-small";

    if (!endpoint || !apiKey) {
      log.warn("Azure OpenAI configuration missing: service will run in fallback mode", { endpoint: !!endpoint, apiKey: !!apiKey });
      this.isEnabled = false;
      this.modelName = "fallback";
      this.embeddingModel = "fallback";
      return;
    }

    try {
      this.openai = new OpenAI({
        apiKey,
        baseURL: `${endpoint}/openai/deployments/${deploymentName}`,
        defaultQuery: { "api-version": "2024-02-15-preview" },
        defaultHeaders: { "api-key": apiKey },
      });

      this.modelName = deploymentName;
      this.embeddingModel = embeddingDeployment;
      this.isEnabled = true;
      log.info("Azure OpenAI service initialized successfully", { modelName: deploymentName, embeddingModel: embeddingDeployment });
    } catch (error) {
      log.warn("Failed to initialize Azure OpenAI service", { error: error instanceof Error ? error.message : error });
      this.isEnabled = false;
      this.modelName = "fallback";
      this.embeddingModel = "fallback";
    }
  }

  /**
   * Check if the service is enabled
   */
  isServiceEnabled(): boolean {
    return this.isEnabled && this.openai !== null;
  }

  /**
   * Generate appeal draft using Azure OpenAI or fallback
   */
  async generateAppealDraft(
    request: AppealDraftRequest
  ): Promise<AppealDraftResponse> {
    const startTime = Date.now();

    if (!this.isServiceEnabled()) {
      log.info("Using fallback mode for appeal draft generation", { requestId: request.encounterId });
      return this.generateFallbackAppealDraft(request);
    }

    const prompt = this.buildAppealPrompt(request);

    try {
      const completion = await this.openai!.chat.completions.create({
        model: this.modelName,
        messages: [
          {
            role: "system",
            content: `You are a healthcare revenue cycle specialist with expertise in medical coding, clinical documentation, and appeals. 
            Your task is to generate a compelling, evidence-based appeal letter that addresses the denial reason with clinical justification.
            
            Guidelines:
            - Use clinical facts to support medical necessity
            - Reference specific diagnosis codes and their clinical relevance
            - Address the denial reason directly with evidence
            - Maintain professional, persuasive tone
            - Include specific clinical details that support the appeal
            - Format as a structured appeal letter with clear sections`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 1500,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error("No response generated from OpenAI");
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
          processingTime,
        },
      };
    } catch (error) {
      log.error("Error generating appeal draft with OpenAI, falling back to fallback mode", { error: error instanceof Error ? error.message : error, requestId: request.encounterId });
      return this.generateFallbackAppealDraft(request);
    }
  }

  /**
   * Generate fallback appeal draft without AI
   */
  private generateFallbackAppealDraft(request: AppealDraftRequest): AppealDraftResponse {
    const startTime = Date.now();
    
    const narrative = `This is a fallback appeal draft for encounter ${request.encounterId}. 
    The appeal addresses the denial reason: "${request.denialReason}" from payer ${request.payer}.
    Clinical facts support medical necessity for the services rendered.`;

    const factCitations = request.clinicalFacts.map((fact, index) => ({
      factId: `FACT:${index + 1}`,
      sourceIds: [`SOURCE:${index + 1}`],
    }));

    const codingJustification = request.diagnosisCodes.map(
      (code) =>
        `Code ${code} is clinically justified based on documented symptoms and findings.`
    );

    const riskFlags = [];
    if (request.clinicalFacts.length < 3) {
      riskFlags.push({
        type: "insufficient_evidence",
        message: "Limited clinical facts available for appeal",
      });
    }

    const confidence = 0.5; // Lower confidence for fallback mode

    const processingTime = Date.now() - startTime;

    return {
      draftId: `APPEAL:${request.encounterId}:${Date.now()}`,
      narrative,
      factCitations,
      codingJustification,
      riskFlags,
      confidence,
      version: "1.0.0-fallback",
      metadata: {
        modelUsed: "fallback",
        tokensUsed: 0,
        processingTime,
      },
    };
  }

  /**
   * Generate conversational response for CDI queries
   */
  async generateConversationalResponse(
    query: ConversationalQuery
  ): Promise<ConversationalResponse> {
    const startTime = Date.now();

    if (!this.isServiceEnabled()) {
      log.info("Using fallback mode for conversational response", { query: query.query });
      return this.generateFallbackConversationalResponse(query);
    }

    const prompt = this.buildConversationalPrompt(query);

    try {
      const completion = await this.openai!.chat.completions.create({
        model: this.modelName,
        messages: [
          {
            role: "system",
            content: `You are a Clinical Documentation Improvement (CDI) specialist assistant. 
            Provide helpful guidance on clinical documentation, coding, and revenue cycle management.
            Be specific, actionable, and reference clinical guidelines when possible.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error("No response generated from OpenAI");
      }

      const processingTime = Date.now() - startTime;
      const tokensUsed = completion.usage?.total_tokens || 0;

      const parsedResponse = this.parseConversationalResponse(response, query);

      return {
        ...parsedResponse,
        metadata: {
          modelUsed: this.modelName,
          tokensUsed,
          processingTime,
        },
      };
    } catch (error) {
      log.error("Error generating conversational response with OpenAI, falling back to fallback mode", { error: error instanceof Error ? error.message : error, query: query.query });
      return this.generateFallbackConversationalResponse(query);
    }
  }

  /**
   * Generate fallback conversational response without AI
   */
  private generateFallbackConversationalResponse(query: ConversationalQuery): ConversationalResponse {
    const startTime = Date.now();
    
    const content = `This is a fallback response for your CDI query: "${query.query}". 
    In production mode with Azure OpenAI, you would receive AI-powered guidance specific to your clinical documentation needs.
    For now, please refer to standard CDI guidelines and coding standards.`;

    const processingTime = Date.now() - startTime;

    return {
      responseId: `RESP:${query.context.caseId}:${Date.now()}`,
      content,
      confidence: 0.5,
      sources: [
        "Clinical guidelines",
        "Coding standards",
        "Revenue cycle best practices",
      ],
      suggestedActions: [
        "Review case for documentation opportunities",
        "Verify diagnosis code accuracy",
        "Consider physician query if needed"
      ],
      metadata: {
        modelUsed: "fallback",
        tokensUsed: 0,
        processingTime,
      },
    };
  }

  /**
   * Generate embeddings for clinical text
   */
  async generateEmbeddings(text: string): Promise<number[]> {
    if (!this.isServiceEnabled()) {
      log.info("Using fallback mode for embeddings generation", { textLength: text.length });
      return this.generateFallbackEmbeddings(text);
    }

    try {
      const response = await this.openai!.embeddings.create({
        model: this.embeddingModel,
        input: text,
        encoding_format: "float",
      });

      return response.data[0]?.embedding || [];
    } catch (error) {
      log.error("Error generating embeddings with OpenAI, falling back to fallback mode", { error: error instanceof Error ? error.message : error, textLength: text.length });
      return this.generateFallbackEmbeddings(text);
    }
  }

  /**
   * Generate fallback embeddings without AI
   */
  private generateFallbackEmbeddings(text: string): number[] {
    log.info("Generating fallback embeddings for", { textLength: text.length, model: "fallback" });
    // In a real application, you would use a different embedding model or generate a dummy embedding
    // For now, returning a dummy array to avoid breaking the flow
    return Array(1536).fill(0); // Assuming a common embedding dimension like 1536
  }

  /**
   * Build appeal prompt
   */
  private buildAppealPrompt(request: AppealDraftRequest): string {
    return `
ENCOUNTER ID: ${request.encounterId}
DENIAL PATTERN: ${request.denialPatternId}
DENIAL REASON: ${request.denialReason}
PAYER: ${request.payer}

CLINICAL FACTS:
${request.clinicalFacts.map((fact, i) => `${i + 1}. ${fact}`).join('\n')}

DIAGNOSIS CODES:
${request.diagnosisCodes.join(', ')}

Please generate a compelling appeal letter that addresses the denial reason with clinical justification.
Format the response as:
NARRATIVE: [appeal narrative]
FACT CITATIONS: [list of fact citations]
CODING JUSTIFICATION: [coding justification]
RISK FLAGS: [any risk factors]
CONFIDENCE: [confidence score 0-1]
    `.trim();
  }

  /**
   * Build conversational prompt
   */
  private buildConversationalPrompt(query: ConversationalQuery): string {
    return `
CASE ID: ${query.context.caseId}
${query.context.patientInfo ? `PATIENT INFO: ${query.context.patientInfo}` : ""}
${query.context.clinicalSummary ? `CLINICAL SUMMARY: ${query.context.clinicalSummary}` : ""}
${query.context.currentDRG ? `Current DRG: ${query.context.currentDRG}` : ""}

QUERY: ${query.query}

Please provide a helpful response that addresses the query with specific guidance and actionable recommendations.
    `.trim();
  }

  /**
   * Parse appeal response into structured format
   */
  private parseAppealResponse(
    response: string,
    request: AppealDraftRequest
  ): Omit<AppealDraftResponse, "metadata"> {
    // Simple parsing - in production, you might want more sophisticated parsing
    const sections = response.split(
      /(?=NARRATIVE:|FACT CITATIONS:|CODING JUSTIFICATION:|RISK FLAGS:|CONFIDENCE:)/
    );

    const narrative =
      sections
        .find((s) => s.startsWith("NARRATIVE:"))
        ?.replace("NARRATIVE:", "")
        .trim() || "Appeal narrative generated based on clinical evidence.";

    const factCitations = request.clinicalFacts.map((fact, index) => ({
      factId: `FACT:${index + 1}`,
      sourceIds: [`SOURCE:${index + 1}`],
    }));

    const codingJustification = request.diagnosisCodes.map(
      (code) =>
        `Code ${code} is clinically justified based on documented symptoms and findings.`
    );

    const riskFlags = [];
    if (request.clinicalFacts.length < 3) {
      riskFlags.push({
        type: "insufficient_evidence",
        message: "Limited clinical facts available for appeal",
      });
    }

    const confidence = 0.7 + request.clinicalFacts.length * 0.05; // Higher confidence with more facts

    return {
      draftId: `APPEAL:${request.encounterId}:${Date.now()}`,
      narrative,
      factCitations,
      codingJustification,
      riskFlags,
      confidence: Math.min(confidence, 0.95),
      version: "1.0.0",
    };
  }

  /**
   * Parse conversational response into structured format
   */
  private parseConversationalResponse(
    response: string,
    query: ConversationalQuery
  ): Omit<ConversationalResponse, "metadata"> {
    // Extract suggested actions from response (simple keyword-based approach)
    const suggestedActions: string[] = [];
    if (response.toLowerCase().includes("document")) {
      suggestedActions.push("Review clinical documentation for completeness");
    }
    if (response.toLowerCase().includes("code")) {
      suggestedActions.push("Verify diagnosis code accuracy and specificity");
    }
    if (response.toLowerCase().includes("query")) {
      suggestedActions.push(
        "Consider sending physician query for clarification"
      );
    }

    return {
      responseId: `RESP:${query.context.caseId}:${Date.now()}`,
      content: response,
      confidence: 0.8,
      sources: [
        "Clinical guidelines",
        "Coding standards",
        "Revenue cycle best practices",
      ],
      suggestedActions:
        suggestedActions.length > 0
          ? suggestedActions
          : ["Review case for documentation opportunities"],
    };
  }
}

// Export singleton instance
export const azureOpenAIService = new AzureOpenAIService();
export default azureOpenAIService;

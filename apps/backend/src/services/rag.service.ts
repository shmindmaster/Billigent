import { SearchClient, AzureKeyCredential } from '@azure/search-documents';
import { OpenAIClient, AzureKeyCredential as OpenAIKeyCredential } from '@azure/openai';
import { config } from 'dotenv';

config();

export interface RAGConfig {
  searchEndpoint: string;
  searchApiKey: string;
  searchIndexName: string;
  openaiEndpoint: string;
  openaiApiKey: string;
  embeddingModel: string;
  chatModel: string;
}

export interface RAGDocument {
  id: string;
  content: string;
  metadata?: Record<string, any>;
  score?: number;
}

export interface RAGResponse {
  answer: string;
  sources: RAGDocument[];
  confidence: number;
}

export class RAGService {
  private searchClient: SearchClient;
  private openaiClient: OpenAIClient;
  private config: RAGConfig;

  constructor(config?: Partial<RAGConfig>) {
    this.config = {
      searchEndpoint: process.env.AZURE_SEARCH_ENDPOINT || '',
      searchApiKey: process.env.AZURE_SEARCH_API_KEY || '',
      searchIndexName: process.env.AZURE_SEARCH_INDEX_NAME || 'knowledge-base',
      openaiEndpoint: process.env.AZURE_OPENAI_ENDPOINT || '',
      openaiApiKey: process.env.AZURE_OPENAI_API_KEY || '',
      embeddingModel: process.env.AZURE_OPENAI_EMBEDDING_MODEL || 'text-embedding-ada-002',
      chatModel: process.env.AZURE_OPENAI_CHAT_MODEL || 'gpt-4',
      ...config
    };

    this.searchClient = new SearchClient(
      this.config.searchEndpoint,
      this.config.searchIndexName,
      new AzureKeyCredential(this.config.searchApiKey)
    );

    this.openaiClient = new OpenAIClient(
      this.config.openaiEndpoint,
      new OpenAIKeyCredential(this.config.openaiApiKey)
    );
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openaiClient.getEmbeddings(
        this.config.embeddingModel,
        [text]
      );
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }  async searchDocuments(query: string, topK: number = 5): Promise<RAGDocument[]> {
    try {
      const embedding = await this.generateEmbedding(query);
      
      const searchResults = await this.searchClient.search(query, {
        vectorSearchOptions: {
          queries: [{
            kind: 'vector',
            vector: embedding,
            kNearestNeighborsCount: topK,
            fields: ['contentVector']
          }]
        },
        select: ['id', 'content', 'metadata'],
        top: topK
      });

      const documents: RAGDocument[] = [];
      for await (const result of searchResults.results) {
        documents.push({
          id: result.document.id,
          content: result.document.content,
          metadata: result.document.metadata,
          score: result.score
        });
      }

      return documents;
    } catch (error) {
      console.error('Error searching documents:', error);
      return [];
    }
  }

  async generateResponse(query: string, context: RAGDocument[]): Promise<string> {
    try {
      const contextText = context
        .map(doc => `Source: ${doc.content}`)
        .join('\n\n');

      const prompt = `Based on the following context, answer the question: "${query}"

Context:
${contextText}

Answer:`;

      const response = await this.openaiClient.getChatCompletions(
        this.config.chatModel,
        [{ role: 'user', content: prompt }],
        {
          maxTokens: 500,
          temperature: 0.3
        }
      );

      return response.choices[0]?.message?.content || 'Unable to generate response';
    } catch (error) {
      console.error('Error generating response:', error);
      return 'Error generating response';
    }
  }

  async query(question: string, topK: number = 5): Promise<RAGResponse> {
    try {
      const relevantDocs = await this.searchDocuments(question, topK);
      const answer = await this.generateResponse(question, relevantDocs);
      
      const confidence = relevantDocs.length > 0 
        ? Math.min(relevantDocs[0].score || 0, 1.0)
        : 0;

      return {
        answer,
        sources: relevantDocs,
        confidence
      };
    } catch (error) {
      console.error('Error in RAG query:', error);
      return {
        answer: 'I apologize, but I encountered an error while processing your question.',
        sources: [],
        confidence: 0
      };
    }
  }
}

export const ragService = new RAGService();export async function getGroundedIcdResponse(query: string, context?: any): Promise<string> {
  try {
    const icdQuery = `${query}\n\nPlease provide specific ICD-10 codes with descriptions for this medical scenario.`;
    const response = await ragService.query(icdQuery);
    return response.answer;
  } catch (error) {
    console.error('Error getting grounded ICD response:', error);
    return 'Error generating ICD response';
  }
}

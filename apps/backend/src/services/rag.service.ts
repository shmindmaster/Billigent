import { AzureKeyCredential, SearchClient, SearchIndexClient } from '@azure/search-documents';
import { config } from 'dotenv';
import OpenAI from 'openai';

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
  private searchClient: SearchClient<any> | undefined;
  private searchIndexClient: SearchIndexClient | undefined;
  private openaiClient: OpenAI | undefined;
  private config: RAGConfig;
  private disabled = false;

  constructor(config?: Partial<RAGConfig>) {
    this.config = {
      searchEndpoint: process.env.AZURE_SEARCH_ENDPOINT || config?.searchEndpoint || '',
      searchApiKey: process.env.AZURE_SEARCH_API_KEY || config?.searchApiKey || '',
      searchIndexName: process.env.AZURE_SEARCH_INDEX_NAME || 'billigent-clinical-knowledge',
      openaiEndpoint: process.env.AZURE_OPENAI_ENDPOINT || config?.openaiEndpoint || '',
      openaiApiKey: process.env.AZURE_OPENAI_API_KEY || config?.openaiApiKey || '',
      embeddingModel: process.env.AZURE_OPENAI_EMBEDDING_MODEL || 'text-embedding-3-large',
      chatModel: process.env.AZURE_OPENAI_MODEL || 'gpt-5-mini',
      ...config
    };

    // Validate required configuration, but don't crash server if missing
    if (!this.config.searchEndpoint || !this.config.searchApiKey || !this.config.openaiEndpoint || !this.config.openaiApiKey) {
      console.warn('[RAGService] Disabled: missing Azure Search/OpenAI env vars');
      this.disabled = true;
      return;
    }

    const searchCredential = new AzureKeyCredential(this.config.searchApiKey);
    
    this.searchClient = new SearchClient(
      this.config.searchEndpoint,
      this.config.searchIndexName,
      searchCredential
    );

    this.searchIndexClient = new SearchIndexClient(
      this.config.searchEndpoint,
      searchCredential
    );

    // Initialize OpenAI client for Azure
    this.openaiClient = new OpenAI({
      apiKey: this.config.openaiApiKey,
      baseURL: `${this.config.openaiEndpoint}/openai/deployments/${this.config.embeddingModel}`,
      defaultQuery: { 'api-version': '2024-08-01-preview' },
    });
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (this.disabled || !this.openaiClient) throw new Error('RAG disabled');
    try {
      const response = await this.openaiClient.embeddings.create({
        model: this.config.embeddingModel,
        input: text
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  async ensureIndexExists(): Promise<void> {
    if (this.disabled || !this.searchIndexClient) return;
    try {
      // Check if index exists
      await this.searchIndexClient.getIndex(this.config.searchIndexName);
      console.log(`Index ${this.config.searchIndexName} already exists`);
    } catch (error: any) {
      if (error.statusCode === 404) {
        console.log(`Creating index ${this.config.searchIndexName}...`);
        
        // Create the index with vector search configuration
        const indexDefinition = {
          name: this.config.searchIndexName,
          fields: [
            { 
              name: 'id', 
              type: 'Edm.String' as const, 
              key: true, 
              searchable: false, 
              filterable: true 
            },
            { 
              name: 'content', 
              type: 'Edm.String' as const, 
              searchable: true, 
              filterable: false 
            },
            { 
              name: 'contentVector', 
              type: 'Collection(Edm.Single)' as const, 
              searchable: true, 
              vectorSearchDimensions: 1536,
              vectorSearchProfileName: 'default-vector-profile'
            },
            { 
              name: 'category', 
              type: 'Edm.String' as const, 
              searchable: true, 
              filterable: true, 
              facetable: true 
            },
            { 
              name: 'source', 
              type: 'Edm.String' as const, 
              searchable: false, 
              filterable: true 
            },
            { 
              name: 'metadata', 
              type: 'Edm.String' as const, 
              searchable: false, 
              filterable: false 
            }
          ],
          vectorSearch: {
            profiles: [
              {
                name: 'default-vector-profile',
                algorithmConfigurationName: 'default-vector-algorithm'
              }
            ],
            algorithms: [
              {
                name: 'default-vector-algorithm',
                kind: 'hnsw' as const,
                hnswParameters: {
                  metric: 'cosine',
                  m: 4,
                  efConstruction: 400,
                  efSearch: 500
                }
              }
            ]
          }
        };

        await this.searchIndexClient.createIndex(indexDefinition);
        console.log(`Index ${this.config.searchIndexName} created successfully`);
        
        // Wait a bit for index to be ready
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.error('Error checking/creating index:', error);
        throw error;
      }
    }
  }

  async searchDocuments(query: string, topK: number = 5): Promise<RAGDocument[]> {
    try {
      await this.ensureIndexExists();
      
      const embedding = await this.generateEmbedding(query);
      
      if (this.disabled || !this.searchClient) return [];
      const searchResults = await this.searchClient.search(query, {
        vectorSearchOptions: {
          queries: [{
            kind: 'vector',
            vector: embedding,
            kNearestNeighborsCount: topK,
            fields: ['contentVector']
          }]
        },
        select: ['id', 'content', 'metadata', 'category', 'source'],
        top: topK
      });

      const documents: RAGDocument[] = [];
      for await (const result of searchResults.results) {
        documents.push({
          id: result.document.id,
          content: result.document.content,
          metadata: {
            category: result.document.category,
            source: result.document.source,
            ...(result.document.metadata ? JSON.parse(result.document.metadata) : {})
          },
          score: result.score
        });
      }

      return documents;
    } catch (error) {
      console.error('Error searching documents:', error);
      // Return empty array on search failure to allow graceful degradation
      return [];
    }
  }

  async generateResponse(query: string, context: RAGDocument[]): Promise<string> {
    try {
      const contextText = context
        .map(doc => `Source: ${doc.metadata?.source || 'Unknown'}\nCategory: ${doc.metadata?.category || 'General'}\nContent: ${doc.content}`)
        .join('\n\n---\n\n');

      const prompt = `You are a clinical AI assistant specializing in healthcare documentation and coding. Based on the following medical knowledge base context, provide a comprehensive answer to the healthcare question.

Context from Clinical Knowledge Base:
${contextText}

Healthcare Question: "${query}"

Instructions:
1. Provide accurate medical information based only on the provided context
2. If discussing ICD-10 codes, include full code and description
3. For CDI recommendations, be specific about documentation gaps
4. If the context doesn't contain relevant information, clearly state this
5. Always prioritize patient safety and clinical accuracy

Clinical Response:`;

      if (this.disabled || !this.openaiClient) return 'RAG disabled';
      const response = await this.openaiClient.chat.completions.create({
        model: this.config.chatModel,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.2, // Lower temperature for medical accuracy
        top_p: 0.9,
        frequency_penalty: 0,
        presence_penalty: 0
      });

      return response.choices[0]?.message?.content || 'Unable to generate response based on available clinical context';
    } catch (error) {
      console.error('Error generating response:', error);
      return 'Error generating clinical response';
    }
  }

  async query(question: string, topK: number = 5): Promise<RAGResponse> {
    try {
      const relevantDocs = await this.searchDocuments(question, topK);
      const answer = await this.generateResponse(question, relevantDocs);
      
      // Calculate confidence based on document relevance scores
      const confidence = relevantDocs.length > 0 
        ? Math.min((relevantDocs[0].score || 0) * 0.8, 1.0) // Cap at 80% of top score
        : 0;

      return {
        answer,
        sources: relevantDocs,
        confidence
      };
    } catch (error) {
      console.error('Error in RAG query:', error);
      return {
        answer: 'I apologize, but I encountered an error while accessing the clinical knowledge base. Please try again or consult with clinical documentation specialists.',
        sources: [],
        confidence: 0
      };
    }
  }

  async indexDocument(document: {
    id: string;
    content: string;
    category: string;
    source: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    try {
      await this.ensureIndexExists();
      
      const embedding = await this.generateEmbedding(document.content);
      
      const indexDocument = {
        id: document.id,
        content: document.content,
        contentVector: embedding,
        category: document.category,
        source: document.source,
        metadata: JSON.stringify(document.metadata || {})
      };

      await this.searchClient.uploadDocuments([indexDocument]);
      console.log(`Document ${document.id} indexed successfully`);
    } catch (error) {
      console.error('Error indexing document:', error);
      throw error;
    }
  }

  async batchIndexDocuments(documents: Array<{
    id: string;
    content: string;
    category: string;
    source: string;
    metadata?: Record<string, any>;
  }>): Promise<void> {
    try {
      await this.ensureIndexExists();
      
      console.log(`Generating embeddings for ${documents.length} documents...`);
      
      const indexDocuments = await Promise.all(documents.map(async (doc) => {
        const embedding = await this.generateEmbedding(doc.content);
        return {
          id: doc.id,
          content: doc.content,
          contentVector: embedding,
          category: doc.category,
          source: doc.source,
          metadata: JSON.stringify(doc.metadata || {})
        };
      }));

      // Batch upload in chunks of 100 (Azure Search limit)
      const chunkSize = 100;
      for (let i = 0; i < indexDocuments.length; i += chunkSize) {
        const chunk = indexDocuments.slice(i, i + chunkSize);
        await this.searchClient.uploadDocuments(chunk);
        console.log(`Uploaded chunk ${Math.floor(i / chunkSize) + 1}/${Math.ceil(indexDocuments.length / chunkSize)}`);
      }

      console.log(`Successfully indexed ${documents.length} documents`);
    } catch (error) {
      console.error('Error batch indexing documents:', error);
      throw error;
    }
  }
}

export const ragService = new RAGService();

export async function getGroundedIcdResponse(query: string, context?: any): Promise<string> {
  try {
    const icdQuery = `${query}\n\nPlease provide specific ICD-10 codes with descriptions for this medical scenario, including both primary and secondary diagnoses if applicable.`;
    const response = await ragService.query(icdQuery);
    return response.answer;
  } catch (error) {
    console.error('Error getting grounded ICD response:', error);
    return 'Error generating ICD response from clinical knowledge base';
  }
}

export async function getCdiRecommendations(
  clinicalNotes: string, 
  currentDiagnoses: string[], 
  encounter?: any
): Promise<RAGResponse> {
  try {
    const cdiQuery = `
    Clinical Documentation Improvement Review:
    
    Current Clinical Notes: ${clinicalNotes}
    
    Current Diagnoses: ${currentDiagnoses.join(', ')}
    
    ${encounter ? `Encounter Details: ${JSON.stringify(encounter)}` : ''}
    
    Please analyze for:
    1. Missing documentation that could support higher specificity diagnosis codes
    2. Potential secondary diagnoses not currently captured
    3. Clinical indicators that might support different DRG assignments
    4. Queries that should be sent to physicians for clarification
    5. Financial impact of documentation improvements
    `;
    
    return await ragService.query(cdiQuery);
  } catch (error) {
    console.error('Error getting CDI recommendations:', error);
    return {
      answer: 'Error generating CDI recommendations from clinical knowledge base',
      sources: [],
      confidence: 0
    };
  }
}

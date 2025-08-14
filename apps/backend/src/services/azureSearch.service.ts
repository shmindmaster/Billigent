import { SearchClient, AzureKeyCredential } from '@azure/search-documents';
import { DefaultAzureCredential } from '@azure/identity';

export interface SearchDocument {
  id: string;
  content: string;
  metadata: {
    source: string;
    type: string;
    encounterId?: string;
    patientId?: string;
    timestamp: string;
    [key: string]: any;
  };
  vector?: number[];
}

export interface SearchQuery {
  query: string;
  filters?: string;
  vector?: number[];
  top?: number;
  skip?: number;
  select?: string[];
  orderBy?: string[];
}

export interface SearchResult {
  score: number;
  document: SearchDocument;
  highlights?: string[];
  rerankerScore?: number;
}

export interface HybridSearchResult {
  results: SearchResult[];
  totalCount: number;
  searchTime: number;
  queryType: 'keyword' | 'vector' | 'hybrid';
  metadata: {
    modelUsed: string;
    tokensProcessed: number;
  };
}

export interface ClinicalSearchContext {
  encounterId?: string;
  patientId?: string;
  diagnosisCodes?: string[];
  clinicalNotes?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export class AzureSearchService {
  private searchClient: SearchClient;
  private endpoint: string;
  private indexName: string;
  private apiKey?: string;
  private useManagedIdentity: boolean;

  constructor() {
    this.endpoint = process.env.AZURE_SEARCH_ENDPOINT || '';
    this.indexName = process.env.AZURE_SEARCH_INDEX_NAME || 'clinical-documents';
    this.apiKey = process.env.AZURE_SEARCH_API_KEY;
    this.useManagedIdentity = !this.apiKey;

    if (!this.endpoint) {
      throw new Error('Azure Search endpoint not configured. Please set AZURE_SEARCH_ENDPOINT');
    }

    if (!this.apiKey && !this.useManagedIdentity) {
      throw new Error('Azure Search authentication not configured. Please set AZURE_SEARCH_API_KEY or use managed identity');
    }

    if (this.useManagedIdentity) {
      // Use managed identity (requires proper Azure RBAC setup)
      this.searchClient = new SearchClient(
        this.endpoint,
        this.indexName,
        new DefaultAzureCredential()
      );
    } else {
      // Use API key
      this.searchClient = new SearchClient(
        this.endpoint,
        this.indexName,
        new AzureKeyCredential(this.apiKey!)
      );
    }
  }

  /**
   * Perform hybrid search combining vector and keyword search
   */
  async hybridSearch(
    query: SearchQuery,
    context?: ClinicalSearchContext
  ): Promise<HybridSearchResult> {
    const startTime = Date.now();

    try {
      // Build search options
      const searchOptions: any = {
        top: query.top || 10,
        skip: query.skip || 0,
        select: query.select || ['id', 'content', 'metadata'],
        orderBy: query.orderBy || ['@search.score desc'],
        queryType: 'semantic',
        queryLanguage: 'en-us',
        semanticConfiguration: 'default',
        captions: 'extractive',
        answers: 'extractive',
        highlightPreTag: '<mark>',
        highlightPostTag: '</mark>'
      };

      // Add filters if provided
      if (query.filters) {
        searchOptions.filter = query.filters;
      }

      // Add context-based filters
      if (context) {
        const contextFilters = this.buildContextFilters(context);
        if (contextFilters) {
          searchOptions.filter = contextFilters;
        }
      }

      // Build search query
      let searchQuery = query.query;

      // If vector is provided, use vector search
      if (query.vector) {
        searchOptions.vector = {
          value: query.vector,
          k: query.top || 10,
          fields: 'vector'
        };
        searchOptions.queryType = 'full';
      }

      // Perform search
      const searchResults = await this.searchClient.search(searchQuery, searchOptions);

      // Process results
      const results: SearchResult[] = [];
      for await (const result of searchResults.results) {
        results.push({
          score: result.score || 0,
          document: {
            id: result.document.id,
            content: result.document.content,
            metadata: result.document.metadata,
            vector: result.document.vector
          },
          highlights: result.highlights?.['content'] || [],
          rerankerScore: result['@search.rerankerScore']
        });
      }

      const searchTime = Date.now() - startTime;

      return {
        results,
        totalCount: searchResults.count || 0,
        searchTime,
        queryType: query.vector ? 'hybrid' : 'keyword',
        metadata: {
          modelUsed: 'azure-ai-search-hybrid',
          tokensProcessed: query.query.length + (query.vector?.length || 0)
        }
      };

    } catch (error) {
      console.error('Error performing hybrid search:', error);
      throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Search for clinical evidence related to a specific case
   */
  async searchClinicalEvidence(
    query: string,
    context: ClinicalSearchContext
  ): Promise<HybridSearchResult> {
    // Build clinical-specific search query
    const clinicalQuery = this.buildClinicalQuery(query, context);
    
    // Add clinical filters
    const filters = this.buildClinicalFilters(context);
    
    return this.hybridSearch({
      query: clinicalQuery,
      filters,
      top: 20,
      select: ['id', 'content', 'metadata', 'vector']
    });
  }

  /**
   * Search for denial patterns and similar cases
   */
  async searchDenialPatterns(
    denialReason: string,
    diagnosisCodes: string[],
    context?: ClinicalSearchContext
  ): Promise<HybridSearchResult> {
    // Build denial-specific query
    const query = `denial reason: ${denialReason} diagnosis codes: ${diagnosisCodes.join(' ')}`;
    
    // Add denial-specific filters
    const filters = `metadata/type eq 'denial' and metadata/outcome ne 'denied'`;
    
    return this.hybridSearch({
      query,
      filters,
      top: 15,
      select: ['id', 'content', 'metadata', 'vector']
    });
  }

  /**
   * Search for clinical guidelines and regulations
   */
  async searchClinicalGuidelines(
    query: string,
    context?: ClinicalSearchContext
  ): Promise<HybridSearchResult> {
    const filters = `metadata/type eq 'guideline' or metadata/type eq 'regulation'`;
    
    return this.hybridSearch({
      query,
      filters,
      top: 10,
      select: ['id', 'content', 'metadata']
    });
  }

  /**
   * Build context-based filters for clinical search
   */
  private buildContextFilters(context: ClinicalSearchContext): string | undefined {
    const filters: string[] = [];

    if (context.encounterId) {
      filters.push(`metadata/encounterId eq '${context.encounterId}'`);
    }

    if (context.patientId) {
      filters.push(`metadata/patientId eq '${context.patientId}'`);
    }

    if (context.diagnosisCodes && context.diagnosisCodes.length > 0) {
      const codeFilters = context.diagnosisCodes.map(code => 
        `metadata/diagnosisCodes/any(c: c eq '${code}')`
      );
      filters.push(`(${codeFilters.join(' or ')})`);
    }

    if (context.dateRange) {
      filters.push(`metadata/timestamp ge ${context.dateRange.start} and metadata/timestamp le ${context.dateRange.end}`);
    }

    return filters.length > 0 ? filters.join(' and ') : undefined;
  }

  /**
   * Build clinical-specific search query
   */
  private buildClinicalQuery(query: string, context: ClinicalSearchContext): string {
    let clinicalQuery = query;

    // Add context-specific terms
    if (context.diagnosisCodes && context.diagnosisCodes.length > 0) {
      clinicalQuery += ` ${context.diagnosisCodes.join(' ')}`;
    }

    if (context.clinicalNotes) {
      clinicalQuery += ` ${context.clinicalNotes}`;
    }

    // Add clinical terminology boost
    clinicalQuery += ' clinical medical diagnosis treatment symptoms';

    return clinicalQuery;
  }

  /**
   * Build clinical-specific filters
   */
  private buildClinicalFilters(context: ClinicalSearchContext): string | undefined {
    const filters: string[] = [];

    // Filter by document type
    filters.push(`metadata/type in ('clinical_note', 'lab_result', 'imaging_report', 'medication_list', 'procedure_note')`);

    // Add context filters
    const contextFilters = this.buildContextFilters(context);
    if (contextFilters) {
      filters.push(contextFilters);
    }

    return filters.join(' and ');
  }

  /**
   * Index a new document
   */
  async indexDocument(document: SearchDocument): Promise<void> {
    try {
      await this.searchClient.uploadDocuments([document]);
    } catch (error) {
      console.error('Error indexing document:', error);
      throw new Error(`Document indexing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a document by ID
   */
  async deleteDocument(documentId: string): Promise<void> {
    try {
      await this.searchClient.deleteDocuments([{ id: documentId }]);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw new Error(`Document deletion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get document by ID
   */
  async getDocument(documentId: string): Promise<SearchDocument | null> {
    try {
      const result = await this.searchClient.getDocument(documentId);
      return result as SearchDocument;
    } catch (error) {
      console.error('Error retrieving document:', error);
      return null;
    }
  }

  /**
   * Get search index statistics
   */
  async getIndexStats(): Promise<any> {
    try {
      const stats = await this.searchClient.getDocumentCount();
      return {
        documentCount: stats,
        indexName: this.indexName,
        endpoint: this.endpoint
      };
    } catch (error) {
      console.error('Error getting index stats:', error);
      throw new Error(`Failed to get index statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export singleton instance
export const azureSearchService = new AzureSearchService();
export default azureSearchService;

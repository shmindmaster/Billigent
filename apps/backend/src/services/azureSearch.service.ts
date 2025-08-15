// @ts-nocheck
import { SearchClient, AzureKeyCredential } from "@azure/search-documents";
import { DefaultAzureCredential } from "@azure/identity";

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
  queryType: "keyword" | "vector" | "hybrid";
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
  private searchClient: SearchClient | null = null;
  private endpoint: string;
  private indexName: string;
  private apiKey?: string;
  private useManagedIdentity: boolean;
  private isEnabled: boolean = false;

  constructor() {
    this.endpoint = process.env.AZURE_SEARCH_ENDPOINT || "";
    this.indexName =
      process.env.AZURE_SEARCH_INDEX_NAME || "clinical-documents";
    this.apiKey = process.env.AZURE_SEARCH_API_KEY;
    this.useManagedIdentity = !this.apiKey;

    if (!this.endpoint) {
      console.warn("Azure Search endpoint not configured: service will run in fallback mode");
      this.isEnabled = false;
      return;
    }

    if (!this.apiKey && !this.useManagedIdentity) {
      console.warn("Azure Search authentication not configured: service will run in fallback mode");
      this.isEnabled = false;
      return;
    }

    try {
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
      
      this.isEnabled = true;
      console.log("Azure Search service initialized successfully");
    } catch (error) {
      console.warn("Failed to initialize Azure Search service:", error);
      this.isEnabled = false;
    }
  }

  /**
   * Check if the service is enabled
   */
  isServiceEnabled(): boolean {
    return this.isEnabled && this.searchClient !== null;
  }

  /**
   * Perform hybrid search combining vector and keyword search
   */
  async hybridSearch(
    query: SearchQuery,
    context?: ClinicalSearchContext
  ): Promise<HybridSearchResult> {
    const startTime = Date.now();

    if (!this.isServiceEnabled()) {
      console.log("Using fallback mode for search");
      return this.generateFallbackSearchResult(query, context);
    }

    try {
      // Build search options
      const searchOptions: any = {
        top: query.top || 10,
        skip: query.skip || 0,
        select: query.select || ["id", "content", "metadata"],
        orderBy: query.orderBy || ["@search.score desc"],
        queryType: "semantic",
        queryLanguage: "en-us",
        semanticConfiguration: "default",
        captions: "extractive",
        answers: "extractive",
        highlightPreTag: "<mark>",
        highlightPostTag: "</mark>",
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
          fields: "vector",
        };
        searchOptions.queryType = "full";
      }

      // Perform search
      const searchResults = await this.searchClient!.search(
        searchQuery,
        searchOptions
      );

      // Process results
      const results: SearchResult[] = [];
      for await (const result of searchResults.results) {
        results.push({
          score: result.score || 0,
          document: {
            id: result.document.id,
            content: result.document.content,
            metadata: result.document.metadata,
            vector: result.document.vector,
          },
          highlights: result.highlights?.["content"] || [],
        });
      }

      const searchTime = Date.now() - startTime;

      return {
        results,
        totalCount: results.length,
        searchTime,
        queryType: query.vector ? "hybrid" : "keyword",
        metadata: {
          modelUsed: "azure-search",
          tokensProcessed: 0,
        },
      };
    } catch (error) {
      console.error("Error performing search with Azure Search, falling back to fallback mode:", error);
      return this.generateFallbackSearchResult(query, context);
    }
  }

  /**
   * Generate fallback search results without Azure Search
   */
  private generateFallbackSearchResult(
    query: SearchQuery,
    context?: ClinicalSearchContext
  ): HybridSearchResult {
    const startTime = Date.now();
    
    // Generate mock results for development/testing
    const mockResults: SearchResult[] = [
      {
        score: 0.95,
        document: {
          id: "mock-doc-1",
          content: `Fallback search result for query: "${query.query}". This is a mock document for development purposes.`,
          metadata: {
            source: "fallback",
            type: "mock",
            timestamp: new Date().toISOString(),
          },
        },
        highlights: [query.query],
      },
      {
        score: 0.85,
        document: {
          id: "mock-doc-2",
          content: `Additional fallback result for: "${query.query}". In production, this would be a real clinical document.`,
          metadata: {
            source: "fallback",
            type: "mock",
            timestamp: new Date().toISOString(),
          },
        },
        highlights: [query.query],
      },
    ];

    const searchTime = Date.now() - startTime;

    return {
      results: mockResults,
      totalCount: mockResults.length,
      searchTime,
      queryType: "keyword",
      metadata: {
        modelUsed: "fallback",
        tokensProcessed: 0,
      },
    };
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
      select: ["id", "content", "metadata", "vector"],
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
    const query = `denial reason: ${denialReason} diagnosis codes: ${diagnosisCodes.join(
      " "
    )}`;

    // Add denial-specific filters
    const filters = `metadata/type eq 'denial' and metadata/outcome ne 'denied'`;

    return this.hybridSearch({
      query,
      filters,
      top: 15,
      select: ["id", "content", "metadata", "vector"],
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
      select: ["id", "content", "metadata"],
    });
  }

  /**
   * Build context-based filters for clinical search
   */
  private buildContextFilters(
    context: ClinicalSearchContext
  ): string | undefined {
    const filters: string[] = [];

    if (context.encounterId) {
      filters.push(`metadata/encounterId eq '${context.encounterId}'`);
    }

    if (context.patientId) {
      filters.push(`metadata/patientId eq '${context.patientId}'`);
    }

    if (context.diagnosisCodes && context.diagnosisCodes.length > 0) {
      const codeFilters = context.diagnosisCodes.map(
        (code) => `metadata/diagnosisCodes/any(c: c eq '${code}')`
      );
      filters.push(`(${codeFilters.join(" or ")})`);
    }

    if (context.dateRange) {
      filters.push(
        `metadata/timestamp ge ${context.dateRange.start} and metadata/timestamp le ${context.dateRange.end}`
      );
    }

    return filters.length > 0 ? filters.join(" and ") : undefined;
  }

  /**
   * Build clinical-specific search query
   */
  private buildClinicalQuery(
    query: string,
    context: ClinicalSearchContext
  ): string {
    let clinicalQuery = query;

    // Add context-specific terms
    if (context.diagnosisCodes && context.diagnosisCodes.length > 0) {
      clinicalQuery += ` ${context.diagnosisCodes.join(" ")}`;
    }

    if (context.clinicalNotes) {
      clinicalQuery += ` ${context.clinicalNotes}`;
    }

    // Add clinical terminology boost
    clinicalQuery += " clinical medical diagnosis treatment symptoms";

    return clinicalQuery;
  }

  /**
   * Build clinical-specific filters
   */
  private buildClinicalFilters(
    context: ClinicalSearchContext
  ): string | undefined {
    const filters: string[] = [];

    // Filter by document type
    filters.push(
      `metadata/type in ('clinical_note', 'lab_result', 'imaging_report', 'medication_list', 'procedure_note')`
    );

    // Add context filters
    const contextFilters = this.buildContextFilters(context);
    if (contextFilters) {
      filters.push(contextFilters);
    }

    return filters.join(" and ");
  }

  /**
   * Index a document
   */
  async indexDocument(document: SearchDocument): Promise<void> {
    if (!this.isServiceEnabled()) {
      console.log("Using fallback mode for document indexing");
      return;
    }

    try {
      await this.searchClient!.uploadDocuments([document]);
      console.log(`Document indexed successfully: ${document.id}`);
    } catch (error) {
      console.error("Error indexing document:", error);
      throw error;
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(documentId: string): Promise<void> {
    if (!this.isServiceEnabled()) {
      console.log("Using fallback mode for document deletion");
      return;
    }

    try {
      await this.searchClient!.deleteDocuments([{ id: documentId }]);
      console.log(`Document deleted successfully: ${documentId}`);
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  }

  /**
   * Get document by ID
   */
  async getDocument(documentId: string): Promise<SearchDocument | null> {
    if (!this.isServiceEnabled()) {
      console.log("Using fallback mode for document retrieval");
      return null;
    }

    try {
      const result = await this.searchClient!.getDocument(documentId);
      return result as SearchDocument;
    } catch (error) {
      console.error("Error retrieving document:", error);
      return null;
    }
  }

  /**
   * Health check for the service
   */
  async healthCheck(): Promise<{ status: string; endpoint: string; indexName: string }> {
    if (!this.isServiceEnabled()) {
      return {
        status: "fallback",
        endpoint: "not-configured",
        indexName: "not-configured",
      };
    }

    try {
      // Try to get search service statistics
      const stats = await this.searchClient!.getSearchServiceStatistics();
      return {
        status: "healthy",
        endpoint: this.endpoint,
        indexName: this.indexName,
      };
    } catch (error) {
      return {
        status: "unhealthy",
        endpoint: this.endpoint,
        indexName: this.indexName,
      };
    }
  }
}

// Export singleton instance
export const azureSearchService = new AzureSearchService();
export default azureSearchService;

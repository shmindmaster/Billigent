import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export interface CitationAnalytics {
  overview: {
    total: number;
    withIssues: number;
    qualityScore: number;
  };
  authorityDistribution: Record<string, number>;
  categoryDistribution: Record<string, number>;
  qualityMetrics: {
    overallAuthorityScore: number;
    regulatoryComplianceScore: number;
    evidenceDiversityScore: number;
    sourceRecencyScore: number;
    confidenceLevel: 'high' | 'medium' | 'low';
  };
  categoryDetails: Array<{
    category: string;
    count: number;
    authorityTiers: string[];
    percentage: number;
  }>;
}

export interface CitationHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  metrics: {
    totalCitations: number;
    citationsWithIssues: number;
    issuePercentage: number;
    authorityDistribution: Record<string, number>;
    categoryDistribution: Record<string, number>;
  };
  issues: Array<{
    id: string;
    title: string;
    issues: string[];
    category: string;
    authorityTier: string;
  }>;
}

export interface CitationStatistics {
  summary: {
    total: number;
    withIssues: number;
    qualityPercentage: number;
  };
  breakdowns: {
    byAuthorityTier: Record<string, number>;
    byCategory: Record<string, number>;
    byIssueType: Record<string, number>;
    byRecency: {
      last30Days: number;
      last90Days: number;
      lastYear: number;
      older: number;
    };
  };
  metadata: {
    generatedAt: string;
    version: string;
  };
}

class CitationService {
  private api = axios.create({
    baseURL: `${API_BASE_URL}/api/citation-metrics`,
    timeout: 10000,
  });

  /**
   * Get citation system health status
   */
  async getHealth(): Promise<CitationHealth> {
    try {
      const response = await this.api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch citation health:', error);
      throw new Error('Failed to fetch citation system health');
    }
  }

  /**
   * Get comprehensive citation analytics
   */
  async getAnalytics(): Promise<CitationAnalytics> {
    try {
      const response = await this.api.get('/analytics');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch citation analytics:', error);
      throw new Error('Failed to fetch citation analytics');
    }
  }

  /**
   * Get citation statistics
   */
  async getStatistics(): Promise<CitationStatistics> {
    try {
      const response = await this.api.get('/statistics');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch citation statistics:', error);
      throw new Error('Failed to fetch citation statistics');
    }
  }

  /**
   * Get citations with optional filtering
   */
  async getCitations(params?: {
    authorityTier?: string;
    category?: string;
    hasIssues?: boolean;
    limit?: number;
    offset?: number;
  }) {
    try {
      const response = await this.api.get('/citations', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch citations:', error);
      throw new Error('Failed to fetch citations');
    }
  }

  /**
   * Get specific citation by ID
   */
  async getCitation(id: string) {
    try {
      const response = await this.api.get(`/citations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch citation ${id}:`, error);
      throw new Error(`Failed to fetch citation ${id}`);
    }
  }

  /**
   * Analyze citation coverage for sources
   */
  async analyzeCoverage(sources: string[]) {
    try {
      const response = await this.api.post('/coverage', { sources });
      return response.data;
    } catch (error) {
      console.error('Failed to analyze citation coverage:', error);
      throw new Error('Failed to analyze citation coverage');
    }
  }

  /**
   * Analyze evidence bundle quality
   */
  async analyzeEvidenceQuality(evidenceBundle: any) {
    try {
      const response = await this.api.post('/evidence-quality', { evidenceBundle });
      return response.data;
    } catch (error) {
      console.error('Failed to analyze evidence quality:', error);
      throw new Error('Failed to analyze evidence quality');
    }
  }
}

export const citationService = new CitationService();
export default citationService;

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Shield, 
  BookOpen, 
  AlertTriangle,
  ExternalLink,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface CitationAnalytics {
  total: number;
  byAuthorityTier: Record<string, number>;
  byCategory: Record<string, number>;
  withIssues: number;
}

interface QualityMetrics {
  overallAuthorityScore: number;
  regulatoryComplianceScore: number;
  evidenceDiversityScore: number;
  sourceRecencyScore: number;
  confidenceLevel: 'high' | 'medium' | 'low';
}

interface CitationAnalyticsCardProps {
  className?: string;
}

const CitationAnalyticsCard: React.FC<CitationAnalyticsCardProps> = ({ className }) => {
  const [analytics, setAnalytics] = useState<CitationAnalytics | null>(null);
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCitationAnalytics();
  }, []);

  const fetchCitationAnalytics = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would call your backend API
      // For now, we'll use mock data that matches the backend structure
      const mockAnalytics: CitationAnalytics = {
        total: 48,
        byAuthorityTier: {
          regulatory: 15,
          standards: 12,
          primary: 8,
          secondary: 7,
          tertiary: 4,
          competitive: 2
        },
        byCategory: {
          icd_10_cm: 8,
          icd_10_pcs: 4,
          ms_drg: 3,
          hl7_fhir: 6,
          denials_primary: 5,
          azure_ai_search: 4,
          competitive_intelligence: 2,
          hipaa_technical_safeguards: 1,
          cms_cmi: 1,
          claims_operating_rules_denials_context: 1,
          claim_integrity_kpis_hfma: 1,
          revenue_cycle_kpis_hfma_map_keys: 1,
          denials_current_year_gated_summary: 1,
          denials_secondary_commentary: 1,
          claim_integrity_kpis_summary: 1,
          competitive_intelligence_cdi_platform: 1,
          competitive_intelligence_predictive_cdi: 1,
          competitive_intelligence_denials: 1,
          competitive_intelligence_revenue_intelligence: 1,
          competitive_intelligence_appeals_services: 1,
          competitive_intelligence_complex_claims: 1,
          competitive_intelligence_cdi_workflow: 1
        },
        withIssues: 3
      };

      const mockQualityMetrics: QualityMetrics = {
        overallAuthorityScore: 0.78,
        regulatoryComplianceScore: 0.85,
        evidenceDiversityScore: 0.92,
        sourceRecencyScore: 0.88,
        confidenceLevel: 'high'
      };

      setAnalytics(mockAnalytics);
      setQualityMetrics(mockQualityMetrics);
    } catch (err) {
      setError('Failed to fetch citation analytics');
      console.error('Error fetching citation analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAuthorityTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      regulatory: 'bg-red-100 text-red-800 border-red-200',
      standards: 'bg-blue-100 text-blue-800 border-blue-200',
      primary: 'bg-green-100 text-green-800 border-green-200',
      secondary: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      tertiary: 'bg-gray-100 text-gray-800 border-gray-200',
      competitive: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[tier] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getConfidenceColor = (level: string) => {
    const colors: Record<string, string> = {
      high: 'text-green-600',
      medium: 'text-yellow-600',
      low: 'text-red-600'
    };
    return colors[level] || 'text-gray-600';
  };

  const getConfidenceIcon = (level: string) => {
    switch (level) {
      case 'high':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'low':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p>{error}</p>
            <Button 
              onClick={fetchCitationAnalytics} 
              variant="outline" 
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics || !qualityMetrics) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Citation Analytics Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="authority">Authority</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{analytics.total}</div>
                <div className="text-sm text-gray-600">Total Citations</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {((analytics.total - analytics.withIssues) / analytics.total * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Quality Score</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Citations with Issues</span>
                <Badge variant={analytics.withIssues > 0 ? "destructive" : "default"}>
                  {analytics.withIssues}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Confidence</span>
                <div className="flex items-center gap-2">
                  {getConfidenceIcon(qualityMetrics.confidenceLevel)}
                  <span className={`font-medium ${getConfidenceColor(qualityMetrics.confidenceLevel)}`}>
                    {qualityMetrics.confidenceLevel.charAt(0).toUpperCase() + qualityMetrics.confidenceLevel.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="authority" className="space-y-4">
            <div className="space-y-4">
              {Object.entries(analytics.byAuthorityTier).map(([tier, count]) => (
                <div key={tier} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getAuthorityTierColor(tier)}>
                        {tier.charAt(0).toUpperCase() + tier.slice(1)}
                      </Badge>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {((count / analytics.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={(count / analytics.total) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="max-h-64 overflow-y-auto space-y-2">
              {Object.entries(analytics.byCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm font-medium">
                      {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="quality" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Authority Score</span>
                  <span className="text-sm font-medium">
                    {(qualityMetrics.overallAuthorityScore * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={qualityMetrics.overallAuthorityScore * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Regulatory Compliance</span>
                  <span className="text-sm font-medium">
                    {(qualityMetrics.regulatoryComplianceScore * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={qualityMetrics.regulatoryComplianceScore * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Evidence Diversity</span>
                  <span className="text-sm font-medium">
                    {(qualityMetrics.evidenceDiversityScore * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={qualityMetrics.evidenceDiversityScore * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Source Recency</span>
                  <span className="text-sm font-medium">
                    {(qualityMetrics.sourceRecencyScore * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={qualityMetrics.sourceRecencyScore * 100} className="h-2" />
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Quality Insights</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• High regulatory compliance ensures authoritative sources</li>
                <li>• Diverse evidence categories provide comprehensive coverage</li>
                <li>• Recent sources maintain current information accuracy</li>
                <li>• Overall high confidence indicates reliable evidence base</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Last updated: {new Date().toLocaleDateString()}</span>
            <Button variant="outline" size="sm" onClick={fetchCitationAnalytics}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CitationAnalyticsCard;

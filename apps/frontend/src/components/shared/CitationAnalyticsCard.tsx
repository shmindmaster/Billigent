import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
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
import citationService, { CitationAnalytics, CitationHealth } from '../../services/citationService';

interface CitationAnalyticsCardProps {
  className?: string;
}

const CitationAnalyticsCard: React.FC<CitationAnalyticsCardProps> = ({ className }) => {
  const [analytics, setAnalytics] = useState<CitationAnalytics | null>(null);
  const [health, setHealth] = useState<CitationHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCitationData();
  }, []);

  const fetchCitationData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both analytics and health data
      const [analyticsData, healthData] = await Promise.all([
        citationService.getAnalytics(),
        citationService.getHealth()
      ]);
      
      setAnalytics(analyticsData);
      setHealth(healthData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch citation data';
      setError(errorMessage);
      // Replace console.error with proper error handling
      // In a real app, you might want to log to an error reporting service
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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      healthy: 'bg-green-100 text-green-800 border-green-200',
      degraded: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      unhealthy: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
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
              onClick={fetchCitationData} 
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

  if (!analytics || !health) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Citation Analytics Dashboard
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(health.status)}>
            {health.status.charAt(0).toUpperCase() + health.status.slice(1)}
          </Badge>
          <span className="text-sm text-gray-600">
            Last updated: {new Date(health.timestamp).toLocaleTimeString()}
          </span>
        </div>
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
                <div className="text-2xl font-bold text-blue-600">{analytics.overview.total}</div>
                <div className="text-sm text-gray-600">Total Citations</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {analytics.overview.qualityScore.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Quality Score</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Citations with Issues</span>
                <Badge variant={analytics.overview.withIssues > 0 ? "destructive" : "default"}>
                  {analytics.overview.withIssues}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Confidence</span>
                <div className="flex items-center gap-2">
                  {getConfidenceIcon(analytics.qualityMetrics.confidenceLevel)}
                  <span className={`font-medium ${getConfidenceColor(analytics.qualityMetrics.confidenceLevel)}`}>
                    {analytics.qualityMetrics.confidenceLevel.charAt(0).toUpperCase() + analytics.qualityMetrics.confidenceLevel.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="authority" className="space-y-4">
            <div className="space-y-4">
              {Object.entries(analytics.authorityDistribution).map(([tier, count]) => (
                <div key={tier} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getAuthorityTierColor(tier)}>
                        {tier.charAt(0).toUpperCase() + tier.slice(1)}
                      </Badge>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {((count / analytics.overview.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={(count / analytics.overview.total) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="max-h-64 overflow-y-auto space-y-2">
              {analytics.categoryDetails
                .sort((a, b) => b.count - a.count)
                .map((category) => (
                  <div key={category.category} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex-1">
                      <span className="text-sm font-medium">
                        {category.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <div className="flex gap-1 mt-1">
                        {category.authorityTiers.map(tier => (
                          <Badge key={tier} variant="outline" className="text-xs">
                            {tier}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{category.count}</Badge>
                      <div className="text-xs text-gray-600 mt-1">
                        {category.percentage.toFixed(1)}%
                      </div>
                    </div>
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
                    {(analytics.qualityMetrics.overallAuthorityScore * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={analytics.qualityMetrics.overallAuthorityScore * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Regulatory Compliance</span>
                  <span className="text-sm font-medium">
                    {(analytics.qualityMetrics.regulatoryComplianceScore * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={analytics.qualityMetrics.regulatoryComplianceScore * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Evidence Diversity</span>
                  <span className="text-sm font-medium">
                    {(analytics.qualityMetrics.evidenceDiversityScore * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={analytics.qualityMetrics.evidenceDiversityScore * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Source Recency</span>
                  <span className="text-sm font-medium">
                    {(analytics.qualityMetrics.sourceRecencyScore * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={analytics.qualityMetrics.sourceRecencyScore * 100} className="h-2" />
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
            <Button variant="outline" size="sm" onClick={fetchCitationData}>
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

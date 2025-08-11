import { ErrorState, PageLoading } from '@/components/LoadingStates';
import { FilterControls } from '@/components/shared/FilterControls';
import { NaturalLanguageQuery } from '@/components/shared/NaturalLanguageQuery';
import PageHeader from '@/components/shared/PageHeader';
import StatsGrid from '@/components/shared/StatsGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { useAnalyticsData } from '@/hooks/useData';
import { formatCurrency } from '@/lib/utils';
import { ArrowUpRight, BarChart3, Clock, DollarSign, Filter, PieChart, Target, TrendingUp, Users } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Analytics: React.FC = () => {
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(searchParams.get('view') || 'financial');
  const [dateRange, setDateRange] = useState('90');

  // Fetch analytics data using React Query
  const { 
    data: analyticsData, 
    isLoading, 
    error,
    refetch 
  } = useAnalyticsData();

  // Initialize tab from URL parameters
  React.useEffect(() => {
    const view = searchParams.get('view');
    if (view) {
      setActiveTab(view);
    }
  }, [searchParams]);

  // Show page loading state while data loads
  if (isLoading) {
    return <PageLoading title="Analytics" hasCards={true} hasTable={false} />;
  }

  // Show error state if data fails to load
  if (error) {
    return (
      <ErrorState
        title="Analytics Error"
        message={typeof error === 'string' ? error : (error as any)?.message || 'Failed to load analytics data'}
        onRetry={refetch}
        className="m-8"
      />
    );
  }

  // Mock data for interactive charts
  const financialData = {
    revenueByMonth: [
      { month: 'Jan', revenue: 245000, cases: 85 },
      { month: 'Feb', revenue: 289000, cases: 92 },
      { month: 'Mar', revenue: 312000, cases: 98 },
      { month: 'Apr', revenue: 298000, cases: 89 },
      { month: 'May', revenue: 356000, cases: 105 },
      { month: 'Jun', revenue: 334000, cases: 98 }
    ],
    revenueByDepartment: [
      { department: 'Cardiology', revenue: 485000, cases: 145 },
      { department: 'Orthopedics', revenue: 398000, cases: 112 },
      { department: 'Emergency', revenue: 267000, cases: 89 },
      { department: 'Surgery', revenue: 523000, cases: 156 },
      { department: 'Internal Medicine', revenue: 234000, cases: 78 }
    ]
  };

  const operationalData = {
    queryAgreementByPhysician: [
      { physician: 'Dr. Michael Chen', rate: 92, queries: 45 },
      { physician: 'Dr. Lisa Thompson', rate: 87, queries: 38 },
      { physician: 'Dr. Jennifer Wilson', rate: 65, queries: 42 }, // Low performer
      { physician: 'Dr. David Rodriguez', rate: 89, queries: 51 },
      { physician: 'Dr. Patricia Lee', rate: 94, queries: 29 }
    ],
    processingTimeByType: [
      { type: 'CDI Review', avgDays: 2.1, cases: 234 },
      { type: 'Query Response', avgDays: 4.8, cases: 189 },
      { type: 'Appeal Processing', avgDays: 12.3, cases: 67 },
      { type: 'Denial Review', avgDays: 1.9, cases: 145 }
    ]
  };

  const qualityData = {
    denialsByReason: [
      { reason: 'Medical Necessity', count: 45, recovered: 38, rate: 84 },
      { reason: 'Missing Documentation', count: 32, recovered: 29, rate: 91 },
      { reason: 'Coding Errors', count: 28, recovered: 22, rate: 79 },
      { reason: 'Prior Authorization', count: 19, recovered: 16, rate: 84 },
      { reason: 'Duplicate Claims', count: 12, recovered: 11, rate: 92 }
    ]
  };

  // Navigation handlers with drill-down functionality
  const handleRevenueByMonthClick = (month: string) => {
    navigate(`/cases?dateRange=${dateRange}&month=${month}`);
  };

  const handleRevenueByDepartmentClick = (department: string) => {
    navigate(`/cases?dateRange=${dateRange}&department=${department}`);
  };

  const handlePhysicianQueryClick = (physician: string) => {
    navigate(`/cases?dateRange=${dateRange}&physician=${encodeURIComponent(physician)}&type=queries`);
  };

  const handleDenialReasonClick = (reason: string) => {
    navigate(`/cases?dateRange=${dateRange}&denialReason=${encodeURIComponent(reason)}`);
  };

  const handleProcessingTypeClick = (type: string) => {
    navigate(`/cases?dateRange=${dateRange}&processType=${encodeURIComponent(type)}`);
  };

  // use shared formatter

  const tabs = [
    { id: 'financial', label: 'Financial Impact', icon: DollarSign },
    { id: 'operational', label: 'Operational Performance', icon: BarChart3 },
    { id: 'quality', label: 'Quality Metrics', icon: Target }
  ];

  return (
    <div className={`min-h-screen p-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Page Header with Filters */}
        <PageHeader
          title="Reports & Analytics"
          description="Interactive dashboards with drill-down capabilities for actionable insights"
        >
          <FilterControls
            dateRange={{
              value: dateRange,
              options: [
                { value: '30', label: 'Last 30 days' },
                { value: '90', label: 'Last 90 days' },
                { value: '180', label: 'Last 6 months' },
                { value: '365', label: 'Last year' }
              ],
              onChange: setDateRange
            }}
          />
        </PageHeader>

        {/* Natural Language Query */}
        <div className="mb-8">
          <NaturalLanguageQuery />
        </div>

        {/* Dashboard Tabs */}
        <div className={`flex space-x-1 p-1 rounded-lg border ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : theme === 'dark' 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Financial Impact Dashboard */}
      {activeTab === 'financial' && (
        <div className="space-y-8">
          {/* KPI Summary Cards */}
          <StatsGrid 
            stats={[
              {
                label: 'Total Revenue Impact',
                value: analyticsData?.totalRevenue || '$1.9M',
                icon: TrendingUp,
                iconColor: 'text-green-400',
                trend: { value: 12.5, isPositive: true, period: 'vs previous period' }
              },
              {
                label: 'CDI Revenue',
                value: analyticsData?.cdiRevenue || '$1.2M',
                icon: BarChart3,
                iconColor: 'text-blue-400',
                subtitle: '63% of total'
              },
              {
                label: 'Appeal Recovery',
                value: analyticsData?.appealRecovery || '$687K',
                icon: Target,
                iconColor: 'text-purple-400',
                subtitle: '37% of total'
              },
              {
                label: 'Avg Case Value',
                value: analyticsData?.avgCaseValue || '$3,456',
                icon: DollarSign,
                iconColor: 'text-yellow-400',
                trend: { value: 8.2, isPositive: true, period: 'improvement' }
              }
            ]}
            columns={4}
            className="mb-8"
          />

          {/* Interactive Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revenue by Month */}
            <Card className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
              <CardHeader>
                <CardTitle className={`flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Revenue by Month
                </CardTitle>
                <CardDescription className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                  Click any bar to drill down to cases for that month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financialData.revenueByMonth.map((data, index) => (
                    <div key={index} className="flex items-center">
                      <span className={`text-sm w-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>{data.month}</span>
                      <div className="flex-1 mx-4">
                        <div className={`flex items-center justify-between text-xs mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                          <span>{formatCurrency(data.revenue)}</span>
                          <span>{data.cases} cases</span>
                        </div>
                        <div className={`w-full rounded-full h-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          <div 
                            className="bg-gradient-to-r from-green-600 to-green-500 h-4 rounded-full cursor-pointer hover:from-green-500 hover:to-green-400 transition-all duration-200 flex items-center justify-end pr-2" 
                            style={{ width: `${(data.revenue / 400000) * 100}%` }}
                            onClick={() => handleRevenueByMonthClick(data.month)}
                            title={`Click to view ${data.cases} cases from ${data.month}`}
                          >
                            <ArrowUpRight className="w-3 h-3 text-white opacity-0 hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Revenue by Department */}
            <Card className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
              <CardHeader>
                <CardTitle className={`flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  <PieChart className="w-5 h-5 mr-2" />
                  Revenue by Department
                </CardTitle>
                <CardDescription className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                  Click any department to view related cases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financialData.revenueByDepartment.map((data, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors group ${
                        theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleRevenueByDepartmentClick(data.department)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-medium transition-colors ${
                            theme === 'dark' 
                              ? 'text-gray-300 group-hover:text-white' 
                              : 'text-gray-700 group-hover:text-gray-900'
                          }`}>
                            {data.department}
                          </span>
                          <ArrowUpRight className={`w-4 h-4 transition-colors group-hover:text-blue-400 ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-700'
                          }`} />
                        </div>
                        <div className={`flex items-center justify-between text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                          <span className="text-green-400 font-medium">{formatCurrency(data.revenue)}</span>
                          <span>{data.cases} cases</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Operational Performance Dashboard */}
      {activeTab === 'operational' && (
        <div className="space-y-8">
          {/* KPI Summary Cards */}
          <StatsGrid 
            stats={[
              {
                label: 'Query Response Rate',
                value: analyticsData?.queryResponseRate || '87.5%',
                icon: Users,
                iconColor: 'text-blue-400',
                trend: { value: 3.2, isPositive: true, period: 'improvement' }
              },
              {
                label: 'Avg Response Time',
                value: analyticsData?.avgResponseTime || '18.2h',
                icon: Clock,
                iconColor: 'text-green-400',
                subtitle: '-2.1h faster'
              },
              {
                label: 'Cases Processed',
                value: analyticsData?.casesProcessed || '1,247',
                icon: BarChart3,
                iconColor: 'text-purple-400',
                subtitle: 'This period'
              },
              {
                label: 'Productivity Score',
                value: analyticsData?.productivityScore || '94.2',
                icon: Target,
                iconColor: 'text-yellow-400',
                subtitle: 'Excellent'
              }
            ]}
            columns={4}
            className="mb-8"
          />

          {/* Interactive Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Query Agreement Rate by Physician */}
            <Card className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
              <CardHeader>
                <CardTitle className={`flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  <Users className="w-5 h-5 mr-2" />
                  Query Agreement Rate by Physician
                </CardTitle>
                <CardDescription className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                  Click any physician to review their specific cases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {operationalData.queryAgreementByPhysician.map((data, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors group ${
                        theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handlePhysicianQueryClick(data.physician)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-medium transition-colors ${
                            theme === 'dark' 
                              ? 'text-gray-300 group-hover:text-white' 
                              : 'text-gray-700 group-hover:text-gray-900'
                          }`}>
                            {data.physician}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-bold ${
                              data.rate >= 85 ? 'text-green-400' : 
                              data.rate >= 75 ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              {data.rate}%
                            </span>
                            <ArrowUpRight className={`w-4 h-4 transition-colors group-hover:text-blue-400 ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-700'
                            }`} />
                          </div>
                        </div>
                        <div className={`w-full rounded-full h-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          <div 
                            className={`h-2 rounded-full ${
                              data.rate >= 85 ? 'bg-green-500' : 
                              data.rate >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${data.rate}%` }}
                          />
                        </div>
                        <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-700'}`}>{data.queries} queries sent</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Processing Time by Type */}
            <Card className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
              <CardHeader>
                <CardTitle className={`flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  <Clock className="w-5 h-5 mr-2" />
                  Processing Time by Type
                </CardTitle>
                <CardDescription className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                  Click any process type to view related cases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {operationalData.processingTimeByType.map((data, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors group ${
                        theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleProcessingTypeClick(data.type)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-medium transition-colors ${
                            theme === 'dark' 
                              ? 'text-gray-300 group-hover:text-white' 
                              : 'text-gray-700 group-hover:text-gray-900'
                          }`}>
                            {data.type}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-blue-400">
                              {data.avgDays} days
                            </span>
                            <ArrowUpRight className={`w-4 h-4 transition-colors group-hover:text-blue-400 ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-700'
                            }`} />
                          </div>
                        </div>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-700'}`}>{data.cases} cases processed</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Quality Metrics Dashboard */}
      {activeTab === 'quality' && (
        <div className="space-y-8">
          {/* KPI Summary Cards */}
          <StatsGrid 
            stats={[
              {
                label: 'Overall Success Rate',
                value: analyticsData?.overallSuccessRate || '86.2%',
                icon: Target,
                iconColor: 'text-green-400',
                trend: { value: 4.1, isPositive: true, period: 'improvement' }
              },
              {
                label: 'Total Denials',
                value: analyticsData?.totalDenials || '136',
                icon: BarChart3,
                iconColor: 'text-red-400',
                subtitle: 'This period'
              },
              {
                label: 'Appeals Won',
                value: analyticsData?.appealsWon || '116',
                icon: TrendingUp,
                iconColor: 'text-blue-400',
                subtitle: '85.3% success'
              },
              {
                label: 'Avg Appeal Time',
                value: analyticsData?.avgAppealTime || '12.4d',
                icon: Clock,
                iconColor: 'text-purple-400',
                subtitle: '-1.2d faster'
              }
            ]}
            columns={4}
            className="mb-8"
          />

          {/* Denials by Reason Chart */}
          <Card className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader>
              <CardTitle className={`flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <BarChart3 className="w-5 h-5 mr-2" />
                Denials by Reason & Recovery Rate
              </CardTitle>
                <CardDescription className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                Click any denial reason to view specific cases and appeals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qualityData.denialsByReason.map((data, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors group ${
                      theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleDenialReasonClick(data.reason)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-sm font-medium transition-colors ${
                          theme === 'dark' 
                            ? 'text-gray-300 group-hover:text-white' 
                            : 'text-gray-700 group-hover:text-gray-900'
                        }`}>
                          {data.reason}
                        </span>
                        <div className="flex items-center space-x-4">
                          <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>{data.count} denials</span>
                          <span className="text-xs text-green-400">{data.recovered} recovered</span>
                          <span className={`text-sm font-bold ${
                            data.rate >= 85 ? 'text-green-400' : 
                            data.rate >= 75 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {data.rate}%
                          </span>
                          <ArrowUpRight className={`w-4 h-4 transition-colors group-hover:text-blue-400 ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-700'
                          }`} />
                        </div>
                      </div>
                      <div className={`w-full rounded-full h-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div 
                          className={`h-3 rounded-full ${
                            data.rate >= 85 ? 'bg-gradient-to-r from-green-600 to-green-500' : 
                            data.rate >= 75 ? 'bg-gradient-to-r from-yellow-600 to-yellow-500' : 
                            'bg-gradient-to-r from-red-600 to-red-500'
                          }`}
                          style={{ width: `${data.rate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions Footer */}
      <Card className={`mt-8 ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardHeader>
          <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Quick Actions</CardTitle>
          <CardDescription className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
            Generate reports or navigate to detailed case management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => navigate('/cases')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
            >
              <Filter className="w-5 h-5 mr-2" />
              View All Cases
            </Button>
            <Button 
              onClick={() => alert('Monthly report generated and downloaded!')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Export Report
            </Button>
            <Button 
              onClick={() => navigate('/cases?priority=high')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              <Target className="w-5 h-5 mr-2" />
              High Priority Cases
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
import { ErrorState, PageLoading } from '@/components/LoadingStates';
import { FilterControls } from '@/components/shared/FilterControls';
import PageHeader from '@/components/shared/PageHeader';
import StatsGrid from '@/components/shared/StatsGrid';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCases, useDashboardStats } from '@/hooks/useData';
import { formatCurrency } from '@/lib/utils';
// Display uses backend case shape; no custom type import
import { AlertTriangle, CheckCircle, Clock, FileText, XCircle } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [dateRange, setDateRange] = useState('30');
  const { user } = useAuth();

  // Fetch dashboard data using React Query
  const { 
    data: dashboardStats, 
    isLoading: statsLoading, 
    error: statsError,
    refetch: refetchStats 
  } = useDashboardStats();

  const {
    data: casesResp,
    isLoading: casesLoading,
    error: casesError
  } = useCases();
  const allCases = casesResp?.cases || [];

  // Show page loading state while data loads
  if (statsLoading || casesLoading) {
    return <PageLoading title="Dashboard" hasCards={true} hasTable={false} />;
  }

  // Show error state if data fails to load
  if (statsError || casesError) {
    return (
      <ErrorState
        title="Dashboard Error"
        message={String(statsError || casesError || 'Failed to load dashboard data')}
        onRetry={() => {
          refetchStats();
          window.location.reload();
        }}
        className="m-8"
      />
    );
  }

  // Current user info (this would come from auth context in real app)
  const currentUser = { name: user.fullName, role: user.role };

  // Use real data from dashboard stats or provide calculated defaults
  const kpiData = {
    netRevenueIdentified: Number(dashboardStats?.financialImpact?.totalPotential || 0),
    revenueChange: 0, // not calculated yet
    appealOverturnRate: 0, // not calculated yet
    overturnChange: 0,
    queryAgreementRate: 0,
    agreementChange: 0,
    avgProcessingTime: 0,
    timeChange: 0
  };

  // Calculate actionable work queue data from real cases
  const workQueueData = {
    newPreBillCases: 0, // not available in current type
    denialsAwaitingReview: allCases?.filter((c: any) => 
      c.status === 'review'
    ).length || 0,
    overdueQueries: allCases?.filter((c: any) => {
      const opened = c.createdAt ? new Date(c.createdAt).getTime() : Date.now();
      const daysOpen = Math.floor((Date.now() - opened) / (1000 * 60 * 60 * 24));
      return daysOpen > 7;
    }).length || 0,
    pendingAppeals: 0,
    highPriorityCases: allCases?.filter((c: any) => 
      c.priority === 'high'
    ).length || 0
  };

  // use shared currency formatter

  const _formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value}%`;
  };

  // Navigation handlers with pre-applied filters
  const handleNewPreBillCases = () => {
    navigate('/cases?status=new');
  };

  const handleDenialsAwaitingReview = () => {
    navigate('/cases?status=under_review');
  };

  const handleOverdueQueries = () => {
    navigate('/cases?overdue=true');
  };

  const handlePendingAppeals = () => {
    navigate('/cases?status=queried');
  };

  const handleHighPriorityCases = () => {
    navigate('/cases?priority=high');
  };

  const _handleRevenueAnalytics = () => {
    navigate('/analytics?view=revenue');
  };

  const _handleAppealAnalytics = () => {
    navigate('/analytics?view=appeals');
  };

  const _handleQueryAnalytics = () => {
    navigate('/analytics?view=queries');
  };

  return (
    <div className={`min-h-screen p-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
      {/* Page Header */}
      <PageHeader
        title={`Welcome, ${currentUser.name}`}
        description={`${currentUser.role} • ${new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}`}
      >
        <FilterControls
          dateRange={{
            value: dateRange,
            options: [
              { value: '7', label: 'Last 7 days' },
              { value: '30', label: 'Last 30 days' },
              { value: '90', label: 'Last 90 days' },
              { value: '365', label: 'Last year' }
            ],
            onChange: setDateRange
          }}
        />
      </PageHeader>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Large KPI Cards */}
        <div className="lg:col-span-2 space-y-6">
          <StatsGrid 
            stats={[
              {
                label: 'Net Revenue Identified',
                value: formatCurrency(kpiData.netRevenueIdentified),
                change: kpiData.revenueChange !== 0 ? {
                  value: Math.abs(kpiData.revenueChange),
                  trend: kpiData.revenueChange > 0 ? 'up' : (kpiData.revenueChange < 0 ? 'down' : 'neutral')
                } : undefined
              },
              {
                label: 'Appeal Overturn Rate',
                value: `${kpiData.appealOverturnRate}%`,
                change: kpiData.overturnChange !== 0 ? {
                  value: Math.abs(kpiData.overturnChange),
                  trend: kpiData.overturnChange > 0 ? 'up' : (kpiData.overturnChange < 0 ? 'down' : 'neutral')
                } : undefined
              },
              {
                label: 'Query Agreement Rate',
                value: `${kpiData.queryAgreementRate}%`,
                change: kpiData.agreementChange !== 0 ? {
                  value: Math.abs(kpiData.agreementChange),
                  trend: kpiData.agreementChange > 0 ? 'up' : (kpiData.agreementChange < 0 ? 'down' : 'neutral')
                } : undefined
              },
              {
                label: 'Avg Processing Time',
                value: `${kpiData.avgProcessingTime} days`,
                change: kpiData.timeChange !== 0 ? {
                  value: Math.abs(kpiData.timeChange),
                  trend: kpiData.timeChange < 0 ? 'up' : (kpiData.timeChange > 0 ? 'down' : 'neutral')
                } : undefined
              }
            ]}
          />
        </div>

        {/* Right Column - Actionable Work Queue */}
        <div className="space-y-4">
          <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Your Work Queue</h2>
          
          {/* New Pre-Bill Cases */}
          <Card 
            className={`hover:border-blue-500 transition-all duration-200 cursor-pointer group ${
              theme === 'dark' 
                ? 'bg-gray-900 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
            onClick={handleNewPreBillCases}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-600 bg-opacity-20 rounded-lg flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>New Pre-Bill Cases</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Requires CDI review</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-blue-400">{workQueueData.newPreBillCases}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Denials Awaiting Review */}
          <Card 
            className={`hover:border-red-500 transition-all duration-200 cursor-pointer group ${
              theme === 'dark' 
                ? 'bg-gray-900 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
            onClick={handleDenialsAwaitingReview}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-red-600 bg-opacity-20 rounded-lg flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                    <XCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Denials Awaiting Review</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Need appeal action</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-red-400">{workQueueData.denialsAwaitingReview}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* High Priority Cases */}
          <Card 
            className={`hover:border-orange-500 transition-all duration-200 cursor-pointer group ${
              theme === 'dark' 
                ? 'bg-gray-900 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
            onClick={handleHighPriorityCases}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-orange-600 bg-opacity-20 rounded-lg flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>High Priority Cases</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Urgent attention needed</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-orange-400">{workQueueData.highPriorityCases}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overdue Queries */}
          <Card 
            className={`hover:border-yellow-500 transition-all duration-200 cursor-pointer group ${
              theme === 'dark' 
                ? 'bg-gray-900 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
            onClick={handleOverdueQueries}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-yellow-600 bg-opacity-20 rounded-lg flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                    <Clock className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Overdue Queries</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Past due date</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-yellow-400">{workQueueData.overdueQueries}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Appeals */}
          <Card 
            className={`hover:border-purple-500 transition-all duration-200 cursor-pointer group ${
              theme === 'dark' 
                ? 'bg-gray-900 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
            onClick={handlePendingAppeals}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-600 bg-opacity-20 rounded-lg flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                    <CheckCircle className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Pending Appeals</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Awaiting response</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-purple-400">{workQueueData.pendingAppeals}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Status Bar */}
        <div className={`mt-12 pt-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`flex items-center justify-between text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>AI Engine: {dashboardStats ? 'Configured' : 'Unavailable'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>EHR Integration: Not Connected</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>Data Sync: Manual</span>
              </div>
            </div>
            <div>
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
    </div>
  );
};

export default Dashboard;
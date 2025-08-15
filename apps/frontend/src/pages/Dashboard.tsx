import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, DollarSign, FileText, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  // Default user for display purposes
  const user = {
    fullName: 'System User',
    email: 'system@billigent.com'
  };

  const stats = [
    {
      title: 'Total Cases',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: FileText,
    },
    {
      title: 'Active Denials',
      value: '89',
      change: '-5%',
      changeType: 'negative',
      icon: Clock,
    },
    {
      title: 'Revenue Collected',
      value: '$2.4M',
      change: '+8%',
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      title: 'Appeal Success Rate',
      value: '87%',
      change: '+3%',
      changeType: 'positive',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user.fullName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Here's what's happening with your revenue cycle today.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Last updated</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <p className={`text-xs ${
                stat.changeType === 'positive' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    New denial received for Case #12345
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    2 minutes ago
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Appeal approved for Case #12340
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    15 minutes ago
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    CDI query sent to Dr. Smith
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    1 hour ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="font-medium text-gray-900 dark:text-white">
                  Review New Denials
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  5 cases require attention
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="font-medium text-gray-900 dark:text-white">
                  Generate Appeals
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  3 denials ready for appeal
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="font-medium text-gray-900 dark:text-white">
                  CDI Review
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  12 cases pending review
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
import { LucideIcon } from 'lucide-react';

interface StatItem {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
}

interface StatsGridProps {
  stats: StatItem[];
  columns?: number;
  className?: string;
}

export default function StatsGrid({ stats, columns = 4, className }: StatsGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';

  return (
    <div className={`grid ${gridCols} gap-4 mb-6 ${className || ''}`}>
      {stats.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</h3>
            {stat.icon && (
              <stat.icon className={`w-5 h-5 ${stat.iconColor || 'text-gray-400'}`} />
            )}
          </div>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{stat.value}</p>
          {stat.subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.subtitle}</p>
          )}
          {stat.trend && (
            <p className={`text-sm mt-1 flex items-center ${
              stat.trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              <span className="mr-1">{stat.trend.isPositive ? '↗' : '↘'}</span>
              {stat.trend.value > 0 ? '+' : ''}{stat.trend.value}% {stat.trend.period}
            </p>
          )}
          {stat.change && (
            <p className={`text-sm mt-1 ${
              stat.change.trend === 'up' ? 'text-green-600 dark:text-green-400' : 
              stat.change.trend === 'down' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
            }`}>
              {stat.change.value > 0 ? '+' : ''}{stat.change.value}%
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
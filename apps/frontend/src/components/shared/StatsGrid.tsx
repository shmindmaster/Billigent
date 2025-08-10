import React from 'react';

interface StatItem {
  label: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
}

interface StatsGridProps {
  stats: StatItem[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600">{stat.label}</h3>
          <p className="text-2xl font-bold mt-1">{stat.value}</p>
          {stat.change && (
            <p className={`text-sm mt-1 ${
              stat.change.trend === 'up' ? 'text-green-600' : 
              stat.change.trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {stat.change.value > 0 ? '+' : ''}{stat.change.value}%
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
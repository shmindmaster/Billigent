import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/contexts/ThemeContext';
import { Calendar, Filter, Search, X } from 'lucide-react';
import React from 'react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterControlsProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  
  filters?: {
    key: string;
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
  }[];
  
  dateRange?: {
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
  };
  
  actions?: React.ReactNode;
  onClearFilters?: () => void;
  className?: string;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = [],
  dateRange,
  actions,
  onClearFilters,
  className = ''
}) => {
  const { theme } = useTheme();

  const inputClass = theme === 'dark' 
    ? 'bg-gray-900 border-gray-700 text-white' 
    : 'bg-white border-gray-300 text-gray-900';

  const selectClass = theme === 'dark'
    ? 'bg-gray-900 border-gray-700 text-white'
    : 'bg-white border-gray-300 text-gray-900';

  const hasActiveFilters = searchValue || 
    filters.some(f => f.value !== 'all' && f.value !== '') ||
    (dateRange && dateRange.value !== 'all');

  return (
    <Card className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} ${className}`}>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
          {/* Search */}
          {onSearchChange && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`pl-10 ${inputClass}`}
              />
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap gap-3 lg:flex-1">
            {filters.map((filter) => {
              const selectId = `filter-${filter.key}`;
              return (
                <div key={filter.key} className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  <label
                    htmlFor={selectId}
                    className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {filter.label}
                  </label>
                  <select
                    id={selectId}
                    aria-label={filter.label}
                    value={filter.value}
                    onChange={(e) => filter.onChange(e.target.value)}
                    className={`border rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 ${selectClass}`}
                  >
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}

            {/* Date Range */}
            {dateRange && (() => {
              const dateRangeId = 'filter-date-range';
              return (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  <label
                    htmlFor={dateRangeId}
                    className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Date Range
                  </label>
                  <select
                    id={dateRangeId}
                    aria-label="Date Range"
                    value={dateRange.value}
                    onChange={(e) => dateRange.onChange(e.target.value)}
                    className={`border rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 ${selectClass}`}
                  >
                    {dateRange.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })()}
          </div>

          {/* Actions and Clear */}
          <div className="flex items-center gap-3">
            {actions}
            
            {hasActiveFilters && onClearFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

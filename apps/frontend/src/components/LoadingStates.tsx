/**
 * Loading and error state components for React Query integration
 */

import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingState({ 
  message = 'Loading...', 
  size = 'md', 
  className = '' 
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
        <span className="text-muted-foreground">{message}</span>
      </div>
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ 
  title = 'Error',
  message, 
  onRetry,
  className = '' 
}: ErrorStateProps) {
  return (
    <div className={`p-4 ${className}`}>
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <div>
            <strong>{title}:</strong> {message}
          </div>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="ml-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ 
  title, 
  description, 
  action,
  className = '' 
}: EmptyStateProps) {
  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md">
            {description}
          </p>
          {action && (
            <Button onClick={action.onClick} variant="outline">
              {action.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface DataTableLoadingProps {
  rows?: number;
  columns?: number;
}

export function DataTableLoading({ rows = 5, columns = 4 }: DataTableLoadingProps) {
  return (
    <div className="space-y-3">
      {/* Header skeleton */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="flex-1 h-4 bg-muted rounded animate-pulse" />
        ))}
      </div>
      
      {/* Row skeletons */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div 
              key={colIndex} 
              className="flex-1 h-6 bg-muted rounded animate-pulse opacity-75" 
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface PageLoadingProps {
  title: string;
  hasCards?: boolean;
  hasTable?: boolean;
}

export function PageLoading({ hasCards = false, hasTable = false }: PageLoadingProps) {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        <div className="h-4 w-96 bg-muted rounded animate-pulse" />
      </div>

      {/* Cards skeleton */}
      {hasCards && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-2">
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                <div className="h-3 w-24 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Table skeleton */}
      {hasTable && (
        <Card>
          <CardContent className="p-6">
            <DataTableLoading rows={8} columns={6} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface QueryErrorBoundaryProps {
  error: Error;
  reset: () => void;
  children?: React.ReactNode;
}

export function QueryErrorBoundary({ error, reset }: QueryErrorBoundaryProps) {
  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">Something went wrong</h3>
            <p className="text-sm text-muted-foreground mt-2">
              {error.message || 'An unexpected error occurred while loading data.'}
            </p>
          </div>
          <div className="space-y-2">
            <Button onClick={reset} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()} 
              className="w-full"
            >
              Reload Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

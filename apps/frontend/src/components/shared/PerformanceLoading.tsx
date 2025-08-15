import React, { useState, useEffect, useCallback } from 'react';

interface PerformanceLoadingProps {
  timeout?: number; // Timeout in milliseconds
  onTimeout?: () => void;
  showProgress?: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'bars' | 'pulse';
}

const PerformanceLoading: React.FC<PerformanceLoadingProps> = ({
  timeout = 30000, // 30 seconds default
  onTimeout,
  showProgress = true,
  message = 'Loading...',
  size = 'md',
  variant = 'spinner'
}) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimedOut, setIsTimedOut] = useState(false);

  // Size classes
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  // Progress calculation
  const progress = Math.min((timeElapsed / timeout) * 100, 100);

  // Timeout handling
  useEffect(() => {
    if (timeout <= 0) return;

    const interval = setInterval(() => {
      setTimeElapsed(prev => {
        const newTime = prev + 100;
        if (newTime >= timeout && !isTimedOut) {
          setIsTimedOut(true);
          onTimeout?.();
        }
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [timeout, onTimeout, isTimedOut]);

  // Reset timer when component unmounts or props change
  useEffect(() => {
    setTimeElapsed(0);
    setIsTimedOut(false);
  }, [timeout]);

  // Render different loading variants
  const renderLoadingVariant = useCallback(() => {
    const baseClasses = `animate-spin ${sizeClasses[size]}`;
    
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className={`bg-blue-600 rounded-full ${sizeClasses[size].split(' ')[0]} animate-pulse`}
                style={{
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        );
      
      case 'bars':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className="bg-blue-600 rounded animate-pulse"
                style={{
                  width: '4px',
                  height: size === 'sm' ? '16px' : size === 'md' ? '24px' : '32px',
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        );
      
      case 'pulse':
        return (
          <div className={`bg-blue-600 rounded-full ${sizeClasses[size]} animate-pulse`} />
        );
      
      default: // spinner
        return (
          <svg
            className={baseClasses}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );
    }
  }, [variant, size, sizeClasses]);

  if (isTimedOut) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 mx-auto mb-4 text-red-500">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Loading Timeout
        </h3>
        <p className="text-sm text-gray-500 text-center mb-4">
          The operation is taking longer than expected. This might indicate a performance issue.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="text-blue-600 mb-4">
        {renderLoadingVariant()}
      </div>
      
      <div className="text-center">
        <p className="text-sm font-medium text-gray-900 mb-2">
          {message}
        </p>
        
        {showProgress && timeout > 0 && (
          <div className="w-48 bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        
        {showProgress && timeout > 0 && (
          <p className="text-xs text-gray-500">
            {Math.ceil(timeElapsed / 1000)}s / {Math.ceil(timeout / 1000)}s
          </p>
        )}
      </div>
    </div>
  );
};

export default PerformanceLoading;

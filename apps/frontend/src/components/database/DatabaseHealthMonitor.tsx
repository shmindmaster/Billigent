import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useDatabaseMonitoring, useInitializeAllDatabases } from '@/hooks/useDatabase';
import {
  Database,
  Server,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Activity,
  Clock,
  Zap
} from 'lucide-react';

interface DatabaseHealthMonitorProps {
  showDetails?: boolean;
  onInitialize?: () => void;
}

export const DatabaseHealthMonitor: React.FC<DatabaseHealthMonitorProps> = ({
  showDetails = true,
  onInitialize
}) => {
  const { theme } = useTheme();
  const [showFullDetails, setShowFullDetails] = useState(false);
  
  const { health, connectionStatus, isHealthy, isDegraded, isUnhealthy, hasSQL, hasCosmos, overallStatus } = useDatabaseMonitoring();
  const initializeAllDatabases = useInitializeAllDatabases();

  const handleInitialize = async () => {
    try {
      await initializeAllDatabases.mutateAsync();
      if (onInitialize) {
        onInitialize();
      }
    } catch (error) {
      // Replace console.error with proper error handling
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      // In a real app, you might want to show a toast notification or log to an error service
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'unhealthy':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unhealthy':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOverallStatusColor = () => {
    if (isHealthy) return 'bg-green-100 text-green-800 border-green-200';
    if (isDegraded) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (isUnhealthy) return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <Card className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database className="w-6 h-6 text-blue-500" />
            <div>
              <CardTitle className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Database Health Monitor
              </CardTitle>
              <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Azure SQL Database & Cosmos DB status monitoring
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`${getOverallStatusColor()}`}>
              {getStatusIcon(overallStatus)}
              <span className="ml-1 capitalize">{overallStatus}</span>
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFullDetails(!showFullDetails)}
              className="hidden sm:flex"
            >
              {showFullDetails ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Overall Status Summary */}
        <div className={`p-4 rounded-lg border ${getOverallStatusColor()}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span className="font-medium">Overall Status</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">
                {isHealthy && 'All services operational'}
                {isDegraded && 'Some services degraded'}
                {isUnhealthy && 'Critical service issues'}
                {!isHealthy && !isDegraded && !isUnhealthy && 'Status unknown'}
              </span>
            </div>
          </div>
        </div>

        {/* Service Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Azure SQL Database Status */}
          <div className={`p-4 rounded-lg border ${
            hasSQL ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Server className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Azure SQL Database</span>
              </div>
              <Badge variant={hasSQL ? "default" : "destructive"}>
                {hasSQL ? 'Healthy' : 'Unhealthy'}
              </Badge>
            </div>
            
            {showDetails && health?.services?.sql && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Server:</span>
                  <span className="font-mono">{health.services.sql.server}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Database:</span>
                  <span className="font-mono">{health.services.sql.database}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Time:</span>
                  <span className="font-mono">{health.services.sql.connectionTime}ms</span>
                </div>
              </div>
            )}
          </div>

          {/* Azure Cosmos DB Status */}
          <div className={`p-4 rounded-lg border ${
            hasCosmos ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-purple-500" />
                <span className="font-medium">Azure Cosmos DB</span>
              </div>
              <Badge variant={hasCosmos ? "default" : "destructive"}>
                {hasCosmos ? 'Healthy' : 'Unhealthy'}
              </Badge>
            </div>
            
            {showDetails && health?.services?.cosmos && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Database:</span>
                  <span className="font-mono">{health.services.cosmos.database}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Containers:</span>
                  <span className="font-mono">{health.services.cosmos.containers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Time:</span>
                  <span className="font-mono">{health.services.cosmos.connectionTime}ms</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Health Information */}
        {showFullDetails && health && (
          <div className="space-y-4">
            <div className="border-t pt-4">
              <h4 className={`text-sm font-medium mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Detailed Health Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* SQL Database Details */}
                <div className={`p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <h5 className="font-medium mb-2">SQL Database Details</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={hasSQL ? 'text-green-600' : 'text-red-600'}>
                        {health.services.sql.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Server:</span>
                      <span className="font-mono text-xs">{health.services.sql.server}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Database:</span>
                      <span className="font-mono text-xs">{health.services.sql.database}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Response Time:</span>
                      <span className="font-mono text-xs">{health.services.sql.connectionTime}ms</span>
                    </div>
                  </div>
                </div>

                {/* Cosmos DB Details */}
                <div className={`p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <h5 className="font-medium mb-2">Cosmos DB Details</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={hasCosmos ? 'text-green-600' : 'text-red-600'}>
                        {health.services.cosmos.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Database:</span>
                      <span className="font-mono text-xs">{health.services.cosmos.database}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Containers:</span>
                      <span className="font-mono text-xs">{health.services.cosmos.containers.join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Response Time:</span>
                      <span className="font-mono text-xs">{health.services.cosmos.connectionTime}ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Last Updated */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Last updated: {new Date(health.timestamp).toLocaleTimeString()}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleInitialize}
                disabled={initializeAllDatabases.isPending}
                className="flex items-center space-x-2"
              >
                {initializeAllDatabases.isPending ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                <span>Initialize</span>
              </Button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFullDetails(!showFullDetails)}
            className="sm:hidden flex-1"
          >
            {showFullDetails ? 'Hide Details' : 'Show Details'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleInitialize}
            disabled={initializeAllDatabases.isPending}
            className="flex-1"
          >
            {initializeAllDatabases.isPending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Initializing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Initialize Services
              </>
            )}
          </Button>
        </div>

        {/* Status Footer */}
        <div className={`text-xs p-2 rounded ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          <div className="flex items-center space-x-2">
            <Activity className="w-3 h-3 text-green-500" />
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Real-time monitoring • Auto-refresh enabled • Health checks active
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

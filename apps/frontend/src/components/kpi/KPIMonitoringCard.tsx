import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/contexts/ThemeContext';
import { useKPIMonitoring, useKPIRuleEvaluation } from '@/hooks/useEvidence';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Play, 
  Stop, 
  TrendingUp, 
  TrendingDown,
  Zap,
  Clock
} from 'lucide-react';

interface StrategyEvent {
  type: string;
  occurredAt: string;
  payload: Record<string, unknown>;
  version: string;
}

interface KPIMonitoringCardProps {
  currentMetrics: Record<string, number>;
  onRuleTrigger?: (event: StrategyEvent) => void;
}

// Predefined KPI rules for common scenarios
const PREDEFINED_RULES = [
  {
    name: 'High Denial Rate Alert',
    rule: 'rule high_denial when initial_denial_rate > 0.08 then emit_event alert_high',
    description: 'Triggers when denial rate exceeds 8%',
    category: 'denial'
  },
  {
    name: 'Low Appeal Success',
    rule: 'rule low_appeal when appeal_success_rate < 0.75 then emit_event alert_low',
    description: 'Triggers when appeal success rate drops below 75%',
    category: 'appeal'
  },
  {
    name: 'Slow Processing Time',
    rule: 'rule slow_processing when avg_processing_time > 5 then emit_event alert_slow',
    description: 'Triggers when average processing time exceeds 5 days',
    category: 'performance'
  },
  {
    name: 'High CMI Opportunity',
    rule: 'rule cmi_opportunity when cmi_gap_score > 0.15 then emit_event opportunity_high',
    description: 'Triggers when CMI gap score indicates high opportunity',
    category: 'revenue'
  }
];

export const KPIMonitoringCard: React.FC<KPIMonitoringCardProps> = ({
  currentMetrics,
  onRuleTrigger
}) => {
  const { theme } = useTheme();
  const [customRule, setCustomRule] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  const { events, metricAlerts, hasAlerts, getMetricAlerts } = useKPIMonitoring(currentMetrics);
  const kpiRuleEvaluation = useKPIRuleEvaluation();

  const handleEvaluateRule = async (rule: string) => {
    setIsEvaluating(true);
    try {
      const result = await kpiRuleEvaluation.mutateAsync({ rule, metrics: currentMetrics });
      if (result.fired.length > 0 && onRuleTrigger) {
        result.fired.forEach((event: StrategyEvent) => onRuleTrigger(event));
      }
    } catch (error) {
      // Replace console.error with proper error handling
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      // In a real app, you might want to show a toast notification here
      console.error('Rule evaluation failed:', errorMessage);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handlePredefinedRule = (rule: string) => {
    setCustomRule(rule);
    handleEvaluateRule(rule);
  };

  const getMetricValue = (metric: string) => {
    return currentMetrics[metric] || 0;
  };

  const getMetricStatus = (metric: string) => {
    const alerts = getMetricAlerts(metric);
    if (alerts.length === 0) return 'normal';
    
    const latestAlert = alerts[alerts.length - 1];
    const value = getMetricValue(metric);
    
    // Simple logic to determine if metric is improving or declining
    // In a real implementation, this would compare against historical data
    if (latestAlert.payload?.threshold && value > latestAlert.payload.threshold) {
      return 'alert';
    }
    return 'warning';
  };

  const getMetricIcon = (metric: string) => {
    const status = getMetricStatus(metric);
    switch (status) {
      case 'alert':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <TrendingDown className="w-4 h-4 text-yellow-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <Card className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Real-Time KPI Monitoring
            </CardTitle>
            <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Event-driven KPI rules with real-time alerts
            </CardDescription>
          </div>
          <Badge 
            variant={hasAlerts ? "destructive" : "secondary"}
            className="flex items-center space-x-1"
          >
            {hasAlerts ? (
              <>
                <AlertTriangle className="w-3 h-3" />
                <span>{events.length} Alerts</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-3 h-3" />
                <span>All Clear</span>
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Metrics Display */}
        <div>
          <h4 className={`text-sm font-medium mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Current Metrics
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(currentMetrics).map(([metric, value]) => (
              <div 
                key={metric}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {getMetricIcon(metric)}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {metric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
                <span className={`font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {typeof value === 'number' && value < 1 ? `${(value * 100).toFixed(1)}%` : value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Rule Evaluation */}
        <div>
          <h4 className={`text-sm font-medium mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Custom Rule Evaluation
          </h4>
          <div className="flex space-x-2">
            <Input
              value={customRule}
              onChange={(e) => setCustomRule(e.target.value)}
              placeholder="rule my_rule when metric > 0.1 then emit_event alert"
              className="flex-1"
            />
            <Button 
              onClick={() => handleEvaluateRule(customRule)}
              disabled={!customRule.trim() || isEvaluating}
              size="sm"
            >
              {isEvaluating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Predefined Rules */}
        <div>
          <h4 className={`text-sm font-medium mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Predefined Rules
          </h4>
          <div className="space-y-2">
            {PREDEFINED_RULES.map((ruleDef) => (
              <div 
                key={ruleDef.name}
                className={`p-3 rounded-lg border ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h5 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {ruleDef.name}
                    </h5>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {ruleDef.description}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {ruleDef.category}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <code className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded font-mono">
                    {ruleDef.rule}
                  </code>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handlePredefinedRule(ruleDef.rule)}
                    disabled={isEvaluating}
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Test
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Events */}
        {events.length > 0 && (
          <div>
            <h4 className={`text-sm font-medium mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Recent Events
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {events.slice(0, 5).map((event, index) => (
                <div 
                  key={index}
                  className={`flex items-center space-x-3 p-2 rounded text-sm ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                  }`}
                >
                  <Clock className="w-3 h-3 text-gray-500" />
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    {event.type.replace('_', ' ')}
                  </span>
                  <span className="text-gray-500">
                    {new Date(event.occurredAt).toLocaleTimeString()}
                  </span>
                  {event.payload?.metric && (
                    <Badge variant="outline" className="text-xs">
                      {event.payload.metric}: {event.payload.value}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Footer */}
        <div className={`text-xs p-2 rounded ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          <div className="flex items-center space-x-2">
            <Activity className="w-3 h-3 text-green-500" />
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              KPI Rules DSL active • Real-time monitoring enabled • Event-driven alerts configured
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
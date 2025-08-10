import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/contexts/ThemeContext';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';

const API_BASE = (import.meta as { env?: { VITE_API_BASE?: string } })?.env?.VITE_API_BASE || 'http://localhost:3001';

export const NaturalLanguageQuery: React.FC = () => {
  const { theme } = useTheme();
  const [question, setQuestion] = useState<string>('');
  const [result, setResult] = useState<{ type: 'text' | 'image'; content: string } | null>(null);

  const mutation = useMutation({
    mutationFn: async (newQuestion: string) => {
      const resp = await fetch(`${API_BASE}/api/analytics/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: newQuestion }),
      });
      if (!resp.ok) throw new Error((await resp.json().catch(() => ({})))?.error || 'Request failed');
      return (await resp.json()) as { type: 'text' | 'image'; content: string };
    },
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const onSubmit = () => {
    if (!question.trim()) return;
    setResult(null);
    mutation.mutate(question.trim());
  };

  return (
    <Card className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
      <CardHeader>
        <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Ask a Question
        </CardTitle>
        <CardDescription className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
          Use natural language to generate insights from your data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., Show denial trends by reason as a bar chart for the last quarter"
            className={`${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
          <Button 
            onClick={onSubmit} 
            disabled={mutation.isPending || !question.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {mutation.isPending ? 'Generating...' : 'Generate Insight'}
          </Button>

          {mutation.isPending && (
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              🧠 Generating insight, this may take a moment...
            </div>
          )}

          {mutation.isError && (
            <Alert variant="destructive">
              <AlertDescription>{(mutation.error as Error)?.message || 'Something went wrong'}</AlertDescription>
            </Alert>
          )}

          {result && result.type === 'text' && (
            <div className={`text-sm whitespace-pre-wrap p-4 rounded-lg border ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700 text-gray-300' 
                : 'bg-gray-50 border-gray-200 text-gray-800'
            }`}>
              {result.content}
            </div>
          )}
          {result && result.type === 'image' && (
            <div className="rounded-lg border overflow-hidden">
              <img src={result.content} alt="AI-generated chart" className="max-w-full h-auto" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};



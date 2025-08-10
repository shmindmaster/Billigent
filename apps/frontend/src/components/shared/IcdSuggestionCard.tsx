import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface IcdSuggestion {
  code: string;
  description: string;
  rationale: string;
}

interface Props {
  suggestion: IcdSuggestion;
}

export const IcdSuggestionCard: React.FC<Props> = ({ suggestion }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-3 text-base">
          <Badge variant="outline" className="text-xs px-2 py-1">
            {suggestion.code}
          </Badge>
          <span>{suggestion.description}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          <span className="mr-1">💡 Rationale:</span>
          {suggestion.rationale}
        </p>
      </CardContent>
    </Card>
  );
};



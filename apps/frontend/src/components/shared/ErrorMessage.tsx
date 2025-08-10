import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ErrorMessage({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}



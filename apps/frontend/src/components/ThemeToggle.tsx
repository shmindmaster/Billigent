import React from 'react';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  return (
    <button className={className}>
      <span>Toggle Theme</span>
    </button>
  );
}
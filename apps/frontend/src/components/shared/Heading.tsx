import React from 'react';
import { cn } from '@/lib/utils';

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  level?: 1 | 2 | 3 | 4;
};

export function Heading({ level = 1, className, ...props }: HeadingProps) {
  const Tag = (`h${level}` as unknown) as keyof JSX.IntrinsicElements;
  const map = {
    1: 'scroll-m-20 text-3xl md:text-4xl font-semibold tracking-tight',
    2: 'scroll-m-20 text-2xl md:text-3xl font-semibold tracking-tight',
    3: 'text-xl md:text-2xl font-medium',
    4: 'text-lg md:text-xl font-medium',
  } as const;
  return <Tag className={cn(map[level], className)} {...props} />;
}



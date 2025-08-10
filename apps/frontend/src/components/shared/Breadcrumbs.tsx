import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export type CrumbItem = {
  label: string;
  to?: string;
};

type BreadcrumbsProps = {
  items: CrumbItem[];
  className?: string;
};

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('mb-4 text-sm text-muted-foreground', className)}>
      <ol className="flex items-center gap-2">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-2">
              {item.to && !isLast ? (
                <Link to={item.to} className="hover:text-foreground underline-offset-4 hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} className={cn(isLast && 'text-foreground font-medium')}>
                  {item.label}
                </span>
              )}
              {!isLast && <span className="select-none">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}



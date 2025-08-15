import { DataTableLoading } from '@/components/LoadingStates';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
  className?: string;
}

export interface DataTableProps {
  title?: string;
  description?: string;
  columns: TableColumn[];
  data: Record<string, unknown>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: Record<string, unknown>) => void;
  className?: string;
  headerActions?: React.ReactNode;
}

export const DataTable: React.FC<DataTableProps> = ({
  title,
  description,
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  className = '',
  headerActions
}) => {
  const { theme } = useTheme();

  if (loading) {
    return <DataTableLoading />;
  }

  const cardClass = theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200';

  return (
    <Card className={`${cardClass} ${className}`}>
      {(title || description || headerActions) && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              {title && <CardTitle>{title}</CardTitle>}
              {description && (
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {description}
                </p>
              )}
            </div>
            {headerActions}
          </div>
        </CardHeader>
      )}
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead 
                    key={column.key}
                    style={column.width ? { width: column.width } : undefined}
                    className={column.className}
                  >
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={columns.length} 
                    className={`text-center py-8 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, index) => (
                  <TableRow 
                    key={index}
                    className={onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((column) => (
                      <TableCell key={column.key} className={column.className}>
                        {column.render 
                          ? column.render(row[column.key], row)
                          : row[column.key]
                        }
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

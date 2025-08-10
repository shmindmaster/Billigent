import { DataTable } from '@/components/shared/DataTable';
import { FilterControls } from '@/components/shared/FilterControls';
import PageHeader from '@/components/shared/PageHeader';
import StatsGrid from '@/components/shared/StatsGrid';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCases, useSearchCases } from '@/hooks/useData';
import { formatCurrency, formatDate } from '@/lib/utils';
import { UnifiedCase } from '@/types/unified-case';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CaseManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'open' | 'review' | 'closed' | 'pending'>('all');
  const [priorityFilter, setPriorityFilter] = React.useState<'all' | 'high' | 'medium' | 'low' | 'urgent'>('all');

  // Data fetching
  const { data: cases = [], isLoading } = useCases();
  const { data: searchResults = [] } = useSearchCases(searchTerm);

  const displayCases = searchTerm ? searchResults : cases;

  // Stats calculation
  const stats = React.useMemo(() => {
    const totalCases = cases.length;
    const activeCases = cases.filter((c: UnifiedCase) => c.status === 'open').length;
    const reviewNeeded = cases.filter((c: UnifiedCase) => c.status === 'review').length;
    const totalValue = cases.reduce((sum: number, c: UnifiedCase) => sum + (c.financial?.outstandingBalance || 0), 0);

    return [
      {
        label: 'Total Cases',
        value: totalCases.toString(),
        change: { value: 12, trend: 'up' as const }
      },
      {
        label: 'Active Cases',
        value: activeCases.toString(),
        change: { value: 5, trend: 'up' as const }
      },
      {
        label: 'Review Needed',
        value: reviewNeeded.toString(),
        change: { value: 8, trend: 'down' as const }
      },
      {
        label: 'Total Value',
        value: formatCurrency(totalValue),
        change: { value: 15, trend: 'up' as const }
      }
    ];
  }, [cases]);

  // Filter options
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'open', label: 'Open' },
    { value: 'review', label: 'In Review' },
    { value: 'closed', label: 'Closed' },
    { value: 'pending', label: 'Pending' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
    { value: 'urgent', label: 'Urgent' }
  ];

  // Table columns
  const columns = [
    {
      key: 'caseId',
      label: 'Case ID',
      render: (_: any, row: UnifiedCase) => (
        <Button
          variant="ghost"
          className="h-auto p-0 font-mono text-blue-400 hover:text-blue-300"
          onClick={() => navigate(`/cases/${row.id}`)}
        >
          #{row.id}
        </Button>
      )
    },
    {
      key: 'patient',
      label: 'Patient',
      render: (_: any, row: UnifiedCase) => (
        <div>
          <div className="font-medium">{row.patient?.name}</div>
          <div className="text-sm text-gray-400">ID: {row.patientId}</div>
        </div>
      )
    },
    {
      key: 'date',
      label: 'Date',
      render: (_: any, row: UnifiedCase) => formatDate(row.encounter.date)
    },
    {
      key: 'status',
      label: 'Status',
      render: (_: any, row: UnifiedCase) => (
        <Badge variant={row.status === 'open' ? 'default' : 'secondary'}>
          {row.status}
        </Badge>
      )
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (_: any, row: UnifiedCase) => (
        <Badge 
          variant={
            row.priority === 'high' ? 'destructive' :
            row.priority === 'medium' ? 'secondary' : 'outline'
          }
        >
          {row.priority}
        </Badge>
      )
    },
    {
      key: 'impact',
      label: 'Potential Impact',
      render: (_: any, row: UnifiedCase) => 
        formatCurrency(row.financial?.outstandingBalance || 0)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: UnifiedCase) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/cases/${row.id}`)}
          >
            View
          </Button>
          <Button
            size="sm"
            onClick={() => navigate(`/cases/${row.id}/review`)}
          >
            Review
          </Button>
        </div>
      )
    }
  ];

  // Apply filters
  const filteredCases = React.useMemo(() => {
    let filtered = displayCases;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((c: UnifiedCase) => c.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter((c: UnifiedCase) => c.priority === priorityFilter);
    }

    return filtered;
  }, [displayCases, statusFilter, priorityFilter]);

  return (
    <div className="p-8">
      <PageHeader
        title="Case Management"
        description="Comprehensive case tracking and management across the entire patient care continuum"
      />

      <StatsGrid stats={stats} />

      <FilterControls
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search cases by patient name, ID, or case number..."
        filters={[
          {
            key: 'status',
            label: 'Status',
            value: statusFilter,
            onChange: (v: string) => setStatusFilter(v as 'all' | 'open' | 'review' | 'closed' | 'pending'),
            options: statusOptions
          },
          {
            key: 'priority',
            label: 'Priority',
            value: priorityFilter,
            onChange: (v: string) => setPriorityFilter(v as 'all' | 'high' | 'medium' | 'low' | 'urgent'),
            options: priorityOptions
          }
        ]}
        className="mb-6"
      />

      <DataTable
        data={filteredCases}
        columns={columns}
        loading={isLoading}
        emptyMessage="No cases found matching your criteria"
      />
    </div>
  );
};

export default CaseManagement;

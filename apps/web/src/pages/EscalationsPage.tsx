import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';

export const EscalationsPage: React.FC = () => {
  const navigate = useNavigate();

  const data = [
    { id: 'OBS-092', product: 'SlimTea', officer: 'Jane Smith', date: '2026-08-25', notes: 'Unregistered product with dangerous claims' },
    { id: 'OBS-104', product: 'MalarGo', officer: 'John Doe', date: '2026-08-26', notes: 'Counterfeit suspect' },
  ];

  const columns = [
    { key: 'id', header: 'Observation #' },
    { key: 'product', header: 'Product' },
    { key: 'officer', header: 'Escalated By' },
    { key: 'date', header: 'Date' },
    { key: 'notes', header: 'Notes' },
    {
      key: 'actions',
      header: 'Action',
      render: (item: any) => (
        <Button size="sm" onClick={() => navigate(`/observations/${item.id}/review`)}>Review</Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Escalated Cases</h1>
      </div>
      <DataTable
        columns={columns}
        data={data}
        onExport={() => {}}
      />
    </div>
  );
};

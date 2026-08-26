import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DataTable } from '../components/ui/DataTable';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

export const NapamsSyncPage: React.FC = () => {
  const [syncing, setSyncing] = useState(false);

  const history = [
    { id: 1, date: '2026-08-26 02:00:00', type: 'Daily Scheduled', status: 'Success', records: 1250, duration: '4m 12s' },
    { id: 2, date: '2026-08-25 02:00:00', type: 'Daily Scheduled', status: 'Success', records: 1245, duration: '4m 05s' },
    { id: 3, date: '2026-08-24 14:30:00', type: 'Manual', status: 'Failed', records: 0, duration: '0m 45s' },
  ];

  const columns = [
    { key: 'date', header: 'Date & Time' },
    { key: 'type', header: 'Trigger Type' },
    { 
      key: 'status', 
      header: 'Status',
      render: (item: any) => <Badge variant={item.status === 'Success' ? 'success' : 'danger'}>{item.status}</Badge>
    },
    { key: 'records', header: 'Records Processed' },
    { key: 'duration', header: 'Duration' },
  ];

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">NAPAMS Synchronization</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Connection Status">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-green-50 rounded-full">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Healthy</h3>
              <p className="text-sm text-gray-500">Connected to NAPAMS API production endpoint.</p>
            </div>
          </div>
        </Card>

        <Card title="Manual Action">
          <p className="text-sm text-gray-600 mb-4">
            The system automatically synchronizes with NAPAMS every night at 2:00 AM. 
            Use this to manually trigger a sync if urgent updates are needed.
          </p>
          <Button onClick={handleSync} isLoading={syncing} fullWidth>
            <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            Run Sync Now
          </Button>
        </Card>
      </div>

      <Card title="Sync History">
        <DataTable columns={columns} data={history} onExport={() => {}} />
      </Card>
    </div>
  );
};

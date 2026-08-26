import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const AlertsListPage: React.FC = () => {
  const navigate = useNavigate();

  const alerts = [
    { id: 'ALT-001', title: 'Unapproved COVID-19 Cure Claims', target: 'ViralX Syrup', priority: 'Urgent', date: 'Active until Sep 1, 2026', ack: false },
    { id: 'ALT-002', title: 'Suspended Approval Monitoring', target: 'MalarGo Tablets', priority: 'High', date: 'Active until Aug 30, 2026', ack: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Surveillance Alerts</h1>
        <Button onClick={() => navigate('/alerts/create')}>Create Alert</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.map(alert => (
          <Card key={alert.id} className={alert.priority === 'Urgent' ? 'border-red-300 bg-red-50' : ''}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
              <Badge variant={alert.priority === 'Urgent' ? 'danger' : 'warning'}>{alert.priority}</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-4">Target: <strong>{alert.target}</strong><br/>{alert.date}</p>
            
            <div className="flex space-x-2">
              {!alert.ack ? (
                <Button variant="secondary" size="sm" className="flex-1">Acknowledge</Button>
              ) : (
                <Button variant="ghost" size="sm" disabled className="flex-1 text-green-600">Acknowledged ✓</Button>
              )}
              <Button size="sm" className="flex-1" onClick={() => navigate(`/capture?alertId=${alert.id}`)}>Report Sighting</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

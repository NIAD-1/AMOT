import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex space-x-2">
          <select className="border-gray-300 rounded-md shadow-sm p-2 text-sm border focus:ring-[#1e3a5f] focus:border-[#1e3a5f]">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Obs.', val: '1,245', color: 'blue' },
          { label: 'Pending Review', val: '86', color: 'amber' },
          { label: 'Compliant', val: '890', color: 'green' },
          { label: 'Non-Compliant', val: '269', color: 'red' },
          { label: 'Overdue Tasks', val: '12', color: 'red' },
          { label: 'Escalated', val: '34', color: 'orange' },
        ].map((kpi, idx) => (
          <Card key={idx} className="text-center p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{kpi.label}</p>
            <h3 className={`text-2xl font-bold mt-2 text-${kpi.color}-600`}>{kpi.val}</h3>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Observations by Source">
          <div className="h-64 flex items-end justify-around pb-4">
            <div className="w-16 bg-blue-500 rounded-t-sm h-[80%] relative group">
              <span className="absolute -top-6 w-full text-center text-sm">80%</span>
              <span className="absolute -bottom-6 w-full text-center text-xs">Spontaneous</span>
            </div>
            <div className="w-16 bg-blue-400 rounded-t-sm h-[15%] relative">
              <span className="absolute -top-6 w-full text-center text-sm">15%</span>
              <span className="absolute -bottom-6 w-full text-center text-xs">Schedule</span>
            </div>
            <div className="w-16 bg-blue-300 rounded-t-sm h-[5%] relative">
              <span className="absolute -top-6 w-full text-center text-sm">5%</span>
              <span className="absolute -bottom-6 w-full text-center text-xs">Alert</span>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t flex justify-end">
             <Button variant="secondary" size="sm">Export CSV</Button>
          </div>
        </Card>

        <Card title="Compliance Rate by Medium">
          <div className="space-y-4 pt-4">
            {[
              { label: 'Billboard', comp: 85, non: 15 },
              { label: 'Social Media', comp: 40, non: 60 },
              { label: 'Television', comp: 95, non: 5 },
            ].map(row => (
              <div key={row.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{row.label}</span>
                  <span className="text-gray-500">{row.comp}% Compliant</span>
                </div>
                <div className="w-full h-2 bg-red-200 rounded-full overflow-hidden flex">
                  <div className="h-full bg-green-500" style={{ width: `${row.comp}%` }}></div>
                  <div className="h-full bg-red-500" style={{ width: `${row.non}%` }}></div>
                </div>
              </div>
            ))}
          </div>
           <div className="mt-8 pt-4 border-t flex justify-end">
             <Button variant="secondary" size="sm">Export CSV</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

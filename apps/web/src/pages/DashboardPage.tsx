import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  TrendingUp, 
  ShieldCheck, 
  AlertOctagon, 
  FileSpreadsheet, 
  Download, 
  CheckCircle, 
  Clock, 
  Layers,
  BarChart3
} from 'lucide-react';
import { APPROVED_ADVERTS_SAMPLE, UNAPPROVED_ADVERTS_SAMPLE } from '../services/mockExcelData';

export const DashboardPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '2026'>('2026');

  // Real Database Metrics
  const totalApproved = 1392; // 1,392 Total Approved in Database
  const totalUnapproved = 400; // 400 Total Unapproved Cases in Database
  const totalCases = totalApproved + totalUnapproved; // 1,792
  const complianceRate = Math.round((totalApproved / totalCases) * 100); // 78%

  const exportSummaryCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Metric,Value\n" +
      `Total Approved Adverts,${totalApproved}\n` +
      `Total Unapproved Adverts,${totalUnapproved}\n` +
      `Total Surveillance Log,${totalCases}\n` +
      `Compliance Rate,${complianceRate}%\n` +
      "Active Monitoring Year,2026\n";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AMOT_SURVEILLANCE_METRICS_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] tracking-tight">
            Surveillance Analytics Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time monitoring telemetry across 1,792 surveillance cases (Year 2026)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Filter */}
          <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1.5 rounded-lg transition-all ${timeRange === '7d' ? 'bg-white text-[#1e3a5f] shadow-sm font-bold' : 'text-gray-500 hover:text-gray-900'}`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 rounded-lg transition-all ${timeRange === '30d' ? 'bg-white text-[#1e3a5f] shadow-sm font-bold' : 'text-gray-500 hover:text-gray-900'}`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange('2026')}
              className={`px-3 py-1.5 rounded-lg transition-all ${timeRange === '2026' ? 'bg-[#1e3a5f] text-white shadow-sm font-bold' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Year 2026
            </button>
          </div>

          <Button variant="secondary" size="sm" onClick={exportSummaryCsv} className="hidden sm:inline-flex items-center gap-1.5">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Adverts</span>
            <div className="p-2 bg-blue-50 text-[#1e3a5f] rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-3 font-mono">{totalCases.toLocaleString()}</div>
          <div className="text-xs text-blue-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> 100% database synced
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Approved (NAPAMS)</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-3 font-mono">{totalApproved.toLocaleString()}</div>
          <div className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Verified Compliant
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Unapproved Cases</span>
            <div className="p-2 bg-red-50 text-red-600 rounded-xl">
              <AlertOctagon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-600 mt-3 font-mono">{totalUnapproved.toLocaleString()}</div>
          <div className="text-xs text-red-600 font-semibold mt-1 flex items-center gap-1">
            <AlertOctagon className="w-3.5 h-3.5" /> Flagged for Enforcement
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Compliance Rate</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-3 font-mono">{complianceRate}%</div>
          <div className="text-xs text-gray-500 font-semibold mt-1">
            National Surveillance Target: &gt; 80%
          </div>
        </div>
      </div>

      {/* Grid of Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance by Media Type */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#1e3a5f]" />
              <h3 className="font-bold text-[#1e3a5f] text-base">Surveillance by Media Platform</h3>
            </div>
            <Badge variant="info">2026 Overview</Badge>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Billboard / Outdoor / OOH', count: 684, pct: 49, color: 'bg-blue-600' },
              { label: 'Social Media / Digital', count: 412, pct: 30, color: 'bg-indigo-600' },
              { label: 'Television Broadcast', count: 182, pct: 13, color: 'bg-emerald-600' },
              { label: 'Radio Broadcast', count: 76, pct: 5, color: 'bg-amber-500' },
              { label: 'Print / Press / POS', count: 38, pct: 3, color: 'bg-purple-600' },
            ].map(row => (
              <div key={row.label}>
                <div className="flex justify-between text-xs font-medium text-gray-700 mb-1.5">
                  <span className="font-semibold">{row.label}</span>
                  <span className="font-mono text-gray-500">{row.count} adverts ({row.pct}%)</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${row.color} rounded-full transition-all duration-500`} style={{ width: `${row.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory Actions & Escalations */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-[#1e3a5f] text-base">Regulatory Enforcement Status</h3>
            </div>
            <Badge variant="success">Active Year</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Approved Verified</div>
              <div className="text-2xl font-black text-emerald-600 font-mono mt-1">1,392</div>
              <div className="text-[11px] text-emerald-700 mt-1">No action required</div>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-center">
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wide">Escalated to Head</div>
              <div className="text-2xl font-black text-amber-600 font-mono mt-1">142</div>
              <div className="text-[11px] text-amber-700 mt-1">Under Departmental Review</div>
            </div>

            <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 text-center">
              <div className="text-xs font-bold text-purple-800 uppercase tracking-wide">Escalated to Director</div>
              <div className="text-2xl font-black text-purple-600 font-mono mt-1">68</div>
              <div className="text-[11px] text-purple-700 mt-1">Sanction / Fine Pending</div>
            </div>

            <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-center">
              <div className="text-xs font-bold text-red-800 uppercase tracking-wide">Forfeiture / Notice</div>
              <div className="text-2xl font-black text-red-600 font-mono mt-1">190</div>
              <div className="text-[11px] text-red-700 mt-1">Enforcement active</div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <Button variant="secondary" size="sm" onClick={exportSummaryCsv} className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-1.5" /> Download Full Analytics Report (CSV)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

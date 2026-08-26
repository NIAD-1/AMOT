import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Calendar, Download, Camera, FileSpreadsheet, MapPin } from 'lucide-react';
import { APPROVED_ADVERTS_SAMPLE } from '../services/mockExcelData';

export const MyAssignmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const assignmentsData = APPROVED_ADVERTS_SAMPLE.map((item, idx) => ({
    id: `SCH-2026-0${idx + 1}`,
    date: '2026-08-26',
    product: item.productName,
    company: item.applicantName,
    medium: item.medium,
    location: idx % 2 === 0 ? 'Ikeja Industrial Zone, Lagos' : 'Victoria Island / Ikoyi, Lagos',
    status: idx === 0 ? 'In Progress' : idx === 1 ? 'Completed' : 'Pending',
    nafdacNo: item.nafdacRegNumber,
    artworkRef: item.artworkRef
  }));

  const columns = [
    { key: 'id', header: 'Task ID' },
    { key: 'date', header: 'Schedule Date' },
    { 
      key: 'product', 
      header: 'Target Product & Company',
      render: (item: any) => (
        <div>
          <span className="font-semibold text-[#1e3a5f] block text-xs md:text-sm">{item.product}</span>
          <span className="text-[10px] text-gray-500">{item.company} • NAFDAC: {item.nafdacNo}</span>
        </div>
      )
    },
    { key: 'medium', header: 'Assigned Medium' },
    { 
      key: 'location', 
      header: 'Target Location',
      render: (item: any) => (
        <span className="flex items-center gap-1 text-xs text-gray-700">
          <MapPin className="w-3 h-3 text-red-500" /> {item.location}
        </span>
      )
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (item: any) => (
        <Badge variant={item.status === 'Completed' ? 'success' : item.status === 'In Progress' ? 'warning' : 'neutral'}>
          {item.status}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Action',
      render: (item: any) => (
        <Button 
          size="sm" 
          variant="accent" 
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/capture?scheduleId=${item.id}`);
          }}
          className="text-xs py-1"
        >
          <Camera className="w-3.5 h-3.5 mr-1" /> Start Observation
        </Button>
      )
    }
  ];

  const handleExportCsv = () => {
    const headers = ['Task ID', 'Schedule Date', 'Target Product', 'Company', 'NAFDAC Reg No', 'Assigned Medium', 'Target Location', 'Status'];
    const rows = assignmentsData.map(d => [
      d.id, d.date, `"${d.product}"`, `"${d.company}"`, d.nafdacNo, `"${d.medium}"`, `"${d.location}"`, d.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AMOT_Scheduled_Assignments_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1e3a5f] flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#f59e0b]" /> Scheduled Advert Monitoring
          </h1>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" /> Imported from <span className="font-semibold text-gray-700">Approved_Adverts_Exploded (1).xlsx</span>
          </p>
        </div>

        <Button variant="secondary" onClick={handleExportCsv} className="flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Schedule CSV
        </Button>
      </div>

      {/* Schedule Table */}
      <DataTable
        columns={columns}
        data={assignmentsData}
        onExport={handleExportCsv}
        pagination={{
          currentPage: page,
          totalPages: 1,
          onPageChange: setPage
        }}
      />
    </div>
  );
};

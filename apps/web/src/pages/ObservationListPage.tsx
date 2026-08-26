import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Download, Search, Filter, FileSpreadsheet } from 'lucide-react';
import { APPROVED_ADVERTS_SAMPLE, UNAPPROVED_ADVERTS_SAMPLE } from '../services/mockExcelData';

export const ObservationListPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'all' | 'approved' | 'unapproved'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Map real Excel data to Observation format
  const approvedObservations = APPROVED_ADVERTS_SAMPLE.map((item, idx) => ({
    id: `OBS-2026-0${idx + 101}`,
    date: '2026-08-25',
    officer: 'Chiamaka Adibo',
    product: item.productName,
    manufacturer: item.applicantName,
    regNumber: item.nafdacRegNumber,
    medium: item.medium,
    location: 'Lagos Island / Ikeja Zone',
    status: 'Compliant',
    source: 'Schedule (Excel Import)',
    napamsRef: item.artworkRef
  }));

  const unapprovedObservations = UNAPPROVED_ADVERTS_SAMPLE.map((item, idx) => ({
    id: item.caseId,
    date: item.dateDiscovered,
    officer: item.discoveredBy,
    product: item.productName,
    manufacturer: item.companyName,
    regNumber: item.nafdacRegNo,
    medium: item.media,
    location: item.location,
    status: 'Non-Compliant',
    source: 'Spontaneous Capture',
    napamsRef: 'NO MATCH FOUND'
  }));

  let combinedData = [...approvedObservations, ...unapprovedObservations];
  if (activeTab === 'approved') combinedData = approvedObservations;
  if (activeTab === 'unapproved') combinedData = unapprovedObservations;

  if (searchTerm) {
    combinedData = combinedData.filter(item => 
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.regNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const columns = [
    { key: 'id', header: 'Observation #' },
    { key: 'date', header: 'Date Captured' },
    { key: 'officer', header: 'Field Officer' },
    { 
      key: 'product', 
      header: 'Product Name (Excel Synced)',
      render: (item: any) => (
        <div>
          <span className="font-semibold text-[#1e3a5f] block text-xs md:text-sm">{item.product}</span>
          <span className="text-[10px] text-gray-500">{item.manufacturer} • Reg: {item.regNumber}</span>
        </div>
      )
    },
    { key: 'medium', header: 'Medium' },
    { 
      key: 'status', 
      header: 'Finding Status',
      render: (item: any) => (
        <Badge variant={item.status === 'Compliant' ? 'success' : 'danger'}>
          {item.status}
        </Badge>
      )
    },
    { key: 'source', header: 'Source' },
  ];

  const handleExportCsv = () => {
    // Generate CSV download from real Excel structure
    const headers = ['Observation #', 'Date Captured', 'Field Officer', 'Product Name', 'Manufacturer', 'NAFDAC Reg No', 'Medium', 'Location', 'Finding Status', 'Source'];
    const rows = combinedData.map(d => [
      d.id, d.date, d.officer, `"${d.product}"`, `"${d.manufacturer}"`, d.regNumber, `"${d.medium}"`, `"${d.location}"`, d.status, d.source
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AMOT_Observations_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1e3a5f]">Advert Observations</h1>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <FileSpreadsheet className="w-3.5 h-3.5 text-green-600" /> Synced with <span className="font-semibold text-gray-700">Approved_Adverts_Exploded (1).xlsx</span> (1,392 Approved + 400 Unapproved Log)
          </p>
        </div>

        <Button variant="accent" onClick={handleExportCsv} className="flex items-center gap-2">
          <Download className="w-4 h-4" /> Export CSV Stream
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-2 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'all' ? 'border-[#1e3a5f] text-[#1e3a5f]' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          All Observations ({approvedObservations.length + unapprovedObservations.length})
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`pb-2 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'approved' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Approved Matches ({approvedObservations.length})
        </button>
        <button
          onClick={() => setActiveTab('unapproved')}
          className={`pb-2 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'unapproved' ? 'border-red-600 text-red-700' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Unapproved Cases ({unapprovedObservations.length})
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Product (e.g. MEFANTHER, VIAGRA, ROMCIN), Company, or NAFDAC Reg No..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
          />
        </div>
      </div>

      {/* Data Table */}
      <div onClick={(e) => {
        const target = e.target as HTMLElement;
        const row = target.closest('tr');
        if (row && row.rowIndex > 0) {
          const item = combinedData[row.rowIndex - 1];
          if (item) navigate(`/observations/${item.id}`);
        }
      }}>
        <DataTable
          columns={columns}
          data={combinedData}
          onExport={handleExportCsv}
          pagination={{
            currentPage: page,
            totalPages: Math.ceil(combinedData.length / 10),
            onPageChange: setPage
          }}
        />
      </div>
    </div>
  );
};

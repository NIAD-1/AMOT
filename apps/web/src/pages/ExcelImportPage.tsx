import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DataTable } from '../components/ui/DataTable';
import { Upload, FileSpreadsheet, Check } from 'lucide-react';

export const ExcelImportPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);

  const history = [
    { id: 1, date: '2026-08-20', filename: 'August_Schedule_Lagos.xlsx', status: 'Completed', rows: 45 },
    { id: 2, date: '2026-07-25', filename: 'July_Schedule_Abuja.xlsx', status: 'Completed', rows: 32 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Import Monitoring Schedule</h1>
      </div>

      {step === 1 && (
        <Card>
          <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              accept=".xlsx, .xls, .csv"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                  setStep(2);
                }
              }}
            />
            <FileSpreadsheet className="w-12 h-12 text-[#1e3a5f] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Upload Schedule File</h3>
            <p className="text-sm text-gray-500 mb-4">Drag and drop your Excel (.xlsx) or CSV file here, or click to browse.</p>
            <Button variant="secondary">Browse Files</Button>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card title={`Preview: ${file?.name}`}>
          <div className="space-y-4">
            <div className="flex space-x-8 mb-6">
              <div>
                <span className="block text-sm text-gray-500">Total Rows</span>
                <span className="text-xl font-bold">120</span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Valid Rows</span>
                <span className="text-xl font-bold text-green-600">118</span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Errors</span>
                <span className="text-xl font-bold text-red-600">2</span>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">Warnings (2 rows skipped)</h4>
              <ul className="text-xs text-yellow-700 list-disc list-inside">
                <li>Row 14: Missing mandatory field "Product Name"</li>
                <li>Row 89: Invalid date format in "Due Date"</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="secondary" onClick={() => setStep(1)}>Cancel</Button>
              <Button onClick={() => setStep(3)}>Confirm & Import</Button>
            </div>
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card className="text-center py-12">
          <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Successful</h2>
          <p className="text-gray-500 mb-6">118 tasks have been successfully scheduled and assigned.</p>
          <Button onClick={() => setStep(1)}>Import Another File</Button>
        </Card>
      )}

      <Card title="Recent Imports">
        <DataTable
          columns={[
            { key: 'date', header: 'Date' },
            { key: 'filename', header: 'File Name' },
            { key: 'rows', header: 'Rows Imported' },
            { key: 'status', header: 'Status' }
          ]}
          data={history}
        />
      </Card>
    </div>
  );
};

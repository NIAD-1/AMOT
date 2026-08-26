import React, { useState } from 'react';
import { DataTable } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';

export const UsersManagementPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const data = [
    { id: 1, name: 'John Doe', email: 'john@nafdac.gov.ng', role: 'OFFICER', status: 'Active', created: '2026-01-15' },
    { id: 2, name: 'Admin User', email: 'admin@nafdac.gov.ng', role: 'ADMIN', status: 'Active', created: '2026-01-01' },
    { id: 3, name: 'Jane Smith', email: 'jane@nafdac.gov.ng', role: 'SUPERVISOR', status: 'Inactive', created: '2026-02-10' },
  ];

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { 
      key: 'role', 
      header: 'Role',
      render: (item: any) => <Badge variant="info">{item.role}</Badge>
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (item: any) => <Badge variant={item.status === 'Active' ? 'success' : 'neutral'}>{item.status}</Badge>
    },
    { key: 'created', header: 'Created' },
    {
      key: 'actions',
      header: 'Action',
      render: () => (
        <Button variant="ghost" size="sm">Edit</Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <Button onClick={() => setShowModal(true)}>Add User</Button>
      </div>

      <DataTable
        columns={columns}
        data={data}
        onExport={() => {}}
      />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New User">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-[#1e3a5f]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-[#1e3a5f]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-[#1e3a5f]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-[#1e3a5f]">
              <option>OFFICER</option>
              <option>ADVERT_TEAM</option>
              <option>SUPERVISOR</option>
              <option>ADMIN</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="button">Create User</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

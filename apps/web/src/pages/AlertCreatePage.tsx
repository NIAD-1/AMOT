import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const AlertCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/alerts');
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Create Surveillance Alert</h1>
      
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Alert Title *</label>
            <input required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm p-2 border" placeholder="e.g. Unapproved Claims Monitoring" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Target Product *</label>
              <input required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Manufacturer (Optional)</label>
              <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm p-2 border" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description *</label>
            <textarea required rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm p-2 border" placeholder="Provide context for field officers..."></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Priority *</label>
              <select required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm p-2 border">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Target Locations</label>
              <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm p-2 border" placeholder="e.g. Lagos, Abuja (comma separated)" />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Target Channels</label>
             <div className="grid grid-cols-2 gap-2">
               {['Billboard', 'Television', 'Radio', 'Social Media', 'Website', 'Poster'].map(ch => (
                 <label key={ch} className="flex items-center">
                   <input type="checkbox" className="h-4 w-4 text-[#1e3a5f] focus:ring-[#1e3a5f] border-gray-300 rounded" />
                   <span className="ml-2 text-sm text-gray-700">{ch}</span>
                 </label>
               ))}
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date *</label>
              <input required type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date *</label>
              <input required type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm p-2 border" />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={() => navigate('/alerts')}>Cancel</Button>
            <Button type="submit" isLoading={loading}>Broadcast Alert</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

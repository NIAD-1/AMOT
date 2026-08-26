import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export const AlertDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alert Details</h1>
        </div>
      </div>

      <Card>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Unapproved COVID-19 Cure Claims</h2>
            <p className="text-sm text-gray-500 mt-1">Active: Aug 1, 2026 - Sep 1, 2026</p>
          </div>
          <Badge variant="danger">Urgent</Badge>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1 text-gray-900">
              There have been reports of an unregistered product "ViralX Syrup" claiming to cure COVID-19. 
              Please monitor all channels, especially social media and local radio stations.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Target Product</h3>
              <p className="mt-1 font-medium text-gray-900">ViralX Syrup</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Manufacturer</h3>
              <p className="mt-1 text-gray-900">Unknown</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Target Channels</h3>
              <div className="mt-1 flex flex-wrap gap-2">
                <Badge variant="neutral">Social Media</Badge>
                <Badge variant="neutral">Radio</Badge>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Locations</h3>
              <p className="mt-1 text-gray-900">Nationwide</p>
            </div>
          </div>

          <div className="border-t pt-4">
             <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
             <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-[#1e3a5f] h-2.5 rounded-full" style={{ width: '45%' }}></div>
             </div>
             <p className="text-xs text-gray-500 mt-1">45% of officers acknowledged (45/100)</p>
          </div>

          <div className="pt-4 flex space-x-4">
            <Button variant="secondary" className="flex-1">Acknowledge Alert</Button>
            <Button className="flex-1" onClick={() => navigate(`/capture?alertId=${id}`)}>Report Sighting</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

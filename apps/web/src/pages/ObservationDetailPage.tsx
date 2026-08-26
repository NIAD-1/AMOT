import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, MapPin, ExternalLink, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

export const ObservationDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{id}</h1>
          <p className="text-sm text-gray-500">Captured on Aug 26, 2026 • by John Doe</p>
        </div>
        <div className="ml-auto flex space-x-2">
          <Badge variant="info">Spontaneous</Badge>
          <Badge variant="warning">Pending Review</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card title="Evidence">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                <ImageIcon className="w-12 h-12 text-gray-400" />
                <span className="sr-only">Image 1</span>
              </div>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                <ImageIcon className="w-12 h-12 text-gray-400" />
                <span className="sr-only">Image 2</span>
              </div>
            </div>
          </Card>

          <Card title="Observed Metadata">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Medium</dt>
                <dd className="mt-1 text-sm text-gray-900">Billboard</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                  <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                  Lagos-Ibadan Expressway, Lagos
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Officer Notes</dt>
                <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  Large billboard found near the toll gate. Artwork appears different from last month.
                </dd>
              </div>
            </dl>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Product Information">
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Product Name</dt>
                <dd className="mt-1 text-base text-gray-900 font-medium">VitaGlow Supplement</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Manufacturer</dt>
                <dd className="mt-1 text-sm text-gray-900">HealthPlus Ltd</dd>
              </div>
            </dl>
          </Card>

          <Card title="Review Action" className="border-amber-200 bg-amber-50">
            <div className="text-center p-2">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-sm text-amber-800 mb-4">This observation requires regulatory review against NAPAMS records.</p>
              <Button fullWidth onClick={() => navigate(`/observations/${id}/review`)}>
                Review & Compare
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

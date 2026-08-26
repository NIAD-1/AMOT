import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Check, AlertTriangle, Info } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

export const ReviewPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [decision, setDecision] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Review Observation: {id}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel: Observation */}
        <Card title="Observed Advertisement (Field)" className="border-l-4 border-l-[#1e3a5f]">
          <div className="space-y-4">
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gray-300 flex items-center justify-center text-gray-500">
                [Evidence Image]
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="block text-gray-500">Observed Product</span>
                <strong className="block text-gray-900">VitaGlow Supplement</strong>
              </div>
              <div>
                <span className="block text-gray-500">Medium</span>
                <strong className="block text-gray-900">Billboard</strong>
              </div>
              <div className="col-span-2">
                <span className="block text-gray-500">Extracted Text (OCR)</span>
                <div className="bg-gray-50 p-2 text-gray-700 rounded text-xs font-mono mt-1">
                  "GET 100% IMMUNITY BOOST. CURES ALL AILMENTS. BUY NOW!"
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Right Panel: NAPAMS */}
        <Card title="Approved Advertisement (NAPAMS)" className="border-l-4 border-l-green-500">
          <div className="space-y-4">
            <div className="aspect-video bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center p-4 text-center">
              <div>
                <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Match Found</p>
                <p className="text-sm text-gray-500">NAPAMS App. No: NAF/ADV/12345</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="block text-gray-500">Approved Product</span>
                <strong className="block text-gray-900">VitaGlow Supplement</strong>
              </div>
              <div>
                <span className="block text-gray-500">Status</span>
                <Badge variant="success" className="mt-1">Active Approval</Badge>
              </div>
              <div className="col-span-2">
                <span className="block text-gray-500">Approved Claims</span>
                <div className="bg-green-50 p-2 text-gray-700 rounded text-xs font-mono mt-1 border border-green-100">
                  "Supports immune system. Dietary supplement."
                </div>
              </div>
            </div>

            <Button variant="secondary" size="sm" fullWidth className="mt-4">
              <ExternalLink className="w-4 h-4 mr-2" /> Open Full NAPAMS Record
            </Button>
          </div>
        </Card>
      </div>

      {/* Discrepancy Summary */}
      <Card title="System Analysis & Discrepancies">
        <ul className="space-y-3">
          <li className="flex items-start">
            <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <span className="font-medium text-gray-900">Product Match</span>
              <p className="text-sm text-gray-500">Product name matches approved record.</p>
            </div>
          </li>
          <li className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <span className="font-medium text-gray-900">Unapproved Claims Detected</span>
              <p className="text-sm text-amber-700">Observed text contains "CURES ALL AILMENTS" which is absent from approved claims.</p>
            </div>
          </li>
        </ul>
      </Card>

      {/* Decision Form */}
      <Card title="Regulatory Decision">
        <form className="space-y-6">
          <div>
            <label className="text-base font-medium text-gray-900">Final Verdict</label>
            <div className="mt-3 space-y-3">
              {[
                { id: 'compliant', label: 'Confirmed Compliant', desc: 'Matches approved record exactly.' },
                { id: 'non_compliant', label: 'Confirmed Non-Compliant', desc: 'Violates NAFDAC regulations or unapproved.' },
                { id: 'further_review', label: 'Requires Further Review', desc: 'Needs additional investigation.' },
              ].map((opt) => (
                <label key={opt.id} className={`flex items-start p-4 border rounded-lg cursor-pointer ${decision === opt.id ? 'border-[#1e3a5f] bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="decision"
                    value={opt.id}
                    checked={decision === opt.id}
                    onChange={(e) => setDecision(e.target.value)}
                    className="mt-1 h-4 w-4 text-[#1e3a5f] focus:ring-[#1e3a5f] border-gray-300"
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-medium text-gray-900">{opt.label}</span>
                    <span className="block text-sm text-gray-500">{opt.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">Justification Notes <span className="text-red-500">*</span></label>
            <textarea
              rows={4}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm p-3 border"
              placeholder="Provide reason for the decision..."
            />
          </div>

          <div className="flex space-x-4 pt-4 border-t border-gray-200">
            <Button type="button" variant="danger">Escalate to Supervisor</Button>
            <div className="flex-1"></div>
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" disabled={!decision || !notes}>Submit Decision</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

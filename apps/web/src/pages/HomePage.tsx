import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  CalendarCheck, 
  LayoutDashboard, 
  RefreshCw
} from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useAuthStore } from '../stores/auth.store';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isOnline } = useOnlineStatus();
  const { user } = useAuthStore();

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-4 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1e3a5f] tracking-tight">
            Advert Surveillance Platform
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome, <span className="font-semibold text-gray-800">{user?.firstName || 'Officer'} {user?.lastName || ''}</span>
          </p>
        </div>

        {/* Sync Status Badge */}
        <div className="flex items-center space-x-2 bg-white px-3.5 py-1.5 rounded-full shadow-sm border border-gray-200 self-start md:self-auto">
          <RefreshCw className={`w-3.5 h-3.5 ${isOnline ? 'text-green-500' : 'text-amber-500 animate-spin'}`} />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">SYNC:</span>
          {isOnline ? (
            <span className="text-xs font-bold text-green-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> Online & Synced
            </span>
          ) : (
            <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Offline Ready
            </span>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          THE 3 CLEAN, BOLD ACTION CARDS (NO VERBOSE PARAGRAPHS)
         ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">

        {/* CARD 1: CAPTURE ADVERT */}
        <button
          onClick={() => navigate('/capture')}
          className="bg-white hover:bg-amber-50/60 rounded-2xl p-8 shadow-sm hover:shadow-xl border-2 border-amber-400 hover:border-amber-500 transition-all hover:-translate-y-1.5 active:translate-y-0 cursor-pointer flex flex-col items-center justify-center text-center group min-h-[260px] relative overflow-hidden"
        >
          <div className="w-20 h-20 bg-[#f59e0b] text-[#1e3a5f] rounded-2xl flex items-center justify-center shadow-md mb-6 group-hover:scale-110 transition-transform">
            <Camera className="w-11 h-11" strokeWidth={2} />
          </div>

          <h2 className="text-2xl font-black text-[#1e3a5f] uppercase tracking-wide group-hover:text-amber-600 transition-colors">
            Capture Advert
          </h2>
          <span className="text-xs font-bold text-amber-600 mt-2 uppercase tracking-wider">
            1-Tap Camera / Upload
          </span>
        </button>

        {/* CARD 2: SCHEDULED ADVERT */}
        <button
          onClick={() => navigate('/assignments')}
          className="bg-white hover:bg-blue-50/60 rounded-2xl p-8 shadow-sm hover:shadow-xl border-2 border-blue-400 hover:border-blue-500 transition-all hover:-translate-y-1.5 active:translate-y-0 cursor-pointer flex flex-col items-center justify-center text-center group min-h-[260px] relative overflow-hidden"
        >
          <div className="w-20 h-20 bg-[#1e3a5f] text-[#f59e0b] rounded-2xl flex items-center justify-center shadow-md mb-6 group-hover:scale-110 transition-transform">
            <CalendarCheck className="w-11 h-11" strokeWidth={2} />
          </div>

          <h2 className="text-2xl font-black text-[#1e3a5f] uppercase tracking-wide group-hover:text-blue-600 transition-colors">
            Scheduled Advert
          </h2>
          <span className="text-xs font-bold text-blue-600 mt-2 uppercase tracking-wider">
            Excel Monitoring Tasks
          </span>
        </button>

        {/* CARD 3: MY DASHBOARD */}
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-white hover:bg-emerald-50/60 rounded-2xl p-8 shadow-sm hover:shadow-xl border-2 border-emerald-400 hover:border-emerald-500 transition-all hover:-translate-y-1.5 active:translate-y-0 cursor-pointer flex flex-col items-center justify-center text-center group min-h-[260px] relative overflow-hidden"
        >
          <div className="w-20 h-20 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-md mb-6 group-hover:scale-110 transition-transform">
            <LayoutDashboard className="w-11 h-11" strokeWidth={2} />
          </div>

          <h2 className="text-2xl font-black text-[#1e3a5f] uppercase tracking-wide group-hover:text-emerald-600 transition-colors">
            My Dashboard
          </h2>
          <span className="text-xs font-bold text-emerald-600 mt-2 uppercase tracking-wider">
            Metrics & Analytics
          </span>
        </button>

      </div>
    </div>
  );
};

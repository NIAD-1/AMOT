import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Camera, ClipboardList, Bell, ShieldCheck } from 'lucide-react';

export const MobileNav: React.FC = () => {
  return (
    <nav className="bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] pb-safe relative z-50">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-3">
        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
              isActive ? 'text-[#1e3a5f] font-bold scale-105' : 'text-slate-400 hover:text-slate-700'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-blue-50' : ''}`}>
                <Home className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">Home</span>
            </>
          )}
        </NavLink>

        {/* Tasks / Assignments */}
        <NavLink
          to="/assignments"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
              isActive ? 'text-[#1e3a5f] font-bold scale-105' : 'text-slate-400 hover:text-slate-700'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-blue-50' : ''}`}>
                <ClipboardList className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">Tasks</span>
            </>
          )}
        </NavLink>

        {/* Center Prominent CAPTURE Button */}
        <NavLink
          to="/capture"
          className="flex flex-col items-center justify-center -mt-6 group focus:outline-none"
        >
          {({ isActive }) => (
            <div className="flex flex-col items-center">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 active:scale-95 ${
                isActive 
                  ? 'bg-amber-500 text-white ring-4 ring-amber-100 shadow-amber-500/30' 
                  : 'bg-[#1e3a5f] text-white ring-4 ring-slate-100 shadow-blue-900/30'
              }`}>
                <Camera className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-[#1e3a5f] mt-1">Capture</span>
            </div>
          )}
        </NavLink>

        {/* Observations / Verification */}
        <NavLink
          to="/observations"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
              isActive ? 'text-[#1e3a5f] font-bold scale-105' : 'text-slate-400 hover:text-slate-700'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-blue-50' : ''}`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">Logs</span>
            </>
          )}
        </NavLink>

        {/* Alerts */}
        <NavLink
          to="/alerts"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
              isActive ? 'text-[#1e3a5f] font-bold scale-105' : 'text-slate-400 hover:text-slate-700'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`p-1 rounded-xl transition-colors relative ${isActive ? 'bg-blue-50' : ''}`}>
                <Bell className="w-5 h-5" />
                <span className="absolute 0 top-0.5 right-0.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white"></span>
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">Alerts</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
};


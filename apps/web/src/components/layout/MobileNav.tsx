import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Camera, ClipboardList, Bell, Menu } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const tabs = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/capture', icon: Camera, label: 'Capture' },
    { to: '/assignments', icon: ClipboardList, label: 'Tasks' },
    { to: '/alerts', icon: Bell, label: 'Alerts' },
  ];

  return (
    <div className="bg-white border-t border-gray-200 pb-safe">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-[#1e3a5f]' : 'text-gray-500 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <tab.icon className={`w-5 h-5 ${isActive ? 'text-[#1e3a5f]' : 'text-gray-500'}`} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
        {/* 'More' tab could trigger a slide-over menu for other routes */}
        <button className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500 hover:text-gray-900">
          <Menu className="w-5 h-5 text-gray-500" />
          <span className="text-[10px] font-medium">Menu</span>
        </button>
      </div>
    </div>
  );
};

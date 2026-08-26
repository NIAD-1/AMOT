import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Camera, ClipboardList, Bell, Search, 
  BarChart2, AlertTriangle, Users, Database, FileSpreadsheet
} from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';

export const Sidebar: React.FC = () => {
  const { hasRole } = useAuthStore();

  const links = [
    { to: '/', icon: Home, label: 'Home', roles: ['OFFICER', 'ADVERT_TEAM', 'SUPERVISOR', 'ADMIN'] },
    { to: '/capture', icon: Camera, label: 'Capture Advert', roles: ['OFFICER', 'ADVERT_TEAM', 'SUPERVISOR', 'ADMIN'] },
    { to: '/assignments', icon: ClipboardList, label: 'My Tasks', roles: ['OFFICER', 'ADVERT_TEAM', 'SUPERVISOR', 'ADMIN'] },
    { to: '/alerts', icon: Bell, label: 'Alerts', roles: ['OFFICER', 'ADVERT_TEAM', 'SUPERVISOR', 'ADMIN'] },
    { to: '/observations', icon: Search, label: 'Observations', roles: ['OFFICER', 'ADVERT_TEAM', 'SUPERVISOR', 'ADMIN'] },
    
    // Advert Team+
    { to: '/alerts/create', icon: AlertTriangle, label: 'Create Alert', roles: ['ADVERT_TEAM', 'SUPERVISOR', 'ADMIN'] },
    { to: '/admin/imports', icon: FileSpreadsheet, label: 'Import Schedule', roles: ['ADVERT_TEAM', 'SUPERVISOR', 'ADMIN'] },
    
    // Supervisor+
    { to: '/dashboard', icon: BarChart2, label: 'Dashboard', roles: ['SUPERVISOR', 'ADMIN'] },
    { to: '/escalations', icon: AlertTriangle, label: 'Escalations', roles: ['SUPERVISOR', 'ADMIN'] },
    
    // Admin only
    { to: '/admin/users', icon: Users, label: 'Users', roles: ['ADMIN'] },
    { to: '/admin/napams', icon: Database, label: 'NAPAMS Sync', roles: ['ADMIN'] },
  ];

  const visibleLinks = links.filter(link => {
    // If no user/roles set in mock, just show it or check properly
    return hasRole(link.roles);
  });

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <span className="text-2xl font-bold text-[#1e3a5f] tracking-tight">AMOT</span>
        <span className="ml-2 text-xs font-medium text-gray-500 mt-1">by NAFDAC</span>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {visibleLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#1e3a5f] text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <link.icon className={`w-5 h-5 mr-3 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    {link.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

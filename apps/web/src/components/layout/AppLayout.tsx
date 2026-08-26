import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { Bell, User, WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useAuthStore } from '../../stores/auth.store';

export const AppLayout: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const { user, logout } = useAuthStore();
  const [showProfile, setShowProfile] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0 border-r border-gray-200 bg-white z-20">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 z-10">
          {!isOnline && (
            <div className="bg-yellow-50 p-2 flex items-center justify-center text-yellow-800 text-sm font-medium">
              <WifiOff className="w-4 h-4 mr-2" />
              You are currently offline. Some features may be limited.
            </div>
          )}
          <div className="h-16 px-4 flex items-center justify-between">
            <div className="md:hidden flex items-center">
              <span className="text-xl font-bold text-[#1e3a5f] tracking-tight">AMOT</span>
            </div>
            <div className="hidden md:block">
              {/* Optional breadcrumbs or page title */}
            </div>
            
            <div className="flex items-center space-x-4 ml-auto">
              <button className="p-2 text-gray-500 hover:text-gray-900 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  onClick={() => setShowProfile(!showProfile)}
                >
                  <div className="w-8 h-8 bg-[#1e3a5f] rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
                  </div>
                </button>
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setShowProfile(false);
                        logout();
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-20">
        <MobileNav />
      </div>
    </div>
  );
};

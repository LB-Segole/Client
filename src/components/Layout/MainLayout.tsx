import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Phone, 
  ListChecks, 
  Settings, 
  LogOut,
  Menu,
  X,
  User,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: '/campaigns', name: 'Campaigns', icon: <ListChecks className="h-5 w-5" /> },
    { path: '/call-history', name: 'Call History', icon: <Phone className="h-5 w-5" /> },
    { path: '/call-center', name: 'Call Center', icon: <Phone className="h-5 w-5" /> },
    { path: '/settings', name: 'Settings', icon: <Settings className="h-5 w-5" /> },
    { path: '/ai-agent', name: 'AI Agent', icon: <ListChecks className="h-5 w-5" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex w-64 flex-col bg-gray-900 text-white">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">AIVoiceCaller</h1>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <button 
                  onClick={() => navigate(item.path)}
                  className={`flex items-center w-full p-3 rounded-md transition-colors ${
                    location.pathname === item.path
                      ? 'bg-indigo-600 text-white'
                      : 'hover:bg-gray-800'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-700">
          {user && (
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-3 uppercase">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="font-medium truncate">{user.name}</p>
                <p className="text-sm text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
          )}
          <Button 
            variant="destructive" 
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-20 border-b">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-700"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <h1 className="text-xl font-bold">AIVoiceCaller</h1>
          
          <div className="flex items-center">
            <button className="p-2">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2">
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-900 bg-opacity-50 z-10">
          <div className="w-64 h-full bg-gray-900 text-white p-4 transform transition-transform">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-xl font-bold">AIVoiceCaller</h1>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <nav className="mb-8">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <button 
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center w-full p-3 rounded-md transition-colors ${
                        location.pathname === item.path
                          ? 'bg-indigo-600 text-white'
                          : 'hover:bg-gray-800'
                      }`}
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="border-t border-gray-700 pt-4">
              {user && (
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-3 uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                </div>
              )}
              <Button 
                variant="destructive" 
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Desktop */}
        <header className="hidden md:flex h-16 border-b bg-white items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold">
              {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Bell className="h-5 w-5" />
            </button>
            <span className="w-px h-6 bg-gray-300"></span>
            <div className="flex items-center">
              <span className="font-medium mr-2">{user?.name}</span>
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white uppercase">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 overflow-auto p-6 md:p-8 pt-20 md:pt-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
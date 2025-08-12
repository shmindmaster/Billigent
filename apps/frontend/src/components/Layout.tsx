import UserBadge from '@/components/shared/UserBadge';
import { useAuth } from '@/contexts/AuthContext';
import {
    BarChart3,
    Briefcase,
    Database,
    FileText,
    LayoutDashboard,
    LogOut,
    Menu,
    MessageSquare,
    Settings,
    Stethoscope,
    X
} from 'lucide-react';
import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

const Layout: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    // In a real app, this would clear authentication tokens
    // TODO: Implement proper authentication flow
    // navigate('/login');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      description: 'KPIs, task summaries, and alerts'
    },
    {
      name: 'Case Management',
      path: '/cases',
      icon: Briefcase,
      description: 'Universal search hub for all cases, patients, and claims'
    },
    {
      name: 'Pre-Bill Review',
      path: '/pre-bill',
      icon: MessageSquare,
      description: 'AI CDI opportunities and worklist'
    },
    {
      name: 'Denials',
      path: '/denials',
      icon: FileText,
      description: 'Appeals and denial workflows'
    },
    {
      name: 'Queries',
      path: '/queries',
      icon: Stethoscope,
      description: 'Physician queries and CDI reviews'
    },
    {
      name: 'Reports & Analytics',
      path: '/analytics',
      icon: BarChart3,
      description: 'Historical reporting and trends'
    },
    {
      name: 'Data Explorer',
      path: '/data-explorer',
      icon: Database,
      description: 'Browse silver/gold datasets'
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
      description: 'System configuration and admin'
    }
  ];

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Skip to content for keyboard users */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 px-3 py-2 rounded bg-primary text-primary-foreground">
        Skip to content
      </a>
      
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className={`md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg ${
          theme === 'dark' 
            ? 'bg-gray-800 text-white hover:bg-gray-700' 
            : 'bg-white text-gray-900 hover:bg-gray-50'
        } shadow-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-64 border-r flex flex-col transition-transform duration-300 ease-in-out ${
        theme === 'dark' 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        {/* Logo/Brand */}
        <div className={`p-6 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Billigent</h1>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
              }`}>Healthcare Billing</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${theme === 'dark' ? 'focus-visible:ring-offset-gray-900' : 'focus-visible:ring-offset-white'} ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg cursor-default hover:bg-blue-600 hover:text-white'
                        : theme === 'dark' 
                          ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 mr-3 transition-colors duration-200" />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div
                      className={`text-xs mt-0.5 ${
                        theme === 'dark'
                          ? 'text-gray-400 group-aria-[current=page]:text-white/90'
                          : 'text-gray-700 group-aria-[current=page]:text-white/90'
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className={`p-4 border-t space-y-3 ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {/* Theme Toggle */}
          <div className="flex items-center justify-center">
            <ThemeToggle />
          </div>
          
          <div className="flex flex-col">
            <UserBadge user={{ name: user.fullName, email: user.email }} />
          </div>
          
          <button
            onClick={handleSignOut}
            className={`w-full flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 group ${
              theme === 'dark' 
                ? 'text-gray-400 hover:bg-gray-800 hover:text-white' 
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden md:ml-0">
        <main className={`h-full overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} md:pl-0 pt-16 md:pt-0`} id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
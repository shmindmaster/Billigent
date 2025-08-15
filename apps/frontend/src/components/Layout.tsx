import UserBadge from '@/components/shared/UserBadge';
import {
    BarChart3,
    Briefcase,
    Database,
    FileText,
    LayoutDashboard,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Cases',
      path: '/cases',
      icon: Briefcase
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: BarChart3
    },
    {
      name: 'Denials',
      path: '/denials',
      icon: FileText
    },
    {
      name: 'Pre-Bill Review',
      path: '/pre-bill',
      icon: Stethoscope
    },
    {
      name: 'Queries',
      path: '/queries',
      icon: MessageSquare
    },
    {
      name: 'Data Explorer',
      path: '/explorer',
      icon: Database
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-r ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        
        {/* Logo and close button */}
        <div className="flex items-center justify-between p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Billigent
            </span>
          </div>
          
          <button
            onClick={closeMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={({ isActive }) => `
                  flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group
                  ${isActive 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                    : theme === 'dark' 
                      ? 'text-gray-400 hover:bg-gray-800 hover:text-white' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className={`p-4 border-t space-y-3 ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {/* Theme Toggle */}
          <div className="flex items-center justify-center">
            <ThemeToggle />
          </div>
          
          <div className="flex flex-col">
            <UserBadge user={{ name: 'System User', email: 'system@billigent.com' }} />
          </div>
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
// src/components/templates/MainLayout.jsx

import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Sidebar from '../organisms/Sidebar';
import Header from '../organisms/Header';
import { AlertCircle, X } from 'lucide-react';

/**
 * MainLayout Component - Template
 * Main application layout with sidebar, header, and content area
 * Used as the base layout for all pages
 */
const MainLayout = ({ 
  children,
  showSidebar = true,
  showHeader = true,
  fluid = false,
  className = '',
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notification, setNotification] = useState(null);
  const location = useLocation();

  // Initialize dark mode
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true' || 
      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    if (window.innerWidth < 1024) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  // Show notification
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Notification component
  const NotificationBanner = () => {
    if (!notification) return null;

    const colors = {
      info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200',
      success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
      error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
    };

    return (
      <div className={`fixed top-20 right-4 z-50 max-w-md animate-slide-in`}>
        <div className={`flex items-start gap-3 p-4 rounded-lg border ${colors[notification.type]} shadow-lg`}>
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="flex-1 text-sm font-medium">
            {notification.message}
          </p>
          <button
            onClick={() => setNotification(null)}
            className="flex-shrink-0 hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        {showSidebar && (
          <>
            {/* Desktop Sidebar */}
            <div className={`hidden lg:block transition-all duration-300 ${
              isSidebarOpen ? 'w-64' : 'w-20'
            }`}>
              <Sidebar
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
              />
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setIsMobileSidebarOpen(false)}
              />
            )}

            {/* Mobile Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:hidden ${
              isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
              <Sidebar
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                isOpen={true}
                onToggle={() => setIsMobileSidebarOpen(false)}
              />
            </div>
          </>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          {showHeader && (
            <Header
              onMenuClick={handleSidebarToggle}
              showSearch={true}
              showNotifications={true}
              showUserMenu={true}
              user={{
                name: 'Master',
                role: 'Student',
                avatar: null
              }}
              onSearch={(query) => console.log('Search:', query)}
              onNotificationClick={(notif) => console.log('Notification:', notif)}
              onSettingsClick={() => console.log('Settings clicked')}
              onProfileClick={() => console.log('Profile clicked')}
              onLogout={() => console.log('Logout clicked')}
            />
          )}

          {/* Page Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className={`${fluid ? 'w-full' : 'container mx-auto'} px-4 sm:px-6 lg:px-8 py-6`}>
              {/* Breadcrumb */}
              <nav className="flex mb-4 text-sm" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                  <li className="inline-flex items-center">
                    <a href="/" className="text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                      Home
                    </a>
                  </li>
                  {location.pathname !== '/' && (
                    <>
                      <li>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="ml-1 text-gray-500 dark:text-gray-400 capitalize">
                            {location.pathname.split('/')[1] || 'Page'}
                          </span>
                        </div>
                      </li>
                    </>
                  )}
                </ol>
              </nav>

              {/* Page Content */}
              {children || <Outlet context={{ showNotification }} />}
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>© 2024 Cryptography Suite - UAS Kriptografi</p>
                  <p className="text-xs mt-1">Dinus University</p>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <a href="/docs" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                    Documentation
                  </a>
                  <a href="/about" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                    About
                  </a>
                  <a href="/contact" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Notification Banner */}
      <NotificationBanner />
    </div>
  );
};

// PropTypes
MainLayout.propTypes = {
  children: PropTypes.node,
  showSidebar: PropTypes.bool,
  showHeader: PropTypes.bool,
  fluid: PropTypes.bool,
  className: PropTypes.string,
};

export default MainLayout;
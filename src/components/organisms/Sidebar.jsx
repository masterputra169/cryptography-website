// src/components/organisms/Sidebar.jsx

import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { 
  Home, 
  BarChart3, 
  Lock, 
  Grid3x3, 
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Menu,
  X,
  Settings,
  HelpCircle
} from 'lucide-react';
import { Badge } from '../atoms';

/**
 * Sidebar Component - Organism
 * Main navigation sidebar with collapsible menu and dark mode toggle
 */
const Sidebar = ({ 
  darkMode = false,
  toggleDarkMode,
  isOpen: controlledIsOpen,
  onToggle,
  className = '',
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Use controlled or internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = onToggle || setInternalIsOpen;

  // Navigation structure
  const navigationItems = [
    {
      category: 'Main',
      items: [
        { name: 'Home', path: '/', icon: Home, badge: null },
        { name: 'Dashboard', path: '/dashboard', icon: BarChart3, badge: 'New' },
      ]
    },
    {
      category: 'Substitution Ciphers',
      icon: Lock,
      items: [
        { name: 'Caesar', path: '/caesar', description: 'Shift cipher' },
        { name: 'Vigenère', path: '/vigenere', description: 'Polyalphabetic' },
        { name: 'Beaufort', path: '/beaufort', description: 'Reversed Vigenère' },
        { name: 'Autokey', path: '/autokey', description: 'Self-extending key' },
      ]
    },
    {
      category: 'Polygram Ciphers',
      icon: Grid3x3,
      items: [
        { name: 'Playfair', path: '/playfair', description: '5×5 grid' },
        { name: 'Hill', path: '/hill', description: 'Matrix cipher' },
      ]
    },
    {
      category: 'Transposition Ciphers',
      icon: Shuffle,
      items: [
        { name: 'Rail Fence', path: '/railfence', description: 'Zigzag pattern' },
        { name: 'Columnar', path: '/columnar', description: 'Column rearrangement' },
        { name: 'Myszkowski', path: '/myszkowski', description: 'Grouped columns' },
        { name: 'Double', path: '/double', description: 'Two-pass transposition' },
      ]
    }
  ];

  // Nav link component
  const NavLink = ({ item, indent = false }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    return (
      <Link
        to={item.path}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
          indent ? 'ml-4' : ''
        } ${
          isActive
            ? 'bg-primary-600 text-white shadow-lg scale-105'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
        onClick={() => setIsMobileOpen(false)}
      >
        {Icon && (
          <Icon 
            size={20} 
            className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}
          />
        )}
        {isOpen && (
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium block truncate">{item.name}</span>
            {item.description && (
              <span className="text-xs opacity-75 block truncate">
                {item.description}
              </span>
            )}
          </div>
        )}
        {isOpen && item.badge && (
          <Badge variant="success" size="sm">
            {item.badge}
          </Badge>
        )}
      </Link>
    );
  };

  // Sidebar content
  const sidebarContent = (
    <>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {isOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <Lock size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  Crypto Suite
                </h1>
                <p className="text-xs text-gray-400">v1.0.0</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors hidden lg:block"
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin">
        <div className="space-y-6">
          {navigationItems.map((section, idx) => (
            <div key={idx}>
              {isOpen && (
                <h3 className="flex items-center gap-2 px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {section.icon && <section.icon size={14} />}
                  {section.category}
                </h3>
              )}
              {!isOpen && section.icon && (
                <div className="flex justify-center mb-2">
                  <section.icon size={20} className="text-gray-400" />
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item, itemIdx) => (
                  <NavLink key={itemIdx} item={item} indent={!!section.icon} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-700 space-y-2">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          {isOpen && (
            <span className="text-sm font-medium">
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </button>

        {/* Settings */}
        {isOpen && (
          <>
            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 hover:text-white">
              <Settings size={20} />
              <span className="text-sm font-medium">Settings</span>
            </button>

            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 hover:text-white">
              <HelpCircle size={20} />
              <span className="text-sm font-medium">Help</span>
            </button>
          </>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg lg:hidden shadow-lg"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      {/* Desktop Sidebar */}
      <aside
        className={`${
          isOpen ? 'w-64' : 'w-20'
        } hidden lg:flex flex-col bg-gray-800 text-white transition-all duration-300 flex-shrink-0 ${className}`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          
          {/* Sidebar */}
          <aside className="fixed inset-y-0 left-0 w-64 flex flex-col bg-gray-800 text-white z-50 lg:hidden shadow-2xl">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
};

// PropTypes
Sidebar.propTypes = {
  darkMode: PropTypes.bool,
  toggleDarkMode: PropTypes.func,
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func,
  className: PropTypes.string,
};

NavLink.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    icon: PropTypes.elementType,
    description: PropTypes.string,
    badge: PropTypes.string,
  }).isRequired,
  indent: PropTypes.bool,
};

export default Sidebar;
// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './components/organisms/Sidebar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CaesarPage from './pages/substitution/CaesarPage';
import VigenerePage from './pages/substitution/VigenerePage';
import BeaufortPage from './pages/substitution/BeaufortPage';
import AutokeyPage from './pages/substitution/AutokeyPage';
import PlayfairPage from './pages/polygram/PlayfairPage';
import HillPage from './pages/polygram/HillPage';
import RailFencePage from './pages/transposition/RailFencePage';
import ColumnarPage from './pages/transposition/ColumnarPage';
import MyszkowskiPage from './pages/transposition/MyszkowskiPage';
import DoublePage from './pages/transposition/DoublePage';
import SuperEncryptionPage from './pages/advanced/SuperEncryptionPage';
import OTPPage from './pages/advanced/OTPPage';

// 404 Page Component
const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Page not found</p>
        <a 
          href="/" 
          className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true' || 
      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

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

  const handleSidebarToggle = (isOpen) => {
    setSidebarOpen(isOpen);
  };

  return (
    <Router>
      <div className={`flex min-h-screen ${darkMode ? 'dark' : ''}`}>
        {/* Sidebar */}
        <Sidebar 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode}
          onSidebarToggle={handleSidebarToggle}
        />

        {/* Main Content - Dynamic margin based on sidebar state */}
        <main className={`flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        }`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Substitution Ciphers */}
            <Route path="/caesar" element={<CaesarPage />} />
            <Route path="/vigenere" element={<VigenerePage />} />
            <Route path="/beaufort" element={<BeaufortPage />} />
            <Route path="/autokey" element={<AutokeyPage />} />
            
            {/* Polygram Ciphers */}
            <Route path="/playfair" element={<PlayfairPage />} />
            <Route path="/hill" element={<HillPage />} />
            
            {/* Transposition Ciphers */}
            <Route path="/railfence" element={<RailFencePage />} />
            <Route path="/columnar" element={<ColumnarPage />} />
            <Route path="/myszkowski" element={<MyszkowskiPage />} />
            <Route path="/double" element={<DoublePage />} />
            
            {/* Advanced Ciphers */}
            <Route path="/super-encryption" element={<SuperEncryptionPage />} />
            <Route path="/otp" element={<OTPPage />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
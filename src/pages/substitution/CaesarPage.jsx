// src/pages/substitution/CaesarPage.jsx

import { useState } from 'react';
import { caesarEncrypt, caesarDecrypt, getCaesarVisualization } from '../../utils/algorithms';
import usePerformance from '../../hooks/usePerformance';
import StatisticsPanel from '../../components/organisms/StatisticsPanel';
import { FrequencyChart } from '../../components/organisms/PerformanceChart';
import { Copy, RotateCcw, TrendingUp } from 'lucide-react';

const CaesarPage = () => {
  const [inputText, setInputText] = useState('');
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState('encrypt');
  const [result, setResult] = useState('');
  const [visualization, setVisualization] = useState(null);
  const [showStats, setShowStats] = useState(false);

  const {
    metrics,
    frequencyData,
    entropyData,
    startTracking,
    stopTracking,
    exportData,
  } = usePerformance();

  const handleProcess = () => {
    if (!inputText) {
      alert('Please enter text to process');
      return;
    }

    try {
      // Start performance tracking
      startTracking();

      let output;
      if (mode === 'encrypt') {
        output = caesarEncrypt(inputText, shift);
      } else {
        output = caesarDecrypt(inputText, shift);
      }
      
      setResult(output);
      setVisualization(getCaesarVisualization(inputText, shift));

      // Stop tracking and analyze
      stopTracking('Caesar Cipher', inputText, output);
      setShowStats(true);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleReset = () => {
    setInputText('');
    setResult('');
    setVisualization(null);
    setShowStats(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      alert('Copied to clipboard!');
    } catch (err) {
      alert('Failed to copy');
    }
  };

  const handleExport = (format) => {
    const data = exportData(format);
    const blob = new Blob([data], { 
      type: format === 'json' ? 'application/json' : 'text/csv' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `caesar-stats.${format}`;
    a.click();
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            Caesar Cipher
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Classic shift cipher - one of the earliest known encryption techniques
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Input Panel */}
          <div className="card animate-slide-up">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Input
            </h2>

            {/* Mode Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mode
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setMode('encrypt')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    mode === 'encrypt'
                      ? 'bg-primary-600 text-white shadow-lg scale-105'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Encrypt
                </button>
                <button
                  onClick={() => setMode('decrypt')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    mode === 'decrypt'
                      ? 'bg-primary-600 text-white shadow-lg scale-105'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Decrypt
                </button>
              </div>
            </div>

            {/* Text Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {mode === 'encrypt' ? 'Plaintext' : 'Ciphertext'}
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter your text here..."
                className="textarea"
                rows={6}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {inputText.length} characters
              </p>
            </div>

            {/* Shift Input */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Shift Value
                </label>
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {shift}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={shift}
                onChange={(e) => setShift(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>0</span>
                <span className="font-medium text-primary-600">13 (ROT13)</span>
                <span>25</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleProcess}
                className="flex-1 btn btn-primary flex items-center justify-center gap-2"
              >
                <TrendingUp size={18} />
                Process
              </button>
              <button
                onClick={handleReset}
                className="px-6 btn bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600 flex items-center gap-2"
              >
                <RotateCcw size={18} />
                Reset
              </button>
            </div>
          </div>

          {/* Output Panel */}
          <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Output
            </h2>

            {result ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Result
                  </label>
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-lg font-mono text-gray-800 dark:text-gray-100 break-all leading-relaxed">
                      {result}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {result.length} characters
                  </p>
                </div>

                <button
                  onClick={handleCopy}
                  className="w-full btn btn-success flex items-center justify-center gap-2"
                >
                  <Copy size={18} />
                  Copy to Clipboard
                </button>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500 py-20">
                <p>Results will appear here...</p>
              </div>
            )}
          </div>
        </div>

        {/* Visualization Panel */}
        {visualization && (
          <div className="card mb-6 animate-scale-in">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Alphabet Shift Visualization
            </h2>

            {/* Alphabet Mapping */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Original Alphabet
                </p>
                <div className="flex flex-wrap gap-1">
                  {visualization.originalAlphabet.map((char, idx) => (
                    <span
                      key={idx}
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg font-mono font-bold text-gray-700 dark:text-gray-300 transition-transform hover:scale-110"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Shifted Alphabet (K = {visualization.shift})
                </p>
                <div className="flex flex-wrap gap-1">
                  {visualization.shiftedAlphabet.map((char, idx) => (
                    <span
                      key={idx}
                      className="w-10 h-10 flex items-center justify-center bg-primary-100 dark:bg-primary-900 rounded-lg font-mono font-bold text-primary-700 dark:text-primary-300 transition-transform hover:scale-110"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Character Mapping */}
            {visualization.mapping.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Character Transformation Examples
                </h3>
                <div className="flex flex-wrap gap-2">
                  {visualization.mapping.slice(0, 15).map((map, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg border border-primary-200 dark:border-primary-800 transition-transform hover:scale-105"
                    >
                      <span className="font-mono font-bold text-lg text-gray-700 dark:text-gray-300">
                        {map.original}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="font-mono font-bold text-lg text-primary-600 dark:text-primary-400">
                        {map.encrypted}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Statistics Panel */}
        {showStats && (
          <div className="animate-fade-in">
            <StatisticsPanel
              metrics={metrics}
              frequencyData={frequencyData}
              entropyData={entropyData}
              onExport={handleExport}
            />

            {/* Frequency Chart */}
            {frequencyData && (
              <div className="mt-6">
                <FrequencyChart frequencyData={frequencyData.ciphertext} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CaesarPage;
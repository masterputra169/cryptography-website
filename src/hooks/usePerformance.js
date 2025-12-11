// src/hooks/usePerformance.js

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { getPerformanceTracker } from '../utils/statistics/performanceTracker';
import { analyzeFrequency, compareFrequency } from '../utils/statistics/frequencyAnalysis';
import { getEntropyScore, compareEntropy } from '../utils/statistics/entropyCalculator';

/**
 * usePerformance Hook
 * Custom hook for tracking and analyzing cipher performance
 */

// ==================== PROP TYPES DEFINITIONS ====================

// Metric PropTypes
const MetricPropTypes = PropTypes.shape({
  algorithm: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  executionTime: PropTypes.string.isRequired,
  inputSize: PropTypes.number.isRequired,
  outputSize: PropTypes.number.isRequired,
  throughput: PropTypes.string.isRequired,
  memoryUsed: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  efficiency: PropTypes.string.isRequired,
});

// Frequency Data PropTypes
const FrequencyItemPropTypes = PropTypes.shape({
  char: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  percentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
});

const FrequencyDataPropTypes = PropTypes.shape({
  data: PropTypes.arrayOf(FrequencyItemPropTypes).isRequired,
  total: PropTypes.number.isRequired,
  uniqueChars: PropTypes.number.isRequired,
  mostCommon: FrequencyItemPropTypes,
  leastCommon: FrequencyItemPropTypes,
});

const FrequencyComparisonPropTypes = PropTypes.shape({
  plaintext: FrequencyDataPropTypes.isRequired,
  ciphertext: FrequencyDataPropTypes.isRequired,
  analysis: PropTypes.string.isRequired,
});

// Entropy PropTypes
const EntropyScorePropTypes = PropTypes.shape({
  entropy: PropTypes.string.isRequired,
  maxEntropy: PropTypes.string.isRequired,
  score: PropTypes.string.isRequired,
  rating: PropTypes.shape({
    label: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  }).isRequired,
});

const EntropyComparisonPropTypes = PropTypes.shape({
  plaintext: EntropyScorePropTypes.isRequired,
  ciphertext: EntropyScorePropTypes.isRequired,
  improvement: PropTypes.string.isRequired,
  improvementPercent: PropTypes.string.isRequired,
  analysis: PropTypes.string.isRequired,
});

// Options PropTypes
const UsePerformanceOptionsPropTypes = PropTypes.shape({
  autoSave: PropTypes.bool,
  maxHistorySize: PropTypes.number,
  enableFrequencyAnalysis: PropTypes.bool,
  enableEntropyAnalysis: PropTypes.bool,
  trackMemory: PropTypes.bool,
  onMetricRecorded: PropTypes.func,
  onError: PropTypes.func,
});

// Statistics PropTypes
const StatisticsSummaryPropTypes = PropTypes.shape({
  totalOperations: PropTypes.number.isRequired,
  avgExecutionTime: PropTypes.string.isRequired,
  totalTime: PropTypes.string.isRequired,
  fastestOperation: PropTypes.string.isRequired,
  slowestOperation: PropTypes.string.isRequired,
  recentMetrics: PropTypes.arrayOf(MetricPropTypes).isRequired,
});

const AlgorithmStatsPropTypes = PropTypes.shape({
  count: PropTypes.number.isRequired,
  totalTime: PropTypes.string.isRequired,
  avgTime: PropTypes.string.isRequired,
  totalChars: PropTypes.number.isRequired,
  avgThroughput: PropTypes.string,
});

// Analysis Result PropTypes
const AnalysisResultPropTypes = PropTypes.shape({
  performance: MetricPropTypes.isRequired,
  frequency: FrequencyComparisonPropTypes,
  entropy: EntropyComparisonPropTypes,
});

/**
 * Main usePerformance hook
 */
const usePerformance = (options = {}) => {
  // Validate options
  if (options && typeof options !== 'object') {
    console.error('usePerformance: options must be an object');
  }

  // Default options
  const {
    autoSave = true,
    maxHistorySize = 100,
    enableFrequencyAnalysis = true,
    enableEntropyAnalysis = true,
    trackMemory = true,
    onMetricRecorded = null,
    onError = console.error,
  } = options;

  // ==================== STATE ====================

  const [currentMetric, setCurrentMetric] = useState(null);
  const [frequencyData, setFrequencyData] = useState(null);
  const [entropyData, setEntropyData] = useState(null);
  const [history, setHistory] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState(null);

  // Refs
  const trackerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Initialize tracker
  useEffect(() => {
    trackerRef.current = getPerformanceTracker();
    loadHistoryFromStorage();
  }, []);

  // ==================== STORAGE FUNCTIONS ====================

  const loadHistoryFromStorage = useCallback(() => {
    try {
      const stored = trackerRef.current?.constructor.loadFromStorage() || [];
      setHistory(stored.slice(0, maxHistorySize));
    } catch (err) {
      setError(err);
      onError('Failed to load history:', err);
    }
  }, [maxHistorySize, onError]);

  const saveToStorage = useCallback((metric) => {
    if (!autoSave) return;

    try {
      trackerRef.current?.saveToStorage(metric);
    } catch (err) {
      setError(err);
      onError('Failed to save metric:', err);
    }
  }, [autoSave, onError]);

  // ==================== TRACKING FUNCTIONS ====================

  const startTracking = useCallback(() => {
    try {
      if (isTracking) {
        console.warn('Tracking is already started');
        return;
      }

      trackerRef.current?.start();
      startTimeRef.current = performance.now();
      setIsTracking(true);
      setError(null);
    } catch (err) {
      setError(err);
      onError('Failed to start tracking:', err);
    }
  }, [isTracking, onError]);

  const stopTracking = useCallback((algorithmName, inputText, outputText) => {
    // Validate parameters
    if (typeof algorithmName !== 'string' || !algorithmName) {
      const err = new Error('stopTracking: algorithmName must be a non-empty string');
      setError(err);
      onError(err);
      return null;
    }

    if (typeof inputText !== 'string' || typeof outputText !== 'string') {
      const err = new Error('stopTracking: inputText and outputText must be strings');
      setError(err);
      onError(err);
      return null;
    }

    if (!isTracking) {
      console.warn('Tracking was not started');
      return null;
    }

    try {
      // Stop performance tracking
      const metric = trackerRef.current?.stop(
        algorithmName,
        inputText.length,
        outputText.length
      );

      if (!metric) {
        throw new Error('Failed to generate metric');
      }

      setCurrentMetric(metric);
      setIsTracking(false);

      // Analyze frequency if enabled
      let frequency = null;
      if (enableFrequencyAnalysis) {
        frequency = compareFrequency(inputText, outputText);
        setFrequencyData(frequency);
      }

      // Analyze entropy if enabled
      let entropy = null;
      if (enableEntropyAnalysis) {
        entropy = compareEntropy(inputText, outputText);
        setEntropyData(entropy);
      }

      // Update history
      loadHistoryFromStorage();

      // Update comparison data
      const comparisonData = trackerRef.current?.getAlgorithmComparison();
      setComparison(comparisonData);

      // Update statistics
      const stats = trackerRef.current?.getStatistics();
      setStatistics(stats);

      // Call callback if provided
      if (onMetricRecorded && typeof onMetricRecorded === 'function') {
        onMetricRecorded(metric, frequency, entropy);
      }

      setError(null);

      return {
        performance: metric,
        frequency,
        entropy,
      };
    } catch (err) {
      setError(err);
      onError('Failed to stop tracking:', err);
      setIsTracking(false);
      return null;
    }
  }, [
    isTracking,
    enableFrequencyAnalysis,
    enableEntropyAnalysis,
    onMetricRecorded,
    onError,
    loadHistoryFromStorage,
  ]);

  const cancelTracking = useCallback(() => {
    setIsTracking(false);
    setCurrentMetric(null);
    setFrequencyData(null);
    setEntropyData(null);
    setError(null);
  }, []);

  // ==================== ANALYSIS FUNCTIONS ====================

  const analyzeText = useCallback((text) => {
    if (typeof text !== 'string') {
      const err = new Error('analyzeText: text must be a string');
      setError(err);
      onError(err);
      return null;
    }

    try {
      const analysis = {
        frequency: null,
        entropy: null,
      };

      if (enableFrequencyAnalysis) {
        analysis.frequency = analyzeFrequency(text);
      }

      if (enableEntropyAnalysis) {
        analysis.entropy = getEntropyScore(text);
      }

      return analysis;
    } catch (err) {
      setError(err);
      onError('Failed to analyze text:', err);
      return null;
    }
  }, [enableFrequencyAnalysis, enableEntropyAnalysis, onError]);

  const compareTexts = useCallback((text1, text2) => {
    if (typeof text1 !== 'string' || typeof text2 !== 'string') {
      const err = new Error('compareTexts: both texts must be strings');
      setError(err);
      onError(err);
      return null;
    }

    try {
      const comparison = {
        frequency: null,
        entropy: null,
      };

      if (enableFrequencyAnalysis) {
        comparison.frequency = compareFrequency(text1, text2);
      }

      if (enableEntropyAnalysis) {
        comparison.entropy = compareEntropy(text1, text2);
      }

      return comparison;
    } catch (err) {
      setError(err);
      onError('Failed to compare texts:', err);
      return null;
    }
  }, [enableFrequencyAnalysis, enableEntropyAnalysis, onError]);

  // ==================== STATISTICS FUNCTIONS ====================

  const getStatistics = useCallback(() => {
    try {
      return trackerRef.current?.getStatistics() || null;
    } catch (err) {
      setError(err);
      onError('Failed to get statistics:', err);
      return null;
    }
  }, [onError]);

  const getComparison = useCallback(() => {
    try {
      return trackerRef.current?.getAlgorithmComparison() || null;
    } catch (err) {
      setError(err);
      onError('Failed to get comparison:', err);
      return null;
    }
  }, [onError]);

  const getAlgorithmStats = useCallback((algorithmName) => {
    if (typeof algorithmName !== 'string') {
      const err = new Error('getAlgorithmStats: algorithmName must be a string');
      setError(err);
      onError(err);
      return null;
    }

    try {
      const algorithmMetrics = history.filter(m => m.algorithm === algorithmName);

      if (algorithmMetrics.length === 0) return null;

      const totalTime = algorithmMetrics.reduce(
        (sum, m) => sum + parseFloat(m.executionTime),
        0
      );
      const avgTime = totalTime / algorithmMetrics.length;
      const minTime = Math.min(...algorithmMetrics.map(m => parseFloat(m.executionTime)));
      const maxTime = Math.max(...algorithmMetrics.map(m => parseFloat(m.executionTime)));

      return {
        algorithm: algorithmName,
        count: algorithmMetrics.length,
        totalTime: totalTime.toFixed(2),
        avgTime: avgTime.toFixed(2),
        minTime: minTime.toFixed(2),
        maxTime: maxTime.toFixed(2),
        recentMetrics: algorithmMetrics.slice(0, 5),
      };
    } catch (err) {
      setError(err);
      onError('Failed to get algorithm stats:', err);
      return null;
    }
  }, [history, onError]);

  const getTimeRangeStats = useCallback((startDate, endDate) => {
    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
      const err = new Error('getTimeRangeStats: dates must be Date objects');
      setError(err);
      onError(err);
      return null;
    }

    try {
      const start = startDate.getTime();
      const end = endDate.getTime();

      const rangeMetrics = history.filter(m => {
        const timestamp = new Date(m.timestamp).getTime();
        return timestamp >= start && timestamp <= end;
      });

      return {
        count: rangeMetrics.length,
        metrics: rangeMetrics,
        algorithms: [...new Set(rangeMetrics.map(m => m.algorithm))],
      };
    } catch (err) {
      setError(err);
      onError('Failed to get time range stats:', err);
      return null;
    }
  }, [history, onError]);

  // ==================== DATA MANAGEMENT ====================

  const clearData = useCallback(() => {
    try {
      trackerRef.current?.clear();
      setCurrentMetric(null);
      setFrequencyData(null);
      setEntropyData(null);
      setHistory([]);
      setStatistics(null);
      setComparison(null);
      setError(null);
    } catch (err) {
      setError(err);
      onError('Failed to clear data:', err);
    }
  }, [onError]);

  const clearAlgorithmData = useCallback((algorithmName) => {
    if (typeof algorithmName !== 'string') {
      const err = new Error('clearAlgorithmData: algorithmName must be a string');
      setError(err);
      onError(err);
      return;
    }

    try {
      const newHistory = history.filter(m => m.algorithm !== algorithmName);
      setHistory(newHistory);

      // Update localStorage
      localStorage.setItem('cryptoMetrics', JSON.stringify(newHistory));

      // Reload statistics
      loadHistoryFromStorage();
    } catch (err) {
      setError(err);
      onError('Failed to clear algorithm data:', err);
    }
  }, [history, onError, loadHistoryFromStorage]);

  const exportData = useCallback((format = 'json') => {
    if (format !== 'json' && format !== 'csv') {
      const err = new Error('exportData: format must be "json" or "csv"');
      setError(err);
      onError(err);
      return null;
    }

    try {
      if (format === 'json') {
        return trackerRef.current?.exportJSON() || null;
      } else if (format === 'csv') {
        return trackerRef.current?.exportCSV() || null;
      }
      return null;
    } catch (err) {
      setError(err);
      onError('Failed to export data:', err);
      return null;
    }
  }, [onError]);

  const importData = useCallback((data, format = 'json') => {
    if (typeof data !== 'string') {
      const err = new Error('importData: data must be a string');
      setError(err);
      onError(err);
      return false;
    }

    if (format !== 'json' && format !== 'csv') {
      const err = new Error('importData: format must be "json" or "csv"');
      setError(err);
      onError(err);
      return false;
    }

    try {
      if (format === 'json') {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          setHistory(parsed.slice(0, maxHistorySize));
          localStorage.setItem('cryptoMetrics', JSON.stringify(parsed));
          loadHistoryFromStorage();
          return true;
        }
      }
      return false;
    } catch (err) {
      setError(err);
      onError('Failed to import data:', err);
      return false;
    }
  }, [maxHistorySize, onError, loadHistoryFromStorage]);

  // ==================== COMPUTED VALUES ====================

  const hasData = useMemo(() => {
    return history.length > 0;
  }, [history]);

  const isAnalyzing = useMemo(() => {
    return isTracking;
  }, [isTracking]);

  const latestMetric = useMemo(() => {
    return history[0] || null;
  }, [history]);

  const topPerformingAlgorithms = useMemo(() => {
    if (!comparison) return [];

    return Object.entries(comparison)
      .map(([name, stats]) => ({
        name,
        ...stats,
      }))
      .sort((a, b) => parseFloat(a.avgTime) - parseFloat(b.avgTime))
      .slice(0, 5);
  }, [comparison]);

  const mostUsedAlgorithms = useMemo(() => {
    if (!comparison) return [];

    return Object.entries(comparison)
      .map(([name, stats]) => ({
        name,
        ...stats,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [comparison]);

  // ==================== RETURN ====================

  return {
    // State
    currentMetric,
    frequencyData,
    entropyData,
    history,
    statistics,
    comparison,
    isTracking,
    error,

    // Tracking
    startTracking,
    stopTracking,
    cancelTracking,

    // Analysis
    analyzeText,
    compareTexts,

    // Statistics
    getStatistics,
    getComparison,
    getAlgorithmStats,
    getTimeRangeStats,

    // Data management
    clearData,
    clearAlgorithmData,
    exportData,
    importData,
    loadHistoryFromStorage,

    // Computed values
    hasData,
    isAnalyzing,
    latestMetric,
    topPerformingAlgorithms,
    mostUsedAlgorithms,
  };
};

// Export PropTypes
export {
  UsePerformanceOptionsPropTypes,
  MetricPropTypes,
  FrequencyItemPropTypes,
  FrequencyDataPropTypes,
  FrequencyComparisonPropTypes,
  EntropyScorePropTypes,
  EntropyComparisonPropTypes,
  StatisticsSummaryPropTypes,
  AlgorithmStatsPropTypes,
  AnalysisResultPropTypes,
};

export default usePerformance;
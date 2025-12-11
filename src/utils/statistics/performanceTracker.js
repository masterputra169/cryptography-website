// src/utils/statistics/performanceTracker.js

/**
 * Performance Tracker untuk mengukur kinerja algoritma kriptografi
 */

export class PerformanceTracker {
  constructor() {
    this.metrics = [];
    this.startTime = null;
    this.endTime = null;
  }

  // Mulai tracking
  start() {
    this.startTime = performance.now();
    this.memoryStart = performance.memory ? performance.memory.usedJSHeapSize : 0;
  }

  // Stop tracking dan hitung metrics
  stop(algorithmName, inputSize, outputSize) {
    this.endTime = performance.now();
    this.memoryEnd = performance.memory ? performance.memory.usedJSHeapSize : 0;

    const executionTime = this.endTime - this.startTime;
    const memoryUsed = this.memoryEnd - this.memoryStart;

    const metric = {
      algorithm: algorithmName,
      timestamp: new Date().toISOString(),
      executionTime: executionTime.toFixed(2), // milliseconds
      inputSize,
      outputSize,
      throughput: (inputSize / (executionTime / 1000)).toFixed(2), // chars/second
      memoryUsed: memoryUsed > 0 ? (memoryUsed / 1024).toFixed(2) : 'N/A', // KB
      efficiency: this.calculateEfficiency(executionTime, inputSize),
    };

    this.metrics.push(metric);
    this.saveToStorage(metric);

    return metric;
  }

  // Calculate efficiency score (0-100)
  calculateEfficiency(executionTime, inputSize) {
    // Lower time + higher input = better efficiency
    const baseScore = 100;
    const timePenalty = Math.min(executionTime / 10, 50); // Max 50 point penalty
    const sizeFactor = Math.log10(Math.max(inputSize, 1)) * 5; // Bonus for larger inputs
    
    const efficiency = Math.max(0, Math.min(100, baseScore - timePenalty + sizeFactor));
    return efficiency.toFixed(2);
  }

  // Get statistics summary
  getStatistics() {
    if (this.metrics.length === 0) return null;

    const totalExecutionTime = this.metrics.reduce((sum, m) => sum + parseFloat(m.executionTime), 0);
    const avgExecutionTime = totalExecutionTime / this.metrics.length;
    const totalOperations = this.metrics.length;

    return {
      totalOperations,
      avgExecutionTime: avgExecutionTime.toFixed(2),
      totalTime: totalExecutionTime.toFixed(2),
      fastestOperation: Math.min(...this.metrics.map(m => parseFloat(m.executionTime))).toFixed(2),
      slowestOperation: Math.max(...this.metrics.map(m => parseFloat(m.executionTime))).toFixed(2),
      recentMetrics: this.metrics.slice(-10),
    };
  }

  // Get algorithm comparison
  getAlgorithmComparison() {
    const algorithmStats = {};

    this.metrics.forEach(metric => {
      if (!algorithmStats[metric.algorithm]) {
        algorithmStats[metric.algorithm] = {
          count: 0,
          totalTime: 0,
          avgTime: 0,
          totalChars: 0,
        };
      }

      const stats = algorithmStats[metric.algorithm];
      stats.count++;
      stats.totalTime += parseFloat(metric.executionTime);
      stats.totalChars += metric.inputSize;
    });

    // Calculate averages
    Object.keys(algorithmStats).forEach(algo => {
      const stats = algorithmStats[algo];
      stats.avgTime = (stats.totalTime / stats.count).toFixed(2);
      stats.avgThroughput = (stats.totalChars / (stats.totalTime / 1000)).toFixed(2);
    });

    return algorithmStats;
  }

  // Save to localStorage
  saveToStorage(metric) {
    try {
      const stored = localStorage.getItem('cryptoMetrics') || '[]';
      const metrics = JSON.parse(stored);
      metrics.push(metric);
      
      // Keep only last 100 metrics
      const recentMetrics = metrics.slice(-100);
      localStorage.setItem('cryptoMetrics', JSON.stringify(recentMetrics));
    } catch (error) {
      console.warn('Failed to save metrics to storage:', error);
    }
  }

  // Load from localStorage
  static loadFromStorage() {
    try {
      const stored = localStorage.getItem('cryptoMetrics') || '[]';
      return JSON.parse(stored);
    } catch (error) {
      console.warn('Failed to load metrics from storage:', error);
      return [];
    }
  }

  // Clear all metrics
  clear() {
    this.metrics = [];
    localStorage.removeItem('cryptoMetrics');
  }

  // Export metrics as JSON
  exportJSON() {
    return JSON.stringify(this.metrics, null, 2);
  }

  // Export metrics as CSV
  exportCSV() {
    const headers = ['Algorithm', 'Timestamp', 'Execution Time (ms)', 'Input Size', 'Output Size', 'Throughput (chars/s)', 'Memory Used (KB)', 'Efficiency'];
    const rows = this.metrics.map(m => [
      m.algorithm,
      m.timestamp,
      m.executionTime,
      m.inputSize,
      m.outputSize,
      m.throughput,
      m.memoryUsed,
      m.efficiency,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    return csv;
  }
}

// Singleton instance
let trackerInstance = null;

export const getPerformanceTracker = () => {
  if (!trackerInstance) {
    trackerInstance = new PerformanceTracker();
  }
  return trackerInstance;
};
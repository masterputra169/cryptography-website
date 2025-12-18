// src/pages/Dashboard.jsx

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  TrendingUp, 
  Clock, 
  Zap, 
  Activity, 
  Trash2,
  Download,
  RefreshCw,
  BarChart3
} from 'lucide-react';

// Import CORRECT functions from statistics
import {
  getMetrics,
  getSummary,
  clearMetrics,
  exportMetricsJSON,
  exportMetricsCSV
} from '../utils/statistics';

// ==================== PROP TYPES DEFINITIONS ====================

const MetricPropTypes = PropTypes.shape({
  name: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  timestamp: PropTypes.string.isRequired,
});

const StatisticsPropTypes = PropTypes.shape({
  count: PropTypes.number.isRequired,
  avgDuration: PropTypes.number.isRequired,
  minDuration: PropTypes.number.isRequired,
  maxDuration: PropTypes.number.isRequired,
  totalDuration: PropTypes.number.isRequired,
});

// ==================== STAT CARD COMPONENT ====================

const StatCard = ({ icon: Icon, label, value, trend, color = 'blue' }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900`}>
          <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${
            trend > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
    </div>
  );
};

StatCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  trend: PropTypes.number,
  color: PropTypes.string
};

// ==================== METRIC ROW COMPONENT ====================

const MetricRow = ({ metric, index }) => {
  return (
    <tr className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
        {metric.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {metric.duration.toFixed(2)} ms
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {new Date(metric.timestamp).toLocaleString('id-ID')}
      </td>
    </tr>
  );
};

MetricRow.propTypes = {
  metric: MetricPropTypes.isRequired,
  index: PropTypes.number.isRequired,
};

// ==================== ALGORITHM CARD COMPONENT ====================

const AlgorithmCard = ({ name, stats }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {name}
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Operations:</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {stats.count}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Avg Time:</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {stats.avgDuration.toFixed(2)} ms
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Min Time:</span>
          <span className="text-sm font-medium text-green-600">
            {stats.minDuration.toFixed(2)} ms
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Max Time:</span>
          <span className="text-sm font-medium text-red-600">
            {stats.maxDuration.toFixed(2)} ms
          </span>
        </div>
      </div>
    </div>
  );
};

AlgorithmCard.propTypes = {
  name: PropTypes.string.isRequired,
  stats: StatisticsPropTypes.isRequired,
};

// ==================== MAIN DASHBOARD COMPONENT ====================

const Dashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [algorithmStats, setAlgorithmStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      setIsLoading(true);
      
      // Get all metrics
      const allMetrics = getMetrics();
      setMetrics(allMetrics);

      // Get stats for each algorithm
      const algorithms = [...new Set(allMetrics.map(m => m.name))];
      const stats = {};
      
      algorithms.forEach(algo => {
        stats[algo] = getSummary(algo);
      });
      
      setAlgorithmStats(stats);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all statistics?')) {
      clearMetrics();
      loadData();
    }
  };

  const handleExportJSON = () => {
    const data = exportMetricsJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crypto-suite-metrics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const data = exportMetricsCSV();
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crypto-suite-metrics-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calculate overall stats
  const totalOperations = metrics.length;
  const avgDuration = metrics.length > 0
    ? metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length
    : 0;
  const totalAlgorithms = Object.keys(algorithmStats).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Performance analytics and cipher statistics
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Download className="w-4 h-4" />
              Export JSON
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={handleClearData}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <Trash2 className="w-4 h-4" />
              Clear Data
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Activity}
            label="Total Operations"
            value={totalOperations}
            color="blue"
          />
          <StatCard
            icon={Clock}
            label="Average Duration"
            value={`${avgDuration.toFixed(2)} ms`}
            color="green"
          />
          <StatCard
            icon={BarChart3}
            label="Algorithms Used"
            value={totalAlgorithms}
            color="purple"
          />
          <StatCard
            icon={Zap}
            label="Operations/Min"
            value={(totalOperations / Math.max(1, metrics.length / 60)).toFixed(1)}
            color="orange"
          />
        </div>

        {/* Algorithm Performance Cards */}
        {Object.keys(algorithmStats).length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Algorithm Performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(algorithmStats).map(([name, stats]) => (
                <AlgorithmCard key={name} name={name} stats={stats} />
              ))}
            </div>
          </div>
        )}

        {/* Recent Operations Table */}
        {metrics.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Operations
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Algorithm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {metrics.slice(0, 10).map((metric, idx) => (
                    <MetricRow key={idx} metric={metric} index={idx} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {metrics.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
            <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No data available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start using the cipher tools to see performance statistics here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

// Export PropTypes for reuse
export {
  MetricPropTypes,
  StatisticsPropTypes,
};
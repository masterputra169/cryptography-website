// src/pages/Dashboard.jsx

import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  TrendingUp, 
  Clock, 
  Zap, 
  Activity, 
  Trash2,
  Download,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  Award,
  Target,
  TrendingDown
} from 'lucide-react';
import { Card, Badge, Button } from '../components/atoms';
import { StatCard } from '../components/molecules';
import { 
  ComparisonChart, 
  TimeSeriesChart, 
  UsagePieChart,
  FrequencyChart,
  EntropyComparisonChart
} from '../components/organisms/PerformanceChart';
import { getPerformanceTracker } from '../utils/statistics/performanceTracker';

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

// Statistics PropTypes
const StatisticsPropTypes = PropTypes.shape({
  totalOperations: PropTypes.number.isRequired,
  avgExecutionTime: PropTypes.string.isRequired,
  totalTime: PropTypes.string.isRequired,
  fastestOperation: PropTypes.string.isRequired,
  slowestOperation: PropTypes.string.isRequired,
  recentMetrics: PropTypes.arrayOf(MetricPropTypes).isRequired,
});

// Comparison PropTypes
const ComparisonPropTypes = PropTypes.objectOf(
  PropTypes.shape({
    count: PropTypes.number.isRequired,
    totalTime: PropTypes.string.isRequired,
    avgTime: PropTypes.string.isRequired,
    totalChars: PropTypes.number.isRequired,
    avgThroughput: PropTypes.string,
  })
);

// ==================== SUB-COMPONENTS WITH PROPTYPES ====================

/**
 * Summary Card Component
 */
const SummaryCard = ({ icon: Icon, title, value, subtitle, trend, color = 'blue' }) => (
  <Card 
    variant="elevated" 
    hover
    className={`group transition-all duration-300 hover:scale-105 bg-gradient-to-br from-${color}-500 to-${color}-600 text-white`}
  >
    <div className="flex items-center gap-4">
      <div className="p-3 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
        <Icon size={32} />
      </div>
      <div className="flex-1">
        <p className="text-sm opacity-90 mb-1">{title}</p>
        <p className="text-3xl font-bold mb-1">{value}</p>
        {subtitle && (
          <p className="text-xs opacity-80">{subtitle}</p>
        )}
        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            {trend >= 0 ? (
              <TrendingUp size={14} className="opacity-90" />
            ) : (
              <TrendingDown size={14} className="opacity-90" />
            )}
            <span className="text-xs opacity-90">
              {trend > 0 ? '+' : ''}{trend}% from last session
            </span>
          </div>
        )}
      </div>
    </div>
  </Card>
);

SummaryCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
  trend: PropTypes.number,
  color: PropTypes.string,
};

/**
 * Metric Table Row Component
 */
const MetricRow = ({ metric, index }) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-xs font-bold">
          {index + 1}
        </span>
        <Badge variant="primary" size="sm">
          {metric.algorithm}
        </Badge>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-mono">
      {metric.executionTime}ms
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
      {metric.inputSize.toLocaleString()} chars
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 font-mono">
      {metric.throughput} c/s
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden max-w-[100px]">
          <div
            className={`h-full transition-all ${
              parseFloat(metric.efficiency) >= 80 
                ? 'bg-green-500' 
                : parseFloat(metric.efficiency) >= 60 
                ? 'bg-yellow-500' 
                : 'bg-red-500'
            }`}
            style={{ width: `${metric.efficiency}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[45px]">
          {metric.efficiency}%
        </span>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex flex-col">
        <span className="text-sm text-gray-900 dark:text-gray-100">
          {new Date(metric.timestamp).toLocaleDateString()}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(metric.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </td>
  </tr>
);

MetricRow.propTypes = {
  metric: MetricPropTypes.isRequired,
  index: PropTypes.number.isRequired,
};

/**
 * Algorithm Detail Card Component
 */
const AlgorithmDetailCard = ({ algorithm, stats, rank }) => {
  const getRankBadge = (rank) => {
    if (rank === 1) return { variant: 'success', icon: '🥇', label: 'Best' };
    if (rank === 2) return { variant: 'primary', icon: '🥈', label: '2nd' };
    if (rank === 3) return { variant: 'warning', icon: '🥉', label: '3rd' };
    return { variant: 'secondary', icon: null, label: `#${rank}` };
  };

  const badge = getRankBadge(rank);

  return (
    <Card hover className="group transition-all duration-300 hover:scale-105">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
            {algorithm}
          </h3>
          {badge.icon && (
            <div className="flex items-center gap-2">
              <span className="text-2xl">{badge.icon}</span>
              <Badge variant={badge.variant} size="sm">
                {badge.label}
              </Badge>
            </div>
          )}
        </div>
        <Award className="w-8 h-8 text-gray-300 dark:text-gray-600 group-hover:text-yellow-500 transition-colors" />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
          <span className="text-sm text-gray-600 dark:text-gray-400">Operations:</span>
          <span className="font-bold text-gray-800 dark:text-white">
            {stats.count}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
          <span className="text-sm text-gray-600 dark:text-gray-400">Avg Time:</span>
          <span className="font-bold text-gray-800 dark:text-white font-mono">
            {stats.avgTime}ms
          </span>
        </div>
        
        <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
          <span className="text-sm text-gray-600 dark:text-gray-400">Throughput:</span>
          <span className="font-bold text-gray-800 dark:text-white font-mono">
            {stats.avgThroughput} c/s
          </span>
        </div>
        
        <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
          <span className="text-sm text-gray-600 dark:text-gray-400">Total Chars:</span>
          <span className="font-bold text-gray-800 dark:text-white">
            {stats.totalChars.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Performance Bar */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">Performance Score</span>
          <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
            {(100 - parseFloat(stats.avgTime)).toFixed(0)}/100
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all"
            style={{ width: `${Math.max(0, 100 - parseFloat(stats.avgTime))}%` }}
          />
        </div>
      </div>
    </Card>
  );
};

AlgorithmDetailCard.propTypes = {
  algorithm: PropTypes.string.isRequired,
  stats: PropTypes.shape({
    count: PropTypes.number.isRequired,
    avgTime: PropTypes.string.isRequired,
    avgThroughput: PropTypes.string.isRequired,
    totalChars: PropTypes.number.isRequired,
  }).isRequired,
  rank: PropTypes.number.isRequired,
};

/**
 * Empty State Component
 */
const EmptyState = () => (
  <div className="min-h-screen flex items-center justify-center p-8">
    <Card className="max-w-2xl w-full text-center py-16">
      <div className="mb-6">
        <Activity size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-300 mb-2">
          No Data Yet
        </h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">
          Start using cipher algorithms to see your analytics here
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button
          variant="primary"
          onClick={() => window.location.href = '/caesar'}
          icon={<Zap size={18} />}
        >
          Try Caesar Cipher
        </Button>
        <Button
          variant="outline"
          onClick={() => window.location.href = '/'}
          icon={<BarChart3 size={18} />}
        >
          View All Ciphers
        </Button>
      </div>
    </Card>
  </div>
);

// ==================== MAIN DASHBOARD COMPONENT ====================

/**
 * Dashboard Page Component
 */
const Dashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const tracker = useMemo(() => getPerformanceTracker(), []);

  // Load data
  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const loadData = () => {
    setLoading(true);
    try {
      const stats = tracker.getStatistics();
      const comp = tracker.getAlgorithmComparison();
      const hist = tracker.constructor.loadFromStorage();
      
      setStatistics(stats);
      setComparison(comp);
      setHistory(hist);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all statistics? This action cannot be undone.')) {
      tracker.clear();
      loadData();
    }
  };

  const handleExport = (format = 'json') => {
    try {
      const data = format === 'json' ? tracker.exportJSON() : tracker.exportCSV();
      const blob = new Blob([data], { 
        type: format === 'json' ? 'application/json' : 'text/csv' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `crypto-stats-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  // Computed values
  const hasData = statistics && statistics.totalOperations > 0;
  
  const sortedAlgorithms = useMemo(() => {
    if (!comparison) return [];
    return Object.entries(comparison)
      .map(([name, stats]) => ({ name, stats }))
      .sort((a, b) => parseFloat(a.stats.avgTime) - parseFloat(b.stats.avgTime));
  }, [comparison]);

  const topPerformers = useMemo(() => sortedAlgorithms.slice(0, 3), [sortedAlgorithms]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw size={48} className="mx-auto animate-spin text-primary-600 mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!hasData) {
    return <EmptyState />;
  }

  // Main dashboard render
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Performance insights and usage statistics
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              icon={<RefreshCw size={18} />}
            >
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('json')}
              icon={<Download size={18} />}
            >
              Export JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('csv')}
              icon={<Download size={18} />}
            >
              Export CSV
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleClearData}
              icon={<Trash2 size={18} />}
            >
              Clear Data
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            icon={TrendingUp}
            title="Total Operations"
            value={statistics.totalOperations}
            color="blue"
          />
          
          <SummaryCard
            icon={Clock}
            title="Avg Execution Time"
            value={`${statistics.avgExecutionTime}ms`}
            subtitle={`Total: ${statistics.totalTime}ms`}
            color="green"
          />
          
          <SummaryCard
            icon={Zap}
            title="Fastest Operation"
            value={`${statistics.fastestOperation}ms`}
            color="purple"
          />
          
          <SummaryCard
            icon={Target}
            title="Algorithms Used"
            value={Object.keys(comparison || {}).length}
            color="orange"
          />
        </div>

        {/* Top Performers */}
        {topPerformers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" />
              Top Performing Algorithms
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topPerformers.map((item, index) => (
                <AlgorithmDetailCard
                  key={item.name}
                  algorithm={item.name}
                  stats={item.stats}
                  rank={index + 1}
                />
              ))}
            </div>
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {comparison && Object.keys(comparison).length > 0 && (
            <>
              <ComparisonChart comparison={comparison} />
              <UsagePieChart comparison={comparison} />
            </>
          )}
        </div>

        {/* Time Series Chart */}
        {history.length > 0 && (
          <div className="mb-8">
            <TimeSeriesChart history={history} maxPoints={20} />
          </div>
        )}

        {/* Recent Operations Table */}
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Activity size={24} />
              Recent Operations
            </h2>
            <Badge variant="primary">
              Last {statistics.recentMetrics.length}
            </Badge>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Algorithm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Input Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Throughput
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Efficiency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {[...statistics.recentMetrics].reverse().map((metric, idx) => (
                  <MetricRow key={idx} metric={metric} index={idx} />
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* All Algorithm Performance Details */}
        {sortedAlgorithms.length > 3 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 size={24} />
              All Algorithm Performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedAlgorithms.slice(3).map((item, index) => (
                <AlgorithmDetailCard
                  key={item.name}
                  algorithm={item.name}
                  stats={item.stats}
                  rank={index + 4}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main component PropTypes
Dashboard.propTypes = {};

// Export PropTypes for external use
export {
  MetricPropTypes,
  StatisticsPropTypes,
  ComparisonPropTypes,
};

export default Dashboard;
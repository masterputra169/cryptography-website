// src/pages/Dashboard.jsx

import { useState, useEffect } from 'react';
import { getPerformanceTracker } from '../utils/statistics/performanceTracker';
import { ComparisonChart, TimeSeriesChart, UsagePieChart } from '../components/organisms/PerformanceChart';
import { TrendingUp, Clock, Zap, Activity, Trash2 } from 'lucide-react';

const Dashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [history, setHistory] = useState([]);

  const tracker = getPerformanceTracker();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const stats = tracker.getStatistics();
    const comp = tracker.getAlgorithmComparison();
    const hist = tracker.constructor.loadFromStorage();
    
    setStatistics(stats);
    setComparison(comp);
    setHistory(hist);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all statistics?')) {
      tracker.clear();
      loadData();
    }
  };

  if (!statistics || statistics.totalOperations === 0) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Analytics Dashboard
          </h1>
          <div className="card text-center py-20">
            <Activity size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              No Data Yet
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Start using cipher algorithms to see your analytics here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Performance insights and usage statistics
            </p>
          </div>
          <button
            onClick={handleClearData}
            className="btn bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
          >
            <Trash2 size={18} />
            Clear Data
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Operations */}
          <div className="card card-hover bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <TrendingUp size={32} />
              </div>
              <div>
                <p className="text-sm opacity-90">Total Operations</p>
                <p className="text-3xl font-bold">
                  {statistics.totalOperations}
                </p>
              </div>
            </div>
          </div>

          {/* Average Time */}
          <div className="card card-hover bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Clock size={32} />
              </div>
              <div>
                <p className="text-sm opacity-90">Avg Execution Time</p>
                <p className="text-3xl font-bold">
                  {statistics.avgExecutionTime}ms
                </p>
              </div>
            </div>
          </div>

          {/* Fastest Operation */}
          <div className="card card-hover bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Zap size={32} />
              </div>
              <div>
                <p className="text-sm opacity-90">Fastest Operation</p>
                <p className="text-3xl font-bold">
                  {statistics.fastestOperation}ms
                </p>
              </div>
            </div>
          </div>

          {/* Total Time */}
          <div className="card card-hover bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Activity size={32} />
              </div>
              <div>
                <p className="text-sm opacity-90">Total Time Spent</p>
                <p className="text-3xl font-bold">
                  {statistics.totalTime}ms
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Algorithm Comparison */}
          {comparison && Object.keys(comparison).length > 0 && (
            <ComparisonChart comparison={comparison} />
          )}

          {/* Usage Distribution */}
          {comparison && Object.keys(comparison).length > 0 && (
            <UsagePieChart comparison={comparison} />
          )}
        </div>

        {/* Time Series Chart */}
        {history.length > 0 && (
          <div className="mb-8">
            <TimeSeriesChart history={history} />
          </div>
        )}

        {/* Recent Operations Table */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Recent Operations
          </h2>
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
                {statistics.recentMetrics.reverse().map((metric, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="badge badge-primary">
                        {metric.algorithm}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-mono">
                      {metric.executionTime}ms
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {metric.inputSize} chars
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 font-mono">
                      {metric.throughput} c/s
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden max-w-[100px]">
                          <div
                            className="h-full bg-green-500 transition-all"
                            style={{ width: `${metric.efficiency}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {metric.efficiency}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(metric.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Algorithm Performance Details */}
        {comparison && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {Object.entries(comparison).map(([algo, stats]) => (
              <div key={algo} className="card card-hover">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                  {algo}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Operations:</span>
                    <span className="font-bold text-gray-800 dark:text-white">
                      {stats.count}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Avg Time:</span>
                    <span className="font-bold text-gray-800 dark:text-white">
                      {stats.avgTime}ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Avg Throughput:</span>
                    <span className="font-bold text-gray-800 dark:text-white">
                      {stats.avgThroughput} c/s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Chars:</span>
                    <span className="font-bold text-gray-800 dark:text-white">
                      {stats.totalChars.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
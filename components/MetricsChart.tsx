import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { MetricsData } from '../types';
import { ArrowDownTrayIcon } from './Icons';

interface MetricsChartProps {
  data: MetricsData[];
}

const MetricsChart: React.FC<MetricsChartProps> = ({ data }) => {
  const handleExportCSV = () => {
    if (data.length === 0) {
      alert('No metrics data to export.');
      return;
    }

    // Use the last time step in the filename for uniqueness
    const lastTimeStep = data.length > 0 ? data[data.length - 1].t : 0;
    const fileName = `automaton_metrics_t${lastTimeStep}.csv`;

    const headers = 't,delta,energy';
    const csvRows = data.map(row => 
      `${row.t},${row.delta},${Number(row.energy).toFixed(6)}`
    );
    const csvContent = [headers, ...csvRows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-96 flex flex-col gap-4">
      <div className="flex-1 flex flex-col">
        <div className="relative mb-2">
          <h3 className="text-lg font-semibold text-center text-cyan-400">Activity &Delta;(t)</h3>
          <button
            onClick={handleExportCSV}
            className="absolute top-1/2 -translate-y-1/2 right-0 flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Export Metrics to CSV"
            disabled={data.length === 0}
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
              <XAxis dataKey="t" stroke="#A0AEC0" name="Time" />
              <YAxis stroke="#A0AEC0" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A202C',
                  borderColor: '#4A5568',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="delta"
                name="Changed Cells"
                stroke="#2dd4bf"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-center mb-2 text-cyan-400">Energy E(t)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="t" stroke="#A0AEC0" name="Time"/>
            <YAxis stroke="#A0AEC0" domain={[0, 1]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A202C',
                borderColor: '#4A5568',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="energy"
              name="Mean Cell State"
              stroke="#60a5fa"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MetricsChart;
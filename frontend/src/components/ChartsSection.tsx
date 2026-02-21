"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const pieData = [
  { name: 'Product Cost', value: 71, color: '#3b82f6' },
  { name: 'Customs Duty', value: 9, color: '#a855f7' },
  { name: 'Import Tax', value: 6, color: '#06b6d4' },
  { name: 'Freight', value: 11, color: '#10b981' },
  { name: 'Insurance', value: 2, color: '#f59e0b' },
  { name: 'Handling', value: 1, color: '#ef4444' },
];

const barData = [
  { route: 'China → USA (Sea)', cost: 13500 },
  { route: 'Vietnam → USA (Sea)', cost: 12100 },
  { route: 'China → USA (Air)', cost: 18000 },
  { route: 'India → USA (Sea)', cost: 11500 },
];

export function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 pb-20">
      {/* PIE CHART CARD */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-1">Landed Cost Breakdown</h3>
        <p className="text-xs text-gray-400 mb-6">Total cost composition for current trade route</p>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BAR CHART CARD */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-1">Route Cost Comparison</h3>
        <p className="text-xs text-gray-400 mb-6">Optimized alternatives vs current route</p>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="route" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: '#f9fafb'}} />
              <Bar dataKey="cost" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
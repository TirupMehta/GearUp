import { useMemo } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { dataEngine } from '../../utils/dataEngine';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { AlertTriangle, PackageSearch } from 'lucide-react';

export default function InventoryIntelligence() {
  const { transactions, inventory, stockMap } = useDashboard();

  // 4-week moving average calculated in browser natively
  const demandData = useMemo(() => {
    const daily = dataEngine.calculateDailyRevenue(transactions);
    return dataEngine.calculateMovingAverage(daily, 28); // 4 weeks
  }, [transactions]);

  const deadWeight = inventory.filter(i => i.Status === 'Dead Weight');
  const fastMoving = inventory.filter(i => i.Status === 'Fast Moving');
  
  // Forecast simplified: if latest moving average is dropping significantly
  const trend = demandData.length > 2 
    ? demandData[demandData.length - 1].movingAverage - demandData[demandData.length - 2].movingAverage 
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Alert Cards */}
      {trend < 0 && (
        <div className="bg-warning/10 border border-warning/30 rounded-2xl p-4 flex gap-4 items-start">
          <AlertTriangle className="w-6 h-6 text-warning shrink-0 mt-0.5" />
          <div>
            <h4 className="text-warning font-semibold text-lg">Sales Trend Warning</h4>
            <p className="text-slate-700 dark:text-zinc-300 text-sm mt-1">
              The 4-week moving average indicates a negative demand trend. Inspect your Fast Moving stock to ensure no stockouts are causing revenue dips.
            </p>
          </div>
        </div>
      )}

      {/* Chart Row */}
      <div className="bg-white/60 dark:bg-[#000000]/40 border border-black/10 dark:border-white/5 rounded-2xl p-6 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
          <PackageSearch className="w-5 h-5 text-primary" />
          Time-Based Demand Forecasting
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={demandData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickFormatter={(val) => val.substring(5)} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={false} name="Daily Revenue" />
              <Line type="monotone" dataKey="movingAverage" stroke="#22c55e" strokeWidth={3} dot={false} name="4-Week Moving Avg" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/60 dark:bg-[#000000]/40 border border-black/10 dark:border-white/5 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.05)]">
          <div className="bg-black/5 dark:bg-white/5 backdrop-blur-lg px-6 py-4 border-b border-black/10 dark:border-white/5">
            <h3 className="font-semibold text-accent flex items-center gap-2">
              Fast Moving Stock
            </h3>
          </div>
          <div className="p-0 overflow-auto max-h-80">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#000000]/20 text-slate-600 dark:text-zinc-400 sticky top-0">
                <tr>
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium text-right">Current Stock</th>
                  <th className="px-6 py-3 font-medium text-right">Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {fastMoving.slice(0, 10).map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#000000]/30 backdrop-blur-sm">
                    <td className="px-6 py-3 font-medium text-slate-200">{item.ProductName}</td>
                    <td className="px-6 py-3 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        (stockMap[item.ProductName] || 0) < 20 ? 'bg-danger/20 backdrop-blur-sm shadow-xl shadow-danger/20 text-danger border border-danger/30' : 'bg-black/5 dark:bg-white/5 text-slate-700 dark:text-zinc-300'
                      }`}>
                        {(stockMap[item.ProductName] || 0)} units
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right text-accent">{item.Margin.toFixed(0)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white/60 dark:bg-[#000000]/40 border border-black/10 dark:border-white/5 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.05)]">
          <div className="bg-black/5 dark:bg-white/5 backdrop-blur-lg px-6 py-4 border-b border-black/10 dark:border-white/5">
            <h3 className="font-semibold text-danger flex items-center gap-2">
              Dead Weight (Slow Selling)
            </h3>
          </div>
          <div className="p-0 overflow-auto max-h-80">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#000000]/20 text-slate-600 dark:text-zinc-400 sticky top-0">
                <tr>
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium text-right">Units Sold</th>
                  <th className="px-6 py-3 font-medium text-right">Cost Tied Up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {deadWeight.slice(0, 10).map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#000000]/30 backdrop-blur-sm">
                    <td className="px-6 py-3 font-medium text-slate-200">{item.ProductName}</td>
                    <td className="px-6 py-3 text-right">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-black/5 dark:bg-white/5 text-slate-700 dark:text-zinc-300">
                        {(stockMap[item.ProductName] || 0)} units
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right text-danger">₹{item.TotalCost.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

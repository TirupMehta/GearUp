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
        <div className="bg-panel border border-warning/30 rounded-xl p-5 flex gap-4 items-start shadow-sm divide-x divide-warning/20">
          <div className="pr-4">
            <AlertTriangle className="w-5 h-5 text-warning" />
          </div>
          <div className="pl-4">
            <h4 className="text-xs font-bold text-text uppercase tracking-widest mb-1">Demand Alert</h4>
            <p className="text-text-muted text-xs leading-relaxed">
              Negative demand trend detected. Review stock levels for Fast Moving items to prevent revenue loss.
            </p>
          </div>
        </div>
      )}

      {/* Chart Row */}
      <div className="bg-panel border border-border rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2 text-text">
          <PackageSearch className="w-4 h-4 text-accent" />
          Demand Forecasting
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={demandData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--text)" fontSize={12} tickFormatter={(val) => val.substring(5)} />
              <YAxis stroke="var(--text)" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '12px' }}
                itemStyle={{ color: 'var(--text)' }}
              />
              <Legend wrapperStyle={{ color: 'var(--text)' }} />
              <Line type="monotone" dataKey="revenue" stroke="var(--v-primary)" strokeWidth={2} dot={false} name="Daily Revenue" />
              <Line type="monotone" dataKey="movingAverage" stroke="var(--v-accent)" strokeWidth={3} strokeDasharray="5 5" dot={false} name="4-Week Moving Avg" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-panel border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="bg-background/30 px-6 py-4 border-b border-border">
            <h3 className="text-[10px] font-bold text-accent uppercase tracking-widest flex items-center gap-2">
              Fast Moving Stock
            </h3>
          </div>
          <div className="p-0 overflow-auto max-h-80">
            <table className="w-full text-sm text-left">
              <thead className="bg-background text-text-muted sticky top-0">
                <tr>
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium text-right">Current Stock</th>
                  <th className="px-6 py-3 font-medium text-right">Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {fastMoving.slice(0, 10).map((item, idx) => (
                  <tr key={idx} className="hover:bg-background/50 transition">
                    <td className="px-6 py-3 font-medium text-text">{item.ProductName}</td>
                    <td className="px-6 py-3 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        (stockMap[item.ProductName] || 0) < 20 ? 'bg-danger/20 text-danger border border-danger/30' : 'bg-background text-text'
                      }`}>
                        {(stockMap[item.ProductName] || 0)} units
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right text-text font-bold">{item.Margin.toFixed(0)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-panel border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="bg-background/30 px-6 py-4 border-b border-border">
            <h3 className="text-[10px] font-bold text-danger uppercase tracking-widest flex items-center gap-2">
              Dead Weight (Slow Selling)
            </h3>
          </div>
          <div className="p-0 overflow-auto max-h-80">
            <table className="w-full text-sm text-left">
              <thead className="bg-background text-text-muted sticky top-0">
                <tr>
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium text-right">Units Sold</th>
                  <th className="px-6 py-3 font-medium text-right">Cost Tied Up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {deadWeight.slice(0, 10).map((item, idx) => (
                  <tr key={idx} className="hover:bg-background/50 transition">
                    <td className="px-6 py-3 font-medium text-text">{item.ProductName}</td>
                    <td className="px-6 py-3 text-right">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-background text-text">
                        {(stockMap[item.ProductName] || 0)} units
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right text-text font-bold">₹{item.TotalCost.toLocaleString()}</td>
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

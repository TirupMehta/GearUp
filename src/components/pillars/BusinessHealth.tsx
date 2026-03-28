import { useMemo } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { dataEngine } from '../../utils/dataEngine';
import { Activity, TrendingDown, Target, ShieldAlert } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function BusinessHealth() {
  const { transactions, riskScore } = useDashboard();

  // Calculate anomalies based on standard deviation of daily revenue
  const anomalyData = useMemo(() => {
    const daily = dataEngine.calculateDailyRevenue(transactions);
    if (daily.length < 3) return { data: [], anomalies: 0 };

    const revenues = daily.map(d => d.revenue);
    const mean = revenues.reduce((a,b) => a+b, 0) / revenues.length;
    
    // Variance and Std Dev
    const variance = revenues.reduce((a,b) => a + Math.pow(b - mean, 2), 0) / revenues.length;
    const stdDev = Math.sqrt(variance);

    const threshold = stdDev * 1.5; // simple 1.5 Sigma threshold for demo

    let anomalyCount = 0;
    const processed = daily.map((d, index) => {
      const isAnomaly = Math.abs(d.revenue - mean) > threshold;
      if (isAnomaly) anomalyCount++;
      
      return {
        dayIndex: index + 1, // numeric for scatter X
        date: d.date,
        revenue: d.revenue,
        isAnomaly
      };
    });

    return { data: processed, anomalies: anomalyCount };
  }, [transactions]);

  const totalRev = useMemo(() => transactions.reduce((sum, t) => sum + (t.QuantitySold * t.SalePrice), 0), [transactions]);
  const totalCost = useMemo(() => transactions.reduce((sum, t) => sum + (t.QuantitySold * t.UnitCost), 0), [transactions]);
  const avgMargin = totalRev > 0 ? ((totalRev - totalCost) / totalRev) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/60 dark:bg-[#000000]/40 border border-black/10 dark:border-white/5 rounded-2xl p-5 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
          <div className="text-slate-600 dark:text-zinc-400 text-sm mb-1 flex justify-between">
            Global Health Score
            <Activity className="w-5 h-5 text-accent" />
          </div>
          <div className={`text-3xl font-bold ${riskScore > 50 ? 'text-danger' : 'text-accent'}`}>
            {100 - riskScore} / 100
          </div>
        </div>
        
        <div className="bg-white/60 dark:bg-[#000000]/40 border border-black/10 dark:border-white/5 rounded-2xl p-5 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
          <div className="text-slate-600 dark:text-zinc-400 text-sm mb-1 flex justify-between">
            Average Run Rate Margin
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">
            {avgMargin.toFixed(1)}%
          </div>
        </div>

        <div className="bg-white/60 dark:bg-[#000000]/40 border border-black/10 dark:border-white/5 rounded-2xl p-5 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
          <div className="text-slate-600 dark:text-zinc-400 text-sm mb-1 flex justify-between">
            Detected Anomalies
            <ShieldAlert className="w-5 h-5 text-warning" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">
            {anomalyData.anomalies}
          </div>
        </div>
      </div>

      {/* Main Analysis Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Anomaly Scatter Plot */}
        <div className="bg-white/60 dark:bg-[#000000]/40 border border-black/10 dark:border-white/5 rounded-2xl p-6 shadow-[0_0_20px_rgba(255,255,255,0.05)] lg:col-span-2">
          <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-warning" />
            Revenue Anomaly Detection
          </h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400 mb-4">
            Identifying days with unnatural sales spikes or drops (&gt; 1.5 standard deviations from mean).
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="dayIndex" type="number" name="Day" stroke="#94a3b8" />
                <YAxis dataKey="revenue" type="number" name="Revenue" stroke="#94a3b8" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }} 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                  formatter={(value: number, name: string) => name === 'Revenue' ? [`₹${value.toFixed(2)}`, name] : [value, name]}
                  labelFormatter={() => ''}
                />
                <Scatter name="Daily Revenue" data={anomalyData.data}>
                  {anomalyData.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isAnomaly ? '#ef4444' : '#3b82f6'} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Warning Readout */}
        <div className="bg-white/60 dark:bg-[#000000]/40 border border-black/10 dark:border-white/5 rounded-2xl p-6 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
           <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-slate-700 dark:text-zinc-300">
            System Diagnosis
          </h3>
          <div className="space-y-4">
            <div className="bg-black/5 dark:bg-white/5 backdrop-blur-lg p-4 rounded-2xl border border-black/10 dark:border-white/5">
              <h4 className="text-sm font-medium text-slate-200 mb-1 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-warning" />
                Margin Dilution Risk
              </h4>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                {avgMargin < 15 
                  ? "CRITICAL: Global margins have dropped below 15%. Immediately review price elasticity for top selling products." 
                  : "Stable: Margins are holding steady across the primary product portfolio."}
              </p>
            </div>
            
             <div className="bg-black/5 dark:bg-white/5 backdrop-blur-lg p-4 rounded-2xl border border-black/10 dark:border-white/5">
              <h4 className="text-sm font-medium text-slate-200 mb-1 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-danger" />
                Anomaly Insights
              </h4>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                {anomalyData.anomalies > 5 
                  ? `High volatility detected (${anomalyData.anomalies} anomalies). Inspect Copilot for specific product stockouts on these dates.` 
                  : "Revenue variance is within normal statistical thresholds."}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

import {
  Activity,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  DollarSign,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { useMemo } from 'react';
import { dataEngine } from '../../utils/dataEngine';

// Static dummy anomaly data for the health display (shows even without CSV)
const DUMMY_ANOMALY_DATA = [
  { day: 'Jan 01', revenue: 18400, isAnomaly: false },
  { day: 'Jan 02', revenue: 21200, isAnomaly: false },
  { day: 'Jan 03', revenue: 19800, isAnomaly: false },
  { day: 'Jan 04', revenue: 22600, isAnomaly: false },
  { day: 'Jan 05', revenue: 20900, isAnomaly: false },
  { day: 'Jan 06', revenue: 41500, isAnomaly: true },  // spike
  { day: 'Jan 07', revenue: 23100, isAnomaly: false },
  { day: 'Jan 08', revenue: 19200, isAnomaly: false },
  { day: 'Jan 09', revenue: 24000, isAnomaly: false },
  { day: 'Jan 10', revenue: 25800, isAnomaly: false },
  { day: 'Jan 11', revenue: 22300, isAnomaly: false },
  { day: 'Jan 12', revenue: 26500, isAnomaly: false },
  { day: 'Jan 13', revenue: 7200, isAnomaly: true },   // drop
  { day: 'Jan 14', revenue: 24800, isAnomaly: false },
];

const DUMMY_ANOMALIES = [
  { id: 'AN-9021', type: 'Volume Spike', reason: 'Unusual bulk purchase on Jan 06 — 2x normal revenue', severity: 'Medium' },
  { id: 'AN-8842', type: 'Margin Dip', reason: 'High discount usage on low-stock items — margin compressed', severity: 'High' },
  { id: 'AN-7751', type: 'Revenue Drop', reason: 'Jan 13 revenue dropped to ₹7,200 — 70% below average', severity: 'High' },
];

export default function BusinessHealth() {
  const { riskScore, transactions, inventory } = useDashboard();

  // Prefer real transactions if available, else use dummy
  const barData = useMemo(() => {
    if (transactions.length > 0) {
      const daily = dataEngine.calculateDailyRevenue(transactions);
      const mean = daily.reduce((s, d) => s + d.revenue, 0) / daily.length;
      return daily.slice(-14).map(d => ({
        day: d.date.substring(5),
        revenue: Math.round(d.revenue),
        isAnomaly: d.revenue > mean * 1.6 || d.revenue < mean * 0.4,
      }));
    }
    return DUMMY_ANOMALY_DATA;
  }, [transactions]);

  const anomalies = DUMMY_ANOMALIES;

  const totalRevenue = inventory.reduce((s, i) => s + i.Revenue, 0);
  const avgMargin = inventory.length > 0
    ? inventory.reduce((s, i) => s + i.Margin, 0) / inventory.length
    : 28.4;

  const stats = [
    { label: 'Total Revenue', value: totalRevenue > 0 ? `₹${(totalRevenue / 1000).toFixed(0)}K` : '₹847K', icon: DollarSign },
    { label: 'Avg Margin', value: `${avgMargin.toFixed(1)}%`, icon: TrendingUp },
    { label: 'Risk Score', value: `${riskScore || 24}/100`, icon: AlertCircle },
    { label: 'Compliance', value: 'Active', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-8 animate-fade-in text-text">
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-panel border border-border rounded-xl p-5 shadow-sm hover:border-accent/40 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-background rounded-lg border border-border group-hover:border-accent/20 transition-colors">
                <s.icon className="w-4 h-4 text-accent" />
              </div>
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/5 px-2 py-0.5 rounded border border-accent/10">Live</span>
            </div>
            <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-1">{s.label}</div>
            <div className="text-2xl font-bold tracking-tighter text-text">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Anomaly Bar Chart */}
        <div className="lg:col-span-2 bg-panel border border-border rounded-xl p-7 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 text-text">
              <Activity className="w-4 h-4 text-accent" />
              Daily Revenue Anomaly Scan
            </h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-text-muted">
                <div className="w-2 h-2 rounded-sm bg-accent" />
                Normal
              </div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-text-muted">
                <div className="w-2 h-2 rounded-sm bg-danger" />
                Anomaly
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="day"
                stroke="var(--text)"
                fontSize={11}
                tick={{ fill: 'var(--text-muted)' }}
              />
              <YAxis
                stroke="var(--text)"
                fontSize={11}
                tick={{ fill: 'var(--text-muted)' }}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--panel)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                itemStyle={{ color: 'var(--text)' }}
                formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']}
              />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isAnomaly ? 'var(--v-danger)' : 'var(--v-accent)'}
                    opacity={entry.isAnomaly ? 0.9 : 0.6}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Registry */}
        <div className="bg-panel border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2 text-text">
            <AlertCircle className="w-4 h-4 text-danger" />
            Risk Registry
          </h3>

          <div className="space-y-3">
            {anomalies.map((a, i) => (
              <div key={i} className="p-4 rounded-xl bg-background border border-border hover:border-danger/30 transition-all group cursor-default">
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-widest ${
                    a.severity === 'High'
                      ? 'bg-danger/10 text-danger border-danger/20'
                      : 'bg-warning/10 text-warning border-warning/20'
                  }`}>
                    {a.type}
                  </span>
                  <span className="text-[10px] font-mono text-text-muted">{a.id}</span>
                </div>
                <div className="text-xs font-medium text-text leading-snug">{a.reason}</div>
                <div className="text-[10px] text-text-muted mt-2 flex items-center gap-1 font-bold uppercase tracking-widest">
                  Severity:&nbsp;
                  <span className={a.severity === 'High' ? 'text-danger' : 'text-warning'}>
                    {a.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

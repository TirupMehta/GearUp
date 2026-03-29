import { useState, useMemo } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { Calculator, DollarSign, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PriceEngine() {
  const { inventory } = useDashboard();
  const deadWeight = inventory.filter(i => i.Status === 'Dead Weight');

  const [selectedProduct, setSelectedProduct] = useState(deadWeight[0]?.ProductName || '');
  const [discountPercent, setDiscountPercent] = useState(15);
  const [projectedSalesLift, setProjectedSalesLift] = useState(50);

  const product = deadWeight.find(p => p.ProductName === selectedProduct);

  const simulationData = useMemo(() => {
    if (!product) return [];
    const basePrice = product.CurrentPrice;
    const cost = product.Cost;
    const historicalWeeklySales = Math.max(1, Math.round(product.TotalSold / 12));
    const data = [];
    for (let d = 0; d <= 50; d += 5) {
      const simulatedPrice = basePrice * (1 - (d / 100));
      const simulatedLift = 1 + (d * 0.04);
      const simulatedVolume = historicalWeeklySales * simulatedLift;
      const profit = Math.round((simulatedPrice - cost) * simulatedVolume);
      data.push({ discount: d, price: simulatedPrice.toFixed(2), volume: Math.round(simulatedVolume), profit });
    }
    return data;
  }, [product]);

  const currentSimulation = useMemo(() => {
    if (!product) return null;
    const simulatedPrice = product.CurrentPrice * (1 - (discountPercent / 100));
    const simulatedVolume = Math.round((product.TotalSold / 12) * (1 + (projectedSalesLift / 100)));
    const projectedProfit = (simulatedPrice - product.Cost) * simulatedVolume;
    return { simulatedPrice, simulatedVolume, projectedProfit };
  }, [product, discountPercent, projectedSalesLift]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-text-muted">
        <Calculator className="w-12 h-12 mb-4 opacity-30" />
        <p className="text-sm">No dead weight inventory detected. Upload CSV data first.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Side-by-side layout: controls LEFT, chart RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">

        {/* LEFT — Controls */}
        <div className="bg-panel border border-border rounded-xl p-7 shadow-sm flex flex-col gap-6 h-fit">
          <h3 className="font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 text-text">
            <DollarSign className="w-4 h-4 text-accent" />
            Pricing Simulator
          </h3>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted mb-2">
              Dead Weight Item
            </label>
            <select
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              {deadWeight.map(p => (
                <option key={p.ProductName} value={p.ProductName} className="bg-panel">
                  {p.ProductName} — ₹{p.Cost.toFixed(0)} cost
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold mb-3">
              <span className="text-text-muted">Target Discount</span>
              <span className="text-text">{discountPercent}%</span>
            </div>
            <input
              type="range" min="0" max="50" step="1"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Number(e.target.value))}
              className="w-full h-1 bg-border rounded-full appearance-none cursor-pointer accent-accent"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold mb-3">
              <span className="text-text-muted">Expected Sales Lift</span>
              <span className="text-text">+{projectedSalesLift}%</span>
            </div>
            <input
              type="range" min="0" max="200" step="5"
              value={projectedSalesLift}
              onChange={(e) => setProjectedSalesLift(Number(e.target.value))}
              className="w-full h-1 bg-border rounded-full appearance-none cursor-pointer accent-accent"
            />
          </div>

          <div className="pt-4 border-t border-border">
            <div className="text-[10px] uppercase tracking-widest font-bold text-text-muted mb-1">New Simulated Price</div>
            <div className="text-4xl font-bold text-text tracking-tighter">₹{currentSimulation?.simulatedPrice.toFixed(2)}</div>
            <div className="text-[10px] text-text-muted mt-2 font-mono">Cost basis: ₹{product.Cost.toFixed(2)}</div>
          </div>
        </div>

        {/* RIGHT — Chart */}
        <div className="bg-panel border border-border rounded-xl p-7 shadow-sm flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 text-text">
              <TrendingUp className="w-4 h-4 text-accent" />
              Profit Simulation Curve
            </h3>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest font-bold text-text-muted mb-1">
                Projected Weekly Profit
              </div>
              <div className={`text-4xl font-bold tracking-tighter ${currentSimulation!.projectedProfit > 0 ? 'text-text' : 'text-danger'}`}>
                ₹{currentSimulation?.projectedProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-[280px]">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={simulationData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--v-accent)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--v-accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="discount" stroke="var(--text)" fontSize={11} tickFormatter={(v) => `${v}%`} />
                <YAxis stroke="var(--text)" fontSize={11} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: 'var(--text)' }}
                  labelFormatter={(v) => `${v}% Discount`}
                  formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Weekly Profit']}
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="var(--v-accent)"
                  strokeWidth={2}
                  fill="url(#profitGrad)"
                  name="Weekly Profit (₹)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">Selected Discount</div>
              <div className="text-xl font-bold text-text">{discountPercent}%</div>
            </div>
            <div className="text-center border-x border-border">
              <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">Simulated Volume</div>
              <div className="text-xl font-bold text-text">{currentSimulation?.simulatedVolume} units</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">Break-even Price</div>
              <div className="text-xl font-bold text-text">₹{product.Cost.toFixed(0)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

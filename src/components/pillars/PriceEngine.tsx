import { useState, useMemo } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { Calculator, DollarSign, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PriceEngine() {
  const { inventory } = useDashboard();
  const deadWeight = inventory.filter(i => i.Status === 'Dead Weight');
  
  const [selectedProduct, setSelectedProduct] = useState(deadWeight[0]?.ProductName || '');
  const [discountPercent, setDiscountPercent] = useState(15);
  const [projectedSalesLift, setProjectedSalesLift] = useState(50); // Simulated elasticity

  const product = deadWeight.find(p => p.ProductName === selectedProduct);

  const simulationData = useMemo(() => {
    if (!product) return [];
    
    const basePrice = product.CurrentPrice;
    const cost = product.Cost;
    const historicalWeeklySales = Math.max(1, Math.round(product.TotalSold / 12)); // approx weekly
    
    const data = [];
    // Generate a curve showing profit at different discount levels
    for (let d = 0; d <= 50; d += 5) {
      const simulatedPrice = basePrice * (1 - (d / 100));
      const simulatedLift = 1 + (d * 0.04); // pure dummy elasticity math for the UI logic
      const simulatedVolume = historicalWeeklySales * simulatedLift;
      
      const profit = Math.round((simulatedPrice - cost) * simulatedVolume);
      data.push({
        discount: d,
        price: simulatedPrice.toFixed(2),
        volume: Math.round(simulatedVolume),
        profit: profit
      });
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
      <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
        <Calculator className="w-12 h-12 mb-4 opacity-50" />
        <p>No dead weight inventory detected for simulation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Controls */}
        <div className="bg-[#000000]/40 border border-white/5 rounded-2xl p-6 shadow-[0_0_20px_rgba(255,255,255,0.05)] lg:col-span-1">
          <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Pricing Simulator
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Select Dead Weight Item</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-2.5 text-white focus:ring-primary focus:border-primary outline-none"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                {deadWeight.map(p => (
                  <option key={p.ProductName} value={p.ProductName}>
                    {p.ProductName} (Cost: ₹{p.Cost.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="text-zinc-400">Target Discount</label>
                <span className="text-accent font-medium">{discountPercent}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="50" step="1"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-2xl appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="text-zinc-400">Expected Sales Lift</label>
                <span className="text-primary font-medium">+{projectedSalesLift}% Volume</span>
              </div>
              <input 
                type="range" 
                min="0" max="200" step="5"
                value={projectedSalesLift}
                onChange={(e) => setProjectedSalesLift(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-2xl appearance-none cursor-pointer accent-primary"
              />
            </div>
            
            <div className="pt-4 border-t border-white/5">
              <div className="bg-white/5 rounded-2xl p-4">
                <div className="text-sm text-zinc-400 mb-1">New Simulated Price</div>
                <div className="text-2xl font-bold text-white">₹{currentSimulation?.simulatedPrice.toFixed(2)}</div>
                <div className="text-xs text-zinc-500 mt-2">Cost: ₹{product.Cost.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-[#000000]/40 border border-white/5 rounded-2xl p-6 shadow-[0_0_20px_rgba(255,255,255,0.05)] lg:col-span-2">
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Scenario-Based Profit Simulation
            </h3>
            <div className="text-right">
              <div className="text-sm text-zinc-400">Projected Weekly Profit</div>
              <div className={`text-3xl font-bold ${currentSimulation!.projectedProfit > 0 ? 'text-accent' : 'text-danger'}`}>
                ₹{currentSimulation?.projectedProfit.toLocaleString()}
              </div>
            </div>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={simulationData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="discount" stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${v}%`} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                  labelFormatter={(v) => `${v}% Discount`}
                />
                <Area 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#22c55e" 
                  fillOpacity={1} 
                  fill="url(#colorProfit)" 
                  name="Weekly Profit (₹)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

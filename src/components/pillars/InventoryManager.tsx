import { useDashboard } from '../../context/DashboardContext';
import { PackageOpen, Plus, Minus, BrainCircuit, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function InventoryManager() {
  const { stockMap, updateStock, inventory, llmApiKey } = useDashboard();
  const [snapshotObj, setSnapshotObj] = useState('');
  const [snapshotLoading, setSnapshotLoading] = useState(false);

  // Derive unique product states
  const allProducts = Array.from(new Set(inventory.map(i => i.ProductName))).map(name => {
    return inventory.find(i => i.ProductName === name)!;
  });

  const generateSnapshot = async () => {
    if (!llmApiKey) {
      alert("Please configure your API Key first.");
      return;
    }
    setSnapshotLoading(true);
    try {
      // Build a minimal inventory string
      const invString = allProducts.map(p => `${p.ProductName}(stock:${stockMap[p.ProductName]||0}, status:${p.Status})`).join(", ");
      const prompt = `You are an AI inventory advisor for an Indian retail shop. Here is the current stock:
${invString}

Give a SHORT daily action list (max 50 words). Format:
🟢 RESTOCK: [product names that are Fast Moving with low stock]
🔴 STOP BUYING: [product names that are Dead Weight with high stock]
Be specific with product names. No generic advice.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${llmApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "No insights found.";
      setSnapshotObj(textResponse);
    } catch (e: any) {
      setSnapshotObj(`Error: ${e.message}`);
    }
    setSnapshotLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white/60 dark:bg-[#000000]/40 border border-black/10 dark:border-white/5 rounded-2xl p-6 shadow-[0_0_20px_rgba(255,255,255,0.05)] flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <PackageOpen className="w-5 h-5 text-primary" />
            Full Inventory Manager
          </h3>
          <p className="text-sm text-slate-600 dark:text-zinc-400 mt-1">Manually update stock counts or fetch AI recommendations.</p>
        </div>
        
        <button 
          onClick={generateSnapshot}
          disabled={snapshotLoading}
          className="bg-accent hover:bg-accent/80 text-slate-900 dark:text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 transition disabled:opacity-50"
        >
          {snapshotLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5" />}
          AI Daily Snapshot
        </button>
      </div>

      {snapshotObj && (
        <div className="bg-primary/10 border border-primary/50 text-slate-900 dark:text-white rounded-2xl p-5 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-2 mb-3">
            <BrainCircuit className="w-5 h-5 text-primary" />
            <span className="font-semibold text-primary">AI Daily Snapshot</span>
          </div>
          <div className="text-sm text-slate-200 whitespace-pre-line">{snapshotObj}</div>
        </div>
      )}

      <div className="bg-white/60 dark:bg-[#000000]/40 border border-black/10 dark:border-white/5 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.05)]">
        <table className="w-full text-sm text-left">
          <thead className="bg-black/10 dark:bg-white/10 backdrop-blur-xl text-slate-600 dark:text-zinc-400">
            <tr>
              <th className="px-6 py-4 font-semibold">Product Name</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold text-center">In Stock</th>
              <th className="px-6 py-4 font-semibold text-right">Manual Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {allProducts.map((p, idx) => (
              <tr key={idx} className="hover:bg-[#000000]/30 backdrop-blur-sm transition">
                <td className="px-6 py-4 font-medium text-slate-200">{p.ProductName}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-zinc-400">{p.Category}</td>
                <td className="px-6 py-4 text-center text-lg font-semibold text-slate-900 dark:text-white">
                  {stockMap[p.ProductName] || 0}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => updateStock(p.ProductName, -1)}
                      className="p-2 bg-black/5 dark:bg-white/5 hover:bg-danger/80 hover:text-slate-900 dark:text-white rounded-2xl transition border border-black/10 dark:border-white/5 hover:border-danger"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => updateStock(p.ProductName, 1)}
                      className="p-2 bg-black/5 dark:bg-white/5 hover:bg-primary/80 hover:text-slate-900 dark:text-white rounded-2xl transition border border-black/10 dark:border-white/5 hover:border-primary"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => updateStock(p.ProductName, 10)}
                      className="px-3 py-1 text-xs font-semibold bg-black/5 dark:bg-white/5 hover:bg-slate-700 text-slate-700 dark:text-zinc-300 rounded-2xl transition border border-black/10 dark:border-white/5"
                    >
                      +10
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

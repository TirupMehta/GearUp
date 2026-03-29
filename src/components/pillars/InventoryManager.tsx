import { useDashboard } from '../../context/DashboardContext';
import { PackageOpen, BrainCircuit, Loader2, Check } from 'lucide-react';
import { useState } from 'react';

export default function InventoryManager() {
  const { stockMap, updateStock, inventory, llmApiKey } = useDashboard();
  const [snapshotObj, setSnapshotObj] = useState('');
  const [snapshotLoading, setSnapshotLoading] = useState(false);
  // editMap: productName -> current edit value (string), null means not editing
  const [editMap, setEditMap] = useState<Record<string, string | null>>({});

  const allProducts = Array.from(new Set(inventory.map(i => i.ProductName))).map(name => {
    return inventory.find(i => i.ProductName === name)!;
  });

  const generateSnapshot = async () => {
    if (!llmApiKey) { alert("Please configure your API Key first."); return; }
    setSnapshotLoading(true);
    try {
      const invString = allProducts.map(p => `${p.ProductName}(stock:${stockMap[p.ProductName]||0}, status:${p.Status})`).join(", ");
      const prompt = `You are ShopGenie, a high-performance inventory analyst. 
Analyze this inventory snapshot for a retail business:
${invString}

Provide a CLEAR, ACTIONABLE Daily Strategic Snapshot (under 80 words) for the business owner.
Use this format:
- 🟢 STOCK UP: [Products to reorder due to high demand/low stock]
- 🔴 LIQUIDATE: [Dead weight items to discount/clear immediately]
- 💡 INSIGHT: [One specific data-driven trend or advice]

Be direct, professional, and easy to understand.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${llmApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      setSnapshotObj(data.candidates?.[0]?.content?.parts?.[0]?.text || "No insights found.");
    } catch (e: any) {
      setSnapshotObj(`Error: ${e.message}`);
    }
    setSnapshotLoading(false);
  };

  const startEdit = (productName: string) => {
    setEditMap(prev => ({ ...prev, [productName]: String(stockMap[productName] || 0) }));
  };

  const cancelEdit = (productName: string) => {
    setEditMap(prev => ({ ...prev, [productName]: null }));
  };

  const commitEdit = (productName: string) => {
    const rawVal = editMap[productName];
    if (rawVal === null || rawVal === undefined) return;
    const newAbsolute = parseInt(rawVal, 10);
    if (!isNaN(newAbsolute)) {
      // Pass absolute value directly so context can log old→new correctly
      updateStock(productName, 0, newAbsolute);
    }
    cancelEdit(productName);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-panel border border-border rounded-xl p-6 shadow-sm flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-base flex items-center gap-2 text-text">
            <PackageOpen className="w-4 h-4 text-accent" />
            Full Inventory Manager
          </h3>
          <p className="text-xs text-text-muted mt-1">Click a stock number to edit it directly.</p>
        </div>
        <button
          onClick={generateSnapshot}
          disabled={snapshotLoading}
          className="bg-accent hover:opacity-90 text-background px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition disabled:opacity-50 text-[10px] uppercase tracking-widest"
        >
          {snapshotLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
          AI Daily Snapshot
        </button>
      </div>

      {snapshotObj && (
        <div className="bg-panel border border-border text-text rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BrainCircuit className="w-4 h-4 text-accent" />
            <span className="font-bold text-text uppercase tracking-widest text-[10px]">AI Strategic Insight</span>
          </div>
          <div className="text-sm text-text-muted leading-relaxed whitespace-pre-line bg-background/50 p-5 rounded-lg border border-border/50">{snapshotObj}</div>
        </div>
      )}

      <div className="bg-panel border border-border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-background text-text-muted uppercase tracking-widest text-[10px] border-b border-border">
            <tr>
              <th className="px-6 py-4 font-bold">Product</th>
              <th className="px-6 py-4 font-bold text-center">Status</th>
              <th className="px-6 py-4 font-bold text-center">Stock Management</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {inventory.map((p, i) => {
              const currentStock = stockMap[p.ProductName] || 0;
              const isEditing = editMap[p.ProductName] !== null && editMap[p.ProductName] !== undefined;
              const editVal = editMap[p.ProductName] ?? '';
              const hasChanged = isEditing && editVal !== String(currentStock) && editVal !== '';

              let displayStatus = 'Normal';
              let statusClass = 'bg-border/30 text-text-muted border border-border';
              
              if (currentStock === 0) {
                displayStatus = 'Out of Stock';
                statusClass = 'bg-danger/10 text-danger border border-danger/20';
              } else if (currentStock < 20) {
                displayStatus = 'Low Stock';
                statusClass = 'bg-warning/10 text-warning border border-warning/20';
              } else if (currentStock >= 100) {
                displayStatus = 'High Stock';
                statusClass = 'bg-accent/10 text-accent border border-accent/20';
              }

              return (
                <tr key={i} className="hover:bg-background/40 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-text">{p.ProductName}</div>
                    <div className="text-xs text-text-muted mt-0.5">{p.Category}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${statusClass}`}>
                      {displayStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* Decrement */}
                      <button
                        onClick={() => {
                          const current = isEditing && editVal !== '' ? parseInt(editVal, 10) : currentStock;
                          setEditMap(prev => ({ ...prev, [p.ProductName]: String(Math.max(0, current - 1)) }));
                        }}
                        className="p-1.5 bg-background hover:bg-danger/10 hover:text-danger rounded-md transition border border-border text-text-muted text-xs font-bold w-7 h-7 flex items-center justify-center shrink-0"
                      >
                        −
                      </button>

                      {/* Stock value - click to edit */}
                      {isEditing ? (
                        <input
                          autoFocus
                          type="number"
                          value={editVal}
                          onChange={e => setEditMap(prev => ({ ...prev, [p.ProductName]: e.target.value }))}
                          onBlur={() => { if (!hasChanged) cancelEdit(p.ProductName); }}
                          onKeyDown={e => {
                            if (e.key === 'Enter') commitEdit(p.ProductName);
                            if (e.key === 'Escape') cancelEdit(p.ProductName);
                          }}
                          className="w-16 text-center bg-background border border-accent/50 rounded-md px-1 py-1 font-mono font-bold text-text focus:outline-none focus:ring-1 focus:ring-accent text-sm"
                        />
                      ) : (
                        <button
                          onClick={() => startEdit(p.ProductName)}
                          title="Click to edit"
                          className="w-16 text-center font-mono font-bold text-text bg-background hover:bg-accent/5 hover:border-accent/40 border border-border rounded-md px-1 py-1 transition text-sm cursor-text"
                        >
                          {currentStock}
                        </button>
                      )}

                      {/* Increment */}
                      <button
                        onClick={() => {
                          const current = isEditing && editVal !== '' ? parseInt(editVal, 10) : currentStock;
                          setEditMap(prev => ({ ...prev, [p.ProductName]: String(current + 1) }));
                        }}
                        className="p-1.5 bg-background hover:bg-accent/10 hover:text-accent rounded-md transition border border-border text-text-muted text-xs font-bold w-7 h-7 flex items-center justify-center shrink-0"
                      >
                        +
                      </button>

                      {/* Save — only visible when value changed */}
                      {hasChanged && (
                        <button
                          onClick={() => commitEdit(p.ProductName)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-accent text-background rounded-md text-[10px] font-bold uppercase tracking-widest transition hover:opacity-90 shadow-sm shrink-0 whitespace-nowrap"
                        >
                          <Check className="w-3 h-3" />
                          Update the Stock
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

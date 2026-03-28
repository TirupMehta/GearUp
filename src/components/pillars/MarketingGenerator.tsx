import { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { Megaphone, Languages, Loader2 } from 'lucide-react';

export default function MarketingGenerator() {
  const { inventory, llmApiKey } = useDashboard();
  const deadWeight = inventory.filter(i => i.Status === 'Dead Weight');
  
  const [selectedProduct, setSelectedProduct] = useState(deadWeight[0]?.ProductName || '');
  const [discountValue, setDiscountValue] = useState('20%');
  const [marketPlatform, setMarketPlatform] = useState('WhatsApp');
  const [language, setLanguage] = useState('English');
  const [generatedCopy, setGeneratedCopy] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const product = deadWeight.find(p => p.ProductName === selectedProduct);

  const handleGenerate = async () => {
    if (!llmApiKey) {
      alert("Please configure your LLM API Key in the settings before generating campaigns.");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const prompt = `Write a promotional blast for a ${marketPlatform} campaign in ${language}. 
We are offering a discount of ${discountValue} on a slow-moving product: "${selectedProduct}". 
The regular price is ₹${product?.CurrentPrice.toFixed(2)}. 
CRITICAL RULE: Output MUST BE UNDER 10 WORDS TOTAL. Brutally short. Emojis allowed.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${llmApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
      setGeneratedCopy(textResponse);
    } catch (error: any) {
      setGeneratedCopy(`API Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <Megaphone className="w-12 h-12 mb-4 opacity-50" />
        <p>No dead weight inventory detected to market.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      {/* Configuration Panel */}
      <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-6 shadow-lg">
        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-primary" />
          Campaign Configuration
        </h3>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Target Product (Slow Moving)</label>
            <select 
              className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-primary focus:border-primary outline-none"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              {deadWeight.map(p => (
                <option key={p.ProductName} value={p.ProductName}>
                  {p.ProductName} (Stock: {p.TotalSold} sold historically)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Discount Offering</label>
              <input 
                type="text" 
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Platform</label>
              <select 
                value={marketPlatform}
                onChange={(e) => setMarketPlatform(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-primary focus:border-primary outline-none"
              >
                <option>WhatsApp</option>
                <option>Instagram Caption</option>
                <option>Facebook Post</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2 flex items-center gap-2">
              <Languages className="w-4 h-4 text-accent" />
              Target Language translation
            </label>
            <div className="flex gap-2">
              {['English', 'Spanish', 'Hindi'].map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-4 py-2 rounded-lg text-sm transition ${
                    language === lang 
                      ? 'bg-primary text-white font-medium shadow-lg shadow-primary/20' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full mt-6 bg-primary hover:bg-primaryHover text-white py-3 rounded-lg font-medium transition flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate Campaign via LLM'}
          </button>
        </div>
      </div>

      {/* Output Panel */}
      <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-6 shadow-lg flex flex-col">
        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2 text-slate-300">
          Generated Output
        </h3>
        
        <div className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl p-5 font-mono text-sm leading-relaxed text-slate-300 whitespace-pre-wrap relative">
          {generatedCopy ? generatedCopy : (
            <span className="text-slate-500 flex items-center justify-center h-full">
              Waiting for generation parameters...
            </span>
          )}
          
          {generatedCopy && (
            <button 
              className="absolute top-4 right-4 text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded transition"
              onClick={() => navigator.clipboard.writeText(generatedCopy)}
            >
              Copy
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useRef, useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Upload, Settings, Info } from 'lucide-react';

export const UploadScreen: React.FC = () => {
  const { loadCsvData, isLoading, llmApiKey, setLlmApiKey, skipUpload } = useDashboard();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [tempKey, setTempKey] = useState(llmApiKey);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadCsvData(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      loadCsvData(file);
    } else {
      alert("Please drop a valid .csv file.");
    }
  };

  const saveSettings = () => {
    setLlmApiKey(tempKey);
    setShowSettings(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse-glow" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-[120px] -z-10" />

      {/* Settings Button */}
      <button 
        onClick={() => setShowSettings(!showSettings)}
        className="absolute top-6 right-6 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/20 dark:border-white/10 hover:bg-black/10 dark:bg-white/10 transition shadow-lg backdrop-blur-md z-50 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:text-white"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Settings Modal */}
      {showSettings && (
        <div className="absolute top-20 right-6 w-80 bg-white/90 dark:bg-[#000000]/80 backdrop-blur-2xl border border-black/20 dark:border-white/10 rounded-2xl p-6 shadow-2xl z-50 animate-fadeIn ring-1 ring-white/5">
          <h3 className="text-lg font-bold mb-3 text-slate-900 dark:text-white">LLM Configuration</h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400 mb-5 leading-relaxed">
            Enter your OpenAI API key to power the AI features. The key is stored locally in your browser.
          </p>
          <input 
            type="password"
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            placeholder="sk-..."
            className="w-full bg-zinc-900/50 border border-black/20 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-zinc-500 mb-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
          />
          <button 
            onClick={saveSettings}
            className="w-full bg-primary hover:bg-primaryHover text-slate-900 dark:text-white py-3 rounded-xl text-sm font-semibold transition shadow-lg shadow-primary/20"
          >
            Save Key
          </button>
        </div>
      )}

      <div className="max-w-xl w-full relative z-10 animate-fadeIn">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4 tracking-tight">
            ShopGenie AI Copilot
          </h1>
          <p className="text-lg text-slate-600 dark:text-zinc-400 font-medium">
            Secure, zero-hallucination business intelligence driven directly by your store's transaction data.
          </p>
        </div>

        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="bg-white/60 dark:bg-[#000000]/40 border-2 border-dashed border-black/20 dark:border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-black/5 dark:bg-white/5 transition-all duration-300 group backdrop-blur-xl shadow-2xl"
        >
          <input 
            type="file" 
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden" 
          />
          
          <div className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 ring-1 ring-white/10">
            <Upload className="w-10 h-10 text-primary" />
          </div>
          
          <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-primary transition-colors">
            {isLoading ? 'Processing Data securely...' : 'Upload your Store CSV to Begin'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-zinc-500 text-center max-w-sm">
            Drag and drop or click to browse. We process all algorithms locally in your browser.
          </p>
        </div>

        <div className="mt-8 bg-black/5 dark:bg-white/5 rounded-2xl p-5 flex gap-3 text-sm text-slate-700 dark:text-zinc-300 border border-black/10 dark:border-white/5 backdrop-blur-md">
          <Info className="w-5 h-5 text-accent shrink-0 animate-pulse-glow" />
          <p className="leading-relaxed">
            Expected CSV Columns: <span className="font-mono text-accent bg-accent/10 px-1.5 py-0.5 rounded">Date, ProductName, Category, QuantitySold, SalePrice, UnitCost</span>
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <button 
            onClick={skipUpload}
            className="text-sm text-slate-400 hover:text-slate-900 dark:text-white transition"
          >
            Skip for now (continue without file)
          </button>
        </div>
      </div>
    </div>
  );
};

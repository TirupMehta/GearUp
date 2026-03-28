import React, { useRef, useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Upload, Settings, Info } from 'lucide-react';

export const UploadScreen: React.FC = () => {
  const { loadCsvData, isLoading, llmApiKey, setLlmApiKey } = useDashboard();
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative">
      
      {/* Settings Button */}
      <button 
        onClick={() => setShowSettings(!showSettings)}
        className="absolute top-6 right-6 p-3 rounded-full bg-panel hover:bg-slate-700 transition"
      >
        <Settings className="w-6 h-6 text-slate-300" />
      </button>

      {/* Settings Modal Stub */}
      {showSettings && (
        <div className="absolute top-20 right-6 w-80 bg-panel border border-slate-700 rounded-xl p-5 shadow-2xl z-50 animate-fade-in">
          <h3 className="text-lg font-semibold mb-3">LLM Configuration</h3>
          <p className="text-xs text-slate-400 mb-4">
            Enter your OpenAI API key to power the AI features. The key is stored locally in your browser.
          </p>
          <input 
            type="password"
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            placeholder="sk-..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm mb-4 focus:ring-1 focus:ring-primary focus:outline-none"
          />
          <button 
            onClick={saveSettings}
            className="w-full bg-primary hover:bg-primaryHover text-white py-2 rounded-lg text-sm font-medium transition"
          >
            Save Key
          </button>
        </div>
      )}

      <div className="max-w-xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            ShopGenie AI Copilot
          </h1>
          <p className="text-lg text-slate-400">
            Secure, zero-hallucination business intelligence driven directly by your store's transaction data.
          </p>
        </div>

        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="bg-panel border-2 border-dashed border-slate-600 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-slate-800 transition group"
        >
          <input 
            type="file" 
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden" 
          />
          
          <div className="bg-slate-800 p-4 rounded-full mb-6 group-hover:bg-primary/20 transition">
            <Upload className="w-10 h-10 text-primary" />
          </div>
          
          <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-primary transition">
            {isLoading ? 'Processing Data securely...' : 'Upload your Store CSV to Begin'}
          </h3>
          <p className="text-sm text-slate-400 text-center max-w-sm">
            Drag and drop or click to browse. We process all mathematical algorithms locally in your browser.
          </p>
        </div>

        <div className="mt-8 bg-slate-800/50 rounded-lg p-4 flex gap-3 text-sm text-slate-300 border border-slate-700/50">
          <Info className="w-5 h-5 text-accent shrink-0" />
          <p>
            Expected CSV Columns: <span className="font-mono text-accent">Date, ProductName, Category, QuantitySold, SalePrice, UnitCost</span>
          </p>
        </div>
      </div>
    </div>
  );
};

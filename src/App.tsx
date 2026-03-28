import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useDashboard } from './context/DashboardContext';
import { LoginScreen } from './components/LoginScreen';
import { UploadScreen } from './components/UploadScreen';
import { SplashScreen } from './components/SplashScreen';
import { Sidebar } from './components/Sidebar';
import { Copilot } from './components/Copilot';
import { LogOut } from 'lucide-react';

import InventoryIntelligence from './components/pillars/InventoryIntelligence';
import InventoryManager from './components/pillars/InventoryManager';
import PriceEngine from './components/pillars/PriceEngine';
import MarketingGenerator from './components/pillars/MarketingGenerator';
import BusinessHealth from './components/pillars/BusinessHealth';

function App() {
  const { user, loading, logout } = useAuth();
  const { hasData } = useDashboard();
  const [activeTab, setActiveTab] = useState('manager');
  const [showSplash, setShowSplash] = useState(true);

  // Show splash animation before anything else
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // Show loading while Firebase checks session
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in → show login screen
  if (!user) {
    return <LoginScreen />;
  }

  // Logged in but no data yet → show upload screen
  if (!hasData) {
    return <UploadScreen />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col h-full overflow-y-auto w-full max-w-[calc(100%-320px)] relative">
        <header className="sticky top-0 z-10 bg-panel/80 backdrop-blur-md border-b border-slate-700/50 p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {activeTab === 'manager' && 'Inventory Manager'}
              {activeTab === 'inventory' && 'Inventory Intelligence'}
              {activeTab === 'pricing' && 'Intelligent Price Engine'}
              {activeTab === 'marketing' && 'AI Marketing Generator'}
              {activeTab === 'health' && 'Business Health Dashboard'}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Logged in as <span className="text-primary">{user.email}</span>
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-danger/80 text-slate-300 hover:text-white rounded-lg border border-slate-700 hover:border-danger transition text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </header>
        
        <div className="p-6 flex-1 bg-gradient-to-br from-background to-[#111827]">
          {activeTab === 'manager' && <InventoryManager />}
          {activeTab === 'inventory' && <InventoryIntelligence />}
          {activeTab === 'pricing' && <PriceEngine />}
          {activeTab === 'marketing' && <MarketingGenerator />}
          {activeTab === 'health' && <BusinessHealth />}
        </div>
      </main>

      <Copilot />
    </div>
  );
}

export default App;

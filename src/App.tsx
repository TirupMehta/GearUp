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
    <div className="flex flex-col lg:flex-row h-full w-full overflow-hidden bg-background selection:bg-primary/30 selection:text-slate-900 dark:text-white relative z-0">
      
      {/* Universal Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-primary/20 rounded-full blur-[150px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-accent/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col h-full min-h-0 overflow-y-auto w-full relative pb-20 lg:pb-0 z-10">
        <header className="sticky top-0 z-10 bg-slate-50/80 dark:bg-[#000000]/80 backdrop-blur-xl border-b border-black/10 dark:border-white/5 p-4 lg:p-6 flex justify-between items-center shrink-0 min-h-[72px]">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
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
            className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-black/5 dark:bg-white/5 hover:bg-danger/80 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:text-white rounded-xl lg:rounded-lg border border-black/20 dark:border-white/10 hover:border-danger backdrop-blur-md transition-all duration-300 text-sm font-semibold shadow-lg shadow-black/20"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden lg:inline">Logout</span>
          </button>
        </header>
        
        <div className="p-4 lg:p-6 flex-1 bg-transparent">
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

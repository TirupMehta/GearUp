import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useDashboard } from './context/DashboardContext';
import { LoginScreen } from './components/LoginScreen';
import { UploadScreen } from './components/UploadScreen';
import { SplashScreen } from './components/SplashScreen';
import { Sidebar } from './components/Sidebar';
import { Copilot } from './components/Copilot';
import { useTheme } from './context/ThemeContext';
import { LogOut, Sun, Moon } from 'lucide-react';

import InventoryIntelligence from './components/pillars/InventoryIntelligence';
import InventoryManager from './components/pillars/InventoryManager';
import PriceEngine from './components/pillars/PriceEngine';
import MarketingGenerator from './components/pillars/MarketingGenerator';
import BusinessHealth from './components/pillars/BusinessHealth';
import ActivityLog from './components/pillars/ActivityLog';

const TAB_LABELS: Record<string, string> = {
  manager:   'Inventory Manager',
  inventory: 'Inventory Intelligence',
  pricing:   'Intelligent Price Engine',
  marketing: 'AI Marketing Generator',
  health:    'Business Health Dashboard',
  logs:      'Activity Log',
};

function App() {
  const { user, loading, logout } = useAuth();
  const { hasData } = useDashboard();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('manager');
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) return <SplashScreen onComplete={() => setShowSplash(false)} />;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <LoginScreen />;
  if (!hasData) return <UploadScreen />;

  // Display name: email prefix before @
  const displayName = user.displayName || user.email?.split('@')[0] || 'user';

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* LEFT: fixed-width sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* CENTER: takes remaining space, scrollable */}
      <main className="flex-1 min-w-0 flex flex-col h-full overflow-hidden bg-background">
        {/* Sticky header */}
        <header className="shrink-0 sticky top-0 z-10 bg-background/90 backdrop-blur-md border-b border-border h-14 flex items-center justify-between px-4 sm:px-6 gap-4">
          <div className="min-w-0">
            <h1 className="text-xs font-bold text-text uppercase tracking-widest leading-none truncate">
              {TAB_LABELS[activeTab] ?? activeTab}
            </h1>
            <p className="text-xs text-text-muted mt-0.5 truncate">
              Logged in as&nbsp;
              <span className="text-accent font-semibold">{displayName}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-panel hover:bg-background border border-border text-text transition-all"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-warning" />}
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-panel hover:bg-danger hover:text-white text-text-muted rounded-md border border-border transition text-xs font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
          <div className="p-4 sm:p-6 lg:p-8 flex-1">
            {activeTab === 'manager'   && <InventoryManager />}
            {activeTab === 'inventory' && <InventoryIntelligence />}
            {activeTab === 'pricing'   && <PriceEngine />}
            {activeTab === 'marketing' && <MarketingGenerator />}
            {activeTab === 'health'    && <BusinessHealth />}
            {activeTab === 'logs'      && <ActivityLog />}
          </div>
          
          {/* Subtle Credentials Footer */}
          <div className="py-6 mt-auto text-center text-[10px] text-text-muted flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 opacity-30 hover:opacity-100 transition-opacity select-none cursor-default font-mono">
            <span>Ui UX & Frontend : Dhruv Patva & Tirup Maheta</span>
            <span className="hidden sm:inline text-border">•</span>
            <span>Ai & Backend : Varad vekariya</span>
            <span className="hidden sm:inline text-border">•</span>
            <span>Documentation : Sanidhya Roy</span>
          </div>
        </div>
      </main>

      {/* RIGHT: copilot panel */}
      <Copilot />
    </div>
  );
}

export default App;

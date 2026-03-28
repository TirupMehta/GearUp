import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Tag, MessageSquare, Activity, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { transactions, riskScore } = useDashboard();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const navItems = [
    { id: 'manager', label: 'Inventory Manager', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory Intelligence', icon: Activity },
    { id: 'pricing', label: 'Intelligent Price', icon: Tag },
    { id: 'marketing', label: 'Marketing Generator', icon: MessageSquare },
    { id: 'health', label: 'Business Health', icon: Activity },
  ];

  return (
    <aside className="w-full lg:w-[320px] shrink-0 bg-panel border-b lg:border-b-0 lg:border-r border-black/10 dark:border-white/5 flex flex-col z-20">
      <div className="p-4 lg:p-6 flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-bold text-sm">SG</span>
          </div>
          <span className="bg-gradient-to-r from-slate-900 dark:from-white to-slate-500 dark:to-zinc-400 bg-clip-text text-transparent tracking-tight">ShopGenie AI</span>
        </h2>
        
        <button 
          onClick={() => setIsDark(!isDark)}
          className="p-2 ml-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 border border-black/10 dark:border-white/5"
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-zinc-400 hover:text-warning transition-colors" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600 hover:text-primary transition-colors" />
          )}
        </button>
      </div>

      <nav className="flex lg:flex-1 lg:flex-col overflow-x-auto lg:overflow-visible px-4 lg:space-y-2 gap-2 pb-2 lg:pb-0 hide-scrollbar scroll-smooth">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-shrink-0 lg:w-full flex items-center gap-2 lg:gap-3 px-4 py-2 lg:py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-primary to-accent text-white font-bold shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-white/20 scale-[1.02]' 
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 lg:w-5 lg:h-5 ${isActive ? 'text-white' : ''}`} />
              <span className="whitespace-nowrap text-sm lg:text-base">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="hidden lg:block p-6 border-t border-black/10 dark:border-white/5 mt-auto">
        <div className="bg-white/60 dark:bg-[#000000]/50 rounded-2xl p-4 border border-black/10 dark:border-white/5 backdrop-blur-md shadow-sm dark:shadow-none">
          <div className="flex items-center gap-2 mb-2 text-sm text-slate-600 dark:text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-accent animate-pulse-glow" />
            <span className="font-bold tracking-wide text-xs uppercase text-slate-900 dark:text-white">Data Integrity Active</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-500">
            {transactions.length} verified transactions loaded.
          </p>
          
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-slate-600 dark:text-zinc-400">Health Risk Score</span>
              <span className={riskScore > 50 ? 'text-danger' : 'text-accent'}>{riskScore}/100</span>
            </div>
            <div className="w-full bg-black/5 dark:bg-white/5 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full ${riskScore > 50 ? 'bg-danger' : 'bg-accent'}`} 
                style={{ width: `${riskScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

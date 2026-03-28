import React from 'react';
import { LayoutDashboard, Tag, MessageSquare, Activity, ShieldCheck } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { transactions, riskScore } = useDashboard();

  const navItems = [
    { id: 'manager', label: 'Inventory Manager', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory Intelligence', icon: Activity },
    { id: 'pricing', label: 'Intelligent Price', icon: Tag },
    { id: 'marketing', label: 'Marketing Generator', icon: MessageSquare },
    { id: 'health', label: 'Business Health', icon: Activity },
  ];

  return (
    <aside className="w-full lg:w-[320px] shrink-0 bg-panel border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col z-20">
      <div className="p-4 lg:p-6 flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-bold text-sm">SG</span>
          </div>
          <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">ShopGenie AI</span>
        </h2>
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
                  ? 'bg-primary/10 text-primary font-semibold ring-1 ring-primary/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
                  : 'text-zinc-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 lg:w-5 lg:h-5 ${isActive ? 'text-primary' : ''}`} />
              <span className="whitespace-nowrap text-sm lg:text-base">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="hidden lg:block p-6 border-t border-white/5 mt-auto">
        <div className="bg-[#000000]/50 rounded-2xl p-4 border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-2 text-sm text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-accent animate-pulse-glow" />
            <span className="font-medium tracking-wide text-xs uppercase">Data Integrity Active</span>
          </div>
          <p className="text-xs text-zinc-500">
            {transactions.length} verified transactions loaded.
          </p>
          
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-zinc-400">Health Risk Score</span>
              <span className={riskScore > 50 ? 'text-danger' : 'text-accent'}>{riskScore}/100</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
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

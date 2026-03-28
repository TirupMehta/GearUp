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
    <aside className="w-[320px] shrink-0 bg-panel border-r border-slate-700/50 flex flex-col h-full">
      <div className="p-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-white font-bold text-sm">SG</span>
          </div>
          ShopGenie AI
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-primary/10 text-primary font-semibold' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-700/50">
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center gap-2 mb-2 text-sm text-slate-400">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>Data Integrity Active</span>
          </div>
          <p className="text-xs text-slate-500">
            {transactions.length} verified transactions loaded.
          </p>
          
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Health Risk Score</span>
              <span className={riskScore > 50 ? 'text-danger' : 'text-accent'}>{riskScore}/100</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
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

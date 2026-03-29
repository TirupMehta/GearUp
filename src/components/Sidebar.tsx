import React from 'react';
import {
  BarChart3,
  Package,
  TrendingUp,
  ShieldCheck,
  MessageSquare,
  Activity,
  ClipboardList,
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { transactions, riskScore } = useDashboard();

  const navItems = [
    { id: 'manager',   label: 'Inventory Manager',       icon: Package },
    { id: 'inventory', label: 'Inventory Intelligence',  icon: BarChart3 },
    { id: 'pricing',   label: 'Intelligent Price',       icon: TrendingUp },
    { id: 'marketing', label: 'Marketing Generator',     icon: MessageSquare },
    { id: 'health',    label: 'Business Health',         icon: Activity },
    { id: 'logs',      label: 'Activity Log',            icon: ClipboardList },
  ];

  return (
    <aside className="w-[220px] shrink-0 bg-panel border-r border-border flex flex-col h-full">
      {/* Logo */}
      <div className="h-14 px-4 border-b border-border flex items-center gap-2.5 shrink-0">
        <div className="w-6 h-6 rounded bg-accent flex items-center justify-center shrink-0">
          <span className="text-background font-black text-[9px]">SG</span>
        </div>
        <span className="text-[11px] font-bold text-text uppercase tracking-widest leading-none">
          ShopGenie AI
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-xs font-medium text-left ${
                isActive
                  ? 'bg-background text-accent ring-1 ring-border'
                  : 'text-text-muted hover:bg-background/50 hover:text-text'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-accent' : ''}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer widget */}
      <div className="p-3 border-t border-border shrink-0">
        <div className="bg-background/50 rounded-lg p-3 border border-border">
          <div className="flex items-center gap-1.5 mb-2 text-[10px] font-bold text-text-muted uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3 text-accent" />
            Data Integrity
          </div>
          <p className="text-[10px] text-text-muted">
            {transactions.length} verified points loaded.
          </p>
          <div className="mt-3">
            <div className="flex justify-between text-[10px] mb-1 uppercase tracking-wider font-bold">
              <span className="text-text-muted">Health Risk</span>
              <span className={riskScore > 50 ? 'text-danger' : 'text-accent'}>{riskScore}%</span>
            </div>
            <div className="w-full bg-background rounded-full h-1 overflow-hidden">
              <div
                className={`h-full transition-all ${riskScore > 50 ? 'bg-danger' : 'bg-accent'}`}
                style={{ width: `${riskScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

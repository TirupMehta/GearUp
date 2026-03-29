import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import {
  Package,
  Upload,
  TrendingUp,
  Megaphone,
  BrainCircuit,
  LogIn,
  LogOut,
  Activity,
  Loader2,
  ClipboardList,
} from 'lucide-react';

interface LogEntry {
  id: string;
  action: string;
  detail: string;
  userEmail: string;
  timestamp: { toDate: () => Date } | null;
}

const ACTION_META: Record<string, { label: string; icon: any; color: string }> = {
  STOCK_UPDATE:       { label: 'Stock Updated',     icon: Package,      color: 'text-accent' },
  CSV_UPLOADED:       { label: 'CSV Uploaded',       icon: Upload,       color: 'text-accent' },
  PRICE_SIMULATED:    { label: 'Price Simulated',    icon: TrendingUp,   color: 'text-text-muted' },
  CAMPAIGN_GENERATED: { label: 'Campaign Generated', icon: Megaphone,    color: 'text-warning' },
  AI_SNAPSHOT:        { label: 'AI Snapshot',        icon: BrainCircuit, color: 'text-accent' },
  AI_STRATEGY:        { label: 'AI Strategy',        icon: BrainCircuit, color: 'text-accent' },
  LOGIN:              { label: 'Logged In',          icon: LogIn,        color: 'text-accent' },
  LOGOUT:             { label: 'Logged Out',         icon: LogOut,       color: 'text-danger' },
};

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ActivityLog() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, `users/${user.uid}/activityLog`),
      orderBy('timestamp', 'desc'),
      limit(150)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const entries: LogEntry[] = snapshot.docs.map(doc => ({
          id: doc.id,
          action: doc.data().action ?? '',
          detail: doc.data().detail ?? '',
          userEmail: doc.data().userEmail ?? '',
          timestamp: doc.data().timestamp ?? null,
        }));
        setLogs(entries);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in text-text">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-base font-bold text-text flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-accent" />
            Activity Log
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Read-only record of all changes. Synced live from database.
          </p>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted bg-panel border border-border px-3 py-1.5 rounded-lg">
          {logs.length} entries
        </div>
      </div>

      {/* Table */}
      <div className="bg-panel border border-border rounded-xl overflow-hidden shadow-sm">
        {loading && (
          <div className="flex items-center justify-center py-20 gap-3 text-text-muted">
            <Loader2 className="w-5 h-5 animate-spin text-accent" />
            <span className="text-sm">Loading activity log…</span>
          </div>
        )}

        {error && (
          <div className="p-8 text-center text-danger text-sm">
            Failed to load: {error}
          </div>
        )}

        {!loading && !error && logs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-text-muted">
            <Activity className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm font-medium">No activity recorded yet.</p>
            <p className="text-xs mt-1 opacity-60">
              Stock updates, CSV uploads, and AI calls will appear here.
            </p>
          </div>
        )}

        {!loading && logs.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-background border-b border-border">
                <tr>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-text-muted whitespace-nowrap">Time</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-text-muted whitespace-nowrap">Action</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-text-muted">Detail</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-text-muted hidden md:table-cell whitespace-nowrap">Account</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => {
                  const meta = ACTION_META[log.action] ?? {
                    label: log.action,
                    icon: Activity,
                    color: 'text-text-muted',
                  };
                  const Icon = meta.icon;
                  const ts = log.timestamp?.toDate?.() ?? new Date();

                  return (
                    <tr key={log.id} className="hover:bg-background/40 transition-colors">
                      <td className="px-5 py-3 font-mono text-xs text-text-muted whitespace-nowrap">
                        {timeAgo(ts)}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`flex items-center gap-2 font-bold text-xs whitespace-nowrap ${meta.color}`}>
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-text text-xs max-w-[240px] truncate">
                        {log.detail}
                      </td>
                      <td className="px-5 py-3 text-text-muted text-xs hidden md:table-cell font-mono truncate max-w-[160px]">
                        {log.userEmail.split('@')[0]}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

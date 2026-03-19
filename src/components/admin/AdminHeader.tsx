"use client";
import type { CacheStatus, FleetSummary } from "@/lib/admin/types";

interface Props { summary: FleetSummary; cacheStatus: CacheStatus; onRefresh?: () => void; }

export function AdminHeader({ summary, cacheStatus, onRefresh }: Props) {
  return (
    <header className="flex items-center justify-between py-6 mb-8">
      <div className="flex items-center gap-8">
        <div>
          <span className="metric-value text-3xl font-bold text-white">{summary.total}</span>
          <span className="text-xs text-white/30 ml-2 tracking-wide uppercase">Instances</span>
        </div>
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-2"><span className="status-dot green" /><span className="metric-value text-white/60">{summary.healthy}</span></span>
          <span className="flex items-center gap-2"><span className="status-dot yellow" /><span className="metric-value text-white/60">{summary.unhealthy}</span></span>
          <span className="flex items-center gap-2"><span className="status-dot red" /><span className="metric-value text-white/60">{summary.stopped}</span></span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {cacheStatus.lastRefresh && <span className="text-xs text-white/20">Updated {new Date(cacheStatus.lastRefresh).toLocaleTimeString()}</span>}
        <button onClick={onRefresh} className="px-3 py-1.5 text-xs font-medium text-violet-300 border border-violet-500/20 rounded-lg hover:bg-violet-500/10 transition-all">Refresh</button>
      </div>
    </header>
  );
}

"use client";
import type { CacheStatus, FleetSummary } from "@/lib/admin/types";

interface Props { summary: FleetSummary; cacheStatus: CacheStatus; onRefresh?: () => void; }

export function AdminHeader({ summary, cacheStatus, onRefresh }: Props) {
  return (
    <header className="relative pb-8 mb-8">
      <div className="flex items-end justify-between">
        <div className="flex items-end gap-10">
          {/* Big instance count */}
          <div className="flex items-baseline gap-3">
            <span className="admin-hero-number text-6xl font-bold text-white tracking-tighter">
              {summary.total}
            </span>
            <span className="text-sm text-white/30 tracking-wide uppercase font-medium pb-1">
              Instances
            </span>
          </div>

          {/* Status pills */}
          <div className="flex gap-3 pb-1.5">
            <span className="admin-status-pill admin-status-pill-green">
              <span className="status-dot green" />
              <span className="font-semibold">{summary.healthy}</span>
              <span className="text-white/40">healthy</span>
            </span>
            <span className="admin-status-pill admin-status-pill-yellow">
              <span className="status-dot yellow" />
              <span className="font-semibold">{summary.unhealthy}</span>
              <span className="text-white/40">degraded</span>
            </span>
            <span className="admin-status-pill admin-status-pill-red">
              <span className="status-dot red" />
              <span className="font-semibold">{summary.stopped}</span>
              <span className="text-white/40">stopped</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 pb-1.5">
          {cacheStatus.lastRefresh && (
            <span className="text-xs text-white/20 font-mono">
              {new Date(cacheStatus.lastRefresh).toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={onRefresh}
            className="px-4 py-2 text-xs font-semibold text-violet-300 border border-violet-500/20 rounded-lg hover:bg-violet-500/10 hover:border-violet-500/30 transition-all duration-200 active:scale-95"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Animated gradient line */}
      <div className="admin-header-line absolute bottom-0 left-0 right-0 h-[1px]" />
    </header>
  );
}

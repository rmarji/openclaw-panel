"use client";
import type { CacheStatus, FleetSummary } from "@/lib/admin/types";

interface Props { summary: FleetSummary; cacheStatus: CacheStatus; onRefresh?: () => void; }

export function AdminHeader({ summary, cacheStatus, onRefresh }: Props) {
  return (
    <header className="pb-6 mb-6 border-b border-admin-border">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <div className="flex items-baseline gap-2">
            <span className="admin-hero-number text-3xl font-semibold tracking-tight">
              {summary.total}
            </span>
            <span className="text-[13px] text-admin-tertiary">
              instances
            </span>
          </div>

          <div className="flex gap-2 flex-wrap">
            <span className="admin-status-pill admin-status-pill-green">
              <span className="status-dot green" />
              <span className="font-medium">{summary.healthy}</span>
            </span>
            <span className="admin-status-pill admin-status-pill-yellow">
              <span className="status-dot yellow" />
              <span className="font-medium">{summary.unhealthy}</span>
            </span>
            <span className="admin-status-pill admin-status-pill-red">
              <span className="status-dot red" />
              <span className="font-medium">{summary.stopped}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {cacheStatus.lastRefresh && (
            <span className="text-[11px] text-admin-tertiary font-mono">
              {new Date(cacheStatus.lastRefresh).toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={onRefresh}
            className="px-3 py-1.5 text-[12px] font-medium text-admin-secondary border border-admin-border rounded-md hover:text-admin-primary hover:border-admin-text-tertiary transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    </header>
  );
}

"use client";
import { useState, Fragment } from "react";
import { HealthBadge } from "@/components/admin/HealthBadge";
import Link from "next/link";
import type { Instance } from "@/lib/admin/types";

type SortKey = "name" | "server" | "health" | "apiKeyType" | "dmPolicy";

export function UsersClient({ instances }: { instances: Instance[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [expandedUuid, setExpandedUuid] = useState<string | null>(null);

  const sorted = [...instances].sort((a, b) => {
    const aVal = a[sortKey] || "";
    const bVal = b[sortKey] || "";
    return sortAsc ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
  });

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  }

  const SortHeader = ({ label, sortKeyName }: { label: string; sortKeyName: SortKey }) => (
    <th className="text-left px-4 py-2 font-medium cursor-pointer hover:text-admin-secondary select-none transition-colors" onClick={() => toggleSort(sortKeyName)}>
      {label} {sortKey === sortKeyName ? (sortAsc ? "\u2191" : "\u2193") : ""}
    </th>
  );

  return (
    <div>
      <h1 className="admin-heading-page mb-8">Users</h1>
      <div className="admin-card-data rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-admin-tertiary border-b border-admin-border">
                <SortHeader label="User" sortKeyName="name" />
                <SortHeader label="Server" sortKeyName="server" />
                <th className="text-left px-4 py-2 font-medium">Bot</th>
                <SortHeader label="Key" sortKeyName="apiKeyType" />
                <SortHeader label="DM Policy" sortKeyName="dmPolicy" />
                <SortHeader label="Health" sortKeyName="health" />
                <th className="text-left px-4 py-2 font-medium">Telegram IDs</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((inst) => (
                <Fragment key={inst.uuid}>
                  <tr className="border-b border-admin-border/50 cursor-pointer admin-row-hover"
                    onClick={() => setExpandedUuid(expandedUuid === inst.uuid ? null : inst.uuid)}>
                    <td className="px-4 py-2.5">
                      <Link href={`/admin/instance/${inst.uuid}`} className="text-admin-secondary hover:text-admin-primary font-medium transition-colors" onClick={(e) => e.stopPropagation()}>
                        {inst.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 text-admin-tertiary font-mono">{inst.server}</td>
                    <td className="px-4 py-2.5 text-admin-secondary font-mono">{inst.botUsername ? `@${inst.botUsername}` : "\u2014"}</td>
                    <td className="px-4 py-2.5">
                      <span className={`font-mono uppercase text-[10px] px-1.5 py-0.5 rounded ${
                        inst.apiKeyType === "oauth" ? "bg-amber-500/10 text-amber-400/70" :
                        inst.apiKeyType === "api" ? "bg-emerald-500/10 text-emerald-400/70" :
                        "bg-admin-surface-raised text-admin-tertiary"}`}>{inst.apiKeyType}</span>
                    </td>
                    <td className="px-4 py-2.5 text-admin-tertiary">{inst.dmPolicy || "\u2014"}</td>
                    <td className="px-4 py-2.5"><HealthBadge status={inst.health} /></td>
                    <td className="px-4 py-2.5 text-admin-tertiary font-mono text-[10px]">
                      {inst.allowFrom?.join(", ") || "\u2014"}
                    </td>
                  </tr>
                  {expandedUuid === inst.uuid && (
                    <tr className="border-b border-admin-border/50">
                      <td colSpan={7} className="px-4 py-4 bg-admin-surface-raised">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                          <div><span className="text-admin-tertiary">UUID</span><p className="text-admin-secondary font-mono mt-0.5 text-[10px]">{inst.uuid}</p></div>
                          <div><span className="text-admin-tertiary">Domain</span><p className="text-admin-secondary font-mono mt-0.5">{inst.domain || "\u2014"}</p></div>
                          <div><span className="text-admin-tertiary">Model</span><p className="text-admin-secondary font-mono mt-0.5 text-[10px]">{inst.primaryModel || "\u2014"}</p></div>
                          <div><span className="text-admin-tertiary">Manifest Tier</span><p className="text-admin-secondary mt-0.5">{inst.manifestTier || "\u2014"}</p></div>
                          <div><span className="text-admin-tertiary">Memory</span><p className="text-admin-secondary mt-0.5">{inst.memoryMb ? `${Math.round(inst.memoryMb)} MB` : "\u2014"}</p></div>
                          <div><span className="text-admin-tertiary">Last Activity</span><p className="text-admin-secondary mt-0.5">{inst.lastTelegramActivity || "\u2014"}</p></div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {sorted.length === 0 && <p className="text-admin-tertiary text-sm text-center py-12">No users found. Trigger a cache refresh.</p>}
      </div>
    </div>
  );
}

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
    <th className="text-left px-4 py-2 font-medium cursor-pointer hover:text-white/50 select-none" onClick={() => toggleSort(sortKeyName)}>
      {label} {sortKey === sortKeyName ? (sortAsc ? "\u2191" : "\u2193") : ""}
    </th>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8 tracking-tight">Users</h1>
      <div className="admin-card rounded-lg overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-white/30 border-b border-white/[0.04]">
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
                <tr className="border-b border-white/[0.02] cursor-pointer hover:bg-white/[0.02]"
                  onClick={() => setExpandedUuid(expandedUuid === inst.uuid ? null : inst.uuid)}>
                  <td className="px-4 py-2.5">
                    <Link href={`/admin/instance/${inst.uuid}`} className="text-white/70 hover:text-white font-medium" onClick={(e) => e.stopPropagation()}>
                      {inst.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-white/40 font-mono">{inst.server}</td>
                  <td className="px-4 py-2.5 text-white/50 font-mono">{inst.botUsername ? `@${inst.botUsername}` : "\u2014"}</td>
                  <td className="px-4 py-2.5">
                    <span className={`font-mono uppercase text-[10px] px-1.5 py-0.5 rounded ${
                      inst.apiKeyType === "oauth" ? "bg-amber-500/10 text-amber-400/70" :
                      inst.apiKeyType === "api" ? "bg-emerald-500/10 text-emerald-400/70" :
                      "bg-white/5 text-white/30"}`}>{inst.apiKeyType}</span>
                  </td>
                  <td className="px-4 py-2.5 text-white/40">{inst.dmPolicy || "\u2014"}</td>
                  <td className="px-4 py-2.5"><HealthBadge status={inst.health} /></td>
                  <td className="px-4 py-2.5 text-white/30 font-mono text-[10px]">
                    {inst.allowFrom?.join(", ") || "\u2014"}
                  </td>
                </tr>
                {expandedUuid === inst.uuid && (
                  <tr className="border-b border-white/[0.02]">
                    <td colSpan={7} className="px-4 py-4 bg-white/[0.01]">
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div><span className="text-white/25">UUID</span><p className="text-white/50 font-mono mt-0.5 text-[10px]">{inst.uuid}</p></div>
                        <div><span className="text-white/25">Domain</span><p className="text-white/50 font-mono mt-0.5">{inst.domain || "\u2014"}</p></div>
                        <div><span className="text-white/25">Model</span><p className="text-white/50 font-mono mt-0.5 text-[10px]">{inst.primaryModel || "\u2014"}</p></div>
                        <div><span className="text-white/25">Manifest Tier</span><p className="text-white/50 mt-0.5">{inst.manifestTier || "\u2014"}</p></div>
                        <div><span className="text-white/25">Memory</span><p className="text-white/50 mt-0.5">{inst.memoryMb ? `${Math.round(inst.memoryMb)} MB` : "\u2014"}</p></div>
                        <div><span className="text-white/25">Last Activity</span><p className="text-white/50 mt-0.5">{inst.lastTelegramActivity || "\u2014"}</p></div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
        {sorted.length === 0 && <p className="text-white/20 text-sm text-center py-12">No users found. Trigger a cache refresh.</p>}
      </div>
    </div>
  );
}

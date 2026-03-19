"use client";
import { useState } from "react";
import { HealthBadge } from "@/components/admin/HealthBadge";
import { JsonViewer } from "@/components/admin/JsonViewer";
import { LogViewer } from "@/components/admin/LogViewer";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { getContainerLogs, restartInstance } from "@/lib/admin/actions";
import type { Instance, EvalScore } from "@/lib/admin/types";

type Tab = "config" | "logs" | "eval";

interface Props {
  data: {
    instance: Instance;
    envVars: { key: string; type: string; hint: string }[];
    openclawConfig: any;
    evalScores: EvalScore[];
  };
  uuid: string;
}

export function InstanceDetailClient({ data, uuid }: Props) {
  const [tab, setTab] = useState<Tab>("config");
  const [confirmRestart, setConfirmRestart] = useState(false);
  const [restarting, setRestarting] = useState(false);
  const { instance, envVars, openclawConfig, evalScores } = data;

  async function handleRestart() {
    setRestarting(true);
    try { await restartInstance(uuid); } catch { /* ignore */ }
    setRestarting(false);
    setConfirmRestart(false);
  }

  // Group eval scores by evaluator
  const evalGroups = evalScores.reduce<Record<string, EvalScore[]>>((acc, s) => {
    (acc[s.evaluator] = acc[s.evaluator] || []).push(s);
    return acc;
  }, {});

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <HealthBadge status={instance.health} />
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">{instance.name}</h1>
            <p className="text-xs text-white/25 font-mono mt-0.5">{instance.uuid}</p>
          </div>
        </div>
        <div className="flex gap-3">
          {instance.domain && (
            <a href={`https://${instance.domain}`} target="_blank" rel="noreferrer"
              className="px-3 py-1.5 text-xs text-white/40 border border-white/[0.06] rounded-lg hover:text-white/60 hover:border-white/10">
              Open
            </a>
          )}
          <button onClick={() => setConfirmRestart(true)}
            className="px-3 py-1.5 text-xs font-medium text-amber-300 border border-amber-500/20 rounded-lg hover:bg-amber-500/10">
            Restart
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-white/[0.04] pb-px">
        {(["config", "logs", "eval"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-xs font-medium rounded-t-lg transition-colors ${
              tab === t ? "text-violet-300 bg-violet-500/10 border-b-2 border-violet-400" : "text-white/30 hover:text-white/50"
            }`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Config Tab */}
      {tab === "config" && (
        <div className="space-y-6">
          {/* Env Vars */}
          <div className="admin-card rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.04]">
              <h3 className="text-xs font-medium text-white/50 uppercase tracking-wide">Environment Variables</h3>
            </div>
            <div className="divide-y divide-white/[0.03]">
              {envVars.map((env) => (
                <div key={env.key} className="flex items-center justify-between px-4 py-2.5 text-xs">
                  <span className="text-white/60 font-mono">{env.key}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase ${
                      env.type === "oauth" ? "bg-amber-500/10 text-amber-400/60" :
                      env.type === "api-key" ? "bg-emerald-500/10 text-emerald-400/60" :
                      "bg-white/5 text-white/25"}`}>{env.type}</span>
                    <span className="text-white/25 font-mono">{env.hint}</span>
                  </div>
                </div>
              ))}
              {envVars.length === 0 && <p className="px-4 py-3 text-xs text-white/20">No env vars found</p>}
            </div>
          </div>

          {/* OpenClaw Config */}
          {openclawConfig && <JsonViewer data={openclawConfig} title="openclaw.json" />}

          {/* Instance Info */}
          <div className="admin-card rounded-lg p-4">
            <h3 className="text-xs font-medium text-white/50 uppercase tracking-wide mb-3">Instance Info</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-white/30">Server</span><p className="text-white/60 mt-0.5">{instance.server}</p></div>
              <div><span className="text-white/30">Bot</span><p className="text-white/60 mt-0.5">@{instance.botUsername || "—"}</p></div>
              <div><span className="text-white/30">Model</span><p className="text-white/60 mt-0.5 font-mono text-[11px]">{instance.primaryModel || "—"}</p></div>
              <div><span className="text-white/30">DM Policy</span><p className="text-white/60 mt-0.5">{instance.dmPolicy || "—"}</p></div>
            </div>
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {tab === "logs" && <LogViewer uuid={uuid} fetchLogs={getContainerLogs} />}

      {/* Eval Tab */}
      {tab === "eval" && (
        <div className="space-y-4">
          {Object.keys(evalGroups).length === 0 ? (
            <p className="text-white/20 text-sm py-12 text-center">No evaluation scores found for this instance.</p>
          ) : (
            Object.entries(evalGroups).map(([evaluator, scores]) => {
              const avg = scores.reduce((s, e) => s + e.score, 0) / scores.length;
              const pass = scores.filter(s => s.score === 1.0).length;
              const partial = scores.filter(s => s.score === 0.5).length;
              const fail = scores.filter(s => s.score === 0.0).length;
              return (
                <div key={evaluator} className="admin-card rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-white/80">{evaluator}</h3>
                    <span className={`metric-value text-lg font-bold ${avg >= 0.8 ? "text-emerald-400" : avg >= 0.5 ? "text-amber-400" : "text-red-400"}`}>
                      {avg.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs text-white/40 mb-3">
                    <span>Pass: <span className="text-emerald-400/70">{pass}</span></span>
                    <span>Partial: <span className="text-amber-400/70">{partial}</span></span>
                    <span>Fail: <span className="text-red-400/70">{fail}</span></span>
                    <span>Total: {scores.length}</span>
                  </div>
                  {/* Show recent failures */}
                  {scores.filter(s => s.score === 0).slice(0, 3).map((s) => (
                    <div key={s.id} className="bg-red-500/5 rounded px-3 py-2 mt-2 text-[11px] text-red-300/60">
                      {s.reasoning || "No reasoning provided"}
                    </div>
                  ))}
                </div>
              );
            })
          )}
        </div>
      )}

      <ConfirmDialog open={confirmRestart} title="Restart Instance"
        message={`Restart ${instance.name}? This will briefly interrupt the bot.`}
        onConfirm={handleRestart} onCancel={() => setConfirmRestart(false)} loading={restarting} />
    </div>
  );
}

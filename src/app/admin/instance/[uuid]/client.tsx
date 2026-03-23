"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HealthBadge } from "@/components/admin/HealthBadge";
import { JsonViewer } from "@/components/admin/JsonViewer";
import { LogViewer } from "@/components/admin/LogViewer";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { getContainerLogs, restartInstance } from "@/lib/admin/actions";
import type { Instance, EvalScore, CronJob, Session } from "@/lib/admin/types";

type Tab = "config" | "logs" | "eval" | "cron" | "sessions";

interface Props {
  data: {
    instance: Instance;
    envVars: { key: string; type: string; hint: string }[];
    openclawConfig: any;
    evalScores: EvalScore[];
    cronJobs?: CronJob[];
    sessions?: Session[];
  };
  uuid: string;
}

export function InstanceDetailClient({ data, uuid }: Props) {
  const [tab, setTab] = useState<Tab>("config");
  const [confirmRestart, setConfirmRestart] = useState(false);
  const [restarting, setRestarting] = useState(false);
  const { instance, envVars, openclawConfig, evalScores, cronJobs = [], sessions = [] } = data;

  async function handleRestart() {
    setRestarting(true);
    try { await restartInstance(uuid); } catch { /* ignore */ }
    setRestarting(false);
    setConfirmRestart(false);
  }

  const evalGroups = evalScores.reduce<Record<string, EvalScore[]>>((acc, s) => {
    (acc[s.evaluator] = acc[s.evaluator] || []).push(s);
    return acc;
  }, {});

  const tabs: Tab[] = ["config", "logs", "eval", "cron", "sessions"];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <HealthBadge status={instance.health} />
          <div>
            <h1 className="text-xl font-bold text-admin-primary tracking-tight">{instance.name}</h1>
            <p className="text-xs text-admin-tertiary font-mono mt-0.5">{instance.uuid}</p>
          </div>
        </div>
        <div className="flex gap-3">
          {instance.domain && (
            <a href={`https://${instance.domain}`} target="_blank" rel="noreferrer"
              className="px-3 py-1.5 text-xs text-admin-secondary border border-admin-border rounded-lg hover:text-admin-primary hover:border-admin-accent/20 transition-colors">
              Open
            </a>
          )}
          <button onClick={() => setConfirmRestart(true)}
            className="px-3 py-1.5 text-xs font-medium text-amber-300 border border-amber-500/20 rounded-lg hover:bg-amber-500/10 transition-colors">
            Restart
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-admin-border pb-px overflow-x-auto">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-xs font-medium rounded-t-lg transition-colors whitespace-nowrap ${
              tab === t ? "text-admin-accent bg-admin-accent/10 border-b-2 border-admin-accent" : "text-admin-tertiary hover:text-admin-secondary"
            }`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {t === "cron" && cronJobs.length > 0 && (
              <span className="ml-1.5 text-[10px] bg-admin-accent/15 text-admin-accent px-1.5 py-0.5 rounded-full">{cronJobs.length}</span>
            )}
            {t === "sessions" && sessions.length > 0 && (
              <span className="ml-1.5 text-[10px] bg-admin-accent/15 text-admin-accent px-1.5 py-0.5 rounded-full">{sessions.length}</span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {/* Config Tab */}
          {tab === "config" && (
            <div className="space-y-6">
              <div className="admin-card-data rounded-lg">
                <div className="px-4 py-3 border-b border-admin-border">
                  <h3 className="admin-heading-card">Environment Variables</h3>
                </div>
                <div className="divide-y divide-admin-border/50">
                  {envVars.map((env) => (
                    <div key={env.key} className="flex items-center justify-between px-4 py-2.5 text-xs admin-row-hover">
                      <span className="text-admin-secondary font-mono">{env.key}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase ${
                          env.type === "oauth" ? "bg-amber-500/10 text-amber-400/60" :
                          env.type === "api-key" ? "bg-emerald-500/10 text-emerald-400/60" :
                          "bg-admin-surface-raised text-admin-tertiary"}`}>{env.type}</span>
                        <span className="text-admin-tertiary font-mono">{env.hint}</span>
                      </div>
                    </div>
                  ))}
                  {envVars.length === 0 && <p className="px-4 py-3 text-xs text-admin-tertiary">No env vars found</p>}
                </div>
              </div>
              {openclawConfig && <JsonViewer data={openclawConfig} title="openclaw.json" />}
              <div className="admin-card rounded-lg p-4">
                <h3 className="admin-heading-card mb-3">Instance Info</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><span className="text-admin-tertiary">Server</span><p className="text-admin-secondary mt-0.5">{instance.server}</p></div>
                  <div><span className="text-admin-tertiary">Bot</span><p className="text-admin-secondary mt-0.5">@{instance.botUsername || "\u2014"}</p></div>
                  <div><span className="text-admin-tertiary">Model</span><p className="text-admin-secondary mt-0.5 font-mono text-[11px]">{instance.primaryModel || "\u2014"}</p></div>
                  <div><span className="text-admin-tertiary">DM Policy</span><p className="text-admin-secondary mt-0.5">{instance.dmPolicy || "\u2014"}</p></div>
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
                <p className="text-admin-tertiary text-sm py-12 text-center">No evaluation scores found for this instance.</p>
              ) : (
                Object.entries(evalGroups).map(([evaluator, scores]) => {
                  const avg = scores.reduce((s, e) => s + e.score, 0) / scores.length;
                  const pass = scores.filter(s => s.score === 1.0).length;
                  const partial = scores.filter(s => s.score === 0.5).length;
                  const fail = scores.filter(s => s.score === 0.0).length;
                  return (
                    <div key={evaluator} className="admin-card rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-admin-primary">{evaluator}</h3>
                        <span className={`metric-value text-lg font-bold ${avg >= 0.8 ? "text-emerald-400" : avg >= 0.5 ? "text-amber-400" : "text-red-400"}`}>
                          {avg.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex gap-4 text-xs text-admin-secondary mb-3">
                        <span>Pass: <span className="text-emerald-400/70">{pass}</span></span>
                        <span>Partial: <span className="text-amber-400/70">{partial}</span></span>
                        <span>Fail: <span className="text-red-400/70">{fail}</span></span>
                        <span>Total: {scores.length}</span>
                      </div>
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

          {/* Cron Tab */}
          {tab === "cron" && (
            <div className="space-y-4">
              {cronJobs.length === 0 ? (
                <p className="text-admin-tertiary text-sm py-12 text-center">No cron jobs found. Trigger a cache refresh to populate.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cronJobs.map((job) => (
                    <div key={job.id} className="admin-card rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-admin-primary">{job.name}</h4>
                        <span className={`status-dot ${
                          job.status === "active" ? "green" :
                          job.status === "paused" ? "yellow" :
                          job.status === "error" ? "red" : "grey"
                        }`} />
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-admin-tertiary">Schedule</span>
                          <span className="text-admin-secondary font-mono">{job.schedule || "\u2014"}</span>
                        </div>
                        {job.agent && (
                          <div className="flex justify-between">
                            <span className="text-admin-tertiary">Agent</span>
                            <span className="text-admin-secondary">{job.agent}</span>
                          </div>
                        )}
                        {job.lastRun && (
                          <div className="flex justify-between">
                            <span className="text-admin-tertiary">Last Run</span>
                            <span className="text-admin-secondary font-mono text-[10px]">{job.lastRun}</span>
                          </div>
                        )}
                        {job.nextRun && (
                          <div className="flex justify-between">
                            <span className="text-admin-tertiary">Next Run</span>
                            <span className="text-admin-secondary font-mono text-[10px]">{job.nextRun}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sessions Tab */}
          {tab === "sessions" && (
            <div className="space-y-4">
              {sessions.length === 0 ? (
                <p className="text-admin-tertiary text-sm py-12 text-center">No active sessions found. Trigger a cache refresh to populate.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sessions.map((sess) => (
                    <div key={sess.id} className="admin-card rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-admin-primary">{sess.agentName}</h4>
                        <span className="text-[10px] font-mono text-admin-tertiary bg-admin-surface-raised px-2 py-0.5 rounded border border-admin-border">
                          {sess.channelType}
                        </span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-admin-tertiary">Messages</span>
                          <span className="metric-value text-admin-secondary">{sess.messageCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-admin-tertiary">Started</span>
                          <span className="text-admin-secondary font-mono text-[10px]">{sess.startedAt}</span>
                        </div>
                        {sess.lastActivity && (
                          <div className="flex justify-between">
                            <span className="text-admin-tertiary">Last Activity</span>
                            <span className="text-admin-secondary font-mono text-[10px]">{sess.lastActivity}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <ConfirmDialog open={confirmRestart} title="Restart Instance"
        message={`Restart ${instance.name}? This will briefly interrupt the bot.`}
        onConfirm={handleRestart} onCancel={() => setConfirmRestart(false)} loading={restarting} />
    </div>
  );
}

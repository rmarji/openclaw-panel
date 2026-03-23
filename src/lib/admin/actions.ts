"use server";
import * as cache from "./cache";
import { refreshAll } from "./refresh";
import { isAuthenticated } from "./auth";
import * as coolify from "./coolify";
import * as ssh from "./ssh";
import type { FleetSummary, CacheStatus, Instance, CronJob, Session } from "./types";

export async function getFleetData(): Promise<{
  instances: Instance[];
  summary: FleetSummary;
  cacheStatus: CacheStatus;
}> {
  if (!(await isAuthenticated())) throw new Error("Unauthorized");
  const instances = await cache.getInstances();
  const lastRefresh = await cache.getLastRefresh();
  const summary: FleetSummary = {
    total: instances.length,
    healthy: instances.filter((i) => i.health === "healthy").length,
    unhealthy: instances.filter((i) => i.health === "unhealthy").length,
    stopped: instances.filter((i) => i.health === "stopped").length,
    unknown: instances.filter((i) => i.health === "unknown").length,
    byServer: {},
    totalCronJobs: instances.reduce((sum, i) => sum + (i.cronJobCount || 0), 0),
    totalActiveSessions: instances.reduce((sum, i) => sum + (i.activeSessionCount || 0), 0),
  };
  for (const inst of instances) {
    summary.byServer[inst.server] = (summary.byServer[inst.server] || 0) + 1;
  }
  const isStale = !lastRefresh || Date.now() - new Date(lastRefresh).getTime() > 10 * 60 * 1000;
  return { instances, summary, cacheStatus: { lastRefresh, instanceCount: instances.length, isStale } };
}

export async function triggerRefresh(): Promise<{ errors: string[] }> {
  if (!(await isAuthenticated())) throw new Error("Unauthorized");
  return refreshAll();
}

export async function restartInstance(uuid: string): Promise<void> {
  if (!(await isAuthenticated())) throw new Error("Unauthorized");
  await coolify.restartService(uuid);
}

export async function getInstanceDetail(uuid: string) {
  if (!(await isAuthenticated())) throw new Error("Unauthorized");
  const instance = await cache.getInstance(uuid);
  if (!instance) return null;

  // Get env vars (redacted)
  let envVars: { key: string; type: string; hint: string }[] = [];
  try {
    const envs = await coolify.getServiceEnvs(uuid);
    envVars = envs.map((e: any) => ({
      key: e.key,
      type: e.value?.startsWith("sk-ant-oat01") ? "oauth" : e.value?.startsWith("sk-ant-api03") ? "api-key" : "secret",
      hint: e.value ? `...${e.value.slice(-4)}` : "(empty)",
    }));
  } catch { /* skip */ }

  // Get openclaw.json via SSH
  let openclawConfig: any = null;
  const containerName = `openclaw-${uuid}`;
  const remoteServer = instance.server === "server1" ? "server1" : instance.server === "claw2" ? "claw2" : "server3";
  try {
    const raw = await ssh.execRemote(remoteServer as any, `docker exec ${containerName} cat /data/.openclaw/openclaw.json 2>/dev/null`);
    if (raw.trim().startsWith("{")) openclawConfig = JSON.parse(raw);
  } catch { /* skip */ }

  // Get eval scores for this instance
  const allScores = await cache.getEvalScores(7);
  const instanceScores = allScores.filter(s => s.instanceName && instance.name.includes(s.instanceName));

  const cronJobs = await cache.getCronJobsByInstance(uuid);
  const sessions = await cache.getSessionsByInstance(uuid);
  return { instance, envVars, openclawConfig, evalScores: instanceScores, cronJobs, sessions };
}

export async function getContainerLogs(uuid: string, since?: string) {
  if (!(await isAuthenticated())) throw new Error("Unauthorized");
  const instance = await cache.getInstance(uuid);
  if (!instance) return "";
  const containerName = `openclaw-${uuid}`;
  const remoteServer = instance.server === "server1" ? "server1" : instance.server === "claw2" ? "claw2" : "server3";
  const sinceFlag = since ? `--since "${since}"` : "--tail 100";
  try {
    return await ssh.execRemote(remoteServer as any, `docker logs ${sinceFlag} ${containerName} 2>&1 | tail -100`);
  } catch (e: any) {
    return `Error: ${e.message}`;
  }
}

export async function getInstanceCronJobs(uuid: string): Promise<CronJob[]> {
  if (!(await isAuthenticated())) throw new Error("Unauthorized");
  return cache.getCronJobsByInstance(uuid);
}

export async function getInstanceSessions(uuid: string): Promise<Session[]> {
  if (!(await isAuthenticated())) throw new Error("Unauthorized");
  return cache.getSessionsByInstance(uuid);
}

export async function getAnalyticsData(days: number = 7) {
  if (!(await isAuthenticated())) throw new Error("Unauthorized");
  const spendLogs = await cache.getSpendLogs(days);
  const evalScores = await cache.getEvalScores(days);

  // Aggregate spend by model group
  const spendByGroup: Record<string, { cost: number; requests: number; tokensIn: number; tokensOut: number }> = {};
  for (const log of spendLogs) {
    const group = log.modelGroup || "unknown";
    if (!spendByGroup[group]) spendByGroup[group] = { cost: 0, requests: 0, tokensIn: 0, tokensOut: 0 };
    spendByGroup[group].cost += log.cost;
    spendByGroup[group].requests += 1;
    spendByGroup[group].tokensIn += log.tokensIn;
    spendByGroup[group].tokensOut += log.tokensOut;
  }

  // Aggregate spend by day
  const spendByDay: Record<string, number> = {};
  for (const log of spendLogs) {
    const day = log.timestamp.split("T")[0];
    spendByDay[day] = (spendByDay[day] || 0) + 1;
  }

  // Aggregate eval by evaluator
  const evalByEvaluator: Record<string, { sum: number; count: number; pass: number; partial: number; fail: number }> = {};
  for (const score of evalScores) {
    if (!evalByEvaluator[score.evaluator]) evalByEvaluator[score.evaluator] = { sum: 0, count: 0, pass: 0, partial: 0, fail: 0 };
    const e = evalByEvaluator[score.evaluator];
    e.sum += score.score;
    e.count += 1;
    if (score.score === 1.0) e.pass++;
    else if (score.score === 0.5) e.partial++;
    else e.fail++;
  }

  // Eval by day
  const evalByDay: Record<string, Record<string, { sum: number; count: number }>> = {};
  for (const score of evalScores) {
    const day = score.timestamp.split("T")[0];
    if (!evalByDay[day]) evalByDay[day] = {};
    if (!evalByDay[day][score.evaluator]) evalByDay[day][score.evaluator] = { sum: 0, count: 0 };
    evalByDay[day][score.evaluator].sum += score.score;
    evalByDay[day][score.evaluator].count += 1;
  }

  return {
    spendByGroup: Object.entries(spendByGroup).map(([group, data]) => ({ group, ...data })),
    spendByDay: Object.entries(spendByDay).map(([date, requests]) => ({ date, requests })).sort((a, b) => a.date.localeCompare(b.date)),
    evalByEvaluator: Object.entries(evalByEvaluator).map(([evaluator, data]) => ({
      evaluator, avg: data.count ? data.sum / data.count : 0, ...data,
    })),
    evalByDay: Object.entries(evalByDay).map(([date, evaluators]) => ({
      date,
      ...Object.fromEntries(Object.entries(evaluators).map(([e, d]) => [e, d.count ? d.sum / d.count : 0])),
    })).sort((a, b) => a.date.localeCompare(b.date)),
    totalSpend: spendLogs.reduce((s, l) => s + l.cost, 0),
    totalRequests: spendLogs.length,
    totalScores: evalScores.length,
  };
}

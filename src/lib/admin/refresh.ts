import * as cache from "./cache";
import * as coolify from "./coolify";
import * as ssh from "./ssh";
import * as telegram from "./telegram";
import * as litellm from "./litellm";
import * as langfuse from "./langfuse";
import type { Instance } from "./types";

export async function refreshAll(): Promise<{ errors: string[] }> {
  const errors: string[] = [];

  // 1. Refresh instances from Coolify
  let services: any[] = [];
  try {
    services = await coolify.listServices();
  } catch (e: any) {
    errors.push(`Coolify API: ${e.message}`);
  }

  for (const svc of services) {
    if (!svc.name?.startsWith("openclaw-") && !svc.name?.includes("openclaw")) continue;
    try {
      await refreshInstance(svc, errors);
    } catch (e: any) {
      errors.push(`Instance ${svc.name}: ${e.message}`);
    }
  }

  // 2. Refresh spend logs from LiteLLM
  try {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const logs = await litellm.getSpendLogs(since);
    if (Array.isArray(logs)) {
      for (const log of logs) {
        await cache.upsertSpendLog({
          id: log.request_id || log.id || `${log.startTime}-${Math.random()}`,
          instanceName: log.metadata?.user || log.user || null,
          model: log.model || "",
          modelGroup: log.model_group || log.model || "",
          tokensIn: log.prompt_tokens || 0,
          tokensOut: log.completion_tokens || 0,
          cost: log.spend || 0,
          timestamp: log.startTime || log.start_time || new Date().toISOString(),
        });
      }
    }
  } catch (e: any) {
    errors.push(`LiteLLM spend: ${e.message}`);
  }

  // 3. Refresh eval scores from Langfuse
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const data = await langfuse.getScores({ limit: 100, fromTimestamp: since });
    for (const score of data?.data || []) {
      await cache.upsertEvalScore({
        id: score.id,
        traceId: score.traceId || "",
        observationId: score.observationId || "",
        instanceName: score.trace?.name?.replace("litellm:", "") || null,
        evaluator: score.name || "",
        score: score.value ?? 0,
        reasoning: score.comment || null,
        timestamp: score.timestamp || new Date().toISOString(),
      });
    }
  } catch (e: any) {
    errors.push(`Langfuse scores: ${e.message}`);
  }

  await cache.setLastRefresh();
  return { errors };
}

async function refreshInstance(svc: any, errors: string[]): Promise<void> {
  const uuid = svc.uuid;
  const name = svc.name?.replace(/^openclaw-/, "") || uuid;
  const server = detectServer(svc);

  let apiKeyType: Instance["apiKeyType"] = "unknown";
  let botToken: string | null = null;
  try {
    const envs = await coolify.getServiceEnvs(uuid);
    for (const env of envs) {
      if (env.key === "ANTHROPIC_API_KEY") {
        apiKeyType = env.value?.startsWith("sk-ant-oat01") ? "oauth" : "api";
      }
      if (env.key === "TELEGRAM_BOT_TOKEN") {
        botToken = env.value;
      }
    }
  } catch (e: any) {
    errors.push(`Envs ${name}: ${e.message}`);
  }

  let botUsername: string | null = null;
  if (botToken) {
    try {
      const info = await telegram.getBotInfo(botToken);
      botUsername = info?.username || null;
    } catch { /* skip */ }
  }

  let health: Instance["health"] = "unknown";
  const containerName = `openclaw-${uuid}`;
  const remoteServer = server === "server1" ? "server1" : server === "claw2" ? "claw2" : "server3";
  try {
    const status = await ssh.execRemote(
      remoteServer,
      `docker inspect --format '{{.State.Health.Status}}' ${containerName} 2>/dev/null || docker inspect --format '{{.State.Status}}' ${containerName} 2>/dev/null || echo stopped`
    );
    const s = status.trim();
    health = s === "healthy" ? "healthy" : s === "running" ? "healthy" : s === "starting" ? "unhealthy" : s === "unhealthy" ? "unhealthy" : "stopped";
  } catch (e: any) {
    errors.push(`Health ${name}: ${e.message}`);
  }

  // Try to get primary model and dm policy from openclaw.json
  let primaryModel: string | null = null;
  let dmPolicy: Instance["dmPolicy"] = null;
  let allowFrom: number[] | null = null;
  try {
    const configJson = await ssh.execRemote(
      remoteServer,
      `docker exec ${containerName} cat /data/.openclaw/openclaw.json 2>/dev/null`
    );
    if (configJson.trim().startsWith("{")) {
      const config = JSON.parse(configJson);
      const model = config?.agents?.defaults?.model;
      primaryModel = typeof model === "string" ? model : model?.primary || null;
      dmPolicy = config?.channels?.telegram?.dmPolicy || null;
      allowFrom = config?.channels?.telegram?.allowFrom || null;
    }
  } catch { /* skip - container might not be running */ }

  await cache.upsertInstance({
    uuid, name, server,
    domain: svc.fqdn || null,
    botUsername,
    botTokenPrefix: botToken ? botToken.substring(0, 10) : null,
    health, primaryModel, apiKeyType,
    memoryMb: null,
    lastTelegramActivity: null,
    manifestTier: null,
    dmPolicy, allowFrom,
  });
}

function detectServer(svc: any): Instance["server"] {
  const serverId = svc.server_id;
  if (serverId === 0) return "server1";
  if (serverId === 1) return "claw2";
  if (serverId === 2) return "server3";
  return "server3";
}

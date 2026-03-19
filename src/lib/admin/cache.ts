import initSqlJs, { type Database } from "sql.js";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import type { Instance, SpendLog, EvalScore } from "./types";

const DB_PATH = process.env.CACHE_DB_PATH || "/tmp/admin-cache.db";
let db: Database | null = null;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS instances (
  uuid TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  server TEXT NOT NULL,
  domain TEXT,
  bot_username TEXT,
  bot_token_prefix TEXT,
  health TEXT DEFAULT 'unknown',
  primary_model TEXT,
  api_key_type TEXT,
  memory_mb REAL,
  last_telegram_activity TEXT,
  manifest_tier TEXT,
  dm_policy TEXT,
  allow_from TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS spend_logs (
  id TEXT PRIMARY KEY,
  instance_name TEXT,
  model TEXT,
  model_group TEXT,
  tokens_in INTEGER,
  tokens_out INTEGER,
  cost REAL,
  timestamp TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS eval_scores (
  id TEXT PRIMARY KEY,
  trace_id TEXT,
  observation_id TEXT,
  instance_name TEXT,
  evaluator TEXT,
  score REAL,
  reasoning TEXT,
  timestamp TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS server_metrics (
  server TEXT PRIMARY KEY,
  cpu_percent REAL,
  mem_used_mb REAL,
  mem_total_mb REAL,
  swap_used_mb REAL,
  swap_total_mb REAL,
  disk_used_gb REAL,
  disk_total_gb REAL,
  container_count INTEGER,
  uptime TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT
);
CREATE INDEX IF NOT EXISTS idx_spend_timestamp ON spend_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_spend_model_group ON spend_logs(model_group);
CREATE INDEX IF NOT EXISTS idx_spend_instance ON spend_logs(instance_name);
CREATE INDEX IF NOT EXISTS idx_eval_instance ON eval_scores(instance_name, evaluator);
CREATE INDEX IF NOT EXISTS idx_eval_timestamp ON eval_scores(timestamp);
`;

export async function getDb(): Promise<Database> {
  if (db) return db;
  const SQL = await initSqlJs({
    locateFile: (file: string) =>
      path.join(process.cwd(), "node_modules", "sql.js", "dist", file),
  });
  if (existsSync(DB_PATH)) {
    const buffer = readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  db.run(SCHEMA);
  return db;
}

export function saveDb(): void {
  if (!db) return;
  const data = db.export();
  writeFileSync(DB_PATH, Buffer.from(data));
}

export async function getInstances(): Promise<Instance[]> {
  const d = await getDb();
  const rows = d.exec("SELECT * FROM instances ORDER BY server, name");
  if (!rows.length) return [];
  return rows[0].values.map((row) => rowToInstance(rows[0].columns, row));
}

export async function getInstance(uuid: string): Promise<Instance | null> {
  const d = await getDb();
  const stmt = d.prepare("SELECT * FROM instances WHERE uuid = ?");
  stmt.bind([uuid]);
  if (!stmt.step()) { stmt.free(); return null; }
  const row = stmt.getAsObject();
  stmt.free();
  return {
    uuid: row.uuid as string,
    name: row.name as string,
    server: row.server as Instance["server"],
    domain: row.domain as string | null,
    botUsername: row.bot_username as string | null,
    botTokenPrefix: row.bot_token_prefix as string | null,
    health: row.health as Instance["health"],
    primaryModel: row.primary_model as string | null,
    apiKeyType: row.api_key_type as Instance["apiKeyType"],
    memoryMb: row.memory_mb as number | null,
    lastTelegramActivity: row.last_telegram_activity as string | null,
    manifestTier: row.manifest_tier as string | null,
    dmPolicy: row.dm_policy as Instance["dmPolicy"],
    allowFrom: row.allow_from ? JSON.parse(row.allow_from as string) : null,
    updatedAt: row.updated_at as string,
  };
}

export async function upsertInstance(inst: Partial<Instance> & { uuid: string }): Promise<void> {
  const d = await getDb();
  d.run(
    `INSERT OR REPLACE INTO instances (uuid, name, server, domain, bot_username, bot_token_prefix, health, primary_model, api_key_type, memory_mb, last_telegram_activity, manifest_tier, dm_policy, allow_from, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
    [inst.uuid, inst.name ?? "", inst.server ?? "unknown", inst.domain ?? null,
     inst.botUsername ?? null, inst.botTokenPrefix ?? null, inst.health ?? "unknown",
     inst.primaryModel ?? null, inst.apiKeyType ?? "unknown", inst.memoryMb ?? null,
     inst.lastTelegramActivity ?? null, inst.manifestTier ?? null, inst.dmPolicy ?? null,
     inst.allowFrom ? JSON.stringify(inst.allowFrom) : null]
  );
}

export async function upsertSpendLog(log: SpendLog): Promise<void> {
  const d = await getDb();
  d.run(
    `INSERT OR REPLACE INTO spend_logs (id, instance_name, model, model_group, tokens_in, tokens_out, cost, timestamp, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
    [log.id, log.instanceName, log.model, log.modelGroup, log.tokensIn, log.tokensOut, log.cost, log.timestamp]
  );
}

export async function upsertEvalScore(score: EvalScore): Promise<void> {
  const d = await getDb();
  d.run(
    `INSERT OR REPLACE INTO eval_scores (id, trace_id, observation_id, instance_name, evaluator, score, reasoning, timestamp, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
    [score.id, score.traceId, score.observationId, score.instanceName, score.evaluator, score.score, score.reasoning, score.timestamp]
  );
}

export async function getSpendLogs(days: number = 7): Promise<SpendLog[]> {
  const d = await getDb();
  const rows = d.exec(
    `SELECT * FROM spend_logs WHERE timestamp >= datetime('now', '-${days} days') ORDER BY timestamp DESC`
  );
  if (!rows.length) return [];
  return rows[0].values.map((row) => {
    const obj: Record<string, unknown> = {};
    rows[0].columns.forEach((col, i) => { obj[col] = row[i]; });
    return {
      id: obj.id as string,
      instanceName: obj.instance_name as string | null,
      model: obj.model as string,
      modelGroup: obj.model_group as string,
      tokensIn: obj.tokens_in as number,
      tokensOut: obj.tokens_out as number,
      cost: obj.cost as number,
      timestamp: obj.timestamp as string,
    };
  });
}

export async function getEvalScores(days: number = 7): Promise<EvalScore[]> {
  const d = await getDb();
  const rows = d.exec(
    `SELECT * FROM eval_scores WHERE timestamp >= datetime('now', '-${days} days') ORDER BY timestamp DESC`
  );
  if (!rows.length) return [];
  return rows[0].values.map((row) => {
    const obj: Record<string, unknown> = {};
    rows[0].columns.forEach((col, i) => { obj[col] = row[i]; });
    return {
      id: obj.id as string,
      traceId: obj.trace_id as string,
      observationId: obj.observation_id as string,
      instanceName: obj.instance_name as string | null,
      evaluator: obj.evaluator as string,
      score: obj.score as number,
      reasoning: obj.reasoning as string | null,
      timestamp: obj.timestamp as string,
    };
  });
}

export async function getLastRefresh(): Promise<string | null> {
  const d = await getDb();
  const rows = d.exec("SELECT value FROM meta WHERE key = 'last_refresh'");
  if (!rows.length || !rows[0].values.length) return null;
  return rows[0].values[0][0] as string;
}

export async function setLastRefresh(): Promise<void> {
  const d = await getDb();
  d.run("INSERT OR REPLACE INTO meta (key, value) VALUES ('last_refresh', datetime('now'))");
  saveDb();
}

function rowToInstance(columns: string[], row: unknown[]): Instance {
  const obj: Record<string, unknown> = {};
  columns.forEach((col, i) => { obj[col] = row[i]; });
  return {
    uuid: obj.uuid as string,
    name: obj.name as string,
    server: obj.server as Instance["server"],
    domain: obj.domain as string | null,
    botUsername: obj.bot_username as string | null,
    botTokenPrefix: obj.bot_token_prefix as string | null,
    health: obj.health as Instance["health"],
    primaryModel: obj.primary_model as string | null,
    apiKeyType: obj.api_key_type as Instance["apiKeyType"],
    memoryMb: obj.memory_mb as number | null,
    lastTelegramActivity: obj.last_telegram_activity as string | null,
    manifestTier: obj.manifest_tier as string | null,
    dmPolicy: obj.dm_policy as Instance["dmPolicy"],
    allowFrom: obj.allow_from ? JSON.parse(obj.allow_from as string) : null,
    updatedAt: obj.updated_at as string,
  };
}

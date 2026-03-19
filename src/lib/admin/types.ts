export interface Instance {
  uuid: string;
  name: string;
  server: "server1" | "claw2" | "server3";
  domain: string | null;
  botUsername: string | null;
  botTokenPrefix: string | null;
  health: "healthy" | "unhealthy" | "stopped" | "unknown";
  primaryModel: string | null;
  apiKeyType: "oauth" | "api" | "unknown";
  memoryMb: number | null;
  lastTelegramActivity: string | null;
  manifestTier: string | null;
  dmPolicy: "pairing" | "allowlist" | "open" | null;
  allowFrom: number[] | null;
  updatedAt: string;
}

export interface ServerMetrics {
  server: string;
  cpuPercent: number;
  memUsedMb: number;
  memTotalMb: number;
  swapUsedMb: number;
  swapTotalMb: number;
  diskUsedGb: number;
  diskTotalGb: number;
  containerCount: number;
  uptime: string;
  containers: ContainerStats[];
  updatedAt: string;
}

export interface ContainerStats {
  name: string;
  memoryMb: number;
  cpuPercent: number;
  status: string;
}

export interface SpendLog {
  id: string;
  instanceName: string | null;
  model: string;
  modelGroup: string;
  tokensIn: number;
  tokensOut: number;
  cost: number;
  timestamp: string;
}

export interface EvalScore {
  id: string;
  traceId: string;
  observationId: string;
  instanceName: string | null;
  evaluator: string;
  score: number;
  reasoning: string | null;
  timestamp: string;
}

export interface CacheStatus {
  lastRefresh: string | null;
  instanceCount: number;
  isStale: boolean;
}

export type HealthColor = "green" | "yellow" | "red" | "grey";

export interface FleetSummary {
  total: number;
  healthy: number;
  unhealthy: number;
  stopped: number;
  unknown: number;
  byServer: Record<string, number>;
}

export interface EvalSummary {
  evaluator: string;
  avgScore: number;
  passCount: number;
  partialCount: number;
  failCount: number;
  total: number;
}

export interface SpendSummary {
  modelGroup: string;
  totalCost: number;
  totalRequests: number;
  totalTokensIn: number;
  totalTokensOut: number;
}

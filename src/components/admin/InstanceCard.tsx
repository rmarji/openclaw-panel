import Link from "next/link";
import { HealthBadge } from "./HealthBadge";
import type { Instance } from "@/lib/admin/types";

const SERVER_LABELS: Record<string, string> = {
  server1: "S1",
  claw2: "S2",
  server3: "S3",
};

export function InstanceCard({ instance }: { instance: Instance }) {
  return (
    <Link href={`/admin/instance/${instance.uuid}`}>
      <div className="admin-card rounded-xl p-5 cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <HealthBadge status={instance.health} />
            <h3 className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
              {instance.name}
            </h3>
          </div>
          <span className="text-[10px] font-mono text-white/20 bg-white/[0.03] px-2 py-0.5 rounded">
            {SERVER_LABELS[instance.server] || instance.server}
          </span>
        </div>
        <div className="space-y-2 text-xs text-white/40">
          {instance.botUsername && (
            <div className="flex justify-between">
              <span>Bot</span>
              <span className="text-white/60 font-mono">@{instance.botUsername}</span>
            </div>
          )}
          {instance.primaryModel && (
            <div className="flex justify-between">
              <span>Model</span>
              <span className="text-white/60 font-mono text-[11px] truncate ml-4">
                {instance.primaryModel}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Key</span>
            <span
              className={`font-mono uppercase text-[10px] px-1.5 py-0.5 rounded ${
                instance.apiKeyType === "oauth"
                  ? "bg-amber-500/10 text-amber-400/70"
                  : instance.apiKeyType === "api"
                    ? "bg-emerald-500/10 text-emerald-400/70"
                    : "bg-white/5 text-white/30"
              }`}
            >
              {instance.apiKeyType}
            </span>
          </div>
          {instance.memoryMb !== null && (
            <div className="flex justify-between">
              <span>Memory</span>
              <span className="metric-value text-white/60">
                {Math.round(instance.memoryMb)} MB
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

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
      <div className="admin-card rounded-2xl p-6 cursor-pointer group relative overflow-hidden">
        {/* Top gradient shine */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <HealthBadge status={instance.health} />
              <div className={`absolute inset-0 rounded-full blur-[6px] opacity-40 ${
                instance.health === "healthy" ? "bg-emerald-400" :
                instance.health === "unhealthy" ? "bg-yellow-400" :
                instance.health === "stopped" ? "bg-red-400" : "bg-gray-400"
              }`} />
            </div>
            <h3 className="text-base font-semibold text-white/95 group-hover:text-white transition-colors tracking-tight">
              {instance.name}
            </h3>
          </div>
          <span className="text-[10px] font-mono text-white/30 bg-white/[0.05] px-2.5 py-1 rounded-md border border-white/[0.04]">
            {SERVER_LABELS[instance.server] || instance.server}
          </span>
        </div>

        <div className="space-y-3 text-sm text-white/40">
          {instance.botUsername && (
            <div className="flex justify-between items-center">
              <span className="text-xs">Bot</span>
              <span className="text-white/70 font-mono text-xs">@{instance.botUsername}</span>
            </div>
          )}
          {instance.primaryModel && (
            <div className="flex justify-between items-center">
              <span className="text-xs">Model</span>
              <span className="text-white/60 font-mono text-xs truncate ml-6 max-w-[180px]">
                {instance.primaryModel}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-xs">Key</span>
            <span
              className={`font-mono uppercase text-[11px] px-2 py-0.5 rounded-md font-medium ${
                instance.apiKeyType === "oauth"
                  ? "bg-amber-500/15 text-amber-300/90 border border-amber-500/20"
                  : instance.apiKeyType === "api"
                    ? "bg-emerald-500/15 text-emerald-300/90 border border-emerald-500/20"
                    : "bg-white/5 text-white/40 border border-white/[0.06]"
              }`}
            >
              {instance.apiKeyType}
            </span>
          </div>
          {instance.memoryMb !== null && (
            <div className="flex justify-between items-center">
              <span className="text-xs">Memory</span>
              <span className="metric-value text-white/60 text-xs">
                {Math.round(instance.memoryMb)} MB
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

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
      <div className="admin-card-interactive p-4 group">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <HealthBadge status={instance.health} />
            <h3 className="text-[13px] font-medium text-admin-primary tracking-tight">
              {instance.name}
            </h3>
          </div>
          <span className="text-[10px] font-mono text-admin-tertiary">
            {SERVER_LABELS[instance.server] || instance.server}
          </span>
        </div>

        <div className="space-y-1.5 text-[12px]">
          {instance.botUsername && (
            <div className="flex justify-between">
              <span className="text-admin-tertiary">Bot</span>
              <span className="text-admin-secondary font-mono">@{instance.botUsername}</span>
            </div>
          )}
          {instance.primaryModel && (
            <div className="flex justify-between">
              <span className="text-admin-tertiary">Model</span>
              <span className="text-admin-secondary font-mono truncate ml-4 max-w-[160px]">
                {instance.primaryModel}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-admin-tertiary">Key</span>
            <span className={`font-mono text-[11px] ${
              instance.apiKeyType === "oauth" ? "text-amber-500" :
              instance.apiKeyType === "api" ? "text-emerald-500" :
              "text-admin-tertiary"
            }`}>
              {instance.apiKeyType}
            </span>
          </div>
          {(instance.cronJobCount !== undefined && instance.cronJobCount > 0) && (
            <div className="flex justify-between">
              <span className="text-admin-tertiary">Cron</span>
              <span className="text-admin-secondary">{instance.cronJobCount}</span>
            </div>
          )}
          {(instance.activeSessionCount !== undefined && instance.activeSessionCount > 0) && (
            <div className="flex justify-between">
              <span className="text-admin-tertiary">Sessions</span>
              <span className="text-admin-secondary">{instance.activeSessionCount}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

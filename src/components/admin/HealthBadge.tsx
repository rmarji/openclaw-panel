import type { HealthColor } from "@/lib/admin/types";

const COLORS: Record<string, HealthColor> = {
  healthy: "green",
  unhealthy: "yellow",
  stopped: "red",
  unknown: "grey",
};

export function HealthBadge({ status }: { status: string }) {
  const color = COLORS[status] || "grey";
  return <span className={`status-dot ${color}`} title={status} />;
}

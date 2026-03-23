import { execRemote, type RemoteServer } from "@/lib/admin/ssh";
import { ServerGauge } from "@/components/admin/ServerGauge";
import type { ServerMetrics, ContainerStats } from "@/lib/admin/types";
import { isAuthenticated } from "@/lib/admin/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function fetchServerMetrics(
  server: RemoteServer,
  label: string,
): Promise<ServerMetrics | null> {
  try {
    const [memRaw, uptimeRaw, dfRaw, dockerRaw] = await Promise.all([
      execRemote(server, "free -m | grep -E 'Mem|Swap'"),
      execRemote(server, "uptime -p"),
      execRemote(server, "df -BG / | tail -1"),
      execRemote(
        server,
        "docker stats --no-stream --format '{{.Name}}\\t{{.MemUsage}}\\t{{.CPUPerc}}' 2>/dev/null | head -20",
      ),
    ]);

    const memLine = memRaw
      .split("\n")
      .find((l: string) => l.startsWith("Mem:"));
    const swapLine = memRaw
      .split("\n")
      .find((l: string) => l.startsWith("Swap:"));
    const memParts = memLine?.trim().split(/\s+/) || [];
    const swapParts = swapLine?.trim().split(/\s+/) || [];
    const dfParts = dfRaw.trim().split(/\s+/);

    const containers: ContainerStats[] = dockerRaw
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line: string) => {
        const [name, mem, cpu] = line.split("\t");
        const memMatch = mem?.match(/([\d.]+)(\w+)/);
        let memMb = memMatch ? parseFloat(memMatch[1]) : 0;
        if (memMatch && memMatch[2] === "GiB") memMb *= 1024;
        if (memMatch && memMatch[2] === "KiB") memMb /= 1024;
        return {
          name: name || "",
          memoryMb: memMb,
          cpuPercent: parseFloat(cpu?.replace("%", "") || "0"),
          status: "running",
        };
      })
      .sort((a: ContainerStats, b: ContainerStats) => b.memoryMb - a.memoryMb);

    return {
      server: label,
      cpuPercent: containers.reduce(
        (sum: number, c: ContainerStats) => sum + c.cpuPercent,
        0,
      ),
      memUsedMb: parseInt(memParts[2] || "0"),
      memTotalMb: parseInt(memParts[1] || "0"),
      swapUsedMb: parseInt(swapParts[2] || "0"),
      swapTotalMb: parseInt(swapParts[1] || "0"),
      diskUsedGb: parseFloat(dfParts[2]?.replace("G", "") || "0"),
      diskTotalGb: parseFloat(dfParts[1]?.replace("G", "") || "0"),
      containerCount: containers.length,
      containers,
      uptime: uptimeRaw.trim(),
      updatedAt: new Date().toISOString(),
    };
  } catch (e) {
    console.error(`Failed to fetch metrics for ${label}:`, e);
    return null;
  }
}

export default async function ServersPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const servers = await Promise.all([
    fetchServerMetrics("server1", "Server 1 (Control)"),
    fetchServerMetrics("claw2", "CLAW2 (Workers)"),
    fetchServerMetrics("server3", "Server 3 (Claws)"),
  ]);

  return (
    <>
      <h1 className="admin-heading-page mb-8">Server Health</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {servers.map((metrics, i) =>
          metrics ? (
            <div key={metrics.server} className="admin-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-admin-primary">
                    {metrics.server}
                  </h2>
                  <p className="text-xs text-admin-tertiary mt-0.5">
                    {metrics.uptime}
                  </p>
                </div>
                <span className="text-xs text-admin-tertiary font-mono">
                  {metrics.containerCount} containers
                </span>
              </div>
              <div className="flex justify-around mb-8">
                <ServerGauge
                  value={
                    metrics.memTotalMb
                      ? (metrics.memUsedMb / metrics.memTotalMb) * 100
                      : 0
                  }
                  label="Memory"
                  detail={`${Math.round((metrics.memUsedMb / 1024) * 10) / 10}/${Math.round((metrics.memTotalMb / 1024) * 10) / 10} GB`}
                />
                <ServerGauge
                  value={
                    metrics.diskTotalGb
                      ? (metrics.diskUsedGb / metrics.diskTotalGb) * 100
                      : 0
                  }
                  label="Disk"
                  detail={`${metrics.diskUsedGb}/${metrics.diskTotalGb} GB`}
                  color="blue"
                />
                <ServerGauge
                  value={Math.min(metrics.cpuPercent, 100)}
                  label="CPU"
                  color="emerald"
                />
              </div>
              <h3 className="admin-heading-card mb-3">Top Containers</h3>
              <div className="space-y-1.5">
                {metrics.containers.slice(0, 5).map((c) => (
                  <div
                    key={c.name}
                    className="flex justify-between text-xs py-1 px-2 rounded bg-admin-surface-raised admin-row-hover"
                  >
                    <span className="text-admin-secondary font-mono truncate mr-4">
                      {c.name}
                    </span>
                    <span className="metric-value text-admin-tertiary whitespace-nowrap">
                      {Math.round(c.memoryMb)} MB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              key={`unreachable-${i}`}
              className="admin-card rounded-xl p-6 flex items-center justify-center min-h-[300px]"
            >
              <p className="text-admin-tertiary text-sm">Server unreachable</p>
            </div>
          ),
        )}
      </div>
    </>
  );
}

"use client";
import { useState, useEffect, useRef } from "react";

interface Props { uuid: string; fetchLogs: (uuid: string, since?: string) => Promise<string>; }

export function LogViewer({ uuid, fetchLogs }: Props) {
  const [logs, setLogs] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [filter, setFilter] = useState<"all" | "error" | "warn" | "info">("all");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchLogs(uuid).then(setLogs);
  }, [uuid, fetchLogs]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchLogs(uuid).then(setLogs);
    }, 10_000);
    return () => clearInterval(interval);
  }, [autoRefresh, uuid, fetchLogs]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const filteredLines = logs.split("\n").filter((line) => {
    if (filter === "all") return true;
    const lower = line.toLowerCase();
    if (filter === "error") return lower.includes("error") || lower.includes("err");
    if (filter === "warn") return lower.includes("warn") || lower.includes("warning");
    if (filter === "info") return lower.includes("info");
    return true;
  });

  return (
    <div className="admin-card-data rounded-lg">
      <div className="flex items-center justify-between px-4 py-3 border-b border-admin-border">
        <div className="flex gap-2">
          {(["all", "info", "warn", "error"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-2 py-0.5 text-[10px] rounded font-mono uppercase transition-colors ${filter === f ? "bg-admin-accent/20 text-admin-accent" : "text-admin-tertiary hover:text-admin-secondary"}`}>
              {f}
            </button>
          ))}
        </div>
        <button onClick={() => setAutoRefresh(!autoRefresh)}
          className={`text-[10px] px-2 py-0.5 rounded transition-colors ${autoRefresh ? "bg-emerald-500/20 text-emerald-300" : "text-admin-tertiary hover:text-admin-secondary"}`}>
          {autoRefresh ? "\u25CF Live" : "Auto-refresh"}
        </button>
      </div>
      <div ref={containerRef} className="p-4 font-mono text-[11px] leading-relaxed text-admin-secondary max-h-[500px] overflow-y-auto overflow-x-auto whitespace-pre">
        {filteredLines.join("\n") || "No logs available"}
      </div>
    </div>
  );
}

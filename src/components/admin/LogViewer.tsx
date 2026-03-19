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
    <div className="admin-card rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
        <div className="flex gap-2">
          {(["all", "info", "warn", "error"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-2 py-0.5 text-[10px] rounded font-mono uppercase ${filter === f ? "bg-violet-500/20 text-violet-300" : "text-white/30 hover:text-white/50"}`}>
              {f}
            </button>
          ))}
        </div>
        <button onClick={() => setAutoRefresh(!autoRefresh)}
          className={`text-[10px] px-2 py-0.5 rounded ${autoRefresh ? "bg-emerald-500/20 text-emerald-300" : "text-white/30 hover:text-white/50"}`}>
          {autoRefresh ? "● Live" : "Auto-refresh"}
        </button>
      </div>
      <div ref={containerRef} className="p-4 font-mono text-[11px] leading-relaxed text-white/50 max-h-[500px] overflow-y-auto overflow-x-auto whitespace-pre">
        {filteredLines.join("\n") || "No logs available"}
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";

export function JsonViewer({ data, title }: { data: any; title?: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const json = typeof data === "string" ? data : JSON.stringify(data, null, 2);

  return (
    <div className="admin-card rounded-lg overflow-hidden">
      {title && (
        <button onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-between px-4 py-3 text-xs text-admin-secondary hover:text-admin-primary border-b border-admin-border transition-colors">
          <span className="font-medium uppercase tracking-wide">{title}</span>
          <span>{collapsed ? "\u25B8" : "\u25BE"}</span>
        </button>
      )}
      {!collapsed && (
        <pre className="p-4 text-[11px] leading-relaxed text-admin-secondary font-mono overflow-x-auto max-h-[500px] overflow-y-auto">
          {json}
        </pre>
      )}
    </div>
  );
}

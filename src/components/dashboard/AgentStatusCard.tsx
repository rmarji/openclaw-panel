"use client";

interface Agent {
  id: string;
  name: string;
  slug: string;
  status: string;
  domain: string | null;
  telegramBotUsername: string | null;
  provisionError: string | null;
  provisionedAt: string | null;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; dot: string }
> = {
  ready: { label: "Running", color: "text-emerald-400", dot: "bg-emerald-400" },
  provisioning: {
    label: "Deploying",
    color: "text-amber-400",
    dot: "bg-amber-400",
  },
  pending: { label: "Pending", color: "text-zinc-400", dot: "bg-zinc-400" },
  error: { label: "Error", color: "text-red-400", dot: "bg-red-400" },
  stopped: { label: "Stopped", color: "text-zinc-500", dot: "bg-zinc-500" },
};

export function AgentStatusCard({ agent }: { agent: Agent }) {
  const status = STATUS_CONFIG[agent.status] || STATUS_CONFIG.pending;

  return (
    <div className="rounded-xl border border-border bg-surface p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            {agent.name}
          </h3>
          {agent.domain && (
            <p className="text-xs text-text-tertiary font-mono mt-0.5">
              {agent.domain}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className={`h-2 w-2 rounded-full ${status.dot} ${
              agent.status === "provisioning" ? "animate-pulse" : ""
            }`}
          />
          <span className={`text-xs font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>
      </div>

      {agent.provisionError && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
          <p className="text-xs text-red-400">{agent.provisionError}</p>
        </div>
      )}

      <div className="flex gap-2">
        {agent.telegramBotUsername && (
          <a
            href={`https://t.me/${agent.telegramBotUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-text-secondary hover:text-foreground hover:bg-surface-raised transition-colors"
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.26-2.06-.48-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.75 3.98-1.73 6.64-2.88 7.97-3.44 3.8-1.6 4.59-1.88 5.1-1.89.11 0 .37.03.53.17.14.12.18.28.2.47-.01.06.01.24 0 .38z" />
            </svg>
            Telegram
          </a>
        )}
        {agent.domain && (
          <a
            href={`https://${agent.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-text-secondary hover:text-foreground hover:bg-surface-raised transition-colors"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
            Open
          </a>
        )}
      </div>
    </div>
  );
}

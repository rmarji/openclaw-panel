"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AgentStatus {
  id: string;
  name: string;
  slug: string;
  status: string;
  domain: string | null;
  telegramBotUsername: string | null;
  provisionError: string | null;
}

const STATUS_STEPS = [
  { key: "pending", label: "Preparing deployment..." },
  { key: "provisioning", label: "Spinning up your agent..." },
  { key: "ready", label: "Agent is live!" },
];

export function ProvisioningStatus() {
  const [agent, setAgent] = useState<AgentStatus | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    async function poll() {
      try {
        const res = await fetch("/api/agents/status");
        if (!res.ok) return;
        const data = await res.json();
        const latest = data.agents?.[0];
        if (latest) {
          setAgent(latest);
          if (latest.status === "ready") {
            clearInterval(interval);
          } else if (latest.status === "error") {
            clearInterval(interval);
            setError(latest.provisionError || "Provisioning failed");
          }
        }
      } catch {
        // Retry on next interval
      }
    }

    poll();
    interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentStepIdx = STATUS_STEPS.findIndex(
    (s) => s.key === agent?.status
  );

  return (
    <div className="space-y-8">
      {/* Progress steps */}
      <div className="space-y-4">
        {STATUS_STEPS.map((step, i) => {
          const isActive = step.key === agent?.status;
          const isCompleted = currentStepIdx > i;

          return (
            <div key={step.key} className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${
                  isCompleted
                    ? "bg-emerald-500/20 text-emerald-400"
                    : isActive
                      ? "bg-accent/20 text-accent"
                      : "bg-surface-raised text-text-tertiary"
                }`}
              >
                {isCompleted ? (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                ) : isActive ? (
                  <svg
                    className="h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : (
                  <div className="h-2 w-2 rounded-full bg-current opacity-30" />
                )}
              </div>
              <span
                className={`text-sm ${
                  isActive
                    ? "text-foreground font-medium"
                    : isCompleted
                      ? "text-text-secondary"
                      : "text-text-tertiary"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
          <p className="text-sm text-red-400">{error}</p>
          <p className="mt-1 text-xs text-red-400/60">
            Contact support if this persists.
          </p>
        </div>
      )}

      {/* Ready state — show bot link */}
      {agent?.status === "ready" && agent.telegramBotUsername && (
        <div className="space-y-4">
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0088cc]/20">
                <svg
                  className="h-5 w-5 text-[#0088cc]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.26-2.06-.48-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.75 3.98-1.73 6.64-2.88 7.97-3.44 3.8-1.6 4.59-1.88 5.1-1.89.11 0 .37.03.53.17.14.12.18.28.2.47-.01.06.01.24 0 .38z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Your agent is live on Telegram
                </p>
                <p className="text-xs text-text-secondary">
                  @{agent.telegramBotUsername}
                </p>
              </div>
            </div>
            <a
              href={`https://t.me/${agent.telegramBotUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full justify-center text-sm"
            >
              Open in Telegram
            </a>
          </div>

          <button
            onClick={() => router.push("/onboarding/integrations")}
            className="btn-secondary w-full justify-center"
          >
            Continue setup
          </button>
        </div>
      )}
    </div>
  );
}

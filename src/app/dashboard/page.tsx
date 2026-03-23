"use client";

import { useEffect, useState } from "react";
import { AgentStatusCard } from "@/components/dashboard/AgentStatusCard";

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

interface Subscription {
  id: string;
  tier: string;
  status: string;
  billingPeriod: string;
  currentPeriodEnd: string | null;
}

export default function DashboardPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/agents/status")
      .then((r) => r.json())
      .then((data) => {
        setAgents(data.agents || []);
        setSubscription(data.subscription || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-text-tertiary text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Overview</h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage your AI agents and subscription.
        </p>
      </div>

      {/* Subscription info */}
      {subscription && (
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-text-tertiary font-mono uppercase tracking-wider">
                Plan
              </p>
              <p className="text-lg font-semibold text-foreground capitalize mt-0.5">
                {subscription.tier}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-tertiary">
                {subscription.billingPeriod === "yearly"
                  ? "Annual"
                  : "Monthly"}{" "}
                billing
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    subscription.status === "active"
                      ? "bg-emerald-400"
                      : subscription.status === "past_due"
                        ? "bg-amber-400"
                        : "bg-zinc-400"
                  }`}
                />
                <span className="text-xs text-text-secondary capitalize">
                  {subscription.status.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>
          {subscription.currentPeriodEnd && (
            <p className="text-xs text-text-tertiary mt-3 pt-3 border-t border-border">
              Next billing:{" "}
              {new Date(subscription.currentPeriodEnd).toLocaleDateString(
                "en-US",
                { month: "long", day: "numeric", year: "numeric" }
              )}
            </p>
          )}
        </div>
      )}

      {/* Agents */}
      <div>
        <h2 className="text-xs text-text-tertiary font-mono uppercase tracking-wider mb-3">
          Your Agents
        </h2>
        {agents.length === 0 ? (
          <div className="rounded-xl border border-border border-dashed bg-surface/50 p-8 text-center">
            <p className="text-sm text-text-tertiary">
              No agents deployed yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {agents.map((agent) => (
              <AgentStatusCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-xs text-text-tertiary font-mono uppercase tracking-wider mb-3">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/dashboard/billing"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-text-secondary hover:text-foreground hover:bg-surface-raised transition-colors"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
              />
            </svg>
            Manage Billing
          </a>
          <a
            href="mailto:support@clawgeeks.com"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-text-secondary hover:text-foreground hover:bg-surface-raised transition-colors"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
              />
            </svg>
            Get Help
          </a>
        </div>
      </div>
    </div>
  );
}

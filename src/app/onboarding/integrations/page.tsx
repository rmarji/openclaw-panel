"use client";

import { useRouter } from "next/navigation";
import { StepIndicator } from "@/components/onboarding/StepIndicator";

const INTEGRATIONS = [
  {
    name: "Gmail",
    icon: "M",
    description: "Read, compose, and manage emails",
    tier: "pro",
    color: "#EA4335",
  },
  {
    name: "GitHub",
    icon: "G",
    description: "Manage repos, issues, and PRs",
    tier: "pro",
    color: "#8B5CF6",
  },
  {
    name: "Notion",
    icon: "N",
    description: "Read and write to your workspace",
    tier: "pro",
    color: "#FFFFFF",
  },
  {
    name: "Slack",
    icon: "S",
    description: "Send messages and join channels",
    tier: "pro",
    color: "#4A154B",
  },
  {
    name: "Google Calendar",
    icon: "C",
    description: "Create and manage events",
    tier: "team",
    color: "#4285F4",
  },
  {
    name: "Linear",
    icon: "L",
    description: "Track issues and projects",
    tier: "team",
    color: "#5E6AD2",
  },
];

export default function IntegrationsPage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <StepIndicator currentStep={2} />

      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Connect your tools
        </h1>
        <p className="mt-2 text-text-secondary">
          Give your agent access to the tools it needs. You can always add more
          later from your dashboard.
        </p>
      </div>

      <div className="space-y-3">
        {INTEGRATIONS.map((int) => (
          <div
            key={int.name}
            className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface hover:bg-surface-raised transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold"
                style={{
                  backgroundColor: `${int.color}15`,
                  color: int.color,
                }}
              >
                {int.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {int.name}
                </p>
                <p className="text-xs text-text-tertiary">{int.description}</p>
              </div>
            </div>
            <button className="btn-secondary text-xs py-1.5 px-3 rounded-lg">
              Connect
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => router.push("/onboarding/ready")}
          className="btn-secondary flex-1 justify-center"
        >
          Skip for now
        </button>
        <button
          onClick={() => router.push("/onboarding/ready")}
          className="btn-primary flex-1 justify-center"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

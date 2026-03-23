"use client";

import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { AgentNameForm } from "@/components/onboarding/AgentNameForm";

export default function OnboardingPage() {
  return (
    <div className="space-y-8">
      <StepIndicator currentStep={0} />

      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Name your agent
        </h1>
        <p className="mt-2 text-text-secondary">
          Give your AI agent a name. This will be its identity across Telegram
          and your dashboard.
        </p>
      </div>

      <AgentNameForm />
    </div>
  );
}

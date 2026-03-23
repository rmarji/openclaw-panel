"use client";

import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { ProvisioningStatus } from "@/components/onboarding/ProvisioningStatus";

export default function TelegramPage() {
  return (
    <div className="space-y-8">
      <StepIndicator currentStep={1} />

      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Deploying your agent
        </h1>
        <p className="mt-2 text-text-secondary">
          We&apos;re setting up your dedicated AI agent. This usually takes 2-3
          minutes.
        </p>
      </div>

      <ProvisioningStatus />
    </div>
  );
}

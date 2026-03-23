"use client";

const STEPS = [
  { label: "Name", path: "/onboarding" },
  { label: "Deploy", path: "/onboarding/telegram" },
  { label: "Connect", path: "/onboarding/integrations" },
  { label: "Ready", path: "/onboarding/ready" },
];

interface Props {
  currentStep: number;
}

export function StepIndicator({ currentStep }: Props) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((step, i) => {
        const isActive = i === currentStep;
        const isCompleted = i < currentStep;

        return (
          <div key={step.path} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-all ${
                  isCompleted
                    ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30"
                    : isActive
                      ? "bg-accent/20 text-accent ring-1 ring-accent/30"
                      : "bg-surface-raised text-text-tertiary ring-1 ring-border"
                }`}
              >
                {isCompleted ? (
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-xs hidden sm:inline ${
                  isActive
                    ? "text-text-secondary font-medium"
                    : "text-text-tertiary"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-px w-6 sm:w-10 ${
                  isCompleted ? "bg-emerald-500/30" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

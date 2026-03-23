"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { StepIndicator } from "@/components/onboarding/StepIndicator";

export default function ReadyPage() {
  const router = useRouter();
  const [agent, setAgent] = useState<{
    name: string;
    telegramBotUsername: string | null;
    domain: string | null;
  } | null>(null);

  useEffect(() => {
    fetch("/api/agents/status")
      .then((r) => r.json())
      .then((data) => {
        if (data.agents?.[0]) setAgent(data.agents[0]);
      });
  }, []);

  return (
    <div className="space-y-8">
      <StepIndicator currentStep={3} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 ring-1 ring-accent/20">
            <svg
              className="h-8 w-8 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-foreground">
          {agent?.name || "Your agent"} is ready!
        </h1>
        <p className="text-text-secondary max-w-sm mx-auto">
          Your AI agent is deployed and waiting for you. Start a conversation on
          Telegram or manage everything from your dashboard.
        </p>
      </motion.div>

      <div className="space-y-3">
        {agent?.telegramBotUsername && (
          <a
            href={`https://t.me/${agent.telegramBotUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full justify-center"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.26-2.06-.48-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.75 3.98-1.73 6.64-2.88 7.97-3.44 3.8-1.6 4.59-1.88 5.1-1.89.11 0 .37.03.53.17.14.12.18.28.2.47-.01.06.01.24 0 .38z" />
            </svg>
            Chat on Telegram
          </a>
        )}

        <button
          onClick={() => router.push("/dashboard")}
          className="btn-secondary w-full justify-center"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

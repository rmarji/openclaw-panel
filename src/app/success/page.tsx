"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { motion } from "framer-motion";

function SuccessRedirect() {
  const params = useSearchParams();

  useEffect(() => {
    // Short delay to show the success animation, then redirect to onboarding
    const timer = setTimeout(() => {
      const sessionId = params.get("session_id");
      const url = sessionId
        ? `/onboarding?session_id=${sessionId}`
        : "/onboarding";
      window.location.href = url;
    }, 2000);
    return () => clearTimeout(timer);
  }, [params]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20">
            <motion.svg
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="h-8 w-8 text-emerald-400"
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
            </motion.svg>
          </div>
        </div>

        <h1 className="mt-8 text-3xl font-bold text-white">
          Payment confirmed!
        </h1>
        <p className="mx-auto mt-3 max-w-md text-zinc-400">
          Setting up your account...
        </p>

        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-zinc-500">
            Redirecting to onboarding
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-zinc-500 text-sm">Loading...</div>
        </div>
      }
    >
      <SuccessRedirect />
    </Suspense>
  );
}

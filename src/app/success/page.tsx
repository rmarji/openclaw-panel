"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function SuccessPage() {
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </motion.svg>
          </div>
        </div>

        <h1 className="mt-8 text-3xl font-bold text-white">You&apos;re all set!</h1>
        <p className="mx-auto mt-3 max-w-md text-zinc-400">
          Your subscription is active. We&apos;re spinning up your AI agent now — expect a
          Telegram message within a few minutes.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}

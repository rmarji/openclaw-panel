"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { activeCoupons } from "@/lib/pricing";

export function CouponBanner() {
  const [dismissed, setDismissed] = useState(false);
  const featured = activeCoupons[0];
  if (!featured || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-violet-600/90 via-indigo-600/90 to-violet-600/90"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvc3ZnPg==')] opacity-50" />
        <div className="relative mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-3 text-sm sm:px-6">
          <span className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="rounded-md bg-white/15 px-2.5 py-0.5 font-mono text-xs font-bold tracking-widest text-white backdrop-blur-sm">
              {featured.code}
            </span>
            <span className="shimmer-text font-medium">
              {featured.description}
            </span>
            <span className="hidden text-violet-200 sm:inline">
              — auto-applied at checkout
            </span>
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="absolute right-4 text-white/40 transition hover:text-white/80"
            aria-label="Dismiss"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

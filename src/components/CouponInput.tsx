"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CouponInputProps {
  tier: string;
  onApply: (coupon: {
    code: string;
    percentOff?: number;
    amountOff?: number;
    description: string;
  }) => void;
  onClear: () => void;
}

export function CouponInput({ tier, onApply, onClear }: CouponInputProps) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "valid" | "invalid">("idle");
  const [error, setError] = useState("");
  const [appliedCode, setAppliedCode] = useState("");

  async function handleApply() {
    if (!code.trim()) return;
    setStatus("loading");

    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code.trim(), tier }),
    });
    const data = await res.json();

    if (data.valid) {
      setStatus("valid");
      setAppliedCode(code.trim().toUpperCase());
      onApply(data.coupon);
    } else {
      setStatus("invalid");
      setError(data.error);
    }
  }

  function handleClear() {
    setCode("");
    setStatus("idle");
    setError("");
    setAppliedCode("");
    onClear();
  }

  return (
    <AnimatePresence mode="wait">
      {status === "valid" ? (
        <motion.div
          key="applied"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-sm"
        >
          <svg
            className="h-4 w-4 text-emerald-400 check-animated"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-mono font-semibold text-emerald-300">{appliedCode}</span>
          <span className="text-emerald-400/70">applied</span>
          <button
            onClick={handleClear}
            className="ml-auto text-emerald-400/50 transition hover:text-emerald-300"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      ) : (
        <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  if (status === "invalid") setStatus("idle");
                }}
                placeholder="Coupon code"
                className={`w-full rounded-lg border bg-white/[0.03] px-3 py-2 font-mono text-sm text-white placeholder-zinc-600 transition focus:outline-none ${
                  status === "invalid"
                    ? "border-red-500/40 focus:border-red-500/60"
                    : "border-white/[0.06] focus:border-violet-500/50"
                }`}
                onKeyDown={(e) => e.key === "Enter" && handleApply()}
              />
            </div>
            <button
              onClick={handleApply}
              disabled={status === "loading" || !code.trim()}
              className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-sm font-medium text-zinc-400 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-30"
            >
              {status === "loading" ? (
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                "Apply"
              )}
            </button>
          </div>
          <AnimatePresence>
            {status === "invalid" && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-1.5 text-xs text-red-400"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

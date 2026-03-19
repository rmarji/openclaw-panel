"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { tiers, activeCoupons } from "@/lib/pricing";
import { PricingCard } from "./PricingCard";

export function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-pattern opacity-50" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-block rounded-full border border-violet-500/20 bg-violet-500/5 px-4 py-1.5 text-xs font-medium tracking-wider text-violet-400 uppercase">
            Pricing
          </span>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Plans that scale with you
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-400">
            Start with one agent. Scale to a full team. Every plan includes a 14-day free trial.
          </p>
        </motion.div>

        {/* Billing toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <span
            className={`text-sm font-medium transition ${
              billingPeriod === "monthly" ? "text-white" : "text-zinc-500"
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() =>
              setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")
            }
            className="relative h-7 w-12 rounded-full bg-white/[0.06] transition hover:bg-white/[0.1]"
          >
            <motion.span
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`absolute top-0.5 h-6 w-6 rounded-full ${
                billingPeriod === "yearly"
                  ? "left-[1.375rem] bg-violet-500"
                  : "left-0.5 bg-zinc-400"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium transition ${
              billingPeriod === "yearly" ? "text-white" : "text-zinc-500"
            }`}
          >
            Yearly
          </span>
          {billingPeriod === "yearly" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-400"
            >
              Save ~17%
            </motion.span>
          )}
        </motion.div>

        {/* Active coupons */}
        {activeCoupons.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-3"
          >
            {activeCoupons.map((coupon) => (
              <div
                key={coupon.code}
                className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded bg-violet-500/10">
                  <svg
                    className="h-3 w-3 text-violet-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
                    />
                  </svg>
                </span>
                <span className="font-mono text-sm font-bold tracking-wider text-violet-300">
                  {coupon.code}
                </span>
                <span className="text-sm text-zinc-300">{coupon.description}</span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Cards */}
        <div className="mx-auto mt-14 grid max-w-sm gap-6 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {tiers.map((tier, i) => (
            <PricingCard key={tier.slug} tier={tier} billingPeriod={billingPeriod} index={i} />
          ))}
        </div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="mx-auto flex max-w-md flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-600">
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                  clipRule="evenodd"
                />
              </svg>
              Secure payments
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              14-day free trial
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              Cancel anytime
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

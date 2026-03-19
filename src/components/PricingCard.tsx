"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { PricingTier } from "@/lib/pricing";
import { CouponInput } from "./CouponInput";

interface PricingCardProps {
  tier: PricingTier;
  billingPeriod: "monthly" | "yearly";
  index: number;
}

export function PricingCard({ tier, billingPeriod, index }: PricingCardProps) {
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    percentOff?: number;
    amountOff?: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);

  const basePrice = billingPeriod === "monthly" ? tier.monthlyPrice : tier.yearlyPrice;
  const perMonth = billingPeriod === "yearly" ? Math.round(tier.yearlyPrice / 12) : tier.monthlyPrice;

  let discountedPerMonth = perMonth;
  if (appliedCoupon?.percentOff) {
    discountedPerMonth = Math.round(perMonth * (1 - appliedCoupon.percentOff / 100));
  } else if (appliedCoupon?.amountOff) {
    discountedPerMonth = Math.max(0, perMonth - appliedCoupon.amountOff);
  }

  let discountedTotal = basePrice;
  if (appliedCoupon?.percentOff) {
    discountedTotal = Math.round(basePrice * (1 - appliedCoupon.percentOff / 100));
  } else if (appliedCoupon?.amountOff) {
    discountedTotal = Math.max(0, basePrice - appliedCoupon.amountOff);
  }

  const yearlySavings =
    billingPeriod === "yearly"
      ? Math.round(((tier.monthlyPrice * 12 - tier.yearlyPrice) / (tier.monthlyPrice * 12)) * 100)
      : 0;

  async function handleCheckout() {
    setLoading(true);
    try {
      const priceId = billingPeriod === "monthly" ? tier.priceIdMonthly : tier.priceIdYearly;
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, couponCode: appliedCoupon?.code }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative flex flex-col rounded-2xl p-px ${
        tier.highlighted ? "gradient-border" : ""
      }`}
    >
      {/* Card inner */}
      <div
        className={`relative flex h-full flex-col rounded-2xl p-8 ${
          tier.highlighted ? "glass-highlight glow-violet-strong" : "glass"
        } transition-all duration-300 ${hovered && !tier.highlighted ? "glow-violet" : ""}`}
      >
        {/* Popular badge */}
        {tier.highlighted && (
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1 text-xs font-bold tracking-wider text-white uppercase shadow-lg shadow-violet-500/20">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
              Most Popular
            </span>
          </div>
        )}

        {/* Tier name & description */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white">{tier.name}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">
            {tier.description}
          </p>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1.5">
            {appliedCoupon ? (
              <>
                <span className="text-2xl font-medium text-zinc-600 line-through">
                  ${perMonth}
                </span>
                <motion.span
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="text-5xl font-bold tracking-tight text-white"
                >
                  ${discountedPerMonth}
                </motion.span>
              </>
            ) : (
              <span className="text-5xl font-bold tracking-tight text-white">
                ${perMonth}
              </span>
            )}
            <span className="text-base text-zinc-500">/mo</span>
          </div>

          {billingPeriod === "yearly" && (
            <p className="mt-1.5 text-sm text-zinc-500">
              ${appliedCoupon ? discountedTotal : basePrice}/year
              {yearlySavings > 0 && !appliedCoupon && (
                <span className="ml-1.5 font-medium text-emerald-400">
                  Save {yearlySavings}%
                </span>
              )}
            </p>
          )}

          {appliedCoupon && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1.5 text-sm font-medium text-violet-400"
            >
              {appliedCoupon.percentOff}% discount applied
            </motion.p>
          )}
        </div>

        {/* Coupon */}
        <div className="mb-6">
          <CouponInput
            tier={tier.slug}
            onApply={(coupon) => setAppliedCoupon(coupon)}
            onClear={() => setAppliedCoupon(null)}
          />
        </div>

        {/* Features */}
        <ul className="mb-8 flex-1 space-y-3">
          {tier.features.map((feature, i) => (
            <motion.li
              key={feature}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + i * 0.03 }}
              viewport={{ once: true }}
              className="flex items-start gap-3 text-sm text-zinc-400"
            >
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-violet-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {feature}
            </motion.li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className={`group relative w-full overflow-hidden rounded-xl py-3.5 text-sm font-semibold transition-all ${
            tier.highlighted
              ? "bg-violet-600 text-white hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/20"
              : "bg-white/[0.06] text-white hover:bg-white/[0.1]"
          } disabled:opacity-50`}
        >
          {loading ? (
            <svg className="mx-auto h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <span className="flex items-center justify-center gap-2">
              {tier.cta}
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          )}
        </button>
      </div>
    </motion.div>
  );
}

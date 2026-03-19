/**
 * Run with: npx tsx scripts/setup-stripe.ts
 *
 * Creates products, prices, and coupons in Stripe.
 * Outputs the price IDs to paste into .env.local
 *
 * Requires STRIPE_SECRET_KEY in environment.
 */

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

interface TierConfig {
  name: string;
  description: string;
  monthlyPrice: number; // cents
  yearlyPrice: number; // cents
}

const tiers: TierConfig[] = [
  {
    name: "ClawGeeks Starter",
    description: "1 AI Agent, 5K messages/month, standard models",
    monthlyPrice: 2900,
    yearlyPrice: 29000,
  },
  {
    name: "ClawGeeks Pro",
    description: "3 AI Agents, 25K messages/month, all models + smart routing",
    monthlyPrice: 7900,
    yearlyPrice: 79000,
  },
  {
    name: "ClawGeeks Team",
    description: "10 AI Agents, unlimited messages, dedicated resources",
    monthlyPrice: 19900,
    yearlyPrice: 199000,
  },
];

interface CouponConfig {
  id: string;
  name: string;
  percent_off?: number;
  amount_off?: number;
  currency?: string;
  duration: "once" | "repeating" | "forever";
  duration_in_months?: number;
}

const coupons: CouponConfig[] = [
  {
    id: "LAUNCH25",
    name: "Launch — 25% off first 3 months",
    percent_off: 25,
    duration: "repeating",
    duration_in_months: 3,
  },
  {
    id: "ANNUAL20",
    name: "Annual extra 20% off",
    percent_off: 20,
    duration: "once",
  },
];

async function main() {
  console.log("Setting up Stripe products, prices, and coupons...\n");

  const envLines: string[] = [];

  for (const tier of tiers) {
    const slug = tier.name.replace("ClawGeeks ", "").toLowerCase();

    // Create product
    const product = await stripe.products.create({
      name: tier.name,
      description: tier.description,
    });
    console.log(`Product: ${product.name} (${product.id})`);

    // Monthly price
    const monthly = await stripe.prices.create({
      product: product.id,
      unit_amount: tier.monthlyPrice,
      currency: "usd",
      recurring: { interval: "month" },
    });
    console.log(`  Monthly: $${tier.monthlyPrice / 100}/mo → ${monthly.id}`);
    envLines.push(`STRIPE_PRICE_${slug.toUpperCase()}_MONTHLY=${monthly.id}`);

    // Yearly price
    const yearly = await stripe.prices.create({
      product: product.id,
      unit_amount: tier.yearlyPrice,
      currency: "usd",
      recurring: { interval: "year" },
    });
    console.log(`  Yearly:  $${tier.yearlyPrice / 100}/yr → ${yearly.id}`);
    envLines.push(`STRIPE_PRICE_${slug.toUpperCase()}_YEARLY=${yearly.id}`);
  }

  console.log("\nCreating coupons...\n");

  for (const coupon of coupons) {
    try {
      const created = await stripe.coupons.create({
        id: coupon.id,
        name: coupon.name,
        percent_off: coupon.percent_off,
        amount_off: coupon.amount_off,
        currency: coupon.currency,
        duration: coupon.duration,
        duration_in_months: coupon.duration_in_months,
      });
      console.log(`Coupon: ${created.id} — ${created.name}`);
    } catch (err) {
      if (err instanceof Error && err.message.includes("already exists")) {
        console.log(`Coupon: ${coupon.id} — already exists, skipping`);
      } else {
        throw err;
      }
    }
  }

  console.log("\n--- Paste into .env.local ---\n");
  for (const line of envLines) {
    console.log(line);
  }
}

main().catch(console.error);

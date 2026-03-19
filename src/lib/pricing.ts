export interface PricingTier {
  name: string;
  slug: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  highlighted?: boolean;
  cta: string;
  priceIdMonthly: string;
  priceIdYearly: string;
}

export const tiers: PricingTier[] = [
  {
    name: "Starter",
    slug: "starter",
    description: "Perfect for individuals getting started with AI agents",
    monthlyPrice: 29,
    yearlyPrice: 290,
    features: [
      "1 AI Agent instance",
      "Telegram integration",
      "5,000 messages/month",
      "Standard models (Haiku, Sonnet)",
      "Email support",
    ],
    cta: "Start Free Trial",
    priceIdMonthly: process.env.STRIPE_PRICE_STARTER_MONTHLY!,
    priceIdYearly: process.env.STRIPE_PRICE_STARTER_YEARLY!,
  },
  {
    name: "Pro",
    slug: "pro",
    description: "For professionals who need powerful AI agents",
    monthlyPrice: 79,
    yearlyPrice: 790,
    highlighted: true,
    features: [
      "3 AI Agent instances",
      "Telegram + Slack integration",
      "25,000 messages/month",
      "All models (Haiku, Sonnet, Opus)",
      "Smart routing (Manifest)",
      "Gmail, GitHub, Notion tools",
      "Priority support",
    ],
    cta: "Start Free Trial",
    priceIdMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY!,
    priceIdYearly: process.env.STRIPE_PRICE_PRO_YEARLY!,
  },
  {
    name: "Team",
    slug: "team",
    description: "For teams that need multiple agents and full control",
    monthlyPrice: 199,
    yearlyPrice: 1990,
    features: [
      "10 AI Agent instances",
      "All integrations",
      "Unlimited messages",
      "All models + custom model routing",
      "Dedicated server resources",
      "Langfuse observability dashboard",
      "Custom agent personas",
      "Slack support channel",
    ],
    cta: "Start Free Trial",
    priceIdMonthly: process.env.STRIPE_PRICE_TEAM_MONTHLY!,
    priceIdYearly: process.env.STRIPE_PRICE_TEAM_YEARLY!,
  },
];

export interface Coupon {
  code: string;
  description: string;
  percentOff?: number;
  amountOff?: number;
  currency?: string;
  duration: "once" | "repeating" | "forever";
  durationInMonths?: number;
  applicableTiers?: string[]; // empty = all tiers
  expiresAt?: string;
  stripeCouponId: string;
}

// These coupons should match what's created in Stripe
export const activeCoupons: Coupon[] = [
  {
    code: "LAUNCH25",
    description: "25% off your first 3 months",
    percentOff: 25,
    duration: "repeating",
    durationInMonths: 3,
    stripeCouponId: "LAUNCH25",
  },
  {
    code: "ANNUAL20",
    description: "Extra 20% off annual plans",
    percentOff: 20,
    duration: "once",
    applicableTiers: ["pro", "team"],
    stripeCouponId: "ANNUAL20",
  },
];

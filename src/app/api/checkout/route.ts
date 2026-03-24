import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { tiers, activeCoupons } from "@/lib/pricing";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const { priceId, couponCode } = await req.json();

    if (!priceId) {
      return NextResponse.json({ error: "Price ID required" }, { status: 400 });
    }

    // Determine tier and billing period from the price ID
    const tier = tiers.find(
      (t) => t.priceIdMonthly === priceId || t.priceIdYearly === priceId
    );
    const billingPeriod =
      tier?.priceIdYearly === priceId ? "yearly" : "monthly";

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        tier: tier?.slug || "unknown",
        billing_period: billingPeriod,
      },
    };

    if (couponCode) {
      // Map user-facing code (e.g. "LAUNCH25") to Stripe coupon ID
      const coupon = activeCoupons.find(
        (c) => c.code.toUpperCase() === couponCode.toUpperCase()
      );
      params.discounts = [{ coupon: coupon?.stripeCouponId || couponCode }];
    } else {
      // Only allow manual promo codes if no auto-applied coupon
      params.allow_promotion_codes = true;
    }

    const session = await stripe.checkout.sessions.create(params);

    // Set a cookie so we can link the checkout to the user after OAuth
    const response = NextResponse.json({ url: session.url });
    response.cookies.set("pending_checkout", session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24h
      path: "/",
    });

    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

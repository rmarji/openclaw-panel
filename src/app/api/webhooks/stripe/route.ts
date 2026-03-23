import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import {
  users,
  subscriptions,
  agents,
  pendingCheckouts,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { tiers } from "@/lib/pricing";
import Stripe from "stripe";

function tierFromPriceId(priceId: string): string {
  const tier = tiers.find(
    (t) => t.priceIdMonthly === priceId || t.priceIdYearly === priceId
  );
  return tier?.slug || "starter";
}

function billingPeriodFromPriceId(priceId: string): string {
  const tier = tiers.find(
    (t) => t.priceIdMonthly === priceId || t.priceIdYearly === priceId
  );
  if (!tier) return "monthly";
  return tier.priceIdYearly === priceId ? "yearly" : "monthly";
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Webhook verification failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_details?.email || session.customer_email;
      const stripeCustomerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id;
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;

      if (!email || !stripeCustomerId || !subscriptionId) {
        console.error("Checkout missing required fields:", session.id);
        break;
      }

      // Get subscription details from Stripe
      const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);
      const priceId = stripeSub.items.data[0]?.price.id || "";
      const tier =
        (session.metadata?.tier as string) || tierFromPriceId(priceId);
      const billingPeriod =
        (session.metadata?.billing_period as string) ||
        billingPeriodFromPriceId(priceId);

      // Upsert user by email
      let user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!user) {
        const [newUser] = await db
          .insert(users)
          .values({
            email,
            name: session.customer_details?.name || null,
            stripeCustomerId,
          })
          .returning();
        user = newUser;
      } else if (!user.stripeCustomerId) {
        await db
          .update(users)
          .set({ stripeCustomerId, updatedAt: new Date() })
          .where(eq(users.id, user.id));
      }

      // Create subscription record
      const periodEnd = stripeSub.items.data[0]?.current_period_end;
      const [sub] = await db
        .insert(subscriptions)
        .values({
          userId: user.id,
          stripeSubscriptionId: subscriptionId,
          stripePriceId: priceId,
          tier,
          status: stripeSub.status,
          billingPeriod,
          currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
        })
        .returning();

      // Create agent record (pending provisioning)
      const slug = `${email.split("@")[0]}-agent-${Date.now().toString(36)}`;
      await db.insert(agents).values({
        userId: user.id,
        subscriptionId: sub.id,
        name: `${tier} Agent`,
        slug,
        status: "pending",
      });

      // Track the pending checkout
      await db
        .insert(pendingCheckouts)
        .values({
          stripeSessionId: session.id,
          stripeCustomerId,
          email,
          tier,
          billingPeriod,
          status: "pending",
        })
        .onConflictDoUpdate({
          target: pendingCheckouts.stripeSessionId,
          set: { status: "pending", stripeCustomerId, email },
        });

      console.log(
        `Checkout completed: ${session.id} | User: ${user.id} | Tier: ${tier}`
      );
      break;
    }

    case "customer.subscription.updated": {
      const stripeSub = event.data.object as Stripe.Subscription;
      const sub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.stripeSubscriptionId, stripeSub.id),
      });

      if (sub) {
        const priceId = stripeSub.items.data[0]?.price.id || sub.stripePriceId;
        const periodEnd = stripeSub.items.data[0]?.current_period_end;
        await db
          .update(subscriptions)
          .set({
            status: stripeSub.status,
            stripePriceId: priceId,
            tier: tierFromPriceId(priceId),
            billingPeriod: billingPeriodFromPriceId(priceId),
            currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : sub.currentPeriodEnd,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.id, sub.id));
        console.log(`Subscription updated: ${stripeSub.id} → ${stripeSub.status}`);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const stripeSub = event.data.object as Stripe.Subscription;
      const sub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.stripeSubscriptionId, stripeSub.id),
      });

      if (sub) {
        await db
          .update(subscriptions)
          .set({ status: "canceled", updatedAt: new Date() })
          .where(eq(subscriptions.id, sub.id));

        // Mark associated agents as stopped
        await db
          .update(agents)
          .set({ status: "stopped", updatedAt: new Date() })
          .where(eq(agents.subscriptionId, sub.id));
        console.log(`Subscription cancelled: ${stripeSub.id}`);
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      // In newer Stripe API, subscription is under parent.subscription_details
      const parentSub = (invoice as any).parent?.subscription_details?.subscription;
      const subId =
        typeof parentSub === "string"
          ? parentSub
          : parentSub?.id || null;

      if (subId) {
        const sub = await db.query.subscriptions.findFirst({
          where: eq(subscriptions.stripeSubscriptionId, subId),
        });
        if (sub) {
          await db
            .update(subscriptions)
            .set({ status: "past_due", updatedAt: new Date() })
            .where(eq(subscriptions.id, sub.id));
        }
      }
      console.log(`Payment failed: invoice ${invoice.id}`);
      break;
    }
  }

  return NextResponse.json({ received: true });
}

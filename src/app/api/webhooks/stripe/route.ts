import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

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
    const message = err instanceof Error ? err.message : "Webhook verification failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      // TODO: Provision the user's OpenClaw instance(s)
      // - Create Coolify service via API
      // - Set up Telegram bot
      // - Configure model routing tier
      console.log("Checkout completed:", session.id, "Customer:", session.customer);
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      // TODO: Handle plan changes (upgrade/downgrade agent count, model access)
      console.log("Subscription updated:", subscription.id, "Status:", subscription.status);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      // TODO: Deprovision — stop OpenClaw containers, revoke access
      console.log("Subscription cancelled:", subscription.id);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      // TODO: Notify user, grace period before deprovisioning
      console.log("Payment failed:", invoice.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}

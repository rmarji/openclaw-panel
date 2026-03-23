"use client";

import { useState } from "react";

export default function BillingPage() {
  const [loading, setLoading] = useState(false);

  async function openPortal() {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Billing</h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage your subscription, payment method, and invoices.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
        <h2 className="text-sm font-medium text-foreground">
          Stripe Customer Portal
        </h2>
        <p className="text-sm text-text-secondary">
          Update your payment method, change your plan, view invoices, or cancel
          your subscription through Stripe&apos;s secure portal.
        </p>
        <button
          onClick={openPortal}
          disabled={loading}
          className="btn-primary text-sm disabled:opacity-40"
        >
          {loading ? "Opening..." : "Manage Billing"}
        </button>
      </div>
    </div>
  );
}

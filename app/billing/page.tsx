"use client";

import { useState } from "react";
import { updatePlan, type PlanKey } from "@/lib/dataStore";
import { useAuth } from "@/context/AuthProvider";

const plans: {
  key: PlanKey;
  title: string;
  price: string;
  features: string[];
}[] = [
  {
    key: "free",
    title: "Free",
    price: "$0",
    features: ["Basic profile", "Starter QR", "Limited scans"],
  },
  {
    key: "starter",
    title: "Starter",
    price: "$9",
    features: ["More QR pages", "Basic analytics", "Priority support"],
  },
  {
    key: "pro",
    title: "Pro",
    price: "$19",
    features: ["Advanced analytics", "More services", "Better customization"],
  },
  {
    key: "business",
    title: "Business",
    price: "$49",
    features: ["Team usage", "Admin tools", "Unlimited QR workflows"],
  },
];

export default function BillingPage() {
  const { user } = useAuth();
  const [savingPlan, setSavingPlan] = useState<PlanKey | null>(null);
  const [message, setMessage] = useState("");

  return (
    <main className="container-page">
      <div className="mb-6">
        <h1 className="section-title">Billing</h1>
        <p className="section-subtitle">
          Stripe-ready billing page. Demo buttons below switch the local plan
          state.
        </p>
      </div>

      {message ? (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      <div className="card-grid">
        {plans.map((plan) => (
          <div key={plan.key} className="surface p-6">
            <div className="text-sm text-slate-500">{plan.title}</div>
            <div className="mt-2 text-3xl font-semibold">{plan.price}</div>

            <div className="mt-4 space-y-2 text-sm text-slate-600">
              {plan.features.map((feature) => (
                <div key={feature}>• {feature}</div>
              ))}
            </div>

            <button
              className="btn-primary mt-6"
              disabled={!user || savingPlan === plan.key}
              onClick={async () => {
                if (!user) {
                  setMessage("Please sign in first.");
                  return;
                }

                try {
                  setSavingPlan(plan.key);
                  setMessage("");
                  await updatePlan(plan.key);
                  setMessage(`Plan updated to ${plan.title}.`);
                } catch (error) {
                  setMessage(
                    error instanceof Error
                      ? error.message
                      : "Failed to update plan."
                  );
                } finally {
                  setSavingPlan(null);
                }
              }}
            >
              {savingPlan === plan.key ? "Updating..." : `Choose ${plan.title}`}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { FormField } from "@/components/ui/FormField";

export default function WaitlistPage() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) {
      showToast("Please enter your email", "error");
      return;
    }

    showToast("You have been added to the waitlist", "success");
    setEmail("");
  }

  return (
    <div className="container-page max-w-xl">
      <div className="surface p-6">
        <h1 className="section-title">Join the waitlist</h1>
        <p className="section-subtitle">
          Leave your email and we’ll notify you when new QR World features launch.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <FormField label="Email">
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </FormField>

          <button type="submit" className="btn-primary">
            Join waitlist
          </button>
        </form>
      </div>
    </div>
  );
}
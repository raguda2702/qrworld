"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/ui/Toast";

type Props = {
  nextPath: string;
};

export default function SignInClient({ nextPath }: Props) {
  const { signIn, signInGoogle } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      await signIn(email, password);
      showToast("Signed in successfully", "success");
      router.push(nextPath);
    } catch (error: any) {
      showToast(error?.message || "Sign in failed", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setGoogleSubmitting(true);

    try {
      await signInGoogle();
      showToast("Signed in with Google", "success");
      router.push(nextPath);
    } catch (error: any) {
      showToast(error?.message || "Google sign in failed", "error");
    } finally {
      setGoogleSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <h1 className="mb-6 text-2xl font-bold">Sign in</h1>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="my-4 text-center text-sm text-slate-500">or</div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleSubmitting}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 disabled:opacity-60"
        >
          {googleSubmitting ? "Connecting..." : "Continue with Google"}
        </button>
      </div>
    </div>
  );
}
"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { getAccount } from "@/lib/dataStore";
import type { AccountSettings } from "@/types";

export default function AccountPage() {
  const { user } = useAuth();
  const [account, setAccount] = useState<AccountSettings | null>(null);
  useEffect(() => { if (user) getAccount(user.uid).then(setAccount); }, [user]);
  return <div className="container-page max-w-3xl"><div className="surface p-6 sm:p-8"><h1 className="section-title">Account</h1><p className="section-subtitle">Profile, plan and billing identity.</p><div className="mt-6 grid gap-4 sm:grid-cols-2"><div className="rounded-3xl border border-slate-200 bg-white p-4"><div className="text-sm text-slate-500">Display name</div><div className="mt-2 font-semibold">{account?.displayName || user?.displayName || "—"}</div></div><div className="rounded-3xl border border-slate-200 bg-white p-4"><div className="text-sm text-slate-500">Email</div><div className="mt-2 font-semibold">{user?.email || "—"}</div></div><div className="rounded-3xl border border-slate-200 bg-white p-4"><div className="text-sm text-slate-500">Plan</div><div className="mt-2 font-semibold uppercase">{account?.plan || "free"}</div></div><div className="rounded-3xl border border-slate-200 bg-white p-4"><div className="text-sm text-slate-500">Subscription</div><div className="mt-2 font-semibold">{account?.subscriptionStatus || "inactive"}</div></div></div></div></div>;
}

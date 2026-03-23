"use client";

import RequestsPanel from "@/components/date/RequestsPanel";
import { useAuth } from "@/components/auth/AuthProvider";

export default function RequestsPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container-page">
        <div className="surface p-6">
          <h1 className="text-2xl font-semibold">Requests</h1>
          <p className="mt-2 text-slate-500">Please sign in first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page">
      <div className="mb-6">
        <h1 className="section-title">Requests</h1>
        <p className="section-subtitle">People who want to connect with you.</p>
      </div>

      <RequestsPanel userId={user.uid} />
    </div>
  );
}
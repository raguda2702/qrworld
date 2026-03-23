"use client";

import { useEffect, useState } from "react";
import ProfileEditor from "@/components/profile/ProfileEditor";
import { useAuth } from "@/components/auth/AuthProvider";

export default function ProfilePage() {
  const { user } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="container-page">Loading profile...</div>;
  }

  if (!user) {
    return (
      <div className="container-page">
        <div className="surface p-6">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="mt-2 text-slate-500">Please sign in first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page max-w-4xl">
      <div className="mb-6">
        <h1 className="section-title">Profile</h1>
        <p className="section-subtitle">Set up your QR Date public page.</p>
      </div>

      <ProfileEditor userId={user.uid} email={user.email} />
    </div>
  );
}
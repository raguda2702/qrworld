"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import QrServiceList from "@/components/qr/QrServiceList";

export default function QrPage() {
  const { user } = useAuth();
  const [ready, setReady] = useState(false);
  const [refreshKey] = useState(0);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="container-page">Loading QR dashboard...</div>;
  }

  if (!user) {
    return (
      <div className="container-page">
        <div className="surface p-6">
          <h1 className="section-title">My QR</h1>
          <p className="section-subtitle mt-2">Please sign in first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="section-title">My QR</h1>
          <p className="section-subtitle">
            Manage QR services, public links, and generated QR codes.
          </p>
        </div>

        <Link href="/qr/create" className="btn-primary">
          New QR
        </Link>
      </div>

      <QrServiceList userId={user.uid} refreshKey={refreshKey} />
    </div>
  );
}
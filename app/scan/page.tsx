"use client";

import { useEffect, useState } from "react";
import QrScanner from "@/components/qr/QrScanner";
import { useAuth } from "@/components/auth/AuthProvider";

export default function ScanPage() {
  const { user } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="container-page">Loading scanner page...</div>;
  }

  return (
    <div className="container-page max-w-3xl">
      <div className="mb-6">
        <h1 className="section-title">Scan QR</h1>
        <p className="section-subtitle">
          {user
            ? "You are signed in. Scanned QR can open profile and action flows."
            : "You are browsing as guest. Scanned QR will open public pages."}
        </p>
      </div>

      <QrScanner />
    </div>
  );
}
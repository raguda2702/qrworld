"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import QrGeneratorForm from "@/components/qr/QrGeneratorForm";

export default function QrCreatePage() {
  const { user } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="container-page">Loading QR generator...</div>;
  }

  if (!user) {
    return (
      <div className="container-page">
        <div className="surface p-6">
          <h1 className="section-title">Create QR</h1>
          <p className="section-subtitle mt-2">Please sign in first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page max-w-3xl">
      <div className="mb-6">
        <h1 className="section-title">Create QR</h1>
        <p className="section-subtitle">
          Create a service, generate QR code, and connect it to your public page.
        </p>
      </div>

      <QrGeneratorForm userId={user.uid} />
    </div>
  );
}
"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getUserService, recordScan } from "@/lib/dataStore";

interface Props {
  params: Promise<{ userId: string; serviceKey: string; serviceId: string }>;
}

function serviceTitle(serviceKey: string) {
  switch (serviceKey) {
    case "qr-date": return "QR Date";
    case "qr-door": return "QR Door";
    case "qr-pet": return "QR Pet";
    case "qr-car": return "QR Car";
    case "qr-kids": return "QR Kids";
    case "qr-stuff": return "QR Stuff";
    default: return serviceKey;
  }
}

export default function PublicQrPage({ params }: Props) {
  const resolvedParams = use(params);
  const { user } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => { setReady(true); }, []);
  useEffect(() => {
    if (!ready) return;
    void recordScan({ ownerUid: resolvedParams.userId, qrId: resolvedParams.serviceId, device: "web" });
  }, [ready, resolvedParams.userId, resolvedParams.serviceId]);

  if (!ready) return <div className="container-page max-w-2xl"><div className="surface p-6">Loading QR...</div></div>;

  const service = getUserService(resolvedParams.serviceId);
  if (!service) return <div className="container-page max-w-2xl"><div className="surface p-6"><h1 className="text-2xl font-semibold text-slate-900">QR not found</h1><p className="mt-2 text-slate-500">This QR code is not connected to an active service.</p></div></div>;
  if (service.userId !== resolvedParams.userId || service.serviceKey !== resolvedParams.serviceKey) return <div className="container-page max-w-2xl"><div className="surface p-6"><h1 className="text-2xl font-semibold text-slate-900">QR mismatch</h1><p className="mt-2 text-slate-500">The QR route does not match the connected service data.</p></div></div>;

  if (resolvedParams.serviceKey === "qr-date") {
    return (
      <div className="container-page max-w-2xl">
        <div className="surface p-8 text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{serviceTitle(resolvedParams.serviceKey)}</div>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">{service.title}</h1>
          <p className="mt-3 text-slate-500">This QR is connected to a public dating profile.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href={`/u/${resolvedParams.userId}`} className="btn-primary">Open profile</Link>
            {!user ? <Link href={`/auth/sign-in?next=/u/${resolvedParams.userId}`} className="btn-secondary">Sign in to connect</Link> : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page max-w-2xl">
      <div className="surface p-8">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{serviceTitle(service.serviceKey)}</div>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">{service.title}</h1>
        <p className="mt-3 text-slate-600">{service.description || "This service is connected to a QR code."}</p>
        <div className="mt-6 rounded-3xl bg-slate-50 p-5">
          <div className="text-sm text-slate-500">Service key</div>
          <div className="mt-1 font-medium text-slate-900">{service.serviceKey}</div>
          <div className="mt-4 text-sm text-slate-500">Owner</div>
          <div className="mt-1 font-medium text-slate-900">{resolvedParams.userId}</div>
        </div>
      </div>
    </div>
  );
}

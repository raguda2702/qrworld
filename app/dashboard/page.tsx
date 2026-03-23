"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import {
  deleteQRCode,
  getAccount,
  listDateProfiles,
  listQRCodes,
  listScansForOwner,
} from "@/lib/dataStore";
import type {
  AccountSettings,
  DateProfile,
  QRCodeRecord,
  ScanRecord,
} from "@/types";

function mapAccountToSettings(account: Awaited<ReturnType<typeof getAccount>>): AccountSettings {
  return {
    uid: account.uid,
    displayName: account.displayName,
    email: account.email,
    photoURL: account.photoURL,
    plan: account.plan,
    subscriptionStatus: account.plan || "free",
    createdAt: account.createdAt,
  };
}

function mapDateProfiles(items: Awaited<ReturnType<typeof listDateProfiles>>): DateProfile[] {
  return items.map((item) => ({
    id: item.id,
    ownerUid: item.ownerUid,
    userId: item.ownerUid,
    name: item.name,
    age: item.age,
    city: item.city,
    bio: item.bio,
    photoUrl: item.photoUrl,
    interests: item.interests ?? [],
    visibility: item.visibility,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));
}

function mapQRCodes(items: Awaited<ReturnType<typeof listQRCodes>>): QRCodeRecord[] {
  return items.map((item) => ({
    id: item.id,
    ownerUid: item.ownerUid,
    userId: item.ownerUid,
    serviceId: item.serviceId,
    serviceSlug: item.serviceSlug,
    service: item.serviceSlug || item.serviceId,
    title: item.title,
    description: item.description,
    targetUrl: item.targetUrl,
    qrCodeUrl: item.qrCodeUrl,
    createdAt: item.createdAt,
  }));
}

function mapScans(items: Awaited<ReturnType<typeof listScansForOwner>>): ScanRecord[] {
  return items.map((item) => ({
    id: item.id,
    ownerUid: item.ownerUid,
    qrId: item.qrId,
    scannedAt: item.scannedAt,
    city: item.city,
    device: item.device,
  }));
}

export default function DashboardPage() {
  const { user, loading } = useAuth();

  const [account, setAccount] = useState<AccountSettings | null>(null);
  const [profiles, setProfiles] = useState<DateProfile[]>([]);
  const [qrs, setQrs] = useState<QRCodeRecord[]>([]);
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshAll = useCallback(async () => {
    if (!user?.uid) {
      setAccount(null);
      setProfiles([]);
      setQrs([]);
      setScans([]);
      setPageLoading(false);
      return;
    }

    setPageLoading(true);

    try {
      const [nextAccount, nextProfiles, nextQrs, nextScans] = await Promise.all([
        getAccount(user.uid),
        listDateProfiles(user.uid),
        listQRCodes(user.uid),
        listScansForOwner(user.uid),
      ]);

      setAccount(mapAccountToSettings(nextAccount));
      setProfiles(mapDateProfiles(nextProfiles));
      setQrs(mapQRCodes(nextQrs));
      setScans(mapScans(nextScans));
    } finally {
      setPageLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    if (loading) return;
    refreshAll();
  }, [loading, refreshAll, refreshKey]);

  if (loading || pageLoading) {
    return (
      <main className="container-page">
        <div className="surface p-6 sm:p-8">
          <h1 className="section-title">Dashboard</h1>
          <p className="section-subtitle mt-2">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container-page">
        <div className="surface p-6 sm:p-8">
          <h1 className="section-title">Dashboard</h1>
          <p className="section-subtitle mt-2">
            Please sign in to view your dashboard.
          </p>
          <Link href="/auth" className="btn-primary mt-6">
            Go to sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container-page space-y-6">
      <section className="surface p-6 sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="section-title">
              Welcome, {account?.displayName || user.email || "User"}
            </h1>
            <p className="section-subtitle mt-2">
              Plan: {account?.plan || "free"} · Status:{" "}
              {account?.subscriptionStatus || "free"}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/date/create" className="btn-secondary">
              New date profile
            </Link>
            <Link href="/qr/create" className="btn-primary">
              Create QR
            </Link>
          </div>
        </div>
      </section>

      <section className="card-grid">
        <div className="surface p-5">
          <div className="text-sm text-slate-500">Date profiles</div>
          <div className="mt-2 text-3xl font-semibold">{profiles.length}</div>
        </div>
        <div className="surface p-5">
          <div className="text-sm text-slate-500">QR codes</div>
          <div className="mt-2 text-3xl font-semibold">{qrs.length}</div>
        </div>
        <div className="surface p-5">
          <div className="text-sm text-slate-500">Total scans</div>
          <div className="mt-2 text-3xl font-semibold">{scans.length}</div>
        </div>
      </section>

      <section className="surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">QR Codes</h2>
          <Link href="/qr/create" className="btn-secondary">
            New QR
          </Link>
        </div>

        {qrs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-slate-500">
            No QR codes yet.
          </div>
        ) : (
          <div className="card-grid">
            {qrs.map((qr) => (
              <article key={qr.id} className="surface p-5">
                <div className="text-lg font-semibold text-slate-900">
                  {qr.title}
                </div>
                <div className="mt-2 text-sm text-slate-500">
                  Service: {qr.service}
                </div>
                <div className="mt-3 break-all text-sm text-slate-600">
                  {qr.targetUrl}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href={`/analytics/${qr.id}`} className="btn-ghost">
                    Analytics
                  </Link>
                  <button
                    className="btn-secondary"
                    onClick={async () => {
                      await deleteQRCode(qr.id);
                      setRefreshKey((prev) => prev + 1);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Date Profiles</h2>
          <Link href="/date/create" className="btn-secondary">
            New profile
          </Link>
        </div>

        {profiles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-slate-500">
            No date profiles yet.
          </div>
        ) : (
          <div className="card-grid">
            {profiles.map((profile) => (
              <article key={profile.id} className="surface p-5">
                <div className="text-lg font-semibold text-slate-900">
                  {profile.name}
                </div>
                <div className="mt-2 text-sm text-slate-500">
                  {[profile.age, profile.city].filter(Boolean).join(" • ")}
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  {profile.bio || "No bio yet."}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {profile.interests?.map((interest) => (
                    <span
                      key={interest}
                      className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
                    >
                      {interest}
                    </span>
                  ))}
                </div>

                <div className="mt-5">
                  <Link
                    href={`/date/create?edit=${profile.id}`}
                    className="btn-secondary"
                  >
                    Edit
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
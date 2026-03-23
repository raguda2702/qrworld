"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { listDateProfiles, type DateProfile } from "@/lib/dataStore";

export default function DatePage() {
  const { user, loading } = useAuth();
  const [items, setItems] = useState<DateProfile[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (loading) return;

    let active = true;

    async function load() {
      try {
        if (!user?.uid) {
          if (active) {
            setItems([]);
            setPageLoading(false);
          }
          return;
        }

        const result = await listDateProfiles(user.uid);

        if (active) {
          setItems(result);
        }
      } finally {
        if (active) {
          setPageLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [user?.uid, loading]);

  return (
    <main className="container-page">
      <section className="surface p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="section-title">QR Date</h1>
            <p className="section-subtitle mt-2">
              Create and manage your QR Date profiles.
            </p>
          </div>

          <Link href="/date/create" className="btn-primary">
            New profile
          </Link>
        </div>
      </section>

      <section className="mt-6">
        {pageLoading ? (
          <div className="surface p-6 text-slate-500">Loading profiles...</div>
        ) : items.length === 0 ? (
          <div className="surface p-6">
            <div className="text-lg font-semibold text-slate-900">
              No profiles yet
            </div>
            <p className="mt-2 text-slate-500">
              Create your first QR Date profile to start sharing it with a QR code.
            </p>
            <Link href="/date/create" className="btn-primary mt-5">
              Create first profile
            </Link>
          </div>
        ) : (
          <div className="card-grid">
            {items.map((item) => (
              <article key={item.id} className="surface p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      {item.name}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      {[item.age, item.city].filter(Boolean).join(" • ")}
                    </p>
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {item.visibility}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-700">
                  {item.bio || "No bio yet."}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {item.interests?.length ? (
                    item.interests.map((interest) => (
                      <span
                        key={interest}
                        className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
                      >
                        {interest}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400">No interests</span>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/date/create?edit=${item.id}`}
                    className="btn-secondary"
                  >
                    Edit
                  </Link>

                  <Link
                    href={`/analytics/${item.id}`}
                    className="btn-ghost"
                  >
                    Analytics
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
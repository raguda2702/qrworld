"use client";
import { useEffect, useState } from "react";
import { getScanCountForTarget } from "@/lib/dataStore";

export default function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const [count, setCount] = useState(0);
  const [id, setId] = useState("");
  useEffect(() => {
    params.then(async ({ id }) => {
      setId(id);
      setCount(await getScanCountForTarget(id));
    });
  }, [params]);
  return <div className="container-page max-w-3xl"><div className="surface p-6 sm:p-8"><h1 className="section-title">Analytics</h1><p className="section-subtitle">Target ID: {id || "..."}</p><div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3"><div className="rounded-3xl bg-slate-50 p-4"><div className="text-3xl font-semibold">{count}</div><div className="text-sm text-slate-500">Total scans</div></div><div className="rounded-3xl bg-slate-50 p-4"><div className="text-3xl font-semibold">Demo</div><div className="text-sm text-slate-500">Realtime chart scaffold</div></div><div className="rounded-3xl bg-slate-50 p-4"><div className="text-3xl font-semibold">Ready</div><div className="text-sm text-slate-500">Stage 14 release candidate</div></div></div></div></div>;
}

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getDateProfile, getScanCountForTarget } from "@/lib/dataStore";
import type { DateProfile } from "@/types";

export default function DatePublicClient({ id }: { id: string }) {
  const [profile, setProfile] = useState<DateProfile | null>(null);
  const [scans, setScans] = useState(0);
  useEffect(() => {
    (async () => {
      const item = await getDateProfile(id);
      setProfile(item);
      setScans(await getScanCountForTarget(id));
    })();
  }, [id]);

  if (!profile) return <div className="container-page"><div className="surface p-8">Profile not found.</div></div>;
  return <div className="container-page max-w-3xl"><div className="surface overflow-hidden"><div className="h-40 bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200" /><div className="p-6 sm:p-8"><div className="-mt-16 flex flex-col gap-4 sm:flex-row sm:items-end"><div className="h-28 w-28 rounded-3xl border-4 border-white bg-white shadow">{profile.avatarUrl ? <img src={profile.avatarUrl} alt={profile.name} className="h-full w-full rounded-[20px] object-cover" /> : null}</div><div><h1 className="text-3xl font-semibold tracking-tight">{profile.name}, {profile.age}</h1><div className="mt-1 text-sm text-slate-500">{profile.city}</div></div></div><p className="mt-6 text-slate-700">{profile.bio}</p><div className="mt-4 flex flex-wrap gap-2">{profile.interests.map((interest) => <span key={interest} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{interest}</span>)}</div><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4"><div className="rounded-2xl bg-slate-50 p-4"><div className="text-2xl font-semibold">{scans}</div><div className="text-xs text-slate-500">Scans</div></div><div className="rounded-2xl bg-slate-50 p-4"><div className="text-2xl font-semibold">Public</div><div className="text-xs text-slate-500">Visibility</div></div><div className="rounded-2xl bg-slate-50 p-4"><div className="text-2xl font-semibold">QR</div><div className="text-xs text-slate-500">Connected</div></div><div className="rounded-2xl bg-slate-50 p-4"><div className="text-2xl font-semibold">Live</div><div className="text-xs text-slate-500">Status</div></div></div><div className="mt-6 flex gap-2"><Link href={`/analytics/${profile.id}`} className="btn-secondary">Analytics</Link><Link href={`/date/create?edit=${profile.id}`} className="btn-primary">Edit</Link></div></div></div></div>;
}

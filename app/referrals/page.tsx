import Link from "next/link";
export default function ReferralsPage() {
  return <div className="container-page"><div className="surface p-6 sm:p-8"><h1 className="section-title">Invite friends</h1><p className="section-subtitle">Simple referral scaffold for growth after launch.</p><div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4"><div className="text-sm text-slate-500">Your invite link</div><div className="mt-2 break-all rounded-2xl bg-white p-3 text-sm">https://qrworld.app/invite/your-code</div></div><div className="mt-6 flex gap-3"><button className="btn-primary">Copy link</button><Link href="/dashboard" className="btn-secondary">Back to dashboard</Link></div></div></div>;
}

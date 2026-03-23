"use client";
import { useState } from "react";
import Link from "next/link";
const steps = ["Choose your main service","Create your first public profile","Generate your first QR","Open dashboard and analytics"];
export default function OnboardingPage() {
  const [active, setActive] = useState(0);
  return <div className="container-page"><div className="mb-6"><h1 className="section-title">Welcome to QRWorld</h1><p className="section-subtitle">A short onboarding flow to improve activation.</p></div><div className="surface p-4 sm:p-6"><div className="grid gap-3">{steps.map((step,index)=><button key={step} onClick={()=>setActive(index)} className={`rounded-2xl border p-4 text-left ${active===index?"border-slate-900 bg-slate-50":"border-slate-200 bg-white"}`}><div className="text-xs text-slate-400">Step {index+1}</div><div className="mt-1 font-medium">{step}</div></button>)}</div><div className="mt-6 flex gap-3"><Link href="/date/create" className="btn-primary">Continue</Link><Link href="/dashboard" className="btn-secondary">Skip for now</Link></div></div></div>;
}

"use client";
import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { FormField } from "@/components/ui/FormField";
export default function WaitlistPage() {
  const { push } = useToast();
  const [email, setEmail] = useState("");
  return <div className="container-page max-w-xl"><div className="surface p-6"><h1 className="section-title">Join the waitlist</h1><p className="section-subtitle">Collect interest before opening wider access.</p><div className="mt-6"><FormField label="Email"><input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" /></FormField><button className="btn-primary mt-4" onClick={()=>push("Added to waitlist","success")}>Join waitlist</button></div></div></div>;
}

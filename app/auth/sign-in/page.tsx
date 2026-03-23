"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { FormField } from "@/components/ui/FormField";
import { useToast } from "@/components/ui/Toast";

export default function SignInPage() {
  const { signIn, signInGoogle } = useAuth();
  const { push } = useToast();
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/dashboard";
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState("");
  return <div className="container-page max-w-xl"><div className="surface p-6 sm:p-8"><h1 className="section-title">Sign in</h1><p className="section-subtitle">Access dashboard, analytics and billing.</p><div className="mt-6 grid gap-4"><FormField label="Email"><input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} /></FormField><FormField label="Password" error={error}><input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} /></FormField><button className="btn-primary" onClick={async()=>{try{setError(""); await signIn(email,password); push("Signed in","success"); router.push(next);}catch(e:any){setError(e?.message || "Sign in failed");}}}>Sign in</button><button className="btn-secondary" onClick={async()=>{try{await signInGoogle(); router.push(next);}catch(e:any){setError(e?.message || "Google sign-in failed");}}}>Continue with Google</button></div></div></div>;
}

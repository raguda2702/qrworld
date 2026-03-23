"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";

export function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-page flex items-center justify-between py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">QRWorld</Link>
        <nav className="hidden gap-4 text-sm text-slate-600 sm:flex">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/date/create">Create profile</Link>
          <Link href="/qr/create">Create QR</Link>
          <Link href="/billing">Billing</Link>
          <Link href="/support">Support</Link>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/account" className="btn-secondary">Account</Link>
              <button className="btn-secondary" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/auth/sign-in" className="btn-secondary">Sign in</Link>
              <Link href="/auth/sign-up" className="btn-primary">Get started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

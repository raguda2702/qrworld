"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

export function Header() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    try {
      await signOut();
      router.push("/auth/sign-in");
    } catch (error) {
      console.error("Logout failed", error);
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-page flex items-center justify-between py-3">
        <Link href="/" className="text-lg font-bold text-slate-900">
          QR World
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">
            Dashboard
          </Link>
          <Link href="/qr" className="text-slate-600 hover:text-slate-900">
            QR
          </Link>
          <Link href="/profile" className="text-slate-600 hover:text-slate-900">
            Profile
          </Link>

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-slate-300 px-3 py-2 text-slate-700 hover:bg-slate-50"
            >
              Log out
            </button>
          ) : (
            <Link
              href="/auth/sign-in"
              className="rounded-xl bg-slate-900 px-3 py-2 text-white"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
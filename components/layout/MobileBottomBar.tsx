"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const items = [{ href: "/dashboard", label: "Home" }, { href: "/date/create", label: "Profile" }, { href: "/qr/create", label: "QR" }, { href: "/account", label: "Account" }];
export function MobileBottomBar() {
  const pathname = usePathname();
  return <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur sm:hidden"><div className="grid grid-cols-4">{items.map((item) => <Link key={item.href} href={item.href} className={`flex min-h-16 flex-col items-center justify-center text-xs ${pathname.startsWith(item.href) ? "font-semibold text-slate-900" : "text-slate-500"}`}>{item.label}</Link>)}</div></nav>;
}

import Link from "next/link";
export default function NotFound() {
  return <div className="app-shell"><div className="container-page pt-16"><div className="surface p-8 text-center"><div className="text-5xl font-semibold tracking-tight">404</div><h1 className="mt-3 text-2xl font-semibold">Page not found</h1><p className="mx-auto mt-2 max-w-md text-sm text-slate-500">The page you tried to open does not exist or may have moved.</p><div className="mt-6"><Link href="/" className="btn-primary">Go home</Link></div></div></div></div>;
}

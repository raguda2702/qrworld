export function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string; }) {
  return <div className="touch-card"><div className="text-sm text-slate-500">{label}</div><div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>{hint ? <div className="mt-2 text-xs text-slate-400">{hint}</div> : null}</div>;
}

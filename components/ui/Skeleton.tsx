export function Skeleton({ className = "" }: { className?: string }) { return <div className={`animate-pulse rounded-2xl bg-slate-200/70 ${className}`} />; }
export function CardSkeleton() { return <div className="touch-card"><Skeleton className="h-4 w-24" /><Skeleton className="mt-4 h-8 w-32" /><Skeleton className="mt-3 h-4 w-full" /><Skeleton className="mt-2 h-4 w-3/4" /></div>; }

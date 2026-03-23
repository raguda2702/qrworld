export function EmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode; }) {
  return (
    <div className="surface p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl">∅</div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{body}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

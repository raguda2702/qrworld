"use client";
export function ErrorState({ title = "Something went wrong", body = "Please try again.", retry }: { title?: string; body?: string; retry?: () => void; }) {
  return (
    <div className="surface border-red-100 p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-xl text-red-600">!</div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{body}</p>
      {retry ? <div className="mt-5"><button className="btn-primary" onClick={retry}>Retry</button></div> : null}
    </div>
  );
}

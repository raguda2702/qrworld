"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);

  return (
    <div className="app-shell">
      <div className="container-page pt-16">
        <ErrorState
          title="Something went wrong"
          body={error.message || "A runtime error occurred."}
          retry={reset}
        />
      </div>
    </div>
  );
}
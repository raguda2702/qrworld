"use client";
import { useState } from "react";
export function AsyncButton({ children, onClick, className = "btn-primary", type = "button" }: { children: React.ReactNode; onClick?: () => Promise<void> | void; className?: string; type?: "button" | "submit"; }) {
  const [loading, setLoading] = useState(false);
  return (
    <button
      type={type}
      className={className}
      disabled={loading}
      onClick={async () => {
        if (!onClick) return;
        try { setLoading(true); await onClick(); } finally { setLoading(false); }
      }}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

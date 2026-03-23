"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastTone = "default" | "success" | "error";

type ToastItem = {
  id: number;
  message: string;
  tone?: ToastTone;
};

type ToastContextType = {
  showToast: (message: string, tone?: ToastTone) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, tone: ToastTone = "default") => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setItems((prev) => [...prev, { id, message, tone }]);

    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }, 3000);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed inset-x-0 top-4 z-50 mx-auto flex max-w-md flex-col gap-2 px-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={[
              "rounded-2xl border px-4 py-3 text-sm shadow-lg",
              item.tone === "success" && "border-green-200 bg-green-50 text-green-800",
              item.tone === "error" && "border-red-200 bg-red-50 text-red-800",
              (!item.tone || item.tone === "default") && "border-slate-200 bg-white text-slate-900",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
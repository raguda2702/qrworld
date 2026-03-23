"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

type Props = {
  nextPath: string;
};

export default function DateCreateClient({ nextPath }: Props) {
  const router = useRouter();
  const { showToast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      showToast("Date request created", "success");
      router.push(nextPath);
    } catch (error: any) {
      showToast(error?.message || "Failed to create date request", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-6 text-2xl font-bold">Create date request</h1>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Coffee, walk, dinner..."
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              className="min-h-32 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}
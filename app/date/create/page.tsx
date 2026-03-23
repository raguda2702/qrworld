"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import {
  getDateProfile,
  upsertDateProfile,
} from "@/lib/dataStore";

type Visibility = "public" | "private" | "matches";

type FormState = {
  name: string;
  age: string;
  bio: string;
  city: string;
  interests: string;
  visibility: Visibility;
};

const initialForm: FormState = {
  name: "",
  age: "",
  bio: "",
  city: "",
  interests: "",
  visibility: "public",
};

export default function DateCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  const editId = searchParams.get("edit");
  const isEdit = Boolean(editId);

  const [form, setForm] = useState<FormState>(initialForm);
  const [pageLoading, setPageLoading] = useState<boolean>(Boolean(editId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!editId) return;

    let active = true;

    async function loadProfile() {
      try {
        setPageLoading(true);
        setError("");

        const item = await getDateProfile(editId);

        if (!active) return;

        if (!item) {
          setError("Profile not found.");
          return;
        }

        setForm({
          name: item.name ?? "",
          age: item.age ?? "",
          bio: item.bio ?? "",
          city: item.city ?? "",
          interests: Array.isArray(item.interests)
            ? item.interests.join(", ")
            : "",
          visibility: item.visibility ?? "public",
        });
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load profile.");
      } finally {
        if (active) {
          setPageLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [editId]);

  const parsedInterests = useMemo(() => {
    return form.interests
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }, [form.interests]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user?.uid) {
      setError("You need to sign in first.");
      return;
    }

    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const saved = await upsertDateProfile({
        id: editId || undefined,
        ownerUid: user.uid,
        name: form.name.trim(),
        age: form.age.trim(),
        city: form.city.trim(),
        bio: form.bio.trim(),
        interests: parsedInterests,
        visibility: form.visibility,
      });

      setSuccess(isEdit ? "Profile updated." : "Profile created.");

      router.push(`/dashboard?profile=${saved.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading || pageLoading) {
    return (
      <main className="container-page">
        <div className="surface p-6 sm:p-8">
          <h1 className="section-title">
            {isEdit ? "Edit QR Date profile" : "Create QR Date profile"}
          </h1>
          <p className="section-subtitle mt-2">Loading profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container-page max-w-4xl">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="surface p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="section-title">
              {isEdit ? "Edit QR Date profile" : "Create QR Date profile"}
            </h1>
            <p className="section-subtitle mt-2">
              Build your public dating card for QR sharing.
            </p>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="form-label" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                className="input"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="form-label" htmlFor="age">
                  Age
                </label>
                <input
                  id="age"
                  className="input"
                  value={form.age}
                  onChange={(e) => updateField("age", e.target.value)}
                  placeholder="25"
                />
              </div>

              <div>
                <label className="form-label" htmlFor="city">
                  City
                </label>
                <input
                  id="city"
                  className="input"
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  placeholder="Tashkent"
                />
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="bio">
                Bio
              </label>
              <textarea
                id="bio"
                className="textarea"
                rows={5}
                value={form.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                placeholder="Tell people a little about yourself"
              />
            </div>

            <div>
              <label className="form-label" htmlFor="interests">
                Interests
              </label>
              <input
                id="interests"
                className="input"
                value={form.interests}
                onChange={(e) => updateField("interests", e.target.value)}
                placeholder="music, travel, coffee"
              />
              <p className="mt-2 text-sm text-slate-500">
                Separate interests with commas.
              </p>
            </div>

            <div>
              <label className="form-label" htmlFor="visibility">
                Visibility
              </label>
              <select
                id="visibility"
                className="input"
                value={form.visibility}
                onChange={(e) =>
                  updateField("visibility", e.target.value as Visibility)
                }
              >
                <option value="public">Public</option>
                <option value="matches">Matches only</option>
                <option value="private">Private</option>
              </select>
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="btn-primary"
                disabled={saving}
              >
                {saving
                  ? isEdit
                    ? "Saving..."
                    : "Creating..."
                  : isEdit
                  ? "Save changes"
                  : "Create profile"}
              </button>

              <Link href="/dashboard" className="btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </section>

        <aside className="surface p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900">Preview</h2>

          <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-2xl font-semibold text-slate-900">
              {form.name || "Your name"}
            </div>

            <div className="mt-2 text-sm text-slate-500">
              {[form.age, form.city].filter(Boolean).join(" • ") || "Age • City"}
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-700">
              {form.bio || "Your bio will appear here."}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {parsedInterests.length > 0 ? (
                parsedInterests.map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-400">
                  Interests preview
                </span>
              )}
            </div>

            <div className="mt-5 text-xs font-medium uppercase tracking-wide text-slate-500">
              Visibility: {form.visibility}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
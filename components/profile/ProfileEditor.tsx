"use client";

import { useEffect, useState } from "react";
import { ensureUserProfile, getUserProfile, upsertUserProfile } from "@/lib/dataStore";

interface Props {
  userId: string;
  email?: string | null;
}

export default function ProfileEditor({ userId, email }: Props) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("other");
  const [city, setCity] = useState("");
  const [saved, setSaved] = useState("");

  useEffect(() => {
    const ensured = ensureUserProfile(userId, email ?? undefined);
    const profile = getUserProfile(userId) ?? ensured;
    setName(profile.name ?? "");
    setAge(profile.age ? String(profile.age) : "");
    setBio(profile.bio ?? "");
    setAvatarUrl(profile.avatarUrl ?? "");
    setGender(profile.gender ?? "other");
    setCity(profile.city ?? "");
  }, [userId, email]);

  function onSave() {
    upsertUserProfile({
      id: userId,
      email: email ?? undefined,
      name: name.trim() || "Unnamed user",
      age: age ? Number(age) : undefined,
      bio: bio.trim(),
      avatarUrl: avatarUrl.trim(),
      gender,
      city: city.trim(),
    });

    setSaved("Profile saved");
    setTimeout(() => setSaved(""), 1800);
  }

  return (
    <div className="surface p-6 space-y-4">
      <div>
        <h2 className="text-xl font-semibold">My profile</h2>
        <p className="text-sm text-slate-500">Edit your public QR Date profile.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <div className="text-sm font-medium">Name</div>
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Paul"
          />
        </label>

        <label className="space-y-2">
          <div className="text-sm font-medium">Age</div>
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="27"
            type="number"
          />
        </label>

        <label className="space-y-2">
          <div className="text-sm font-medium">City</div>
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Tashkent"
          />
        </label>

        <label className="space-y-2">
          <div className="text-sm font-medium">Gender</div>
          <select
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            value={gender}
            onChange={(e) => setGender(e.target.value as "male" | "female" | "other")}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>
      </div>

      <label className="space-y-2 block">
        <div className="text-sm font-medium">Avatar URL</div>
        <input
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://..."
        />
      </label>

      <label className="space-y-2 block">
        <div className="text-sm font-medium">Bio</div>
        <textarea
          className="min-h-[120px] w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="A few words about yourself..."
        />
      </label>

      <div className="flex items-center gap-3">
        <button className="btn-primary" onClick={onSave}>
          Save profile
        </button>
        {saved ? <span className="text-sm text-emerald-600">{saved}</span> : null}
      </div>
    </div>
  );
}
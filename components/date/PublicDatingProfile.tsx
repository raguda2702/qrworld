"use client";

import Link from "next/link";
import {
  blockUser,
  createFriendRequest,
  createOrGetDirectChat,
  ensureUserProfile,
  findDirectChat,
  getUserProfile,
  isBlocked,
} from "@/lib/dataStore";
import { useMemo, useState } from "react";

interface Props {
  viewerId?: string | null;
  profileUserId: string;
}

export default function PublicDatingProfile({ viewerId, profileUserId }: Props) {
  const profile = useMemo(() => {
    return getUserProfile(profileUserId) ?? ensureUserProfile(profileUserId);
  }, [profileUserId]);

  const [info, setInfo] = useState("");
  const [requestText, setRequestText] = useState("Hi! I'd like to connect.");
  const [chatId, setChatId] = useState(() =>
    viewerId ? findDirectChat(viewerId, profileUserId)?.id ?? "" : ""
  );

  const ownProfile = viewerId === profileUserId;
  const blocked =
    viewerId ? isBlocked(viewerId, profileUserId) || isBlocked(profileUserId, viewerId) : false;

  function onSendRequest() {
    if (!viewerId) {
      setInfo("Please sign in to send request.");
      return;
    }

    try {
      createFriendRequest({
        fromUserId: viewerId,
        toUserId: profileUserId,
        message: requestText,
      });
      setInfo("Request sent");
    } catch (error) {
      setInfo(error instanceof Error ? error.message : "Failed to send request");
    }
  }

  function onStartChat() {
    if (!viewerId) {
      setInfo("Please sign in first");
      return;
    }

    const chat = createOrGetDirectChat(viewerId, profileUserId);
    setChatId(chat.id);
    setInfo("Chat ready");
  }

  function onBlock() {
    if (!viewerId) {
      setInfo("Please sign in first");
      return;
    }
    blockUser(viewerId, profileUserId);
    setInfo("User blocked");
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="aspect-[4/5] bg-slate-100">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl font-semibold text-slate-300">
              {profile.name?.slice(0, 1)?.toUpperCase() || "U"}
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            {profile.age ? <span className="text-xl text-slate-500">{profile.age}</span> : null}
          </div>

          <div className="mt-1 text-sm text-slate-500">
            {profile.city || "Unknown city"}
          </div>

          <p className="mt-4 text-slate-700">
            {profile.bio || "No bio yet"}
          </p>

          {!ownProfile ? (
            <div className="mt-5 space-y-3">
              {!blocked ? (
                <>
                  <textarea
                    className="min-h-[90px] w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                    value={requestText}
                    onChange={(e) => setRequestText(e.target.value)}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <button className="btn-primary" onClick={onSendRequest}>
                      Send request
                    </button>

                    {chatId ? (
                      <Link href={`/chat/${chatId}`} className="btn-secondary text-center">
                        Open chat
                      </Link>
                    ) : (
                      <button className="btn-secondary" onClick={onStartChat}>
                        Start chat
                      </button>
                    )}
                  </div>

                  <button
                    className="w-full rounded-2xl border border-rose-200 px-4 py-3 text-sm font-medium text-rose-600"
                    onClick={onBlock}
                  >
                    Block user
                  </button>
                </>
              ) : (
                <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-500">
                  Interaction unavailable
                </div>
              )}

              {info ? <div className="text-sm text-slate-500">{info}</div> : null}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
              This is your public profile
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
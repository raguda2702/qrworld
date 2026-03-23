"use client";

import Link from "next/link";
import { getChatsForUser, getUserProfile } from "@/lib/dataStore";

interface Props {
  userId: string;
}

export default function ChatList({ userId }: Props) {
  const chats = getChatsForUser(userId);

  return (
    <div className="surface p-4 md:p-6">
      <h2 className="text-xl font-semibold">Chats</h2>

      <div className="mt-4 space-y-3">
        {chats.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
            No chats yet
          </div>
        ) : (
          chats.map((chat) => {
            const otherId = chat.memberIds.find((id) => id !== userId) || userId;
            const other = getUserProfile(otherId);

            return (
              <Link
                key={chat.id}
                href={`/chat/${chat.id}`}
                className="block rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold">{other?.name || "Unknown user"}</div>
                    <div className="mt-1 text-sm text-slate-500">
                      {chat.lastMessage || "Start conversation"}
                    </div>
                  </div>

                  <div className="text-xs text-slate-400">
                    {chat.lastMessageAt
                      ? new Date(chat.lastMessageAt).toLocaleString()
                      : ""}
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
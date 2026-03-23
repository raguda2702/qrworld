"use client";

import { useMemo, useState } from "react";
import {
  blockUser,
  getChat,
  getChatMessages,
  getUserProfile,
  sendChatMessage,
} from "@/lib/dataStore";
import { useRouter } from "next/navigation";

interface Props {
  chatId: string;
  userId: string;
}

export default function ChatRoom({ chatId, userId }: Props) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [tick, setTick] = useState(0);
  const [error, setError] = useState("");

  const chat = useMemo(() => getChat(chatId), [chatId, tick]);
  const messages = useMemo(() => getChatMessages(chatId), [chatId, tick]);

  if (!chat) {
    return <div className="surface p-6">Chat not found</div>;
  }

  const otherUserId = chat.memberIds.find((id) => id !== userId) || userId;
  const otherProfile = getUserProfile(otherUserId);

  function refresh() {
    setTick((v) => v + 1);
  }

  function onSend() {
    try {
      sendChatMessage({
        chatId,
        senderId: userId,
        text,
      });
      setText("");
      setError("");
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send");
    }
  }

  function onBlock() {
    blockUser(userId, otherUserId);
    router.push("/chat");
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <div className="font-semibold">{otherProfile?.name || "Unknown user"}</div>
          <div className="text-sm text-slate-500">
            {otherProfile?.city || "Direct chat"}
          </div>
        </div>

        <button
          className="rounded-2xl border border-rose-200 px-4 py-2 text-sm text-rose-600"
          onClick={onBlock}
        >
          Block
        </button>
      </div>

      <div className="space-y-3 bg-slate-50 px-4 py-4">
        {messages.length === 0 ? (
          <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-500">
            No messages yet
          </div>
        ) : (
          messages.map((msg) => {
            const mine = msg.senderId === userId;
            return (
              <div
                key={msg.id}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-3xl px-4 py-3 text-sm shadow-sm ${
                    mine ? "bg-slate-900 text-white" : "bg-white text-slate-800"
                  }`}
                >
                  <div>{msg.text}</div>
                  <div
                    className={`mt-2 text-[10px] ${
                      mine ? "text-slate-300" : "text-slate-400"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="border-t border-slate-100 p-4">
        <div className="flex gap-3">
          <input
            className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === "Enter") onSend();
            }}
          />
          <button className="btn-primary" onClick={onSend}>
            Send
          </button>
        </div>

        {error ? <div className="mt-2 text-sm text-rose-600">{error}</div> : null}
      </div>
    </div>
  );
}
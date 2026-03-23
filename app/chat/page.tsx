"use client";

import ChatList from "@/components/chat/ChatList";
import { useAuth } from "@/components/auth/AuthProvider";

export default function ChatPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container-page">
        <div className="surface p-6">
          <h1 className="text-2xl font-semibold">Chats</h1>
          <p className="mt-2 text-slate-500">Please sign in first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page max-w-4xl">
      <div className="mb-6">
        <h1 className="section-title">Chats</h1>
        <p className="section-subtitle">Your active conversations.</p>
      </div>

      <ChatList userId={user.uid} />
    </div>
  );
}
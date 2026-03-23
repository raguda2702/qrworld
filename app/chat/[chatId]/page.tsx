"use client";

import { use, useEffect, useState } from "react";
import ChatRoom from "@/components/chat/ChatRoom";
import { useAuth } from "@/components/auth/AuthProvider";

interface Props { params: Promise<{ chatId: string }>; }

export default function ChatRoomPage({ params }: Props) {
  const resolvedParams = use(params);
  const { user } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => { setReady(true); }, []);

  if (!ready) return <div className="container-page">Loading chat...</div>;
  if (!user) return <div className="container-page"><div className="surface p-6"><h1 className="text-2xl font-semibold">Chat</h1><p className="mt-2 text-slate-500">Please sign in first.</p></div></div>;

  return <div className="container-page max-w-3xl"><ChatRoom chatId={resolvedParams.chatId} userId={user.uid} /></div>;
}

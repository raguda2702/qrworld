"use client";

import Link from "next/link";
import {
  getIncomingFriendRequests,
  getOutgoingFriendRequests,
  getUserProfile,
  respondToFriendRequest,
} from "@/lib/dataStore";
import { useEffect, useState } from "react";

interface Props {
  userId: string;
}

export default function RequestsPanel({ userId }: Props) {
  const [tick, setTick] = useState(0);

  useEffect(() => {}, [tick]);

  const incoming = getIncomingFriendRequests(userId);
  const outgoing = getOutgoingFriendRequests(userId);

  function refresh() {
    setTick((v) => v + 1);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="surface p-6">
        <h2 className="text-xl font-semibold">Incoming requests</h2>
        <div className="mt-4 space-y-4">
          {incoming.length === 0 ? (
            <div className="text-sm text-slate-500">No incoming requests</div>
          ) : (
            incoming.map((req) => {
              const from = getUserProfile(req.fromUserId);
              return (
                <div key={req.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="font-semibold">{from?.name || "Unknown user"}</div>
                  <div className="mt-1 text-sm text-slate-500">{req.message || "No message"}</div>

                  <div className="mt-4 flex gap-2">
                    <button
                      className="btn-primary"
                      onClick={() => {
                        respondToFriendRequest(req.id, "accepted");
                        refresh();
                      }}
                    >
                      Accept
                    </button>

                    <button
                      className="btn-secondary"
                      onClick={() => {
                        respondToFriendRequest(req.id, "declined");
                        refresh();
                      }}
                    >
                      Decline
                    </button>

                    <Link href={`/u/${req.fromUserId}`} className="btn-secondary">
                      View
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="surface p-6">
        <h2 className="text-xl font-semibold">Outgoing requests</h2>
        <div className="mt-4 space-y-4">
          {outgoing.length === 0 ? (
            <div className="text-sm text-slate-500">No outgoing requests</div>
          ) : (
            outgoing.map((req) => {
              const to = getUserProfile(req.toUserId);
              return (
                <div key={req.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="font-semibold">{to?.name || "Unknown user"}</div>
                  <div className="mt-1 text-sm text-slate-500">{req.message || "No message"}</div>
                  <div className="mt-3 text-xs uppercase tracking-wide text-amber-600">
                    Pending
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
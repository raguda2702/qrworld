"use client";

import { use, useEffect, useState } from "react";
import PublicDatingProfile from "@/components/date/PublicDatingProfile";
import { useAuth } from "@/components/auth/AuthProvider";

interface Props {
  params: Promise<{ userId: string }>;
}

export default function PublicUserPage({ params }: Props) {
  const resolvedParams = use(params);
  const { user } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => { setReady(true); }, []);

  if (!ready) return <div className="container-page">Loading profile...</div>;

  return (
    <div className="container-page">
      <PublicDatingProfile viewerId={user?.uid ?? null} profileUserId={resolvedParams.userId} />
    </div>
  );
}

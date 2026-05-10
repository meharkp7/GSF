"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, PlayCircle } from "lucide-react";

type SessionData = {
  id: string;
  founderName: string;
  expertName: string;
  ventureName: string;
  scheduledAt: string;
};

export default function SessionRecordingPage() {
  const params = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<SessionData | null>(null);

  useEffect(() => {
    async function loadSession() {
      const res = await fetch(`/api/sessions/${params.sessionId}`);
      if (!res.ok) return;
      setSession(await res.json());
    }

    if (params.sessionId) loadSession();
  }, [params.sessionId]);

  return (
    <main className="min-h-screen bg-[#FDFAF7] px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Link href={`/session-room/${params.sessionId}`} className="inline-flex items-center gap-2 text-sm text-[#4A5668] mb-6 hover:text-[#1A2332]">
          <ArrowLeft className="size-3.5" /> Back to room
        </Link>

        <div className="card p-6 space-y-5">
          <div>
            <span className="badge badge-teal text-xs mb-3 inline-flex">Session recording</span>
            <h1 className="text-2xl font-bold text-[#1A2332]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Recording playback
            </h1>
            <p className="text-sm text-[#4A5668] mt-2">
              {session ? `${session.founderName} · ${session.expertName}` : "Session archive"}
            </p>
          </div>

          <div className="rounded-2xl border border-dashed border-[#D2C4B4] bg-white p-8 text-center space-y-3">
            <PlayCircle className="size-14 mx-auto text-[#81A6C6]" />
            <h2 className="text-lg font-semibold text-[#1A2332]">Recording ready</h2>
            <p className="text-sm text-[#4A5668] max-w-lg mx-auto">
              This page acts as the generated recording link for the session. In a production integration, this is where the Zoom/Loom replay would be mounted.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Camera, CirclePlay, Video } from "lucide-react";

type SessionData = {
  id: string;
  founderName: string;
  expertName: string;
  ventureName: string;
  scheduledAt: string;
  meetingUrl?: string;
  recordingUrl?: string;
};

export default function SessionRoomPage() {
  const params = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    async function loadSession() {
      try {
        setLoading(true);
        const res = await fetch(`/api/sessions/${params.sessionId}`);
        if (!res.ok) throw new Error("Failed to load session");
        const data = await res.json();
        setSession(data);
      } catch {
        setSession(null);
      } finally {
        setLoading(false);
      }
    }

    if (params.sessionId) loadSession();
  }, [params.sessionId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-[#4A5668]">Loading session room…</div>;
  }

  if (!session) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-[#4A5668]">Session not found.</div>;
  }

  return (
    <main className="min-h-screen bg-[#FDFAF7] px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/connect" className="inline-flex items-center gap-2 text-sm text-[#4A5668] mb-6 hover:text-[#1A2332]">
          <ArrowLeft className="size-3.5" /> Back to Connect
        </Link>

        <div className="card p-6 space-y-5">
          <div>
            <span className="badge badge-blue text-xs mb-3 inline-flex">Live session room</span>
            <h1 className="text-2xl font-bold text-[#1A2332]" style={{ fontFamily: "'Playfair Display', serif" }}>
              {session.founderName} · {session.expertName}
            </h1>
            <p className="text-sm text-[#4A5668] mt-2">
              {session.ventureName} · {new Date(session.scheduledAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
            </p>
          </div>

          <div className="rounded-2xl border border-[#AACDDC] bg-[#EEF4F9] p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-[#1A2332]">
              <Video className="size-4 text-[#81A6C6]" />
              Meeting link generated automatically
            </div>
            <p className="text-sm text-[#4A5668]">
              This room is the shared call space for the booked session. You can use it as the meeting link and hand it off to any external call provider later.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href={`/api/sessions/${session.id}`} className="btn-outline text-sm py-2 px-4">
                Open session data
              </Link>
              <button onClick={() => setRecording(true)} className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
                <CirclePlay className="size-3.5" /> Start recording
              </button>
              {session.recordingUrl && (
                <Link href={session.recordingUrl} className="btn-outline text-sm py-2 px-4 flex items-center gap-1.5">
                  <Camera className="size-3.5" /> View recording
                </Link>
              )}
            </div>
            {recording && (
              <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                Recording started. The recording page is ready at <span className="font-medium">{session.recordingUrl}</span>.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
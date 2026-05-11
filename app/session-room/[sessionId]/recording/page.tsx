"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Pause, Play, RotateCcw, SkipBack, SkipForward, Star, Volume2, SquarePlay } from "lucide-react";

type SessionData = {
  id: string;
  founderName: string;
  expertName: string;
  ventureName: string;
  scheduledAt: string;
  meetingUrl?: string;
  recordingUrl?: string;
  status?: string;
  feedbackRating?: number | null;
  feedbackNotes?: string | null;
};

type Cue = {
  at: number;
  title: string;
  note: string;
};

const DURATION = 28 * 60;

const CUES: Cue[] = [
  { at: 40, title: "Warm-up", note: "Introductions and session goals" },
  { at: 310, title: "Core review", note: "Problem framing and customer insights" },
  { at: 760, title: "Advice", note: "Founder-specific action items" },
  { at: 1320, title: "Wrap-up", note: "Decisions and next steps" },
];

function formatTime(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safe / 60);
  const remaining = safe % 60;
  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}

export default function SessionRecordingPage() {
  const params = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const progress = useMemo(() => (currentTime / DURATION) * 100, [currentTime]);
  const activeCue = useMemo(() => [...CUES].reverse().find((cue) => currentTime >= cue.at) ?? CUES[0], [currentTime]);

  useEffect(() => {
    async function loadSession() {
      try {
        setLoading(true);
        const res = await fetch(`/api/sessions/${params.sessionId}`);
        if (!res.ok) throw new Error("Failed to load session");
        setSession(await res.json());
      } catch {
        setSession(null);
      } finally {
        setLoading(false);
      }
    }

    if (params.sessionId) loadSession();
  }, [params.sessionId]);

  useEffect(() => {
    if (!playing) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentTime((value) => {
        const next = value + playbackRate;
        if (next >= DURATION) {
          setPlaying(false);
          return DURATION;
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [playing, playbackRate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-[#4A5668]">Loading recording…</div>;
  }

  if (!session) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-[#4A5668]">Recording not found.</div>;
  }

  async function seekTo(percent: number) {
    const nextTime = Math.max(0, Math.min(DURATION, (percent / 100) * DURATION));
    setCurrentTime(nextTime);
  }

  return (
    <main className="min-h-screen bg-[#FDFAF7] px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link href={`/session-room/${params.sessionId}`} className="inline-flex items-center gap-2 text-sm text-[#4A5668] mb-2 hover:text-[#1A2332]">
          <ArrowLeft className="size-3.5" /> Back to room
        </Link>

        <div className="card p-6 space-y-6">
          <div>
            <span className="badge badge-teal text-xs mb-3 inline-flex">Session recording</span>
            <h1 className="text-2xl font-bold text-[#1A2332]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Recording playback
            </h1>
            <p className="text-sm text-[#4A5668] mt-2">
              {session.founderName} · {session.expertName} · {session.ventureName}
            </p>
          </div>

          <div className="rounded-3xl border border-[#AACDDC] bg-gradient-to-br from-[#EEF4F9] to-white p-5 space-y-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="text-sm font-medium text-[#1A2332]">Playback console</p>
                <p className="text-xs text-[#4A5668]">Use the controls below to review the session timeline.</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#4A5668]">
                <span className="badge badge-blue text-[10px]">{session.status || "completed"}</span>
                {session.feedbackRating ? <span className="badge badge-live text-[10px] flex items-center gap-1"><Star className="size-3" /> {session.feedbackRating}/5</span> : null}
              </div>
            </div>

            <div className="rounded-2xl bg-[#1A2332] text-white p-5 space-y-5 shadow-[0_20px_80px_rgba(26,35,50,0.18)]">
              <div className="flex items-center justify-between text-xs text-white/70">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(DURATION)}</span>
              </div>

              <div className="h-56 rounded-2xl bg-[radial-gradient(circle_at_top,rgba(129,166,198,0.28),transparent_55%),linear-gradient(135deg,rgba(34,45,66,1),rgba(26,35,50,1))] border border-white/10 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.05),transparent)] animate-pulse" />
                <div className="relative text-center space-y-3">
                  <div className="size-20 rounded-full mx-auto flex items-center justify-center bg-white/10 border border-white/15 backdrop-blur-sm">
                    <SquarePlay className="size-10 text-[#81A6C6]" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{playing ? "Playing session replay" : "Paused recording"}</p>
                    <p className="text-sm text-white/70">{activeCue.title} · {activeCue.note}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={progress}
                  onChange={(event) => void seekTo(Number(event.target.value))}
                  className="w-full accent-[#81A6C6]"
                />
                <div className="flex items-center justify-between gap-2 flex-wrap text-sm">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentTime((value) => Math.max(0, value - 15))} className="size-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center">
                      <SkipBack className="size-4" />
                    </button>
                    <button onClick={() => setPlaying((value) => !value)} className="size-12 rounded-full bg-[#81A6C6] text-white hover:opacity-90 transition-colors flex items-center justify-center">
                      {playing ? <Pause className="size-5" /> : <Play className="size-5 ml-0.5" />}
                    </button>
                    <button onClick={() => setCurrentTime((value) => Math.min(DURATION, value + 15))} className="size-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center">
                      <SkipForward className="size-4" />
                    </button>
                    <button onClick={() => { setCurrentTime(0); setPlaying(false); }} className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors inline-flex items-center gap-2">
                      <RotateCcw className="size-3.5" /> Restart
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {[1, 1.25, 1.5].map((rate) => (
                      <button key={rate} onClick={() => setPlaybackRate(rate)} className={`px-3 py-2 rounded-full transition-colors ${playbackRate === rate ? "bg-[#81A6C6] text-white" : "bg-white/10 hover:bg-white/20"}`}>
                        {rate}x
                      </button>
                    ))}
                    <div className="px-3 py-2 rounded-full bg-white/10 inline-flex items-center gap-2 text-white/80">
                      <Volume2 className="size-4" /> Audio on
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 rounded-2xl border border-[#D2C4B4] bg-white p-5 space-y-4">
                <h2 className="text-lg font-semibold text-[#1A2332]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Playback timeline
                </h2>
                <div className="space-y-3">
                  {CUES.map((cue) => {
                    const active = currentTime >= cue.at;
                    return (
                      <button key={cue.title} onClick={() => void seekTo((cue.at / DURATION) * 100)} className={`w-full text-left p-4 rounded-2xl border transition-all ${active ? "border-[#81A6C6] bg-[#EEF4F9]" : "border-[#E8DDD2] bg-white hover:bg-[#FCFAF8]"}`}>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-[#1A2332]">{cue.title}</p>
                            <p className="text-xs text-[#4A5668] mt-1">{cue.note}</p>
                          </div>
                          <span className="text-xs font-medium text-[#81A6C6]">{formatTime(cue.at)}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-[#D2C4B4] bg-white p-5 space-y-4">
                <h2 className="text-lg font-semibold text-[#1A2332]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Session outcome
                </h2>
                <p className="text-sm text-[#4A5668]">The outcome summary from the backend reflects the final review and notes.</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[#4A5668]">Status</span>
                    <span className="badge badge-live text-xs">{session.status || "completed"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#4A5668]">Rating</span>
                    <span className="font-semibold text-[#1A2332]">{session.feedbackRating ? `${session.feedbackRating}/5` : "No rating yet"}</span>
                  </div>
                </div>
                {session.feedbackNotes ? (
                  <div className="rounded-2xl bg-[#FDFAF7] border border-[#E8DDD2] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#8A95A3] mb-2">Notes</p>
                    <p className="text-sm text-[#1A2332] whitespace-pre-wrap leading-relaxed">{session.feedbackNotes}</p>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-[#FDFAF7] border border-dashed border-[#E8DDD2] p-4 text-sm text-[#4A5668]">
                    No written feedback yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

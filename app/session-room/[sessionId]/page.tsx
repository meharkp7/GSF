"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Camera, CirclePlay, Video, Star } from "lucide-react";
import { toast } from "sonner";

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
  feedbackCreatedAt?: string | null;
};

export default function SessionRoomPage() {
  const params = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [markingComplete, setMarkingComplete] = useState(false);

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

  async function handleSubmitFeedback(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSubmittingFeedback(true);
    try {
      await fetch(`/api/sessions/${params.sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      }).catch(() => {});

      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: params.sessionId,
          rating,
          feedback,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to submit feedback");
      }

      toast.success("Feedback submitted! Thank you for reviewing.");
      setSession((current) => current ? {
        ...current,
        status: "completed",
        feedbackRating: rating,
        feedbackNotes: feedback,
        feedbackCreatedAt: new Date().toISOString(),
      } : current);
      setRating(0);
      setFeedback("");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit feedback");
    } finally {
      setSubmittingFeedback(false);
    }
  }

  async function handleMarkComplete() {
    setMarkingComplete(true);
    try {
      const res = await fetch(`/api/sessions/${params.sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update session status");
      }

      const updated = await res.json();
      setSession((current) => current ? { ...current, status: updated.status, feedbackRating: current.feedbackRating, feedbackNotes: current.feedbackNotes } : current);
      toast.success("Session marked as completed");
    } catch (err: any) {
      toast.error(err.message || "Could not update session status");
    } finally {
      setMarkingComplete(false);
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-[#4A5668]">Loading session room…</div>;
  }

  if (!session) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-[#4A5668]">Session not found.</div>;
  }

  return (
    <main className="min-h-screen bg-[#FDFAF7] px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
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
              <button onClick={handleMarkComplete} disabled={markingComplete} className="btn-outline text-sm py-2 px-4">
                {markingComplete ? "Saving…" : "Mark complete"}
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

        {session.feedbackRating ? (
          <div className="card p-6 space-y-3">
            <h2 className="text-lg font-semibold text-[#1A2332]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Session outcome
            </h2>
            <div className="flex items-center gap-2 text-sm text-[#4A5668]">
              <span className="badge badge-live text-xs">{session.feedbackRating}/5 stars</span>
              {session.feedbackCreatedAt && <span>Reviewed on {new Date(session.feedbackCreatedAt).toLocaleDateString()}</span>}
            </div>
            {session.feedbackNotes && (
              <p className="text-sm text-[#1A2332] leading-relaxed whitespace-pre-wrap">{session.feedbackNotes}</p>
            )}
          </div>
        ) : null}

        {/* Feedback form */}
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[#1A2332]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Share feedback
          </h2>
          <p className="text-sm text-[#4A5668]">
            Help us improve by rating your experience with {session.expertName}.
          </p>
          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1A2332] mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-all"
                  >
                    <Star
                      className={`size-6 ${
                        star <= rating
                          ? "fill-[#81A6C6] text-[#81A6C6]"
                          : "text-[#D2C4B4]"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A2332] mb-2">
                Feedback (optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us about your session experience..."
                rows={4}
                className="w-full rounded-lg border border-[#D2C4B4] bg-white px-3 py-2 text-sm text-[#1A2332] placeholder-[#4A5668] focus:outline-none focus:ring-2 focus:ring-[#81A6C6]"
              />
            </div>

            <button
              type="submit"
              disabled={submittingFeedback}
              className="btn-primary w-full py-2 text-sm"
            >
              {submittingFeedback ? "Submitting..." : "Submit feedback"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sessions, sessionFeedback } from "@/lib/schema";
import { eq } from "drizzle-orm";

const DEMO_SESSIONS: Record<string, Record<string, unknown>> = {
  "demo-1": {
    id: "demo-1",
    founderName: "Arjun Sharma",
    expertName: "Dr. Anika Patel",
    ventureName: "EduLoop",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    meetingUrl: "/session-room/demo-1",
    recordingUrl: "/session-room/demo-1/recording",
  },
  "demo-2": {
    id: "demo-2",
    founderName: "Priya Mehta",
    expertName: "James Whitfield",
    ventureName: "Supplify",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 25).toISOString(),
    meetingUrl: "/session-room/demo-2",
    recordingUrl: "/session-room/demo-2/recording",
  },
  "demo-3": {
    id: "demo-3",
    founderName: "Rahul Kumar",
    expertName: "Sara Mensah",
    ventureName: "HealthBridge",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString(),
    meetingUrl: "/session-room/demo-3",
    recordingUrl: "/session-room/demo-3/recording",
  },
};

export async function GET(_: Request, context: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await context.params;

  if (sessionId.startsWith("demo-") && DEMO_SESSIONS[sessionId]) {
    return NextResponse.json(DEMO_SESSIONS[sessionId]);
  }

  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (rows.length === 0) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const session = rows[0];
  if (session.founderClerkId !== userId && session.expertClerkId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [feedback] = await db
    .select()
    .from(sessionFeedback)
    .where(eq(sessionFeedback.sessionId, sessionId as any))
    .limit(1);

  return NextResponse.json({
    ...session,
    meetingUrl: session.meetingUrl || `/session-room/${session.id}`,
    recordingUrl: session.recordingUrl || `/session-room/${session.id}/recording`,
    feedbackRating: feedback?.rating ?? null,
    feedbackNotes: feedback?.feedback ?? null,
    feedbackCreatedAt: feedback?.createdAt ?? null,
  });
}

export async function PATCH(req: Request, context: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await context.params;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.founderClerkId !== userId && session.expertClerkId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const status = typeof body.status === "string" ? body.status : null;

  if (!status || !["pending", "confirmed", "completed", "cancelled"].includes(status)) {
    return NextResponse.json({ error: "status is required and must be valid" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {
    status,
    updatedAt: new Date(),
  };

  if (status === "completed") {
    updates.recordingReadyAt = new Date();
  }

  const [updated] = await db
    .update(sessions)
    .set(updates)
    .where(eq(sessions.id, sessionId))
    .returning();

  return NextResponse.json(updated);
}
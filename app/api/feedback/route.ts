import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sessionFeedback, sessions } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { sessionId, rating, feedback } = body;

  if (!sessionId || typeof sessionId !== "string") {
    return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
  }

  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "rating must be 1-5" }, { status: 400 });
  }

  // Verify session exists and user is the founder
  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.founderClerkId !== userId) {
    return NextResponse.json(
      { error: "Only the founder can leave feedback" },
      { status: 403 }
    );
  }

  // Check if feedback already exists for this session
  const [existing] = await db
    .select()
    .from(sessionFeedback)
    .where(eq(sessionFeedback.sessionId, sessionId))
    .limit(1);

  if (existing) {
    return NextResponse.json(
      { error: "Feedback already submitted for this session" },
      { status: 409 }
    );
  }

  try {
    const [created] = await db
      .insert(sessionFeedback)
      .values({
        sessionId: sessionId as any,
        founderClerkId: userId,
        expertClerkId: session.expertClerkId,
        rating,
        feedback: feedback || "",
      })
      .returning();

    await db
      .update(sessions)
      .set({
        status: "completed",
        recordingReadyAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(sessions.id, sessionId));

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("Failed to submit feedback", err);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}

// GET feedback for a session or expert
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const expertClerkId = searchParams.get("expertClerkId");

  if (sessionId) {
    const rows = await db
      .select()
      .from(sessionFeedback)
      .where(eq(sessionFeedback.sessionId, sessionId as any));
    return NextResponse.json(rows);
  }

  if (expertClerkId) {
    const rows = await db
      .select()
      .from(sessionFeedback)
      .where(eq(sessionFeedback.expertClerkId, expertClerkId));

    // Calculate average rating
    const avgRating =
      rows.length > 0
        ? (rows.reduce((sum, r) => sum + r.rating, 0) / rows.length).toFixed(1)
        : 0;

    return NextResponse.json({
      feedback: rows,
      averageRating: avgRating,
      totalReviews: rows.length,
    });
  }

  return NextResponse.json({ error: "sessionId or expertClerkId required" }, { status: 400 });
}

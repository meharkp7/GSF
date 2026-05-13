// app/api/sessions/route.ts
// GET  → return sessions for logged-in user (as founder or expert)
// POST → book a session; atomically checks and deducts founder credits

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sessions, sessionFeedback } from "@/lib/schema";
import { eq, or, desc } from "drizzle-orm";
import { users, notifications } from "@/lib/schema";
import { sendEmail } from "@/lib/email";
import {
  deductCredits,
  InsufficientCreditsError,
} from "@/lib/credits-server";
import {
  ApiRouteError,
  errorResponse,
  parseJsonBody,
  withRouteErrorHandling,
} from "@/lib/api/route-helpers";
import { sessionsPostSchema } from "@/lib/validators/api-routes";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return errorResponse(401, "Unauthorized", { code: "UNAUTHORIZED" });

  const rows = await db
    .select()
    .from(sessions)
    .where(
      or(
        eq(sessions.founderClerkId, userId),
        eq(sessions.expertClerkId, userId)
      )
    )
    .orderBy(desc(sessions.scheduledAt));

  const feedbackRows = await db
    .select()
    .from(sessionFeedback)
    .where(or(eq(sessionFeedback.founderClerkId, userId), eq(sessionFeedback.expertClerkId, userId)));

  const feedbackBySession = new Map(
    feedbackRows.map((feedback) => [feedback.sessionId, feedback])
  );

  return NextResponse.json(
    rows.map((session) => {
      const feedback = feedbackBySession.get(session.id);
      return {
        ...session,
        feedbackRating: feedback?.rating ?? null,
        feedbackNotes: feedback?.feedback ?? null,
        feedbackCreatedAt: feedback?.createdAt ?? null,
      };
    })
  );
}

export const POST = withRouteErrorHandling(async (req: Request) => {
  const { userId } = await auth();
  if (!userId) return errorResponse(401, "Unauthorized", { code: "UNAUTHORIZED" });

  const body = await parseJsonBody(req, sessionsPostSchema);
  const { expertClerkId, scheduledAt, duration, creditsCost, creditsEarned } = body;

  if (new Date(scheduledAt) <= new Date()) {
    throw new ApiRouteError(400, "scheduledAt must be in the future", {
      code: "VALIDATION_ERROR",
      fieldErrors: { scheduledAt: ["scheduledAt must be in the future"] },
    });
  }
  if (expertClerkId === userId) {
    throw new ApiRouteError(400, "Cannot book a session with yourself", {
      code: "VALIDATION_ERROR",
      fieldErrors: { expertClerkId: ["Cannot book a session with yourself"] },
    });
  }

  const cost = creditsCost;
  const earned = creditsEarned;
  const dur = duration;

  // ── Step 1: Insert the session row (status = "pending") ─────────────────
  // We insert first so we have a session ID to attach to the credit transaction.
  // If the credit deduction fails we roll back the session insert via the
  // compensating delete below.
  let created;
  try {
    [created] = await db
      .insert(sessions)
      .values({
        founderClerkId: userId,
        expertClerkId,
        founderName: body.founderName,
        expertName: body.expertName,
        ventureName: body.ventureName,
        scheduledAt:    new Date(scheduledAt),
        duration:       dur,
        creditsCost:    cost,
        creditsEarned:  earned,
        status:         "pending",
      })
      .returning();

    const meetingUrl = `/session-room/${created.id}`;
    const recordingUrl = `/session-room/${created.id}/recording`;

    [created] = await db
      .update(sessions)
      .set({
        meetingUrl,
        recordingUrl,
        recordingReadyAt: null,
        updatedAt: new Date(),
      })
      .where(eq(sessions.id, created.id))
      .returning();
  } catch {
    return errorResponse(500, "Failed to create session", { code: "SESSION_CREATE_FAILED" });
  }

  // ── Step 2: Atomically deduct credits ───────────────────────────────────
  // If this fails the session row is deleted so no orphaned session exists.
  try {
    await deductCredits({
      clerkUserId:      userId,
      amount:           cost,
      reason:           `Session booked with expert ${expertClerkId}`,
      relatedSessionId: created.id,
    });
  } catch (err) {
    // Compensate: remove the session we just inserted
    await db.delete(sessions).where(eq(sessions.id, created.id)).catch(() => {});

    if (err instanceof InsufficientCreditsError) {
      return errorResponse(402, "Insufficient credits", { code: "INSUFFICIENT_CREDITS" });
    }

    return errorResponse(500, "Credit deduction failed. Please try again.", { code: "CREDIT_DEDUCTION_FAILED" });
  }

  // ── Send confirmation emails (non-blocking)
  (async () => {
    try {
      const [founder] = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
      const [expert] = await db.select().from(users).where(eq(users.clerkId, expertClerkId)).limit(1);

      const meetingUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ""}${created.meetingUrl || `/session-room/${created.id}`}`;

      const subject = "Your session is booked";
      const text = `Your session with ${created.expertName || "an expert"} is scheduled at ${new Date(created.scheduledAt).toLocaleString()}. Join: ${meetingUrl}`;

      if (founder?.email) {
        await sendEmail({ to: founder.email, subject, text });
        await db.insert(notifications).values({
          sessionId: created.id,
          toEmail: founder.email,
          type: "booking_confirmation",
          status: "sent",
          payload: { role: "founder" },
          sentAt: new Date(),
        }).catch(() => {});
      }

      if (expert?.email) {
        await sendEmail({ to: expert.email, subject: `New session booked by ${created.founderName || "a founder"}`, text });
        await db.insert(notifications).values({
          sessionId: created.id,
          toEmail: expert.email,
          type: "booking_confirmation",
          status: "sent",
          payload: { role: "expert" },
          sentAt: new Date(),
        }).catch(() => {});
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Email send failed", e);
    }
  })();

  return NextResponse.json(created, { status: 201 });
});

// app/api/sessions/route.ts
// GET  → return sessions for logged-in user (as founder or expert)
// POST → book a session; atomically checks and deducts founder credits

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sessions } from "@/lib/schema";
import { eq, or, desc } from "drizzle-orm";
import {
  deductCredits,
  InsufficientCreditsError,
} from "@/lib/credits-server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // ── Input validation ────────────────────────────────────────────────────
  const { expertClerkId, scheduledAt, duration, creditsCost, creditsEarned } = body;

  if (!expertClerkId || typeof expertClerkId !== "string") {
    return NextResponse.json({ error: "expertClerkId is required" }, { status: 400 });
  }
  if (!scheduledAt || isNaN(Date.parse(scheduledAt))) {
    return NextResponse.json({ error: "scheduledAt must be a valid ISO date" }, { status: 400 });
  }
  if (new Date(scheduledAt) <= new Date()) {
    return NextResponse.json({ error: "scheduledAt must be in the future" }, { status: 400 });
  }
  if (expertClerkId === userId) {
    return NextResponse.json({ error: "Cannot book a session with yourself" }, { status: 400 });
  }

  const cost    = typeof creditsCost   === "number" && creditsCost   > 0 ? creditsCost   : 100;
  const earned  = typeof creditsEarned === "number" && creditsEarned > 0 ? creditsEarned : 80;
  const dur     = typeof duration      === "number" && duration      > 0 ? duration      : 30;

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
        founderName:    body.founderName  ?? "",
        expertName:     body.expertName   ?? "",
        ventureName:    body.ventureName  ?? "",
        scheduledAt:    new Date(scheduledAt),
        duration:       dur,
        creditsCost:    cost,
        creditsEarned:  earned,
        status:         "pending",
      })
      .returning();
  } catch {
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 },
    );
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
      return NextResponse.json(
        {
          error:    "Insufficient credits",
          required: err.required,
          current:  err.current,
        },
        { status: 402 },
      );
    }

    return NextResponse.json(
      { error: "Credit deduction failed. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json(created, { status: 201 });
}

import { NextResponse } from "next/server";
import { and, desc, eq, gte, lt, gt } from "drizzle-orm";
import { db } from "@/lib/db";
import { availabilitySlots } from "@/lib/schema";
import {
  parseJsonBody,
  parseQuery,
  requireAuth,
  requireRole,
  withRouteErrorHandling,
  ApiRouteError,
} from "@/lib/api/route-helpers";
import {
  expertAvailabilityQuerySchema,
  expertAvailabilityPostSchema,
  expertAvailabilityPatchSchema,
  expertAvailabilityDeleteSchema,
} from "@/lib/validators/api-routes";

const DEMO_SLOTS = [
  {
    expertClerkId: "demo-anika",
    expertName: "Dr. Anika Patel",
    startAt: new Date(Date.now() + 1000 * 60 * 60 * 26),
    endAt: new Date(Date.now() + 1000 * 60 * 60 * 27),
    timezone: "Asia/Kolkata",
    notes: "Fundraising office hours",
  },
  {
    expertClerkId: "demo-james",
    expertName: "James Whitfield",
    startAt: new Date(Date.now() + 1000 * 60 * 60 * 30),
    endAt: new Date(Date.now() + 1000 * 60 * 60 * 31),
    timezone: "Asia/Kolkata",
    notes: "Fintech scaling session",
  },
  {
    expertClerkId: "demo-yuki",
    expertName: "Yuki Tanaka",
    startAt: new Date(Date.now() + 1000 * 60 * 60 * 34),
    endAt: new Date(Date.now() + 1000 * 60 * 60 * 35),
    timezone: "Asia/Kolkata",
    notes: "PLG review slot",
  },
];

export const GET = withRouteErrorHandling(async (req: Request) => {
  const query = parseQuery(req, expertAvailabilityQuerySchema);
  const { expertId, mine } = query;

  if (mine) {
    const userId = await requireAuth();

    const rows = await db
      .select()
      .from(availabilitySlots)
      .where(eq(availabilitySlots.expertClerkId, userId))
      .orderBy(desc(availabilitySlots.startAt));

    return NextResponse.json(rows);
  }

  if (expertId) {
    const rows = await db
      .select()
      .from(availabilitySlots)
      .where(
        and(
          eq(availabilitySlots.expertClerkId, expertId),
          gte(availabilitySlots.startAt, new Date())
        )
      )
      .orderBy(availabilitySlots.startAt);

    return NextResponse.json(rows);
  }

  const rows = await db
    .select()
    .from(availabilitySlots)
    .where(
      and(
        eq(availabilitySlots.isBooked, false),
        gte(availabilitySlots.startAt, new Date())
      )
    )
    .orderBy(availabilitySlots.startAt);

  if (rows.length === 0) {
    return NextResponse.json(DEMO_SLOTS);
  }

  return NextResponse.json(rows);
});

export const POST = withRouteErrorHandling(async (req: Request) => {
  const user = await requireRole("expert");
  const body = await parseJsonBody(req, expertAvailabilityPostSchema);

  const startAt = new Date(body.startAt);
  const endAt = new Date(body.endAt);

  if (endAt <= startAt) {
    throw new ApiRouteError(400, "Invalid slot time range: end time must be after start time");
  }

  // Prevent overlapping slots for the same expert
  const overlapping = await db
    .select()
    .from(availabilitySlots)
    .where(
      and(
        eq(availabilitySlots.expertClerkId, user.clerkId),
        lt(availabilitySlots.startAt, endAt),
        gt(availabilitySlots.endAt, startAt)
      )
    )
    .limit(1);

  if (overlapping.length > 0) {
    throw new ApiRouteError(409, "Overlapping slot exists");
  }

  // Support simple recurrence: daily or weekly
  const createdRows: any[] = [];
  const recurrence = body.recurrence;
  if (recurrence && (recurrence.freq === "daily" || recurrence.freq === "weekly")) {
    const freq = recurrence.freq === "daily" ? 1 : 7;
    const maxCount = Math.min(recurrence.count ?? 8, 52);
    let occurrenceStart = new Date(startAt);
    let occurrenceEnd = new Date(endAt);

    for (let i = 0; i < maxCount; i++) {
      // stop if until is set and we passed it
      if (recurrence.until) {
        const untilDate = new Date(recurrence.until);
        if (Number.isFinite(untilDate.getTime()) && occurrenceStart > untilDate) break;
      }

      // check overlapping for this occurrence
      // eslint-disable-next-line no-await-in-loop
      const overlap = await db
        .select()
        .from(availabilitySlots)
        .where(
          and(
            eq(availabilitySlots.expertClerkId, user.clerkId),
            lt(availabilitySlots.startAt, occurrenceEnd),
            gt(availabilitySlots.endAt, occurrenceStart)
          )
        )
        .limit(1);

      if (overlap.length > 0) {
        // skip this occurrence
      } else {
        // eslint-disable-next-line no-await-in-loop
        const [row] = await db
          .insert(availabilitySlots)
          .values({
            expertClerkId: user.clerkId,
            expertName: user.name || "Expert",
            startAt: new Date(occurrenceStart),
            endAt: new Date(occurrenceEnd),
            timezone: body.timezone || "UTC",
            notes: body.notes || "",
            isBooked: false,
          })
          .returning();

        if (row) createdRows.push(row);
      }

      // advance
      occurrenceStart = new Date(occurrenceStart.getTime() + freq * 24 * 60 * 60 * 1000);
      occurrenceEnd = new Date(occurrenceEnd.getTime() + freq * 24 * 60 * 60 * 1000);
    }

    return NextResponse.json(createdRows, { status: 201 });
  }

  const [created] = await db
    .insert(availabilitySlots)
    .values({
      expertClerkId: user.clerkId,
      expertName: user.name || "Expert",
      startAt,
      endAt,
      timezone: body.timezone || "UTC",
      notes: body.notes || "",
      isBooked: false,
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
});

export const PATCH = withRouteErrorHandling(async (req: Request) => {
  const userId = await requireAuth();
  const body = await parseJsonBody(req, expertAvailabilityPatchSchema);

  const [updated] = await db
    .update(availabilitySlots)
    .set({
      isBooked: true,
      bookedByClerkId: userId,
      bookedSessionId: body.sessionId,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(availabilitySlots.id, body.slotId),
        eq(availabilitySlots.isBooked, false)
      )
    )
    .returning();

  if (!updated) {
    throw new ApiRouteError(409, "Slot not found or already booked");
  }

  return NextResponse.json(updated);
});

export const DELETE = withRouteErrorHandling(async (req: Request) => {
  const user = await requireRole("expert");
  const query = parseQuery(req, expertAvailabilityDeleteSchema);

  const [removed] = await db
    .delete(availabilitySlots)
    .where(
      and(
        eq(availabilitySlots.id, query.slotId),
        eq(availabilitySlots.expertClerkId, user.clerkId)
      )
    )
    .returning();

  if (!removed) {
    throw new ApiRouteError(404, "Slot not found");
  }

  return NextResponse.json({ ok: true });
});
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { and, desc, eq, gte, lt, gt } from "drizzle-orm";
import { db } from "@/lib/db";
import { availabilitySlots } from "@/lib/schema";

type SlotPayload = {
  startAt?: string;
  endAt?: string;
  timezone?: string;
  notes?: string;
  slotId?: string;
  sessionId?: string;
  // simple recurrence support
  recurrence?: {
    freq?: "daily" | "weekly";
    count?: number; // number of occurrences
    until?: string; // ISO date limit
  };
};

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

async function getSignedInUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  return { userId, user };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const expertId = url.searchParams.get("expertId");
  const mine = url.searchParams.get("mine") === "1";

  if (mine) {
    const signedIn = await getSignedInUser();
    if (!signedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rows = await db
      .select()
      .from(availabilitySlots)
      .where(eq(availabilitySlots.expertClerkId, signedIn.userId))
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
}

export async function POST(req: Request) {
  const signedIn = await getSignedInUser();
  if (!signedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = signedIn.user.publicMetadata?.role;
  if (role !== "expert") {
    return NextResponse.json({ error: "Only experts can create availability" }, { status: 403 });
  }

  const body = (await req.json()) as SlotPayload;
  const startAt = body.startAt ? new Date(body.startAt) : null;
  const endAt = body.endAt ? new Date(body.endAt) : null;

  if (!startAt || !endAt || Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime()) || endAt <= startAt) {
    return NextResponse.json({ error: "Invalid slot time range" }, { status: 400 });
  }

  // Prevent overlapping slots for the same expert
  const overlapping = await db
    .select()
    .from(availabilitySlots)
    .where(
      and(
        eq(availabilitySlots.expertClerkId, signedIn.userId),
        lt(availabilitySlots.startAt, endAt),
        gt(availabilitySlots.endAt, startAt)
      )
    )
    .limit(1);

  if (overlapping.length > 0) {
    return NextResponse.json({ error: "Overlapping slot exists" }, { status: 409 });
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
            eq(availabilitySlots.expertClerkId, signedIn.userId),
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
            expertClerkId: signedIn.userId,
            expertName:
              `${signedIn.user.firstName ?? ""} ${signedIn.user.lastName ?? ""}`.trim() ||
              signedIn.user.emailAddresses[0]?.emailAddress ||
              "Expert",
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
      expertClerkId: signedIn.userId,
      expertName:
        `${signedIn.user.firstName ?? ""} ${signedIn.user.lastName ?? ""}`.trim() ||
        signedIn.user.emailAddresses[0]?.emailAddress ||
        "Expert",
      startAt,
      endAt,
      timezone: body.timezone || "UTC",
      notes: body.notes || "",
      isBooked: false,
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}

export async function PATCH(req: Request) {
  const signedIn = await getSignedInUser();
  if (!signedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as SlotPayload;
  if (!body.slotId || !body.sessionId) {
    return NextResponse.json({ error: "slotId and sessionId are required" }, { status: 400 });
  }

  const [updated] = await db
    .update(availabilitySlots)
    .set({
      isBooked: true,
      bookedByClerkId: signedIn.userId,
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
    return NextResponse.json({ error: "Slot not found or already booked" }, { status: 409 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const signedIn = await getSignedInUser();
  if (!signedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const slotId = url.searchParams.get("slotId");
  if (!slotId) {
    return NextResponse.json({ error: "slotId is required" }, { status: 400 });
  }

  const [removed] = await db
    .delete(availabilitySlots)
    .where(
      and(
        eq(availabilitySlots.id, slotId),
        eq(availabilitySlots.expertClerkId, signedIn.userId)
      )
    )
    .returning();

  if (!removed) {
    return NextResponse.json({ error: "Slot not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
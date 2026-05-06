// app/api/venture/route.ts
// GET   → fetch this founder's venture
// POST  → create venture (first time)
// PATCH → update venture fields

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ventures } from "@/lib/schema";
import { eq } from "drizzle-orm";
import {
  formatVentureFieldErrors,
  venturePayloadSchema,
  type VentureValidationErrorResponse,
} from "@/lib/validators/venture";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db.select().from(ventures).where(eq(ventures.clerkUserId, userId));
  return NextResponse.json(rows[0] ?? null);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json<VentureValidationErrorResponse>(
      {
        error: "Invalid JSON payload",
        fieldErrors: {},
      },
      { status: 400 },
    );
  }

  const parsed = venturePayloadSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json<VentureValidationErrorResponse>(
      {
        error: "Validation failed",
        fieldErrors: formatVentureFieldErrors(parsed.error),
      },
      { status: 400 },
    );
  }

  const [created] = await db
    .insert(ventures)
    .values({ clerkUserId: userId, ...parsed.data })
    .returning();

  return NextResponse.json(created, { status: 201 });
}

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json<VentureValidationErrorResponse>(
      {
        error: "Invalid JSON payload",
        fieldErrors: {},
      },
      { status: 400 },
    );
  }

  const parsed = venturePayloadSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json<VentureValidationErrorResponse>(
      {
        error: "Validation failed",
        fieldErrors: formatVentureFieldErrors(parsed.error),
      },
      { status: 400 },
    );
  }

  // Upsert: update if exists, insert if not
  const existing = await db.select({ id: ventures.id })
    .from(ventures)
    .where(eq(ventures.clerkUserId, userId));

  if (existing.length === 0) {
    const [created] = await db
      .insert(ventures)
      .values({ clerkUserId: userId, ...parsed.data })
      .returning();
    return NextResponse.json(created);
  }

  const [updated] = await db
    .update(ventures)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(ventures.clerkUserId, userId))
    .returning();

  return NextResponse.json(updated);
}

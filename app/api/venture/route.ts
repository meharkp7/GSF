import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ventures } from "@/lib/schema";
import { eq } from "drizzle-orm";
import {
  parseJsonBody,
  requireAuth,
  withRouteErrorHandling,
} from "@/lib/api/route-helpers";
import { venturePayloadSchema } from "@/lib/validators/venture";

export const GET = withRouteErrorHandling(async () => {
  const userId = await requireAuth();

  const rows = await db.select().from(ventures).where(eq(ventures.clerkUserId, userId));
  return NextResponse.json(rows[0] ?? null);
});

export const POST = withRouteErrorHandling(async (req: Request) => {
  const userId = await requireAuth();
  const parsedData = await parseJsonBody(req, venturePayloadSchema);

  const [created] = await db
    .insert(ventures)
    .values({ clerkUserId: userId, ...parsedData })
    .returning();

  return NextResponse.json(created, { status: 201 });
});

export const PATCH = withRouteErrorHandling(async (req: Request) => {
  const userId = await requireAuth();
  const parsedData = await parseJsonBody(req, venturePayloadSchema);

  // Upsert: update if exists, insert if not
  const existing = await db.select({ id: ventures.id })
    .from(ventures)
    .where(eq(ventures.clerkUserId, userId));

  if (existing.length === 0) {
    const [created] = await db
      .insert(ventures)
      .values({ clerkUserId: userId, ...parsedData })
      .returning();
    return NextResponse.json(created);
  }

  const [updated] = await db
    .update(ventures)
    .set({ ...parsedData, updatedAt: new Date() })
    .where(eq(ventures.clerkUserId, userId))
    .returning();

  return NextResponse.json(updated);
});


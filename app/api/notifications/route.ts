import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { notifications } from "@/lib/schema";

async function getSignedInUser() {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await (await clerkClient()).users.getUser(userId);
  return { userId, user };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const mine = url.searchParams.get("mine") === "1";

  if (mine) {
    const signed = await getSignedInUser();
    if (!signed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const primary = signed.user.emailAddresses?.[0]?.emailAddress;
    if (!primary) return NextResponse.json([], { status: 200 });

    const rows = await db.select().from(notifications).where(eq(notifications.toEmail, primary)).orderBy(desc(notifications.createdAt));
    return NextResponse.json(rows);
  }

  // public listing (admin) — return latest 50
  const rows = await db.select().from(notifications).orderBy(desc(notifications.createdAt)).limit(50);
  return NextResponse.json(rows);
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, action } = body as { id?: string; action?: string };

  if (action === "markAll") {
    const signed = await getSignedInUser();
    if (!signed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const primary = signed.user.emailAddresses?.[0]?.emailAddress;
    if (!primary) return NextResponse.json({ error: "No email" }, { status: 400 });

    await db.update(notifications).set({ status: "read" }).where(eq(notifications.toEmail, primary));
    return NextResponse.json({ ok: true });
  }

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const [row] = await db.update(notifications).set({ status: "read" }).where(eq(notifications.id, id)).returning();
  if (!row) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { toEmail, type, payload } = body as { toEmail: string; type: string; payload?: any };
  if (!toEmail || !type) return NextResponse.json({ error: "toEmail and type required" }, { status: 400 });

  const [created] = await db.insert(notifications).values({ toEmail, type, payload: payload || {}, status: "pending", createdAt: new Date() }).returning();
  return NextResponse.json(created, { status: 201 });
}

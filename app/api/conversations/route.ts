import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { and, desc, eq, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { conversations, sessions } from "@/lib/schema";

function formatConversation(row: typeof conversations.$inferSelect, userId: string) {
  const isFounder = row.founderClerkId === userId;

  return {
    id: row.id,
    founderClerkId: row.founderClerkId,
    expertClerkId: row.expertClerkId,
    founderName: row.founderName,
    expertName: row.expertName,
    counterpartName: isFounder ? row.expertName : row.founderName,
    counterpartClerkId: isFounder ? row.expertClerkId : row.founderClerkId,
    unreadCount: isFounder ? (row.founderUnread ?? 0) : (row.expertUnread ?? 0),
    lastMessage: row.lastMessage ?? "",
    lastMessageBy: row.lastMessageBy ?? "",
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    isFounder,
  };
}

async function seedConversationsFromSessions(userId: string) {
  const userSessions = await db
    .select()
    .from(sessions)
    .where(or(eq(sessions.founderClerkId, userId), eq(sessions.expertClerkId, userId)))
    .orderBy(desc(sessions.createdAt));

  if (userSessions.length === 0) {
    return;
  }

  const existing = await db
    .select()
    .from(conversations)
    .where(or(eq(conversations.founderClerkId, userId), eq(conversations.expertClerkId, userId)));

  const existingPairs = new Set(existing.map((conversation) => `${conversation.founderClerkId}:${conversation.expertClerkId}`));

  for (const session of userSessions) {
    const pairKey = `${session.founderClerkId}:${session.expertClerkId}`;
    if (existingPairs.has(pairKey)) {
      continue;
    }

    await db
      .insert(conversations)
      .values({
        founderClerkId: session.founderClerkId,
        expertClerkId: session.expertClerkId,
        founderName: session.founderName || "Founder",
        expertName: session.expertName || "Expert",
        founderUnread: 0,
        expertUnread: 0,
      })
      .catch(() => {});
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await seedConversationsFromSessions(userId);

    const rows = await db
      .select()
      .from(conversations)
      .where(or(eq(conversations.founderClerkId, userId), eq(conversations.expertClerkId, userId)))
      .orderBy(desc(conversations.updatedAt));

    return NextResponse.json(rows.map((row) => formatConversation(row, userId)));
  } catch (err) {
    console.error("Failed to fetch conversations", err);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const founderClerkId = typeof body.founderClerkId === "string" ? body.founderClerkId : "";
    const expertClerkId = typeof body.expertClerkId === "string" ? body.expertClerkId : "";
    const founderName = typeof body.founderName === "string" ? body.founderName : "Founder";
    const expertName = typeof body.expertName === "string" ? body.expertName : "Expert";

    if (!founderClerkId || !expertClerkId) {
      return NextResponse.json({ error: "founderClerkId and expertClerkId are required" }, { status: 400 });
    }

    if (founderClerkId !== userId && expertClerkId !== userId) {
      return NextResponse.json({ error: "You can only create conversations that include your account" }, { status: 403 });
    }

    const [existing] = await db
      .select()
      .from(conversations)
      .where(and(eq(conversations.founderClerkId, founderClerkId), eq(conversations.expertClerkId, expertClerkId)))
      .limit(1);

    if (existing) {
      return NextResponse.json(formatConversation(existing, userId));
    }

    const [created] = await db
      .insert(conversations)
      .values({
        founderClerkId,
        expertClerkId,
        founderName,
        expertName,
        founderUnread: 0,
        expertUnread: 0,
      })
      .returning();

    return NextResponse.json(formatConversation(created, userId), { status: 201 });
  } catch (err) {
    console.error("Failed to create conversation", err);
    return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });
  }
}

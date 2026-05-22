import { NextResponse } from "next/server";
import { and, desc, eq, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { conversations, sessions } from "@/lib/schema";
import {
  parseJsonBody,
  requireAuth,
  withRouteErrorHandling,
  ApiRouteError,
} from "@/lib/api/route-helpers";
import { conversationsPostSchema } from "@/lib/validators/api-routes";

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

export const GET = withRouteErrorHandling(async () => {
  const userId = await requireAuth();

  await seedConversationsFromSessions(userId);

  const rows = await db
    .select()
    .from(conversations)
    .where(or(eq(conversations.founderClerkId, userId), eq(conversations.expertClerkId, userId)))
    .orderBy(desc(conversations.updatedAt));

  return NextResponse.json(rows.map((row) => formatConversation(row, userId)));
});

export const POST = withRouteErrorHandling(async (req: Request) => {
  const userId = await requireAuth();
  const body = await parseJsonBody(req, conversationsPostSchema);
  const { founderClerkId, expertClerkId, founderName = "Founder", expertName = "Expert" } = body;

  if (founderClerkId !== userId && expertClerkId !== userId) {
    throw new ApiRouteError(403, "You can only create conversations that include your account");
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
});


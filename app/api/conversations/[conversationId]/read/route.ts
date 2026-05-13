import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { conversations, messages } from "@/lib/schema";

type RouteContext = {
  params: Promise<{ conversationId: string }>;
};

export async function POST(_: Request, context: RouteContext) {
  const { conversationId } = await context.params;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [conversation] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1);

  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  if (conversation.founderClerkId !== userId && conversation.expertClerkId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db
    .update(messages)
    .set({ readAt: new Date() })
    .where(and(eq(messages.conversationId, conversationId), ne(messages.senderClerkId, userId)));

  if (conversation.founderClerkId === userId) {
    await db
      .update(conversations)
      .set({ founderUnread: 0, updatedAt: new Date() })
      .where(eq(conversations.id, conversationId));
  } else {
    await db
      .update(conversations)
      .set({ expertUnread: 0, updatedAt: new Date() })
      .where(eq(conversations.id, conversationId));
  }

  return NextResponse.json({ ok: true });
}

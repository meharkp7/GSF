import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { conversations, messages } from "@/lib/schema";

type RouteContext = {
  params: Promise<{ conversationId: string }>;
};

async function getConversation(conversationId: string) {
  const [conversation] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1);

  return conversation ?? null;
}

export async function GET(_: Request, context: RouteContext) {
  const { conversationId } = await context.params;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversation = await getConversation(conversationId);
  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  if (conversation.founderClerkId !== userId && conversation.expertClerkId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rows = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(desc(messages.createdAt));

  return NextResponse.json(rows.reverse());
}

export async function POST(req: Request, context: RouteContext) {
  const { conversationId } = await context.params;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversation = await getConversation(conversationId);
  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  if (conversation.founderClerkId !== userId && conversation.expertClerkId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const messageText = typeof body.message === "string" ? body.message.trim() : "";
  if (!messageText) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const senderName = typeof body.senderName === "string" && body.senderName.trim().length > 0 ? body.senderName.trim() : userId;

  const [created] = await db
    .insert(messages)
    .values({
      conversationId,
      senderClerkId: userId,
      senderName,
      body: messageText,
    })
    .returning();

  if (conversation.founderClerkId === userId) {
    await db
      .update(conversations)
      .set({
        lastMessage: messageText,
        lastMessageBy: userId,
        expertUnread: (conversation.expertUnread ?? 0) + 1,
        updatedAt: new Date(),
      })
      .where(eq(conversations.id, conversationId));
  } else {
    await db
      .update(conversations)
      .set({
        lastMessage: messageText,
        lastMessageBy: userId,
        founderUnread: (conversation.founderUnread ?? 0) + 1,
        updatedAt: new Date(),
      })
      .where(eq(conversations.id, conversationId));
  }

  return NextResponse.json(created, { status: 201 });
}

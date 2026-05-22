import { NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { conversations, messages } from "@/lib/schema";
import {
  requireAuth,
  withRouteErrorHandling,
  ApiRouteError,
} from "@/lib/api/route-helpers";

type RouteContext = {
  params: Promise<{ conversationId: string }>;
};

export const POST = withRouteErrorHandling(async (_: Request, context: RouteContext) => {
  const { conversationId } = await context.params;
  const userId = await requireAuth();

  const [conversation] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1);

  if (!conversation) {
    throw new ApiRouteError(404, "Conversation not found");
  }

  if (conversation.founderClerkId !== userId && conversation.expertClerkId !== userId) {
    throw new ApiRouteError(403, "Forbidden");
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
});


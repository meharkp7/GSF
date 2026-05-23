import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { articles } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import {
  parseJsonBody,
  parseQuery,
  requireAuth,
  requireRole,
  withRouteErrorHandling,
  ApiRouteError,
} from "@/lib/api/route-helpers";
import {
  articlesPostSchema,
  articlesDeleteSchema,
  articlesQuerySchema,
} from "@/lib/validators/api-routes";

// ============================================================
// POST: Create or update article (draft/publish)
// ============================================================
export const POST = withRouteErrorHandling(async (req: Request) => {
  const user = await requireRole(["expert", "admin"]);
  const body = await parseJsonBody(req, articlesPostSchema);
  const { id, title, category, body: articleBody, status } = body;

  // If id provided, update existing article
  if (id) {
    const [existing] = await db
      .select()
      .from(articles)
      .where(eq(articles.id, id))
      .limit(1);

    if (!existing) {
      throw new ApiRouteError(404, "Article not found");
    }

    if (existing.authorClerkId !== user.clerkId) {
      throw new ApiRouteError(403, "You can only edit your own articles");
    }

    const [updated] = await db
      .update(articles)
      .set({
        title,
        category,
        body: articleBody,
        status,
        publishedAt: status === "published" ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(articles.id, id))
      .returning();

    return NextResponse.json(updated, { status: 200 });
  }

  // Create new article
  const [created] = await db
    .insert(articles)
    .values({
      authorClerkId: user.clerkId,
      authorName: user.name || "Anonymous",
      title,
      category,
      body: articleBody,
      status,
      publishedAt: status === "published" ? new Date() : null,
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
});

// ============================================================
// GET: List articles (published or user's drafts)
// ============================================================
export const GET = withRouteErrorHandling(async (req: Request) => {
  const query = parseQuery(req, articlesQuerySchema);
  const { status, authorId } = query;

  let rows;

  // If requesting drafts, user must be authenticated and be the author
  if (status === "draft") {
    const userId = await requireAuth();
    rows = await db
      .select()
      .from(articles)
      .where(eq(articles.authorClerkId, userId))
      .orderBy(desc(articles.publishedAt || articles.createdAt));
  } else if (status === "published") {
    // Published articles are public
    rows = await db
      .select()
      .from(articles)
      .where(eq(articles.status, "published"))
      .orderBy(desc(articles.publishedAt || articles.createdAt));
  } else if (authorId) {
    // Get articles by specific author
    rows = await db
      .select()
      .from(articles)
      .where(eq(articles.authorClerkId, authorId))
      .orderBy(desc(articles.publishedAt || articles.createdAt));
  } else {
    // Default: return published articles
    rows = await db
      .select()
      .from(articles)
      .where(eq(articles.status, "published"))
      .orderBy(desc(articles.publishedAt || articles.createdAt));
  }

  return NextResponse.json(rows);
});

// ============================================================
// DELETE: Delete article (author only, draft only)
// ============================================================
export const DELETE = withRouteErrorHandling(async (req: Request) => {
  const user = await requireRole(["expert", "admin"]);
  const body = await parseJsonBody(req, articlesDeleteSchema);
  const { id } = body;

  const [article] = await db
    .select()
    .from(articles)
    .where(eq(articles.id, id))
    .limit(1);

  if (!article) {
    throw new ApiRouteError(404, "Article not found");
  }

  if (article.authorClerkId !== user.clerkId) {
    throw new ApiRouteError(403, "You can only delete your own articles");
  }

  if (article.status !== "draft") {
    throw new ApiRouteError(400, "Can only delete draft articles");
  }

  await db.delete(articles).where(eq(articles.id, id));

  return NextResponse.json({ success: true });
});


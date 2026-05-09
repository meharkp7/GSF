import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { articles, users } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

// ============================================================
// POST: Create or update article (draft/publish)
// ============================================================
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify user is staff/expert (has verified/trusted status)
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, userId))
    .limit(1);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // For now, allow any expert or staff user to create articles
  // In production, check for verified badge or specific role
  if (user.role !== "expert" && user.role !== "admin") {
    return NextResponse.json(
      { error: "Only experts can publish articles" },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { id, title, category, body: articleBody, status } = body;

  // Validation
  if (!title || title.trim().length === 0) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  if (!category || category.trim().length === 0) {
    return NextResponse.json({ error: "Category is required" }, { status: 400 });
  }

  if (!articleBody || articleBody.trim().length === 0) {
    return NextResponse.json({ error: "Article body is required" }, { status: 400 });
  }

  if (!["draft", "published"].includes(status)) {
    return NextResponse.json(
      { error: "Status must be 'draft' or 'published'" },
      { status: 400 }
    );
  }

  try {
    // If id provided, update existing article
    if (id) {
      const [existing] = await db
        .select()
        .from(articles)
        .where(eq(articles.id, id))
        .limit(1);

      if (!existing) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 });
      }

      if (existing.authorClerkId !== userId) {
        return NextResponse.json(
          { error: "You can only edit your own articles" },
          { status: 403 }
        );
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
        authorClerkId: userId,
        authorName: user.name || "Anonymous",
        title,
        category,
        body: articleBody,
        status,
        publishedAt: status === "published" ? new Date() : null,
      })
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("Failed to create/update article", err);
    return NextResponse.json(
      { error: "Failed to create/update article" },
      { status: 500 }
    );
  }
}

// ============================================================
// GET: List articles (published or user's drafts)
// ============================================================
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const authorId = searchParams.get("authorId");

  try {
    let rows;

    // If requesting drafts, user must be authenticated and be the author
    if (status === "draft") {
      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
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
  } catch (err) {
    console.error("Failed to fetch articles", err);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE: Delete article (author only, draft only)
// ============================================================
export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: "Article ID is required" }, { status: 400 });
  }

  try {
    const [article] = await db
      .select()
      .from(articles)
      .where(eq(articles.id, id))
      .limit(1);

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    if (article.authorClerkId !== userId) {
      return NextResponse.json(
        { error: "You can only delete your own articles" },
        { status: 403 }
      );
    }

    if (article.status !== "draft") {
      return NextResponse.json(
        { error: "Can only delete draft articles" },
        { status: 400 }
      );
    }

    await db.delete(articles).where(eq(articles.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete article", err);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}

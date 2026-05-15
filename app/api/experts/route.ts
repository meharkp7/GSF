import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, expertProfiles } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { errorResponse } from "@/lib/api/route-helpers";

export async function GET() {
  try {
    const experts = await db
      .select({
        id: users.id,
        clerkId: users.clerkId,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
        bio: users.bio,
        title: expertProfiles.title,
        company: expertProfiles.company,
        sessionRate: expertProfiles.sessionRate,
        rating: expertProfiles.rating,
        specializations: expertProfiles.specializations,
        isVerified: expertProfiles.isVerified,
        tags: expertProfiles.tags,
        location: expertProfiles.location,
        experience: expertProfiles.experience,
      })
      .from(users)
      .innerJoin(expertProfiles, eq(users.clerkId, expertProfiles.clerkUserId))
      .where(eq(users.role, "expert"));

    return NextResponse.json(experts);
  } catch (error) {
    console.error("Failed to fetch experts:", error);
    return errorResponse(500, "Failed to fetch experts");
  }
}

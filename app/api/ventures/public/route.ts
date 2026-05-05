import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ventures, investmentInterests } from "@/lib/schema";
import { desc, eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Fetch all ventures and count how many investors are interested
    const results = await db
      .select({
        venture: ventures,
        interestedCount: sql<number>`count(${investmentInterests.id})`.mapWith(Number),
      })
      .from(ventures)
      .leftJoin(investmentInterests, eq(ventures.id, investmentInterests.ventureId))
      .groupBy(ventures.id)
      .orderBy(desc(ventures.createdAt));

    // Map to a friendlier format for the frontend
    const mapped = results.map(({ venture, interestedCount }) => ({
      ...venture,
      interested: interestedCount,
      // For dummy data fallback if database is empty/new
      avatarColor: { bg: "#DBEAFE", text: "#1E40AF" },
      initials: venture.founderName ? venture.founderName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : "FN",
      daysLeft: venture.campaignEndsAt 
        ? Math.max(0, Math.ceil((new Date(venture.campaignEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        : 30,
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Failed to fetch public ventures:", error);
    return NextResponse.json({ error: "Failed to fetch ventures" }, { status: 500 });
  }
}

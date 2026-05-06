// app/api/credits/route.ts
// GET → returns credit balance (from DB — source of truth) + transaction log

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { creditTransactions } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { getBalance } from "@/lib/credits-server";
import { errorResponse, parseQuery, withRouteErrorHandling } from "@/lib/api/route-helpers";
import { creditsQuerySchema } from "@/lib/validators/api-routes";

export const GET = withRouteErrorHandling(async (req: Request) => {
  const { userId } = await auth();
  if (!userId) return errorResponse(401, "Unauthorized", { code: "UNAUTHORIZED" });
  const query = parseQuery(req, creditsQuerySchema);

  // Balance comes from the DB — not Clerk publicMetadata
  const balance = await getBalance(userId);

  const log = await db
    .select()
    .from(creditTransactions)
    .where(eq(creditTransactions.clerkUserId, userId))
    .orderBy(desc(creditTransactions.createdAt))
    .limit(query.limit);

  return NextResponse.json({ balance, log });
});

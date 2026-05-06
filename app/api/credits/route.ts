// app/api/credits/route.ts
// GET → returns credit balance (from DB — source of truth) + transaction log

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { creditTransactions } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { getBalance } from "@/lib/credits-server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Balance comes from the DB — not Clerk publicMetadata
  const balance = await getBalance(userId);

  const log = await db
    .select()
    .from(creditTransactions)
    .where(eq(creditTransactions.clerkUserId, userId))
    .orderBy(desc(creditTransactions.createdAt))
    .limit(50);

  return NextResponse.json({ balance, log });
}

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { investmentInterests } from "@/lib/schema";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { ventureId, message } = body;

    if (!ventureId) {
      return NextResponse.json({ error: "Venture ID is required" }, { status: 400 });
    }

    // Insert interest record
    const [interest] = await db
      .insert(investmentInterests)
      .values({
        ventureId,
        expertClerkId: userId,
        message: message || "Interested in learning more about this venture.",
        status: "pending"
      })
      .returning();

    return NextResponse.json(interest, { status: 201 });
  } catch (error) {
    console.error("Failed to register investment interest:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

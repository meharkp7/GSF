import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { investmentInterests } from "@/lib/schema";
import { errorResponse, parseJsonBody, withRouteErrorHandling } from "@/lib/api/route-helpers";
import { ventureInterestPostSchema } from "@/lib/validators/api-routes";

export const POST = withRouteErrorHandling(async (req: Request) => {
  const { userId } = await auth();
  if (!userId) {
    return errorResponse(401, "Unauthorized", { code: "UNAUTHORIZED" });
  }

  const body = await parseJsonBody(req, ventureInterestPostSchema);
  const { ventureId, message } = body;

  // Insert interest record
  const [interest] = await db
    .insert(investmentInterests)
    .values({
      ventureId,
      expertClerkId: userId,
      message,
      status: "pending",
    })
    .returning();

  return NextResponse.json(interest, { status: 201 });
});

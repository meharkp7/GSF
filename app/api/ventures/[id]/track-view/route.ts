import { NextRequest, NextResponse } from "next/server";
import { Analytics } from "@/lib/analytics";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;
  const ventureId = id;
  const body = await request.json();
  const { investorId, investorName } = body;
  
  const event = Analytics.trackView(ventureId, investorId || 'test_investor', investorName || 'Test Investor');
  
  return NextResponse.json({ success: true, message: "View tracked", event });
}
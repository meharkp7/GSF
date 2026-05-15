import { NextRequest, NextResponse } from "next/server";
import { Analytics } from "@/lib/analytics";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const ventureId = params.id;
  const body = await request.json();
  const { investorId, investorName } = body;
  
  const event = Analytics.trackView(ventureId, investorId || 'test_investor', investorName || 'Test Investor');
  
  return NextResponse.json({ success: true, message: "View tracked", event });
}
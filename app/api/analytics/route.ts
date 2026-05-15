import { NextRequest, NextResponse } from "next/server";
import { Analytics } from "@/lib/analytics";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ventureId = searchParams.get("ventureId");
  
  if (!ventureId) {
    return NextResponse.json({ error: "ventureId required" }, { status: 400 });
  }
  
  const analytics = Analytics.getAnalytics(ventureId);
  return NextResponse.json(analytics);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, ventureId, investorId, investorName } = body;
  
  if (!ventureId || !investorId) {
    return NextResponse.json({ error: "ventureId and investorId required" }, { status: 400 });
  }
  
  if (action === 'view') {
    const event = Analytics.trackView(ventureId, investorId, investorName || 'Anonymous Investor');
    return NextResponse.json({ success: true, event });
  }
  
  if (action === 'save') {
    const event = Analytics.trackSave(ventureId, investorId, investorName || 'Anonymous Investor');
    return NextResponse.json({ success: true, event });
  }
  
  return NextResponse.json({ error: "Invalid action. Use 'view' or 'save'" }, { status: 400 });
}
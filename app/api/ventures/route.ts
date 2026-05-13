import { NextRequest, NextResponse } from "next/server";

const mockVentures: Record<string, any> = {
  "1": { id: "1", name: "EduLoop", industry: "EdTech", stage: "MVP", location: "Bangalore", fundingNeeded: 1500000, founderExperience: "First-time", tags: ["AI", "Learning"] },
  "2": { id: "2", name: "Supplify", industry: "B2B SaaS", stage: "Seed", location: "Mumbai", fundingNeeded: 5000000, founderExperience: "Experienced", tags: ["Supply Chain", "Automation"] },
  "3": { id: "3", name: "HealthBridge", industry: "HealthTech", stage: "Pre-seed", location: "Delhi", fundingNeeded: 2500000, founderExperience: "First-time", tags: ["Telemedicine", "AI"] },
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
  
  if (id) {
    const venture = mockVentures[id];
    if (!venture) {
      return NextResponse.json({ error: "Venture not found" }, { status: 404 });
    }
    return NextResponse.json(venture);
  }
  
  return NextResponse.json(Object.values(mockVentures));
}
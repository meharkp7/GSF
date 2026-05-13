import { NextRequest, NextResponse } from "next/server";
import { MatchingEngine, type Venture, type Investor } from "@/lib/matchingEngine";

// Mock data - in production, fetch from database
const mockVentures: Venture[] = [
  { id: "1", name: "EduLoop", industry: "EdTech", stage: "MVP", location: "Bangalore", fundingNeeded: 1500000, founderExperience: "First-time", tags: ["AI", "Learning"] },
  { id: "2", name: "Supplify", industry: "B2B SaaS", stage: "Seed", location: "Mumbai", fundingNeeded: 5000000, founderExperience: "Experienced", tags: ["Supply Chain", "Automation"] },
  { id: "3", name: "HealthBridge", industry: "HealthTech", stage: "Pre-seed", location: "Delhi", fundingNeeded: 2500000, founderExperience: "First-time", tags: ["Telemedicine", "AI"] },
];

const mockInvestors: Investor[] = [
  { id: "1", name: "Sequoia Capital", preferredIndustries: ["SaaS", "FinTech"], preferredStage: "Seed", location: "Bangalore", investmentRangeMin: 2000000, investmentRangeMax: 10000000, preferredExperience: "Experienced", pastInvestments: [] },
  { id: "2", name: "Accel India", preferredIndustries: ["EdTech", "HealthTech"], preferredStage: "Pre-seed", location: "Bangalore", investmentRangeMin: 1000000, investmentRangeMax: 5000000, preferredExperience: "First-time", pastInvestments: [] },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  if (type === "investor" && id) {
    const investor = mockInvestors.find(i => i.id === id);
    if (!investor) {
      return NextResponse.json({ error: "Investor not found" }, { status: 404 });
    }
    const matches = MatchingEngine.getTopVenturesForInvestor(investor, mockVentures, 5);
    return NextResponse.json({ matches });
  }

  if (type === "venture" && id) {
    const venture = mockVentures.find(v => v.id === id);
    if (!venture) {
      return NextResponse.json({ error: "Venture not found" }, { status: 404 });
    }
    const matches = MatchingEngine.getTopInvestorsForVenture(venture, mockInvestors, 5);
    return NextResponse.json({ matches });
  }

  return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { ventureId, investorId } = body;

  if (!ventureId || !investorId) {
    return NextResponse.json({ error: "ventureId and investorId required" }, { status: 400 });
  }

  const venture = mockVentures.find(v => v.id === ventureId);
  const investor = mockInvestors.find(i => i.id === investorId);

  if (!venture || !investor) {
    return NextResponse.json({ error: "Venture or Investor not found" }, { status: 404 });
  }

  const match = MatchingEngine.calculateMatchScore(venture, investor);
  return NextResponse.json({ match });
}
import { NextRequest, NextResponse } from "next/server";

const mockInvestors: Record<string, any> = {
  "1": { id: "1", name: "Sequoia Capital", preferredIndustries: ["SaaS", "FinTech"], preferredStage: "Seed", location: "Bangalore", investmentRangeMin: 2000000, investmentRangeMax: 10000000, preferredExperience: "Experienced", pastInvestments: [] },
  "2": { id: "2", name: "Accel India", preferredIndustries: ["EdTech", "HealthTech"], preferredStage: "Pre-seed", location: "Bangalore", investmentRangeMin: 1000000, investmentRangeMax: 5000000, preferredExperience: "First-time", pastInvestments: [] },
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
  
  if (id) {
    const investor = mockInvestors[id];
    if (!investor) {
      return NextResponse.json({ error: "Investor not found" }, { status: 404 });
    }
    return NextResponse.json(investor);
  }
  
  return NextResponse.json(Object.values(mockInvestors));
}
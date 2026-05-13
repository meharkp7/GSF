import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ventures, investmentInterests } from "@/lib/schema";
import { desc, eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

const MOCK_VENTURES = [
  {
    id: "1",
    name: "EduFlow AI",
    founderName: "Sarah Chen",
    tagline: "Personalized learning paths for every student.",
    description: "EduFlow uses generative AI to adapt curriculum in real-time based on student performance and learning style.",
    stage: "MVP",
    sector: "EdTech",
    equity: "5%",
    fundingGoal: "$50,000",
    traction: "1,200+ active users",
    fundingStage: "Pre-seed",
    tags: ["AI", "Education", "SaaS"],
    views: 1240,
    interested: 12,
    daysLeft: 14,
    avatarColor: { bg: "#DBEAFE", text: "#1E40AF" },
    initials: "SC",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "EcoTrack",
    founderName: "Marcus Thorne",
    tagline: "Gamified carbon footprint tracking for Gen Z.",
    description: "A social platform that makes reducing your carbon footprint fun and rewarding through challenges and peer competition.",
    stage: "Market Research",
    sector: "SocialImpact",
    equity: "8%",
    fundingGoal: "$25,000",
    traction: "500+ beta signups",
    fundingStage: "Pre-seed",
    tags: ["Sustainability", "Social", "Mobile"],
    views: 890,
    interested: 8,
    daysLeft: 21,
    avatarColor: { bg: "#FCE7F3", text: "#9D174D" },
    initials: "MT",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Nexus SaaS",
    founderName: "Alex Rivera",
    tagline: "The operating system for student organizations.",
    description: "Nexus provides a unified dashboard for managing memberships, events, and finances for university clubs and societies.",
    stage: "Ideation",
    sector: "B2B SaaS",
    equity: "10%",
    fundingGoal: "$100,000",
    traction: "Partnered with 5 Universities",
    fundingStage: "Seed",
    tags: ["B2B", "Productivity", "Community"],
    views: 2100,
    interested: 15,
    daysLeft: 7,
    avatarColor: { bg: "#D1FAE5", text: "#065F46" },
    initials: "AR",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Vitality Labs",
    founderName: "Dr. Elena Vance",
    tagline: "Non-invasive glucose monitoring for students.",
    description: "Developing a wearable patch that tracks glucose levels via sweat, integrated with a nutrition-focused mobile app.",
    stage: "MVP",
    sector: "HealthTech",
    equity: "12%",
    fundingGoal: "$150,000",
    traction: "Prototype completed",
    fundingStage: "Seed",
    tags: ["Health", "Hardware", "BioTech"],
    views: 1560,
    interested: 24,
    daysLeft: 5,
    avatarColor: { bg: "#FEF3C7", text: "#92400E" },
    initials: "EV",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Swift Logistics",
    founderName: "Jameson Lee",
    tagline: "Last-mile delivery by student couriers.",
    description: "A hyper-local delivery network that uses students on campus to deliver packages, food, and groceries.",
    stage: "Product-Market Fit",
    sector: "Logistics",
    equity: "4%",
    fundingGoal: "$200,000",
    traction: "$10k Monthly Revenue",
    fundingStage: "Seed",
    tags: ["Logistics", "Gig Economy", "Local"],
    views: 3400,
    interested: 42,
    daysLeft: 30,
    avatarColor: { bg: "#EDE9FE", text: "#5B21B6" },
    initials: "JL",
    createdAt: new Date().toISOString(),
  }
];

export async function GET() {
  try {
    // Attempt to fetch from database
    const results = await db
      .select({
        venture: ventures,
        interestedCount: sql<number>`count(${investmentInterests.id})`.mapWith(Number),
      })
      .from(ventures)
      .leftJoin(investmentInterests, eq(ventures.id, investmentInterests.ventureId))
      .groupBy(ventures.id)
      .orderBy(desc(ventures.createdAt));

    // Map to a friendlier format for the frontend
    const mapped = results.map(({ venture, interestedCount }) => ({
      ...venture,
      interested: (venture as any).interested || interestedCount,
      avatarColor: (venture as any).avatarColor || { bg: "#DBEAFE", text: "#1E40AF" },
      initials: venture.founderName ? venture.founderName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : "FN",
      daysLeft: venture.campaignEndsAt
        ? Math.max(0, Math.ceil((new Date(venture.campaignEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        : 30,
    }));

    // If database is empty, return mock data for a better user experience
    if (mapped.length === 0) {
      return NextResponse.json(MOCK_VENTURES);
    }

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Failed to fetch public ventures from DB, falling back to mocks:", error);
    // Return mock data if DB is unavailable or schema is out of sync
    return NextResponse.json(MOCK_VENTURES);
  }
}


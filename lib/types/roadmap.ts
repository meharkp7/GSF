/**
 * Type definitions for Interactive Milestone Roadmap Tracker
 * Strict TypeScript schemas for milestone configuration
 */

export type MilestoneStatus = "pending" | "in-progress" | "completed";

export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  targetDate?: string;
  completedDate?: string;
  order: number;
  metadata?: {
    fundingAmount?: number;
    keyDeliverables?: string[];
    notes?: string;
  };
}

export interface RoadmapConfig {
  id: string;
  ventureName: string;
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapState {
  config: RoadmapConfig | null;
  isEditing: boolean;
  selectedMilestone: Milestone | null;
}

// Predefined milestone templates for quick setup
export const MILESTONE_TEMPLATES: Omit<Milestone, "id" | "order">[] = [
  {
    title: "Idea Validation",
    description: "Conduct market research and validate problem-solution fit",
    status: "pending",
    metadata: {
      keyDeliverables: ["Customer interviews", "Market analysis", "Problem statement"],
    },
  },
  {
    title: "MVP Development",
    description: "Build minimum viable product with core features",
    status: "pending",
    metadata: {
      keyDeliverables: ["Technical architecture", "Core features", "Initial testing"],
    },
  },
  {
    title: "Beta Testing",
    description: "Launch beta version and gather user feedback",
    status: "pending",
    metadata: {
      keyDeliverables: ["Beta user acquisition", "Feedback collection", "Iteration plan"],
    },
  },
  {
    title: "Seed Round",
    description: "Raise seed funding to scale operations",
    status: "pending",
    metadata: {
      fundingAmount: 500000,
      keyDeliverables: ["Pitch deck", "Financial projections", "Investor meetings"],
    },
  },
  {
    title: "Product Launch",
    description: "Official product launch and go-to-market execution",
    status: "pending",
    metadata: {
      keyDeliverables: ["Marketing campaign", "Launch event", "Press coverage"],
    },
  },
  {
    title: "Product-Market Fit",
    description: "Achieve sustainable growth and market validation",
    status: "pending",
    metadata: {
      keyDeliverables: ["User retention metrics", "Revenue targets", "Growth strategy"],
    },
  },
];

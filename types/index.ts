// User roles
export type UserRole = "student" | "expert" | "admin";

// User entity
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cohortId?: string;
  avatarUrl?: string;
  createdAt: Date;
}

// Application form data (multi-step apply flow)
export type ApplicationFormData = {
  firstName: string;
  lastName: string;
  email: string;
  university: string;
  role: string;
  idea?: string;
};


// Idea status/stage
export type IdeaStatus = "draft" | "validating" | "validated" | "archived";
export type IdeaStage = "problem" | "persona" | "validation" | "pitch";

export interface Idea {
  ideaId: string;
  userId: string;
  title: string;
  description: string;
  status: IdeaStatus;
  stage: IdeaStage;
  mentorFeedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Cohort entity
export type TrackType = "explorer" | "builder" | "founder";

export interface Cohort {
  cohortId: string;
  name: string;
  startDate: Date;
  endDate?: Date;
  trackType: TrackType;
  mentorId?: string;
  maxStudents: number;
  enrolledStudents: number;
  status: "upcoming" | "active" | "completed";
}

// Expert entity
export interface Expert {
  expertId: string;
  userId: string;
  name: string;
  bio: string;
  domain: string[];
  availability: "available" | "busy" | "unavailable";
  rating: number;
  sessionCount: number;
  avatarUrl?: string;
  company?: string;
  title?: string;
  linkedinUrl?: string;
}

// Session entity
export interface Session {
  sessionId: string;
  expertId: string;
  studentId: string;
  scheduledAt: Date;
  duration: number; // minutes
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
}

// Program track
export interface ProgramTrack {
  id: string;
  name: string;
  slug: TrackType;
  description: string;
  duration: string;
  modules: number;
  badge: string;
  comingSoon?: boolean;
}

// Navigation items
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string;
}

// Dashboard stat card
export interface StatCard {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: string;
}

// Onboarding answers
export type OnboardingOption =
  | "exploring"
  | "has_idea"
  | "building"
  | "curious";

export interface OnboardingData {
  option: OnboardingOption;
  goals?: string[];
  background?: string;
}

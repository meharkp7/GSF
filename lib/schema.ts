// ===== DRIZZLE ORM SCHEMA =====
// Tables: ventures, expert_profiles, sessions, credit_transactions, credit_balances
// Identity (name, email, PFP) lives in Clerk.
// Profile extras (bio, location, links) live in Clerk unsafeMetadata.
// App data (ventures, sessions, credits log, credit balances) lives here in Supabase.
//
// CREDIT SYSTEM NOTE:
// credit_balances is the canonical source of truth for a user's credit balance.
// Clerk publicMetadata.credits is a read-only cache for display purposes only.
// All balance mutations go through lib/credits-server.ts which wraps the
// balance update + transaction log insert in a single DB transaction.

import {
  pgTable, text, integer, boolean,
  timestamp, jsonb, uuid,
} from "drizzle-orm/pg-core";

// ===================================================
// VENTURES  (one per founder)
// ===================================================
export const ventures = pgTable("ventures", {
  id:              uuid("id").defaultRandom().primaryKey(),
  clerkUserId:     text("clerk_user_id").notNull().unique(),
  name:            text("name").notNull().default(""),
  tagline:         text("tagline").default(""),
  description:     text("description").default(""),
  stage:           text("stage").default("Ideation"),
  sector:          text("sector").default(""),
  equity:          text("equity").default("0"),
  fundingGoal:     text("funding_goal").default("0"),
  traction:        text("traction").default(""),
  teamSize:        integer("team_size").default(1),
  pitchDeckUrl:    text("pitch_deck_url"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  teamMembers:     jsonb("team_members").$type<any[]>().default([]),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tractionMetrics: jsonb("traction_metrics").$type<any[]>().default([]),
  createdAt:       timestamp("created_at").defaultNow(),
  updatedAt:       timestamp("updated_at").defaultNow(),
});

// ===================================================
// EXPERT PROFILES  (one per expert)
// ===================================================
export const expertProfiles = pgTable("expert_profiles", {
  id:               uuid("id").defaultRandom().primaryKey(),
  clerkUserId:      text("clerk_user_id").notNull().unique(),
  title:            text("title").default(""),
  company:          text("company").default(""),
  location:         text("location").default(""),
  linkedin:         text("linkedin").default(""),
  website:          text("website").default(""),
  experience:       text("experience").default(""),
  specializations:  text("specializations").array().default([]),
  sessionRate:      integer("session_rate").default(100),
  weeklySlots:      integer("weekly_slots").default(4),
  totalSessions:    integer("total_sessions").default(0),
  rating:           text("rating").default("0"),
  isVerified:       boolean("is_verified").default(false),
  createdAt:        timestamp("created_at").defaultNow(),
  updatedAt:        timestamp("updated_at").defaultNow(),
});

// ===================================================
// SESSIONS  (expert ↔ founder)
// ===================================================
export const sessions = pgTable("sessions", {
  id:             uuid("id").defaultRandom().primaryKey(),
  founderClerkId: text("founder_clerk_id").notNull(),
  expertClerkId:  text("expert_clerk_id").notNull(),
  founderName:    text("founder_name").default(""),
  expertName:     text("expert_name").default(""),
  ventureName:    text("venture_name").default(""),
  scheduledAt:    timestamp("scheduled_at").notNull(),
  duration:       integer("duration").default(30),
  status:         text("status").default("pending"),  // pending | confirmed | completed | cancelled
  creditsCost:    integer("credits_cost").default(100),
  creditsEarned:  integer("credits_earned").default(80),
  notes:          text("notes"),
  createdAt:      timestamp("created_at").defaultNow(),
  updatedAt:      timestamp("updated_at").defaultNow(),
});

// ===================================================
// CREDIT TRANSACTIONS
// ===================================================
export const creditTransactions = pgTable("credit_transactions", {
  id:               uuid("id").defaultRandom().primaryKey(),
  clerkUserId:      text("clerk_user_id").notNull(),
  type:             text("type").notNull(),   // 'credit' | 'debit'
  amount:           integer("amount").notNull(),
  reason:           text("reason").notNull(),
  balanceBefore:    integer("balance_before").notNull(),
  balanceAfter:     integer("balance_after").notNull(),
  relatedSessionId: uuid("related_session_id"),
  createdAt:        timestamp("created_at").defaultNow(),
});

// ===================================================
// CREDIT BALANCES  (one row per user — source of truth)
// ===================================================
export const creditBalances = pgTable("credit_balances", {
  clerkUserId: text("clerk_user_id").primaryKey(),
  balance:     integer("balance").notNull().default(0),
  updatedAt:   timestamp("updated_at").defaultNow(),
});

// ===================================================
// TYPE EXPORTS
// ===================================================
export type Venture              = typeof ventures.$inferSelect;
export type NewVenture           = typeof ventures.$inferInsert;
export type ExpertProfile        = typeof expertProfiles.$inferSelect;
export type NewExpertProfile     = typeof expertProfiles.$inferInsert;
export type Session              = typeof sessions.$inferSelect;
export type NewSession           = typeof sessions.$inferInsert;
export type CreditTransaction    = typeof creditTransactions.$inferSelect;
export type NewCreditTransaction = typeof creditTransactions.$inferInsert;
export type CreditBalance        = typeof creditBalances.$inferSelect;

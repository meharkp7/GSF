import { z } from "zod";

const optionalUrlField = z
  .union([z.string().url("Must be a valid URL"), z.literal("")])
  .optional();

export const profilePatchSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    bio: z.string().max(2000).optional(),
    university: z.string().max(200).optional(),
    year: z.string().max(50).optional(),
    location: z.string().max(200).optional(),
    linkedin: optionalUrlField,
    website: optionalUrlField,
  })
  .strict();

export const expertProfilePatchSchema = z
  .object({
    title: z.string().max(200).optional(),
    company: z.string().max(200).optional(),
    location: z.string().max(200).optional(),
    linkedin: optionalUrlField,
    website: optionalUrlField,
    experience: z.string().max(5000).optional(),
    specializations: z.array(z.string().trim().min(1).max(100)).max(30).optional(),
    sessionRate: z.number().int().min(0).max(100000).optional(),
    weeklySlots: z.number().int().min(0).max(168).optional(),
    totalSessions: z.number().int().min(0).optional(),
    rating: z.string().max(10).optional(),
    isVerified: z.boolean().optional(),
  })
  .strict();

export const sessionsPostSchema = z
  .object({
    expertClerkId: z.string().trim().min(1, "expertClerkId is required"),
    slotId: z.string().uuid("slotId must be a valid UUID").optional(),
    scheduledAt: z.string().refine((value) => !Number.isNaN(Date.parse(value)), "scheduledAt must be a valid ISO date"),
    duration: z.number().int().min(1).max(480).optional().default(30),
    creditsCost: z.number().int().min(1).max(10000).optional().default(100),
    creditsEarned: z.number().int().min(1).max(10000).optional().default(80),
    founderName: z.string().max(200).optional().default(""),
    expertName: z.string().max(200).optional().default(""),
    ventureName: z.string().max(200).optional().default(""),
  })
  .strict();

export const creditsQuerySchema = z
  .object({
    limit: z.coerce.number().int().min(1).max(100).optional().default(50),
  })
  .strict();

export const ventureInterestPostSchema = z
  .object({
    ventureId: z.string().uuid("ventureId must be a valid UUID"),
    message: z.string().max(2000).optional().default("Interested in learning more about this venture."),
  })
  .strict();

export const onboardingPostSchema = z
  .object({
    role: z.enum(["founder", "expert"] as const, { message: "role must be founder or expert" }),
  })
  .strict();

export const expertAvailabilityQuerySchema = z
  .object({
    expertId: z.string().optional(),
    mine: z.preprocess((val) => val === "1" || val === "true" || val === 1, z.boolean()).optional().default(false),
  })
  .strict();

export const expertAvailabilityPostSchema = z
  .object({
    startAt: z.string().refine((value) => !Number.isNaN(Date.parse(value)), "startAt must be a valid ISO date"),
    endAt: z.string().refine((value) => !Number.isNaN(Date.parse(value)), "endAt must be a valid ISO date"),
    timezone: z.string().max(100).optional().default("UTC"),
    notes: z.string().max(1000).optional().default(""),
    recurrence: z
      .object({
        freq: z.enum(["daily", "weekly"]),
        count: z.number().int().min(1).max(52).optional(),
        until: z.string().refine((value) => !Number.isNaN(Date.parse(value)), "until must be a valid ISO date").optional(),
      })
      .optional(),
  })
  .strict();

export const expertAvailabilityPatchSchema = z
  .object({
    slotId: z.string().uuid("slotId must be a valid UUID"),
    sessionId: z.string().uuid("sessionId must be a valid UUID"),
  })
  .strict();

export const expertAvailabilityDeleteSchema = z
  .object({
    slotId: z.string().uuid("slotId must be a valid UUID"),
  })
  .strict();

export const articlesPostSchema = z
  .object({
    id: z.string().uuid("id must be a valid UUID").optional(),
    title: z.string().trim().min(1, "Title is required").max(200),
    category: z.string().trim().min(1, "Category is required").max(100),
    body: z.string().trim().min(1, "Article body is required").max(50000),
    status: z.enum(["draft", "published"]),
  })
  .strict();

export const articlesDeleteSchema = z
  .object({
    id: z.string().uuid("id must be a valid UUID"),
  })
  .strict();

export const articlesQuerySchema = z
  .object({
    status: z.enum(["draft", "published"]).optional(),
    authorId: z.string().optional(),
  })
  .strict();

export const feedbackPostSchema = z
  .object({
    sessionId: z.string().uuid("sessionId must be a valid UUID"),
    rating: z.number().int().min(1).max(5),
    feedback: z.string().max(2000).optional().default(""),
  })
  .strict();

export const feedbackQuerySchema = z
  .object({
    sessionId: z.string().uuid("sessionId must be a valid UUID").optional(),
    expertClerkId: z.string().optional(),
  })
  .strict();

export const messagesPostSchema = z
  .object({
    contactId: z.string().optional().default("1"),
    text: z.string().trim().min(1, "Message text is required").max(5000),
  })
  .strict();

export const messagesQuerySchema = z
  .object({
    contactId: z.string().optional(),
  })
  .strict();

export const conversationsPostSchema = z
  .object({
    founderClerkId: z.string().trim().min(1, "founderClerkId is required"),
    expertClerkId: z.string().trim().min(1, "expertClerkId is required"),
    founderName: z.string().trim().optional().default("Founder"),
    expertName: z.string().trim().optional().default("Expert"),
  })
  .strict();

export const conversationsMessagePostSchema = z
  .object({
    message: z.string().trim().min(1, "message text is required").max(5000),
    senderName: z.string().trim().optional(),
  })
  .strict();

export const sessionsPatchSchema = z
  .object({
    status: z.enum(["pending", "confirmed", "completed", "cancelled"]).optional(),
    scheduledAt: z.string().refine((value) => !Number.isNaN(Date.parse(value)), "scheduledAt must be a valid ISO date").optional(),
  })
  .refine((data) => data.status !== undefined || data.scheduledAt !== undefined, {
    message: "Either status or scheduledAt must be provided",
  });


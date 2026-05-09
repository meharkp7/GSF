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

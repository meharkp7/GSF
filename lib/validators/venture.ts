import { z } from "zod";

const equitySchema = z.coerce
  .number({ message: "Equity must be a number" })
  .min(0, "Equity must be at least 0")
  .max(100, "Equity cannot exceed 100")
  .transform((value) => String(value));

const fundingGoalSchema = z.coerce
  .number({ message: "Funding goal must be a number" })
  .min(0, "Funding goal cannot be negative")
  .transform((value) => String(value));

const teamSizeSchema = z.coerce
  .number({ message: "Team size must be a number" })
  .int("Team size must be a whole number")
  .positive("Team size must be greater than 0");

const pitchDeckUrlSchema = z
  .union([
    z.string().url("Pitch deck URL must be a valid URL"),
    z.literal(""),
    z.null(),
    z.undefined(),
  ])
  .transform((value) => (value === "" || value === undefined ? null : value));

export const venturePayloadSchema = z.object({
  name: z.string().trim().min(2, "Venture name must be at least 2 characters"),
  tagline: z.string().optional().default(""),
  description: z.string().optional().default(""),
  stage: z.string().optional().default("Ideation"),
  sector: z.string().optional().default(""),
  equity: equitySchema,
  fundingGoal: fundingGoalSchema,
  traction: z.string().optional().default(""),
  teamSize: teamSizeSchema,
  pitchDeckUrl: pitchDeckUrlSchema,
});

export type VenturePayload = z.infer<typeof venturePayloadSchema>;

export type VentureFieldErrors = Partial<Record<keyof VenturePayload, string[]>>;

export type VentureValidationErrorResponse = {
  error: string;
  fieldErrors: VentureFieldErrors;
};

export function formatVentureFieldErrors(error: z.ZodError): VentureFieldErrors {
  return error.flatten().fieldErrors as VentureFieldErrors;
}

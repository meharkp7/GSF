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

const nonNegativeNumber = (label: string) =>
  z.coerce.number({ message: `${label} must be a number` }).min(0, `${label} cannot be negative`);

export const tractionMetricsSchema = z.object({
  users: nonNegativeNumber("Users").default(0),
  usersPrevious: nonNegativeNumber("Previous users").default(0),
  mrr: nonNegativeNumber("MRR").default(0),
  mrrPrevious: nonNegativeNumber("Previous MRR").default(0),
  pilots: z.coerce
    .number({ message: "Pilots must be a number" })
    .int("Pilots must be a whole number")
    .min(0, "Pilots cannot be negative")
    .default(0),
  growthRate: z.coerce
    .number({ message: "Growth rate must be a number" })
    .min(-100, "Growth rate cannot be lower than -100%")
    .max(10000, "Growth rate is too large")
    .default(0),
});

export const venturePayloadSchema = z.object({
  name: z.string().trim().min(2, "Venture name must be at least 2 characters"),
  tagline: z.string().optional().default(""),
  description: z.string().optional().default(""),
  stage: z.string().optional().default("Ideation"),
  sector: z.string().optional().default(""),
  equity: equitySchema,
  fundingGoal: fundingGoalSchema,
  traction: z.string().optional().default(""),
  tractionMetrics: tractionMetricsSchema.optional().default({}),
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

import { describe, expect, it } from "vitest";
import { venturePayloadSchema } from "./venture";

describe("venturePayloadSchema", () => {
  it("accepts a valid payload", () => {
    const parsed = venturePayloadSchema.safeParse({
      name: "Acme Ventures",
      tagline: "Building AI tools",
      description: "A short description",
      stage: "MVP",
      sector: "SaaS",
      equity: "25",
      fundingGoal: "50000",
      traction: "Early pilots",
      teamSize: 3,
      pitchDeckUrl: "https://example.com/deck",
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.equity).toBe("25");
      expect(parsed.data.fundingGoal).toBe("50000");
      expect(parsed.data.teamSize).toBe(3);
    }
  });

  it("rejects invalid numeric and required fields", () => {
    const parsed = venturePayloadSchema.safeParse({
      name: "",
      equity: -1,
      fundingGoal: -1000,
      teamSize: 0,
      pitchDeckUrl: "not-a-url",
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      expect(errors.name?.length).toBeGreaterThan(0);
      expect(errors.equity?.length).toBeGreaterThan(0);
      expect(errors.fundingGoal?.length).toBeGreaterThan(0);
      expect(errors.teamSize?.length).toBeGreaterThan(0);
      expect(errors.pitchDeckUrl?.length).toBeGreaterThan(0);
    }
  });

  it("allows null or empty pitchDeckUrl", () => {
    const withEmpty = venturePayloadSchema.safeParse({
      name: "Acme Ventures",
      equity: 10,
      fundingGoal: 0,
      teamSize: 1,
      pitchDeckUrl: "",
    });

    const withNull = venturePayloadSchema.safeParse({
      name: "Acme Ventures",
      equity: 10,
      fundingGoal: 0,
      teamSize: 1,
      pitchDeckUrl: null,
    });

    expect(withEmpty.success).toBe(true);
    expect(withNull.success).toBe(true);
    if (withEmpty.success) expect(withEmpty.data.pitchDeckUrl).toBeNull();
    if (withNull.success) expect(withNull.data.pitchDeckUrl).toBeNull();
  });
});

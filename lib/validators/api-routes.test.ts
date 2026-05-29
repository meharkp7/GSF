import { describe, expect, it } from "vitest";

import {
  expertProfilePatchSchema,
  profilePatchSchema,
} from "./api-routes";

describe("profilePatchSchema", () => {
  it("accepts a valid partial profile update", () => {
    const result = profilePatchSchema.safeParse({
      name: "John Doe",
      bio: "Student founder",
      university: "Stanford",
      linkedin: "https://linkedin.com/in/johndoe",
      website: "https://example.com",
    });

    expect(result.success).toBe(true);
  });

  it("accepts an empty object", () => {
    const result = profilePatchSchema.safeParse({});

    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = profilePatchSchema.safeParse({
      name: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects name longer than 120 characters", () => {
    const result = profilePatchSchema.safeParse({
      name: "a".repeat(121),
    });

    expect(result.success).toBe(false);
  });

  it("rejects bio longer than 2000 characters", () => {
    const result = profilePatchSchema.safeParse({
      bio: "a".repeat(2001),
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid linkedin url", () => {
    const result = profilePatchSchema.safeParse({
      linkedin: "not-a-url",
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid website url", () => {
    const result = profilePatchSchema.safeParse({
      website: "invalid-url",
    });

    expect(result.success).toBe(false);
  });

  it("accepts empty string linkedin url", () => {
    const result = profilePatchSchema.safeParse({
      linkedin: "",
    });

    expect(result.success).toBe(true);
  });

  it("accepts empty string website url", () => {
    const result = profilePatchSchema.safeParse({
      website: "",
    });

    expect(result.success).toBe(true);
  });

  it("rejects unknown fields", () => {
    const result = profilePatchSchema.safeParse({
      randomField: "unexpected",
    });

    expect(result.success).toBe(false);
  });
});

describe("expertProfilePatchSchema", () => {
  it("accepts a valid partial expert profile update", () => {
    const result = expertProfilePatchSchema.safeParse({
      title: "Product Mentor",
      company: "GSF",
      linkedin: "https://linkedin.com/in/expert",
      website: "https://expert.com",
      sessionRate: 500,
      weeklySlots: 20,
      totalSessions: 100,
      isVerified: true,
      specializations: ["Product", "Growth"],
    });

    expect(result.success).toBe(true);
  });

  it("accepts an empty object", () => {
    const result = expertProfilePatchSchema.safeParse({});

    expect(result.success).toBe(true);
  });

  it("rejects invalid sessionRate below 0", () => {
    const result = expertProfilePatchSchema.safeParse({
      sessionRate: -1,
    });

    expect(result.success).toBe(false);
  });

  it("rejects sessionRate above 100000", () => {
    const result = expertProfilePatchSchema.safeParse({
      sessionRate: 100001,
    });

    expect(result.success).toBe(false);
  });

  it("rejects weeklySlots above 168", () => {
    const result = expertProfilePatchSchema.safeParse({
      weeklySlots: 169,
    });

    expect(result.success).toBe(false);
  });

  it("rejects negative totalSessions", () => {
    const result = expertProfilePatchSchema.safeParse({
      totalSessions: -5,
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid linkedin url", () => {
    const result = expertProfilePatchSchema.safeParse({
      linkedin: "bad-url",
    });

    expect(result.success).toBe(false);
  });

  it("accepts empty string linkedin url", () => {
    const result = expertProfilePatchSchema.safeParse({
      linkedin: "",
    });

    expect(result.success).toBe(true);
  });

  it("rejects specialization entries that are empty", () => {
    const result = expertProfilePatchSchema.safeParse({
      specializations: [""],
    });

    expect(result.success).toBe(false);
  });

  it("rejects more than 30 specializations", () => {
    const result = expertProfilePatchSchema.safeParse({
      specializations: Array.from({ length: 31 }, (_, i) => `Spec ${i}`),
    });

    expect(result.success).toBe(false);
  });

  it("rejects unknown fields", () => {
    const result = expertProfilePatchSchema.safeParse({
      hackerField: true,
    });

    expect(result.success).toBe(false);
  });
});
import { describe, expect, it } from "vitest";
import { INITIAL_CREDITS, resolveStoredOrInitialBalance } from "./credits-balance";

describe("resolveStoredOrInitialBalance", () => {
  it("uses INITIAL_CREDITS when no balance row exists", () => {
    expect(resolveStoredOrInitialBalance(undefined)).toBe(INITIAL_CREDITS);
  });

  it("preserves an explicit zero balance", () => {
    expect(resolveStoredOrInitialBalance(0)).toBe(0);
  });

  it("preserves a stored positive balance", () => {
    expect(resolveStoredOrInitialBalance(420)).toBe(420);
  });
});

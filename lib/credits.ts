// ===== CREDIT SYSTEM UTILITIES (client-side helpers) =====
//
// SOURCE OF TRUTH: credit_balances table in Postgres (via lib/credits-server.ts).
// Clerk publicMetadata.credits is a read-only display cache — never write to it
// directly and never treat it as authoritative.
//
// All balance mutations (deduct, add, seed) must go through lib/credits-server.ts
// which wraps every operation in a DB transaction to keep the balance and the
// transaction log permanently in sync.

// ===== PRICING TABLE =====
export const EXPERT_SESSION_COSTS: Record<string, number> = {
  "0-2yr": 100,
  "2-5yr": 200,
  "5+yr":  350,
};

export const EXPERT_SESSION_EARN = 80; // 80 credits earned per session by expert

// ===== CREDIT TIER LABELS =====
export function getCreditTierLabel(credits: number): string {
  if (credits >= 2000) return "Premium";
  if (credits >= 1500) return "Standard";
  if (credits >= 600)  return "Basic";
  return "Low Balance";
}

export function getCreditBarPercent(credits: number, max = 600): number {
  return Math.min(100, Math.round((credits / max) * 100));
}

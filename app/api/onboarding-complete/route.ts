import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { seedBalance, INITIAL_CREDITS } from "@/lib/credits-server";
import { ApiRouteError, parseJsonBody, requireAuth, withRouteErrorHandling } from "@/lib/api/route-helpers";
import { onboardingPostSchema } from "@/lib/validators/api-routes";

const ALLOWED_ROLES   = ["founder", "expert"] as const;
const ALLOWED_PLANS   = ["basic"] as const;          // only free plan at signup
type AllowedRole = typeof ALLOWED_ROLES[number];

export const POST = withRouteErrorHandling(async (req: Request) => {
  const userId = await requireAuth();

  // ── Idempotency guard ────────────────────────────────────────────────────
  // Read the current metadata server-side — never trust the client for this.
  const clerk = await clerkClient();
  const existing = await clerk.users.getUser(userId);
  const meta = existing.publicMetadata ?? {};

  if (meta.onboardedAt) {
    // User has already completed onboarding. Reject silently so the client
    // can redirect to the correct dashboard without exposing internals.
    throw new ApiRouteError(409, "Already onboarded");
  }

  // ── Role validation ──────────────────────────────────────────────────────
  // Role comes from the client but is strictly validated against the allow-list.
  // "admin" is not in ALLOWED_ROLES so it can never be self-assigned here.
  const body = await parseJsonBody(req, onboardingPostSchema);
  const { role } = body;

  // ── Seed credit balance in DB first ─────────────────────────────────────
  // Must happen before the Clerk write so the DB row always exists from the
  // moment the user is considered onboarded.
  await seedBalance(userId, INITIAL_CREDITS);

  // ── Write publicMetadata ─────────────────────────────────────────────────
  // plan is server-enforced to "basic" regardless of what the client sends.
  // credits in publicMetadata is a display cache only — DB is source of truth.
  await clerk.users.updateUserMetadata(userId, {
    publicMetadata: {
      role:        role as AllowedRole,
      credits:     INITIAL_CREDITS,   // display cache only
      plan:        ALLOWED_PLANS[0],  // always "basic" at signup
      onboardedAt: new Date().toISOString(),
    },
  });

  return NextResponse.json({ success: true, role });
});


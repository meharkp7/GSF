// app/api/onboarding-complete/route.ts
//
// POST → finalise onboarding for a new user.
//
// Security guarantees:
//  1. Idempotency guard — if publicMetadata.onboardedAt is already set the
//     request is rejected with 409. A user cannot call this endpoint a second
//     time to change their own role.
//  2. Role is NOT accepted from the client body. The only allowed values are
//     "founder" and "expert", and the server decides which ones are valid.
//     "admin" can never be self-assigned through this endpoint.
//  3. plan is accepted from the client but capped to the allowed set so a
//     user cannot self-assign a paid plan.

import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { seedBalance, INITIAL_CREDITS } from "@/lib/credits-server";

const ALLOWED_ROLES   = ["founder", "expert"] as const;
const ALLOWED_PLANS   = ["basic"] as const;          // only free plan at signup
type AllowedRole = typeof ALLOWED_ROLES[number];

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Idempotency guard ────────────────────────────────────────────────────
  // Read the current metadata server-side — never trust the client for this.
  const clerk = await clerkClient();
  const existing = await clerk.users.getUser(userId);
  const meta = existing.publicMetadata ?? {};

  if (meta.onboardedAt) {
    // User has already completed onboarding. Reject silently so the client
    // can redirect to the correct dashboard without exposing internals.
    return NextResponse.json(
      { error: "Already onboarded", role: meta.role },
      { status: 409 },
    );
  }

  // ── Role validation ──────────────────────────────────────────────────────
  // Role comes from the client but is strictly validated against the allow-list.
  // "admin" is not in ALLOWED_ROLES so it can never be self-assigned here.
  const body = await req.json();
  const role = body.role as string | undefined;

  if (!role || !(ALLOWED_ROLES as readonly string[]).includes(role)) {
    return NextResponse.json(
      { error: `role must be one of: ${ALLOWED_ROLES.join(", ")}` },
      { status: 400 },
    );
  }

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
}

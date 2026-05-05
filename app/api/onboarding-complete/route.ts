import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { seedBalance, INITIAL_CREDITS } from "@/lib/credits-server";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { role, plan } = body;

  if (!role || !["founder", "expert"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  // Seed the credit_balances row in the DB (idempotent — safe to call again)
  // This must happen before the Clerk metadata write so the DB is always
  // the source of truth from the moment the user is onboarded.
  await seedBalance(userId, INITIAL_CREDITS);

  // Save role + plan to Clerk publicMetadata.
  // credits in publicMetadata is now a display cache only — do not use it
  // as the source of truth anywhere in the app.
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      role,
      credits:     INITIAL_CREDITS,   // cache only
      plan:        plan ?? "basic",
      onboardedAt: new Date().toISOString(),
    },
  });

  return NextResponse.json({ success: true });
}

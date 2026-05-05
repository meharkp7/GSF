// ===== SERVER-SIDE CREDIT UTILITIES =====
// All balance mutations go through this module.
//
// The credit_balances table is the canonical source of truth.
// Both the balance update and the transaction log insert are executed inside
// a single Postgres transaction so they are always consistent — a partial
// failure leaves neither record written.
//
// Clerk publicMetadata.credits is updated as a best-effort cache after the
// DB transaction commits. If that Clerk update fails the balance is still
// correct in the DB; the cache will be refreshed on the next GET /api/credits.

import { db } from "@/lib/db";
import { creditBalances, creditTransactions } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs/server";

export const INITIAL_CREDITS = 600;

// ---------------------------------------------------------------------------
// getBalance
// Returns the current balance from the DB. Falls back to INITIAL_CREDITS if
// no row exists yet (e.g. legacy users who pre-date the credit_balances table).
// ---------------------------------------------------------------------------
export async function getBalance(clerkUserId: string): Promise<number> {
  const rows = await db
    .select({ balance: creditBalances.balance })
    .from(creditBalances)
    .where(eq(creditBalances.clerkUserId, clerkUserId));

  return rows[0]?.balance ?? INITIAL_CREDITS;
}

// ---------------------------------------------------------------------------
// seedBalance
// Creates the initial credit_balances row for a new user.
// Safe to call multiple times — uses INSERT … ON CONFLICT DO NOTHING.
// ---------------------------------------------------------------------------
export async function seedBalance(
  clerkUserId: string,
  initialBalance: number = INITIAL_CREDITS,
): Promise<void> {
  await db
    .insert(creditBalances)
    .values({ clerkUserId, balance: initialBalance })
    .onConflictDoNothing();

  // Best-effort: mirror to Clerk publicMetadata for display caching
  await syncBalanceToClerk(clerkUserId, initialBalance).catch(() => {
    // Non-fatal — DB is the source of truth
  });
}

// ---------------------------------------------------------------------------
// deductCredits
// Atomically checks the balance and deducts `amount` inside a DB transaction.
// Returns the new balance on success.
// Throws InsufficientCreditsError if the balance is too low.
// Optionally links the transaction to a session row via relatedSessionId.
// ---------------------------------------------------------------------------
export async function deductCredits(opts: {
  clerkUserId: string;
  amount: number;
  reason: string;
  relatedSessionId?: string;
}): Promise<number> {
  const { clerkUserId, amount, reason, relatedSessionId } = opts;

  if (amount <= 0) throw new Error("Deduction amount must be positive");

  const newBalance = await db.transaction(async (tx) => {
    // Lock the row with FOR UPDATE to prevent concurrent double-spends
    const rows = await tx
      .select({ balance: creditBalances.balance })
      .from(creditBalances)
      .where(eq(creditBalances.clerkUserId, clerkUserId))
      .for("update");

    const currentBalance = rows[0]?.balance ?? INITIAL_CREDITS;

    if (currentBalance < amount) {
      throw new InsufficientCreditsError(currentBalance, amount);
    }

    const updated = currentBalance - amount;

    // Upsert balance row
    await tx
      .insert(creditBalances)
      .values({ clerkUserId, balance: updated, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: creditBalances.clerkUserId,
        set: { balance: updated, updatedAt: new Date() },
      });

    // Write transaction log in the same transaction
    await tx.insert(creditTransactions).values({
      clerkUserId,
      type:          "debit",
      amount,
      reason,
      balanceBefore: currentBalance,
      balanceAfter:  updated,
      ...(relatedSessionId ? { relatedSessionId } : {}),
    });

    return updated;
  });

  // Best-effort: mirror new balance to Clerk publicMetadata cache
  await syncBalanceToClerk(clerkUserId, newBalance).catch(() => {
    // Non-fatal — DB is the source of truth
  });

  return newBalance;
}

// ---------------------------------------------------------------------------
// addCredits
// Atomically adds `amount` credits and logs the transaction.
// Used when a session is completed and the expert earns credits.
// ---------------------------------------------------------------------------
export async function addCredits(opts: {
  clerkUserId: string;
  amount: number;
  reason: string;
  relatedSessionId?: string;
}): Promise<number> {
  const { clerkUserId, amount, reason, relatedSessionId } = opts;

  if (amount <= 0) throw new Error("Credit amount must be positive");

  const newBalance = await db.transaction(async (tx) => {
    const rows = await tx
      .select({ balance: creditBalances.balance })
      .from(creditBalances)
      .where(eq(creditBalances.clerkUserId, clerkUserId))
      .for("update");

    const currentBalance = rows[0]?.balance ?? 0;
    const updated = currentBalance + amount;

    await tx
      .insert(creditBalances)
      .values({ clerkUserId, balance: updated, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: creditBalances.clerkUserId,
        set: { balance: updated, updatedAt: new Date() },
      });

    await tx.insert(creditTransactions).values({
      clerkUserId,
      type:          "credit",
      amount,
      reason,
      balanceBefore: currentBalance,
      balanceAfter:  updated,
      ...(relatedSessionId ? { relatedSessionId } : {}),
    });

    return updated;
  });

  await syncBalanceToClerk(clerkUserId, newBalance).catch(() => {});

  return newBalance;
}

// ---------------------------------------------------------------------------
// syncBalanceToClerk  (private helper)
// Mirrors the DB balance into Clerk publicMetadata as a display cache.
// Never call this as the source of truth — always read from the DB.
// ---------------------------------------------------------------------------
async function syncBalanceToClerk(
  clerkUserId: string,
  balance: number,
): Promise<void> {
  const clerk = await clerkClient();
  await clerk.users.updateUserMetadata(clerkUserId, {
    publicMetadata: { credits: balance },
  });
}

// ---------------------------------------------------------------------------
// InsufficientCreditsError
// ---------------------------------------------------------------------------
export class InsufficientCreditsError extends Error {
  constructor(
    public readonly current: number,
    public readonly required: number,
  ) {
    super(
      `Insufficient credits: need ${required}, have ${current}`,
    );
    this.name = "InsufficientCreditsError";
  }
}

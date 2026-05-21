export const INITIAL_CREDITS = 600;

/** Fallback when no credit_balances row exists (matches getBalance / deductCredits). */
export function resolveStoredOrInitialBalance(balance: number | undefined): number {
  return balance ?? INITIAL_CREDITS;
}

// ===== GSF AUTH BRIDGE =====
// Maps Clerk user data to GSF's AuthUser interface.
// Clerk is the source of truth for identity.
// Role and extra profile data live in Clerk's publicMetadata.

export type Role = "founder" | "expert";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  credits: number;
  avatar: string;        // initials fallback e.g. "AS"
  avatarUrl?: string;    // Clerk profile image URL
  plan: string;
  planExpiresAt?: string;
}

// ====================================================================
// CLIENT-SIDE: call inside "use client" components via useUser() hook
// ====================================================================
// Usage:
//   import { useUser } from "@clerk/nextjs";
//   import { clerkUserToAuthUser } from "@/lib/auth";
//   const { user } = useUser();
//   const authUser = user ? clerkUserToAuthUser(user) : null;
// ====================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function clerkUserToAuthUser(clerkUser: any): AuthUser {
  const meta = clerkUser.publicMetadata ?? {};
  const firstName = clerkUser.firstName ?? "";
  const lastName  = clerkUser.lastName  ?? "";
  const fullName  = [firstName, lastName].filter(Boolean).join(" ") || clerkUser.username || "User";
  const initials  = fullName.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);

  return {
    id:          clerkUser.id,
    email:       clerkUser.primaryEmailAddress?.emailAddress ?? "",
    name:        fullName,
    role:        (meta.role as Role) ?? "founder",
    credits:     typeof meta.credits === "number" ? meta.credits : 600,
    avatar:      initials,
    avatarUrl:   clerkUser.imageUrl ?? undefined,
    plan:        (meta.plan as string) ?? "basic",
    planExpiresAt: meta.planExpiresAt as string | undefined,
  };
}

export const REDIRECT_AFTER_LOGIN: Record<Role, string> = {
  founder: "/dashboard",
  expert:  "/expert-dashboard",
};


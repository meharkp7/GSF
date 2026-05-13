// types/globals.d.ts
//
// Augments Clerk's session claims type so TypeScript knows the shape of
// sessionClaims.metadata after the Clerk Dashboard session token is
// customized to include:
//   { "metadata": "{{user.public_metadata}}" }
//
// See: https://clerk.com/docs/guides/basic-rbac

export type AppRole = "founder" | "expert" | "admin";

declare global {
  interface CustomJwtSessionClaims {
    metadata?: {
      role?: AppRole;
      plan?: string;
      credits?: number;
      onboardedAt?: string;
    };
  }
}

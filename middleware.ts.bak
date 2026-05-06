// middleware.ts
//
// Clerk auth middleware with role-based route protection.
//
// ── Clerk Dashboard setup required ──────────────────────────────────────────
// For role checks to work without a network request on every route, the Clerk
// session token must be customized to embed publicMetadata in the JWT.
//
// In the Clerk Dashboard → Sessions → Customize session token, add:
//   { "metadata": "{{user.public_metadata}}" }
//
// This makes sessionClaims.metadata.role available in the middleware without
// an extra Clerk API call. See: https://clerk.com/docs/guides/basic-rbac
//
// ── Route rules ──────────────────────────────────────────────────────────────
//  /student/*  → requires role === "founder"
//  /dashboard/* → requires role === "founder"
//  /expert/*   → requires role === "expert"
//  /expert-dashboard/* → requires role === "expert"
//  /admin/*    → requires role === "admin"
//  /onboarding → requires authenticated but NOT yet onboarded
//
// Unauthenticated users → /login
// Wrong-role users → their own dashboard (no information leakage)
// Unboarded users → /onboarding

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ── Public routes (no auth required) ────────────────────────────────────────
const isPublic = createRouteMatcher([
  "/",
  "/login(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/sso-callback(.*)",
  "/about(.*)",
  "/apply(.*)",
  "/careers(.*)",
  "/community(.*)",
  "/connect(.*)",
  "/contact(.*)",
  "/cookies(.*)",
  "/experts(.*)",
  "/insights(.*)",
  "/privacy(.*)",
  "/programs(.*)",
  "/terms(.*)",
  "/ventures(.*)",
  "/api/(.+)",          // API routes handle their own auth
]);

// ── Role-gated route matchers ────────────────────────────────────────────────
const isFounderRoute = createRouteMatcher([
  "/student(.*)",
  "/dashboard(.*)",
]);

const isExpertRoute = createRouteMatcher([
  "/expert(.*)",
  "/expert-dashboard(.*)",
]);

const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
]);

const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"]);

// ── Middleware ───────────────────────────────────────────────────────────────
export default clerkMiddleware(async (auth, req) => {
  // Always allow public routes through
  if (isPublic(req)) return NextResponse.next();

  const { userId, sessionClaims } = await auth();

  // Not signed in → redirect to login
  if (!userId) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect_url", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Read role from the session JWT.
  // Requires the Clerk Dashboard session token to be customized to include:
  //   { "metadata": "{{user.public_metadata}}" }
  // See: https://clerk.com/docs/guides/basic-rbac
  // This value comes from the signed JWT — it cannot be spoofed by the client.
  const meta = sessionClaims?.metadata;
  const role = meta?.role;
  const onboardedAt = meta?.onboardedAt;

  // Signed in but not yet onboarded → force to onboarding (except if already there)
  if (!onboardedAt && !isOnboardingRoute(req)) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  // Already onboarded users should not revisit onboarding
  if (onboardedAt && isOnboardingRoute(req)) {
    const dest = role === "expert" ? "/expert-dashboard" : "/dashboard";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  // ── Role enforcement ───────────────────────────────────────────────────────
  if (isFounderRoute(req) && role !== "founder") {
    // Wrong role — send them to their own dashboard
    const dest = role === "expert" ? "/expert-dashboard"
               : role === "admin"  ? "/admin/dashboard"
               : "/login";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  if (isExpertRoute(req) && role !== "expert") {
    const dest = role === "founder" ? "/dashboard"
               : role === "admin"   ? "/admin/dashboard"
               : "/login";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  if (isAdminRoute(req) && role !== "admin") {
    const dest = role === "expert" ? "/expert-dashboard"
               : role === "founder" ? "/dashboard"
               : "/login";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Run on all routes except Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

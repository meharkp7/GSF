import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type Role = "founder" | "expert" | "admin";

const isPublicRoute = createRouteMatcher([
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
  "/unauthorized(.*)",
  "/api/(.*)",
]);

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

function getClaimsMetadata(sessionClaims: unknown): Record<string, unknown> {
  if (!sessionClaims || typeof sessionClaims !== "object") return {};
  const claims = sessionClaims as Record<string, unknown>;

  const metadata = claims.metadata;
  if (metadata && typeof metadata === "object") {
    return metadata as Record<string, unknown>;
  }

  const publicMetadata = claims.publicMetadata;
  if (publicMetadata && typeof publicMetadata === "object") {
    return publicMetadata as Record<string, unknown>;
  }

  return {};
}

function getRole(metadata: Record<string, unknown>): Role | null {
  const role = metadata.role;
  if (role === "founder" || role === "expert" || role === "admin") {
    return role;
  }
  return null;
}

function getHomeForRole(role: Role | null): string {
  if (role === "expert") return "/expert-dashboard";
  if (role === "admin") return "/admin/dashboard";
  if (role === "founder") return "/dashboard";
  return "/sign-in";
}

function redirectToUnauthorized(req: NextRequest, role: Role | null, required: Role) {
  const url = new URL("/unauthorized", req.url);
  url.searchParams.set("required", required);
  url.searchParams.set("current", role ?? "unknown");
  url.searchParams.set("from", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

// Next.js 16 requires a named export called "proxy" (not default export)
export const proxy = clerkMiddleware(async (auth, req: NextRequest) => {
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  const { userId, sessionClaims } = await auth();

  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  const metadata = getClaimsMetadata(sessionClaims);
  const role = getRole(metadata);
  const onboardedAt = metadata.onboardedAt;
  const hasOnboarded = typeof onboardedAt === "string" && onboardedAt.length > 0;

  // Session can be stale right after auth if metadata has not propagated.
  if (!hasOnboarded && !isOnboardingRoute(req)) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  if (hasOnboarded && isOnboardingRoute(req)) {
    return NextResponse.redirect(new URL(getHomeForRole(role), req.url));
  }

  if (isFounderRoute(req) && role !== "founder") {
    return redirectToUnauthorized(req, role, "founder");
  }

  if (isExpertRoute(req) && role !== "expert") {
    return redirectToUnauthorized(req, role, "expert");
  }

  if (isAdminRoute(req) && role !== "admin") {
    return redirectToUnauthorized(req, role, "admin");
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf|otf)).*)",
    "/(api|trpc)(.*)",
  ],
};

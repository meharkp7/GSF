"use client";

import Link from "next/link";
import { useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";

type Role = "founder" | "expert" | "admin" | "unknown";

function labelForRole(role: Role): string {
  if (role === "founder") return "Founder";
  if (role === "expert") return "Expert";
  if (role === "admin") return "Admin";
  return "Unknown";
}

function homeForRole(role: Role): string {
  if (role === "expert") return "/expert-dashboard";
  if (role === "admin") return "/admin/dashboard";
  if (role === "founder") return "/dashboard";
  return "/";
}

function UnauthorizedContent() {
  const params = useSearchParams();

  const required = (params.get("required") ?? "unknown") as Role;
  const current = (params.get("current") ?? "unknown") as Role;
  const from = params.get("from") ?? "/";

  const homeHref = useMemo(() => homeForRole(current), [current]);
  const canGoBack = from && from !== "/unauthorized";

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-2xl items-center px-6 py-16">
      <section className="w-full rounded-2xl border border-border bg-canvas p-8 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-amber-100 p-2.5 text-amber-700">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Access Restricted
            </p>
            <h1 className="text-2xl font-semibold text-text-primary">
              You do not have permission for this page
            </h1>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-text-secondary">
          This area requires the <strong>{labelForRole(required)}</strong> role, but your current
          account role is <strong>{labelForRole(current)}</strong>. If this looks wrong, sign out and
          sign back in, then contact support.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={homeHref}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
          >
            <Home className="size-4" />
            Go to my dashboard
          </Link>

          {canGoBack ? (
            <Link
              href={from}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-canvas/70"
            >
              <ArrowLeft className="size-4" />
              Try previous page
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl items-center justify-center text-sm text-text-secondary">
        Loading...
      </div>
    }>
      <UnauthorizedContent />
    </Suspense>
  );
}

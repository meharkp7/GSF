import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "rect" | "circle" | "card";
  lines?: number;
}

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-surface-2",
        className
      )}
    />
  );
}

export function Skeleton({ className, variant = "rect", lines = 3 }: SkeletonProps) {
  if (variant === "circle") {
    return <SkeletonBlock className={cn("rounded-full", className)} />;
  }

  if (variant === "text") {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonBlock
            key={i}
            className={cn(
              "h-4",
              i === lines - 1 ? "w-3/4" : "w-full",
              className
            )}
          />
        ))}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="card p-5 space-y-4">
        <div className="flex items-center gap-3">
          <SkeletonBlock className="size-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <SkeletonBlock className="h-4 w-1/3" />
            <SkeletonBlock className="h-3 w-1/2" />
          </div>
        </div>
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-3/4" />
        <SkeletonBlock className="h-8 w-1/3 rounded-xl" />
      </div>
    );
  }

  return <SkeletonBlock className={cn("h-8 w-full", className)} />;
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="space-y-2">
        <SkeletonBlock className="h-8 w-48" />
        <SkeletonBlock className="h-4 w-64" />
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-5 space-y-3">
            <SkeletonBlock className="h-4 w-16" />
            <SkeletonBlock className="h-8 w-12" />
            <SkeletonBlock className="h-3 w-20" />
          </div>
        ))}
      </div>
      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
      </div>
    </div>
  );
}

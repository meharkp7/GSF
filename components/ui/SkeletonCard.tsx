import { Skeleton } from "@/components/ui/Skeleton";

export default function SkeletonCard() {
  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" className="size-10" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="rect" className="h-4 w-1/3" />
          <Skeleton variant="rect" className="h-3 w-1/2" />
        </div>
      </div>

      <Skeleton variant="rect" className="h-4 w-full" />
      <Skeleton variant="rect" className="h-4 w-3/4" />
      <Skeleton variant="rect" className="h-8 w-1/4 rounded-xl" />
    </div>
  );
}


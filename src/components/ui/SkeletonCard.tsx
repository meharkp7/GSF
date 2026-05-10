import Skeleton from "./Skeleton";

const SkeletonCard = () => {
  return (
    <div className="card p-6 flex flex-col gap-4 bg-white dark:bg-slate-800">
      <div className="flex items-start gap-3">
        <Skeleton className="size-14 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
};

export default SkeletonCard;
import Skeleton from "./Skeleton";

const SkeletonCard = ({ count = 1 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="card p-6 flex flex-col gap-4 bg-white dark:bg-slate-800"
          role="status"
          aria-label={`Loading card ${i + 1}`}
        >
          <div className="flex items-start gap-3">
            <Skeleton variant="default" className="size-14 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="default" className="h-5 w-32" />
              <Skeleton variant="subtle" className="h-4 w-24" />
              <Skeleton variant="subtle" className="h-4 w-28" />
            </div>
          </div>
          <Skeleton variant="default" className="h-4 w-full" />
          <Skeleton variant="subtle" className="h-4 w-3/4" />
          <div className="flex gap-2">
            <Skeleton variant="default" className="h-6 w-16 rounded-full" />
            <Skeleton variant="default" className="h-6 w-16 rounded-full" />
            <Skeleton variant="default" className="h-6 w-16 rounded-full" />
          </div>
          <div className="flex gap-4">
            <Skeleton variant="default" className="h-10 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonCard;
const Skeleton = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-slate-700 rounded ${className}`}></div>
  );
};

export default Skeleton;
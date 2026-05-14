import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const skeletonVariants = cva("animate-pulse rounded", {
  variants: {
    variant: {
      default: "bg-gray-200 dark:bg-slate-700",
      subtle: "bg-gray-100 dark:bg-slate-800",
      intense: "bg-gray-300 dark:bg-slate-600",
    },
    size: {
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-10 w-10",
      full: "w-full h-6",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface SkeletonProps extends VariantProps<typeof skeletonVariants> {
  className?: string;
}

const Skeleton = ({ variant, size, className }: SkeletonProps) => {
  return (
    <div
      className={cn(skeletonVariants({ variant, size }), className)}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Skeleton;
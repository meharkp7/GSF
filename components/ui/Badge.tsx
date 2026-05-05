import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "gray" | "outline";
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

const variantStyles = {
  primary: "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 ring-primary-200/50 dark:ring-primary-700/50",
  secondary: "bg-secondary-50 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 ring-secondary-200/50 dark:ring-secondary-700/50",
  success: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 ring-emerald-200/50 dark:ring-emerald-700/50",
  warning: "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 ring-amber-200/50 dark:ring-amber-700/50",
  danger: "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 ring-red-200/50 dark:ring-red-700/50",
  gray: "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 ring-gray-200/50 dark:ring-slate-600/50",
  outline: "bg-transparent dark:bg-transparent border border-border dark:border-slate-600 text-text-secondary dark:text-slate-300 ring-0",
};

const dotColors = {
  primary: "bg-primary-500",
  secondary: "bg-secondary-400",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  gray: "bg-gray-400",
  outline: "bg-gray-400",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-2xs",
  md: "px-2.5 py-1 text-xs",
};

export function Badge({
  children,
  variant = "gray",
  size = "md",
  dot = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn("size-1.5 rounded-full", dotColors[variant])}
        />
      )}
      {children}
    </span>
  );
}

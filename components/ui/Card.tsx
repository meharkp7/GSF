"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onAnimationStart" | "onDrag" | "onDragEnd" | "onDragStart"> {
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  variant?: "default" | "elevated" | "bordered" | "ghost";
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

const variantStyles = {
  default: "bg-white dark:bg-slate-800 border border-border dark:border-slate-700 shadow-card dark:shadow-lg",
  elevated: "bg-white dark:bg-slate-800 border border-border dark:border-slate-700 shadow-soft-md dark:shadow-lg",
  bordered: "bg-white dark:bg-slate-800 border-2 border-border dark:border-slate-700",
  ghost: "bg-canvas dark:bg-slate-900 border border-border dark:border-slate-700",
};

export function Card({
  children,
  className,
  hover = false,
  padding = "md",
  variant = "default",
  ...props
}: CardProps) {
  const classes = cn(
    "rounded-xl transition-all duration-200",
    variantStyles[variant],
    paddingStyles[padding],
    hover && "hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer",
    className
  );

  if (hover) {
    return (
      <motion.div
        className={classes}
        whileHover={{ y: -2, scale: 1.005 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 space-y-1", className)}>{children}</div>
  );
}

export function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn("text-base font-semibold text-text-primary", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-sm text-text-secondary", className)}>{children}</p>
  );
}

export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("", className)}>{children}</div>;
}

export function CardFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mt-4 pt-4 border-t border-border flex items-center gap-2",
        className
      )}
    >
      {children}
    </div>
  );
}

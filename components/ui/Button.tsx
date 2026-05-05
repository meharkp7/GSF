"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

const variantStyles = {
  primary:
    "bg-[#81A6C6] dark:bg-[#6C7EFF] text-white hover:bg-[#5B8FB8] dark:hover:bg-[#7B87FF] shadow-[0_2px_12px_rgba(129,166,198,0.35)] dark:shadow-[0_2px_12px_rgba(107,126,255,0.35)] hover:shadow-[0_4px_20px_rgba(129,166,198,0.45)] dark:hover:shadow-[0_4px_20px_rgba(107,126,255,0.45)] focus-ring",
  secondary:
    "bg-[#D2C4B4] dark:bg-slate-700 text-[#1A2332] dark:text-slate-100 hover:bg-[#AACDDC] dark:hover:bg-slate-600 shadow-soft-sm focus-ring",
  outline:
    "bg-transparent border-[1.5px] border-[#D2C4B4] dark:border-slate-600 text-[#4A5668] dark:text-slate-300 hover:border-[#81A6C6] dark:hover:border-blue-400 hover:text-[#1A2332] dark:hover:text-slate-100 hover:bg-[#EEF4F9] dark:hover:bg-slate-800 focus-ring",
  ghost:
    "bg-transparent text-[#4A5668] dark:text-slate-300 hover:bg-[#F3E3D0] dark:hover:bg-slate-800 hover:text-[#1A2332] dark:hover:text-slate-100 focus-ring",
  danger:
    "bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-700 shadow-soft-sm focus-ring",
};

const sizeStyles = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-9 px-4 text-sm gap-2 rounded-xl",
  lg: "h-11 px-5 text-sm gap-2 rounded-xl",
  xl: "h-12 px-6 text-base gap-2.5 rounded-xl",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      asChild: _asChild,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || loading}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {loading ? (
          <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : leftIcon}
        {children}
        {!loading && rightIcon}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button };
export type { ButtonProps };

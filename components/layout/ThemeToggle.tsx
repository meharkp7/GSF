"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-surface-2 animate-pulse" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-surface transition-all duration-300 hover:bg-surface-2 hover:scale-105 active:scale-95 group overflow-hidden"
      aria-label="Toggle theme"
    >
      <div className="relative flex items-center justify-center w-full h-full">
        <Sun 
          className={`h-[1.2rem] w-[1.2rem] transition-all duration-500 absolute ${
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          } text-amber-500`} 
        />
        <Moon 
          className={`h-[1.2rem] w-[1.2rem] transition-all duration-500 absolute ${
            isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          } text-indigo-400`} 
        />
      </div>
      <span className="sr-only">Toggle theme</span>
      
      {/* Decorative effect */}
      <span className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

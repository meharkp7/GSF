// ===== THEME MANAGEMENT =====
// Handles dark/light mode toggle with localStorage persistence
// Uses class-based dark mode with Tailwind CSS

export type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "gsf-theme";
const DARK_CLASS = "dark";

/**
 * Get the stored theme from localStorage
 * Falls back to system preference if not stored
 */
export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored) return stored as Theme;
  
  // Check system preference
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

/**
 * Apply theme to document root
 */
export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  
  if (theme === "dark") {
    root.classList.add(DARK_CLASS);
  } else {
    root.classList.remove(DARK_CLASS);
  }
  
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

/**
 * Toggle between light and dark themes
 */
export function toggleTheme(): Theme {
  const current = getStoredTheme();
  const next: Theme = current === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
}

/**
 * Initialize theme from localStorage on app mount
 */
export function initTheme() {
  const theme = getStoredTheme();
  applyTheme(theme);
  return theme;
}

/**
 * Get current theme
 */
export function getCurrentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains(DARK_CLASS) ? "dark" : "light";
}

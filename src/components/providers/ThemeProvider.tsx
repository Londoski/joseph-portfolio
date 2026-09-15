"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Paths where the theme toggle is allowed
  const isAdminRoute =
    pathname?.startsWith("/admin") || pathname?.startsWith("/login");

  // Load saved theme on mount
  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored === "light" || stored === "dark") {
      setThemeState(stored);
    }
    setMounted(true);
  }, []);

  // Apply theme based on current route
  useEffect(() => {
    if (!mounted) return;

    if (isAdminRoute) {
      // Admin pages: apply user's saved theme
      document.documentElement.setAttribute("data-theme", theme);
      // Persist so it stays on reload
      localStorage.setItem("theme", theme);
    } else {
      // Public pages: always dark, ignore user preference
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, [theme, mounted, isAdminRoute]);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () =>
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
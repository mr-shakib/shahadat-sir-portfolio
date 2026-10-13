"use client";

import { useEffect, useState } from "react";
import { LuMoon, LuSun } from "react-icons/lu";

/** Matches the mobile browser's toolbar colour (the theme-color meta tag) to the theme in use. */
function paintBrowserBar(dark: boolean) {
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#0b111c" : "#f7f6f2");
}

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
    paintBrowserBar(isDark);
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
    paintBrowserBar(next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* storage unavailable: the choice simply won't persist */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="inline-flex size-9 items-center justify-center rounded-full border border-line text-fg-2 transition hover:border-line-strong hover:bg-surface-2 hover:text-fg"
    >
      {dark === null ? (
        <span className="size-4" />
      ) : dark ? (
        <LuSun className="size-4" aria-hidden />
      ) : (
        <LuMoon className="size-4" aria-hidden />
      )}
    </button>
  );
}

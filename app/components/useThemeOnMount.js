"use client";

import { useEffect } from "react";
import { useTransition } from "@/app/providers/TransitionProvider";

/**
 * Sets the WebGL theme when a page mounts. Covers direct loads, refreshes and
 * browser back/forward — cases where the animated TransitionLink didn't run.
 */
export default function useThemeOnMount(theme) {
  const { setTheme } = useTransition();
  useEffect(() => {
    // full = true → also set the particle shape/motion for this page
    setTheme(theme, true);
    // scroll reset is handled by SmoothScroll (through Lenis) on route change
  }, [setTheme, theme]);
}

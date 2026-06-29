"use client";

import { useEffect } from "react";
import { useTransition } from "@/app/providers/TransitionProvider";

/**
 * Sets the WebGL theme (and optional giant 3D word) when a page mounts. Covers
 * direct loads, refreshes and browser back/forward — cases where the animated
 * TransitionLink didn't run.
 */
export default function useThemeOnMount(theme, word) {
  const { setTheme, setWord } = useTransition();
  useEffect(() => {
    // full = true → also set the particle shape/motion for this page
    setTheme(theme, true);
    if (word !== undefined) setWord(word, theme?.accent);
    // scroll reset is handled by SmoothScroll (through Lenis) on route change
  }, [setTheme, setWord, theme, word]);
}

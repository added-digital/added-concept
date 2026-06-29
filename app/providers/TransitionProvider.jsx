"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { baseTheme } from "@/lib/projects";

/**
 * Holds the *target* WebGL theme and orchestrates page transitions.
 *
 * The persistent canvas reads `themeRef.current` every frame and lerps its
 * shader uniforms toward it — so changing the theme here makes the 3D scene
 * morph smoothly instead of cutting. Navigation plays a wipe overlay, swaps
 * the route mid-wipe, and reveals the new page once it has mounted.
 */
const TransitionContext = createContext(null);

const DURATION = 600; // must match .transition-overlay transition in globals.css

export function TransitionProvider({ children }) {
  const router = useRouter();
  // Mutable refs the render loop reads — never trigger React re-renders.
  // themeRef = palette (lerps continuously, also previews on hover).
  // lookRef  = particle shape + motion (changes only on real navigation / load,
  //            so hover never causes a jarring shape swap).
  const themeRef = useRef({ ...baseTheme });
  const lookRef = useRef({ ...baseTheme.particle });
  const [overlay, setOverlay] = useState("idle"); // idle | active | exit
  const busy = useRef(false);

  // The giant word rendered in the WebGL layer + its colour. These are React
  // state (not refs) because <Text> is a real component — they change once per
  // page, not per frame, so a re-render here is cheap.
  const [word, setWordState] = useState("ADDED");
  const [accent, setAccentState] = useState(baseTheme.accent);
  const setWord = useCallback((w, a) => {
    if (w !== undefined) setWordState(w);
    if (a) setAccentState(a);
  }, []);

  // Set the target theme. `full` also swaps the particle look (used on page
  // mount / direct loads); plain calls (hover) only change the palette.
  const setTheme = useCallback((theme, full = false) => {
    if (!theme) return;
    themeRef.current = theme;
    if (full && theme.particle) lookRef.current = theme.particle;
  }, []);

  // Animated navigation: morph theme now, wipe, push route, reveal.
  const navigate = useCallback(
    (href, theme) => {
      if (busy.current) return;
      busy.current = true;
      if (theme) {
        themeRef.current = theme; // palette starts morphing right away
        if (theme.particle) lookRef.current = theme.particle; // shape swaps under the wipe
      }
      setOverlay("active");

      window.setTimeout(() => {
        router.push(href);
        // give the new route a beat to mount, then lift the wipe
        window.setTimeout(() => {
          setOverlay("exit");
          window.setTimeout(() => {
            setOverlay("idle");
            busy.current = false;
          }, DURATION);
        }, 80);
      }, DURATION);
    },
    [router]
  );

  return (
    <TransitionContext.Provider
      value={{ themeRef, lookRef, setTheme, setWord, word, accent, navigate, overlay }}
    >
      {children}
      <div className={`transition-overlay ${overlay === "idle" ? "" : overlay}`} />
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("useTransition must be used inside TransitionProvider");
  return ctx;
}

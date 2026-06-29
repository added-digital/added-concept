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
  // Mutable ref the render loop reads — never triggers React re-renders.
  const themeRef = useRef({ ...baseTheme });
  const [overlay, setOverlay] = useState("idle"); // idle | active | exit
  const busy = useRef(false);

  // Set the WebGL target theme immediately (used on page mount / direct loads).
  const setTheme = useCallback((theme) => {
    if (theme) themeRef.current = theme;
  }, []);

  // Animated navigation: morph theme now, wipe, push route, reveal.
  const navigate = useCallback(
    (href, theme) => {
      if (busy.current) return;
      busy.current = true;
      if (theme) themeRef.current = theme; // scene starts morphing right away
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
    <TransitionContext.Provider value={{ themeRef, setTheme, navigate, overlay }}>
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

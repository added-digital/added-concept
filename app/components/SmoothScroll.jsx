"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { scroll, pointer } from "@/lib/store";

/**
 * Global Lenis smooth scroll. Writes normalized scroll progress + velocity and
 * pointer position into the shared store so the WebGL frame loop can read them
 * without causing React re-renders.
 */
export default function SmoothScroll({ children }) {
  const pathname = usePathname();
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      lerp: 0.1,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ({ scroll: y, limit, velocity }) => {
      scroll.progress = limit > 0 ? Math.min(y / limit, 1) : 0;
      scroll.velocity = velocity;
    });

    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onPointer = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // On route change, jump to top *through Lenis* (immediate = no fake velocity),
  // and zero the shared store so the scene doesn't get a phantom spike.
  useEffect(() => {
    scroll.progress = 0;
    scroll.velocity = 0;
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.resize();
      lenis.scrollTo(0, { immediate: true, force: true });
    }
  }, [pathname]);

  return children;
}

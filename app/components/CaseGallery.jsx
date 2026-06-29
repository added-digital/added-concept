"use client";

import { useEffect, useRef } from "react";

/**
 * Editorial media gallery for case pages.
 * - Each frame unveils with a clip-path wipe when it scrolls into view
 *   (IntersectionObserver).
 * - The image inside drifts (parallax) within an overflow-hidden frame,
 *   driven by a single shared rAF loop reading each frame's viewport position.
 *
 * Layout: items alternate between full-bleed and a two-up row for rhythm.
 */
export default function CaseGallery({ images = [], alt = "" }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const frames = Array.from(root.querySelectorAll("[data-frame]"));

    // Progressive enhancement: only now (JS is running) do we hide the frames,
    // so a JS/observer failure can never leave images invisible.
    let io;
    if ("IntersectionObserver" in window) {
      frames.forEach((f) => f.classList.add("reveal-init"));
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      frames.forEach((f) => io.observe(f));
    }

    // Hard safety net: reveal everything after 1.6s no matter what.
    const fallback = window.setTimeout(() => {
      frames.forEach((f) => f.classList.add("in"));
    }, 1600);

    // Parallax loop (only touches frames currently near the viewport)
    let raf;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = () => {
      const vh = window.innerHeight;
      for (const f of frames) {
        const inner = f.firstElementChild;
        if (!inner) continue;
        const r = f.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        // progress: -1 (entering bottom) -> 1 (leaving top)
        const progress = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
        const shift = reduce ? 0 : progress * -7; // % of the 14% overscan
        inner.style.transform = `translate3d(0, ${shift}%, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      io?.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
    };
  }, [images]);

  if (!images.length) return null;

  // Build rows: first full-bleed, then pair remaining two-up, trailing single full.
  const rows = [];
  let i = 0;
  let full = true;
  while (i < images.length) {
    if (full || images.length - i === 1) {
      rows.push([images[i]]);
      i += 1;
    } else {
      rows.push([images[i], images[i + 1]]);
      i += 2;
    }
    full = !full;
  }

  return (
    <div className="case-gallery" ref={rootRef}>
      {rows.map((row, ri) => (
        <div className={`gallery-row ${row.length === 2 ? "two" : "one"}`} key={ri}>
          {row.map((src, ci) => (
            <figure className="media-frame" data-frame key={ci}>
              <div className="media-frame__inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={alt} loading="lazy" decoding="async" />
              </div>
            </figure>
          ))}
        </div>
      ))}
    </div>
  );
}

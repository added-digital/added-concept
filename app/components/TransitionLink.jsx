"use client";

import { useTransition } from "@/app/providers/TransitionProvider";

/**
 * Drop-in <a> that runs the animated WebGL transition instead of a hard nav.
 * Pass the destination's `theme` so the scene morphs toward it during the wipe.
 */
export default function TransitionLink({ href, theme, children, className, ...rest }) {
  const { navigate } = useTransition();
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        // respect modifier clicks (open in new tab, etc.)
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(href, theme);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

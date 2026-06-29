"use client";

import TransitionLink from "@/app/components/TransitionLink";
import { baseTheme } from "@/lib/projects";

export default function Nav() {
  return (
    <nav className="nav">
      <TransitionLink href="/" theme={baseTheme} className="nav__logo">
        ADDED
      </TransitionLink>
      <div className="nav__links">
        <TransitionLink href="/work" theme={baseTheme}>
          Work
        </TransitionLink>
        <TransitionLink href="/studio" theme={baseTheme}>
          Studio
        </TransitionLink>
        <a href="https://www.added.digital/contact" target="_blank" rel="noreferrer">
          Contact
        </a>
      </div>
    </nav>
  );
}

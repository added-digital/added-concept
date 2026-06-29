"use client";

import TransitionLink from "@/app/components/TransitionLink";
import { baseTheme } from "@/lib/projects";

export default function Footer() {
  return (
    <footer className="footer container">
      <div>
        <p className="eyebrow">Let&apos;s build</p>
        <h2>
          Where ideas
          <br />
          take digital form.
        </h2>
      </div>
      <div className="meta">
        <p>
          <a href="mailto:hello@added.digital">hello@added.digital</a>
          <br />
          <a href="tel:+46733307055">+46 73 330 70 55</a>
        </p>
        <p style={{ marginTop: 16 }}>
          Sankt Eriksgatan 46A
          <br />
          112 34 Stockholm
        </p>
        <p style={{ marginTop: 16 }}>
          <TransitionLink href="/work" theme={baseTheme}>
            Work
          </TransitionLink>{" "}
          ·{" "}
          <TransitionLink href="/studio" theme={baseTheme}>
            Studio
          </TransitionLink>
        </p>
        <p style={{ marginTop: 24, opacity: 0.6 }}>
          Concept build · Next.js + React Three Fiber
        </p>
      </div>
    </footer>
  );
}

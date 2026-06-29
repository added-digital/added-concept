"use client";

import TransitionLink from "@/app/components/TransitionLink";
import { projects } from "@/lib/projects";

/**
 * The hoverable project list. Each row carries its project's WebGL theme, so
 * hovering previews the palette and clicking morphs the scene into it.
 */
export default function ProjectIndex({ onHover }) {
  return (
    <div className="proj-list">
      {projects.map((p, i) => (
        <TransitionLink
          key={p.slug}
          href={`/work/${p.slug}`}
          theme={p.theme}
          className="proj-row"
          onMouseEnter={() => onHover?.(p.theme)}
          onMouseLeave={() => onHover?.(null)}
        >
          <div className="proj-row__title">
            <span className="proj-row__idx">0{i + 1}</span>
            <span
              className="dot"
              style={{ background: p.theme.accent }}
              aria-hidden
            />
            {p.title}
          </div>
          <div className="proj-row__meta">
            {p.category}
            <br />
            {p.services.join(" · ")} — {p.year}
          </div>
        </TransitionLink>
      ))}
    </div>
  );
}

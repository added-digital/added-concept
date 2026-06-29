"use client";

import useThemeOnMount from "@/app/components/useThemeOnMount";
import { useTransition } from "@/app/providers/TransitionProvider";
import TransitionLink from "@/app/components/TransitionLink";
import Footer from "@/app/components/Footer";
import { projects, baseTheme } from "@/lib/projects";

const rgb = (c) =>
  `rgb(${Math.round(c[0] * 255)}, ${Math.round(c[1] * 255)}, ${Math.round(
    c[2] * 255
  )})`;

export default function Work() {
  useThemeOnMount(baseTheme, "WORK");
  const { setTheme } = useTransition();

  return (
    <>
      <section className="hero container" style={{ minHeight: "60svh" }}>
        <p className="eyebrow">Work</p>
        <h1 style={{ fontSize: "clamp(40px, 9vw, 120px)" }}>
          Things we&apos;ve
          <br />
          built
        </h1>
      </section>

      <section className="section container">
        <div className="work-grid">
          {projects.map((p) => (
            <TransitionLink
              key={p.slug}
              href={`/work/${p.slug}`}
              theme={p.theme}
              className="work-card"
              onMouseEnter={() => setTheme(p.theme)}
              onMouseLeave={() => setTheme(baseTheme)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="work-card__img" src={p.cover} alt={p.title} loading="lazy" />
              <div
                className="work-card__bg"
                style={{
                  background: `linear-gradient(150deg, ${rgb(
                    p.theme.colorB
                  )}22 0%, transparent 38%), linear-gradient(180deg, rgba(6,6,11,0) 30%, rgba(6,6,11,0.82) 100%)`,
                }}
              />
              <div className="work-card__label">
                <strong>{p.title}</strong>
                <span>
                  {p.category} — {p.year}
                </span>
              </div>
            </TransitionLink>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

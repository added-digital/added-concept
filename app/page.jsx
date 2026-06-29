"use client";

import useThemeOnMount from "@/app/components/useThemeOnMount";
import { useTransition } from "@/app/providers/TransitionProvider";
import ProjectIndex from "@/app/components/ProjectIndex";
import Footer from "@/app/components/Footer";
import { baseTheme } from "@/lib/projects";

export default function Home() {
  useThemeOnMount(baseTheme);
  const { setTheme } = useTransition();

  return (
    <>
      <section className="hero container">
        <p className="eyebrow">Digital studio · Stockholm</p>
        <h1>
          Where ideas
          <br />
          take digital form
        </h1>
        <p className="sub">
          ADDED combines strategy, design, development and growth into digital
          experiences that last. Added to create something greater.
        </p>
      </section>

      <section className="section container">
        <div className="section__head">
          <h2>Selected work</h2>
          <span className="eyebrow">2022 — 2024</span>
        </div>
        <ProjectIndex onHover={(theme) => setTheme(theme || baseTheme)} />
      </section>

      <Footer />
      <div className="scroll-hint">Scroll</div>
    </>
  );
}

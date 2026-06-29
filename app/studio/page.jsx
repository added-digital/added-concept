"use client";

import useThemeOnMount from "@/app/components/useThemeOnMount";
import Footer from "@/app/components/Footer";
import { baseTheme } from "@/lib/projects";

const services = [
  {
    num: "01",
    title: "Strategy",
    items: [
      "Digital Transformation Consulting",
      "Tech Stack Recommendations",
      "Product Roadmap Strategy",
    ],
  },
  {
    num: "02",
    title: "Design",
    items: [
      "UI/UX",
      "Component Libraries & Style Guides",
      "Animation — Lottie / 3D / Web",
      "Design — Prompt Engineering",
    ],
  },
  {
    num: "03",
    title: "Development",
    items: [
      "Web Development",
      "Web Applications",
      "API Integration",
      "Webflow Premium Partner",
    ],
  },
  {
    num: "04",
    title: "Growth",
    items: [
      "On-page SEO",
      "Technical SEO",
      "SEM",
      "Conversion Optimisation",
      "Product Maintenance",
      "AEO",
    ],
  },
];

export default function Studio() {
  useThemeOnMount(baseTheme, "STUDIO");

  return (
    <>
      <section className="hero container" style={{ minHeight: "70svh" }}>
        <p className="eyebrow">Studio</p>
        <h1 style={{ fontSize: "clamp(40px, 9vw, 130px)" }}>
          We build
          <br />
          experiences
          <br />
          that grow
        </h1>
        <p className="sub">
          Founded on the belief that strategy, craft and growth belong together.
          We&apos;re a Stockholm digital studio and Webflow Premium Partner,
          working end to end so brands ship faster and look sharper.
        </p>
      </section>

      <section className="section container">
        <div className="section__head">
          <h2>What we do</h2>
          <span className="eyebrow">Four disciplines</span>
        </div>
        <div className="services">
          {services.map((s) => (
            <div className="service" key={s.num}>
              <h3>
                <span className="num">{s.num}</span>
                {s.title}
              </h3>
              <ul>
                {s.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

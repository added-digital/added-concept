"use client";

import { notFound } from "next/navigation";
import useThemeOnMount from "@/app/components/useThemeOnMount";
import TransitionLink from "@/app/components/TransitionLink";
import CaseGallery from "@/app/components/CaseGallery";
import Footer from "@/app/components/Footer";
import { projects, getProject } from "@/lib/projects";

export default function ProjectPage({ params }) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const idx = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(idx + 1) % projects.length];

  // set the scene theme + giant word for this project (also handles direct loads)
  useThemeOnMount(project.theme, project.word);

  return (
    <>
      <section className="proj-hero container">
        <p className="eyebrow" style={{ color: project.theme.accent }}>
          {project.category} · {project.year}
        </p>
        <h1>{project.title}</h1>
        <p className="sub" style={{ marginTop: 24, maxWidth: "56ch" }}>
          {project.summary}
        </p>
      </section>

      {project.cover && (
        <section className="container case-cover">
          <CaseGallery
            images={[project.cover]}
            alt={`${project.title} — cover`}
            reveal={false}
          />
        </section>
      )}

      <section className="container">
        <div className="proj-meta-grid">
          <div>
            <h4>Client</h4>
            <p>{project.client}</p>
          </div>
          <div>
            <h4>Year</h4>
            <p>{project.year}</p>
          </div>
          <div>
            <h4>Services</h4>
            <p>{project.services.join(", ")}</p>
          </div>
          <div>
            <h4>Scope</h4>
            <p>{project.deliverables.join(", ")}</p>
          </div>
        </div>

        <p className="proj-body">{project.description}</p>

        {project.caption && (
          <p className="pull-quote" style={{ color: project.theme.accent }}>
            {project.caption}
          </p>
        )}

        {project.gallery?.length > 0 && (
          <CaseGallery images={project.gallery} alt={project.title} />
        )}

        <div className="proj-nav" style={{ marginTop: "clamp(60px, 10vh, 120px)" }}>
          <TransitionLink href="/work" theme={project.theme}>
            ← All work
          </TransitionLink>
          <span>
            0{idx + 1} / 0{projects.length}
          </span>
        </div>
      </section>

      <section className="next-proj container">
        <TransitionLink href={`/work/${next.slug}`} theme={next.theme}>
          <span className="label">Next project</span>
          <span className="big" style={{ color: next.theme.accent }}>
            {next.title}
          </span>
        </TransitionLink>
      </section>

      <Footer />
    </>
  );
}

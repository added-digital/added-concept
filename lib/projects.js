// Real ADDED projects. Each carries a WebGL "theme" — two palette colors and a
// blob distortion profile — which the persistent canvas lerps to on navigation.
// Colors are [r,g,b] in 0..1 (what GLSL uniforms expect).

export const projects = [
  {
    slug: "greenely",
    title: "Greenely",
    client: "Greenely",
    year: "2024",
    services: ["Development", "Design", "Growth"],
    category: "Energy",
    summary:
      "A smart-energy platform brought to life with a website that turns complex electricity data into something people actually want to use.",
    description:
      "We rebuilt Greenely's digital presence end to end — strategy, design system, and a fast Webflow build — so the brand could scale its message about smarter, cheaper, greener energy. The result is a confident, data-forward site that converts.",
    deliverables: ["Strategy", "Design system", "Webflow development", "SEO"],
    theme: {
      colorA: [0.05, 0.32, 0.18],
      colorB: [0.42, 0.95, 0.45],
      accent: "#6bf07a",
      distort: 0.35,
      speed: 0.6,
    },
  },
  {
    slug: "supernormal-greens",
    title: "Supernormal Greens",
    client: "Supernormal",
    year: "2024",
    services: ["Design", "Development"],
    category: "Food & Health",
    summary:
      "A vivid, appetite-led storefront for a next-generation greens brand — playful motion, serious conversion.",
    description:
      "Supernormal needed a site as fresh as the product. We paired bold type with fluid motion and a frictionless path to purchase, building a Webflow experience that feels alive without sacrificing speed.",
    deliverables: ["Art direction", "Motion design", "Webflow development"],
    theme: {
      colorA: [0.18, 0.35, 0.02],
      colorB: [0.78, 0.98, 0.2],
      accent: "#c6f53a",
      distort: 0.5,
      speed: 0.85,
    },
  },
  {
    slug: "kltk",
    title: "Kungliga Tennis Klubben",
    client: "KLTK",
    year: "2023",
    services: ["Design", "Development", "Support"],
    category: "Membership System",
    summary:
      "A members' system and digital home for Sweden's Royal Tennis Club — heritage meets a modern booking experience.",
    description:
      "We designed and built a system that respects a century of tradition while making everyday club life effortless: court booking, membership, and events in one refined, reliable interface, with ongoing support.",
    deliverables: ["Product design", "System development", "Ongoing support"],
    theme: {
      colorA: [0.28, 0.12, 0.05],
      colorB: [0.95, 0.55, 0.28],
      accent: "#ff924d",
      distort: 0.28,
      speed: 0.45,
    },
  },
  {
    slug: "sylvera",
    title: "Sylvera",
    client: "Sylvera",
    year: "2023",
    services: ["Strategy", "Design", "Development", "Support"],
    category: "Climate",
    summary:
      "A trust-building platform for carbon intelligence — clarity and credibility for a category that demands both.",
    description:
      "Carbon markets run on trust. We shaped a strategy, design language, and build that communicate rigor and transparency, helping Sylvera look every bit the category leader it is.",
    deliverables: ["Strategy", "Design system", "Development", "Support"],
    theme: {
      colorA: [0.02, 0.2, 0.22],
      colorB: [0.25, 0.85, 0.78],
      accent: "#46e0cf",
      distort: 0.32,
      speed: 0.55,
    },
  },
  {
    slug: "neumeister",
    title: "Neumeister",
    client: "Neumeister",
    year: "2022",
    services: ["Development", "Design"],
    category: "Fashion",
    summary:
      "An editorial, monochrome statement for a Scandinavian fashion house — restraint as the loudest signal.",
    description:
      "For Neumeister we leaned into stark contrast and generous space: a design-led, gallery-quiet site where the garments and the craft do the talking, built pixel-tight in Webflow.",
    deliverables: ["Art direction", "Webflow development"],
    theme: {
      colorA: [0.04, 0.04, 0.05],
      colorB: [0.7, 0.7, 0.74],
      accent: "#c9c9d2",
      distort: 0.22,
      speed: 0.38,
    },
  },
];

// Theme used for non-project routes (home, work index, studio).
export const baseTheme = {
  colorA: [0.04, 0.04, 0.09],
  colorB: [0.36, 0.3, 0.92],
  accent: "#7c6cff",
  distort: 0.4,
  speed: 0.5,
};

export function getProject(slug) {
  return projects.find((p) => p.slug === slug);
}

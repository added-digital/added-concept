// Real ADDED projects. Each carries a WebGL "theme" — two palette colors and a
// blob distortion profile — which the persistent canvas lerps to on navigation.
// Colors are [r,g,b] in 0..1 (what GLSL uniforms expect).
//
// `cover` + `gallery` point at the live ADDED Webflow CDN. They render as DOM
// <img> (no CORS needed) with scroll-reveal + parallax via CaseGallery. To move
// them into WebGL textures later, host them same-origin (e.g. /public) first.

const CDN = "https://cdn.prod.website-files.com/68e76aedc11a659a28d0f81a/";

export const projects = [
  {
    slug: "greenely",
    title: "Greenely",
    client: "Greenely",
    word: "GREENELY",
    year: "2024",
    services: ["Development", "Design", "Growth"],
    category: "Energy",
    summary:
      "A smart-energy platform brought to life with a website that turns complex electricity data into something people actually want to use.",
    description:
      "We rebuilt Greenely's digital presence end to end — strategy, design system, and a fast Webflow build — so the brand could scale its message about smarter, cheaper, greener energy. The result is a confident, data-forward site that converts.",
    deliverables: ["Strategy", "Design system", "Webflow development", "SEO"],
    caption: "High voltage visuals. Low bounce rates.",
    cover: `${CDN}68f25a4f96ea6337b461097e_Frame%202085653009.webp`,
    gallery: [
      `${CDN}68f25a7acd323ec2be594833_Frame%202085652805.webp`,
      `${CDN}68f25addd04027d73296b647_Frame%202085652806.webp`,
      `${CDN}68f25b360b6dc18ee829c781_Frame%202085652808.webp`,
      `${CDN}68f25b750488eef673c9e8da_Frame%202085652806.webp`,
    ],
    theme: {
      colorA: [0.05, 0.32, 0.18],
      colorB: [0.42, 0.95, 0.45],
      accent: "#6bf07a",
      distort: 0.35,
      speed: 0.6,
      // drifting energy motes
      particle: { shape: 3, size: 0.07, fall: 0.3, sway: 0.35, spin: 0.2, opacity: 0.72 },
    },
  },
  {
    slug: "supernormal-greens",
    title: "Supernormal Greens",
    client: "Supernormal",
    word: "SUPERNORMAL",
    year: "2024",
    services: ["Design", "Development"],
    category: "Food & Health",
    summary:
      "A vivid, appetite-led storefront for a next-generation greens brand — playful motion, serious conversion.",
    description:
      "Supernormal needed a site as fresh as the product. We paired bold type with fluid motion and a frictionless path to purchase, building a Webflow experience that feels alive without sacrificing speed.",
    deliverables: ["Art direction", "Motion design", "Webflow development"],
    caption: "Not your everyday salad. Not your everyday site.",
    cover: `${CDN}68e76aedc11a659a28d0f90d_SNG-hero.webp`,
    gallery: [
      `${CDN}68e76aedc11a659a28d0f90c_globe.png`,
      `${CDN}68e76aedc11a659a28d0f8b3_Frame%202085652806.png`,
      `${CDN}68e76aedc11a659a28d0f8c3_Frame%202085652805.png`,
      `${CDN}68e76aedc11a659a28d0f910_sng-mobile.webp`,
    ],
    theme: {
      colorA: [0.18, 0.35, 0.02],
      colorB: [0.78, 0.98, 0.2],
      accent: "#c6f53a",
      distort: 0.5,
      speed: 0.85,
      // tumbling leaves
      particle: { shape: 1, size: 0.18, fall: 0.55, sway: 0.9, spin: 1.0, opacity: 0.92 },
    },
  },
  {
    slug: "kltk",
    title: "Kungliga Tennis Klubben",
    client: "KLTK",
    word: "KLTK",
    year: "2023",
    services: ["Design", "Development", "Support"],
    category: "Membership System",
    summary:
      "A members' system and digital home for Sweden's Royal Tennis Club — heritage meets a modern booking experience.",
    description:
      "We designed and built a system that respects a century of tradition while making everyday club life effortless: court booking, membership, and events in one refined, reliable interface, with ongoing support.",
    deliverables: ["Product design", "System development", "Ongoing support"],
    caption: "Runs like a rally. Never drops the ball.",
    cover: `${CDN}68e76aedc11a659a28d0f9f4_Frame%202085653081.webp`,
    gallery: [
      `${CDN}68e76aedc11a659a28d0f9f7_Frame%206.webp`,
      `${CDN}68e76aedc11a659a28d0f9f8_Frame%202085652806.webp`,
      `${CDN}68e76aedc11a659a28d0f9fb_Frame%202085652807.webp`,
      `${CDN}68e76aedc11a659a28d0f98c_Frame%208.png`,
    ],
    theme: {
      colorA: [0.28, 0.12, 0.05],
      colorB: [0.95, 0.55, 0.28],
      accent: "#ff924d",
      distort: 0.28,
      speed: 0.45,
      // floating tennis-ball orbs (rising)
      particle: { shape: 2, size: 0.13, fall: -0.22, sway: 0.25, spin: 0.15, opacity: 0.82 },
    },
  },
  {
    slug: "sylvera",
    title: "Sylvera",
    client: "Sylvera",
    word: "SYLVERA",
    year: "2023",
    services: ["Strategy", "Design", "Development", "Support"],
    category: "Climate",
    summary:
      "A trust-building platform for carbon intelligence — clarity and credibility for a category that demands both.",
    description:
      "Carbon markets run on trust. We shaped a strategy, design language, and build that communicate rigor and transparency, helping Sylvera look every bit the category leader it is.",
    deliverables: ["Strategy", "Design system", "Development", "Support"],
    caption: "Modular by design. Flexible by default.",
    cover: `${CDN}68e76aedc11a659a28d0f967_sylvera-banner.png`,
    gallery: [
      `${CDN}68e76aedc11a659a28d0f96b_sykvera.png`,
      `${CDN}68e76aedc11a659a28d0f9fe_Frame%202085652806.webp`,
      `${CDN}68e76aedc11a659a28d0f9fc_Frame%202085652807.webp`,
      `${CDN}68e76aedc11a659a28d0f9e3_gt.png`,
    ],
    theme: {
      colorA: [0.02, 0.2, 0.22],
      colorB: [0.25, 0.85, 0.78],
      accent: "#46e0cf",
      distort: 0.32,
      speed: 0.55,
      // drifting climate motes
      particle: { shape: 3, size: 0.08, fall: 0.25, sway: 0.45, spin: 0.2, opacity: 0.74 },
    },
  },
  {
    slug: "neumeister",
    title: "Neumeister",
    client: "Neumeister",
    word: "NEUMEISTER",
    year: "2022",
    services: ["Development", "Design"],
    category: "Fashion",
    summary:
      "An editorial, monochrome statement for a Scandinavian fashion house — restraint as the loudest signal.",
    description:
      "For Neumeister we leaned into stark contrast and generous space: a design-led, gallery-quiet site where the garments and the craft do the talking, built pixel-tight in Webflow.",
    deliverables: ["Art direction", "Webflow development"],
    caption: "Minimal by design. Maximal in impact.",
    cover: `${CDN}69272a194cd5bdfd357568a8_olearys-new.png`,
    gallery: [
      `${CDN}69272a22090849b27e316831_olearys-before.png`,
      `${CDN}69272a194cd5bdfd357568a8_olearys-new.png`,
    ],
    theme: {
      colorA: [0.04, 0.04, 0.05],
      colorB: [0.7, 0.7, 0.74],
      accent: "#c9c9d2",
      distort: 0.22,
      speed: 0.38,
      // monochrome rose petals
      particle: { shape: 0, size: 0.16, fall: 0.45, sway: 0.55, spin: 0.75, opacity: 0.85 },
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
  // rose petals (default / home)
  particle: { shape: 0, size: 0.17, fall: 0.5, sway: 0.6, spin: 0.8, opacity: 0.9 },
};

export function getProject(slug) {
  return projects.find((p) => p.slug === slug);
}

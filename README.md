# ADDED — WebGL concept site

A concept portfolio for **ADDED** built with **Next.js (App Router) + React Three Fiber**. A single, persistent WebGL canvas lives behind every page and **morphs between routes and projects** instead of reloading — that's the "integrated 3D transitions" centerpiece.

## Run it

This project is package-manager agnostic. Use whichever you like:

```bash
# npm
npm install
npm run dev

# or pnpm
pnpm install
pnpm dev
```

Then open http://localhost:3000.

> Recommended runtime: **Node 20 LTS or 22**. (Node 24 works, but some tooling — e.g. older corepack-shimmed pnpm — can crash on launch; see Troubleshooting.)

Build for production:

```bash
npm run build && npm start
```

## How the 3D transitions work

The trick to award-style sites like this is that the WebGL context is **never torn down** on navigation. The pieces:

1. **Persistent canvas** — `app/components/CanvasLayer.jsx` mounts one `<Canvas>` in the root layout (`app/layout.jsx`). Because the layout never unmounts, the Three.js scene survives every route change.
2. **Theme-driven scene** — `app/components/Scene.jsx` renders a full-viewport gradient (custom GLSL fbm noise) plus a noise-displaced blob. Every frame it **lerps its shader uniforms** (palette + distortion) toward a target "theme."
3. **Transition bridge** — `app/providers/TransitionProvider.jsx` holds the target theme in a ref the render loop reads, and runs a wipe overlay during navigation. `TransitionLink` sets the destination's theme *before* pushing the route, so the scene is already morphing as the wipe plays.
4. **Smooth scroll** — `app/components/SmoothScroll.jsx` (Lenis) writes scroll progress/velocity + pointer into a tiny shared store (`lib/store.js`). The scene reads those to drive blob distortion, rotation and palette shift — no React re-renders in the hot path.

Each project in `lib/projects.js` carries its own `theme` (two palette colors + distortion + accent), so navigating between projects smoothly recolours and reshapes the same scene.

## Structure

```
app/
  layout.jsx                 root layout: providers + persistent canvas + nav
  page.jsx                   home (hero + project index)
  work/page.jsx              work grid
  work/[slug]/page.jsx       project detail (+ next-project transition)
  studio/page.jsx            services
  not-found.jsx
  providers/
    TransitionProvider.jsx   target theme + navigation/wipe orchestration
  components/
    CanvasLayer.jsx          the single persistent <Canvas>
    Scene.jsx                gradient + blob, uniform lerping, scroll reactions
    shaders.js               GLSL: simplex noise, background, blob
    SmoothScroll.jsx         Lenis -> shared store
    TransitionLink.jsx       animated nav link
    Nav.jsx / Footer.jsx / ProjectIndex.jsx / useThemeOnMount.js
lib/
  projects.js                real ADDED projects + per-project WebGL themes
  store.js                   scroll/pointer shared state
```

## Make it yours

- **Add a project**: append to `projects` in `lib/projects.js` with a `theme`. The index, grid, routes and transitions pick it up automatically.
- **Tune the look**: palette is per-project in `lib/projects.js`; the blob/gradient math lives in `app/components/shaders.js`; motion damping is in `Scene.jsx`.
- **Swap in real imagery**: the work grid uses CSS gradient placeholders. To texture the WebGL planes with real project images, serve them same-origin (or CORS-enabled) to avoid tainting the WebGL context.

## Troubleshooting

**`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING` when running pnpm** — this is a corepack/pnpm + Node mismatch, not a project problem (pnpm crashes before it reads anything here). Fix with either:

```bash
# update corepack, then pin pnpm
npm install -g corepack@latest
corepack use pnpm@10

# OR install pnpm standalone (bypasses the broken corepack shim)
npm install -g pnpm@latest

# OR just use npm
npm install && npm run dev
```

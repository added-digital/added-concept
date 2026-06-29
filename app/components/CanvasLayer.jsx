"use client";

import { Canvas } from "@react-three/fiber";
import Scene from "@/app/components/Scene";

/**
 * The single, persistent WebGL canvas. It lives in the root layout and is
 * never unmounted, so the 3D scene survives route changes — that's what makes
 * the transitions feel "integrated" rather than reloaded.
 */
export default function CanvasLayer() {
  return (
    <div className="canvas-layer">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

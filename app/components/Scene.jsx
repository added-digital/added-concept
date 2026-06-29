"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTransition } from "@/app/providers/TransitionProvider";
import { scroll, pointer } from "@/lib/store";
import { BG_VERT, BG_FRAG, BLOB_VERT, BLOB_FRAG } from "@/app/components/shaders";

// frame-rate independent smoothing
function damp(current, target, lambda, dt) {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * dt));
}

/**
 * The whole persistent scene: a full-viewport gradient plane + a displaced
 * blob. Both read the live target theme from the transition context and lerp
 * their uniforms toward it every frame, so navigation morphs the visuals.
 */
export default function Scene() {
  const { themeRef } = useTransition();
  const { size } = useThree();

  const blobRef = useRef();
  const groupRef = useRef();

  // smoothed live values
  const sm = useRef({ scroll: 0, px: 0, py: 0, distort: 0.4, vel: 0 });

  // current (animating) palette colors
  const cur = useRef({
    a: new THREE.Color(0.04, 0.04, 0.09),
    b: new THREE.Color(0.36, 0.3, 0.92),
  });

  const bgUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uAspect: { value: 1 },
      uColorA: { value: new THREE.Color(0.04, 0.04, 0.09) },
      uColorB: { value: new THREE.Color(0.36, 0.3, 0.92) },
      uPointer: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  const blobUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uDistort: { value: 0.4 },
      uColorA: { value: new THREE.Color(0.04, 0.04, 0.09) },
      uColorB: { value: new THREE.Color(0.36, 0.3, 0.92) },
    }),
    []
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const theme = themeRef.current;

    // --- smooth the live inputs ---
    sm.current.scroll = damp(sm.current.scroll, scroll.progress, 4, dt);
    sm.current.px = damp(sm.current.px, pointer.x, 3, dt);
    sm.current.py = damp(sm.current.py, pointer.y, 3, dt);
    sm.current.distort = damp(sm.current.distort, theme.distort ?? 0.4, 2.5, dt);
    // clamp the raw velocity, then smooth it — prevents geometry spiking when a
    // route change makes Lenis report a momentary huge scroll velocity.
    const clampedVel = Math.min(Math.abs(scroll.velocity) * 0.02, 0.25);
    sm.current.vel = damp(sm.current.vel, clampedVel, 5, dt);

    // --- morph palette toward the target theme ---
    const targetA = theme.colorA || [0.04, 0.04, 0.09];
    const targetB = theme.colorB || [0.36, 0.3, 0.92];
    const k = 1 - Math.exp(-2.5 * dt);
    cur.current.a.lerp(new THREE.Color(targetA[0], targetA[1], targetA[2]), k);
    cur.current.b.lerp(new THREE.Color(targetB[0], targetB[1], targetB[2]), k);

    // --- push to background uniforms ---
    bgUniforms.uTime.value = t;
    bgUniforms.uScroll.value = sm.current.scroll;
    bgUniforms.uAspect.value = size.height > 0 ? size.width / size.height : 1;
    bgUniforms.uColorA.value.copy(cur.current.a);
    bgUniforms.uColorB.value.copy(cur.current.b);
    bgUniforms.uPointer.value.set(sm.current.px, sm.current.py);

    // --- push to blob uniforms ---
    blobUniforms.uTime.value = t;
    blobUniforms.uScroll.value = sm.current.scroll + sm.current.vel;
    blobUniforms.uDistort.value = sm.current.distort;
    blobUniforms.uColorA.value.copy(cur.current.a);
    blobUniforms.uColorB.value.copy(cur.current.b);

    // --- gentle, scroll + pointer reactive motion on the blob ---
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.12 + sm.current.px * 0.4;
      groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.15 + sm.current.py * 0.3;
      const s = 1 - sm.current.scroll * 0.18;
      groupRef.current.scale.setScalar(s);
      // drift slightly down and back as the page scrolls
      groupRef.current.position.y = -sm.current.scroll * 1.2;
    }
  });

  return (
    <>
      {/* fullscreen gradient background — clip-space quad, always fills canvas */}
      <mesh renderOrder={-1} frustumCulled={false}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          vertexShader={BG_VERT}
          fragmentShader={BG_FRAG}
          uniforms={bgUniforms}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>

      {/* displaced blob */}
      <group ref={groupRef}>
        <mesh ref={blobRef}>
          <icosahedronGeometry args={[1.35, 14]} />
          <shaderMaterial
            vertexShader={BLOB_VERT}
            fragmentShader={BLOB_FRAG}
            uniforms={blobUniforms}
          />
        </mesh>
      </group>
    </>
  );
}

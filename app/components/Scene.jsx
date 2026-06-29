"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useTransition } from "@/app/providers/TransitionProvider";
import { scroll, pointer } from "@/lib/store";
import {
  BG_VERT,
  BG_FRAG,
  PARTICLE_VERT,
  PARTICLE_FRAG,
} from "@/app/components/shaders";

const COUNT = 550;

// frame-rate independent smoothing
function damp(current, target, lambda, dt) {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * dt));
}

/**
 * Persistent scene: a full-viewport gradient + an instanced particle field.
 * Both lerp their palette toward the live theme. The particle *shape* and
 * motion come from the transition context's lookRef, which only changes on
 * real navigation (under the wipe), so shapes never pop during hover.
 */
export default function Scene() {
  const { themeRef, lookRef, word, accent } = useTransition();
  const { size } = useThree();

  const textRef = useRef();

  const sm = useRef({
    scroll: 0,
    px: 0,
    py: 0,
    size: 0.17,
    fall: 0.5,
    sway: 0.6,
    spin: 0.8,
    opacity: 0.9,
  });

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

  const pUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uSize: { value: 0.17 },
      uFall: { value: 0.5 },
      uSway: { value: 0.6 },
      uSpin: { value: 0.8 },
      uShape: { value: 0 },
      uOpacity: { value: 0.9 },
      uColorA: { value: new THREE.Color(0.04, 0.04, 0.09) },
      uColorB: { value: new THREE.Color(0.36, 0.3, 0.92) },
    }),
    []
  );

  // Instanced geometry: one quad, COUNT instances with random pos/seed/scale.
  const geometry = useMemo(() => {
    const base = new THREE.PlaneGeometry(1, 1);
    const g = new THREE.InstancedBufferGeometry();
    g.index = base.index;
    g.setAttribute("position", base.attributes.position);
    g.setAttribute("uv", base.attributes.uv);

    const aPos = new Float32Array(COUNT * 3);
    const aSeed = new Float32Array(COUNT);
    const aScale = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      aPos[i * 3 + 0] = (Math.random() - 0.5) * 12; // x
      aPos[i * 3 + 1] = (Math.random() - 0.5) * 10; // y
      aPos[i * 3 + 2] = Math.random() * -4.5 + 1; // z (mostly behind focal plane)
      aSeed[i] = Math.random();
      aScale[i] = Math.random();
    }
    g.setAttribute("aPos", new THREE.InstancedBufferAttribute(aPos, 3));
    g.setAttribute("aSeed", new THREE.InstancedBufferAttribute(aSeed, 1));
    g.setAttribute("aScale", new THREE.InstancedBufferAttribute(aScale, 1));
    g.instanceCount = COUNT;
    return g;
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const theme = themeRef.current;
    const look = lookRef.current || {};

    // smooth live inputs
    sm.current.scroll = damp(sm.current.scroll, scroll.progress, 4, dt);
    sm.current.px = damp(sm.current.px, pointer.x, 3, dt);
    sm.current.py = damp(sm.current.py, pointer.y, 3, dt);

    // smooth the particle motion toward the current page's profile
    sm.current.size = damp(sm.current.size, look.size ?? 0.17, 3, dt);
    sm.current.fall = damp(sm.current.fall, look.fall ?? 0.5, 3, dt);
    sm.current.sway = damp(sm.current.sway, look.sway ?? 0.6, 3, dt);
    sm.current.spin = damp(sm.current.spin, look.spin ?? 0.8, 3, dt);
    sm.current.opacity = damp(sm.current.opacity, look.opacity ?? 0.9, 4, dt);

    // morph palette
    const tA = theme.colorA || [0.04, 0.04, 0.09];
    const tB = theme.colorB || [0.36, 0.3, 0.92];
    const k = 1 - Math.exp(-2.5 * dt);
    cur.current.a.lerp(new THREE.Color(tA[0], tA[1], tA[2]), k);
    cur.current.b.lerp(new THREE.Color(tB[0], tB[1], tB[2]), k);

    // background
    bgUniforms.uTime.value = t;
    bgUniforms.uScroll.value = sm.current.scroll;
    bgUniforms.uAspect.value = size.height > 0 ? size.width / size.height : 1;
    bgUniforms.uColorA.value.copy(cur.current.a);
    bgUniforms.uColorB.value.copy(cur.current.b);
    bgUniforms.uPointer.value.set(sm.current.px, sm.current.py);

    // particles
    pUniforms.uTime.value = t;
    pUniforms.uScroll.value = sm.current.scroll;
    pUniforms.uPointer.value.set(sm.current.px, sm.current.py);
    pUniforms.uSize.value = sm.current.size;
    pUniforms.uFall.value = sm.current.fall;
    pUniforms.uSway.value = sm.current.sway;
    pUniforms.uSpin.value = sm.current.spin;
    pUniforms.uOpacity.value = sm.current.opacity;
    pUniforms.uShape.value = look.shape ?? 0; // discrete — set under the wipe
    pUniforms.uColorA.value.copy(cur.current.a);
    pUniforms.uColorB.value.copy(cur.current.b);

    // giant word: parallax depth drift — recedes + lifts + scales as you scroll
    if (textRef.current) {
      const s = sm.current.scroll;
      textRef.current.position.z = -3.5 - s * 2.2;
      textRef.current.position.y = s * 2.2;
      textRef.current.position.x = sm.current.px * 0.5;
      textRef.current.rotation.y = sm.current.px * 0.05;
      textRef.current.scale.setScalar(1 + s * 0.14);
    }
  });

  return (
    <>
      {/* giant per-page word, sitting deep behind the particles */}
      <group ref={textRef} position={[0, 0, -3.5]}>
        <Text
          key={word}
          fontSize={2.4}
          anchorX="center"
          anchorY="middle"
          letterSpacing={-0.04}
          color={accent}
          fillOpacity={0.3}
          renderOrder={-5}
        >
          {word}
        </Text>
      </group>

      {/* fullscreen gradient background — clip-space quad, always fills canvas.
          renderOrder -10 so it paints before the word + particles. */}
      <mesh renderOrder={-10} frustumCulled={false}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          vertexShader={BG_VERT}
          fragmentShader={BG_FRAG}
          uniforms={bgUniforms}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>

      {/* per-page particle field */}
      <mesh geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          vertexShader={PARTICLE_VERT}
          fragmentShader={PARTICLE_FRAG}
          uniforms={pUniforms}
          transparent
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

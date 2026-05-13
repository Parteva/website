'use client';

import { useRef, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { ClimbingFigure } from './ClimbingFigure';

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/* ─── Rope ──────────────────────────────────────────────── */
function Rope() {
  const geo = useMemo(() => {
    const pts = [
      new THREE.Vector3(0, -7, 0),
      new THREE.Vector3(-0.04, -3.5, 0.02),
      new THREE.Vector3(0.03,  0,    0),
      new THREE.Vector3(-0.02, 3.5, -0.02),
      new THREE.Vector3(0,     7,    0),
    ];
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 160, 0.032, 10, false);
  }, []);

  return (
    <mesh geometry={geo} castShadow>
      <meshStandardMaterial color="#7a4e1c" roughness={0.55} metalness={0.06} />
    </mesh>
  );
}

/* ─── Triumph star burst (reaches top) ──────────────────── */
function TriumphBurst({ progressRef }: { progressRef: React.RefObject<number> }) {
  const groupRef  = useRef<THREE.Group>(null);
  const innerRef  = useRef<THREE.Group>(null);
  const elapsed   = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const p       = progressRef.current ?? 0;
    const triumphP = Math.max(0, Math.min(1, (p - 0.88) / 0.12));
    const eT      = easeInOutCubic(triumphP);

    /* Accumulate time only while burst is visible */
    if (eT > 0.02) elapsed.current += delta;
    else elapsed.current = 0;

    const t = elapsed.current;

    /* Outer group: slow continuous rotation + scale */
    groupRef.current.scale.setScalar(eT);
    groupRef.current.rotation.z = t * 0.55;
    groupRef.current.position.y = 3.4;

    /* Inner group: faster counter-rotation for layered feel */
    if (innerRef.current) innerRef.current.rotation.z = -t * 1.1;

    /* Pulsing opacity */
    const pulse = eT * (0.50 + Math.sin(t * 3.5) * 0.14);
    groupRef.current.children.forEach((child) => {
      const segs = child as THREE.LineSegments;
      const mat  = segs.material as THREE.LineBasicMaterial;
      if (mat?.isMaterial) mat.opacity = pulse;
    });
  });

  /* Outer 12-ray burst */
  const outerGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const v: number[] = [];
    const n = 12;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      v.push(0.10, 0, 0, Math.cos(a) * 0.68, Math.sin(a) * 0.68, 0);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(v), 3));
    return geo;
  }, []);

  /* Inner 6-ray burst (offset angle, shorter) */
  const innerGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const v: number[] = [];
    const n = 6;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + Math.PI / 6;
      v.push(0.07, 0, 0, Math.cos(a) * 0.38, Math.sin(a) * 0.38, 0);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(v), 3));
    return geo;
  }, []);

  return (
    <group ref={groupRef} scale={0}>
      <lineSegments geometry={outerGeo}>
        <lineBasicMaterial color="#b88020" transparent opacity={0} />
      </lineSegments>
      <group ref={innerRef}>
        <lineSegments geometry={innerGeo}>
          <lineBasicMaterial color="#d4a840" transparent opacity={0} />
        </lineSegments>
      </group>
    </group>
  );
}

/* ─── Scene ─────────────────────────────────────────────── */
function SceneContent({ progressRef }: { progressRef: React.RefObject<number> }) {
  const { camera } = useThree();

  useFrame(() => {
    const p = progressRef.current ?? 0;

    // Camera rises with figure, stays left so figure reads on right side of screen
    const rise = easeInOutCubic(Math.min(p / 0.88, 1)) * 1.4;
    camera.position.set(
      -1.2,
       0.0 + rise,
       7.8,
    );
    camera.lookAt(-0.4, 0.8 + rise * 0.55, 0);
  });

  return (
    <>
      {/* Main key: warm soft from top-left */}
      <directionalLight
        position={[-3, 10, 5]}
        intensity={3.2}
        color="#fff8f0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      {/* Fill: right side */}
      <directionalLight position={[4, 2, 4]} intensity={1.4} color="#f0e8d8" />
      {/* Gold bounce from below */}
      <directionalLight position={[0, -5, 2]} intensity={0.55} color="#d4a840" />
      {/* Ambient */}
      <ambientLight intensity={0.50} color="#f8f3ea" />

      <Rope />
      <ClimbingFigure progressRef={progressRef} />
      <TriumphBurst progressRef={progressRef} />

      {/* Ground shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -7, 0]} receiveShadow>
        <planeGeometry args={[16, 16]} />
        <shadowMaterial transparent opacity={0.10} />
      </mesh>
    </>
  );
}

/* ─── Main export ───────────────────────────────────────── */
interface HeroSceneProps {
  outerRef: React.RefObject<HTMLElement | null>;
}

export function HeroScene({ outerRef }: HeroSceneProps) {
  const progressRef = useRef<number>(0);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      progressRef.current = 1;
      return;
    }

    let rafId: number;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      progressRef.current = total > 0 ? Math.max(0, Math.min(1, -rect.top / total)) : 0;
      rafId = requestAnimationFrame(update);
    };
    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [outerRef]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <Canvas
      dpr={[1, isMobile ? 1.5 : 2]}
      camera={{ position: [-1.2, 0, 7.8], fov: 44, near: 0.1, far: 60 }}
      shadows
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <PerformanceMonitor onDecline={() => {}} />
      <Suspense fallback={null}>
        <SceneContent progressRef={progressRef} />
      </Suspense>
    </Canvas>
  );
}

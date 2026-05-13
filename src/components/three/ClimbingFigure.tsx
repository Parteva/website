import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOutCubic   = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const SKIN  = '#2a1508';
const SHIRT = '#1a2038';
const PANTS = '#0f1216';
const SHOE  = '#0c0c10';

function SM({ c, r = 0.68, m = 0.02 }: { c: string; r?: number; m?: number }) {
  return <meshStandardMaterial color={c} roughness={r} metalness={m} />;
}

function GripHand({ side }: { side: 'left' | 'right' }) {
  const flip = side === 'left' ? 1 : -1;
  const fingers = [
    { x: -0.036, len: 0.068, w: 0.012 },
    { x: -0.011, len: 0.077, w: 0.013 },
    { x:  0.015, len: 0.071, w: 0.012 },
    { x:  0.038, len: 0.056, w: 0.010 },
  ] as const;

  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[0.108, 0.088, 0.044]} />
        <SM c={SKIN} />
      </mesh>
      {fingers.map((f, i) => (
        <group key={i} position={[f.x, -0.075, 0.004]} rotation={[0.44, 0, 0]}>
          <mesh position={[0, -f.len * 0.28, 0]} castShadow>
            <cylinderGeometry args={[f.w, f.w * 0.87, f.len * 0.52, 6]} />
            <SM c={SKIN} />
          </mesh>
          <group position={[0, -f.len * 0.55, 0]} rotation={[0.44, 0, 0]}>
            <mesh position={[0, -f.len * 0.22, 0]} castShadow>
              <cylinderGeometry args={[f.w * 0.82, f.w * 0.70, f.len * 0.40, 6]} />
              <SM c={SKIN} />
            </mesh>
          </group>
        </group>
      ))}
      <group position={[flip * -0.065, -0.020, 0.014]} rotation={[0.18, 0, flip * 0.72]}>
        <mesh position={[0, -0.026, 0]} castShadow>
          <cylinderGeometry args={[0.014, 0.012, 0.052, 6]} />
          <SM c={SKIN} />
        </mesh>
        <group position={[0, -0.053, 0]} rotation={[0.30, 0, 0]}>
          <mesh position={[0, -0.015, 0]} castShadow>
            <cylinderGeometry args={[0.012, 0.010, 0.032, 6]} />
            <SM c={SKIN} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export function ClimbingFigure({ progressRef }: { progressRef: React.RefObject<number> }) {
  const maxP = useRef(0);

  const rootRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  const lArmRef = useRef<THREE.Group>(null);
  const rArmRef = useRef<THREE.Group>(null);
  const lElbRef = useRef<THREE.Group>(null);
  const rElbRef = useRef<THREE.Group>(null);

  const lThRef  = useRef<THREE.Group>(null);
  const rThRef  = useRef<THREE.Group>(null);
  const lShRef  = useRef<THREE.Group>(null);
  const rShRef  = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!rootRef.current) return;

    const cur = progressRef.current ?? 0;
    maxP.current = Math.max(maxP.current, cur);
    const mp = maxP.current;

    const cP = easeOutCubic(Math.max(0, Math.min(1, (mp - 0.03) / 0.84)));
    rootRef.current.position.y = lerp(-3.2, 3.4, cP);

    const ph  = mp * 37.7;
    const triP = easeInOutCubic(Math.max(0, Math.min(1, (mp - 0.88) / 0.10)));

    /* Body: leans forward while climbing, upright at triumph */
    if (bodyRef.current) {
      bodyRef.current.rotation.x = lerp(0.14, 0, triP);
      bodyRef.current.rotation.z = Math.sin(ph * 0.9) * 0.017 * (1 - triP);
    }

    /* Head: looks UP while climbing, forward at triumph */
    if (headRef.current) {
      headRef.current.rotation.x = lerp(-0.28, 0.05, triP);
      headRef.current.rotation.z = Math.sin(ph * 0.9) * 0.010 * (1 - triP);
    }

    /* Arms */
    const lAx = lerp(0, Math.PI * 0.80, Math.sin(ph) * 0.5 + 0.5);
    const rAx = lerp(0, Math.PI * 0.80, -Math.sin(ph) * 0.5 + 0.5);
    if (lArmRef.current) {
      lArmRef.current.rotation.x = lerp(lAx, -Math.PI * 0.10, triP);
      lArmRef.current.rotation.z = lerp(0.22, -0.32, triP);
    }
    if (rArmRef.current) {
      rArmRef.current.rotation.x = lerp(rAx, -Math.PI * 0.10, triP);
      rArmRef.current.rotation.z = lerp(-0.22, 0.32, triP);
    }

    /* Elbows */
    const lEx = lerp(Math.PI * 0.06, Math.PI * 0.26, Math.sin(ph) * 0.5 + 0.5);
    const rEx = lerp(Math.PI * 0.06, Math.PI * 0.26, -Math.sin(ph) * 0.5 + 0.5);
    if (lElbRef.current) lElbRef.current.rotation.x = lerp(lEx, Math.PI * 0.04, triP);
    if (rElbRef.current) rElbRef.current.rotation.x = lerp(rEx, Math.PI * 0.04, triP);

    /* Legs */
    const lTx = lerp(Math.PI * 0.10, Math.PI * 0.52, -Math.sin(ph) * 0.5 + 0.5);
    const rTx = lerp(Math.PI * 0.10, Math.PI * 0.52,  Math.sin(ph) * 0.5 + 0.5);
    if (lThRef.current) {
      lThRef.current.rotation.x = lerp(lTx, Math.PI * 0.04, triP);
      lThRef.current.rotation.z = 0.18;
    }
    if (rThRef.current) {
      rThRef.current.rotation.x = lerp(rTx, Math.PI * 0.04, triP);
      rThRef.current.rotation.z = -0.18;
    }
    const lSx = lerp(-Math.PI * 0.06, -Math.PI * 0.44,  Math.sin(ph + 0.5) * 0.5 + 0.5);
    const rSx = lerp(-Math.PI * 0.06, -Math.PI * 0.44, -Math.sin(ph + 0.5) * 0.5 + 0.5);
    if (lShRef.current) lShRef.current.rotation.x = lerp(lSx, 0, triP);
    if (rShRef.current) rShRef.current.rotation.x = lerp(rSx, 0, triP);
  });

  return (
    <group ref={rootRef} scale={1.3} position={[0, -3.2, 0]}>
      <group ref={bodyRef}>

        {/* ── HEAD ─────────────────────────────────────────── */}
        <group ref={headRef} position={[0, 0.93, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.192, 14, 11]} />
            <SM c={SKIN} />
          </mesh>
          {/* Jaw */}
          <mesh position={[0, -0.10, 0.06]} castShadow>
            <sphereGeometry args={[0.115, 10, 8]} />
            <SM c={SKIN} />
          </mesh>
        </group>

        {/* ── NECK ─────────────────────────────────────────── */}
        <mesh position={[0, 0.695, 0]} castShadow>
          <cylinderGeometry args={[0.080, 0.094, 0.18, 9]} />
          <SM c={SKIN} />
        </mesh>

        {/* ── TORSO ────────────────────────────────────────── */}
        {/* Chest (wide) */}
        <mesh position={[0, 0.44, 0.005]} castShadow>
          <boxGeometry args={[0.40, 0.14, 0.20]} />
          <SM c={SHIRT} />
        </mesh>
        {/* Mid torso */}
        <mesh position={[0, 0.27, 0.005]} castShadow>
          <boxGeometry args={[0.36, 0.30, 0.19]} />
          <SM c={SHIRT} />
        </mesh>
        {/* Waist (narrower) */}
        <mesh position={[0, 0.07, 0.002]} castShadow>
          <boxGeometry args={[0.30, 0.12, 0.18]} />
          <SM c={SHIRT} />
        </mesh>

        {/* ── HIPS ─────────────────────────────────────────── */}
        <mesh position={[0, -0.09, 0]} castShadow>
          <boxGeometry args={[0.32, 0.18, 0.18]} />
          <SM c={PANTS} />
        </mesh>

        {/* ── LEFT ARM ─────────────────────────────────────── */}
        <group ref={lArmRef} position={[-0.178, 0.50, 0]} rotation={[0, 0, 0.22]}>
          {/* Shoulder cap */}
          <mesh position={[0, 0.02, 0]} castShadow>
            <sphereGeometry args={[0.074, 9, 7]} />
            <SM c={SHIRT} />
          </mesh>
          {/* Upper arm */}
          <mesh position={[0, 0.20, 0]} castShadow>
            <cylinderGeometry args={[0.063, 0.052, 0.36, 9]} />
            <SM c={SHIRT} />
          </mesh>
          {/* Elbow joint + forearm */}
          <group ref={lElbRef} position={[0, 0.38, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.055, 8, 6]} />
              <SM c={SKIN} />
            </mesh>
            <mesh position={[0, 0.145, 0]} castShadow>
              <cylinderGeometry args={[0.050, 0.038, 0.29, 9]} />
              <SM c={SKIN} />
            </mesh>
            <group position={[0, 0.305, 0]}>
              <GripHand side="left" />
            </group>
          </group>
        </group>

        {/* ── RIGHT ARM ────────────────────────────────────── */}
        <group ref={rArmRef} position={[0.178, 0.50, 0]} rotation={[0, 0, -0.22]}>
          <mesh position={[0, 0.02, 0]} castShadow>
            <sphereGeometry args={[0.074, 9, 7]} />
            <SM c={SHIRT} />
          </mesh>
          <mesh position={[0, 0.20, 0]} castShadow>
            <cylinderGeometry args={[0.063, 0.052, 0.36, 9]} />
            <SM c={SHIRT} />
          </mesh>
          <group ref={rElbRef} position={[0, 0.38, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.055, 8, 6]} />
              <SM c={SKIN} />
            </mesh>
            <mesh position={[0, 0.145, 0]} castShadow>
              <cylinderGeometry args={[0.050, 0.038, 0.29, 9]} />
              <SM c={SKIN} />
            </mesh>
            <group position={[0, 0.305, 0]}>
              <GripHand side="right" />
            </group>
          </group>
        </group>

        {/* ── LEFT LEG ─────────────────────────────────────── */}
        <group ref={lThRef} position={[-0.11, -0.20, 0]}>
          {/* Hip joint */}
          <mesh castShadow>
            <sphereGeometry args={[0.080, 8, 6]} />
            <SM c={PANTS} />
          </mesh>
          {/* Thigh */}
          <mesh position={[0, -0.22, 0]} castShadow>
            <cylinderGeometry args={[0.086, 0.070, 0.42, 9]} />
            <SM c={PANTS} />
          </mesh>
          <group ref={lShRef} position={[0, -0.43, 0]}>
            {/* Knee */}
            <mesh castShadow>
              <sphereGeometry args={[0.070, 8, 6]} />
              <SM c={PANTS} />
            </mesh>
            {/* Shin */}
            <mesh position={[0, -0.175, 0]} castShadow>
              <cylinderGeometry args={[0.064, 0.048, 0.35, 9]} />
              <SM c={PANTS} />
            </mesh>
            {/* Shoe */}
            <group position={[0.022, -0.385, 0.038]}>
              <mesh castShadow>
                <boxGeometry args={[0.092, 0.064, 0.202]} />
                <SM c={SHOE} />
              </mesh>
              <mesh position={[0, -0.042, 0.006]} castShadow>
                <boxGeometry args={[0.098, 0.016, 0.212]} />
                <SM c="#1c1c22" r={0.88} />
              </mesh>
            </group>
          </group>
        </group>

        {/* ── RIGHT LEG ────────────────────────────────────── */}
        <group ref={rThRef} position={[0.11, -0.20, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.080, 8, 6]} />
            <SM c={PANTS} />
          </mesh>
          <mesh position={[0, -0.22, 0]} castShadow>
            <cylinderGeometry args={[0.086, 0.070, 0.42, 9]} />
            <SM c={PANTS} />
          </mesh>
          <group ref={rShRef} position={[0, -0.43, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.070, 8, 6]} />
              <SM c={PANTS} />
            </mesh>
            <mesh position={[0, -0.175, 0]} castShadow>
              <cylinderGeometry args={[0.064, 0.048, 0.35, 9]} />
              <SM c={PANTS} />
            </mesh>
            <group position={[-0.022, -0.385, 0.038]}>
              <mesh castShadow>
                <boxGeometry args={[0.092, 0.064, 0.202]} />
                <SM c={SHOE} />
              </mesh>
              <mesh position={[0, -0.042, 0.006]} castShadow>
                <boxGeometry args={[0.098, 0.016, 0.212]} />
                <SM c="#1c1c22" r={0.88} />
              </mesh>
            </group>
          </group>
        </group>

      </group>
    </group>
  );
}

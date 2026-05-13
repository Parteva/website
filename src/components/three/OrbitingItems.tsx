import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ─── Materials ─────────────────────────────────────────── */
const mats = {
  bag:    { color: '#8B6B45', roughness: 0.82, metalness: 0 },
  phone:  { color: '#1a1410', roughness: 0.5,  metalness: 0.15 },
  screen: { color: '#0d1a2e', roughness: 0.3,  metalness: 0.1, emissive: '#1a3a5c', emissiveIntensity: 0.4 },
  card:   { color: '#c9a961', roughness: 0.55, metalness: 0.2 },
  label:  { color: '#f5f0e8', roughness: 0.9,  metalness: 0 },
  string: { color: '#4a4137', roughness: 0.9,  metalness: 0 },
  box2:   { color: '#5a3a25', roughness: 0.85, metalness: 0 },
  tape:   { color: '#8a7e6f', roughness: 0.75, metalness: 0 },
  torus:  { color: '#3a2a1a', roughness: 0.7,  metalness: 0.05 },
};

/* ─── Shopping Bag ──────────────────────────────────────── */
function Bag({ pos }: { pos: [number, number, number] }) {
  const g = useRef<THREE.Group>(null);
  return (
    <group ref={g} position={pos}>
      {/* Body */}
      <mesh castShadow>
        <boxGeometry args={[0.7, 0.9, 0.3]} />
        <meshStandardMaterial {...mats.bag} />
      </mesh>
      {/* Handle loop */}
      <mesh position={[0, 0.62, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.18, 0.025, 6, 12, Math.PI]} />
        <meshStandardMaterial {...mats.string} />
      </mesh>
      {/* Bottom gusset */}
      <mesh position={[0, -0.42, 0]}>
        <boxGeometry args={[0.7, 0.08, 0.38]} />
        <meshStandardMaterial color="#6a4f35" roughness={0.9} metalness={0} />
      </mesh>
    </group>
  );
}

/* ─── Phone ─────────────────────────────────────────────── */
function Phone({ pos }: { pos: [number, number, number] }) {
  return (
    <group position={pos} rotation={[0.1, 0.3, 0]}>
      {/* Body */}
      <mesh castShadow>
        <boxGeometry args={[0.38, 0.78, 0.05]} />
        <meshStandardMaterial {...mats.phone} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0, 0.026]}>
        <boxGeometry args={[0.32, 0.68, 0.005]} />
        <meshStandardMaterial {...mats.screen} />
      </mesh>
      {/* Home bar */}
      <mesh position={[0, -0.3, 0.03]}>
        <boxGeometry args={[0.1, 0.012, 0.002]} />
        <meshStandardMaterial color="#8a7e6f" roughness={0.5} metalness={0} />
      </mesh>
    </group>
  );
}

/* ─── Credit Card ───────────────────────────────────────── */
function Card({ pos }: { pos: [number, number, number] }) {
  return (
    <group position={pos} rotation={[0.2, -0.4, 0.1]}>
      <mesh castShadow>
        <boxGeometry args={[0.85, 0.54, 0.018]} />
        <meshStandardMaterial {...mats.card} />
      </mesh>
      {/* Chip */}
      <mesh position={[-0.22, 0.06, 0.01]}>
        <boxGeometry args={[0.15, 0.12, 0.008]} />
        <meshStandardMaterial color="#c9a961" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Strip lines */}
      <mesh position={[0.1, -0.14, 0.01]}>
        <boxGeometry args={[0.5, 0.04, 0.002]} />
        <meshStandardMaterial color="#a88840" roughness={0.4} metalness={0.2} />
      </mesh>
    </group>
  );
}

/* ─── Price Tag ─────────────────────────────────────────── */
function PriceTag({ pos }: { pos: [number, number, number] }) {
  return (
    <group position={pos} rotation={[0, 0.5, 0.2]}>
      {/* Tag body */}
      <mesh castShadow>
        <boxGeometry args={[0.35, 0.55, 0.018]} />
        <meshStandardMaterial {...mats.label} />
      </mesh>
      {/* Hole */}
      <mesh position={[0, 0.22, 0]}>
        <torusGeometry args={[0.04, 0.012, 6, 8]} />
        <meshStandardMaterial {...mats.string} />
      </mesh>
      {/* String */}
      <mesh position={[0, 0.38, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.3, 4]} />
        <meshStandardMaterial {...mats.string} />
      </mesh>
      {/* Lines on tag */}
      {[0.06, -0.04, -0.14].map((y, i) => (
        <mesh key={i} position={[0, y, 0.01]}>
          <boxGeometry args={[0.22, 0.018, 0.003]} />
          <meshStandardMaterial color="#4a4137" roughness={0.9} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Small Box ─────────────────────────────────────────── */
function SmallBox({ pos }: { pos: [number, number, number] }) {
  return (
    <group position={pos} rotation={[0.1, 0.8, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.5, 0.38, 0.5]} />
        <meshStandardMaterial {...mats.box2} />
      </mesh>
      {/* Lid */}
      <mesh position={[0, 0.21, 0]}>
        <boxGeometry args={[0.5, 0.04, 0.5]} />
        <meshStandardMaterial color="#4a2e1a" roughness={0.8} metalness={0} />
      </mesh>
      {/* Ribbon */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.06, 0.42, 0.52]} />
        <meshStandardMaterial {...mats.tape} />
      </mesh>
    </group>
  );
}

/* ─── Tape Roll ─────────────────────────────────────────── */
function TapeRoll({ pos }: { pos: [number, number, number] }) {
  return (
    <group position={pos} rotation={[Math.PI / 2, 0, 0.3]}>
      {/* Outer torus */}
      <mesh castShadow>
        <torusGeometry args={[0.28, 0.1, 8, 16]} />
        <meshStandardMaterial {...mats.torus} />
      </mesh>
      {/* Inner core cylinder */}
      <mesh>
        <cylinderGeometry args={[0.12, 0.12, 0.22, 8]} />
        <meshStandardMaterial color="#2a1a0a" roughness={0.9} metalness={0} />
      </mesh>
    </group>
  );
}

/* ─── StarBurst Bag (extra) ─────────────────────────────── */
function EcoTag({ pos }: { pos: [number, number, number] }) {
  return (
    <group position={pos} rotation={[-0.3, -0.6, 0.15]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 6]} />
        <meshStandardMaterial color="#c9a961" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.04, 6]} />
        <meshStandardMaterial color="#0c0a09" roughness={0.9} metalness={0} />
      </mesh>
    </group>
  );
}

/* ─── Item config ───────────────────────────────────────── */
interface ItemState {
  startPos: [number, number, number];
  finalPos: [number, number, number];
  orbitRadius: number;
  orbitSpeed: number;
  orbitOffset: number;
  orbitY: number;
}

const ITEMS: ItemState[] = [
  { startPos: [0, 0.2, 0], finalPos: [-2.4, 1.2, -0.5], orbitRadius: 2.6, orbitSpeed: 0.22, orbitOffset: 0,         orbitY: 0.6  },
  { startPos: [0, 0.2, 0], finalPos: [2.2,  0.8,  0.4], orbitRadius: 2.4, orbitSpeed: 0.19, orbitOffset: Math.PI/3, orbitY: -0.3 },
  { startPos: [0, 0.2, 0], finalPos: [-1.8, -0.6, 1.0], orbitRadius: 2.2, orbitSpeed: 0.25, orbitOffset: Math.PI*0.7, orbitY: -0.8 },
  { startPos: [0, 0.2, 0], finalPos: [1.0,  1.6, -1.2], orbitRadius: 2.0, orbitSpeed: 0.17, orbitOffset: Math.PI,   orbitY: 1.2  },
  { startPos: [0, 0.2, 0], finalPos: [-0.4, -1.0, -1.8], orbitRadius: 2.5, orbitSpeed: 0.21, orbitOffset: Math.PI*1.4, orbitY: -1.1 },
  { startPos: [0, 0.2, 0], finalPos: [2.8,  -0.2, -0.8], orbitRadius: 3.0, orbitSpeed: 0.16, orbitOffset: Math.PI*1.7, orbitY: 0.2  },
];

const ItemComponents = [Bag, Phone, Card, PriceTag, SmallBox, TapeRoll];

const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/* ─── Single orbiting item ──────────────────────────────── */
function OrbitItem({
  cfg,
  progressRef,
  index,
}: {
  cfg: ItemState;
  progressRef: React.RefObject<number>;
  index: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const ItemComp = ItemComponents[index % ItemComponents.length];

  useFrame((state) => {
    if (!groupRef.current) return;

    const progress = progressRef.current ?? 0;
    const explosionStart = 0.45;
    const explosionEnd   = 0.7;
    const orbitStart     = 0.7;
    const itemDelay = index * 0.04;

    const explodeP = Math.max(0, Math.min(1,
      (progress - explosionStart - itemDelay) / (explosionEnd - explosionStart - itemDelay)
    ));

    if (explodeP <= 0) {
      groupRef.current.visible = false;
      return;
    }
    groupRef.current.visible = true;

    const explodeEased = easeOutBack(Math.min(explodeP, 1));
    const orbitP = Math.max(0, Math.min(1, (progress - orbitStart) / (1 - orbitStart)));

    const t = state.clock.getElapsedTime();
    const angle = t * cfg.orbitSpeed + cfg.orbitOffset;

    const explodedX = cfg.finalPos[0] * explodeEased;
    const explodedY = cfg.finalPos[1] * explodeEased;
    const explodedZ = cfg.finalPos[2] * explodeEased;

    const orbitX = Math.cos(angle) * cfg.orbitRadius;
    const orbitZ = Math.sin(angle) * cfg.orbitRadius;
    const orbitY = cfg.orbitY + Math.sin(angle * 0.7 + cfg.orbitOffset) * 0.15;

    groupRef.current.position.set(
      explodedX + (orbitX - explodedX) * orbitP,
      explodedY + (orbitY - explodedY) * orbitP,
      explodedZ + (orbitZ - explodedZ) * orbitP,
    );
    groupRef.current.rotation.y = t * cfg.orbitSpeed * 0.6 + cfg.orbitOffset;
  });

  return (
    <group ref={groupRef}>
      <ItemComp pos={[0, 0, 0]} />
    </group>
  );
}

/* ─── Main export ───────────────────────────────────────── */
export function OrbitingItems({ progressRef }: { progressRef: React.RefObject<number> }) {
  return (
    <group>
      {ITEMS.map((cfg, i) => (
        <OrbitItem key={i} cfg={cfg} progressRef={progressRef} index={i} />
      ))}
    </group>
  );
}

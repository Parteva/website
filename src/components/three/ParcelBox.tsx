import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MAT_BOX = { color: '#2a1f14', roughness: 0.85, metalness: 0 };
const MAT_LID = { color: '#3a2a1a', roughness: 0.8, metalness: 0 };
const MAT_EDGE = { color: '#c9a961', roughness: 0.6, metalness: 0.1 };
const MAT_INNER = { color: '#1a1008', roughness: 0.9, metalness: 0 };
const MAT_TAPE = { color: '#8a7e6f', roughness: 0.75, metalness: 0 };

interface ParcelBoxProps {
  lidAngle?: number; // 0 = closed, Math.PI * 0.65 = fully open
  glowIntensity?: number;
}

export function ParcelBox({ lidAngle = 0, glowIntensity = 0 }: ParcelBoxProps) {
  const lidRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (lidRef.current) {
      lidRef.current.rotation.x = -lidAngle;
    }
    if (glowRef.current) {
      glowRef.current.intensity = glowIntensity * 3;
    }
  });

  return (
    <group>
      {/* Box body */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[2, 1.4, 2.6]} />
        <meshStandardMaterial {...MAT_BOX} />
      </mesh>

      {/* Inner bottom (visible when lid open) */}
      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[1.9, 1.35, 2.5]} />
        <meshStandardMaterial {...MAT_INNER} />
      </mesh>

      {/* Edge highlights — top rim */}
      {[
        { pos: [0, 0.71, 1.3], rot: [0, 0, 0], size: [2, 0.03, 0.03] },
        { pos: [0, 0.71, -1.3], rot: [0, 0, 0], size: [2, 0.03, 0.03] },
        { pos: [1.0, 0.71, 0], rot: [0, Math.PI / 2, 0], size: [2.6, 0.03, 0.03] },
        { pos: [-1.0, 0.71, 0], rot: [0, Math.PI / 2, 0], size: [2.6, 0.03, 0.03] },
      ].map((e, i) => (
        <mesh key={i} position={e.pos as [number, number, number]} rotation={e.rot as [number, number, number]}>
          <boxGeometry args={e.size as [number, number, number]} />
          <meshStandardMaterial {...MAT_EDGE} />
        </mesh>
      ))}

      {/* Tape strip — horizontal */}
      <mesh position={[0, 0.05, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.18, 1.42, 2.65]} />
        <meshStandardMaterial {...MAT_TAPE} />
      </mesh>

      {/* Lid group — pivots from back edge */}
      <group ref={lidRef} position={[0, 0.71, -1.3]}>
        <mesh position={[0, 0, 1.3]} castShadow>
          <boxGeometry args={[2, 0.08, 2.6]} />
          <meshStandardMaterial {...MAT_LID} />
        </mesh>

        {/* Lid edge highlights */}
        {[
          { pos: [0, 0.04, 0], size: [2, 0.03, 0.03] },
          { pos: [0, 0.04, 2.6], size: [2, 0.03, 0.03] },
          { pos: [1.0, 0.04, 1.3], size: [2.6, 0.03, 0.03] },
          { pos: [-1.0, 0.04, 1.3], size: [2.6, 0.03, 0.03] },
        ].map((e, i) => (
          <mesh key={i} position={e.pos as [number, number, number]}>
            <boxGeometry args={e.size as [number, number, number]} />
            <meshStandardMaterial {...MAT_EDGE} />
          </mesh>
        ))}
      </group>

      {/* Inner glow light — appears when lid opens */}
      <pointLight
        ref={glowRef}
        position={[0, 0.2, 0]}
        color="#ffd09a"
        intensity={0}
        distance={4}
        decay={2}
      />

      {/* Subtle ground shadow plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.71, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <shadowMaterial transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

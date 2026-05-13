import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Lighting() {
  return (
    <>
      {/* Ambient — very low */}
      <ambientLight intensity={0.08} color="#3d2a1a" />

      {/* Warm key light — top right (~3000K) */}
      <directionalLight
        position={[4, 6, 3]}
        intensity={2.2}
        color="#ffd09a"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.1}
        shadow-camera-far={30}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />

      {/* Soft fill — bottom left */}
      <directionalLight
        position={[-3, -2, 2]}
        intensity={0.4}
        color="#4a3520"
      />

      {/* Rim light — back */}
      <directionalLight
        position={[0, 2, -5]}
        intensity={0.3}
        color="#c9a961"
      />

      {/* Ground bounce */}
      <hemisphereLight
        args={["#2a1a0a", "#0c0a09", 0.3]}
      />
    </>
  );
}

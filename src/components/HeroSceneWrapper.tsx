import { useRef } from 'react';
import { HeroScene } from './three/HeroScene';

export default function HeroSceneWrapper() {
  const outerRef = useRef<HTMLElement | null>(null);

  // grab the outer hero section after mount
  if (typeof document !== 'undefined' && !outerRef.current) {
    outerRef.current = document.getElementById('hero') as HTMLElement | null;
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <HeroScene outerRef={outerRef} />
    </div>
  );
}

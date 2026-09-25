import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MoodParticlesProps {
  mood: string;
  color: string;
  count: number;
  speed: number;
  intensity: number;
}

export const MoodParticles: React.FC<MoodParticlesProps> = ({ mood, color, count, speed, intensity }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ),
        speed: Math.random() * speed + 0.1,
        offset: Math.random() * Math.PI * 2,
        scale: Math.random() * 0.15 + 0.05,
      });
    }
    return temp;
  }, [count, speed]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    
    particles.forEach((particle, i) => {
      const t = time * particle.speed;
      
      let x = particle.position.x + Math.sin(t + particle.offset) * intensity * 2;
      let y = particle.position.y + Math.cos(t * 0.7 + particle.offset) * intensity * 2;
      let z = particle.position.z + Math.sin(t * 0.5 + particle.offset) * intensity;

      if (mood === 'happy') {
        y += Math.sin(t * 2) * 0.5;
        x += Math.cos(t * 1.5) * 0.3;
      } else if (mood === 'sad') {
        y -= t * 0.02 % 10;
        if (y < -10) y = 10;
      } else if (mood === 'angry') {
        x += Math.sin(t * 5) * intensity;
        y += Math.cos(t * 4) * intensity;
        z += Math.sin(t * 3) * intensity;
      } else if (mood === 'energetic') {
        x += Math.sin(t * 3) * 1.5;
        y += Math.cos(t * 2.5) * 1.5;
        z += Math.sin(t * 2) * 1.5;
      } else if (mood === 'romantic') {
        const heartX = 16 * Math.pow(Math.sin(t * 0.3), 3);
        const heartY = 13 * Math.cos(t * 0.3) - 5 * Math.cos(2 * t * 0.3) - 2 * Math.cos(3 * t * 0.3) - Math.cos(4 * t * 0.3);
        x = heartX * 0.1 + particle.position.x * 0.3;
        y = heartY * 0.1 + particle.position.y * 0.3;
      } else if (mood === 'focused') {
        const radius = 3 + Math.sin(particle.offset) * 2;
        x = Math.cos(t * 0.2 + particle.offset) * radius;
        z = Math.sin(t * 0.2 + particle.offset) * radius;
        y = particle.position.y * 0.3;
      }

      dummy.position.set(x, y, z);
      const pulseScale = particle.scale * (1 + Math.sin(t * 2 + particle.offset) * 0.3 * intensity);
      dummy.scale.setScalar(pulseScale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.8}
      />
    </instancedMesh>
  );
};

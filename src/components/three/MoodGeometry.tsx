import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MoodGeometryProps {
  mood: string;
  color: string;
  intensity: number;
}

export const MoodGeometry: React.FC<MoodGeometryProps> = ({ mood, color, intensity }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current || !wireRef.current) return;
    const time = state.clock.getElapsedTime();

    meshRef.current.rotation.x = time * 0.1 * intensity;
    meshRef.current.rotation.y = time * 0.15 * intensity;
    meshRef.current.rotation.z = time * 0.05 * intensity;

    wireRef.current.rotation.x = -time * 0.08 * intensity;
    wireRef.current.rotation.y = -time * 0.12 * intensity;
    wireRef.current.rotation.z = time * 0.03 * intensity;

    const scale = 1 + Math.sin(time * intensity) * 0.1;
    meshRef.current.scale.setScalar(scale);
    wireRef.current.scale.setScalar(scale * 1.2);
  });

  const getGeometry = () => {
    switch (mood) {
      case 'happy':
        return <icosahedronGeometry args={[1.5, 1]} />;
      case 'sad':
        return <sphereGeometry args={[1.5, 32, 32]} />;
      case 'angry':
        return <octahedronGeometry args={[1.8, 0]} />;
      case 'relaxed':
        return <torusGeometry args={[1.5, 0.4, 16, 100]} />;
      case 'romantic':
        return <dodecahedronGeometry args={[1.5, 0]} />;
      case 'energetic':
        return <torusKnotGeometry args={[1, 0.3, 100, 16]} />;
      case 'focused':
        return <boxGeometry args={[2, 2, 2]} />;
      default:
        return <icosahedronGeometry args={[1.5, 0]} />;
    }
  };

  const getWireGeometry = () => {
    switch (mood) {
      case 'happy':
        return <icosahedronGeometry args={[2, 1]} />;
      case 'sad':
        return <sphereGeometry args={[2, 16, 16]} />;
      case 'angry':
        return <octahedronGeometry args={[2.2, 0]} />;
      case 'relaxed':
        return <torusGeometry args={[2, 0.2, 8, 50]} />;
      case 'romantic':
        return <dodecahedronGeometry args={[2, 0]} />;
      case 'energetic':
        return <torusKnotGeometry args={[1.5, 0.15, 50, 8]} />;
      case 'focused':
        return <boxGeometry args={[2.5, 2.5, 2.5]} />;
      default:
        return <icosahedronGeometry args={[2, 0]} />;
    }
  };

  return (
    <group>
      <mesh ref={meshRef}>
        {getGeometry()}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      <mesh ref={wireRef}>
        {getWireGeometry()}
        <meshStandardMaterial
          color={color}
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  );
};

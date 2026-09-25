import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import { MoodParticles } from './MoodParticles';
import { MoodGeometry } from './MoodGeometry';
import { MoodConfig } from '../../data/moods';

interface MoodSceneProps {
  moodConfig: MoodConfig | null;
  className?: string;
}

const FloatingRings: React.FC<{ color: string; intensity: number }> = ({ color, intensity }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.05 * intensity;
    groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {[1, 2, 3].map((i) => (
        <mesh key={i} rotation={[Math.PI / (i + 1), 0, Math.PI / (i + 2)]}>
          <torusGeometry args={[3 + i * 0.8, 0.02, 16, 100]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
};

const SceneContent: React.FC<{ moodConfig: MoodConfig }> = ({ moodConfig }) => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color={moodConfig.colors.primary} />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color={moodConfig.colors.secondary} />
      <pointLight position={[0, 5, 0]} intensity={0.4} color={moodConfig.colors.accent} />

      <Stars radius={50} depth={50} count={2000} factor={3} saturation={0.5} fade speed={moodConfig.particleSpeed} />

      <Float speed={moodConfig.particleSpeed} rotationIntensity={moodConfig.animationIntensity} floatIntensity={moodConfig.animationIntensity}>
        <MoodGeometry
          mood={moodConfig.id}
          color={moodConfig.colors.primary}
          intensity={moodConfig.animationIntensity}
        />
      </Float>

      <MoodParticles
        mood={moodConfig.id}
        color={moodConfig.colors.primary}
        count={moodConfig.particleCount}
        speed={moodConfig.particleSpeed}
        intensity={moodConfig.animationIntensity}
      />

      <FloatingRings color={moodConfig.colors.accent} intensity={moodConfig.animationIntensity} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5 * moodConfig.animationIntensity}
        maxPolarAngle={Math.PI * 0.75}
        minPolarAngle={Math.PI * 0.25}
      />
    </>
  );
};

export const MoodScene: React.FC<MoodSceneProps> = ({ moodConfig, className }) => {
  if (!moodConfig) {
    return (
      <div className={className}>
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <Stars radius={50} depth={50} count={1500} factor={3} saturation={0} fade speed={0.5} />
            <Float speed={0.5} rotationIntensity={0.3} floatIntensity={0.3}>
              <mesh>
                <icosahedronGeometry args={[1.5, 0]} />
                <meshStandardMaterial color="#9B59B6" wireframe transparent opacity={0.3} />
              </mesh>
            </Float>
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
          </Suspense>
        </Canvas>
      </div>
    );
  }

  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <Suspense fallback={null}>
          <SceneContent moodConfig={moodConfig} />
        </Suspense>
      </Canvas>
    </div>
  );
};

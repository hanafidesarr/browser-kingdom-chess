import React, { useMemo } from 'react';
import * as THREE from 'three';

interface ImpactEffectProps {
  position: [number, number, number];
  progress: number; // 0 to 1 during the combat impact window
}

export const ImpactEffect: React.FC<ImpactEffectProps> = ({ position, progress }) => {
  // Pre-generate spark angles
  const sparks = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => {
      const angle = (i / 8) * Math.PI * 2 + (Math.random() * 0.2 - 0.1);
      const speed = 0.55 + Math.random() * 0.35;
      const height = 0.35 + Math.random() * 0.25;
      return { angle, speed, height };
    });
  }, []);

  const p = Math.min(1, Math.max(0, progress));
  const ringScale = 0.2 + p * 1.3;
  const ringOpacity = Math.max(0, (1 - p) * 0.95);
  const flashScale = Math.sin(p * Math.PI) * 0.85;

  return (
    <group position={position}>
      {/* 1. Expanding Ground Shockwave Ring */}
      <mesh
        position={[0, 0.04, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[ringScale, ringScale, 1]}
      >
        <ringGeometry args={[0.15, 0.32, 24]} />
        <meshBasicMaterial
          color="#fbbf24"
          transparent
          opacity={ringOpacity}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Secondary White-Hot Shockwave Ring */}
      <mesh
        position={[0, 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[ringScale * 0.7, ringScale * 0.7, 1]}
      >
        <ringGeometry args={[0.08, 0.18, 20]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={ringOpacity * 0.8}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Four-point Stylized Impact Flash Cross */}
      {flashScale > 0.01 && (
        <group position={[0, 0.25, 0]} scale={[flashScale, flashScale, flashScale]}>
          <mesh rotation={[0, 0, 0]}>
            <boxGeometry args={[0.08, 0.65, 0.02]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={ringOpacity} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.08, 0.65, 0.02]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={ringOpacity} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.05, 0.45, 0.02]} />
            <meshBasicMaterial color="#fde047" transparent opacity={ringOpacity} />
          </mesh>
          <mesh rotation={[0, 0, -Math.PI / 4]}>
            <boxGeometry args={[0.05, 0.45, 0.02]} />
            <meshBasicMaterial color="#fde047" transparent opacity={ringOpacity} />
          </mesh>
        </group>
      )}

      {/* 4. Radiating Stylized Sparks */}
      {sparks.map((spark, idx) => {
        const dist = p * spark.speed;
        const x = Math.cos(spark.angle) * dist;
        const z = Math.sin(spark.angle) * dist;
        const y = Math.sin(p * Math.PI) * spark.height - p * 0.1;
        const sparkScale = Math.max(0, (1 - p) * 0.06);

        return (
          <mesh key={idx} position={[x, 0.18 + y, z]} scale={[sparkScale, sparkScale, sparkScale]}>
            <octahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color={idx % 2 === 0 ? '#fef08a' : '#f59e0b'} />
          </mesh>
        );
      })}

      {/* 5. Brief Point Light Flash */}
      <pointLight
        position={[0, 0.35, 0]}
        color="#fef08a"
        intensity={(1 - p) * 3.5}
        distance={2.5}
        decay={2}
      />
    </group>
  );
};

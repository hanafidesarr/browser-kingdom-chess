import React from 'react';
import * as THREE from 'three';
import { matRegistry } from './Materials';

interface PedestalProps {
  color: 'w' | 'b';
}

export const Pedestal: React.FC<PedestalProps> = ({ color }) => {
  const isWhite = color === 'w';
  const stoneColor = isWhite ? '#1e293b' : '#18181b';
  const rimColor = isWhite ? '#f59e0b' : '#dc2626';

  const stoneMat = matRegistry.get(stoneColor, 0.6, 0.2);
  const rimMat = matRegistry.get(rimColor, 0.3, 0.8);

  return (
    <group position={[0, 0, 0]}>
      {/* Soft Contact Shadow Decal on the Board Surface */}
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.42, 24]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.38}
          depthWrite={false}
        />
      </mesh>

      {/* Lower Smooth Beveled Pedestal */}
      <mesh position={[0, 0.03, 0]} material={stoneMat} castShadow receiveShadow>
        <cylinderGeometry args={[0.36, 0.39, 0.06, 24]} />
      </mesh>

      {/* Upper Kingdom Ring (Gold for Blue, Crimson for Red) */}
      <mesh position={[0, 0.065, 0]} material={rimMat} castShadow receiveShadow>
        <cylinderGeometry args={[0.33, 0.36, 0.02, 24]} />
      </mesh>
    </group>
  );
};

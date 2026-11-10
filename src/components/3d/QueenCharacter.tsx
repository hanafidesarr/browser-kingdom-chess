import React from 'react';
import { kingdomColors, matRegistry } from './Materials';
import { Pedestal } from './Pedestal';
import { ChibiFace } from './ChibiFace';

interface CharacterProps {
  color: 'w' | 'b';
}

export const QueenCharacter: React.FC<CharacterProps> = ({ color }) => {
  const isWhite = color === 'w';
  const pal = isWhite ? kingdomColors.white : kingdomColors.black;

  const dressMat = matRegistry.get(pal.primary, 0.4, 0.1);
  const goldMat = matRegistry.get(pal.trim, 0.25, 0.85);
  const whiteMat = matRegistry.get(pal.cloth, 0.75, 0.0);
  const rubyMat = matRegistry.get(isWhite ? kingdomColors.neutral.sapphire : kingdomColors.neutral.ruby, 0.1, 0.4);

  return (
    <group position={[0, 0, 0]} scale={[0.93, 0.93, 0.93]}>
      <Pedestal color={color} />

      {/* Royal Flared Ballgown */}
      <group position={[0, 0.08, 0]}>
        {/* Flared Rounded Skirt */}
        <mesh position={[0, 0.14, 0]} material={dressMat} castShadow>
          <cylinderGeometry args={[0.16, 0.28, 0.28, 24]} />
        </mesh>
        {/* Gold Filigree Hem */}
        <mesh position={[0, 0.01, 0]} material={goldMat}>
          <cylinderGeometry args={[0.282, 0.282, 0.035, 24]} />
        </mesh>

        {/* Sculpted Bodice */}
        <mesh position={[0, 0.30, 0]} material={dressMat} castShadow>
          <capsuleGeometry args={[0.13, 0.14, 12, 16]} />
        </mesh>
        {/* Gold Embroidery */}
        <mesh position={[0, 0.28, 0.12]} material={goldMat}>
          <boxGeometry args={[0.06, 0.22, 0.01]} />
        </mesh>

        {/* White Puffed Shoulders */}
        <mesh position={[-0.17, 0.36, 0]} material={whiteMat} castShadow>
          <sphereGeometry args={[0.075, 14, 14]} />
        </mesh>
        <mesh position={[0.17, 0.36, 0]} material={whiteMat} castShadow>
          <sphereGeometry args={[0.075, 14, 14]} />
        </mesh>

        {/* Arms */}
        <mesh position={[-0.17, 0.26, 0.03]} rotation={[0.3, 0, 0]} material={dressMat}>
          <capsuleGeometry args={[0.035, 0.14, 8, 10]} />
        </mesh>
        <mesh position={[0.17, 0.26, 0.03]} rotation={[0.3, 0, 0]} material={dressMat}>
          <capsuleGeometry args={[0.035, 0.14, 8, 10]} />
        </mesh>
      </group>

      {/* Chibi Face with Flowing Hair */}
      <group position={[0, 0.52, 0]}>
        <ChibiFace color={color} hairStyle="flowing" />

        {/* Queen's Elegant Golden Crown */}
        <group position={[0, 0.15, 0]}>
          {/* Base Rim */}
          <mesh material={goldMat} castShadow>
            <cylinderGeometry args={[0.16, 0.15, 0.06, 24]} />
          </mesh>
          {/* Multi-spire Crown Points */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const angle = (i * Math.PI) / 4;
            const x = Math.sin(angle) * 0.15;
            const z = Math.cos(angle) * 0.15;
            return (
              <mesh key={i} position={[x, 0.08, z]} material={goldMat}>
                <coneGeometry args={[0.035, 0.09, 8]} />
              </mesh>
            );
          })}
          {/* Sparkling Gem */}
          <mesh position={[0, 0.04, 0.16]} material={rubyMat}>
            <octahedronGeometry args={[0.035, 0]} />
          </mesh>
        </group>
      </group>

      {/* Royal Golden Sceptre in Right Hand */}
      <group position={[0.20, 0.36, 0.12]} rotation={[0.4, 0, -0.2]}>
        <mesh material={goldMat} castShadow>
          <cylinderGeometry args={[0.015, 0.018, 0.42, 12]} />
        </mesh>
        <mesh position={[0, 0.22, 0]} material={rubyMat}>
          <octahedronGeometry args={[0.04, 0]} />
        </mesh>
      </group>
    </group>
  );
};

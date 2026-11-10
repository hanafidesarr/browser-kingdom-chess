import React from 'react';
import { kingdomColors, matRegistry } from './Materials';
import { Pedestal } from './Pedestal';
import { ChibiFace } from './ChibiFace';

interface CharacterProps {
  color: 'w' | 'b';
}

export const BishopCharacter: React.FC<CharacterProps> = ({ color }) => {
  const isWhite = color === 'w';
  const pal = isWhite ? kingdomColors.white : kingdomColors.black;

  const robeMat = matRegistry.get(pal.primary, 0.45, 0.1);
  const goldMat = matRegistry.get(pal.trim, 0.25, 0.85);
  const furMat = matRegistry.get(pal.cloth, 0.75, 0.0);
  const woodMat = matRegistry.get(kingdomColors.neutral.wood, 0.7, 0.0);
  const rubyMat = matRegistry.get(isWhite ? kingdomColors.neutral.sapphire : kingdomColors.neutral.ruby, 0.1, 0.4);

  return (
    <group position={[0, 0, 0]} scale={[0.92, 0.92, 0.92]}>
      <Pedestal color={color} />

      {/* Long Flowing Royal Advisor Robe */}
      <group position={[0, 0.08, 0]}>
        {/* Lower Flared Rounded Gown */}
        <mesh position={[0, 0.14, 0]} material={robeMat} castShadow>
          <cylinderGeometry args={[0.17, 0.28, 0.28, 24]} />
        </mesh>
        {/* Hem Gold Band */}
        <mesh position={[0, 0.01, 0]} material={goldMat}>
          <cylinderGeometry args={[0.282, 0.282, 0.035, 24]} />
        </mesh>

        {/* Upper Robe Body */}
        <mesh position={[0, 0.28, 0]} material={robeMat} castShadow>
          <capsuleGeometry args={[0.14, 0.16, 12, 16]} />
        </mesh>

        {/* Central Vertical Gold Stole */}
        <mesh position={[0, 0.20, 0.13]} material={goldMat}>
          <boxGeometry args={[0.07, 0.32, 0.012]} />
        </mesh>

        {/* Fluffy Fur Collar */}
        <mesh position={[0, 0.35, 0.02]} rotation={[Math.PI / 2, 0, 0]} material={furMat}>
          <torusGeometry args={[0.13, 0.045, 12, 20]} />
        </mesh>
      </group>

      {/* Chibi Head with Goatee */}
      <group position={[0, 0.52, 0]}>
        <ChibiFace color={color} hasBeard={true} beardStyle="goatee" />

        {/* Tall Sculpted Advisor Mitre Hat */}
        <group position={[0, 0.14, 0]}>
          {/* Gold Base Band */}
          <mesh position={[0, -0.04, 0]} material={goldMat}>
            <cylinderGeometry args={[0.165, 0.165, 0.045, 24]} />
          </mesh>
          {/* Main Mitre Body */}
          <mesh position={[0, 0.08, 0]} material={robeMat} castShadow>
            <cylinderGeometry args={[0.10, 0.16, 0.22, 20]} />
          </mesh>
          {/* Mitre Top Spire */}
          <mesh position={[0, 0.20, 0]} rotation={[0, 0, Math.PI / 4]} material={goldMat}>
            <coneGeometry args={[0.065, 0.12, 4]} />
          </mesh>
          {/* Glowing Center Gemstone */}
          <mesh position={[0, 0.04, 0.145]} material={rubyMat}>
            <octahedronGeometry args={[0.04, 0]} />
          </mesh>
        </group>
      </group>

      {/* Robe Sleeves */}
      <mesh position={[0.17, 0.34, 0.02]} rotation={[0.2, 0, 0]} material={robeMat} castShadow>
        <capsuleGeometry args={[0.05, 0.18, 8, 12]} />
      </mesh>
      <mesh position={[-0.17, 0.34, 0.04]} rotation={[0.4, 0, 0]} material={robeMat} castShadow>
        <capsuleGeometry args={[0.05, 0.18, 8, 12]} />
      </mesh>

      {/* Ornate Golden Advisor Staff */}
      <group position={[-0.22, 0.46, 0.14]}>
        <mesh position={[0, 0, 0]} material={woodMat} castShadow>
          <cylinderGeometry args={[0.018, 0.02, 0.84, 12]} />
        </mesh>
        {/* Sculpted Golden Ring Head */}
        <group position={[0, 0.46, 0]}>
          <mesh material={goldMat} castShadow>
            <torusGeometry args={[0.095, 0.026, 12, 24]} />
          </mesh>
          <mesh material={rubyMat}>
            <octahedronGeometry args={[0.04, 0]} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

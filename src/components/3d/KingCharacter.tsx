import React from 'react';
import { kingdomColors, matRegistry } from './Materials';
import { Pedestal } from './Pedestal';
import { ChibiFace } from './ChibiFace';

interface CharacterProps {
  color: 'w' | 'b';
}

export const KingCharacter: React.FC<CharacterProps> = ({ color }) => {
  const isWhite = color === 'w';
  const pal = isWhite ? kingdomColors.white : kingdomColors.black;

  const doubletMat = matRegistry.get(pal.primary, 0.45, 0.2);
  const capeMat = matRegistry.get(pal.cape, 0.7, 0.05);
  const ermineMat = matRegistry.get(pal.cloth, 0.8, 0.0);
  const ermineSpotMat = matRegistry.get('#0f172a', 0.9, 0.0);
  const goldMat = matRegistry.get(pal.trim, 0.2, 0.85);
  const bootMat = matRegistry.get(isWhite ? '#382214' : '#18181b', 0.7, 0.1);
  const steelMat = matRegistry.get(pal.metal, 0.15, 0.9);
  const rubyMat = matRegistry.get(isWhite ? kingdomColors.neutral.sapphire : kingdomColors.neutral.ruby, 0.1, 0.4);

  return (
    <group position={[0, 0, 0]} scale={[0.96, 0.96, 0.96]}>
      <Pedestal color={color} />

      {/* Legs & Royal Boots */}
      <group position={[0, 0.10, 0]}>
        <mesh position={[-0.1, 0.04, 0]} material={bootMat} castShadow>
          <capsuleGeometry args={[0.055, 0.12, 10, 12]} />
        </mesh>
        <mesh position={[0.1, 0.04, 0]} material={bootMat} castShadow>
          <capsuleGeometry args={[0.055, 0.12, 10, 12]} />
        </mesh>
      </group>

      {/* Royal Doublet / Cuirass */}
      <mesh position={[0, 0.32, 0]} material={doubletMat} castShadow>
        <capsuleGeometry args={[0.16, 0.16, 14, 18]} />
      </mesh>
      {/* Heavy Gold Belt */}
      <mesh position={[0, 0.23, 0]} material={goldMat}>
        <cylinderGeometry args={[0.17, 0.17, 0.04, 24]} />
      </mesh>

      {/* Flowing Royal Cape */}
      <group position={[0, 0.26, -0.10]}>
        {/* Main Cape Volume */}
        <mesh position={[0, -0.04, -0.04]} rotation={[-0.15, 0, 0]} material={capeMat} castShadow>
          <boxGeometry args={[0.40, 0.40, 0.05]} />
        </mesh>
        {/* Fluffy Ermine Fur Collar */}
        <mesh position={[0, 0.20, 0.06]} material={ermineMat}>
          <boxGeometry args={[0.44, 0.11, 0.28]} />
        </mesh>
        {/* Ermine Spots */}
        <mesh position={[-0.15, 0.23, 0.17]} material={ermineSpotMat}>
          <boxGeometry args={[0.02, 0.04, 0.02]} />
        </mesh>
        <mesh position={[0.15, 0.23, 0.17]} material={ermineSpotMat}>
          <boxGeometry args={[0.02, 0.04, 0.02]} />
        </mesh>
      </group>

      {/* Chibi Head with Noble Beard */}
      <group position={[0, 0.54, 0]}>
        <ChibiFace color={color} hasBeard={true} beardStyle="full" />

        {/* High King's Grand Golden Crown */}
        <group position={[0, 0.15, 0]}>
          <mesh material={goldMat} castShadow>
            <cylinderGeometry args={[0.18, 0.17, 0.08, 24]} />
          </mesh>
          {/* 8 Crown Spires */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const angle = (i * Math.PI) / 4;
            const x = Math.sin(angle) * 0.17;
            const z = Math.cos(angle) * 0.17;
            return (
              <mesh key={i} position={[x, 0.09, z]} material={goldMat}>
                <coneGeometry args={[0.04, 0.11, 8]} />
              </mesh>
            );
          })}
          {/* Center Royal Gem */}
          <mesh position={[0, 0.04, 0.18]} material={rubyMat}>
            <octahedronGeometry args={[0.04, 0]} />
          </mesh>
        </group>
      </group>

      {/* Arms in Doublet */}
      <mesh position={[-0.20, 0.33, 0.04]} rotation={[0.4, 0.3, 0]} material={doubletMat} castShadow>
        <capsuleGeometry args={[0.04, 0.16, 8, 12]} />
      </mesh>
      <mesh position={[0.20, 0.33, 0.04]} rotation={[0.4, -0.3, 0]} material={doubletMat} castShadow>
        <capsuleGeometry args={[0.04, 0.16, 8, 12]} />
      </mesh>

      {/* Two-Handed Royal Broadsword */}
      <group position={[0, 0.26, 0.19]} rotation={[0.2, 0, 0]}>
        <mesh position={[0, 0.06, 0]} material={goldMat}>
          <boxGeometry args={[0.20, 0.03, 0.05]} />
        </mesh>
        <mesh position={[0, 0.13, 0]} material={bootMat}>
          <cylinderGeometry args={[0.02, 0.02, 0.11, 12]} />
        </mesh>
        <mesh position={[0, 0.19, 0]} material={goldMat}>
          <sphereGeometry args={[0.035, 12, 12]} />
        </mesh>
        {/* Gleaming Blade */}
        <mesh position={[0, -0.17, 0]} material={steelMat} castShadow>
          <boxGeometry args={[0.055, 0.44, 0.016]} />
        </mesh>
      </group>
    </group>
  );
};

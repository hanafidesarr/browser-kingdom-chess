import React from 'react';
import { kingdomColors, matRegistry } from './Materials';
import { ChibiFace } from './ChibiFace';
import { CharacterAnimState } from '../../types/chess';

export interface CharacterProps {
  color: 'w' | 'b';
  animState?: CharacterAnimState;
  animProgress?: number;
  runCycle?: number;
}

export const KingCharacter: React.FC<CharacterProps> = ({
  color,
  animState = 'idle',
  animProgress = 0,
  runCycle = 0
}) => {
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

  let leftLegRotX = 0;
  let rightLegRotX = 0;
  let bodyLeanX = 0;
  let bodyBobY = 0;
  let capeBillowX = -0.15;
  let swordArmRotX = 0.2;
  let swordArmPosY = 0;
  let swordArmPosZ = 0;

  if (animState === 'running') {
    const swing = Math.sin(runCycle) * 0.62;
    leftLegRotX = swing;
    rightLegRotX = -swing;
    bodyLeanX = 0.14;
    bodyBobY = Math.abs(Math.sin(runCycle)) * 0.035;
    capeBillowX = -0.15 - 0.25; // Cape billows back while running
    swordArmRotX = 0.2 - swing * 0.3;
  } else if (animState === 'attacking') {
    // Powerful royal cleave attack
    const p = animProgress;
    if (p < 0.4) {
      // Raise two-handed greatsword overhead
      const t = p / 0.4;
      bodyLeanX = -0.18 * t;
      swordArmRotX = 0.2 + 1.6 * t;
      swordArmPosY = 0.20 * t;
      swordArmPosZ = -0.15 * t;
      capeBillowX = -0.15 + 0.15 * t;
    } else if (p < 0.72) {
      // Mighty downward cleave!
      const t = (p - 0.4) / 0.32;
      bodyLeanX = -0.18 + 0.45 * t;
      swordArmRotX = 1.8 - 2.0 * t;
      swordArmPosY = 0.20 - 0.28 * t;
      swordArmPosZ = -0.15 + 0.45 * t;
      capeBillowX = 0.0 - 0.35 * t;
      rightLegRotX = -0.2 * t;
      leftLegRotX = 0.2 * t;
    } else {
      // Recover to majestic guard stance
      const t = (p - 0.72) / 0.28;
      bodyLeanX = 0.27 * (1 - t);
      swordArmRotX = -0.2 + 0.4 * t;
      swordArmPosY = -0.08 * (1 - t);
      swordArmPosZ = 0.30 * (1 - t);
      capeBillowX = -0.35 + 0.20 * t;
    }
  } else if (animState === 'victory') {
    const cheer = Math.sin(runCycle * 1.5);
    bodyBobY = Math.max(0, cheer) * 0.06;
    swordArmRotX = 1.5 + cheer * 0.15;
    swordArmPosY = 0.15;
  } else if (animState === 'defeated') {
    bodyLeanX = -0.4;
    swordArmRotX = -0.4;
    swordArmPosY = -0.1;
  }

  return (
    // Grounding offset: -0.025 ensures the bottom of boots touches chessboard surface at y = 0 exactly
    <group position={[0, -0.025 + bodyBobY, 0]} scale={[0.96, 0.96, 0.96]}>
      {/* Legs & Royal Boots */}
      <group position={[0, 0.10, 0]}>
        {/* Left Leg */}
        <group position={[-0.1, 0.04, 0]} rotation={[leftLegRotX, 0, 0]}>
          <mesh material={bootMat} castShadow>
            <capsuleGeometry args={[0.055, 0.12, 10, 12]} />
          </mesh>
        </group>
        {/* Right Leg */}
        <group position={[0.1, 0.04, 0]} rotation={[rightLegRotX, 0, 0]}>
          <mesh material={bootMat} castShadow>
            <capsuleGeometry args={[0.055, 0.12, 10, 12]} />
          </mesh>
        </group>
      </group>

      {/* Torso, Head, Cape, Arms & Broadsword (with body lean) */}
      <group position={[0, 0.23, 0]} rotation={[bodyLeanX, 0, 0]}>
        {/* Royal Doublet / Cuirass */}
        <mesh position={[0, 0.09, 0]} material={doubletMat} castShadow>
          <capsuleGeometry args={[0.16, 0.16, 14, 18]} />
        </mesh>
        {/* Heavy Gold Belt */}
        <mesh position={[0, 0.0, 0]} material={goldMat}>
          <cylinderGeometry args={[0.17, 0.17, 0.04, 24]} />
        </mesh>

        {/* Flowing Royal Cape */}
        <group position={[0, 0.03, -0.10]}>
          {/* Main Cape Volume */}
          <mesh position={[0, -0.04, -0.04]} rotation={[capeBillowX, 0, 0]} material={capeMat} castShadow>
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

        {/* Chibi Head with Noble Beard & Crown */}
        <group position={[0, 0.31, 0]}>
          <ChibiFace color={color} hasBeard={true} beardStyle="full" />

          {/* High King's Grand Golden Crown */}
          <group position={[0, 0.15, 0]}>
            <mesh material={goldMat} castShadow>
              <cylinderGeometry args={[0.18, 0.17, 0.08, 24]} />
            </mesh>
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
            <mesh position={[0, 0.04, 0.18]} material={rubyMat}>
              <octahedronGeometry args={[0.04, 0]} />
            </mesh>
          </group>
        </group>

        {/* Two-Handed Royal Broadsword & Arms (Strike Cleave) */}
        <group position={[0, 0.03 + swordArmPosY, 0.19 + swordArmPosZ]} rotation={[swordArmRotX, 0, 0]}>
          {/* Left & Right Arm Sleeves Holding Hilt */}
          <mesh position={[-0.18, 0.08, -0.15]} rotation={[0.4, 0.3, 0]} material={doubletMat} castShadow>
            <capsuleGeometry args={[0.04, 0.16, 8, 12]} />
          </mesh>
          <mesh position={[0.18, 0.08, -0.15]} rotation={[0.4, -0.3, 0]} material={doubletMat} castShadow>
            <capsuleGeometry args={[0.04, 0.16, 8, 12]} />
          </mesh>

          {/* Crossguard */}
          <mesh position={[0, 0.06, 0]} material={goldMat}>
            <boxGeometry args={[0.20, 0.03, 0.05]} />
          </mesh>
          {/* Grip */}
          <mesh position={[0, 0.13, 0]} material={bootMat}>
            <cylinderGeometry args={[0.02, 0.02, 0.11, 12]} />
          </mesh>
          {/* Pommel */}
          <mesh position={[0, 0.19, 0]} material={goldMat}>
            <sphereGeometry args={[0.035, 12, 12]} />
          </mesh>
          {/* Gleaming Steel Blade */}
          <mesh position={[0, -0.17, 0]} material={steelMat} castShadow>
            <boxGeometry args={[0.055, 0.44, 0.016]} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

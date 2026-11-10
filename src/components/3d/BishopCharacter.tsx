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

export const BishopCharacter: React.FC<CharacterProps> = ({
  color,
  animState = 'idle',
  animProgress = 0,
  runCycle = 0
}) => {
  const isWhite = color === 'w';
  const pal = isWhite ? kingdomColors.white : kingdomColors.black;

  const robeMat = matRegistry.get(pal.primary, 0.45, 0.1);
  const goldMat = matRegistry.get(pal.trim, 0.25, 0.85);
  const furMat = matRegistry.get(pal.cloth, 0.75, 0.0);
  const woodMat = matRegistry.get(kingdomColors.neutral.wood, 0.7, 0.0);
  const rubyMat = matRegistry.get(isWhite ? kingdomColors.neutral.sapphire : kingdomColors.neutral.ruby, 0.1, 0.4);

  let robeSwayZ = 0;
  let bodyLeanX = 0;
  let bodyBobY = 0;
  let staffArmRotX = 0.4;
  let staffArmRotZ = 0;
  let staffPosY = 0;
  let staffPosZ = 0;
  let rightArmRotX = 0.2;

  if (animState === 'running') {
    const swing = Math.sin(runCycle);
    robeSwayZ = swing * 0.06;
    bodyLeanX = 0.12;
    bodyBobY = Math.abs(swing) * 0.035;
    staffArmRotX = 0.4 - swing * 0.35;
    rightArmRotX = 0.2 + swing * 0.35;
  } else if (animState === 'attacking') {
    const p = animProgress;
    if (p < 0.4) {
      // Channel divine energy & raise staff high
      const t = p / 0.4;
      bodyLeanX = -0.15 * t;
      staffArmRotX = 0.4 + 1.2 * t;
      staffArmRotZ = -0.2 * t;
      staffPosY = 0.18 * t;
      staffPosZ = -0.10 * t;
      rightArmRotX = 0.2 - 0.4 * t;
    } else if (p < 0.72) {
      // Cast magical burst toward target
      const t = (p - 0.4) / 0.32;
      bodyLeanX = -0.15 + 0.35 * t;
      staffArmRotX = 1.6 - 1.5 * t;
      staffArmRotZ = -0.2 + 0.3 * t;
      staffPosY = 0.18 - 0.15 * t;
      staffPosZ = -0.10 + 0.35 * t;
      rightArmRotX = -0.2 + 0.6 * t;
    } else {
      // Recover to serene idle
      const t = (p - 0.72) / 0.28;
      bodyLeanX = 0.2 * (1 - t);
      staffArmRotX = 0.1 + 0.3 * t;
      staffArmRotZ = 0.1 * (1 - t);
      staffPosY = 0.03 * (1 - t);
      staffPosZ = 0.25 * (1 - t);
      rightArmRotX = 0.4 - 0.2 * t;
    }
  } else if (animState === 'victory') {
    const cheer = Math.sin(runCycle * 1.5);
    bodyBobY = Math.max(0, cheer) * 0.05;
    staffArmRotX = 1.6 + cheer * 0.15;
    staffPosY = 0.15;
  } else if (animState === 'defeated') {
    bodyLeanX = -0.4;
    staffArmRotX = -0.2;
    staffPosZ = -0.15;
  }

  return (
    // Grounding offset: -0.0725 ensures the bottom of the robe hem touches chessboard surface at y = 0 exactly
    <group position={[0, -0.0725 + bodyBobY, 0]} scale={[0.92, 0.92, 0.92]}>
      {/* Lower Flared Rounded Gown with gentle running sway */}
      <group position={[0, 0.08, 0]} rotation={[0, 0, robeSwayZ]}>
        <mesh position={[0, 0.14, 0]} material={robeMat} castShadow>
          <cylinderGeometry args={[0.17, 0.28, 0.28, 24]} />
        </mesh>
        {/* Hem Gold Band resting on tile */}
        <mesh position={[0, 0.01, 0]} material={goldMat}>
          <cylinderGeometry args={[0.282, 0.282, 0.035, 24]} />
        </mesh>
      </group>

      {/* Upper Torso, Head & Staff (articulated with body lean) */}
      <group position={[0, 0.36, 0]} rotation={[bodyLeanX, 0, robeSwayZ * 0.5]}>
        {/* Upper Robe Body */}
        <mesh position={[0, 0.0, 0]} material={robeMat} castShadow>
          <capsuleGeometry args={[0.14, 0.16, 12, 16]} />
        </mesh>

        {/* Central Vertical Gold Stole */}
        <mesh position={[0, -0.08, 0.13]} material={goldMat}>
          <boxGeometry args={[0.07, 0.32, 0.012]} />
        </mesh>

        {/* Fluffy Fur Collar */}
        <mesh position={[0, 0.07, 0.02]} rotation={[Math.PI / 2, 0, 0]} material={furMat}>
          <torusGeometry args={[0.13, 0.045, 12, 20]} />
        </mesh>

        {/* Chibi Head with Goatee */}
        <group position={[0, 0.24, 0]}>
          <ChibiFace color={color} hasBeard={true} beardStyle="goatee" />

          {/* Tall Sculpted Advisor Mitre Hat */}
          <group position={[0, 0.14, 0]}>
            <mesh position={[0, -0.04, 0]} material={goldMat}>
              <cylinderGeometry args={[0.165, 0.165, 0.045, 24]} />
            </mesh>
            <mesh position={[0, 0.08, 0]} material={robeMat} castShadow>
              <cylinderGeometry args={[0.10, 0.16, 0.22, 20]} />
            </mesh>
            <mesh position={[0, 0.20, 0]} rotation={[0, 0, Math.PI / 4]} material={goldMat}>
              <coneGeometry args={[0.065, 0.12, 4]} />
            </mesh>
            <mesh position={[0, 0.04, 0.145]} material={rubyMat}>
              <octahedronGeometry args={[0.04, 0]} />
            </mesh>
          </group>
        </group>

        {/* Right Arm */}
        <mesh position={[0.17, 0.06, 0.02]} rotation={[rightArmRotX, 0, 0]} material={robeMat} castShadow>
          <capsuleGeometry args={[0.05, 0.18, 8, 12]} />
        </mesh>

        {/* Left Arm & Ornate Magical Staff (Holding / Spellcast) */}
        <group position={[-0.17, 0.06, 0.04]} rotation={[staffArmRotX, 0, staffArmRotZ]}>
          <mesh material={robeMat} castShadow>
            <capsuleGeometry args={[0.05, 0.18, 8, 12]} />
          </mesh>

          {/* Golden Magical Staff */}
          <group position={[-0.05, 0.12 + staffPosY, 0.10 + staffPosZ]}>
            <mesh material={woodMat} castShadow>
              <cylinderGeometry args={[0.018, 0.02, 0.84, 12]} />
            </mesh>
            {/* Sculpted Golden Ring Head with glowing crystal */}
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
      </group>
    </group>
  );
};

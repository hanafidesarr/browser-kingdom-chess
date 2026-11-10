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

export const PawnCharacter: React.FC<CharacterProps> = ({
  color,
  animState = 'idle',
  animProgress = 0,
  runCycle = 0
}) => {
  const isWhite = color === 'w';
  const pal = isWhite ? kingdomColors.white : kingdomColors.black;

  const tunicMat = matRegistry.get(pal.primary, 0.55, 0.05);
  const pantsMat = matRegistry.get(pal.primaryDark, 0.6, 0.05);
  const capMat = matRegistry.get(isWhite ? '#1e3a8a' : '#7f1d1d', 0.6, 0.05);
  const beltMat = matRegistry.get(pal.leather, 0.5, 0.1);
  const buckleMat = matRegistry.get(pal.trim, 0.25, 0.85);
  const bootMat = matRegistry.get(isWhite ? '#382214' : '#18181b', 0.7, 0.0);
  const skinMat = matRegistry.get(kingdomColors.neutral.skin, 0.45, 0.0);
  const woodMat = matRegistry.get(kingdomColors.neutral.wood, 0.7, 0.0);
  const spearMat = matRegistry.get(pal.metal, 0.2, 0.9);

  // Compute skeletal / joint rotations based on animation state
  let leftLegRotX = 0;
  let rightLegRotX = 0;
  let leftArmRotX = 0;
  let leftArmRotZ = 0.2;
  let rightArmRotX = 0.5;
  let rightArmRotY = 0;
  let rightArmRotZ = -0.2;
  let spearPosZ = 0;
  let spearRotX = 0;
  let bodyLeanX = 0;
  let bodyBobY = 0;

  if (animState === 'running') {
    const swing = Math.sin(runCycle) * 0.65;
    leftLegRotX = swing;
    rightLegRotX = -swing;
    leftArmRotX = swing * 0.6;
    rightArmRotX = 0.5 - swing * 0.35;
    bodyLeanX = 0.14;
    bodyBobY = Math.abs(Math.sin(runCycle)) * 0.04;
  } else if (animState === 'attacking') {
    // Spear thrust attack sequence
    const p = animProgress;
    if (p < 0.4) {
      // Wind up / prepare spear
      const t = p / 0.4;
      bodyLeanX = -0.15 * t;
      rightArmRotX = 0.5 - 0.6 * t;
      spearPosZ = -0.12 * t;
      spearRotX = -0.2 * t;
      leftArmRotZ = 0.2 + 0.3 * t;
    } else if (p < 0.72) {
      // Fast, powerful thrust forward
      const t = (p - 0.4) / 0.32;
      bodyLeanX = -0.15 + 0.4 * t;
      rightArmRotX = -0.1 + 1.2 * t;
      spearPosZ = -0.12 + 0.42 * t;
      spearRotX = -0.2 + 0.45 * t;
      rightLegRotX = -0.25 * t;
      leftLegRotX = 0.2 * t;
    } else {
      // Recover to ready stance
      const t = (p - 0.72) / 0.28;
      bodyLeanX = 0.25 * (1 - t);
      rightArmRotX = 1.1 - 0.6 * t;
      spearPosZ = 0.30 * (1 - t);
      spearRotX = 0.25 * (1 - t);
      leftArmRotZ = 0.5 - 0.3 * t;
    }
  } else if (animState === 'victory') {
    // Raise spear high in celebration!
    const cheer = Math.sin(runCycle * 1.5);
    bodyBobY = Math.max(0, cheer) * 0.08;
    rightArmRotX = 1.4 + cheer * 0.2;
    rightArmRotZ = 0.1;
    leftArmRotZ = 0.8 + cheer * 0.2;
    leftArmRotX = -0.3;
    spearPosZ = 0.05;
    spearRotX = 0.2;
  } else if (animState === 'defeated') {
    bodyLeanX = -0.4;
    rightArmRotX = -0.2;
    leftArmRotZ = 0.6;
    spearPosZ = -0.2;
  }

  return (
    // Grounding offset: -0.012 ensures the bottom of boots touches chessboard surface at y = 0 exactly
    <group position={[0, -0.012 + bodyBobY, 0]} scale={[0.9, 0.9, 0.9]}>
      {/* Articulated Legs: Left & Right Hip Pivots */}
      <group position={[0, 0.10, 0]}>
        {/* Left Leg Pivot */}
        <group position={[-0.08, 0.04, 0]} rotation={[leftLegRotX, 0, 0]}>
          <mesh position={[0, 0, 0]} material={pantsMat} castShadow>
            <capsuleGeometry args={[0.045, 0.10, 8, 12]} />
          </mesh>
          {/* Boot */}
          <mesh position={[0, -0.05, 0.01]} material={bootMat} castShadow>
            <capsuleGeometry args={[0.048, 0.06, 8, 12]} />
          </mesh>
        </group>

        {/* Right Leg Pivot */}
        <group position={[0.08, 0.04, 0]} rotation={[rightLegRotX, 0, 0]}>
          <mesh position={[0, 0, 0]} material={pantsMat} castShadow>
            <capsuleGeometry args={[0.045, 0.10, 8, 12]} />
          </mesh>
          {/* Boot */}
          <mesh position={[0, -0.05, 0.01]} material={bootMat} castShadow>
            <capsuleGeometry args={[0.048, 0.06, 8, 12]} />
          </mesh>
        </group>
      </group>

      {/* Articulated Torso, Head & Arms (with body lean) */}
      <group position={[0, 0.20, 0]} rotation={[bodyLeanX, 0, 0]}>
        {/* Smooth Rounded Tunic / Torso */}
        <mesh position={[0, 0.08, 0]} material={tunicMat} castShadow>
          <capsuleGeometry args={[0.13, 0.14, 12, 16]} />
        </mesh>

        {/* Belt & Buckle */}
        <mesh position={[0, 0.03, 0]} material={beltMat}>
          <cylinderGeometry args={[0.145, 0.145, 0.04, 20]} />
        </mesh>
        <mesh position={[0, 0.03, 0.14]} material={buckleMat}>
          <boxGeometry args={[0.06, 0.05, 0.02]} />
        </mesh>

        {/* Chibi Face & Cap */}
        <group position={[0, 0.29, 0]}>
          <ChibiFace color={color} hairStyle="villager" />

          {/* Smooth Villager Cap */}
          <group position={[0, 0.10, -0.01]}>
            <mesh material={capMat} castShadow>
              <sphereGeometry args={[0.175, 20, 16, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
            </mesh>
            {/* Rolled Cap Rim */}
            <mesh position={[0, -0.04, 0]} material={capMat} castShadow>
              <torusGeometry args={[0.165, 0.026, 12, 24]} />
            </mesh>
            {/* Feather/Badge detail */}
            <mesh position={[0.13, 0.02, 0.08]} rotation={[0.2, 0, 0.5]} material={buckleMat}>
              <capsuleGeometry args={[0.015, 0.06, 8, 8]} />
            </mesh>
          </group>
        </group>

        {/* Left Arm Pivot (Relaxed / Counter-swing) */}
        <group position={[-0.17, 0.07, 0]} rotation={[leftArmRotX, 0, leftArmRotZ]}>
          <mesh position={[0, -0.05, 0]} material={tunicMat} castShadow>
            <capsuleGeometry args={[0.04, 0.14, 8, 12]} />
          </mesh>
          <mesh position={[-0.02, -0.13, 0]} material={skinMat}>
            <sphereGeometry args={[0.038, 12, 12]} />
          </mesh>
        </group>

        {/* Right Arm Pivot (Holding Spear / Thrust) */}
        <group position={[0.16, 0.08, 0.06]} rotation={[rightArmRotX, rightArmRotY, rightArmRotZ]}>
          <mesh position={[0, -0.05, 0]} material={tunicMat} castShadow>
            <capsuleGeometry args={[0.04, 0.14, 8, 12]} />
          </mesh>
          <mesh position={[0.02, -0.13, 0.02]} material={skinMat}>
            <sphereGeometry args={[0.038, 12, 12]} />
          </mesh>

          {/* Stylized Leaf-shaped Spear Attached to Hand */}
          <group position={[0.04, 0.10 + spearPosZ * 0.4, 0.02 + spearPosZ]} rotation={[spearRotX, 0, 0]}>
            <mesh material={woodMat} castShadow>
              <cylinderGeometry args={[0.018, 0.02, 0.85, 12]} />
            </mesh>
            {/* Spear Ferrule */}
            <mesh position={[0, 0.40, 0]} material={buckleMat}>
              <cylinderGeometry args={[0.025, 0.025, 0.04, 12]} />
            </mesh>
            {/* Smooth Leaf Spearhead */}
            <mesh position={[0, 0.50, 0]} material={spearMat} castShadow>
              <coneGeometry args={[0.065, 0.22, 16]} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};

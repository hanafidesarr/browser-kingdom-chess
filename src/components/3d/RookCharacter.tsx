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

export const RookCharacter: React.FC<CharacterProps> = ({
  color,
  animState = 'idle',
  animProgress = 0,
  runCycle = 0
}) => {
  const isWhite = color === 'w';
  const pal = isWhite ? kingdomColors.white : kingdomColors.black;

  const armorMat = matRegistry.get(pal.armor, 0.35, 0.6);
  const tunicMat = matRegistry.get(pal.primaryDark, 0.5, 0.1);
  const metalMat = matRegistry.get(pal.metal, 0.25, 0.85);
  const goldMat = matRegistry.get(pal.trim, 0.25, 0.85);

  let leftLegRotX = 0;
  let rightLegRotX = 0;
  let bodyLeanX = 0;
  let bodyBobY = 0;
  let swordArmRotX = 0.5;
  let swordArmRotZ = 0;
  let shieldArmRotX = 0;
  let shieldArmRotZ = 0;
  let shieldPosZ = 0;

  if (animState === 'running') {
    const swing = Math.sin(runCycle) * 0.62;
    leftLegRotX = swing;
    rightLegRotX = -swing;
    swordArmRotX = 0.5 - swing * 0.4;
    shieldArmRotX = swing * 0.3;
    bodyLeanX = 0.14;
    bodyBobY = Math.abs(Math.sin(runCycle)) * 0.035;
  } else if (animState === 'attacking') {
    const p = animProgress;
    if (p < 0.4) {
      // Wind up broadsword and brace shield
      const t = p / 0.4;
      bodyLeanX = -0.15 * t;
      swordArmRotX = 0.5 - 0.9 * t;
      swordArmRotZ = 0.3 * t;
      shieldArmRotX = -0.2 * t;
      shieldPosZ = -0.05 * t;
    } else if (p < 0.72) {
      // Heavy sword slash & shield slam forward
      const t = (p - 0.4) / 0.32;
      bodyLeanX = -0.15 + 0.38 * t;
      swordArmRotX = -0.4 + 1.4 * t;
      swordArmRotZ = 0.3 - 0.4 * t;
      shieldArmRotX = -0.2 + 0.5 * t;
      shieldPosZ = -0.05 + 0.22 * t;
      rightLegRotX = -0.2 * t;
      leftLegRotX = 0.18 * t;
    } else {
      // Return to guard
      const t = (p - 0.72) / 0.28;
      bodyLeanX = 0.23 * (1 - t);
      swordArmRotX = 1.0 - 0.5 * t;
      swordArmRotZ = -0.1 * (1 - t);
      shieldArmRotX = 0.3 * (1 - t);
      shieldPosZ = 0.17 * (1 - t);
    }
  } else if (animState === 'victory') {
    const cheer = Math.sin(runCycle * 1.5);
    bodyBobY = Math.max(0, cheer) * 0.06;
    swordArmRotX = 1.3 + cheer * 0.15;
    shieldArmRotX = 0.4;
    shieldPosZ = 0.08;
  } else if (animState === 'defeated') {
    bodyLeanX = -0.4;
    swordArmRotX = -0.3;
    shieldArmRotX = -0.4;
    shieldPosZ = -0.1;
  }

  return (
    // Grounding offset: -0.035 ensures the bottom of boots touches chessboard surface at y = 0 exactly
    <group position={[0, -0.035 + bodyBobY, 0]} scale={[0.93, 0.93, 0.93]}>
      {/* Heavy Rounded Armored Greaves / Boots */}
      <group position={[0, 0.10, 0]}>
        {/* Left Leg */}
        <group position={[-0.09, 0.04, 0]} rotation={[leftLegRotX, 0, 0]}>
          <mesh material={metalMat} castShadow>
            <capsuleGeometry args={[0.055, 0.10, 10, 12]} />
          </mesh>
          {/* Knee Cop */}
          <mesh position={[0, 0.04, 0.05]} material={goldMat}>
            <sphereGeometry args={[0.03, 10, 10]} />
          </mesh>
        </group>

        {/* Right Leg */}
        <group position={[0.09, 0.04, 0]} rotation={[rightLegRotX, 0, 0]}>
          <mesh material={metalMat} castShadow>
            <capsuleGeometry args={[0.055, 0.10, 10, 12]} />
          </mesh>
          {/* Knee Cop */}
          <mesh position={[0, 0.04, 0.05]} material={goldMat}>
            <sphereGeometry args={[0.03, 10, 10]} />
          </mesh>
        </group>
      </group>

      {/* Torso, Armor, Head & Arms with Body Lean */}
      <group position={[0, 0.22, 0]} rotation={[bodyLeanX, 0, 0]}>
        {/* Bulky Cuirass / Chest Armor */}
        <mesh position={[0, 0.08, 0]} material={armorMat} castShadow>
          <capsuleGeometry args={[0.155, 0.15, 14, 16]} />
        </mesh>
        {/* Gold Rim on Armor Hem */}
        <mesh position={[0, 0.0, 0]} material={goldMat}>
          <cylinderGeometry args={[0.165, 0.165, 0.03, 24]} />
        </mesh>

        {/* Curved Pauldrons (Shoulder Guards) */}
        <group position={[-0.20, 0.16, 0]} rotation={[0, 0, -0.3]}>
          <mesh material={armorMat} castShadow>
            <sphereGeometry args={[0.085, 14, 14, 0, Math.PI * 2, 0, Math.PI / 1.6]} />
          </mesh>
          <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]} material={goldMat}>
            <torusGeometry args={[0.085, 0.014, 8, 16]} />
          </mesh>
        </group>

        <group position={[0.20, 0.16, 0]} rotation={[0, 0, 0.3]}>
          <mesh material={armorMat} castShadow>
            <sphereGeometry args={[0.085, 14, 14, 0, Math.PI * 2, 0, Math.PI / 1.6]} />
          </mesh>
          <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]} material={goldMat}>
            <torusGeometry args={[0.085, 0.014, 8, 16]} />
          </mesh>
        </group>

        {/* Head with Chibi Face and Beard */}
        <group position={[0, 0.30, 0]}>
          <ChibiFace color={color} hasBeard={true} beardStyle="full" />

          {/* Castle Crenellated Helmet */}
          <group position={[0, 0.11, 0]}>
            <mesh material={metalMat} castShadow>
              <cylinderGeometry args={[0.18, 0.19, 0.14, 24]} />
            </mesh>
            <mesh position={[0, -0.04, 0]} material={goldMat}>
              <cylinderGeometry args={[0.195, 0.195, 0.03, 24]} />
            </mesh>
            {[-0.13, 0.13].map((x) =>
              [-0.13, 0.13].map((z) => (
                <mesh key={`${x}-${z}`} position={[x, 0.10, z]} material={metalMat} castShadow>
                  <boxGeometry args={[0.075, 0.09, 0.075]} />
                </mesh>
              ))
            )}
            <mesh position={[0, 0.07, 0]} material={armorMat}>
              <sphereGeometry args={[0.12, 16, 12]} />
            </mesh>
            <mesh position={[0, 0.15, 0]} material={goldMat}>
              <coneGeometry args={[0.035, 0.08, 12]} />
            </mesh>
          </group>
        </group>

        {/* Right Arm Holding Sword / Strike */}
        <group position={[0.22, 0.08, 0]} rotation={[swordArmRotX, 0, swordArmRotZ]}>
          <mesh position={[0, -0.05, 0.04]} rotation={[0.2, 0, 0]} material={metalMat} castShadow>
            <capsuleGeometry args={[0.045, 0.14, 8, 12]} />
          </mesh>
          {/* Detailed Short Sword */}
          <group position={[0, -0.06, 0.18]} rotation={[0.4, 0, 0]}>
            <mesh position={[0, 0.16, 0]} material={metalMat} castShadow>
              <boxGeometry args={[0.04, 0.32, 0.018]} />
            </mesh>
            <mesh position={[0, 0, 0]} material={goldMat}>
              <boxGeometry args={[0.14, 0.025, 0.035]} />
            </mesh>
            <mesh position={[0, -0.06, 0]} material={goldMat}>
              <sphereGeometry args={[0.022, 10, 10]} />
            </mesh>
          </group>
        </group>

        {/* Left Arm & LARGE Curved Heater Shield / Slam */}
        <group position={[-0.22, 0.08, 0.08 + shieldPosZ]} rotation={[shieldArmRotX, 0, shieldArmRotZ]}>
          <mesh position={[0, -0.02, 0.02]} material={metalMat}>
            <capsuleGeometry args={[0.045, 0.12, 8, 12]} />
          </mesh>
          {/* Large Kingdom Shield */}
          <group position={[-0.04, -0.02, 0.14]} rotation={[0, 0.35, 0]}>
            <mesh material={goldMat} castShadow>
              <boxGeometry args={[0.28, 0.38, 0.035]} />
            </mesh>
            <mesh position={[0, 0, 0.02]} material={armorMat}>
              <boxGeometry args={[0.24, 0.34, 0.02]} />
            </mesh>
            <group position={[0, 0.02, 0.035]}>
              <mesh material={goldMat}>
                <sphereGeometry args={[0.065, 12, 12]} />
              </mesh>
              <mesh position={[0, -0.08, 0]} material={goldMat}>
                <coneGeometry args={[0.06, 0.10, 8]} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};

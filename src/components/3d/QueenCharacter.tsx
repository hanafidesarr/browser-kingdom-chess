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

export const QueenCharacter: React.FC<CharacterProps> = ({
  color,
  animState = 'idle',
  animProgress = 0,
  runCycle = 0
}) => {
  const isWhite = color === 'w';
  const pal = isWhite ? kingdomColors.white : kingdomColors.black;

  const dressMat = matRegistry.get(pal.primary, 0.4, 0.1);
  const goldMat = matRegistry.get(pal.trim, 0.25, 0.85);
  const whiteMat = matRegistry.get(pal.cloth, 0.75, 0.0);
  const rubyMat = matRegistry.get(isWhite ? kingdomColors.neutral.sapphire : kingdomColors.neutral.ruby, 0.1, 0.4);

  let dressSwayZ = 0;
  let bodyLeanX = 0;
  let bodyBobY = 0;
  let weaponArmRotX = 0.4;
  let weaponArmRotY = 0;
  let weaponArmRotZ = -0.2;
  let leftArmRotX = 0.3;

  if (animState === 'running') {
    const swing = Math.sin(runCycle);
    dressSwayZ = swing * 0.06;
    bodyLeanX = 0.12;
    bodyBobY = Math.abs(swing) * 0.035;
    weaponArmRotX = 0.4 - swing * 0.3;
    leftArmRotX = 0.3 + swing * 0.3;
  } else if (animState === 'attacking') {
    // Elegant royal slash sequence
    const p = animProgress;
    if (p < 0.4) {
      // Wind up across opposite shoulder
      const t = p / 0.4;
      bodyLeanX = -0.12 * t;
      weaponArmRotX = 0.4 + 0.6 * t;
      weaponArmRotY = -0.7 * t;
      weaponArmRotZ = -0.2 - 0.4 * t;
    } else if (p < 0.72) {
      // Swift horizontal slash arc
      const t = (p - 0.4) / 0.32;
      bodyLeanX = -0.12 + 0.3 * t;
      weaponArmRotX = 1.0 - 0.8 * t;
      weaponArmRotY = -0.7 + 1.4 * t;
      weaponArmRotZ = -0.6 + 0.8 * t;
    } else {
      // Elegant flourish back to ready
      const t = (p - 0.72) / 0.28;
      bodyLeanX = 0.18 * (1 - t);
      weaponArmRotX = 0.2 + 0.2 * t;
      weaponArmRotY = 0.7 * (1 - t);
      weaponArmRotZ = 0.2 - 0.4 * t;
    }
  } else if (animState === 'victory') {
    const cheer = Math.sin(runCycle * 1.5);
    bodyBobY = Math.max(0, cheer) * 0.05;
    weaponArmRotX = 1.5 + cheer * 0.15;
    weaponArmRotZ = 0.1;
    leftArmRotX = -0.2;
  } else if (animState === 'defeated') {
    bodyLeanX = -0.35;
    weaponArmRotX = -0.2;
  }

  return (
    // Grounding offset: -0.0725 ensures the bottom of the ballgown hem touches chessboard surface at y = 0 exactly
    <group position={[0, -0.0725 + bodyBobY, 0]} scale={[0.93, 0.93, 0.93]}>
      {/* Royal Flared Ballgown with gentle motion sway */}
      <group position={[0, 0.08, 0]} rotation={[0, 0, dressSwayZ]}>
        <mesh position={[0, 0.14, 0]} material={dressMat} castShadow>
          <cylinderGeometry args={[0.16, 0.28, 0.28, 24]} />
        </mesh>
        {/* Gold Filigree Hem resting directly on square */}
        <mesh position={[0, 0.01, 0]} material={goldMat}>
          <cylinderGeometry args={[0.282, 0.282, 0.035, 24]} />
        </mesh>
      </group>

      {/* Bodice, Head, Arms & Sceptre (with body lean) */}
      <group position={[0, 0.38, 0]} rotation={[bodyLeanX, 0, dressSwayZ * 0.5]}>
        {/* Sculpted Bodice */}
        <mesh position={[0, 0.0, 0]} material={dressMat} castShadow>
          <capsuleGeometry args={[0.13, 0.14, 12, 16]} />
        </mesh>
        {/* Gold Embroidery */}
        <mesh position={[0, -0.02, 0.12]} material={goldMat}>
          <boxGeometry args={[0.06, 0.22, 0.01]} />
        </mesh>

        {/* White Puffed Shoulders */}
        <mesh position={[-0.17, 0.06, 0]} material={whiteMat} castShadow>
          <sphereGeometry args={[0.075, 14, 14]} />
        </mesh>
        <mesh position={[0.17, 0.06, 0]} material={whiteMat} castShadow>
          <sphereGeometry args={[0.075, 14, 14]} />
        </mesh>

        {/* Left Arm */}
        <mesh position={[-0.17, -0.04, 0.03]} rotation={[leftArmRotX, 0, 0]} material={dressMat}>
          <capsuleGeometry args={[0.035, 0.14, 8, 10]} />
        </mesh>

        {/* Chibi Face with Flowing Hair & Crown */}
        <group position={[0, 0.22, 0]}>
          <ChibiFace color={color} hairStyle="flowing" />

          {/* Queen's Elegant Golden Crown */}
          <group position={[0, 0.15, 0]}>
            <mesh material={goldMat} castShadow>
              <cylinderGeometry args={[0.16, 0.15, 0.06, 24]} />
            </mesh>
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
            <mesh position={[0, 0.04, 0.16]} material={rubyMat}>
              <octahedronGeometry args={[0.035, 0]} />
            </mesh>
          </group>
        </group>

        {/* Right Arm & Royal Sceptre / Rapier (Holding & Slash Strike) */}
        <group position={[0.20, 0.06, 0.08]} rotation={[weaponArmRotX, weaponArmRotY, weaponArmRotZ]}>
          <mesh position={[0, -0.06, 0]} material={dressMat}>
            <capsuleGeometry args={[0.035, 0.14, 8, 10]} />
          </mesh>
          {/* Royal Golden Sceptre */}
          <group position={[0, -0.04, 0.14]}>
            <mesh material={goldMat} castShadow>
              <cylinderGeometry args={[0.015, 0.018, 0.42, 12]} />
            </mesh>
            <mesh position={[0, 0.22, 0]} material={rubyMat}>
              <octahedronGeometry args={[0.04, 0]} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};

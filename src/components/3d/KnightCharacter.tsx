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

export const KnightCharacter: React.FC<CharacterProps> = ({
  color,
  animState = 'idle',
  animProgress = 0,
  runCycle = 0
}) => {
  const isWhite = color === 'w';
  const pal = isWhite ? kingdomColors.white : kingdomColors.black;

  const horseMat = matRegistry.get(pal.horse, 0.45, 0.05);
  const hoofMat = matRegistry.get(isWhite ? '#1e293b' : '#020617', 0.8, 0.0);
  const saddleMat = matRegistry.get(pal.primary, 0.45, 0.1);
  const goldMat = matRegistry.get(pal.trim, 0.25, 0.85);
  const maneMat = matRegistry.get(isWhite ? '#334155' : '#020617', 0.6, 0.0);
  const armorMat = matRegistry.get(pal.armor, 0.35, 0.6);
  const metalMat = matRegistry.get(pal.metal, 0.25, 0.85);

  let frontLegRotX = 0;
  let backLegRotX = 0;
  let horsePitchX = 0;
  let neckRotX = 0.42;
  let riderLeanX = 0;
  let swordArmRotX = 0.6;
  let swordArmRotZ = -0.2;
  let swordPosZ = 0;

  if (animState === 'running') {
    // 4-legged Gallop Cycle
    const gallop = Math.sin(runCycle);
    frontLegRotX = -gallop * 0.75;
    backLegRotX = gallop * 0.70;
    horsePitchX = gallop * 0.12;
    neckRotX = 0.42 + gallop * 0.10;
    riderLeanX = 0.22;
    swordArmRotX = 0.6 - gallop * 0.3;
  } else if (animState === 'attacking') {
    const p = animProgress;
    if (p < 0.4) {
      // Wind up / Horse rears slightly before charging
      const t = p / 0.4;
      horsePitchX = -0.28 * t;
      frontLegRotX = -0.5 * t;
      backLegRotX = 0.2 * t;
      neckRotX = 0.42 - 0.2 * t;
      riderLeanX = -0.15 * t;
      swordArmRotX = 0.6 - 0.5 * t;
      swordPosZ = -0.08 * t;
    } else if (p < 0.72) {
      // Powerful mounted charge strike
      const t = (p - 0.4) / 0.32;
      horsePitchX = -0.28 + 0.48 * t;
      frontLegRotX = -0.5 + 0.9 * t;
      backLegRotX = 0.2 - 0.7 * t;
      neckRotX = 0.22 + 0.35 * t;
      riderLeanX = 0.32 * t;
      swordArmRotX = 0.1 + 1.2 * t;
      swordPosZ = -0.08 + 0.30 * t;
    } else {
      // Settle down cleanly
      const t = (p - 0.72) / 0.28;
      horsePitchX = 0.2 * (1 - t);
      frontLegRotX = 0.4 * (1 - t);
      backLegRotX = -0.5 * (1 - t);
      neckRotX = 0.57 - 0.15 * t;
      riderLeanX = 0.32 * (1 - t);
      swordArmRotX = 1.3 - 0.7 * t;
      swordPosZ = 0.22 * (1 - t);
    }
  } else if (animState === 'victory') {
    // Majestic victory rearing!
    const cheer = Math.sin(runCycle * 1.5);
    horsePitchX = -0.35;
    frontLegRotX = -0.6 + cheer * 0.2;
    backLegRotX = 0.25;
    neckRotX = 0.25;
    riderLeanX = -0.1;
    swordArmRotX = 1.4 + cheer * 0.2;
  } else if (animState === 'defeated') {
    horsePitchX = -0.3;
    frontLegRotX = 0.3;
    backLegRotX = 0.4;
    riderLeanX = -0.4;
    swordArmRotX = -0.2;
  }

  return (
    // Grounding offset: -0.10 ensures all 4 horse hooves stand squarely on chessboard squares at y = 0 exactly
    <group position={[0, -0.10, 0]} scale={[0.88, 0.88, 0.88]}>
      {/* HORSE GROUP (Articulated with pitch and 4-legged gallop) */}
      <group position={[0, 0.08, 0]} rotation={[horsePitchX, 0, 0]}>
        {/* Front Legs (z = 0.12) */}
        {[-0.10, 0.10].map((x) => (
          <group key={`front-${x}`} position={[x, 0.14, 0.12]} rotation={[frontLegRotX, 0, 0]}>
            <mesh material={horseMat} castShadow>
              <capsuleGeometry args={[0.045, 0.18, 8, 12]} />
            </mesh>
            <mesh position={[0, -0.10, 0]} material={hoofMat}>
              <cylinderGeometry args={[0.048, 0.052, 0.04, 16]} />
            </mesh>
          </group>
        ))}

        {/* Back Legs (z = -0.12) */}
        {[-0.10, 0.10].map((x) => (
          <group key={`back-${x}`} position={[x, 0.14, -0.12]} rotation={[backLegRotX, 0, 0]}>
            <mesh material={horseMat} castShadow>
              <capsuleGeometry args={[0.045, 0.18, 8, 12]} />
            </mesh>
            <mesh position={[0, -0.10, 0]} material={hoofMat}>
              <cylinderGeometry args={[0.048, 0.052, 0.04, 16]} />
            </mesh>
          </group>
        ))}

        {/* Smooth Rounded Horse Body */}
        <mesh position={[0, 0.30, 0]} rotation={[Math.PI / 2, 0, 0]} material={horseMat} castShadow>
          <capsuleGeometry args={[0.14, 0.26, 12, 16]} />
        </mesh>

        {/* Saddle Blanket with Gold Embroidery */}
        <mesh position={[0, 0.31, 0]} rotation={[Math.PI / 2, 0, 0]} material={saddleMat}>
          <capsuleGeometry args={[0.155, 0.20, 12, 16]} />
        </mesh>
        <mesh position={[0, 0.22, 0]} material={goldMat}>
          <boxGeometry args={[0.32, 0.03, 0.28]} />
        </mesh>

        {/* Smooth Arched Neck */}
        <group position={[0, 0.44, 0.18]} rotation={[neckRotX, 0, 0]}>
          <mesh material={horseMat} castShadow>
            <capsuleGeometry args={[0.09, 0.18, 10, 14]} />
          </mesh>
          <mesh position={[0, 0.02, -0.09]} material={maneMat}>
            <capsuleGeometry args={[0.04, 0.20, 8, 10]} />
          </mesh>
        </group>

        {/* Rounded Horse Head */}
        <group position={[0, 0.58, 0.28]}>
          <mesh material={horseMat} castShadow>
            <sphereGeometry args={[0.11, 16, 14]} />
          </mesh>
          <mesh position={[0, -0.04, 0.11]} material={horseMat}>
            <sphereGeometry args={[0.08, 14, 12]} />
          </mesh>
          <mesh position={[-0.03, -0.04, 0.17]} material={hoofMat}>
            <sphereGeometry args={[0.012, 8, 8]} />
          </mesh>
          <mesh position={[0.03, -0.04, 0.17]} material={hoofMat}>
            <sphereGeometry args={[0.012, 8, 8]} />
          </mesh>
          <mesh position={[-0.09, 0.02, 0.05]} material={hoofMat}>
            <sphereGeometry args={[0.025, 10, 10]} />
          </mesh>
          <mesh position={[0.09, 0.02, 0.05]} material={hoofMat}>
            <sphereGeometry args={[0.025, 10, 10]} />
          </mesh>
          <mesh position={[-0.06, 0.12, -0.04]} rotation={[0.2, 0, -0.2]} material={horseMat}>
            <coneGeometry args={[0.035, 0.09, 8]} />
          </mesh>
          <mesh position={[0.06, 0.12, -0.04]} rotation={[0.2, 0, 0.2]} material={horseMat}>
            <coneGeometry args={[0.035, 0.09, 8]} />
          </mesh>
          <mesh position={[0, 0.01, 0.06]} material={goldMat}>
            <torusGeometry args={[0.095, 0.012, 8, 16]} />
          </mesh>
        </group>

        {/* Flowing Tail */}
        <mesh position={[0, 0.28, -0.22]} rotation={[-0.35, 0, 0]} material={maneMat}>
          <capsuleGeometry args={[0.04, 0.20, 8, 10]} />
        </mesh>

        {/* KNIGHT RIDER (Mounted Chibi Hero - moves dynamically with horse) */}
        <group position={[0, 0.42, -0.02]} rotation={[riderLeanX, 0, 0]}>
          {/* Legs Astride Saddle */}
          <mesh position={[-0.14, -0.06, 0]} rotation={[0.3, 0, -0.2]} material={armorMat}>
            <capsuleGeometry args={[0.04, 0.14, 8, 10]} />
          </mesh>
          <mesh position={[0.14, -0.06, 0]} rotation={[0.3, 0, 0.2]} material={armorMat}>
            <capsuleGeometry args={[0.04, 0.14, 8, 10]} />
          </mesh>

          {/* Knight Torso in Enameled Plate */}
          <mesh position={[0, 0.08, 0]} material={armorMat} castShadow>
            <capsuleGeometry args={[0.13, 0.13, 12, 14]} />
          </mesh>
          <mesh position={[0, 0.08, 0.11]} material={goldMat}>
            <boxGeometry args={[0.06, 0.16, 0.01]} />
          </mesh>

          {/* Chibi Head */}
          <group position={[0, 0.28, 0]}>
            <ChibiFace color={color} />

            {/* Pointed Knight Helmet */}
            <group position={[0, 0.10, 0]}>
              <mesh material={metalMat} castShadow>
                <sphereGeometry args={[0.165, 20, 16, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
              </mesh>
              <mesh position={[0, 0.11, 0]} material={metalMat}>
                <coneGeometry args={[0.12, 0.14, 16]} />
              </mesh>
              <mesh position={[0, -0.03, 0.04]} material={goldMat}>
                <boxGeometry args={[0.16, 0.04, 0.13]} />
              </mesh>
              <mesh position={[0, 0.15, -0.04]} material={saddleMat}>
                <capsuleGeometry args={[0.022, 0.12, 6, 8]} />
              </mesh>
            </group>
          </group>

          {/* Arm Holding Sword / Mounted Strike */}
          <group position={[0.18, 0.08, 0.10]} rotation={[swordArmRotX, 0.2, swordArmRotZ]}>
            <mesh material={armorMat}>
              <capsuleGeometry args={[0.038, 0.12, 8, 10]} />
            </mesh>
            <group position={[0, 0.09, 0.10 + swordPosZ]}>
              <mesh position={[0, 0.15, 0]} material={metalMat} castShadow>
                <boxGeometry args={[0.035, 0.28, 0.015]} />
              </mesh>
              <mesh position={[0, 0, 0]} material={goldMat}>
                <boxGeometry args={[0.11, 0.022, 0.03]} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};

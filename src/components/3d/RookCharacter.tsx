import React from 'react';
import { kingdomColors, matRegistry } from './Materials';
import { Pedestal } from './Pedestal';
import { ChibiFace } from './ChibiFace';

interface CharacterProps {
  color: 'w' | 'b';
}

export const RookCharacter: React.FC<CharacterProps> = ({ color }) => {
  const isWhite = color === 'w';
  const pal = isWhite ? kingdomColors.white : kingdomColors.black;

  const armorMat = matRegistry.get(pal.armor, 0.35, 0.6);
  const tunicMat = matRegistry.get(pal.primaryDark, 0.5, 0.1);
  const metalMat = matRegistry.get(pal.metal, 0.25, 0.85);
  const goldMat = matRegistry.get(pal.trim, 0.25, 0.85);

  return (
    <group position={[0, 0, 0]} scale={[0.93, 0.93, 0.93]}>
      <Pedestal color={color} />

      {/* Heavy Rounded Armored Greaves / Boots */}
      <group position={[0, 0.10, 0]}>
        <mesh position={[-0.09, 0.04, 0]} material={metalMat} castShadow>
          <capsuleGeometry args={[0.055, 0.10, 10, 12]} />
        </mesh>
        <mesh position={[0.09, 0.04, 0]} material={metalMat} castShadow>
          <capsuleGeometry args={[0.055, 0.10, 10, 12]} />
        </mesh>
        {/* Knee Cops */}
        <mesh position={[-0.09, 0.08, 0.05]} material={goldMat}>
          <sphereGeometry args={[0.03, 10, 10]} />
        </mesh>
        <mesh position={[0.09, 0.08, 0.05]} material={goldMat}>
          <sphereGeometry args={[0.03, 10, 10]} />
        </mesh>
      </group>

      {/* Bulky Cuirass / Chest Armor */}
      <mesh position={[0, 0.30, 0]} material={armorMat} castShadow>
        <capsuleGeometry args={[0.155, 0.15, 14, 16]} />
      </mesh>
      {/* Gold Rim on Armor Hem */}
      <mesh position={[0, 0.22, 0]} material={goldMat}>
        <cylinderGeometry args={[0.165, 0.165, 0.03, 24]} />
      </mesh>

      {/* Curved Pauldrons (Shoulder Guards) */}
      <group position={[-0.20, 0.38, 0]} rotation={[0, 0, -0.3]}>
        <mesh material={armorMat} castShadow>
          <sphereGeometry args={[0.085, 14, 14, 0, Math.PI * 2, 0, Math.PI / 1.6]} />
        </mesh>
        <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]} material={goldMat}>
          <torusGeometry args={[0.085, 0.014, 8, 16]} />
        </mesh>
      </group>

      <group position={[0.20, 0.38, 0]} rotation={[0, 0, 0.3]}>
        <mesh material={armorMat} castShadow>
          <sphereGeometry args={[0.085, 14, 14, 0, Math.PI * 2, 0, Math.PI / 1.6]} />
        </mesh>
        <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]} material={goldMat}>
          <torusGeometry args={[0.085, 0.014, 8, 16]} />
        </mesh>
      </group>

      {/* Head with Chibi Face and Beard */}
      <group position={[0, 0.52, 0]}>
        <ChibiFace color={color} hasBeard={true} beardStyle="full" />

        {/* Castle Crenellated Helmet */}
        <group position={[0, 0.11, 0]}>
          {/* Smooth Helmet Bowl */}
          <mesh material={metalMat} castShadow>
            <cylinderGeometry args={[0.18, 0.19, 0.14, 24]} />
          </mesh>
          {/* Gold Visor Brow Band */}
          <mesh position={[0, -0.04, 0]} material={goldMat}>
            <cylinderGeometry args={[0.195, 0.195, 0.03, 24]} />
          </mesh>
          {/* Four Crenellations (Castle Battlements) */}
          {[-0.13, 0.13].map((x) =>
            [-0.13, 0.13].map((z) => (
              <mesh key={`${x}-${z}`} position={[x, 0.10, z]} material={metalMat} castShadow>
                <boxGeometry args={[0.075, 0.09, 0.075]} />
              </mesh>
            ))
          )}
          {/* Inner Colored Kingdom Dome */}
          <mesh position={[0, 0.07, 0]} material={armorMat}>
            <sphereGeometry args={[0.12, 16, 12]} />
          </mesh>
          <mesh position={[0, 0.15, 0]} material={goldMat}>
            <coneGeometry args={[0.035, 0.08, 12]} />
          </mesh>
        </group>
      </group>

      {/* Right Arm Holding Sword */}
      <group position={[0.22, 0.30, 0]}>
        <mesh position={[0, -0.05, 0.04]} rotation={[0.5, 0, 0]} material={metalMat} castShadow>
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

      {/* Left Arm & LARGE Curved Heater Shield */}
      <group position={[-0.22, 0.30, 0.08]}>
        <mesh position={[0, -0.02, 0.02]} material={metalMat}>
          <capsuleGeometry args={[0.045, 0.12, 8, 12]} />
        </mesh>
        {/* Large Kingdom Shield */}
        <group position={[-0.04, -0.02, 0.14]} rotation={[0, 0.35, 0]}>
          {/* Gold Shield Bevel Rim */}
          <mesh material={goldMat} castShadow>
            <boxGeometry args={[0.28, 0.38, 0.035]} />
          </mesh>
          {/* Shield Main Enameled Face */}
          <mesh position={[0, 0, 0.02]} material={armorMat}>
            <boxGeometry args={[0.24, 0.34, 0.02]} />
          </mesh>
          {/* 3D Embossed Golden Heraldic Lion Crest */}
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
  );
};

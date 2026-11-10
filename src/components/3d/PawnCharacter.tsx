import React from 'react';
import { kingdomColors, matRegistry } from './Materials';
import { Pedestal } from './Pedestal';
import { ChibiFace } from './ChibiFace';

interface CharacterProps {
  color: 'w' | 'b';
}

export const PawnCharacter: React.FC<CharacterProps> = ({ color }) => {
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

  return (
    <group position={[0, 0, 0]} scale={[0.9, 0.9, 0.9]}>
      <Pedestal color={color} />

      {/* Rounded Legs & Boots */}
      <group position={[0, 0.10, 0]}>
        <mesh position={[-0.08, 0.04, 0]} material={pantsMat} castShadow>
          <capsuleGeometry args={[0.045, 0.10, 8, 12]} />
        </mesh>
        <mesh position={[0.08, 0.04, 0]} material={pantsMat} castShadow>
          <capsuleGeometry args={[0.045, 0.10, 8, 12]} />
        </mesh>
        {/* Boots */}
        <mesh position={[-0.08, -0.01, 0.01]} material={bootMat} castShadow>
          <capsuleGeometry args={[0.048, 0.06, 8, 12]} />
        </mesh>
        <mesh position={[0.08, -0.01, 0.01]} material={bootMat} castShadow>
          <capsuleGeometry args={[0.048, 0.06, 8, 12]} />
        </mesh>
      </group>

      {/* Smooth Rounded Tunic / Torso */}
      <mesh position={[0, 0.28, 0]} material={tunicMat} castShadow>
        <capsuleGeometry args={[0.13, 0.14, 12, 16]} />
      </mesh>

      {/* Belt & Buckle */}
      <mesh position={[0, 0.23, 0]} material={beltMat}>
        <cylinderGeometry args={[0.145, 0.145, 0.04, 20]} />
      </mesh>
      <mesh position={[0, 0.23, 0.14]} material={buckleMat}>
        <boxGeometry args={[0.06, 0.05, 0.02]} />
      </mesh>

      {/* Chibi Face */}
      <group position={[0, 0.49, 0]}>
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

      {/* Rounded Arms */}
      {/* Left Arm (Relaxed) */}
      <mesh position={[-0.17, 0.27, 0]} rotation={[0, 0, 0.2]} material={tunicMat} castShadow>
        <capsuleGeometry args={[0.04, 0.14, 8, 12]} />
      </mesh>
      <mesh position={[-0.20, 0.17, 0]} material={skinMat}>
        <sphereGeometry args={[0.038, 12, 12]} />
      </mesh>

      {/* Right Arm (Holding Spear) */}
      <mesh position={[0.16, 0.28, 0.06]} rotation={[0.5, 0, -0.2]} material={tunicMat} castShadow>
        <capsuleGeometry args={[0.04, 0.14, 8, 12]} />
      </mesh>
      <mesh position={[0.19, 0.23, 0.13]} material={skinMat}>
        <sphereGeometry args={[0.038, 12, 12]} />
      </mesh>

      {/* Stylized Leaf-shaped Spear */}
      <group position={[0.21, 0.46, 0.14]}>
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
  );
};

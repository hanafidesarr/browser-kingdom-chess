import React from 'react';
import { kingdomColors, matRegistry } from './Materials';
import { Pedestal } from './Pedestal';
import { ChibiFace } from './ChibiFace';

interface CharacterProps {
  color: 'w' | 'b';
}

export const KnightCharacter: React.FC<CharacterProps> = ({ color }) => {
  const isWhite = color === 'w';
  const pal = isWhite ? kingdomColors.white : kingdomColors.black;

  const horseMat = matRegistry.get(pal.horse, 0.45, 0.05);
  const hoofMat = matRegistry.get(isWhite ? '#1e293b' : '#020617', 0.8, 0.0);
  const saddleMat = matRegistry.get(pal.primary, 0.45, 0.1);
  const goldMat = matRegistry.get(pal.trim, 0.25, 0.85);
  const maneMat = matRegistry.get(isWhite ? '#334155' : '#020617', 0.6, 0.0);
  const armorMat = matRegistry.get(pal.armor, 0.35, 0.6);
  const metalMat = matRegistry.get(pal.metal, 0.25, 0.85);

  return (
    <group position={[0, 0, 0]} scale={[0.88, 0.88, 0.88]}>
      <Pedestal color={color} />

      {/* HORSE (Smooth, Rounded Stylized Steed) */}
      <group position={[0, 0.08, 0]}>
        {/* Four Smooth Horse Legs */}
        {[-0.10, 0.10].map((x) =>
          [-0.12, 0.12].map((z) => (
            <group key={`${x}-${z}`} position={[x, 0.14, z]}>
              <mesh material={horseMat} castShadow>
                <capsuleGeometry args={[0.045, 0.18, 8, 12]} />
              </mesh>
              {/* Rounded Hoof */}
              <mesh position={[0, -0.10, 0]} material={hoofMat}>
                <cylinderGeometry args={[0.048, 0.052, 0.04, 16]} />
              </mesh>
            </group>
          ))
        )}

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
        <group position={[0, 0.44, 0.18]} rotation={[0.42, 0, 0]}>
          <mesh material={horseMat} castShadow>
            <capsuleGeometry args={[0.09, 0.18, 10, 14]} />
          </mesh>
          {/* Stylized Rounded Mane */}
          <mesh position={[0, 0.02, -0.09]} material={maneMat}>
            <capsuleGeometry args={[0.04, 0.20, 8, 10]} />
          </mesh>
        </group>

        {/* Rounded Horse Head */}
        <group position={[0, 0.58, 0.28]}>
          <mesh material={horseMat} castShadow>
            <sphereGeometry args={[0.11, 16, 14]} />
          </mesh>
          {/* Muzzle */}
          <mesh position={[0, -0.04, 0.11]} material={horseMat}>
            <sphereGeometry args={[0.08, 14, 12]} />
          </mesh>
          {/* Nostrils */}
          <mesh position={[-0.03, -0.04, 0.17]} material={hoofMat}>
            <sphereGeometry args={[0.012, 8, 8]} />
          </mesh>
          <mesh position={[0.03, -0.04, 0.17]} material={hoofMat}>
            <sphereGeometry args={[0.012, 8, 8]} />
          </mesh>
          {/* Cute Horse Eyes */}
          <mesh position={[-0.09, 0.02, 0.05]} material={hoofMat}>
            <sphereGeometry args={[0.025, 10, 10]} />
          </mesh>
          <mesh position={[0.09, 0.02, 0.05]} material={hoofMat}>
            <sphereGeometry args={[0.025, 10, 10]} />
          </mesh>
          {/* Pointed Ears */}
          <mesh position={[-0.06, 0.12, -0.04]} rotation={[0.2, 0, -0.2]} material={horseMat}>
            <coneGeometry args={[0.035, 0.09, 8]} />
          </mesh>
          <mesh position={[0.06, 0.12, -0.04]} rotation={[0.2, 0, 0.2]} material={horseMat}>
            <coneGeometry args={[0.035, 0.09, 8]} />
          </mesh>
          {/* Gold Bridle & Reins */}
          <mesh position={[0, 0.01, 0.06]} material={goldMat}>
            <torusGeometry args={[0.095, 0.012, 8, 16]} />
          </mesh>
        </group>

        {/* Flowing Tail */}
        <mesh position={[0, 0.28, -0.22]} rotation={[-0.35, 0, 0]} material={maneMat}>
          <capsuleGeometry args={[0.04, 0.20, 8, 10]} />
        </mesh>
      </group>

      {/* KNIGHT RIDER (Mounted Chibi Hero) */}
      <group position={[0, 0.50, -0.02]}>
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
            {/* Colored Plume / Crest */}
            <mesh position={[0, 0.15, -0.04]} material={saddleMat}>
              <capsuleGeometry args={[0.022, 0.12, 6, 8]} />
            </mesh>
          </group>
        </group>

        {/* Arm Holding Sword */}
        <group position={[0.18, 0.08, 0.10]} rotation={[0.6, 0.2, -0.2]}>
          <mesh material={armorMat}>
            <capsuleGeometry args={[0.038, 0.12, 8, 10]} />
          </mesh>
          <group position={[0, 0.09, 0.10]}>
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
  );
};

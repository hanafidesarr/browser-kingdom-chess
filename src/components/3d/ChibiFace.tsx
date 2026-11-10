import React from 'react';
import { kingdomColors, matRegistry } from './Materials';

interface ChibiFaceProps {
  color: 'w' | 'b';
  hasBeard?: boolean;
  beardStyle?: 'full' | 'goatee' | 'moustache';
  hairStyle?: 'villager' | 'advisor' | 'flowing' | 'king';
  hairColor?: string;
}

export const ChibiFace: React.FC<ChibiFaceProps> = ({
  color,
  hasBeard = false,
  beardStyle = 'full',
  hairStyle,
  hairColor
}) => {
  const isWhite = color === 'w';
  const pal = isWhite ? kingdomColors.white : kingdomColors.black;

  const skinMat = matRegistry.get(kingdomColors.neutral.skin, 0.45, 0.0);
  const blushMat = matRegistry.get(kingdomColors.neutral.skinBlush, 0.6, 0.0);
  const eyeWhiteMat = matRegistry.get(kingdomColors.neutral.eyeWhite, 0.2, 0.0);
  const eyeIrisMat = matRegistry.get(pal.eyeIris, 0.2, 0.1);
  const eyePupilMat = matRegistry.get(kingdomColors.neutral.eyePupil, 0.1, 0.0);
  const eyeGleamMat = matRegistry.get(kingdomColors.neutral.eyeHighlight, 0.1, 0.0);
  const beardMat = matRegistry.get(hairColor || kingdomColors.neutral.beardBrown, 0.6, 0.0);

  return (
    <group position={[0, 0, 0]}>
      {/* Smooth Rounded Cranium / Head */}
      <mesh material={skinMat} castShadow>
        <sphereGeometry args={[0.165, 24, 20]} />
      </mesh>

      {/* Cute Rounded Cheeks */}
      <mesh position={[-0.09, -0.04, 0.10]} material={blushMat}>
        <sphereGeometry args={[0.04, 12, 12]} />
      </mesh>
      <mesh position={[0.09, -0.04, 0.10]} material={blushMat}>
        <sphereGeometry args={[0.04, 12, 12]} />
      </mesh>

      {/* Cute Button Nose */}
      <mesh position={[0, -0.015, 0.16]} material={skinMat}>
        <sphereGeometry args={[0.022, 12, 12]} />
      </mesh>

      {/* Left Eye */}
      <group position={[-0.065, 0.02, 0.145]} rotation={[-0.05, -0.15, 0]}>
        {/* Eye Sclera (White) */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={eyeWhiteMat}>
          <cylinderGeometry args={[0.032, 0.032, 0.01, 16]} />
        </mesh>
        {/* Iris (Kingdom Color) */}
        <mesh position={[0, 0, 0.005]} rotation={[Math.PI / 2, 0, 0]} material={eyeIrisMat}>
          <cylinderGeometry args={[0.022, 0.022, 0.01, 16]} />
        </mesh>
        {/* Pupil */}
        <mesh position={[0, 0, 0.009]} rotation={[Math.PI / 2, 0, 0]} material={eyePupilMat}>
          <cylinderGeometry args={[0.014, 0.014, 0.01, 12]} />
        </mesh>
        {/* Specular Gleam / Twinkle */}
        <mesh position={[0.007, 0.008, 0.012]} material={eyeGleamMat}>
          <sphereGeometry args={[0.006, 8, 8]} />
        </mesh>
      </group>

      {/* Right Eye */}
      <group position={[0.065, 0.02, 0.145]} rotation={[-0.05, 0.15, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={eyeWhiteMat}>
          <cylinderGeometry args={[0.032, 0.032, 0.01, 16]} />
        </mesh>
        <mesh position={[0, 0, 0.005]} rotation={[Math.PI / 2, 0, 0]} material={eyeIrisMat}>
          <cylinderGeometry args={[0.022, 0.022, 0.01, 16]} />
        </mesh>
        <mesh position={[0, 0, 0.009]} rotation={[Math.PI / 2, 0, 0]} material={eyePupilMat}>
          <cylinderGeometry args={[0.014, 0.014, 0.01, 12]} />
        </mesh>
        <mesh position={[0.007, 0.008, 0.012]} material={eyeGleamMat}>
          <sphereGeometry args={[0.006, 8, 8]} />
        </mesh>
      </group>

      {/* Facial Hair (Beard / Moustache) */}
      {hasBeard && (
        <group position={[0, -0.06, 0.12]}>
          {beardStyle === 'full' && (
            <>
              {/* Full Rounded Noble Beard */}
              <mesh position={[0, -0.04, 0.01]} material={beardMat} castShadow>
                <sphereGeometry args={[0.08, 16, 12]} />
              </mesh>
              {/* Moustache Wings */}
              <mesh position={[-0.05, 0.025, 0.035]} rotation={[0, 0, -0.2]} material={beardMat}>
                <capsuleGeometry args={[0.018, 0.05, 8, 8]} />
              </mesh>
              <mesh position={[0.05, 0.025, 0.035]} rotation={[0, 0, 0.2]} material={beardMat}>
                <capsuleGeometry args={[0.018, 0.05, 8, 8]} />
              </mesh>
            </>
          )}

          {beardStyle === 'goatee' && (
            <>
              {/* Trim Advisor Goatee */}
              <mesh position={[0, -0.04, 0.01]} rotation={[Math.PI, 0, 0]} material={beardMat} castShadow>
                <coneGeometry args={[0.04, 0.08, 8]} />
              </mesh>
              <mesh position={[0, 0.02, 0.03]} rotation={[0, 0, Math.PI / 2]} material={beardMat}>
                <capsuleGeometry args={[0.014, 0.06, 8, 8]} />
              </mesh>
            </>
          )}

          {beardStyle === 'moustache' && (
            <mesh position={[0, 0.02, 0.03]} rotation={[0, 0, Math.PI / 2]} material={beardMat}>
              <capsuleGeometry args={[0.018, 0.08, 8, 8]} />
            </mesh>
          )}
        </group>
      )}

      {/* Flowing Hair for Queen */}
      {hairStyle === 'flowing' && (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.05, -0.03]} material={beardMat} castShadow>
            <sphereGeometry args={[0.175, 20, 16]} />
          </mesh>
          <mesh position={[-0.14, -0.12, 0]} rotation={[0.1, 0, -0.1]} material={beardMat} castShadow>
            <capsuleGeometry args={[0.045, 0.22, 12, 12]} />
          </mesh>
          <mesh position={[0.14, -0.12, 0]} rotation={[0.1, 0, 0.1]} material={beardMat} castShadow>
            <capsuleGeometry args={[0.045, 0.22, 12, 12]} />
          </mesh>
          <mesh position={[0, -0.14, -0.10]} material={beardMat} castShadow>
            <capsuleGeometry args={[0.09, 0.22, 12, 12]} />
          </mesh>
        </group>
      )}

      {/* Villager bangs */}
      {hairStyle === 'villager' && (
        <group position={[0, 0.08, 0.09]}>
          <mesh material={beardMat}>
            <sphereGeometry args={[0.09, 12, 8]} />
          </mesh>
        </group>
      )}
    </group>
  );
};

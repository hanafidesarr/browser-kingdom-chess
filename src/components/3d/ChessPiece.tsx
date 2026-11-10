import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BoardPiece, ActiveMoveAnimation } from '../../types/chess';
import { squareToCoords } from '../../utils/chessCoords';
import { PawnCharacter } from './PawnCharacter';
import { RookCharacter } from './RookCharacter';
import { KnightCharacter } from './KnightCharacter';
import { BishopCharacter } from './BishopCharacter';
import { QueenCharacter } from './QueenCharacter';
import { KingCharacter } from './KingCharacter';
import { soundManager } from '../../game/soundEffects';

interface ChessPieceProps {
  piece: BoardPiece;
  activeAnimation: ActiveMoveAnimation | null;
  isSelected: boolean;
  isInCheck: boolean;
  onClick: () => void;
}

// Easing function for smooth acceleration and deceleration
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export const ChessPiece: React.FC<ChessPieceProps> = ({
  piece,
  activeAnimation,
  isSelected,
  isInCheck,
  onClick
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const soundPlayedRef = useRef<boolean>(false);
  const initialMount = useRef<boolean>(true);

  // Target base coordinates on the board
  const [baseX, baseY, baseZ] = squareToCoords(piece.square);

  // Facing rotation:
  // Blue Player Kingdom ('w') faces toward Red NPC Kingdom (-Z): Math.PI (180 deg)
  // Red NPC Kingdom ('b') faces toward Blue Player Kingdom (+Z): 0 (0 deg)
  const defaultFacingRotY = piece.color === 'w' ? Math.PI : 0;

  // Initialize position on first mount
  if (initialMount.current && groupRef.current) {
    groupRef.current.position.set(baseX, baseY, baseZ);
    groupRef.current.rotation.y = defaultFacingRotY;
    initialMount.current = false;
  }

  useFrame((state) => {
    if (!groupRef.current) return;

    const now = performance.now();
    const time = state.clock.getElapsedTime();

    // Check if this piece is currently animating
    const isMovingPiece = activeAnimation && activeAnimation.pieceId === piece.id;
    const isCastlingRook = activeAnimation && activeAnimation.castlingRook?.pieceId === piece.id;
    const isDefeatedPiece = piece.isDefeated || (activeAnimation && activeAnimation.capturedPiece?.id === piece.id);

    // CASE 1: MOVING PIECE (Normal, Knight, Attack/Capture)
    if (isMovingPiece && activeAnimation) {
      const elapsed = (now - activeAnimation.startTime) / activeAnimation.duration;
      const progress = Math.min(1, Math.max(0, elapsed));
      const eased = easeInOutCubic(progress);

      const [fromX, fromY, fromZ] = squareToCoords(activeAnimation.from);
      const [toX, toY, toZ] = squareToCoords(activeAnimation.to);

      // Interpolate horizontal position
      const curX = fromX + (toX - fromX) * eased;
      const curZ = fromZ + (toZ - fromZ) * eased;
      groupRef.current.position.x = curX;
      groupRef.current.position.z = curZ;

      // Handle vertical trajectory and body tilt
      if (activeAnimation.pieceType === 'n') {
        // KNIGHT JUMP ARC: Smooth parabolic curve jumping over pieces
        const jumpHeight = 1.6;
        const jumpY = Math.sin(progress * Math.PI) * jumpHeight;
        groupRef.current.position.y = fromY + jumpY;

        // Horse tilts into the jump: pitch forward on rise, level at peak, pitch on landing
        const pitchAngle = Math.cos(progress * Math.PI) * (piece.color === 'w' ? 0.35 : -0.35);
        groupRef.current.rotation.x = pitchAngle;
      } else {
        // NORMAL PIECE WALKING: Subtle rhythmic walking step bounce
        const walkCycle = Math.sin(progress * Math.PI * 4);
        const stepHop = Math.max(0, walkCycle) * 0.09;
        const attackLunge = activeAnimation.isCapture && progress > 0.6 && progress < 0.85 ? 0.12 : 0;
        groupRef.current.position.y = fromY + stepHop + attackLunge;

        // Subtle side-to-side walking sway
        groupRef.current.rotation.z = Math.sin(progress * Math.PI * 4) * 0.06;
        groupRef.current.rotation.x = 0;
      }

      // Maintain correct facing direction toward opponent kingdom at all times
      groupRef.current.rotation.y = defaultFacingRotY;

      // Trigger capture strike sound at impact time (~0.62)
      if (activeAnimation.isCapture && progress >= 0.62 && !soundPlayedRef.current) {
        soundManager.playCapture();
        soundPlayedRef.current = true;
      }

      if (progress >= 1) {
        soundPlayedRef.current = false;
        groupRef.current.rotation.x = 0;
        groupRef.current.rotation.z = 0;
        groupRef.current.rotation.y = defaultFacingRotY;
      }
      return;
    }

    // CASE 2: CASTLING ROOK
    if (isCastlingRook && activeAnimation?.castlingRook) {
      const elapsed = (now - activeAnimation.startTime) / activeAnimation.duration;
      const progress = Math.min(1, Math.max(0, elapsed));
      const eased = easeInOutCubic(progress);

      const [fromX, fromY, fromZ] = squareToCoords(activeAnimation.castlingRook.from);
      const [toX, toY, toZ] = squareToCoords(activeAnimation.castlingRook.to);

      groupRef.current.position.x = fromX + (toX - fromX) * eased;
      groupRef.current.position.z = fromZ + (toZ - fromZ) * eased;
      const stepHop = Math.max(0, Math.sin(progress * Math.PI * 4)) * 0.06;
      groupRef.current.position.y = fromY + stepHop;
      groupRef.current.rotation.y = defaultFacingRotY;
      return;
    }

    // CASE 3: DEFEATED / CAPTURED PIECE
    if (isDefeatedPiece) {
      if (activeAnimation) {
        const elapsed = (now - activeAnimation.startTime) / activeAnimation.duration;
        const progress = Math.min(1, Math.max(0, elapsed));

        // Stands ground until attacker strikes at progress 0.60
        if (progress < 0.60) {
          groupRef.current.position.set(baseX, baseY, baseZ);
          groupRef.current.scale.set(1, 1, 1);
        } else {
          // Play defeat animation: knockback tilt, spin, and shrink down to 0
          const defeatProgress = (progress - 0.60) / 0.40;
          const shrinkScale = Math.max(0, 1 - defeatProgress);
          groupRef.current.scale.set(shrinkScale, shrinkScale, shrinkScale);

          // Tilt backwards and rotate
          groupRef.current.rotation.x = defeatProgress * 0.8;
          groupRef.current.rotation.y = defaultFacingRotY + defeatProgress * 1.5;
          groupRef.current.position.y = baseY + Math.sin(defeatProgress * Math.PI) * 0.15;
        }
      }
      return;
    }

    // CASE 4: STATIONARY PIECE (Idle Breathing & Selection Float)
    soundPlayedRef.current = false;
    groupRef.current.scale.set(1, 1, 1);
    groupRef.current.rotation.x = 0;
    groupRef.current.rotation.z = 0;

    // Smoothly align to square coordinates
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, baseX, 0.2);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, baseZ, 0.2);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, defaultFacingRotY, 0.15);

    // Idle breathing & selection float
    const offset = (piece.square.charCodeAt(0) + piece.square.charCodeAt(1)) * 0.6;
    const idleBob = Math.sin(time * 2.5 + offset) * 0.012;
    const selectLift = isSelected ? 0.22 : 0;
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      baseY + idleBob + selectLift,
      0.2
    );
  });

  const renderCharacter = () => {
    switch (piece.type) {
      case 'p':
        return <PawnCharacter color={piece.color} />;
      case 'r':
        return <RookCharacter color={piece.color} />;
      case 'n':
        return <KnightCharacter color={piece.color} />;
      case 'b':
        return <BishopCharacter color={piece.color} />;
      case 'q':
        return <QueenCharacter color={piece.color} />;
      case 'k':
        return <KingCharacter color={piece.color} />;
      default:
        return null;
    }
  };

  return (
    <group
      ref={groupRef}
      position={[baseX, baseY, baseZ]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Selected Magic Glow Ring */}
      {isSelected && (
        <group position={[0, 0.03, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.38, 0.46, 32]} />
            <meshBasicMaterial color="#fbbf24" side={THREE.DoubleSide} transparent opacity={0.9} />
          </mesh>
          <pointLight color="#fbbf24" intensity={1.5} distance={1.8} position={[0, 0.3, 0]} />
        </group>
      )}

      {/* Checked King Warning Aura */}
      {isInCheck && (
        <group position={[0, 0.04, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.36, 0.48, 32]} />
            <meshBasicMaterial color="#ef4444" side={THREE.DoubleSide} transparent opacity={0.95} />
          </mesh>
          <pointLight color="#ef4444" intensity={2.0} distance={2.0} position={[0, 0.4, 0]} />
        </group>
      )}

      {renderCharacter()}
    </group>
  );
};

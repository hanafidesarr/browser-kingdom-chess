import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Square } from 'chess.js';
import { BoardPiece, ActiveMoveAnimation, CharacterAnimState } from '../../types/chess';
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
  winner?: 'w' | 'b' | null;
  onSquareClick: (sq: Square) => void;
}

// Easing function for smooth acceleration and deceleration
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Shortest-path angle interpolation
function lerpAngle(start: number, end: number, t: number): number {
  let diff = (end - start) % (Math.PI * 2);
  if (diff < -Math.PI) diff += Math.PI * 2;
  if (diff > Math.PI) diff -= Math.PI * 2;
  return start + diff * t;
}

const ChessPieceComponent: React.FC<ChessPieceProps> = ({
  piece,
  activeAnimation,
  isSelected,
  isInCheck,
  winner,
  onSquareClick
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const soundPlayedRef = useRef<boolean>(false);
  const initialMount = useRef<boolean>(true);

  const [animState, setAnimState] = useState<CharacterAnimState>('idle');
  const [animProgress, setAnimProgress] = useState<number>(0);
  const [runCycle, setRunCycle] = useState<number>(0);

  // References to avoid unnecessary React re-renders during 60FPS useFrame loop
  const animStateRef = useRef<CharacterAnimState>('idle');
  const lastAnimUpdateRef = useRef<number>(0);

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

      // Calculate travel direction in X-Z plane
      const dx = toX - fromX;
      const dz = toZ - fromZ;
      const moveAngle = Math.atan2(dx, dz);

      // Rotate character naturally toward destination while running,
      // and turn back to kingdom facing direction upon arriving!
      let currentRotY = defaultFacingRotY;
      if (progress < 0.15) {
        const turnIn = easeInOutCubic(progress / 0.15);
        currentRotY = lerpAngle(defaultFacingRotY, moveAngle, turnIn);
      } else if (progress < 0.82) {
        currentRotY = moveAngle;
      } else {
        const turnOut = easeInOutCubic((progress - 0.82) / 0.18);
        currentRotY = lerpAngle(moveAngle, defaultFacingRotY, turnOut);
      }
      groupRef.current.rotation.y = currentRotY;

      // Running stride cycle
      const cycle = progress * Math.PI * (activeAnimation.pieceType === 'n' ? 6 : 8);

      // Handle vertical trajectory and body tilt
      if (activeAnimation.pieceType === 'n') {
        // KNIGHT JUMP ARC: Smooth parabolic curve jumping over pieces
        const jumpHeight = 1.5;
        const jumpY = Math.sin(progress * Math.PI) * jumpHeight;
        groupRef.current.position.y = fromY + jumpY;

        // Horse tilts into the jump: pitch forward on rise, level at peak, pitch on landing
        const pitchAngle = Math.cos(progress * Math.PI) * 0.32;
        groupRef.current.rotation.x = pitchAngle;
      } else {
        // NORMAL PIECE WALKING: Subtle rhythmic step bounce and forward lean
        const walkCycle = Math.sin(cycle);
        const stepHop = Math.max(0, walkCycle) * 0.08;
        const attackLunge = activeAnimation.isCapture && progress > 0.55 && progress < 0.80 ? 0.10 : 0;
        groupRef.current.position.y = fromY + stepHop + attackLunge;

        // Slight forward lean while running
        const runLean = Math.sin(Math.min(progress / 0.2, 1) * Math.min((1 - progress) / 0.2, 1) * Math.PI / 2) * 0.14;
        groupRef.current.rotation.x = runLean;

        // Subtle side-to-side running sway
        groupRef.current.rotation.z = Math.sin(cycle * 0.5) * 0.05;
      }

      // Determine animation state for character meshes
      let targetAnimState: CharacterAnimState = 'idle';
      let targetAnimProgress = 0;

      if (activeAnimation.isCapture) {
        if (progress < 0.48) {
          targetAnimState = 'running';
          targetAnimProgress = progress / 0.48;
        } else if (progress < 0.85) {
          targetAnimState = 'attacking';
          targetAnimProgress = (progress - 0.48) / 0.37;
        } else {
          targetAnimState = 'idle';
          targetAnimProgress = 0;
        }
      } else {
        if (progress < 0.88) {
          targetAnimState = 'running';
          targetAnimProgress = progress;
        } else {
          targetAnimState = 'idle';
          targetAnimProgress = 0;
        }
      }

      // Update state when animState changes OR throttle limb updates to ~30 FPS
      const stateChanged = animStateRef.current !== targetAnimState;
      const shouldUpdateLimb = now - lastAnimUpdateRef.current >= 33;

      if (stateChanged || shouldUpdateLimb) {
        if (stateChanged) {
          animStateRef.current = targetAnimState;
          setAnimState(targetAnimState);
        }
        setRunCycle(cycle);
        setAnimProgress(targetAnimProgress);
        lastAnimUpdateRef.current = now;
      }

      // Trigger capture strike sound at impact time (~0.58)
      if (activeAnimation.isCapture && progress >= 0.58 && !soundPlayedRef.current) {
        soundManager.playCapture();
        soundPlayedRef.current = true;
      }

      if (progress >= 1) {
        soundPlayedRef.current = false;
        groupRef.current.rotation.x = 0;
        groupRef.current.rotation.z = 0;
        groupRef.current.rotation.y = defaultFacingRotY;
        if (animStateRef.current !== 'idle') {
          animStateRef.current = 'idle';
          setAnimState('idle');
          setAnimProgress(0);
        }
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
      const cycle = progress * Math.PI * 8;
      const stepHop = Math.max(0, Math.sin(cycle)) * 0.06;
      groupRef.current.position.y = fromY + stepHop;
      groupRef.current.rotation.y = defaultFacingRotY;

      if (animStateRef.current !== 'running') {
        animStateRef.current = 'running';
        setAnimState('running');
      }
      if (now - lastAnimUpdateRef.current >= 33) {
        setRunCycle(cycle);
        setAnimProgress(progress);
        lastAnimUpdateRef.current = now;
      }
      return;
    }

    // CASE 3: DEFEATED / CAPTURED PIECE
    if (isDefeatedPiece) {
      if (activeAnimation) {
        const elapsed = (now - activeAnimation.startTime) / activeAnimation.duration;
        const progress = Math.min(1, Math.max(0, elapsed));

        // Stands ground until attacker strikes at progress 0.58
        if (progress < 0.58) {
          groupRef.current.position.set(baseX, baseY, baseZ);
          groupRef.current.scale.set(1, 1, 1);
          if (animStateRef.current !== 'idle') {
            animStateRef.current = 'idle';
            setAnimState('idle');
          }
        } else {
          // Play defeat animation: knockback tilt, spin, and shrink down to 0
          const defeatProgress = (progress - 0.58) / 0.42;
          const shrinkScale = Math.max(0, 1 - Math.pow(defeatProgress, 2));
          groupRef.current.scale.set(shrinkScale, shrinkScale, shrinkScale);

          // Tilt backwards and rotate
          groupRef.current.rotation.x = -defeatProgress * 0.85;
          groupRef.current.rotation.y = defaultFacingRotY + defeatProgress * 1.3;
          groupRef.current.position.y = baseY + Math.sin(defeatProgress * Math.PI) * 0.16;

          if (animStateRef.current !== 'defeated') {
            animStateRef.current = 'defeated';
            setAnimState('defeated');
          }
          if (now - lastAnimUpdateRef.current >= 33) {
            setAnimProgress(defeatProgress);
            lastAnimUpdateRef.current = now;
          }
        }
      }
      return;
    }

    // CASE 4: STATIONARY PIECE (Idle Breathing / Selection Float / Victory)
    soundPlayedRef.current = false;
    groupRef.current.scale.set(1, 1, 1);
    groupRef.current.rotation.x = 0;
    groupRef.current.rotation.z = 0;

    if (animStateRef.current !== 'idle') {
      animStateRef.current = 'idle';
      setAnimState('idle');
      setAnimProgress(0);
    }

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

    // Victory celebration or idle
    if (winner === piece.color) {
      if (animState !== 'victory') {
        setAnimState('victory');
      }
      setRunCycle(time * 3);
    } else if (winner && winner !== piece.color && piece.type === 'k') {
      if (animState !== 'defeated') {
        setAnimState('defeated');
      }
    } else {
      if (animState !== 'idle') {
        setAnimState('idle');
      }
    }
  });

  const renderCharacter = () => {
    switch (piece.type) {
      case 'p':
        return <PawnCharacter color={piece.color} animState={animState} animProgress={animProgress} runCycle={runCycle} />;
      case 'r':
        return <RookCharacter color={piece.color} animState={animState} animProgress={animProgress} runCycle={runCycle} />;
      case 'n':
        return <KnightCharacter color={piece.color} animState={animState} animProgress={animProgress} runCycle={runCycle} />;
      case 'b':
        return <BishopCharacter color={piece.color} animState={animState} animProgress={animProgress} runCycle={runCycle} />;
      case 'q':
        return <QueenCharacter color={piece.color} animState={animState} animProgress={animProgress} runCycle={runCycle} />;
      case 'k':
        return <KingCharacter color={piece.color} animState={animState} animProgress={animProgress} runCycle={runCycle} />;
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
        onSquareClick(piece.square);
      }}
    >
      {/* Selected Magic Glow Ring */}
      {isSelected && (
        <group position={[0, 0.02, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.38, 0.46, 32]} />
            <meshBasicMaterial color="#fbbf24" side={THREE.DoubleSide} transparent opacity={0.9} />
          </mesh>
          <pointLight color="#fbbf24" intensity={1.5} distance={1.8} position={[0, 0.3, 0]} />
        </group>
      )}

      {/* Checked King Warning Aura */}
      {isInCheck && (
        <group position={[0, 0.03, 0]}>
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

export const ChessPiece = React.memo(ChessPieceComponent);

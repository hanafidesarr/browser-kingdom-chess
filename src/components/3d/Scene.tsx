import React, { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { Square } from 'chess.js';
import { BoardPiece, LegalMoveInfo, ActiveMoveAnimation } from '../../types/chess';
import { ChessPiece } from './ChessPiece';
import { ChessBoard } from './ChessBoard';
import { Environment } from './Environment';

interface SceneProps {
  piecesList: BoardPiece[];
  selectedSquare: Square | null;
  legalMoves: LegalMoveInfo[];
  lastMove: { from: Square; to: Square } | null;
  checkedKingSquare: Square | null;
  activeAnimation: ActiveMoveAnimation | null;
  onSquareClick: (sq: Square) => void;
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>;
}

// Responsive Camera Controller: Automatically ensures the entire 8x8 chessboard
// and all 4 corners and pieces are 100% visible on any screen width or aspect ratio
function ResponsiveCameraController() {
  const { camera, size } = useThree();

  useEffect(() => {
    const aspect = size.width / size.height;
    // Target board radius is ~4.75 units. With margin, target half-width is 5.6 units.
    const targetHalfWidth = 5.6;
    const distance = 18.2;

    // Fit horizontally: tan(vFov / 2) >= targetHalfWidth / (distance * aspect)
    const effectiveAspect = Math.min(aspect, 0.95);
    const requiredTanVFov = targetHalfWidth / (distance * effectiveAspect);
    const calculatedVFov = (Math.atan(requiredTanVFov) * 2 * 180) / Math.PI;

    const perspectiveCam = camera as THREE.PerspectiveCamera;
    if (perspectiveCam && perspectiveCam.isPerspectiveCamera) {
      perspectiveCam.fov = Math.max(46, Math.min(76, calculatedVFov));
      perspectiveCam.updateProjectionMatrix();
    }
  }, [size, camera]);

  return null;
}

export const Scene: React.FC<SceneProps> = ({
  piecesList,
  selectedSquare,
  legalMoves,
  lastMove,
  checkedKingSquare,
  activeAnimation,
  onSquareClick,
  controlsRef
}) => {
  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows
        camera={{
          position: [0, 14.5, 11.0],
          fov: 54,
          near: 0.5,
          far: 50
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15
        }}
        style={{ width: '100%', height: '100%', background: '#070a12' }}
      >
        <ResponsiveCameraController />

        {/* LIGHTING & RIM HIGHLIGHTS */}
        <ambientLight intensity={0.95} color="#f8fafc" />

        {/* Key Warm Sunlight with Soft Shadows */}
        <directionalLight
          position={[6, 18, 9]}
          intensity={1.9}
          color="#fffbeb"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={40}
          shadow-camera-left={-7.5}
          shadow-camera-right={7.5}
          shadow-camera-top={7.5}
          shadow-camera-bottom={-7.5}
          shadow-bias={-0.0004}
        />

        {/* Strong Rim/Backlight to separate Chibi silhouettes from board */}
        <directionalLight position={[-5, 14, -8]} intensity={1.25} color="#93c5fd" />

        {/* Soft Front Fill Light */}
        <directionalLight position={[0, 10, 6]} intensity={0.5} color="#fed7aa" />

        {/* Hemisphere Light */}
        <hemisphereLight args={['#bfdbfe', '#451a03', 0.55]} />

        {/* OrbitControls */}
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          minDistance={13}
          maxDistance={24}
          minPolarAngle={Math.PI / 4.5} // ~40 degrees
          maxPolarAngle={Math.PI / 2.7} // ~66 degrees
          minAzimuthAngle={-Math.PI / 6} // -30 degrees
          maxAzimuthAngle={Math.PI / 6} // +30 degrees
          target={[0, 0.35, 0]}
        />

        {/* Castle Platform & Surroundings */}
        <Environment />

        {/* High Contrast 8x8 Chessboard */}
        <ChessBoard
          selectedSquare={selectedSquare}
          legalMoves={legalMoves}
          lastMove={lastMove}
          checkedKingSquare={checkedKingSquare}
          onSquareClick={onSquareClick}
        />

        {/* Smooth 3D Chibi Pieces */}
        {piecesList.map((piece) => (
          <ChessPiece
            key={piece.id}
            piece={piece}
            activeAnimation={activeAnimation}
            isSelected={selectedSquare === piece.square}
            isInCheck={checkedKingSquare === piece.square}
            onClick={() => onSquareClick(piece.square)}
          />
        ))}
      </Canvas>
    </div>
  );
};

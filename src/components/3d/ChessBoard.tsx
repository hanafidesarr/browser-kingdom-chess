import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Square } from 'chess.js';
import { LegalMoveInfo } from '../../types/chess';
import { squareToCoords, isLightSquare, TILE_SIZE, BOARD_ELEVATION } from '../../utils/chessCoords';
import { kingdomColors, matRegistry } from './Materials';

interface ChessBoardProps {
  selectedSquare: Square | null;
  legalMoves: LegalMoveInfo[];
  lastMove: { from: Square; to: Square } | null;
  checkedKingSquare: Square | null;
  onSquareClick: (sq: Square) => void;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  selectedSquare,
  legalMoves,
  lastMove,
  checkedKingSquare,
  onSquareClick
}) => {
  // Pre-generate the 64 squares
  const squares = useMemo(() => {
    const list: { square: Square; x: number; z: number; isLight: boolean }[] = [];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

    for (const r of ranks) {
      for (const f of files) {
        const sq = `${f}${r}` as Square;
        const [x, , z] = squareToCoords(sq);
        list.push({
          square: sq,
          x,
          z,
          isLight: isLightSquare(sq)
        });
      }
    }
    return list;
  }, []);

  // Legal moves map for fast lookup
  const legalMap = useMemo(() => {
    const map = new Map<Square, LegalMoveInfo>();
    legalMoves.forEach((m) => map.set(m.square, m));
    return map;
  }, [legalMoves]);

  // High contrast materials per requirement #3:
  // Light: Warm Ivory / Off-White (#F0D9B5)
  // Dark: Deep Rich Brown (#B58863)
  const lightTileMat = matRegistry.get(kingdomColors.board.light, 0.5, 0.05);
  const darkTileMat = matRegistry.get(kingdomColors.board.dark, 0.55, 0.05);
  const goldBorderMat = matRegistry.get(kingdomColors.board.goldTrim, 0.25, 0.85);
  const stoneBorderMat = matRegistry.get(kingdomColors.board.border, 0.7, 0.1);
  const seamMat = matRegistry.get(kingdomColors.board.seam, 0.9, 0.0);

  return (
    <group position={[0, 0, 0]}>
      {/* Dark Sub-Base for Crisp Seams Between Tiles */}
      <mesh position={[0, BOARD_ELEVATION - 0.01, 0]} material={seamMat}>
        <boxGeometry args={[TILE_SIZE * 8.04, 0.04, TILE_SIZE * 8.04]} />
      </mesh>

      {/* 8x8 Board Tiles */}
      {squares.map(({ square, x, z, isLight }) => {
        const isSelected = selectedSquare === square;
        const legalInfo = legalMap.get(square);
        const isLastFrom = lastMove?.from === square;
        const isLastTo = lastMove?.to === square;
        const isCheckedKing = checkedKingSquare === square;

        // Overlay highlights
        let overlayColor: string | null = null;
        let overlayOpacity = 0;

        if (isSelected) {
          overlayColor = '#fbbf24'; // Radiant Gold
          overlayOpacity = 0.55;
        } else if (isCheckedKing) {
          overlayColor = '#ef4444'; // Flashing Red Alert
          overlayOpacity = 0.65;
        } else if (isLastFrom || isLastTo) {
          overlayColor = '#60a5fa'; // Subtle Blue Last Move
          overlayOpacity = 0.32;
        }

        return (
          <group
            key={square}
            position={[x, BOARD_ELEVATION, z]}
            onClick={(e) => {
              e.stopPropagation();
              onSquareClick(square);
            }}
          >
            {/* Main Chess Tile: slightly smaller than TILE_SIZE to give clean bevel seams */}
            <mesh
              position={[0, 0, 0]}
              material={isLight ? lightTileMat : darkTileMat}
              receiveShadow
            >
              <boxGeometry args={[TILE_SIZE * 0.97, 0.07, TILE_SIZE * 0.97]} />
            </mesh>

            {/* Selection / Move Overlay */}
            {overlayColor && (
              <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[TILE_SIZE * 0.93, TILE_SIZE * 0.93]} />
                <meshBasicMaterial
                  color={overlayColor}
                  transparent
                  opacity={overlayOpacity}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}

            {/* Legal Move Indicator: Clean Green Disc for empty square */}
            {legalInfo && !legalInfo.isCapture && (
              <group position={[0, 0.045, 0]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <circleGeometry args={[0.2, 16]} />
                  <meshBasicMaterial color="#10b981" transparent opacity={0.8} side={THREE.DoubleSide} />
                </mesh>
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.22, 0.26, 20]} />
                  <meshBasicMaterial color="#34d399" transparent opacity={0.95} side={THREE.DoubleSide} />
                </mesh>
              </group>
            )}

            {/* Legal Move Indicator: Clear Red Targeting Ring for Captures */}
            {legalInfo && legalInfo.isCapture && (
              <group position={[0, 0.045, 0]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.34, 0.44, 24]} />
                  <meshBasicMaterial color="#ef4444" transparent opacity={0.85} side={THREE.DoubleSide} />
                </mesh>
                {/* 4 corner attack brackets */}
                {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((rot, idx) => (
                  <mesh key={idx} rotation={[-Math.PI / 2, 0, rot]} position={[0, 0.01, 0]}>
                    <ringGeometry args={[0.44, 0.48, 8, 1, 0, Math.PI / 4]} />
                    <meshBasicMaterial color="#fca5a5" side={THREE.DoubleSide} />
                  </mesh>
                ))}
              </group>
            )}
          </group>
        );
      })}

      {/* Thin Gold Decorative Inset Line around the 8x8 Grid */}
      <group position={[0, BOARD_ELEVATION + 0.005, 0]}>
        <mesh position={[0, 0, 4.04 * TILE_SIZE]} material={goldBorderMat}>
          <boxGeometry args={[8.08 * TILE_SIZE, 0.03, 0.05]} />
        </mesh>
        <mesh position={[0, 0, -4.04 * TILE_SIZE]} material={goldBorderMat}>
          <boxGeometry args={[8.08 * TILE_SIZE, 0.03, 0.05]} />
        </mesh>
        <mesh position={[4.04 * TILE_SIZE, 0, 0]} material={goldBorderMat}>
          <boxGeometry args={[0.05, 0.03, 8.08 * TILE_SIZE]} />
        </mesh>
        <mesh position={[-4.04 * TILE_SIZE, 0, 0]} material={goldBorderMat}>
          <boxGeometry args={[0.05, 0.03, 8.08 * TILE_SIZE]} />
        </mesh>
      </group>

      {/* Medieval Dark Stone Border / Platform Base */}
      <mesh position={[0, BOARD_ELEVATION - 0.08, 0]} material={stoneBorderMat} receiveShadow>
        <boxGeometry args={[TILE_SIZE * 8.6, 0.22, TILE_SIZE * 8.6]} />
      </mesh>
    </group>
  );
};

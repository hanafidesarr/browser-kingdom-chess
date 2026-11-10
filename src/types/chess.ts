import { PieceSymbol, Color, Square } from 'chess.js';

export type PieceType = PieceSymbol; // 'p' | 'n' | 'b' | 'r' | 'q' | 'k'
export type PieceColor = Color; // 'w' | 'b'

export type CharacterAnimState = 'idle' | 'running' | 'attacking' | 'defeated' | 'victory';

export interface CharacterAnimData {
  state: CharacterAnimState;
  progress: number;
  runCycle: number;
}

export interface BoardPiece {
  id: string; // unique persistent identifier for 3D rendering
  type: PieceType;
  color: PieceColor;
  square: Square;
  hasMoved?: boolean;
  isDefeated?: boolean; // Set true when captured, plays defeat animation
}

export interface ActiveMoveAnimation {
  id: string;
  from: Square;
  to: Square;
  pieceId: string;
  pieceType: PieceType;
  color: PieceColor;
  isCapture: boolean;
  capturedPiece?: BoardPiece;
  isCastling?: boolean;
  castlingRook?: { pieceId: string; from: Square; to: Square };
  startTime: number;
  duration: number; // ms
}

export interface MoveRecord {
  san: string;
  from: Square;
  to: Square;
  piece: PieceType;
  color: PieceColor;
  captured?: PieceType;
  promotion?: PieceType;
}

export interface LegalMoveInfo {
  square: Square;
  isCapture: boolean;
  isEnPassant?: boolean;
  isCastling?: boolean;
}

export interface GameSettings {
  soundEnabled: boolean;
  timerMinutes: number;
  autoRotateCamera: boolean;
  showLegalMoves: boolean;
  showCoordinates: boolean;
}

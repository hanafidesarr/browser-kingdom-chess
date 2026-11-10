import React, { useState } from 'react';
import { Color, PieceSymbol } from 'chess.js';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Compass,
  History,
  Shield,
  Crown,
  Swords,
  AlertTriangle,
  Loader2,
  Sliders
} from 'lucide-react';
import { BoardPiece, LegalMoveInfo, MoveRecord, ActiveMoveAnimation } from '../../types/chess';
import { Scene } from '../3d/Scene';
import { PromotionModal } from './PromotionModal';
import { GameOverModal } from './GameOverModal';
import { MoveHistoryDrawer } from './MoveHistoryDrawer';
import { DifficultyModal } from './DifficultyModal';
import { soundManager } from '../../game/soundEffects';
import { AiDifficulty, DIFFICULTY_CONFIGS } from '../../game/stockfishService';

interface PortraitLayoutProps {
  board: (BoardPiece | null)[][];
  piecesList: BoardPiece[];
  turn: Color;
  selectedSquare: any;
  legalMoves: LegalMoveInfo[];
  lastMove: any;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  checkedKingSquare: any;
  capturedPieces: { w: PieceSymbol[]; b: PieceSymbol[] };
  whiteTime: number;
  blackTime: number;
  moveHistory: MoveRecord[];
  pendingPromotion: any;
  isAiThinking: boolean;
  isAnimating: boolean;
  activeAnimation: ActiveMoveAnimation | null;
  difficulty: AiDifficulty;
  isGameStarted: boolean;
  onSetDifficulty: (diff: AiDifficulty) => void;
  onStartGame: (diff: AiDifficulty) => void;
  onSquareClick: (sq: any) => void;
  onSelectPromotion: (p: any) => void;
  onCancelPromotion: () => void;
  onUndo: () => void;
  onRestart: () => void;
}

export const PortraitLayout: React.FC<PortraitLayoutProps> = ({
  piecesList,
  turn,
  selectedSquare,
  legalMoves,
  lastMove,
  isCheck,
  isCheckmate,
  isStalemate,
  isDraw,
  checkedKingSquare,
  capturedPieces,
  whiteTime,
  blackTime,
  moveHistory,
  pendingPromotion,
  isAiThinking,
  isAnimating,
  activeAnimation,
  difficulty,
  isGameStarted,
  onSetDifficulty,
  onStartGame,
  onSquareClick,
  onSelectPromotion,
  onCancelPromotion,
  onUndo,
  onRestart
}) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [difficultyModalOpen, setDifficultyModalOpen] = useState<boolean>(false);
  const controlsRef = React.useRef<OrbitControlsImpl | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.setEnabled(next);
    if (next) soundManager.playClick();
  };

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      soundManager.playClick();
    }
  };

  const renderCapturedPiece = (type: PieceSymbol, isWhiteSide: boolean) => {
    const icons: Record<PieceSymbol, string> = {
      p: '♟',
      r: '♜',
      n: '♞',
      b: '♝',
      q: '♛',
      k: '♚'
    };
    return (
      <span
        key={type + Math.random()}
        className={`text-xs font-bold leading-none ${
          isWhiteSide ? 'text-blue-300 drop-shadow' : 'text-rose-400 drop-shadow'
        }`}
      >
        {icons[type]}
      </span>
    );
  };

  const diffConfig = DIFFICULTY_CONFIGS[difficulty];

  return (
    <div className="w-full h-full h-[100dvh] max-h-[100dvh] flex items-center justify-center bg-[#05070d] overflow-hidden font-sans select-none">
      {/* 9:16 Portrait Canvas Container */}
      <div className="relative w-full h-full h-[100dvh] max-h-[100dvh] sm:max-w-[430px] sm:max-h-[860px] sm:h-[95vh] sm:rounded-3xl sm:border-[2px] sm:border-amber-600/50 shadow-2xl bg-[#070a12] flex flex-col overflow-hidden">

        {/* 1. TOP BAR: NPC OPPONENT (Red Kingdom) */}
        <div className="flex-shrink-0 w-full px-3 pt-[max(0.5rem,env(safe-area-inset-top))] pb-1.5 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900/95 border-b border-rose-950/50 flex items-center justify-between z-20">
          <div className="flex items-center gap-2 min-w-0">
            {/* NPC Avatar */}
            <div className={`relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full border-2 ${
              turn === 'b' ? 'border-rose-500 shadow-md shadow-rose-500/40' : 'border-rose-900/60'
            } bg-slate-950 overflow-hidden flex items-center justify-center`}>
              <div className="w-full h-full bg-gradient-to-tr from-rose-950 to-red-900 flex items-center justify-center text-rose-300">
                <Crown className="w-4 h-4 text-rose-400" />
              </div>
            </div>

            {/* Name, Difficulty & Captured Pieces */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-medieval text-xs font-bold text-rose-300 tracking-wide truncate">
                  {diffConfig.title}
                </span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-rose-950/80 border border-rose-800 text-rose-300 uppercase font-bold shrink-0">
                  {diffConfig.name}
                </span>
              </div>

              {/* Status or Spoils */}
              <div className="flex items-center gap-1 mt-0.5 min-h-[14px]">
                {isAiThinking ? (
                  <div className="flex items-center gap-1 text-[10px] text-amber-300 font-semibold animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin text-amber-400 shrink-0" />
                    <span className="truncate">Analyzing...</span>
                  </div>
                ) : isAnimating && turn === 'w' ? (
                  <div className="flex items-center gap-1 text-[10px] text-rose-300 font-semibold">
                    <span>Marching...</span>
                  </div>
                ) : capturedPieces.b.length === 0 ? (
                  <span className="text-[10px] text-slate-500 italic">No spoils</span>
                ) : (
                  <div className="flex items-center gap-0.5 overflow-x-auto">
                    {capturedPieces.b.map((t, idx) => (
                      <span key={idx}>{renderCapturedPiece(t, true)}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* NPC Timer */}
          <div className={`px-2 py-0.5 sm:py-1 shrink-0 rounded-lg border font-mono text-xs font-bold tracking-wider ${
            turn === 'b'
              ? 'bg-rose-950/90 border-rose-500 text-rose-200 shadow-sm'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            {formatTime(blackTime)}
          </div>
        </div>

        {/* 2. CENTER: 3D CHESSBOARD SCENE */}
        <div className="relative flex-1 min-h-0 w-full overflow-hidden">
          <Scene
            piecesList={piecesList}
            selectedSquare={selectedSquare}
            legalMoves={legalMoves}
            lastMove={lastMove}
            checkedKingSquare={checkedKingSquare}
            activeAnimation={activeAnimation}
            winner={isCheckmate ? (turn === 'w' ? 'b' : 'w') : null}
            onSquareClick={onSquareClick}
            controlsRef={controlsRef}
          />

          {/* Floating In-Game HUD: Status Indicator */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none z-10 flex flex-col items-center gap-1 max-w-[90%]">
            {isCheck && !isCheckmate && (
              <div className="px-3 py-1 rounded-full bg-red-600 text-white font-medieval font-black text-xs tracking-wider shadow-lg shadow-red-600/40 animate-bounce flex items-center gap-1.5 border border-red-300">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>CHECK!</span>
              </div>
            )}
            <div className="px-2.5 py-0.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-700/60 text-[10px] font-bold text-slate-300 uppercase tracking-wider shadow-md truncate text-center">
              {isAiThinking
                ? "NPC is calculating..."
                : isAnimating
                ? "Marching across the board..."
                : turn === 'w'
                ? "Your Turn (Blue Kingdom)"
                : "NPC's Turn (Red Kingdom)"}
            </div>
          </div>

          {/* Floating Camera Reset Button */}
          <button
            onClick={handleResetCamera}
            title="Reset Perspective"
            className="absolute top-2 right-2 z-10 p-1.5 sm:p-2 rounded-xl bg-slate-900/85 hover:bg-slate-800 backdrop-blur-md border border-slate-700 text-slate-300 hover:text-amber-400 shadow-md active:scale-90 transition"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>

        {/* 3. BOTTOM: PLAYER (Blue Kingdom) & CONTROLS */}
        <div className="flex-shrink-0 w-full px-2.5 sm:px-3 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-slate-950 via-slate-900 to-slate-900/95 border-t border-amber-500/30 flex flex-col gap-1.5 z-20">
          {/* Player Info Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              {/* Player Avatar */}
              <div className={`relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full border-2 ${
                turn === 'w' && !isAnimating ? 'border-amber-400 shadow-md shadow-amber-500/40' : 'border-blue-900/60'
              } bg-slate-950 overflow-hidden flex items-center justify-center`}>
                <div className="w-full h-full bg-gradient-to-tr from-blue-950 to-blue-800 flex items-center justify-center text-amber-300">
                  <Shield className="w-4 h-4 text-amber-400" />
                </div>
              </div>

              {/* Name & Captured Black Pieces */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-medieval text-xs font-bold text-amber-300 tracking-wide truncate">
                    BLUE KINGDOM
                  </span>
                  {turn === 'w' && !isAnimating && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block shrink-0" />
                  )}
                </div>
                {/* Captured Black Pieces by White */}
                <div className="flex items-center gap-0.5 mt-0.5 min-h-[14px] overflow-x-auto">
                  {capturedPieces.w.length === 0 ? (
                    <span className="text-[10px] text-slate-500 italic">No spoils</span>
                  ) : (
                    capturedPieces.w.map((t, idx) => (
                      <span key={idx}>{renderCapturedPiece(t, false)}</span>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Player Timer */}
            <div className={`px-2 py-0.5 sm:py-1 shrink-0 rounded-lg border font-mono text-xs font-bold tracking-wider ${
              turn === 'w'
                ? 'bg-amber-950/90 border-amber-500 text-amber-200 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}>
              {formatTime(whiteTime)}
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 gap-1 sm:gap-1.5">
            {/* Undo */}
            <button
              onClick={onUndo}
              disabled={moveHistory.length === 0 || isAiThinking || isAnimating}
              title="Undo Move"
              className="flex-1 min-w-0 py-1 px-1 sm:px-1.5 bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none rounded-xl border border-slate-700 text-slate-200 text-[10px] sm:text-[11px] font-medieval font-semibold flex items-center justify-center gap-0.5 sm:gap-1 active:scale-95 transition"
            >
              <RotateCcw className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate">Undo</span>
            </button>

            {/* Difficulty Selector */}
            <button
              onClick={() => setDifficultyModalOpen(true)}
              disabled={isAnimating}
              title="Adjust Difficulty"
              className="flex-1 min-w-0 py-1 px-1 sm:px-1.5 bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none rounded-xl border border-slate-700 text-slate-200 text-[10px] sm:text-[11px] font-medieval font-semibold flex items-center justify-center gap-0.5 sm:gap-1 active:scale-95 transition"
            >
              <Sliders className="w-3 h-3 text-purple-400 shrink-0" />
              <span className="truncate">Level</span>
            </button>

            {/* Move History / Chronicles */}
            <button
              onClick={() => {
                soundManager.playClick();
                setHistoryOpen(true);
              }}
              title="Battle History"
              className="flex-1 min-w-0 py-1 px-1 sm:px-1.5 bg-slate-800/80 hover:bg-slate-700 rounded-xl border border-slate-700 text-slate-200 text-[10px] sm:text-[11px] font-medieval font-semibold flex items-center justify-center gap-0.5 sm:gap-1 active:scale-95 transition"
            >
              <History className="w-3 h-3 text-blue-400 shrink-0" />
              <span className="truncate">Log</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
              className="p-1 sm:p-1.5 shrink-0 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 active:scale-95 transition"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
            </button>

            {/* Restart */}
            <button
              onClick={onRestart}
              disabled={isAnimating}
              title="Restart Game"
              className="flex-1 min-w-0 py-1 px-1 sm:px-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-40 disabled:pointer-events-none rounded-xl border border-amber-500/60 text-slate-950 font-medieval font-bold text-[10px] sm:text-[11px] uppercase tracking-wider flex items-center justify-center gap-0.5 sm:gap-1 active:scale-95 transition shadow-sm"
            >
              <Swords className="w-3 h-3 shrink-0" />
              <span className="truncate">Reset</span>
            </button>
          </div>
        </div>

        {/* INITIAL DIFFICULTY SELECTION SCREEN */}
        {!isGameStarted && (
          <DifficultyModal
            currentDifficulty={difficulty}
            onSelectDifficulty={onStartGame}
            isInitialScreen={true}
          />
        )}

        {/* MID-GAME DIFFICULTY MODAL */}
        {isGameStarted && difficultyModalOpen && (
          <DifficultyModal
            currentDifficulty={difficulty}
            onSelectDifficulty={(newDiff) => {
              onSetDifficulty(newDiff);
              setDifficultyModalOpen(false);
            }}
            onClose={() => setDifficultyModalOpen(false)}
            isInitialScreen={false}
          />
        )}

        {/* PROMOTION MODAL */}
        {pendingPromotion && (
          <PromotionModal
            color={turn}
            onSelect={onSelectPromotion}
            onCancel={onCancelPromotion}
          />
        )}

        {/* GAME OVER MODAL */}
        {(isCheckmate || isStalemate || isDraw) && (
          <GameOverModal
            isCheckmate={isCheckmate}
            isStalemate={isStalemate}
            isDraw={isDraw}
            winner={isCheckmate ? (turn === 'w' ? 'b' : 'w') : null}
            onRestart={onRestart}
          />
        )}

        {/* MOVE HISTORY DRAWER */}
        <MoveHistoryDrawer
          isOpen={historyOpen}
          history={moveHistory}
          onClose={() => setHistoryOpen(false)}
        />
      </div>
    </div>
  );
};

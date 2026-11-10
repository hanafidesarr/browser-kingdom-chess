import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Color } from 'chess.js';
import { Trophy, RotateCcw, Swords, ShieldAlert } from 'lucide-react';

interface GameOverModalProps {
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  winner: Color | null;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isCheckmate,
  isStalemate,
  isDraw,
  winner,
  onRestart
}) => {
  useEffect(() => {
    if (isCheckmate) {
      // Fire celebratory royal confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore if canvas-confetti unavailable
      }
    }
  }, [isCheckmate]);

  let title = 'Game Finished';
  let subtitle = '';
  let badgeColor = 'border-amber-500 text-amber-400';

  if (isCheckmate) {
    if (winner === 'w') {
      title = 'ROYAL VICTORY!';
      subtitle = 'The Royal Kingdom has conquered the Crimson Empire in glorious triumph!';
      badgeColor = 'border-blue-500 text-blue-400 bg-blue-950/40';
    } else {
      title = 'DEFEAT!';
      subtitle = 'The Crimson Empire has claimed checkmate on the battlefield.';
      badgeColor = 'border-rose-500 text-rose-400 bg-rose-950/40';
    }
  } else if (isStalemate) {
    title = 'STALEMATE';
    subtitle = 'Neither monarch has any legal command remaining. A bloodless standstill.';
    badgeColor = 'border-amber-500 text-amber-400 bg-amber-950/40';
  } else if (isDraw) {
    title = 'DRAW';
    subtitle = 'Both kingdoms agreed to a peace treaty or insufficient material.';
    badgeColor = 'border-slate-500 text-slate-300 bg-slate-900/60';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/80 rounded-2xl p-6 shadow-2xl text-center">
        <div className="flex justify-center mb-3">
          <div className="p-4 rounded-full bg-slate-800/90 border-2 border-amber-400/60 shadow-lg animate-bounce">
            {isCheckmate ? (
              <Trophy className="w-10 h-10 text-amber-400" />
            ) : (
              <Swords className="w-10 h-10 text-slate-300" />
            )}
          </div>
        </div>

        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border mb-2 ${badgeColor}`}>
          Battle Concluded
        </div>

        <h2 className="font-medieval text-2xl font-black text-white tracking-wide mb-2 drop-shadow-md">
          {title}
        </h2>

        <p className="text-slate-300 text-xs leading-relaxed mb-6 px-2">
          {subtitle}
        </p>

        <button
          onClick={onRestart}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-medieval font-bold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Play Again</span>
        </button>
      </div>
    </div>
  );
};

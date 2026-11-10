import React from 'react';
import { Color, PieceSymbol } from 'chess.js';
import { PieceType } from '../../types/chess';
import { Crown, Shield, Sparkles, Compass } from 'lucide-react';

interface PromotionModalProps {
  color: Color;
  onSelect: (piece: PieceType) => void;
  onCancel: () => void;
}

export const PromotionModal: React.FC<PromotionModalProps> = ({
  color,
  onSelect,
  onCancel
}) => {
  const isWhite = color === 'w';

  const pieces: { type: PieceType; name: string; title: string; icon: React.ReactNode }[] = [
    { type: 'q', name: 'Queen', title: 'Ratu', icon: <Crown className="w-8 h-8 text-amber-400" /> },
    { type: 'r', name: 'Rook', title: 'Prajurit', icon: <Shield className="w-8 h-8 text-blue-400" /> },
    { type: 'b', name: 'Bishop', title: 'Penasihat', icon: <Compass className="w-8 h-8 text-purple-400" /> },
    { type: 'n', name: 'Knight', title: 'Ksatria', icon: <Sparkles className="w-8 h-8 text-amber-200" /> }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/60 rounded-2xl p-5 shadow-2xl text-center">
        <h3 className="font-medieval text-xl text-amber-400 font-bold uppercase tracking-wider mb-1">
          Pawn Promotion
        </h3>
        <p className="text-slate-300 text-xs mb-4">
          Choose a royal rank to promote your valiant peasant:
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {pieces.map((p) => (
            <button
              key={p.type}
              onClick={() => onSelect(p.type)}
              className="flex flex-col items-center justify-center p-3.5 bg-slate-800/80 hover:bg-amber-950/40 border border-slate-700 hover:border-amber-400 rounded-xl transition duration-150 active:scale-95 group shadow-md"
            >
              <div className="p-2 rounded-full bg-slate-900/90 mb-2 border border-slate-700/60 group-hover:border-amber-400/80">
                {p.icon}
              </div>
              <span className="font-medieval text-sm font-bold text-white group-hover:text-amber-300">
                {p.name}
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                {p.title}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={onCancel}
          className="text-xs text-slate-400 hover:text-slate-200 underline uppercase tracking-wider"
        >
          Cancel Move
        </button>
      </div>
    </div>
  );
};

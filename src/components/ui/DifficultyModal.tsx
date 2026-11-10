import React from 'react';
import { AiDifficulty, DIFFICULTY_CONFIGS } from '../../game/stockfishService';
import { Swords, ShieldAlert, Sparkles, Skull, Crown } from 'lucide-react';

interface DifficultyModalProps {
  currentDifficulty: AiDifficulty;
  onSelectDifficulty: (diff: AiDifficulty) => void;
  onClose?: () => void;
  isInitialScreen?: boolean;
}

export const DifficultyModal: React.FC<DifficultyModalProps> = ({
  currentDifficulty,
  onSelectDifficulty,
  onClose,
  isInitialScreen = false
}) => {
  const difficulties: {
    key: AiDifficulty;
    icon: React.ReactNode;
    badge: string;
    badgeStyle: string;
    borderStyle: string;
  }[] = [
    {
      key: 'easy',
      icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
      badge: 'Novice Depth 2',
      badgeStyle: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50',
      borderStyle: 'hover:border-emerald-500/80 focus:border-emerald-500'
    },
    {
      key: 'medium',
      icon: <Swords className="w-5 h-5 text-amber-400" />,
      badge: 'Tactician Depth 6',
      badgeStyle: 'bg-amber-950/60 text-amber-300 border-amber-500/50',
      borderStyle: 'hover:border-amber-500/80 focus:border-amber-500'
    },
    {
      key: 'hard',
      icon: <Skull className="w-5 h-5 text-rose-400" />,
      badge: 'Grandmaster Depth 12',
      badgeStyle: 'bg-rose-950/60 text-rose-300 border-rose-500/50',
      borderStyle: 'hover:border-rose-500/80 focus:border-rose-500'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in select-none">
      <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/70 rounded-3xl p-5 shadow-2xl text-center">
        {/* Crown & Title */}
        <div className="flex justify-center mb-2">
          <div className="p-3 rounded-full bg-slate-800/90 border border-amber-500/60 shadow-lg">
            <Crown className="w-8 h-8 text-amber-400" />
          </div>
        </div>

        <h2 className="font-medieval text-xl font-black text-amber-300 uppercase tracking-wider mb-1">
          {isInitialScreen ? 'Choose Your Rival' : 'Battle Difficulty'}
        </h2>
        <p className="text-slate-300 text-xs mb-4 leading-relaxed">
          Select the strategic skill of the Crimson Empire NPC opponent:
        </p>

        {/* Options */}
        <div className="flex flex-col gap-2.5 mb-5 text-left">
          {difficulties.map(({ key, icon, badge, badgeStyle, borderStyle }) => {
            const config = DIFFICULTY_CONFIGS[key];
            const isSelected = currentDifficulty === key;

            return (
              <button
                key={key}
                onClick={() => onSelectDifficulty(key)}
                className={`relative flex items-center p-3 rounded-2xl border transition duration-150 active:scale-98 ${
                  isSelected
                    ? 'bg-slate-800/90 border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                    : `bg-slate-900/80 border-slate-700/80 ${borderStyle}`
                }`}
              >
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 mr-3 flex-shrink-0">
                  {icon}
                </div>

                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-medieval text-sm font-bold text-white tracking-wide truncate">
                      {config.title}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${badgeStyle}`}>
                      {config.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                    {config.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        {isInitialScreen ? (
          <button
            onClick={() => onSelectDifficulty(currentDifficulty)}
            className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-medieval font-black text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition flex items-center justify-center gap-2"
          >
            <Swords className="w-4 h-4" />
            <span>Commence Battle</span>
          </button>
        ) : (
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medieval font-bold text-xs uppercase tracking-wider rounded-xl transition"
          >
            Confirm & Return
          </button>
        )}
      </div>
    </div>
  );
};

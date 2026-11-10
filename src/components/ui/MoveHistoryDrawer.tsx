import React from 'react';
import { MoveRecord } from '../../types/chess';
import { ScrollText, X } from 'lucide-react';

interface MoveHistoryDrawerProps {
  isOpen: boolean;
  history: MoveRecord[];
  onClose: () => void;
}

export const MoveHistoryDrawer: React.FC<MoveHistoryDrawerProps> = ({
  isOpen,
  history,
  onClose
}) => {
  if (!isOpen) return null;

  // Group moves into pairs (White move, Black move)
  const rounds: { round: number; white: string; black?: string }[] = [];
  for (let i = 0; i < history.length; i += 2) {
    rounds.push({
      round: Math.floor(i / 2) + 1,
      white: history[i].san,
      black: history[i + 1] ? history[i + 1].san : undefined
    });
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 animate-fade-in">
      <div className="w-full max-w-sm max-h-[75vh] flex flex-col bg-slate-900 border-2 border-amber-500/60 rounded-2xl p-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-amber-400 font-medieval font-bold">
            <ScrollText className="w-5 h-5" />
            <span className="text-base tracking-wide">Battle Chronicles</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Moves Table */}
        <div className="flex-1 overflow-y-auto my-3 pr-1 text-xs">
          {rounds.length === 0 ? (
            <div className="text-center py-8 text-slate-500 italic">
              No moves played yet. The kingdoms prepare for battle!
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800/80 uppercase text-[10px] tracking-wider">
                  <th className="py-1 px-2 w-12">#</th>
                  <th className="py-1 px-2 text-blue-300">White</th>
                  <th className="py-1 px-2 text-rose-300">Black</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {rounds.map((r) => (
                  <tr key={r.round} className="hover:bg-slate-800/40 transition">
                    <td className="py-1.5 px-2 text-slate-500 font-mono font-bold">{r.round}.</td>
                    <td className="py-1.5 px-2 font-mono font-semibold text-slate-200">{r.white}</td>
                    <td className="py-1.5 px-2 font-mono font-semibold text-slate-200">{r.black || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 text-center">
          <span className="text-[11px] text-slate-400">Total Moves: {history.length}</span>
        </div>
      </div>
    </div>
  );
};

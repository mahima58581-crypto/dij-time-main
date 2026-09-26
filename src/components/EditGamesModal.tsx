import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Gamepad2 } from 'lucide-react';
import { Session, GameItem, GameRecord } from '../types';

interface EditGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
  gamesList: GameItem[];
  onUpdateSessionGames: (sessionId: string, updatedGames: GameRecord[]) => void;
}

export const EditGamesModal: React.FC<EditGamesModalProps> = ({
  isOpen,
  onClose,
  session,
  gamesList,
  onUpdateSessionGames,
}) => {
  if (!isOpen || !session) return null;

  const [currentGames, setCurrentGames] = useState<GameRecord[]>([
    ...session.gamesPlayed,
  ]);

  const handleToggleGame = (game: GameItem) => {
    const exists = currentGames.find((g) => g.gameId === game.id);
    if (exists) {
      setCurrentGames(currentGames.filter((g) => g.gameId !== game.id));
    } else {
      setCurrentGames([
        ...currentGames,
        { gameId: game.id, gameName: game.name, mode: game.defaultMode },
      ]);
    }
  };

  const handleToggleMode = (gameId: string) => {
    setCurrentGames(
      currentGames.map((g) => {
        if (g.gameId === gameId) {
          return { ...g, mode: g.mode === 'online' ? 'offline' : 'online' };
        }
        return g;
      })
    );
  };

  const handleSave = () => {
    onUpdateSessionGames(session.id, currentGames);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white border border-emerald-100 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
      >
        
        {/* رأس النافذة */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">
                تعديل ألعاب الجلسة: {session.stationName}
              </h3>
              <p className="text-xs text-slate-500">
                اللاعب: {session.customerName} • نمط الاتصال أونلاين أو أوفلاين
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* قائمة الألعاب */}
        <div className="space-y-2 max-h-72 overflow-y-auto p-1 custom-scrollbar">
          {gamesList.map((game) => {
            const selected = currentGames.find((g) => g.gameId === game.id);
            return (
              <div
                key={game.id}
                className={`p-2.5 rounded-2xl border transition flex items-center justify-between gap-2 ${
                  selected
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-emerald-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleToggleGame(game)}
                  className="text-xs font-bold text-right flex-1 truncate text-slate-900"
                >
                  {game.name}
                </button>

                {selected && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => handleToggleMode(game.id)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition shadow-xs ${
                      selected.mode === 'online'
                        ? 'bg-teal-50 text-teal-700 border border-teal-200'
                        : 'bg-emerald-100/70 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {selected.mode === 'online' ? '🌐 أونلاين' : '🎮 أوفلاين'}
                  </motion.button>
                )}
              </div>
            );
          })}
        </div>

        {/* أزرار الحفظ والإلغاء */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 transition"
          >
            إلغاء
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 transition shadow-md shadow-emerald-500/20"
          >
            حفظ قائمة الألعاب
          </motion.button>
        </div>

      </motion.div>
    </div>
  );
};


'use client';

import { BossDefinition } from '@/lib/bosses';

interface BossCardProps {
  boss: BossDefinition;
  onFight?: () => void;
  compact?: boolean;
}

export default function BossCard({ boss, onFight, compact = false }: BossCardProps) {
  return (
    <div className="bg-[#161616] border border-[#252525] border-l-2 border-l-[#e8863a] rounded-xl p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <p className="text-[#707070] text-[10px] uppercase tracking-widest mb-1">Boss</p>
          <h3 className="text-[#f0f0f0] text-sm font-semibold">{boss.name}</h3>
        </div>
        <span className="text-[#e8863a] text-xs font-bold ml-2 shrink-0">
          +{Object.values(boss.xp).reduce((a, b) => a + b, 0)} XP
        </span>
      </div>
      <p className="text-[#707070] text-xs leading-relaxed mb-3">{boss.description}</p>

      {!compact && (
        <>
          <div className="mb-3">
            <p className="text-[#444444] text-[10px] uppercase tracking-widest mb-2">Sinais de aparecimento</p>
            <div className="flex flex-wrap gap-1">
              {boss.signs.map((sign, i) => (
                <span key={i} className="text-[10px] px-2 py-1 bg-[#1a1a1a] border border-[#252525] rounded text-[#707070]">
                  {sign}
                </span>
              ))}
            </div>
          </div>
          <div className="mb-3 bg-[#0d0d0d] rounded-lg p-3">
            <p className="text-[#444444] text-[10px] uppercase tracking-widest mb-1">Missão para vencê-lo</p>
            <p className="text-[#f0f0f0] text-xs">{boss.quest}</p>
          </div>
        </>
      )}

      {onFight && (
        <button
          onClick={onFight}
          className="w-full py-2.5 text-sm font-semibold bg-[#e8863a] text-black rounded-lg"
        >
          Enfrentar agora
        </button>
      )}
    </div>
  );
}

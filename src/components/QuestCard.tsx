'use client';

import { Quest } from '@/lib/types';

interface QuestCardProps {
  quest: Quest;
  onComplete?: () => void;
  onStart?: () => void;
  onAbandon?: () => void;
}

const typeLabels: Record<string, string> = {
  execucao: 'Execução',
  contencao: 'Contenção',
  antioverplanning: 'Antioverplanning',
  relacionamento: 'Relacionamento',
  dopamina: 'Dopamina',
};

const statusColors: Record<string, string> = {
  pending: '#707070',
  in_progress: '#c8a04a',
  completed: '#4a9e6f',
  abandoned: '#c24a3a',
};

export default function QuestCard({ quest, onComplete, onStart, onAbandon }: QuestCardProps) {
  const statusColor = statusColors[quest.status] || '#707070';

  return (
    <div className="bg-[#161616] border border-[#252525] rounded-xl p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-widest text-[#707070]">
              {typeLabels[quest.type] || quest.type}
            </span>
            <span className="text-[10px] font-medium" style={{ color: statusColor }}>
              {quest.status === 'pending' ? '● Pendente' : quest.status === 'in_progress' ? '● Em progresso' : quest.status === 'completed' ? '● Concluída' : '● Abandonada'}
            </span>
          </div>
          <h3 className="text-[#f0f0f0] text-sm font-semibold leading-snug">{quest.title}</h3>
        </div>
        <span className="text-[#e8863a] text-xs font-bold ml-2 shrink-0">+{quest.xpReward} XP</span>
      </div>
      <p className="text-[#707070] text-xs leading-relaxed mb-3">{quest.description}</p>
      <p className="text-[#444444] text-xs italic mb-3">Evidência: {quest.evidenceRequired}</p>

      {quest.status !== 'completed' && quest.status !== 'abandoned' && (
        <div className="flex gap-2">
          {quest.status === 'pending' && onStart && (
            <button
              onClick={onStart}
              className="flex-1 py-2 text-xs font-semibold border border-[#252525] text-[#f0f0f0] rounded-lg"
            >
              Iniciar
            </button>
          )}
          {quest.status === 'in_progress' && onComplete && (
            <button
              onClick={onComplete}
              className="flex-1 py-2 text-xs font-semibold bg-[#e8863a] text-black rounded-lg"
            >
              Concluir
            </button>
          )}
          {onAbandon && (
            <button
              onClick={onAbandon}
              className="px-3 py-2 text-xs border border-[#c24a3a] text-[#c24a3a] rounded-lg"
            >
              Abandonar
            </button>
          )}
        </div>
      )}
    </div>
  );
}

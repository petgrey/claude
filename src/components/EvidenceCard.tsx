'use client';

import { Evidence } from '@/lib/types';

interface EvidenceCardProps {
  evidence: Evidence;
}

const sourceLabels: Record<string, string> = {
  quest: 'Quest',
  impulse: 'Impulso',
  frustration_block: 'Bloco Forja',
  boss_fight: 'Boss Fight',
  manual: 'Manual',
};

export default function EvidenceCard({ evidence }: EvidenceCardProps) {
  const date = new Date(evidence.createdAt);
  const formatted = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-[#161616] border border-[#252525] border-l-2 border-l-[#4a9e6f] rounded-xl p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-widest text-[#4a9e6f]">
              {sourceLabels[evidence.source] || evidence.source}
            </span>
            <span className="text-[#444444] text-[10px]">{formatted}</span>
          </div>
          <h3 className="text-[#f0f0f0] text-sm font-semibold leading-snug">{evidence.title}</h3>
        </div>
        <span className="text-[#4a9e6f] text-xs font-bold ml-2 shrink-0">+{evidence.xp} XP</span>
      </div>
      {evidence.description && (
        <p className="text-[#707070] text-xs leading-relaxed">{evidence.description}</p>
      )}
    </div>
  );
}

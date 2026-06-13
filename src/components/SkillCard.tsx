'use client';

import { Skill, Evidence } from '@/lib/types';
import { getProgressPercent, getXpForLevel } from '@/lib/xp';

interface SkillCardProps {
  skill: Skill;
  lastEvidence?: Evidence;
}

export default function SkillCard({ skill, lastEvidence }: SkillCardProps) {
  const progress = getProgressPercent(skill.xp);
  const nextLevelXp = getXpForLevel(skill.level + 1);
  const isMaxLevel = skill.level >= 10;

  return (
    <div className="bg-[#161616] border border-[#252525] rounded-xl p-4">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-[#f0f0f0] text-sm font-semibold">{skill.name}</h3>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#252525] text-[#e8863a] ml-2 shrink-0">
          Nv. {skill.level}
        </span>
      </div>
      <p className="text-[#707070] text-xs leading-relaxed mb-3">{skill.description}</p>

      <div className="mb-1">
        <div className="flex justify-between text-[10px] text-[#444444] mb-1">
          <span>{skill.xp} XP</span>
          <span>{isMaxLevel ? 'Máximo' : `${nextLevelXp} XP`}</span>
        </div>
        <div className="w-full h-1.5 bg-[#252525] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#e8863a] rounded-full transition-all"
            style={{ width: `${isMaxLevel ? 100 : progress}%` }}
          />
        </div>
      </div>

      {!isMaxLevel && (
        <p className="text-[#444444] text-[10px] mt-1">
          {nextLevelXp - skill.xp} XP para nível {skill.level + 1}
        </p>
      )}

      {lastEvidence && (
        <div className="mt-3 pt-3 border-t border-[#252525]">
          <p className="text-[#444444] text-[10px] uppercase tracking-widest mb-1">Última evidência</p>
          <p className="text-[#707070] text-xs truncate">{lastEvidence.title}</p>
        </div>
      )}
    </div>
  );
}

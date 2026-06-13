'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { SkillId } from '@/lib/types';
import { getCriteriosaLevel } from '@/lib/xp';
import SkillCard from '@/components/SkillCard';

export default function SkillsPage() {
  const [state] = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#252525] border-t-[#e8863a] animate-spin" />
      </div>
    );
  }

  const criteriosaLevel = getCriteriosaLevel(state.skills);
  const skillList = Object.values(state.skills);

  function getLastEvidenceForSkill(skillId: SkillId) {
    return state.evidences
      .filter(e => e.skillIds.includes(skillId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  }

  const totalSkillXp = skillList.reduce((sum, s) => sum + s.xp, 0);

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="mb-5">
        <h1 className="text-[#f0f0f0] text-xl font-bold">Skills</h1>
        <p className="text-[#707070] text-xs mt-1">Poder não nasce de intenção. Nasce de repetição.</p>
      </div>

      {/* Criterioso Level Card */}
      <div className="bg-[#161616] border border-[#252525] rounded-xl p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[#707070] text-xs uppercase tracking-widest mb-1">Nível Criterioso</p>
            <div className="flex items-baseline gap-2">
              <span className="text-[#e8863a] text-4xl font-bold">{criteriosaLevel}</span>
              <span className="text-[#707070] text-sm">/ 10</span>
            </div>
          </div>
          <div className="w-16 h-16 rounded-full border-2 border-[#e8863a] flex items-center justify-center bg-[#0d0d0d]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e8863a" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#252525]">
          <div>
            <p className="text-[#444444] text-[10px] uppercase tracking-widest">XP Total em Skills</p>
            <p className="text-[#f0f0f0] text-sm font-semibold mt-0.5">{totalSkillXp} XP</p>
          </div>
          <div>
            <p className="text-[#444444] text-[10px] uppercase tracking-widest">Evidências geradas</p>
            <p className="text-[#f0f0f0] text-sm font-semibold mt-0.5">{state.evidences.length}</p>
          </div>
        </div>
      </div>

      {/* Skill bars summary */}
      <div className="bg-[#161616] border border-[#252525] rounded-xl p-4 mb-5">
        <p className="text-[#707070] text-xs uppercase tracking-widest mb-3">Visão geral</p>
        <div className="space-y-3">
          {skillList.map(skill => {
            const maxXpAtLevel10 = 5000;
            const percent = Math.min(100, (skill.xp / maxXpAtLevel10) * 100);
            return (
              <div key={skill.id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#f0f0f0] text-xs">{skill.name}</span>
                  <span className="text-[#e8863a] text-xs font-medium">Nv. {skill.level}</span>
                </div>
                <div className="w-full h-1 bg-[#252525] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#e8863a] rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual Skill Cards */}
      <p className="text-[#707070] text-xs uppercase tracking-widest mb-3">Detalhamento</p>
      <div className="space-y-3">
        {skillList.map(skill => (
          <SkillCard
            key={skill.id}
            skill={skill}
            lastEvidence={getLastEvidenceForSkill(skill.id as SkillId)}
          />
        ))}
      </div>
    </div>
  );
}

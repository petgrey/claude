'use client';

import { AppState } from '@/lib/types';
import { getCriteriosaLevel } from '@/lib/xp';

interface StatusCardProps {
  state: AppState;
}

export default function StatusCard({ state }: StatusCardProps) {
  const criteriosaLevel = getCriteriosaLevel(state.skills);
  const today = new Date().toISOString().split('T')[0];
  const todayEvidences = state.evidences.filter(e => e.createdAt.startsWith(today)).length;

  return (
    <div className="bg-[#161616] border border-[#252525] rounded-xl p-4">
      <p className="text-[#707070] text-xs uppercase tracking-widest mb-3">Status</p>
      <div className="grid grid-cols-4 gap-3">
        <div className="flex flex-col items-center">
          <span className="text-[#e8863a] text-xl font-bold">{criteriosaLevel}</span>
          <span className="text-[#707070] text-[10px] text-center mt-1">Nível<br />Criterioso</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[#f0f0f0] text-xl font-bold">{state.totalXp}</span>
          <span className="text-[#707070] text-[10px] text-center mt-1">XP<br />Total</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[#e8863a] text-xl font-bold">{state.streak}</span>
          <span className="text-[#707070] text-[10px] text-center mt-1">Dias<br />Streak</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[#4a9e6f] text-xl font-bold">{todayEvidences}</span>
          <span className="text-[#707070] text-[10px] text-center mt-1">Evidências<br />Hoje</span>
        </div>
      </div>
    </div>
  );
}

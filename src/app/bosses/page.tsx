'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore, addXpToSkill } from '@/lib/store';
import { BOSSES, BossDefinition } from '@/lib/bosses';
import { SkillId } from '@/lib/types';
import BossCard from '@/components/BossCard';

export default function BossesPage() {
  const [state, setState] = useAppStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedBoss, setSelectedBoss] = useState<BossDefinition | null>(null);
  const [victory, setVictory] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#252525] border-t-[#e8863a] animate-spin" />
      </div>
    );
  }

  function handleFight(boss: BossDefinition) {
    setSelectedBoss(boss);
    setVictory(false);
  }

  function handleVictory() {
    if (!selectedBoss) return;
    const now = new Date().toISOString();
    const today = now.split('T')[0];
    const totalXpReward = Object.values(selectedBoss.xp).reduce((a, b) => a + b, 0);

    const bossFight = {
      id: crypto.randomUUID(),
      bossId: selectedBoss.id,
      completedAt: now,
      xpReward: totalXpReward,
    };

    const evidence = {
      id: crypto.randomUUID(),
      title: `Boss vencido: ${selectedBoss.name}`,
      description: selectedBoss.quest,
      type: 'boss_fight',
      skillIds: selectedBoss.skills as SkillId[],
      xp: totalXpReward,
      source: 'boss_fight' as const,
      createdAt: now,
    };

    let newState = {
      ...state,
      bossFights: [bossFight, ...state.bossFights],
      evidences: [evidence, ...state.evidences],
      totalXp: state.totalXp + totalXpReward,
      lastActiveDate: today,
    };

    for (const skillId of selectedBoss.skills) {
      const skillXp = selectedBoss.xp[skillId] || 0;
      if (skillXp > 0) {
        newState = addXpToSkill(newState, skillId, skillXp);
      }
    }

    setState(() => newState);
    setVictory(true);
  }

  const defeatedIds = state.bossFights.map(bf => bf.bossId);

  if (selectedBoss && !victory) {
    return (
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setSelectedBoss(null)} className="text-[#707070]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div>
            <h1 className="text-[#f0f0f0] text-lg font-bold">Enfrentando Boss</h1>
            <p className="text-[#707070] text-xs">Leia a missão e execute</p>
          </div>
        </div>

        <BossCard boss={selectedBoss} />

        <div className="mt-4 bg-[#161616] border border-[#252525] rounded-xl p-4">
          <p className="text-[#707070] text-xs uppercase tracking-widest mb-2">Para vencer</p>
          <p className="text-[#f0f0f0] text-sm font-medium">{selectedBoss.quest}</p>
        </div>

        <div className="mt-4 bg-[#0d0d0d] border border-[#e8863a]/30 rounded-xl p-3 text-center">
          <p className="text-[#707070] text-xs mb-1">XP ao vencer</p>
          <p className="text-[#e8863a] text-2xl font-bold">
            +{Object.values(selectedBoss.xp).reduce((a, b) => a + b, 0)} XP
          </p>
        </div>

        <button
          onClick={handleVictory}
          className="w-full mt-4 py-4 text-base font-bold bg-[#e8863a] text-black rounded-xl"
        >
          Registrar vitória
        </button>
        <button
          onClick={() => router.push('/forja')}
          className="w-full mt-3 py-3 text-sm border border-[#252525] text-[#707070] rounded-xl"
        >
          Iniciar bloco de fricção
        </button>
      </div>
    );
  }

  if (victory && selectedBoss) {
    return (
      <div className="px-4 pt-6 pb-4 flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="w-16 h-16 rounded-full bg-[#161616] border-2 border-[#e8863a] flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e8863a" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-[#f0f0f0] text-2xl font-bold mb-3">Boss vencido.</h2>
        <p className="text-[#707070] text-sm leading-relaxed mb-2">
          Você não eliminou o impulso.
        </p>
        <p className="text-[#707070] text-sm leading-relaxed mb-8">
          Você deixou de obedecer.
        </p>
        <div className="bg-[#161616] border border-[#252525] rounded-xl p-4 w-full max-w-[280px] mb-8">
          <p className="text-[#707070] text-xs mb-1">XP ganho</p>
          <p className="text-[#e8863a] text-3xl font-bold">
            +{Object.values(selectedBoss.xp).reduce((a, b) => a + b, 0)} XP
          </p>
        </div>
        <button
          onClick={() => setSelectedBoss(null)}
          className="w-full max-w-[280px] py-3 text-sm font-semibold bg-[#e8863a] text-black rounded-xl mb-3"
        >
          Ver todos os bosses
        </button>
        <button
          onClick={() => router.push('/')}
          className="w-full max-w-[280px] py-3 text-sm border border-[#252525] text-[#707070] rounded-xl"
        >
          Voltar ao início
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="mb-5">
        <h1 className="text-[#f0f0f0] text-xl font-bold">Bosses</h1>
        <p className="text-[#707070] text-xs mt-1">Padrões de comportamento que tentam te governar.</p>
      </div>

      <div className="bg-[#161616] border border-[#252525] rounded-xl p-3 mb-5 flex items-center gap-3">
        <div className="text-center flex-1">
          <p className="text-[#f0f0f0] text-xl font-bold">{state.bossFights.length}</p>
          <p className="text-[#707070] text-[10px]">Derrotados</p>
        </div>
        <div className="w-px h-8 bg-[#252525]" />
        <div className="text-center flex-1">
          <p className="text-[#f0f0f0] text-xl font-bold">{BOSSES.length}</p>
          <p className="text-[#707070] text-[10px]">Total</p>
        </div>
        <div className="w-px h-8 bg-[#252525]" />
        <div className="text-center flex-1">
          <p className="text-[#e8863a] text-xl font-bold">{BOSSES.length - new Set(defeatedIds).size}</p>
          <p className="text-[#707070] text-[10px]">Pendentes</p>
        </div>
      </div>

      <div className="space-y-4">
        {BOSSES.map(boss => {
          const fightCount = state.bossFights.filter(bf => bf.bossId === boss.id).length;
          return (
            <div key={boss.id}>
              <BossCard boss={boss} onFight={() => handleFight(boss)} />
              {fightCount > 0 && (
                <p className="text-[#444444] text-[10px] text-right mt-1">
                  Derrotado {fightCount}x
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

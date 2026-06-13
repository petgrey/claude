'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { ImpulseType, SkillId } from '@/lib/types';

const IMPULSE_TYPE_LABELS: Record<ImpulseType, string> = {
  fuga: 'Fuga',
  ansiedade: 'Ansiedade',
  overplanning: 'Overplanning',
  validacao: 'Validação',
  dopamina: 'Dopamina',
  rejeicao: 'Rejeição',
  procrastinacao: 'Procrastinação',
  irritacao: 'Irritação',
  pressa: 'Pressa',
  autossabotagem: 'Autossabotagem',
};

const IMPULSE_TYPES = Object.keys(IMPULSE_TYPE_LABELS) as ImpulseType[];

export default function ResumoPage() {
  const [state, setState] = useAppStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [mainImpulse, setMainImpulse] = useState<ImpulseType | null>(null);
  const [evidenceWithoutWill, setEvidenceWithoutWill] = useState('');
  const [reliefSource, setReliefSource] = useState<ImpulseType | null>(null);
  const [tomorrowNote, setTomorrowNote] = useState('');
  const [closed, setClosed] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#252525] border-t-[#e8863a] animate-spin" />
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const todayImpulses = state.impulses.filter(i => i.createdAt.startsWith(today));
  const todayImpulsesContained = todayImpulses.filter(i => i.result === 'contained').length;
  const todayEvidences = state.evidences.filter(e => e.createdAt.startsWith(today));
  const todayQuests = state.quests.filter(q => q.completedAt?.startsWith(today));
  const todayXp = todayImpulses.reduce((sum, i) => sum + i.xpReward, 0)
    + todayEvidences.filter(e => e.source !== 'impulse').reduce((sum, e) => sum + e.xp, 0);

  const existingSummary = state.dailySummaries.find(s => s.date === today);
  const alreadyClosed = existingSummary?.closed;

  function getStrongestSkill(): SkillId | null {
    const skills = Object.values(state.skills);
    if (skills.length === 0) return null;
    return skills.reduce((max, s) => s.xp > max.xp ? s : max).id as SkillId;
  }

  function handleClose() {
    if (!evidenceWithoutWill.trim()) return;
    const summary = {
      date: today,
      xpGained: todayXp,
      questsCompleted: todayQuests.length,
      impulsesLogged: todayImpulses.length,
      impulsesContained: todayImpulsesContained,
      evidencesGenerated: todayEvidences.length,
      strongestSkill: getStrongestSkill(),
      mainEscapePattern: reliefSource,
      closingNote: evidenceWithoutWill.trim(),
      closed: true,
    };
    setState(prev => ({
      ...prev,
      dailySummaries: [
        ...prev.dailySummaries.filter(s => s.date !== today),
        summary,
      ],
      streak: prev.streak + 1,
    }));
    setClosed(true);
  }

  if (closed || alreadyClosed) {
    const summary = state.dailySummaries.find(s => s.date === today) || existingSummary;
    return (
      <div className="px-4 pt-6 pb-4 flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="w-14 h-14 rounded-full bg-[#161616] border-2 border-[#4a9e6f] flex items-center justify-center mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4a9e6f" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-[#f0f0f0] text-xl font-bold mb-3">Dia encerrado.</h2>
        <p className="text-[#707070] text-sm leading-relaxed mb-8 max-w-[280px]">
          O dia não precisa ter sido perfeito. Precisa ter deixado lastro.
        </p>
        {summary && (
          <div className="bg-[#161616] border border-[#252525] rounded-xl p-4 w-full max-w-[320px] mb-6 space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-[#707070] text-xs">XP ganho</span>
              <span className="text-[#e8863a] text-xs font-bold">+{summary.xpGained}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#707070] text-xs">Quests concluídas</span>
              <span className="text-[#f0f0f0] text-xs font-bold">{summary.questsCompleted}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#707070] text-xs">Impulsos registrados</span>
              <span className="text-[#f0f0f0] text-xs font-bold">{summary.impulsesLogged}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#707070] text-xs">Impulsos contidos</span>
              <span className="text-[#4a9e6f] text-xs font-bold">{summary.impulsesContained}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#707070] text-xs">Evidências geradas</span>
              <span className="text-[#4a9e6f] text-xs font-bold">{summary.evidencesGenerated}</span>
            </div>
          </div>
        )}
        <button
          onClick={() => router.push('/')}
          className="w-full max-w-[280px] py-3 text-sm font-semibold bg-[#e8863a] text-black rounded-xl"
        >
          Voltar ao início
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="mb-5">
        <h1 className="text-[#f0f0f0] text-xl font-bold">Resumo do Dia</h1>
        <p className="text-[#707070] text-xs mt-1">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Stats */}
      <div className="bg-[#161616] border border-[#252525] rounded-xl p-4 mb-5">
        <p className="text-[#707070] text-xs uppercase tracking-widest mb-3">Hoje</p>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <p className="text-[#e8863a] text-xl font-bold">{todayXp}</p>
            <p className="text-[#707070] text-[9px] mt-0.5">XP</p>
          </div>
          <div>
            <p className="text-[#f0f0f0] text-xl font-bold">{todayQuests.length}</p>
            <p className="text-[#707070] text-[9px] mt-0.5">Quests</p>
          </div>
          <div>
            <p className="text-[#c24a3a] text-xl font-bold">{todayImpulses.length}</p>
            <p className="text-[#707070] text-[9px] mt-0.5">Impulsos</p>
          </div>
          <div>
            <p className="text-[#4a9e6f] text-xl font-bold">{todayEvidences.length}</p>
            <p className="text-[#707070] text-[9px] mt-0.5">Evidências</p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {/* Question 1 */}
        <div>
          <p className="text-[#707070] text-xs uppercase tracking-widest mb-3">
            Qual impulso mais tentou te governar hoje?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {IMPULSE_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setMainImpulse(mainImpulse === type ? null : type)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-colors text-left ${
                  mainImpulse === type
                    ? 'bg-[#c24a3a]/10 border-[#c24a3a] text-[#c24a3a]'
                    : 'bg-[#161616] border-[#252525] text-[#f0f0f0]'
                }`}
              >
                {IMPULSE_TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </div>

        {/* Question 2 */}
        <div>
          <p className="text-[#707070] text-xs uppercase tracking-widest mb-2">
            Qual evidência você gerou mesmo sem vontade? *
          </p>
          <textarea
            value={evidenceWithoutWill}
            onChange={e => setEvidenceWithoutWill(e.target.value)}
            placeholder="Descreva uma evidência real que você gerou hoje..."
            rows={3}
            className="w-full bg-[#161616] border border-[#252525] rounded-xl px-4 py-3 text-sm text-[#f0f0f0] placeholder-[#444444] resize-none"
          />
        </div>

        {/* Question 3 */}
        <div>
          <p className="text-[#707070] text-xs uppercase tracking-widest mb-3">
            Onde buscou alívio antes de evidência?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {IMPULSE_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setReliefSource(reliefSource === type ? null : type)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-colors text-left ${
                  reliefSource === type
                    ? 'bg-[#252525] border-[#707070] text-[#f0f0f0]'
                    : 'bg-[#161616] border-[#252525] text-[#707070]'
                }`}
              >
                {IMPULSE_TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </div>

        {/* Question 4 */}
        <div>
          <p className="text-[#707070] text-xs uppercase tracking-widest mb-2">
            O que o Peter de amanhã precisa encontrar pronto?
          </p>
          <textarea
            value={tomorrowNote}
            onChange={e => setTomorrowNote(e.target.value)}
            placeholder="Opcional — deixe um recado para amanhã..."
            rows={2}
            className="w-full bg-[#161616] border border-[#252525] rounded-xl px-4 py-3 text-sm text-[#f0f0f0] placeholder-[#444444] resize-none"
          />
        </div>

        {/* Close day */}
        <div className="bg-[#161616] border border-[#252525] rounded-xl p-3 text-center">
          <p className="text-[#707070] text-xs italic">
            &ldquo;O dia não precisa ter sido perfeito. Precisa ter deixado lastro.&rdquo;
          </p>
        </div>

        <button
          onClick={handleClose}
          disabled={!evidenceWithoutWill.trim()}
          className="w-full py-4 text-sm font-bold bg-[#e8863a] text-black rounded-xl disabled:opacity-40"
        >
          Encerrar dia
        </button>
      </div>
    </div>
  );
}

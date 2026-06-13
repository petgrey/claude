'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore, IMPULSE_TRADEOFFS, addXpToSkill } from '@/lib/store';
import { ImpulseType, ImpulseResult, SkillId, Evidence } from '@/lib/types';

const IMPULSE_TYPES: { id: ImpulseType; label: string }[] = [
  { id: 'fuga', label: 'Fuga' },
  { id: 'ansiedade', label: 'Ansiedade' },
  { id: 'overplanning', label: 'Overplanning' },
  { id: 'validacao', label: 'Validação' },
  { id: 'dopamina', label: 'Dopamina' },
  { id: 'rejeicao', label: 'Rejeição' },
  { id: 'procrastinacao', label: 'Procrastinação' },
  { id: 'irritacao', label: 'Irritação' },
  { id: 'pressa', label: 'Pressa' },
  { id: 'autossabotagem', label: 'Autossabotagem' },
];

const ACTIONS = [
  'Pausa de 5 min',
  'Escreveu o impulso',
  'Respirou fundo',
  'Saiu do ambiente',
  'Esperou 10 min',
  'Fez a tarefa mesmo assim',
];

const IMPULSE_SKILLS: Record<ImpulseType, SkillId> = {
  fuga: 'execucao_friccao',
  ansiedade: 'contencao_emocional',
  overplanning: 'antioverplanning',
  validacao: 'resistencia_rejeicao',
  dopamina: 'dopamina_criteriosa',
  rejeicao: 'resistencia_rejeicao',
  procrastinacao: 'execucao_friccao',
  irritacao: 'contencao_emocional',
  pressa: 'contencao_emocional',
  autossabotagem: 'visao_futuro',
};

export default function ImpulsoPage() {
  const [state, setState] = useAppStore();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<ImpulseType | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [chosenAction, setChosenAction] = useState('');
  const [result, setResult] = useState<ImpulseResult | null>(null);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const tradeoff = selectedType ? IMPULSE_TRADEOFFS[selectedType] : '';

  function handleTypeSelect(type: ImpulseType) {
    setSelectedType(type);
    setStep(2);
  }

  function handleSubmit() {
    if (!selectedType || !result) return;
    const now = new Date().toISOString();
    const today = now.split('T')[0];
    const skillId = IMPULSE_SKILLS[selectedType];
    const xpReward = result === 'contained' ? 20 : result === 'partial' ? 5 : 0;

    const impulse = {
      id: crypto.randomUUID(),
      type: selectedType,
      intensity,
      chosenAction,
      result,
      tradeoff,
      xpReward,
      createdAt: now,
    };

    const evidences: Evidence[] = result !== 'obeyed' ? [{
      id: crypto.randomUUID(),
      title: `Impulso ${result === 'contained' ? 'contido' : 'parcialmente contido'}: ${IMPULSE_TYPES.find(t => t.id === selectedType)?.label ?? selectedType}`,
      description: `Intensidade ${intensity}/10. Ação: ${chosenAction}. ${note}`,
      type: 'impulse',
      skillIds: [skillId],
      xp: xpReward,
      source: 'impulse',
      createdAt: now,
    }] : [];

    let newState = {
      ...state,
      impulses: [impulse, ...state.impulses],
      evidences: [...evidences, ...state.evidences],
      totalXp: state.totalXp + xpReward,
      lastActiveDate: today,
    };

    if (xpReward > 0) {
      newState = addXpToSkill(newState, skillId, xpReward);
    }

    setState(() => newState);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="px-4 pt-6 pb-4">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-14 h-14 rounded-full bg-[#161616] border border-[#4a9e6f] flex items-center justify-center mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4a9e6f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-[#f0f0f0] text-xl font-bold mb-3">Impulso registrado.</h2>
          <p className="text-[#707070] text-sm mb-8">Agora escolha evidência, não alívio.</p>
          <button
            onClick={() => router.push('/')}
            className="w-full max-w-[280px] py-3 text-sm font-semibold bg-[#e8863a] text-black rounded-xl mb-3"
          >
            Voltar ao início
          </button>
          <button
            onClick={() => router.push('/evidencias')}
            className="w-full max-w-[280px] py-3 text-sm border border-[#252525] text-[#707070] rounded-xl"
          >
            Ver evidências
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => step > 1 ? setStep(step - 1) : router.back()} className="text-[#707070]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-[#f0f0f0] text-lg font-bold">Registrar Impulso</h1>
          <p className="text-[#707070] text-xs">Passo {step} de 3</p>
        </div>
      </div>

      <div className="w-full h-1 bg-[#252525] rounded-full mb-6">
        <div
          className="h-full bg-[#e8863a] rounded-full transition-all"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      {step === 1 && (
        <div>
          <p className="text-[#707070] text-xs uppercase tracking-widest mb-4">Qual impulso está presente?</p>
          <div className="grid grid-cols-2 gap-2">
            {IMPULSE_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className="py-3 px-4 bg-[#161616] border border-[#252525] rounded-xl text-sm text-[#f0f0f0] text-left font-medium"
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && selectedType && (
        <div className="space-y-5">
          <div className="bg-[#161616] border border-[#c24a3a] rounded-xl p-4">
            <p className="text-[#c24a3a] text-[10px] uppercase tracking-widest mb-2">O que está em jogo</p>
            <p className="text-[#f0f0f0] text-sm font-medium">{tradeoff}</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[#707070] text-xs uppercase tracking-widest">Intensidade</p>
              <span className="text-[#e8863a] text-xl font-bold">{intensity}</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={intensity}
              onChange={e => setIntensity(Number(e.target.value))}
            />
            <div className="flex justify-between text-[#444444] text-[10px] mt-1">
              <span>Fraco</span>
              <span>Forte</span>
            </div>
          </div>

          <div>
            <p className="text-[#707070] text-xs uppercase tracking-widest mb-3">O que você fez?</p>
            <div className="grid grid-cols-2 gap-2">
              {ACTIONS.map(action => (
                <button
                  key={action}
                  onClick={() => setChosenAction(action)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-medium text-left transition-colors ${
                    chosenAction === action
                      ? 'bg-[#e8863a]/10 border-[#e8863a] text-[#e8863a]'
                      : 'bg-[#161616] border-[#252525] text-[#f0f0f0]'
                  }`}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep(3)}
            disabled={!chosenAction}
            className="w-full py-3 text-sm font-semibold bg-[#e8863a] text-black rounded-xl disabled:opacity-40"
          >
            Continuar
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <p className="text-[#707070] text-xs uppercase tracking-widest">Qual foi o resultado?</p>

          <div className="space-y-3">
            {([
              { id: 'contained' as ImpulseResult, label: 'Contido', desc: 'Não agi no impulso. +20 XP', color: '#4a9e6f' },
              { id: 'partial' as ImpulseResult, label: 'Parcialmente contido', desc: 'Agi parcialmente. +5 XP', color: '#c8a04a' },
              { id: 'obeyed' as ImpulseResult, label: 'Obedecido', desc: 'Cedi ao impulso. Registro de consciência.', color: '#c24a3a' },
            ]).map(opt => (
              <button
                key={opt.id}
                onClick={() => setResult(opt.id)}
                className={`w-full p-4 rounded-xl border text-left transition-colors bg-[#161616] ${
                  result === opt.id ? '' : 'border-[#252525]'
                }`}
                style={{ borderColor: result === opt.id ? opt.color : undefined }}
              >
                <p className="text-sm font-semibold" style={{ color: opt.color }}>{opt.label}</p>
                <p className="text-[#707070] text-xs mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>

          <div>
            <label className="text-[#707070] text-xs uppercase tracking-widest block mb-2">Nota (opcional)</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="O que você percebeu?"
              rows={3}
              className="w-full bg-[#161616] border border-[#252525] rounded-xl px-3 py-2.5 text-sm text-[#f0f0f0] placeholder-[#444444] resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!result}
            className="w-full py-3 text-sm font-semibold bg-[#e8863a] text-black rounded-xl disabled:opacity-40"
          >
            Registrar impulso
          </button>
        </div>
      )}
    </div>
  );
}

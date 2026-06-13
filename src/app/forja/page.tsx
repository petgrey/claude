'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore, addXpToSkill } from '@/lib/store';

const FORGE_PHRASES = [
  "Permaneça.",
  "A fricção é o treino.",
  "Não negocie com o primeiro desconforto.",
  "A evidência vem antes do alívio.",
  "Você não precisa gostar. Precisa permanecer.",
];

type Phase = 'setup' | 'running' | 'paused' | 'done' | 'abandoned';

export default function ForjaPage() {
  const [state, setState] = useAppStore();
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>('setup');
  const [task, setTask] = useState('');
  const [evidenceMinimum, setEvidenceMinimum] = useState('');
  const [futureBought, setFutureBought] = useState('');
  const [avoidanceReason, setAvoidanceReason] = useState('');

  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);

  // Post-timer
  const [evidenceGenerated, setEvidenceGenerated] = useState<boolean | null>(null);
  const [discomfort, setDiscomfort] = useState(5);
  const [produced, setProduced] = useState('');

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const phraseIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (phraseIntervalRef.current) clearInterval(phraseIntervalRef.current);
    };
  }, []);

  function startTimer() {
    if (!task.trim() || !evidenceMinimum.trim()) return;
    setPhase('running');
    setTimeLeft(25 * 60);

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          clearInterval(phraseIntervalRef.current!);
          setPhase('done');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    phraseIntervalRef.current = setInterval(() => {
      setPhraseIndex(prev => (prev + 1) % FORGE_PHRASES.length);
    }, 15000);
  }

  function pauseTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (phraseIntervalRef.current) clearInterval(phraseIntervalRef.current);
    setPhase('paused');
  }

  function resumeTimer() {
    setPhase('running');
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setPhase('done');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    phraseIntervalRef.current = setInterval(() => {
      setPhraseIndex(prev => (prev + 1) % FORGE_PHRASES.length);
    }, 15000);
  }

  function abandonTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (phraseIntervalRef.current) clearInterval(phraseIntervalRef.current);
    setPhase('abandoned');
  }

  function handleRegister() {
    if (evidenceGenerated === null) return;
    const now = new Date().toISOString();
    const today = now.split('T')[0];
    // minutesDone intentionally unused — kept for future logging
    const xpBase = 20;
    const xpEvidence = evidenceGenerated ? 30 : 0;
    const xpBonus = discomfort >= 7 ? 10 : 0;
    const totalXp = xpBase + xpEvidence + xpBonus;

    const block = {
      id: crypto.randomUUID(),
      task: task.trim(),
      avoidanceReason: avoidanceReason.trim(),
      evidenceMinimum: evidenceMinimum.trim(),
      futureBought: futureBought.trim(),
      durationMinutes: 25,
      completed: true,
      evidenceGenerated: evidenceGenerated,
      discomfortLevel: discomfort,
      xpReward: totalXp,
      createdAt: now,
    };

    const evidence = {
      id: crypto.randomUUID(),
      title: `Bloco Forja: ${task.trim()}`,
      description: produced.trim() || `Bloco concluído. Desconforto: ${discomfort}/10.`,
      type: 'frustration_block',
      skillIds: ['execucao_friccao' as const],
      xp: totalXp,
      source: 'frustration_block' as const,
      createdAt: now,
    };

    let newState = {
      ...state,
      frustrationBlocks: [block, ...state.frustrationBlocks],
      evidences: [evidence, ...state.evidences],
      totalXp: state.totalXp + totalXp,
      lastActiveDate: today,
    };
    newState = addXpToSkill(newState, 'execucao_friccao', totalXp);
    if (evidenceGenerated) {
      newState = addXpToSkill(newState, 'visao_futuro', 15);
    }
    setState(() => newState);
    router.push('/');
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  // Setup phase
  if (phase === 'setup') {
    return (
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="text-[#707070]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div>
            <h1 className="text-[#f0f0f0] text-lg font-bold">Forja</h1>
            <p className="text-[#707070] text-xs">Bloco de 25 minutos de fricção real</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[#707070] text-xs uppercase tracking-widest block mb-2">Tarefa *</label>
            <input
              type="text"
              value={task}
              onChange={e => setTask(e.target.value)}
              placeholder="O que você vai executar?"
              className="w-full bg-[#161616] border border-[#252525] rounded-xl px-4 py-3 text-sm text-[#f0f0f0] placeholder-[#444444]"
            />
          </div>

          <div>
            <label className="text-[#707070] text-xs uppercase tracking-widest block mb-2">Evidência mínima *</label>
            <input
              type="text"
              value={evidenceMinimum}
              onChange={e => setEvidenceMinimum(e.target.value)}
              placeholder="O que conta como evidência de que você fez?"
              className="w-full bg-[#161616] border border-[#252525] rounded-xl px-4 py-3 text-sm text-[#f0f0f0] placeholder-[#444444]"
            />
          </div>

          <div>
            <label className="text-[#707070] text-xs uppercase tracking-widest block mb-2">Futuro comprado <span className="text-[#444444] normal-case">(opcional)</span></label>
            <input
              type="text"
              value={futureBought}
              onChange={e => setFutureBought(e.target.value)}
              placeholder="O que este bloco vai comprar para o futuro?"
              className="w-full bg-[#161616] border border-[#252525] rounded-xl px-4 py-3 text-sm text-[#f0f0f0] placeholder-[#444444]"
            />
          </div>

          <div>
            <label className="text-[#707070] text-xs uppercase tracking-widest block mb-2">Razão de evitar <span className="text-[#444444] normal-case">(opcional)</span></label>
            <input
              type="text"
              value={avoidanceReason}
              onChange={e => setAvoidanceReason(e.target.value)}
              placeholder="Por que você evitou esta tarefa?"
              className="w-full bg-[#161616] border border-[#252525] rounded-xl px-4 py-3 text-sm text-[#f0f0f0] placeholder-[#444444]"
            />
          </div>

          <button
            onClick={startTimer}
            disabled={!task.trim() || !evidenceMinimum.trim()}
            className="w-full py-4 text-base font-bold bg-[#e8863a] text-black rounded-xl disabled:opacity-40"
          >
            Iniciar Forja
          </button>
        </div>
      </div>
    );
  }

  // Running / Paused phase
  if (phase === 'running' || phase === 'paused') {
    return (
      <div className="px-4 pt-6 pb-4 flex flex-col min-h-[80vh]">
        {showAbandonConfirm && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-6">
            <div className="bg-[#161616] border border-[#252525] rounded-2xl p-6 w-full max-w-[340px]">
              <h3 className="text-[#f0f0f0] font-semibold mb-2">Abandonar o bloco?</h3>
              <p className="text-[#707070] text-sm mb-5">Você não vai ganhar XP se abandonar agora.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAbandonConfirm(false)}
                  className="flex-1 py-2.5 text-sm border border-[#252525] text-[#f0f0f0] rounded-xl"
                >
                  Continuar
                </button>
                <button
                  onClick={abandonTimer}
                  className="flex-1 py-2.5 text-sm border border-[#c24a3a] text-[#c24a3a] rounded-xl"
                >
                  Abandonar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setShowAbandonConfirm(true)} className="text-[#444444] text-xs">
            Abandonar
          </button>
          <div className={`w-2 h-2 rounded-full ${phase === 'running' ? 'bg-[#e8863a]' : 'bg-[#444444]'}`} />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Circular progress */}
          <div className="relative w-52 h-52 mb-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="none" stroke="#252525" strokeWidth="4" />
              <circle
                cx="50" cy="50" r="46"
                fill="none"
                stroke="#e8863a"
                strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 46}`}
                strokeDashoffset={`${2 * Math.PI * 46 * (1 - progress / 100)}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[#f0f0f0] text-4xl font-bold tracking-tighter">{timeDisplay}</span>
              <span className="text-[#707070] text-xs mt-1">{phase === 'paused' ? 'pausado' : 'restantes'}</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-[#444444] text-xs uppercase tracking-widest mb-2">Tarefa</p>
            <p className="text-[#f0f0f0] text-base font-medium">{task}</p>
          </div>

          <div className="bg-[#161616] border border-[#252525] rounded-xl px-5 py-3 max-w-[280px]">
            <p className="text-[#707070] text-sm text-center italic">{FORGE_PHRASES[phraseIndex]}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          {phase === 'running' ? (
            <button
              onClick={pauseTimer}
              className="flex-1 py-3 text-sm font-semibold border border-[#252525] text-[#f0f0f0] rounded-xl"
            >
              Pausar
            </button>
          ) : (
            <button
              onClick={resumeTimer}
              className="flex-1 py-3 text-sm font-semibold bg-[#e8863a] text-black rounded-xl"
            >
              Retomar
            </button>
          )}
        </div>
      </div>
    );
  }

  // Abandoned phase
  if (phase === 'abandoned') {
    return (
      <div className="px-4 pt-6 pb-4 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-14 h-14 rounded-full bg-[#161616] border border-[#252525] flex items-center justify-center mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#707070" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </div>
        <h2 className="text-[#f0f0f0] text-xl font-bold mb-3">Bloco abandonado.</h2>
        <p className="text-[#707070] text-sm mb-8">O registro importa. A próxima vez, permaneça mais.</p>
        <button
          onClick={() => { setPhase('setup'); setTimeLeft(25 * 60); }}
          className="w-full max-w-[280px] py-3 text-sm font-semibold bg-[#e8863a] text-black rounded-xl mb-3"
        >
          Tentar novamente
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

  // Done phase - post-timer
  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex flex-col items-center mb-6">
        <div className="w-14 h-14 rounded-full bg-[#161616] border border-[#e8863a] flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e8863a" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-[#f0f0f0] text-xl font-bold">Bloco concluído.</h2>
        <p className="text-[#707070] text-xs mt-1">25 minutos. Agora registre.</p>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-[#707070] text-xs uppercase tracking-widest mb-3">Você gerou evidência?</p>
          <div className="flex gap-3">
            <button
              onClick={() => setEvidenceGenerated(true)}
              className={`flex-1 py-3 text-sm font-semibold rounded-xl border transition-colors ${
                evidenceGenerated === true ? 'bg-[#4a9e6f]/10 border-[#4a9e6f] text-[#4a9e6f]' : 'border-[#252525] text-[#707070]'
              }`}
            >
              Sim (+30 XP)
            </button>
            <button
              onClick={() => setEvidenceGenerated(false)}
              className={`flex-1 py-3 text-sm font-semibold rounded-xl border transition-colors ${
                evidenceGenerated === false ? 'bg-[#161616] border-[#707070] text-[#f0f0f0]' : 'border-[#252525] text-[#707070]'
              }`}
            >
              Não (+0)
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#707070] text-xs uppercase tracking-widest">Nível de desconforto</p>
            <span className="text-[#e8863a] text-xl font-bold">{discomfort}</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={discomfort}
            onChange={e => setDiscomfort(Number(e.target.value))}
          />
          <div className="flex justify-between text-[#444444] text-[10px] mt-1">
            <span>Tranquilo</span>
            <span>Intenso {discomfort >= 7 ? '(+10 XP)' : ''}</span>
          </div>
        </div>

        <div>
          <label className="text-[#707070] text-xs uppercase tracking-widest block mb-2">O que foi produzido? <span className="text-[#444444] normal-case">(opcional)</span></label>
          <textarea
            value={produced}
            onChange={e => setProduced(e.target.value)}
            placeholder="Descreva brevemente o que saiu deste bloco..."
            rows={3}
            className="w-full bg-[#161616] border border-[#252525] rounded-xl px-4 py-3 text-sm text-[#f0f0f0] placeholder-[#444444] resize-none"
          />
        </div>

        <div className="bg-[#161616] border border-[#252525] rounded-xl p-3 text-center">
          <p className="text-[#707070] text-xs mb-1">XP a receber</p>
          <p className="text-[#e8863a] text-2xl font-bold">
            +{20 + (evidenceGenerated ? 30 : 0) + (discomfort >= 7 ? 10 : 0)} XP
          </p>
        </div>

        <button
          onClick={handleRegister}
          disabled={evidenceGenerated === null}
          className="w-full py-4 text-sm font-bold bg-[#e8863a] text-black rounded-xl disabled:opacity-40"
        >
          Registrar e ganhar XP
        </button>
      </div>
    </div>
  );
}

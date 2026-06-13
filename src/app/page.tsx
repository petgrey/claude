'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Quest, QuestType } from '@/lib/types';
import StatusCard from '@/components/StatusCard';
import DailyPhrase from '@/components/DailyPhrase';
import QuestCard from '@/components/QuestCard';
import ReturnScreen from '@/components/ReturnScreen';
import BossCard from '@/components/BossCard';
import { BOSSES } from '@/lib/bosses';
import { DEFAULT_QUESTS, QuestTemplate } from '@/lib/defaultQuests';
import Link from 'next/link';
import { getLevelFromXp } from '@/lib/xp';

function isAbsentMoreThan2Days(lastActiveDate: string): boolean {
  const last = new Date(lastActiveDate);
  const now = new Date();
  const diff = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 2;
}

export default function Home() {
  const [state, setState] = useAppStore();
  const [showBossModal, setShowBossModal] = useState(false);
  const [showCreateQuest, setShowCreateQuest] = useState(false);
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [newQuestDesc, setNewQuestDesc] = useState('');
  const [newQuestType, setNewQuestType] = useState<QuestType>('execucao');
  const [newQuestEvidence, setNewQuestEvidence] = useState('');
  const [questTab, setQuestTab] = useState<'manual' | 'template'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<QuestTemplate | null>(null);
  const [templateType, setTemplateType] = useState<QuestType>('execucao');

  const today = new Date().toISOString().split('T')[0];
  const showReturn = isAbsentMoreThan2Days(state.lastActiveDate);
  const activeQuests = state.quests.filter(q => q.status === 'pending' || q.status === 'in_progress').slice(0, 3);

  useEffect(() => {
    if (state.lastActiveDate !== today) {
      setState(prev => ({ ...prev, lastActiveDate: today }));
    }
  }, [today, state.lastActiveDate, setState]);

  function handleQuestStart(questId: string) {
    setState(prev => ({
      ...prev,
      quests: prev.quests.map(q => q.id === questId ? { ...q, status: 'in_progress' } : q),
    }));
  }

  function handleQuestComplete(questId: string) {
    const quest = state.quests.find(q => q.id === questId);
    if (!quest) return;
    const now = new Date().toISOString();
    setState(prev => {
      const updatedSkills = { ...prev.skills };
      quest.skillIds.forEach(skillId => {
        const skill = updatedSkills[skillId];
        const newXp = skill.xp + quest.xpReward;
        updatedSkills[skillId] = { ...skill, xp: newXp, level: getLevelFromXp(newXp) };
      });
      const evidence = {
        id: Date.now().toString(),
        title: `Quest concluída: ${quest.title}`,
        description: quest.evidenceRequired,
        type: quest.type,
        skillIds: quest.skillIds,
        xp: quest.xpReward,
        source: 'quest' as const,
        createdAt: now,
      };
      return {
        ...prev,
        quests: prev.quests.map(q => q.id === questId ? { ...q, status: 'completed', completedAt: now } : q),
        skills: updatedSkills,
        totalXp: prev.totalXp + quest.xpReward,
        evidences: [evidence, ...prev.evidences],
      };
    });
  }

  function handleQuestAbandon(questId: string) {
    setState(prev => ({
      ...prev,
      quests: prev.quests.map(q => q.id === questId ? { ...q, status: 'abandoned' } : q),
    }));
  }

  function handleCreateQuestManual() {
    if (!newQuestTitle.trim()) return;
    const quest: Quest = {
      id: Date.now().toString(),
      title: newQuestTitle.trim(),
      description: newQuestDesc.trim(),
      type: newQuestType,
      skillIds: [],
      xpReward: 30,
      evidenceRequired: newQuestEvidence.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setState(prev => ({ ...prev, quests: [quest, ...prev.quests] }));
    setNewQuestTitle('');
    setNewQuestDesc('');
    setNewQuestEvidence('');
    setShowCreateQuest(false);
  }

  function handleCreateQuestFromTemplate() {
    if (!selectedTemplate) return;
    const quest: Quest = {
      id: Date.now().toString(),
      title: selectedTemplate.title,
      description: selectedTemplate.description,
      type: selectedTemplate.type,
      skillIds: selectedTemplate.skillIds,
      xpReward: selectedTemplate.xpReward,
      evidenceRequired: selectedTemplate.evidenceRequired,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setState(prev => ({ ...prev, quests: [quest, ...prev.quests] }));
    setSelectedTemplate(null);
    setShowCreateQuest(false);
  }

  const questTypeLabels: Record<QuestType, string> = {
    execucao: 'Execução',
    contencao: 'Contenção',
    antioverplanning: 'Antioverplanning',
    relacionamento: 'Relacionamento',
    dopamina: 'Dopamina',
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-[#f0f0f0] text-xl font-bold">Forja do Criterioso</h1>
        <p className="text-[#707070] text-xs mt-0.5">Treine comando quando o impulso pedir alívio.</p>
      </div>

      {/* Return screen */}
      {showReturn && <ReturnScreen />}

      {/* Status */}
      <StatusCard state={state} />

      {/* Daily phrase */}
      <DailyPhrase />

      {/* Boss button */}
      <button
        onClick={() => setShowBossModal(true)}
        className="w-full bg-[#e8863a] text-black font-semibold py-3 rounded-xl text-sm"
      >
        Estou sendo atacado
      </button>

      {/* Today quests */}
      {activeQuests.length > 0 && (
        <div className="space-y-3">
          <p className="text-[#707070] text-xs uppercase tracking-widest">Quests ativas</p>
          {activeQuests.map(quest => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onStart={() => handleQuestStart(quest.id)}
              onComplete={() => handleQuestComplete(quest.id)}
              onAbandon={() => handleQuestAbandon(quest.id)}
            />
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/impulso"
          className="flex items-center justify-center border border-[#252525] text-[#f0f0f0] text-sm font-medium py-3 rounded-xl"
        >
          Registrar impulso
        </Link>
        <Link
          href="/forja"
          className="flex items-center justify-center border border-[#252525] text-[#f0f0f0] text-sm font-medium py-3 rounded-xl"
        >
          Iniciar bloco
        </Link>
      </div>

      {/* Create quest */}
      <button
        onClick={() => setShowCreateQuest(true)}
        className="w-full border border-[#252525] text-[#707070] text-sm py-3 rounded-xl"
      >
        + Criar quest
      </button>

      {/* Boss Modal */}
      {showBossModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end" onClick={() => setShowBossModal(false)}>
          <div className="bg-[#161616] rounded-t-2xl w-full max-w-[480px] mx-auto p-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[#f0f0f0] font-bold">Qual boss está atacando?</h2>
              <button onClick={() => setShowBossModal(false)} className="text-[#707070]">✕</button>
            </div>
            <div className="space-y-4">
              {BOSSES.map(boss => (
                <BossCard
                  key={boss.id}
                  boss={boss}
                  onFight={() => {
                    setShowBossModal(false);
                    window.location.href = `/forja?boss=${boss.id}`;
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Quest Modal */}
      {showCreateQuest && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end" onClick={() => setShowCreateQuest(false)}>
          <div className="bg-[#161616] rounded-t-2xl w-full max-w-[480px] mx-auto p-4 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[#f0f0f0] font-bold">Criar Quest</h2>
              <button onClick={() => setShowCreateQuest(false)} className="text-[#707070]">✕</button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setQuestTab('template')}
                className={`flex-1 py-2 text-sm rounded-lg font-medium ${questTab === 'template' ? 'bg-[#e8863a] text-black' : 'border border-[#252525] text-[#707070]'}`}
              >
                Templates
              </button>
              <button
                onClick={() => setQuestTab('manual')}
                className={`flex-1 py-2 text-sm rounded-lg font-medium ${questTab === 'manual' ? 'bg-[#e8863a] text-black' : 'border border-[#252525] text-[#707070]'}`}
              >
                Manual
              </button>
            </div>

            {questTab === 'template' && (
              <div className="space-y-3">
                {/* Type filter */}
                <div className="flex gap-1.5 flex-wrap">
                  {(Object.keys(questTypeLabels) as QuestType[]).map(type => (
                    <button
                      key={type}
                      onClick={() => setTemplateType(type)}
                      className={`text-xs px-3 py-1 rounded-full border ${templateType === type ? 'bg-[#e8863a] text-black border-[#e8863a]' : 'border-[#252525] text-[#707070]'}`}
                    >
                      {questTypeLabels[type]}
                    </button>
                  ))}
                </div>
                {DEFAULT_QUESTS[templateType].map((template, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedTemplate(template === selectedTemplate ? null : template)}
                    className={`p-3 rounded-xl border cursor-pointer ${selectedTemplate === template ? 'border-[#e8863a]' : 'border-[#252525]'} bg-[#0d0d0d]`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-[#f0f0f0] text-sm font-semibold">{template.title}</h4>
                      <span className="text-[#e8863a] text-[10px]">+{template.xpReward} XP</span>
                    </div>
                    <p className="text-[#707070] text-xs">{template.description}</p>
                  </div>
                ))}
                <button
                  onClick={handleCreateQuestFromTemplate}
                  disabled={!selectedTemplate}
                  className="w-full bg-[#e8863a] text-black font-semibold py-3 rounded-xl text-sm disabled:opacity-40"
                >
                  Adicionar quest
                </button>
              </div>
            )}

            {questTab === 'manual' && (
              <div className="space-y-3">
                <div>
                  <label className="text-[#707070] text-xs uppercase tracking-widest block mb-1">Título *</label>
                  <input
                    value={newQuestTitle}
                    onChange={e => setNewQuestTitle(e.target.value)}
                    className="w-full bg-[#0d0d0d] border border-[#252525] rounded-lg p-3 text-sm text-[#f0f0f0] outline-none focus:border-[#e8863a]"
                    placeholder="Nome da quest"
                  />
                </div>
                <div>
                  <label className="text-[#707070] text-xs uppercase tracking-widest block mb-1">Descrição</label>
                  <textarea
                    value={newQuestDesc}
                    onChange={e => setNewQuestDesc(e.target.value)}
                    className="w-full bg-[#0d0d0d] border border-[#252525] rounded-lg p-3 text-sm text-[#f0f0f0] outline-none focus:border-[#e8863a] resize-none"
                    rows={3}
                    placeholder="O que precisa ser feito?"
                  />
                </div>
                <div>
                  <label className="text-[#707070] text-xs uppercase tracking-widest block mb-1">Tipo</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {(Object.keys(questTypeLabels) as QuestType[]).map(type => (
                      <button
                        key={type}
                        onClick={() => setNewQuestType(type)}
                        className={`text-xs px-3 py-1.5 rounded-full border ${newQuestType === type ? 'bg-[#e8863a] text-black border-[#e8863a]' : 'border-[#252525] text-[#707070]'}`}
                      >
                        {questTypeLabels[type]}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[#707070] text-xs uppercase tracking-widest block mb-1">Evidência necessária</label>
                  <input
                    value={newQuestEvidence}
                    onChange={e => setNewQuestEvidence(e.target.value)}
                    className="w-full bg-[#0d0d0d] border border-[#252525] rounded-lg p-3 text-sm text-[#f0f0f0] outline-none focus:border-[#e8863a]"
                    placeholder="Como você saberá que concluiu?"
                  />
                </div>
                <button
                  onClick={handleCreateQuestManual}
                  disabled={!newQuestTitle.trim()}
                  className="w-full bg-[#e8863a] text-black font-semibold py-3 rounded-xl text-sm disabled:opacity-40"
                >
                  Criar quest
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import EvidenceCard from '@/components/EvidenceCard';
import { Evidence } from '@/lib/types';

type FilterType = 'all' | 'quest' | 'impulse' | 'frustration_block' | 'boss_fight' | 'manual';

const FILTER_LABELS: Record<FilterType, string> = {
  all: 'Todas',
  quest: 'Quest',
  impulse: 'Impulso',
  frustration_block: 'Bloco',
  boss_fight: 'Boss',
  manual: 'Manual',
};

export default function EvidenciasPage() {
  const [state, setState] = useAppStore();
  const [filter, setFilter] = useState<FilterType>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const filtered = state.evidences.filter(e => filter === 'all' || e.source === filter);

  function handleAdd() {
    if (!title.trim()) return;
    const ev: Evidence = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      type: 'manual',
      skillIds: [],
      xp: 10,
      source: 'manual',
      createdAt: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      evidences: [ev, ...prev.evidences],
      totalXp: prev.totalXp + 10,
    }));
    setTitle('');
    setDescription('');
    setShowAddModal(false);
  }

  return (
    <div className="p-4 space-y-4">
      <div className="pt-2">
        <h1 className="text-[#f0f0f0] text-xl font-bold">Evidências</h1>
        <p className="text-[#707070] text-xs mt-0.5">Aqui fica o lastro da sua identidade.</p>
      </div>

      {/* Filter chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {(Object.keys(FILTER_LABELS) as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-full border transition-colors ${filter === f ? 'bg-[#e8863a] text-black border-[#e8863a]' : 'border-[#252525] text-[#707070]'}`}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Add manual evidence */}
      <button
        onClick={() => setShowAddModal(true)}
        className="w-full border border-[#252525] text-[#707070] text-sm py-3 rounded-xl"
      >
        + Adicionar evidência manual
      </button>

      {/* Evidence list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#444444] text-sm">Nenhuma evidência ainda.</p>
          <p className="text-[#444444] text-xs mt-1">Intenção não conta. Gere a primeira.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(ev => (
            <EvidenceCard key={ev.id} evidence={ev} />
          ))}
        </div>
      )}

      {/* Add modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end" onClick={() => setShowAddModal(false)}>
          <div className="bg-[#161616] rounded-t-2xl w-full max-w-[480px] mx-auto p-4 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-[#f0f0f0] font-bold">Evidência manual</h2>
              <button onClick={() => setShowAddModal(false)} className="text-[#707070]">✕</button>
            </div>
            <div>
              <label className="text-[#707070] text-xs uppercase tracking-widest block mb-1">Título *</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-[#252525] rounded-lg p-3 text-sm text-[#f0f0f0] outline-none focus:border-[#e8863a]"
                placeholder="O que você fez?"
              />
            </div>
            <div>
              <label className="text-[#707070] text-xs uppercase tracking-widest block mb-1">Descrição</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-[#252525] rounded-lg p-3 text-sm text-[#f0f0f0] outline-none focus:border-[#e8863a] resize-none"
                rows={3}
                placeholder="Detalhe o que foi evidenciado..."
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={!title.trim()}
              className="w-full bg-[#e8863a] text-black font-semibold py-3 rounded-xl text-sm disabled:opacity-40"
            >
              Registrar evidência
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

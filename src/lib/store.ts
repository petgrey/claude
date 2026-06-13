'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppState, SkillId, Skill } from './types';
import { getLevelFromXp } from './xp';

export const IMPULSE_TRADEOFFS: Record<string, string> = {
  fuga: 'Você está trocando execução real por alívio temporário.',
  ansiedade: 'Você está trocando presença e maturidade por urgência.',
  overplanning: 'Você está trocando execução real por sensação de controle.',
  validacao: 'Você está trocando postura por alívio temporário.',
  dopamina: 'Você está trocando poder futuro por prazer barato agora.',
  rejeicao: 'Você está trocando dignidade por garantia emocional imediata.',
  procrastinacao: 'Você está trocando lastro real por conforto presente.',
  irritacao: 'Você está trocando equilíbrio por reação impulsiva.',
  pressa: 'Você está trocando paciência ativa por urgência ansiosa.',
  autossabotagem: 'Você está trocando vitória por familiaridade com a derrota.',
};

const defaultSkills: Record<SkillId, Skill> = {
  visao_futuro: { id: 'visao_futuro', name: 'Visão de Futuro', description: 'Capacidade de enxergar a consequência futura da ação paciente quando o presente parece mais convincente.', xp: 0, level: 1 },
  contencao_emocional: { id: 'contencao_emocional', name: 'Contenção Emocional', description: 'Capacidade de não agir no pico da ansiedade, da pressa ou da frustração.', xp: 0, level: 1 },
  execucao_friccao: { id: 'execucao_friccao', name: 'Execução sob Fricção', description: 'Capacidade de agir sem vontade, sem clareza perfeita e sem recompensa imediata.', xp: 0, level: 1 },
  resistencia_rejeicao: { id: 'resistencia_rejeicao', name: 'Resistência à Rejeição', description: 'Capacidade de sustentar silêncio, demora, negativa ou incerteza sem perder postura.', xp: 0, level: 1 },
  antioverplanning: { id: 'antioverplanning', name: 'Antioverplanning', description: 'Capacidade de não usar planejamento, refinamento ou estratégia como fuga da execução.', xp: 0, level: 1 },
  dopamina_criteriosa: { id: 'dopamina_criteriosa', name: 'Dopamina Criteriosa', description: 'Capacidade de usar recompensa como consequência da evidência, não como pré-requisito da ação.', xp: 0, level: 1 },
};

export function initState(): AppState {
  return {
    skills: defaultSkills,
    quests: [],
    impulses: [],
    evidences: [],
    frustrationBlocks: [],
    bossFights: [],
    dailySummaries: [],
    lastActiveDate: new Date().toISOString().split('T')[0],
    totalXp: 0,
    streak: 0,
  };
}

const STORAGE_KEY = 'forja_criterioso_state';

export function loadState(): AppState {
  if (typeof window === 'undefined') return initState();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return initState();
    const parsed = JSON.parse(stored) as AppState;
    return {
      ...initState(),
      ...parsed,
      skills: { ...defaultSkills, ...parsed.skills },
    };
  } catch {
    return initState();
  }
}

export function saveState(state: AppState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // silently fail
  }
}

export function addXpToSkill(state: AppState, skillId: SkillId, amount: number): AppState {
  const skill = state.skills[skillId];
  if (!skill) return state;
  const newXp = skill.xp + amount;
  const newLevel = getLevelFromXp(newXp);
  return {
    ...state,
    skills: {
      ...state.skills,
      [skillId]: { ...skill, xp: newXp, level: newLevel },
    },
  };
}

export function useAppStore(): [AppState, (updater: (prev: AppState) => AppState) => void] {
  const [state, setStateInternal] = useState<AppState>(initState);

  useEffect(() => {
    setStateInternal(loadState());
  }, []);

  const setState = useCallback((updater: (prev: AppState) => AppState) => {
    setStateInternal(prev => {
      const next = updater(prev);
      saveState(next);
      return next;
    });
  }, []);

  return [state, setState];
}

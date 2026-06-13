export type SkillId = 'visao_futuro' | 'contencao_emocional' | 'execucao_friccao' | 'resistencia_rejeicao' | 'antioverplanning' | 'dopamina_criteriosa';

export interface Skill {
  id: SkillId;
  name: string;
  description: string;
  xp: number;
  level: number;
}

export type QuestType = 'execucao' | 'contencao' | 'antioverplanning' | 'relacionamento' | 'dopamina';
export type QuestStatus = 'pending' | 'in_progress' | 'completed' | 'abandoned';

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  skillIds: SkillId[];
  xpReward: number;
  evidenceRequired: string;
  status: QuestStatus;
  createdAt: string;
  completedAt?: string;
}

export type ImpulseType = 'fuga' | 'ansiedade' | 'overplanning' | 'validacao' | 'dopamina' | 'rejeicao' | 'procrastinacao' | 'irritacao' | 'pressa' | 'autossabotagem';
export type ImpulseResult = 'contained' | 'partial' | 'obeyed';

export interface ImpulseLog {
  id: string;
  type: ImpulseType;
  intensity: number;
  chosenAction: string;
  result: ImpulseResult;
  tradeoff: string;
  xpReward: number;
  createdAt: string;
}

export interface Evidence {
  id: string;
  title: string;
  description: string;
  type: string;
  skillIds: SkillId[];
  xp: number;
  source: 'quest' | 'impulse' | 'frustration_block' | 'boss_fight' | 'manual';
  createdAt: string;
}

export interface FrustrationBlock {
  id: string;
  task: string;
  avoidanceReason: string;
  evidenceMinimum: string;
  futureBought: string;
  durationMinutes: number;
  completed: boolean;
  evidenceGenerated: boolean;
  discomfortLevel: number;
  xpReward: number;
  createdAt: string;
}

export interface BossFight {
  id: string;
  bossId: string;
  completedAt: string;
  xpReward: number;
}

export interface DailySummary {
  date: string;
  xpGained: number;
  questsCompleted: number;
  impulsesLogged: number;
  impulsesContained: number;
  evidencesGenerated: number;
  strongestSkill: SkillId | null;
  mainEscapePattern: ImpulseType | null;
  closingNote: string;
  closed: boolean;
}

export interface AppState {
  skills: Record<SkillId, Skill>;
  quests: Quest[];
  impulses: ImpulseLog[];
  evidences: Evidence[];
  frustrationBlocks: FrustrationBlock[];
  bossFights: BossFight[];
  dailySummaries: DailySummary[];
  lastActiveDate: string;
  totalXp: number;
  streak: number;
}

import { SkillId, Skill } from './types';

const XP_THRESHOLDS = [0, 100, 250, 500, 900, 1400, 2000, 2800, 3800, 5000];

export function getLevelFromXp(xp: number): number {
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= XP_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function getXpForLevel(level: number): number {
  if (level < 1) return 0;
  if (level > XP_THRESHOLDS.length) return XP_THRESHOLDS[XP_THRESHOLDS.length - 1];
  return XP_THRESHOLDS[level - 1];
}

export function getXpToNextLevel(xp: number): number {
  const level = getLevelFromXp(xp);
  if (level >= XP_THRESHOLDS.length) return 0;
  return XP_THRESHOLDS[level] - xp;
}

export function getProgressPercent(xp: number): number {
  const level = getLevelFromXp(xp);
  if (level >= XP_THRESHOLDS.length) return 100;
  const currentLevelXp = XP_THRESHOLDS[level - 1];
  const nextLevelXp = XP_THRESHOLDS[level];
  return Math.round(((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100);
}

export function getCriteriosaLevel(skills: Record<SkillId, Skill>): number {
  const levels = Object.values(skills).map(s => s.level);
  const avg = levels.reduce((a, b) => a + b, 0) / levels.length;
  return Math.floor(avg);
}

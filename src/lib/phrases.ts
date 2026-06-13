export const PHRASES = [
  "Evidência antes de alívio.",
  "Planejamento sem entrega é fuga sofisticada.",
  "O presente parece certo porque está perto.",
  "Nem tudo que alivia resolve.",
  "O futuro precisa estar visível antes do impulso decidir.",
  "Você não precisa resolver agora o desconforto que consegue sustentar.",
  "O Criterioso não negocia com impulso barato.",
  "Ação paciente compra poder futuro.",
  "Desejo não precisa virar pressão.",
  "Clareza sem execução é entretenimento mental.",
  "O estado emocional do dia não pode governar a missão.",
  "Primeiro lastro, depois ajuste.",
  "A fricção é o treino.",
  "Você não precisa estar pronto. Precisa permanecer.",
  "O impulso pede urgência. O critério pede evidência.",
  "Menos interpretação. Mais contenção.",
  "A recompensa vem depois da prova.",
  "Não acelere para aliviar ansiedade.",
  "O futuro é construído quando o presente para de mandar sozinho.",
  "Intenção não conta. Evidência conta."
];

export function getDailyPhrase(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return PHRASES[dayOfYear % PHRASES.length];
}

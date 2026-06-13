import { SkillId } from './types';

export interface BossDefinition {
  id: string;
  name: string;
  description: string;
  signs: string[];
  quest: string;
  skills: SkillId[];
  xp: Record<string, number>;
}

export const BOSSES: BossDefinition[] = [
  {
    id: 'planejador_infinito',
    name: 'O Planejador Infinito',
    description: 'Aparece quando você quer reorganizar tudo antes de executar qualquer coisa.',
    signs: ['Vontade de revisar estratégia', 'Vontade de abrir IA', 'Sensação de que só falta clareza', 'Necessidade de recomeçar o plano', 'Mudar ferramenta'],
    quest: 'Gerar uma evidência antes de qualquer replanejamento.',
    skills: ['antioverplanning', 'execucao_friccao'] as SkillId[],
    xp: { antioverplanning: 50, execucao_friccao: 30 }
  },
  {
    id: 'buscador_alivio',
    name: 'O Buscador de Alívio',
    description: 'Aparece quando você quer dopamina antes de cumprir o necessário.',
    signs: ['Vontade de abrir rede social', 'Negociar recompensa antes da entrega', 'Procurar prazer para conseguir começar'],
    quest: 'Concluir 25 minutos de execução antes de qualquer recompensa.',
    skills: ['dopamina_criteriosa', 'execucao_friccao'] as SkillId[],
    xp: { dopamina_criteriosa: 50, execucao_friccao: 20 }
  },
  {
    id: 'acelerador_ansioso',
    name: 'O Acelerador Ansioso',
    description: 'Aparece quando você tenta apressar resposta, proximidade, resultado ou validação.',
    signs: ['Vontade de cobrar', 'Vontade de testar interesse', 'Vontade de acelerar intimidade', 'Sensação de urgência relacional'],
    quest: 'Esperar 10 minutos, registrar o impulso e agir sem pressão.',
    skills: ['contencao_emocional', 'resistencia_rejeicao'] as SkillId[],
    xp: { contencao_emocional: 40, resistencia_rejeicao: 40 }
  },
  {
    id: 'fugitivo_friccao',
    name: 'O Fugitivo da Fricção',
    description: 'Aparece quando uma tarefa importante começa a parecer pesada, chata ou nebulosa.',
    signs: ['Sonolência repentina', 'Vontade de mudar de tarefa', 'Vontade de pesquisar mais', 'Sensação de incapacidade'],
    quest: 'Executar a menor próxima ação por 25 minutos.',
    skills: ['execucao_friccao', 'visao_futuro'] as SkillId[],
    xp: { execucao_friccao: 60, visao_futuro: 20 }
  },
  {
    id: 'negociador_interno',
    name: 'O Negociador Interno',
    description: 'Aparece quando você começa a justificar a quebra de compromisso.',
    signs: ['"Só hoje não"', '"Amanhã eu compenso"', '"Não estou no melhor estado"', '"Preciso pensar melhor"'],
    quest: 'Cumprir a versão mínima do compromisso.',
    skills: ['contencao_emocional', 'visao_futuro'] as SkillId[],
    xp: { contencao_emocional: 40, visao_futuro: 40 }
  }
];

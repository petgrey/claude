import { QuestType, SkillId } from './types';

export interface QuestTemplate {
  title: string;
  description: string;
  type: QuestType;
  skillIds: SkillId[];
  xpReward: number;
  evidenceRequired: string;
}

export const DEFAULT_QUESTS: Record<QuestType, QuestTemplate[]> = {
  execucao: [
    { title: 'Bloco de execução sem IA', description: 'Execute uma tarefa importante por 25 minutos sem abrir ferramentas de IA.', type: 'execucao', skillIds: ['execucao_friccao', 'antioverplanning'], xpReward: 40, evidenceRequired: 'Descreva o que foi produzido no bloco.' },
    { title: 'Entrega sem revisão infinita', description: 'Finalize e entregue algo sem revisionar mais de uma vez.', type: 'execucao', skillIds: ['execucao_friccao', 'antioverplanning'], xpReward: 35, evidenceRequired: 'O que foi entregue e para quem?' },
    { title: 'Primeira ação antes de planejar', description: 'Execute a menor próxima ação ANTES de organizar qualquer planejamento.', type: 'execucao', skillIds: ['execucao_friccao', 'antioverplanning'], xpReward: 30, evidenceRequired: 'Qual foi a ação executada?' },
    { title: 'Tarefa pesada sem negociação', description: 'Execute a tarefa que você mais está evitando esta semana.', type: 'execucao', skillIds: ['execucao_friccao', 'visao_futuro'], xpReward: 50, evidenceRequired: 'O que foi feito e o que ficou para trás?' },
    { title: 'Execução sem estado ideal', description: 'Execute mesmo sem se sentir no estado ideal para isso.', type: 'execucao', skillIds: ['execucao_friccao', 'contencao_emocional'], xpReward: 35, evidenceRequired: 'Descreva o que foi produzido apesar do estado.' }
  ],
  contencao: [
    { title: 'Não responder no pico', description: 'Aguardar 10 minutos antes de responder quando sentir urgência relacional.', type: 'contencao', skillIds: ['contencao_emocional', 'resistencia_rejeicao'], xpReward: 30, evidenceRequired: 'Qual era o impulso e quanto você esperou?' },
    { title: 'Silêncio ativo', description: 'Sustentar o silêncio em uma conversa importante sem quebrar por ansiedade.', type: 'contencao', skillIds: ['resistencia_rejeicao', 'contencao_emocional'], xpReward: 40, evidenceRequired: 'Descreva o contexto e como você sustentou.' },
    { title: 'Não cobrar resultado antecipado', description: 'Não cobrar feedback, confirmação ou resultado antes do prazo natural.', type: 'contencao', skillIds: ['resistencia_rejeicao', 'contencao_emocional'], xpReward: 35, evidenceRequired: 'O que você não cobrou e por qual período?' },
    { title: 'Conter irritação verbal', description: 'Não expressar irritação no momento do pico emocional.', type: 'contencao', skillIds: ['contencao_emocional'], xpReward: 30, evidenceRequired: 'O que aconteceu e como você reagiu?' },
    { title: 'Aguardar resposta sem checar', description: 'Não checar mensagem ou e-mail repetidamente após enviar.', type: 'contencao', skillIds: ['resistencia_rejeicao', 'dopamina_criteriosa'], xpReward: 25, evidenceRequired: 'Por quanto tempo você aguardou sem checar?' }
  ],
  antioverplanning: [
    { title: 'Zero replanejamento hoje', description: 'Não reabrir ou reorganizar seu sistema de planejamento pelo dia inteiro.', type: 'antioverplanning', skillIds: ['antioverplanning', 'execucao_friccao'], xpReward: 40, evidenceRequired: 'O que foi executado sem replanejamento?' },
    { title: 'Decidir em 2 minutos', description: 'Tomar uma decisão de baixo risco em menos de 2 minutos, sem pesquisa adicional.', type: 'antioverplanning', skillIds: ['antioverplanning'], xpReward: 25, evidenceRequired: 'Qual foi a decisão e em quanto tempo foi tomada?' },
    { title: 'Executar com plano imperfeito', description: 'Iniciar uma tarefa com um plano de 3 linhas, sem detalhar mais.', type: 'antioverplanning', skillIds: ['antioverplanning', 'execucao_friccao'], xpReward: 30, evidenceRequired: 'Qual era o plano e o que foi executado?' },
    { title: 'Não mudar ferramenta', description: 'Trabalhar com a ferramenta atual o dia todo, sem migrar para nova opção.', type: 'antioverplanning', skillIds: ['antioverplanning'], xpReward: 20, evidenceRequired: 'Com qual ferramenta você trabalhou?' },
    { title: 'Fechar loop aberto', description: 'Finalizar uma tarefa iniciada há mais de 3 dias sem reabrir o contexto completo.', type: 'antioverplanning', skillIds: ['antioverplanning', 'execucao_friccao'], xpReward: 45, evidenceRequired: 'O que foi finalizado e quando havia sido iniciado?' }
  ],
  relacionamento: [
    { title: 'Presença sem agenda', description: 'Estar presente em uma interação sem tentar obter algo ou resolver algo.', type: 'relacionamento', skillIds: ['contencao_emocional', 'resistencia_rejeicao'], xpReward: 30, evidenceRequired: 'Com quem foi e o que você observou?' },
    { title: 'Ouvir sem interromper', description: 'Ouvir alguém falar por pelo menos 3 minutos sem interromper ou dar opinião.', type: 'relacionamento', skillIds: ['contencao_emocional'], xpReward: 25, evidenceRequired: 'O que você ouviu e o que conteve?' },
    { title: 'Não buscar validação', description: 'Não compartilhar conquista ou ideia buscando aprovação pelo dia todo.', type: 'relacionamento', skillIds: ['resistencia_rejeicao', 'dopamina_criteriosa'], xpReward: 35, evidenceRequired: 'O que você deixou de compartilhar e por quê?' },
    { title: 'Aceitar não sem argumentar', description: 'Receber uma negativa ou decepção sem tentar reverter imediatamente.', type: 'relacionamento', skillIds: ['resistencia_rejeicao', 'contencao_emocional'], xpReward: 40, evidenceRequired: 'Qual foi a negativa e como você respondeu?' },
    { title: 'Tempo de qualidade sem tela', description: 'Passar 1 hora com alguém importante sem usar o celular.', type: 'relacionamento', skillIds: ['dopamina_criteriosa', 'contencao_emocional'], xpReward: 30, evidenceRequired: 'Com quem foi e o que foi diferente?' }
  ],
  dopamina: [
    { title: 'Recompensa somente pós-entrega', description: 'Não acessar redes sociais, jogos ou entretenimento antes de concluir a tarefa principal do dia.', type: 'dopamina', skillIds: ['dopamina_criteriosa', 'execucao_friccao'], xpReward: 40, evidenceRequired: 'O que foi entregue antes da recompensa?' },
    { title: 'Sem dopamina matinal fácil', description: 'Não checar redes sociais nas primeiras 2 horas do dia.', type: 'dopamina', skillIds: ['dopamina_criteriosa'], xpReward: 30, evidenceRequired: 'O que você fez nas primeiras 2 horas?' },
    { title: 'Janela de dopamina definida', description: 'Definir um horário específico para redes sociais e cumprir apenas nesse horário.', type: 'dopamina', skillIds: ['dopamina_criteriosa', 'antioverplanning'], xpReward: 35, evidenceRequired: 'Qual foi o horário e você cumpriu?' },
    { title: 'Prazer adiado', description: 'Adiar uma recompensa desejada por pelo menos 4 horas após a vontade aparecer.', type: 'dopamina', skillIds: ['dopamina_criteriosa', 'contencao_emocional'], xpReward: 30, evidenceRequired: 'Qual era o desejo e quanto você adiou?' },
    { title: 'Entretenimento como consequência', description: 'Só assistir/jogar após gerar evidência documentada de trabalho real.', type: 'dopamina', skillIds: ['dopamina_criteriosa', 'execucao_friccao'], xpReward: 35, evidenceRequired: 'Qual foi a evidência gerada antes do entretenimento?' }
  ]
};

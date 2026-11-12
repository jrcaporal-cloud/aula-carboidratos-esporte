import type { CastId } from '../kit/cast';
import type { RoleId } from './roles.content';

/**
 * Slide 14 · O Mapa da Aula (CourseMapSim). O que cada ato acrescenta ao mapa, na ordem de data/chapters.ts:
 * os papéis (Combustível, Sinal, Escolha) que ele acende, três estações (títulos de slides do ROTEIRO)
 * e os personagens fictícios que voltam nele (conferido no ROTEIRO).
 */
export interface ActPlan {
    roles: readonly RoleId[];
    stations: readonly string[];
    cast: readonly CastId[];
}

const ALL: readonly CastId[] = ['marina', 'diego', 'lara', 'tiago', 'paulo'];

export const ACT_PLAN: readonly ActPlan[] = [
    { roles: ['fuel', 'signal', 'choice'], stations: ['O Km 32', 'Três Papéis de uma Molécula', 'O Que a Turma Já Acha'], cast: ALL },
    { roles: ['fuel', 'choice'], stations: ['Da Glicose ao Amido', 'Duas Pistas no Intestino', 'Índice Glicêmico: o Que Ele Mede'], cast: [] },
    { roles: ['fuel'], stations: ['A Escada da Glicólise', 'O Cruzamento', 'Boston, 1923'], cast: [] },
    { roles: ['fuel', 'signal'], stations: ['Três Dietas, Nove Estudantes', 'O Muro em Números', 'O Glicogênio Também Fala'], cast: ['marina'] },
    { roles: ['fuel', 'choice'], stations: ['A Dieta Escandinava', 'A Refeição de 3–4 Horas', 'Marina, Três Dias Antes'], cast: ['marina'] },
    { roles: ['fuel', 'signal', 'choice'], stations: ['A Curva de Smith', 'O Intestino Treina', 'O Bochecho'], cast: ['diego'] },
    { roles: ['fuel', 'choice'], stations: ['A Janela que Fecha Devagar', '24 Horas: o Total Manda', 'Lara, Jogo a Cada 72 Horas'], cast: ['lara'] },
    { roles: ['signal', 'choice'], stations: ['A Perna que Treinou com Fome', 'Sleep Low: o Ganho que Sumiu', 'Projeto Supernova'], cast: [] },
    { roles: ['fuel', 'choice'], stations: ['47% das Fibras', 'Paulo e o Carbo Pós-Treino', 'A Balança e a Água'], cast: ['paulo', 'tiago'] },
    { roles: ['choice'], stations: ['O Desenho Decide o Efeito', 'Mito ou Verdade?', 'Cinco Atletas, Cinco Planos'], cast: ALL },
];

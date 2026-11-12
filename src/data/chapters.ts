import { C } from '../components/sims/kit/palette';

/** Ícone do ato (nome de um ícone do lucide-react). */
export type ChapterIcon =
    | 'flag' | 'atom' | 'cog' | 'battery' | 'utensils' | 'timer' | 'rotate-ccw' | 'battery-low' | 'trophy' | 'microscope';

/** Um ato da aula: número romano, título, pergunta que a cortina mostra, ícone e cor. */
export interface Chapter {
    roman: string;
    title: string;
    question: string;
    icon: ChapterIcon;
    color: string;
}

/**
 * Os 10 atos de "Carboidratos no Esporte" (fio: Combustível, Sinal e Escolha), na ordem do roteiro.
 * A seção de cada slide no JSON começa com "Ato <romano> · …" e é assim que o deck acha o ato.
 * A cor de cada ato é a do papel que ele conta (VI e VII repetem o tom da prova e da recuperação em variantes).
 */
export const CHAPTERS: readonly Chapter[] = [
    { roman: 'I', title: 'A Largada', question: 'O que acabou no km 32?', icon: 'flag', color: C.glucose },
    { roman: 'II', title: 'A Molécula', question: 'A mesma glicose, montada de jeitos diferentes, chega ao sangue na mesma velocidade?', icon: 'atom', color: C.fructose },
    { roman: 'III', title: 'O Motor', question: 'Quem escolhe o combustível: a dieta, o treino ou a intensidade?', icon: 'cog', color: C.lactate },
    { roman: 'IV', title: 'O Tanque', question: 'Quanto glicogênio cabe, onde ele fica e o que acontece quando acaba?', icon: 'battery', color: C.glycogen },
    { roman: 'V', title: 'Antes da Largada', question: 'Encher o tanque precisa de uma semana, ou de um dia?', icon: 'utensils', color: C.insulin },
    { roman: 'VI', title: 'Durante a Prova', question: 'Quanto carboidrato por hora o intestino deixa passar?', icon: 'timer', color: C.glucoseSoft },
    { roman: 'VII', title: 'Depois da Chegada', question: 'A janela fecha mesmo, ou só para quem treina de novo cedo?', icon: 'rotate-ccw', color: C.ok },
    { roman: 'VIII', title: 'Treinar com Pouco', question: 'O sinal no músculo vira tempo no cronômetro?', icon: 'battery-low', color: C.fat },
    { roman: 'IX', title: 'Cada Esporte, um Tanque', question: 'O futebolista, o judoca e quem treina força precisam do mesmo carboidrato?', icon: 'trophy', color: C.protein },
    { roman: 'X', title: 'Ler, Medir e Decidir', question: 'Como saber se o efeito é do carboidrato, do placebo ou do desenho do estudo?', icon: 'microscope', color: C.stone },
];

import { BatteryLow, Gauge, ScanSearch, Timer, Utensils, Wrench, type LucideIcon } from 'lucide-react';
import { C } from '../kit/palette';

/**
 * Slide 191 · O Que Levar para a Segunda-feira. Seis mensagens, cada uma presa ao número que a sustenta (já visto na
 * aula), com a unidade, o que o número é, o que fazer com ele e o slide de origem (citado pelo título, nunca pelo número).
 * Fontes: Scott 2012, Smyth 2021, Burke 2011, Parkin 1997, Impey 2018, Jeukendrup 1996 (dossiês 01, 02, 03, 04, 05, 07).
 */
export interface Takeaway {
    /** Passo (aba) em que a mensagem entra; cada passo enche uma coluna. */
    at: number;
    icon: LucideIcon;
    number: string;
    message: string;
    /** O que o número é. */
    what: string;
    /** O que fazer com ele na segunda-feira. */
    action: string;
    source: string;
    /** Título do slide de origem. */
    origin: string;
    color: string;
}

export const TAKEAWAY_TABS = ['O combustível', 'O prato', 'A leitura'] as const;

export const TAKEAWAYS: readonly Takeaway[] = [
    {
        at: 0, icon: Gauge, number: '21,1 × 19,6 kJ/L', message: 'A intensidade escolhe o combustível.',
        what: 'energia por litro de O₂: carboidrato × gordura',
        action: 'Sessão intensa pede carboidrato disponível: rende mais por litro de O₂.',
        source: 'Scott 2012', origin: 'O Preço do Oxigênio', color: C.glucose,
    },
    {
        at: 0, icon: BatteryLow, number: '28% × 17%', message: 'Tanque vazio perde a prova.',
        what: 'homens × mulheres que bateram no muro (> 4 milhões de registros)',
        action: 'Na maratona, ritmo de saída e carboidrato entram juntos no plano.',
        source: 'Smyth 2021', origin: 'O Muro em Números', color: C.glycogenSoft,
    },
    {
        at: 1, icon: Timer, number: '30–60 · 90 g/h', message: 'Durante: gramas por hora.',
        what: '1 a 2,5 h × acima de 2,5 h, com glicose + frutose',
        action: 'Converta em gel e garrafa por hora: g/h, não g/kg nem % da energia.',
        source: 'Burke 2011', origin: 'O Relógio da Prova', color: C.glucoseSoft,
    },
    {
        at: 1, icon: Utensils, number: '8 e 24 h', message: 'Recuperação longa: o total manda.',
        what: 'horário da refeição sem diferença no glicogênio',
        action: 'Pressa só quando o intervalo é curto; fora disso, feche o total das 24 h.',
        source: 'Parkin 1997', origin: 'A Janela que Fecha Devagar', color: C.ok,
    },
    {
        at: 2, icon: Wrench, number: '73% × 37%', message: 'Treino com pouco é ferramenta.',
        what: 'estudos com sinal no músculo × com ganho de desempenho',
        action: 'Em sessões escolhidas; sessão-chave e prova com o tanque cheio.',
        source: 'Impey 2018', origin: 'Do Músculo ao Cronômetro', color: C.caveat,
    },
    {
        at: 2, icon: ScanSearch, number: 'CV 26,6% × 3,35%', message: 'Leia o desenho antes do efeito.',
        what: 'ruído do tempo até a exaustão × do contrarrelógio',
        action: 'Antes do número: cego? em jejum? TTE ou contrarrelógio? placebo de quê?',
        source: 'Jeukendrup 1996', origin: 'O Desenho Decide o Efeito', color: C.stone,
    },
];

/* Tipos comuns dos modais 3D da aula (etapas, câmera, rótulos, relógio da etapa). */

export type Vec3 = readonly [number, number, number];

/** Pose da câmera: posição e alvo da órbita. */
export interface Pose { pos: Vec3; tgt: Vec3 }

/** Selos de honestidade que uma etapa pode exibir (os mesmos do kit 2D). */
export type StepChip =
    | { kind: 'illustrative' }
    | { kind: 'calc'; text: string }
    | { kind: 'animal'; text?: string }
    | { kind: 'design'; text: string }
    | { kind: 'model'; text: string };

/** Rótulo HTML ancorado num ponto da cena; dx/dy deslocam a caixa (px) e a linha-guia liga os dois. */
export interface StepLabel {
    id: string;
    text: string;
    sub?: string;
    color: string;
    at: Vec3;
    dx: number;
    dy: number;
    /** Espera (s) depois do pouso da câmera: para rótulos do que só existe no fim da animação. */
    delay?: number;
}

export interface StepInfo {
    badge: string;
    title: string;
    /** Nome curto na trilha de etapas (≤ 12 caracteres). */
    short: string;
    /** Texto da etapa: ≤ 35 palavras. */
    text: string;
    chips?: readonly StepChip[];
    sources: readonly string[];
    pose: Pose;
    labels: readonly StepLabel[];
    /** Duração (s) da animação da etapa depois que a câmera pousa. */
    anim: number;
}

import type { StepClock } from './clock';

/** O relógio da etapa (instância única por modal, lida pela cena a cada quadro). */
export type ClockRef = StepClock;

/** O que o modal entrega à cena e aos painéis do modelo. */
export interface ShellState {
    step: number;
    settled: boolean;
    reduced: boolean;
    clock: ClockRef;
}

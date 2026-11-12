import type { ReactNode } from 'react';
import { C } from './palette';
import { Chip } from './ui';

/**
 * Selos de honestidade da aula, com texto fixo: a turma aprende a ler cada um uma vez.
 * Use sempre estes (não escreva o selo à mão) para o mesmo aviso ter a mesma cara em todos os slides.
 */
export const FictionChip = () => <Chip color={C.caveat}>caso fictício</Chip>;
export const FictionsChip = () => <Chip color={C.caveat}>casos fictícios</Chip>;
export const IllustrativeChip = () => <Chip color={C.caveat}>valores ilustrativos</Chip>;
export const CalcChip = ({ children = 'cálculo' }: { children?: ReactNode }) => <Chip color={C.caveat}>{children}</Chip>;
export const AnimalChip = ({ children = 'dado em animal' }: { children?: ReactNode }) => <Chip color={C.stone}>{children}</Chip>;
export const ViaReviewChip = ({ children = 'via revisão' }: { children?: ReactNode }) => <Chip color={C.stone}>{children}</Chip>;
export const IndustryChip = () => <Chip color={C.stone}>financiado pela indústria</Chip>;

/** Desenho do estudo em uma linha (ex.: "ECR cruzado · n = 9 · cego"). Neutro: descreve, não julga. */
export const DesignChip = ({ children }: { children: ReactNode }) => <Chip color={C.co2}>{children}</Chip>;

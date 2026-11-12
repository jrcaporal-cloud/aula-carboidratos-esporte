import { describe, expect, it } from 'vitest';
import parsed from '../../data/parsedPresentation.json';
import { CHAPTERS } from '../../data/chapters';
import { ROMANS, actOfSection, chapterOfSection, curtainForCrossing } from './acts';

const SECTIONS = (parsed as unknown as { sectionName: string }[]).map(s => s.sectionName);

describe('atos da aula', () => {
    it('lê o ato da seção de todos os slides', () => {
        for (const s of SECTIONS) expect(actOfSection(s), s).toBeGreaterThanOrEqual(0);
    });

    it('converte o romano da seção no índice do ato', () => {
        expect(actOfSection('Ato I · Abertura')).toBe(0);
        expect(actOfSection('Ato III · Glicogênio')).toBe(2);
        expect(actOfSection('Ato VIII · Fecho')).toBe(7);
        expect(actOfSection('Capa')).toBe(-1);
        expect(actOfSection('Ato XX · Não existe')).toBe(-1);
        expect(actOfSection('Atos II e III')).toBe(-1);
    });

    it('cada ato tem romano, título e cor', () => {
        expect(ROMANS).toHaveLength(CHAPTERS.length);
        expect(new Set(CHAPTERS.map(c => c.color)).size).toBe(CHAPTERS.length);
        for (const c of CHAPTERS) {
            expect(c.title.length).toBeGreaterThan(0);
            expect(c.color).toMatch(/^#[0-9A-F]{6}$/i);
        }
        expect(chapterOfSection('Ato II · X')).toBe(CHAPTERS[1]);
        expect(chapterOfSection('Capa')).toBeUndefined();
    });

    it('a cortina só toca ao avançar para um ato posterior', () => {
        expect(curtainForCrossing('Ato II · A', 'Ato II · B')).toBeNull();
        expect(curtainForCrossing('Ato III · A', 'Ato II · B')).toBeNull();
        expect(curtainForCrossing('Ato II · A', 'Capa')).toBeNull();
        expect(curtainForCrossing('Ato II · A', 'Ato III · B')).toBe(CHAPTERS[2]);
        expect(curtainForCrossing('Ato I · A', 'Ato IV · B')).toBe(CHAPTERS[3]);
        expect(curtainForCrossing('Capa', 'Ato I · A')).toBe(CHAPTERS[0]);
    });
});

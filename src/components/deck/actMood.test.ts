import { describe, expect, it } from 'vitest';
import parsed from '../../data/parsedPresentation.json';
import { CHAPTERS } from '../../data/chapters';
import { ACT_MOODS, BASE_MOOD, SLIDE_MOODS, moodFor } from './actMood';

const SLIDES = (parsed as unknown as { id: number; sectionName: string }[]);

describe('clima do fundo por ato', () => {
    it('tem um clima para cada ato e para cada slide da aula', () => {
        expect(ACT_MOODS).toHaveLength(CHAPTERS.length);
        for (const s of SLIDES) {
            const m = moodFor(s.id, s.sectionName);
            expect(m.rings, `slide ${s.id}`).toBeGreaterThan(0);
            expect(m.rings).toBeLessThanOrEqual(1);
            expect(m.sparks).toBeGreaterThanOrEqual(0);
            expect(m.sparks).toBeLessThanOrEqual(1);
            expect(m.opacity).toBeLessThanOrEqual(1);
        }
    });

    it('cada ato usa a cor do seu capítulo', () => {
        ACT_MOODS.forEach((m, i) => expect(m.ringColor).toBe(CHAPTERS[i].color));
        for (const m of ACT_MOODS) expect(m.ringGlow).toMatch(/^#[0-9a-f]{6}$/);
    });

    it('slides com clima próprio existem na aula e vencem o do ato', () => {
        const ids = new Set(SLIDES.map(s => s.id));
        for (const id of SLIDE_MOODS.keys()) expect(ids.has(id), `slide ${id}`).toBe(true);
        expect(moodFor(0, 'Ato I · Abertura')).toBe(SLIDE_MOODS.get(0));
        expect(moodFor(12345, 'Ato II · X')).toBe(ACT_MOODS[1]);
        expect(moodFor(12345, 'Capa')).toBe(BASE_MOOD);
    });
});

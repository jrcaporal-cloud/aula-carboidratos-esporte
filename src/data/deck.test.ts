import { describe, expect, it } from 'vitest';
import parsed from './parsedPresentation.json';
import { NOTES } from './notes';
import { CHAPTERS } from './chapters';
import { keepsSlide, readTempo } from './modes';
import { MODEL_3D_BY_SLIDE } from '../components/deck/models3d';
import { MODEL_NAMES } from '../components/three/registry';

interface RawSlide { id: number; sectionName: string; title: string; content: string }
const SLIDES = parsed as unknown as RawSlide[];
const IDS = SLIDES.map(s => s.id);
const ATOS = CHAPTERS.map(c => c.roman);
const ACT_PATTERN = new RegExp(`^Ato (${ATOS.join('|')}) · `);

/** O deck ainda é esqueleto (capa + demo): limites de tamanho só valem quando o roteiro estiver montado. */
const ASSEMBLED = IDS.length >= 50;

describe('ordem da aula', () => {
    it('tem ids únicos', () => {
        expect(new Set(IDS).size).toBe(IDS.length);
    });

    it.runIf(ASSEMBLED)('tem entre 85 e 100 slides', () => {
        expect(IDS.length).toBeGreaterThanOrEqual(85);
        expect(IDS.length).toBeLessThanOrEqual(100);
    });

    it('todo slide pertence a um ato', () => {
        for (const s of SLIDES) expect(s.sectionName, `slide ${s.id}`).toMatch(ACT_PATTERN);
    });

    it('os atos aparecem em ordem e sem voltar', () => {
        const seq = SLIDES.map(s => ATOS.indexOf(s.sectionName.split(' ')[1]));
        expect([...seq].sort((a, b) => a - b)).toEqual(seq);
    });

    it('abre com a capa', () => {
        expect(IDS[0]).toBe(0);
    });

    it('todo slide com simulador traz as fontes', () => {
        for (const s of SLIDES.filter(x => x.content.includes('[[COMP:'))) expect(s.content, `slide ${s.id}`).toContain('Fontes');
    });

    it('todo modelo 3D aponta para um slide e um modelo que existem', () => {
        for (const [id, name] of MODEL_3D_BY_SLIDE) {
            expect(IDS).toContain(id);
            expect(MODEL_NAMES).toContain(name);
        }
    });
});

describe('notas do apresentador', () => {
    it('todo slide tem nota com mensagem e tempo-alvo', () => {
        for (const id of IDS) {
            const note = NOTES[id];
            expect(note, `slide ${id}`).toBeDefined();
            expect(note.mensagem.length).toBeGreaterThan(10);
            expect(note.minutos).toBeGreaterThan(0);
        }
    });

    it('não há nota para slide que não existe', () => {
        for (const key of Object.keys(NOTES)) expect(IDS).toContain(Number(key));
    });

    it('a aula completa cabe em 5 h com discussão', () => {
        const total = IDS.reduce((sum, id) => sum + NOTES[id].minutos, 0);
        expect(total).toBeLessThanOrEqual(300);
    });
});

describe('versões por tempo', () => {
    it('lê o parâmetro da URL e cai na versão completa', () => {
        expect(readTempo('?tempo=abc')).toBe('completa');
        expect(readTempo('')).toBe('completa');
    });

    it('a versão completa mantém tudo', () => {
        expect(IDS.every(id => keepsSlide('completa', id))).toBe(true);
    });

    it('lê as versões curtas', () => {
        expect(readTempo('?tempo=180')).toBe('180');
        expect(readTempo('?tempo=120')).toBe('120');
    });

    const minutesOf = (tempo: '180' | '120') =>
        IDS.filter(id => keepsSlide(tempo, id)).reduce((sum, id) => sum + NOTES[id].minutos, 0);

    it.runIf(ASSEMBLED)('cada versão curta cabe no seu tempo (±10 min)', () => {
        expect(Math.abs(minutesOf('180') - 180)).toBeLessThanOrEqual(10);
        expect(Math.abs(minutesOf('120') - 120)).toBeLessThanOrEqual(10);
    });

    it.runIf(ASSEMBLED)('as versões curtas só citam slides que existem', () => {
        for (const tempo of ['180', '120'] as const) {
            const kept = IDS.filter(id => keepsSlide(tempo, id));
            expect(kept.length).toBeGreaterThan(30);
        }
    });

    it.runIf(ASSEMBLED)('nenhuma versão perde as âncoras (capa, votação, Supernova, mitos, planos, fecho)', () => {
        for (const tempo of ['180', '120'] as const) {
            for (const id of [0, 13, 145, 189, 190, 191, 199]) expect(keepsSlide(tempo, id), `${tempo}: slide ${id}`).toBe(true);
        }
    });

    it.runIf(ASSEMBLED)('a de 120 está contida na de 180', () => {
        for (const id of IDS) if (keepsSlide('120', id)) expect(keepsSlide('180', id), `slide ${id}`).toBe(true);
    });
});

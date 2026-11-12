import { describe, expect, it } from 'vitest';
import { CHAPTERS } from '../../../data/chapters';
import { MARATHON_KM, WALL_FRACTION, fractionAt, kmAt, markerLabel, markerLabelSide, wallLabelVisible } from './marathon';
import { slideChange } from './slideTransition';
import { perchAfterTitle } from './glucosePlace';

describe('barra da maratona', () => {
    it('vai de 0 a 42,195 km proporcional ao slide', () => {
        expect(kmAt(0, 97)).toBe(0);
        expect(kmAt(96, 97)).toBeCloseTo(MARATHON_KM);
        expect(kmAt(48, 97)).toBeCloseTo(MARATHON_KM / 2);
        expect(fractionAt(5, 1)).toBe(1);
        expect(fractionAt(-3, 10)).toBe(0);
        expect(WALL_FRACTION).toBeCloseTo(32 / 42.195);
    });

    it('nomeia o muro e a chegada', () => {
        expect(markerLabel(0, false)).toBe('km 0');
        expect(markerLabel(18.4, false)).toBe('km 18');
        expect(markerLabel(31.7, false)).toBe('km 32 · o muro');
        expect(markerLabel(MARATHON_KM, true)).toBe('chegada · 42,195 km');
    });

    it('recolhe o rótulo do muro perto do marcador e vira o rótulo no fim', () => {
        expect(wallLabelVisible(10, false)).toBe(true);
        expect(wallLabelVisible(31, false)).toBe(false);
        expect(wallLabelVisible(40, false)).toBe(true);
        expect(wallLabelVisible(MARATHON_KM, true)).toBe(false);
        expect(markerLabelSide(20)).toBe('right');
        expect(markerLabelSide(40)).toBe('left');
    });
});

describe('direção da troca de slide', () => {
    const sections = ['Capa', 'Ato I · A', 'Ato I · A', 'Ato II · B', 'Ato III · C'];
    const at = (i: number) => sections[i];

    it('avança para a direita e volta para a esquerda', () => {
        expect(slideChange(1, 2, at)).toEqual({ d: 1, kind: 'lateral', opens: null });
        expect(slideChange(2, 1, at)).toEqual({ d: -1, kind: 'lateral', opens: null });
    });

    it('abre o ato só no avanço de um slide para um ato posterior', () => {
        expect(slideChange(2, 3, at)).toEqual({ d: 1, kind: 'act', opens: CHAPTERS[1] });
        expect(slideChange(0, 1, at).opens).toBe(CHAPTERS[0]);
        expect(slideChange(1, 4, at).opens).toBeNull();
        expect(slideChange(4, 3, at).opens).toBeNull();
        expect(slideChange(2, 3, at, false)).toEqual({ d: 1, kind: 'lateral', opens: null });
    });
});

describe('pouso da glicose depois do título', () => {
    it('fica à direita da última linha, centrada nela', () => {
        const p = perchAfterTitle({ left: 150, top: 50, right: 700, bottom: 96 }, 1150);
        expect(p.y).toBe(73);
        expect(p.x).toBeGreaterThan(700 + p.size / 2);
        expect(p.visible).toBe(true);
    });

    it('se recolhe quando não cabe até a borda', () => {
        expect(perchAfterTitle({ left: 150, top: 50, right: 1130, bottom: 96 }, 1150).visible).toBe(false);
    });
});

import { describe, expect, it } from 'vitest';
import { sourcesUpTo } from './sources';

describe('sourcesUpTo', () => {
    const S = ['A 2014', 'A 2014', 'B 2011'] as const;
    it('mostra só a fonte do primeiro passo no início', () => expect(sourcesUpTo(S, 0)).toBe('A 2014'));
    it('não repete a mesma fonte', () => expect(sourcesUpTo(S, 1)).toBe('A 2014'));
    it('no último passo cita todas as que estão na tela', () => expect(sourcesUpTo(S, 2)).toBe('A 2014 · B 2011'));
});

describe('sourcesUpTo com várias fontes por passo', () => {
    const S = [['Livro 2017', 'Revisão 2018'], 'Revisão 2018', ['Brooks 2018']] as const;
    it('achata as listas e não repete', () => expect(sourcesUpTo(S, 2)).toBe('Livro 2017 · Revisão 2018 · Brooks 2018'));
});

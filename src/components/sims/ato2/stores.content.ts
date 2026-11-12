/**
 * Slide 24 · Quanto Cabe no Corpo. Quadrados com ÁREA proporcional à massa (e, portanto, à energia do CHO).
 * A cada passo a "câmera se afasta" (px por √g diminui) e entra um estoque maior; no fim, a gordura só para escala.
 *
 * Cálculo da gordura (rotulado na tela): pessoa de 70 kg com 15% de gordura = 10,5 kg × 9 kcal/g ≈ 94.500 kcal.
 * Carboidrato total: (4 + 100 + 400 a 500) g × 4 kcal/g ≈ 2.000–2.400 kcal → a gordura guarda ~40× mais.
 */
export const FAT_G_EQUIV = 94500 / 4; // gordura em "gramas de CHO equivalentes" (mesma régua de energia)

export type StoreId = 'blood' | 'liver' | 'muscleMax' | 'muscle' | 'fat';

export interface Store { id: StoreId; grams: number; from: number; color: string }

export const STORES: readonly Store[] = [
    { id: 'blood', grams: 4, from: 0, color: '#F59E0B' },
    { id: 'liver', grams: 100, from: 1, color: '#8B5CF6' },
    { id: 'muscleMax', grams: 500, from: 2, color: '#8B5CF666' },
    { id: 'muscle', grams: 400, from: 2, color: '#8B5CF6' },
    { id: 'fat', grams: FAT_G_EQUIV, from: 3, color: '#BEF264' },
];

export interface StoresStep {
    tab: string;
    headline: string;
    color: string;
    text: string;
    /** px de lado por √grama (a "câmera"). */
    k: number;
    sources: readonly string[];
}

export const STEPS: readonly StoresStep[] = [
    {
        tab: 'Sangue', k: 80, color: '#F59E0B',
        headline: '4 g no sangue inteiro',
        text: 'Numa pessoa de 70 kg circulam cerca de 4 g de glicose: cabe numa colher de chá. A revisão de Hearris arredonda para ~5 g. Esse pouco é usado e reposto o tempo todo.',
        sources: ['Wasserman 2009', 'Hearris 2018'],
    },
    {
        tab: 'Fígado', k: 24, color: '#C4B5FD',
        headline: '~100 g no fígado, a torneira',
        text: 'O fígado guarda ~100 g de glicogênio e repõe a glicemia; na revisão de Jeukendrup, libera glicose a ~1 g/min no exercício. A câmera se afastou: o quadrado de 4 g encolheu.',
        sources: ['Jensen 2011', 'Jeukendrup & Jentjens 2000'],
    },
    {
        tab: 'Músculo', k: 11, color: '#C4B5FD',
        headline: '~400–500 g no músculo',
        text: 'O maior estoque de carboidrato: ~400 g (Hearris) a ~500 g (Jensen), as revisões divergem. A concentração vai de 50 a 800 mmol·kg⁻¹ de peso seco, conforme dieta, treino e tipo de fibra.',
        sources: [],
    },
    {
        tab: 'Em energia', k: 2.2, color: '#BEF264',
        headline: 'Na gordura, ~40 vezes mais',
        text: 'Todo o carboidrato: ~2.000–2.400 kcal. A gordura (70 kg, 15% de gordura) passa de 90.000 kcal. Conta só para escala: o que acaba é o carboidrato.',
        sources: ['cálculo da aula (4 e 9 kcal/g)'],
    },
];

/** Livro-caixa do painel: cada linha entra num passo e fica. */
export interface LedgerRow { at: number; label: string; grams: string; kcal: string; total?: 'cho' | 'fat' }

export const LEDGER: readonly LedgerRow[] = [
    { at: 0, label: 'sangue', grams: '~4 g', kcal: '~16' },
    { at: 1, label: 'fígado', grams: '~100 g', kcal: '~400' },
    { at: 2, label: 'músculo', grams: '~400–500 g', kcal: '~1.600–2.000' },
    { at: 3, label: 'carboidrato', grams: '~500–600 g', kcal: '~2.000–2.400', total: 'cho' },
    { at: 3, label: 'gordura (15%)', grams: '10,5 kg', kcal: '~94.500', total: 'fat' },
];

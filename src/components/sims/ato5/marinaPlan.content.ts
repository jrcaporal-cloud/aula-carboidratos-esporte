/**
 * Slide 87 · Marina, Três Dias Antes. CASO FICTÍCIO (kit/cast.ts: 58 kg) com CÁLCULO próprio.
 * Base dos números:
 *   - 10 g/kg/d por 1 dia bastou em atleta treinado parado (BUSSAU2002, dossiê 04); faixa de 8–12 g/kg/d para
 *     maximizar estoques (KERKSICK2017, ISSN, dossiê 04, conferido no texto completo).
 *   - Café com ~100 g de CHO 3 h antes (SCHABORT1999, dossiê 04).
 *   - Carboidrato dos alimentos: TACO (consultorio/dados/taco.json), g por 100 g, arredondado ao inteiro na tela.
 *     arroz tipo 1 cozido 28,06 · macarrão à bolonhesa 22,52 · pão francês 58,65 · banana prata 25,96 ·
 *     suco de laranja pera 7,55 · tapioca com manteiga 63,59 · mel 84,03 · batata inglesa cozida 11,94.
 */
import { C } from '../kit/palette';

export const KG = 58;
export const TARGET_G_PER_KG = 10;
export const DAY_TOTAL = KG * TARGET_G_PER_KG;

export interface FoodPortion {
    name: string;
    grams: number;
    /** g de CHO por 100 g (TACO). */
    per100: number;
}

export const choOf = (f: FoodPortion): number => (f.grams * f.per100) / 100;

const PASTA_PER_100 = 22.52;

export const PASTA: FoodPortion = { name: 'macarrão à bolonhesa', grams: 450, per100: PASTA_PER_100 };

/** Um dia de carga (≈ 578 g; ver a soma em `dayTotal`). Do maior para o menor aporte. */
export const DAY_FOODS: readonly FoodPortion[] = [
    { name: 'arroz cozido', grams: 400, per100: 28.06 },
    { name: 'macarrão', grams: 450, per100: PASTA_PER_100 },
    { name: 'pão francês', grams: 150, per100: 58.65 },
    { name: 'banana', grams: 300, per100: 25.96 },
    { name: 'tapioca', grams: 100, per100: 63.59 },
    { name: 'suco de laranja', grams: 800, per100: 7.55 },
    { name: 'mel', grams: 60, per100: 84.03 },
    { name: 'batata cozida', grams: 200, per100: 11.94 },
];

export const dayTotal = (): number => DAY_FOODS.reduce((sum, f) => sum + choOf(f), 0);

export const BREAKFAST: readonly FoodPortion[] = [
    { name: 'pão francês', grams: 100, per100: 58.65 },
    { name: 'mel', grams: 25, per100: 84.03 },
    { name: 'banana', grams: 80, per100: 25.96 },
];

export const breakfastTotal = (): number => BREAKFAST.reduce((sum, f) => sum + choOf(f), 0);

/** Eixo do palco: g de CHO à esquerda, g/kg à direita (58 kg). Faixa ISSN 8–12 g/kg/d. */
export const AXIS = { maxG: 700, ticksG: [0, 200, 400, 600], ticksGkg: [0, 4, 8, 12], band: [8, 12] as const } as const;

export interface MarinaStep {
    tab: string;
    headline: string;
    color: string;
    text: string;
    limit?: string;
    sources: string;
    chips: readonly string[];
}

export const MARINA_STEPS: readonly MarinaStep[] = [
    {
        tab: 'A véspera',
        headline: 'Um prato não é carga',
        color: C.glucoseSoft,
        text: 'Na última maratona, a carga da Marina foi um prato de 450 g de macarrão à bolonhesa na véspera. Pela TACO, são 101 g de carboidrato: 1,7 g/kg. Ela bateu no muro no km 32.',
        sources: 'TACO (cálculo)',
        chips: [],
    },
    {
        tab: 'A meta',
        headline: 'A carga pede ~10 g/kg por dia',
        color: C.glycogenSoft,
        text: 'Bussau 2002: 8 homens treinados, em repouso, com 10 g/kg/d de alto IG: glicogênio de 95 para 180 mmol/kg (peso úmido) em 1 dia, estável depois. A ISSN fala em 8–12 g/kg/d para maximizar os estoques; 1 a 2 dias, treino reduzido. Para 58 kg: 580 g/d.',
        limit: 'Bussau não mediu desempenho e só estudou homens.',
        sources: 'Bussau 2002 · Kerksick 2017 (ISSN)',
        chips: ['Bussau: n = 8 · sem comparador'],
    },
    {
        tab: 'Em comida',
        headline: '580 g em comida de verdade',
        color: C.glucoseSoft,
        text: 'Arroz, macarrão, pão, banana, tapioca, suco, mel e batata somam ~578 g pela TACO: 10 g/kg, quase seis pratos da véspera. Clique num alimento para tirá-lo da conta e ver quanto ele pesava no dia.',
        sources: 'TACO (cálculo)',
        chips: [],
    },
    {
        tab: 'Dia da prova',
        headline: 'Café 3 h antes, ~100 g',
        color: C.glucose,
        text: 'Pão francês, mel e banana: ~100 g (1,7 g/kg), a dose de Schabort 1999 (136 × 109 min contra jejum). O café repõe o fígado da noite; o músculo já vem cheio da carga. O resto vem durante a prova, no Ato VI.',
        limit: 'Schabort: ciclistas, sem CHO durante.',
        sources: 'Schabort 1999',
        chips: ['Schabort: cruzado · n = 7'],
    },
];

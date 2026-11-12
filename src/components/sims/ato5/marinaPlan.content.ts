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
    { name: 'macarrão à bolonhesa', grams: 450, per100: PASTA_PER_100 },
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

export const GAUGE = { max: 12, band: [8, 12] as const, ticks: [0, 4, 8, 12], bandLabel: 'faixa da carga, ISSN' } as const;

export const BEATS: readonly string[] = [
    'Na última maratona, a carga da Marina foi um prato de macarrão na véspera.',
    'A carga pede ~10 g/kg por dia, de 1 a 2 dias, com o treino reduzido.',
    'Em comida de verdade, um dia assim soma ~580 g de carboidrato.',
    'No dia da prova: café 3 horas antes, ~100 g. O resto vem durante a corrida.',
];

export const TEXT = {
    gauge: 'g de carboidrato por kg, no dia',
    pastaCaption: 'só o prato',
    calc: `${KG} kg × ${TARGET_G_PER_KG} g/kg`,
    perDay: 'por dia',
    stackUnit: 'g de CHO',
    breakfastTitle: '3 h antes da largada',
    during: 'durante a prova: Ato VI',
    profile: '34 anos · 58 kg',
    sport: 'maratona amadora',
    goal: 'quer baixar de 3h30',
} as const;

export const SOURCES: readonly string[] = [
    'Tabela Brasileira de Composição de Alimentos (TACO).',
    'Bussau VA et al. Eur J Appl Physiol 2002;87:290-295 · Kerksick CM et al. J Int Soc Sports Nutr 2017;14:33.',
    'Tabela Brasileira de Composição de Alimentos (TACO).',
    'Schabort EJ et al. Med Sci Sports Exerc 1999;31(3):464-471 · cálculo com a TACO.',
];

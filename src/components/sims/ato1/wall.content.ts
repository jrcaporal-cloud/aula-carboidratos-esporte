/**
 * Slide 10 · O Km 32 (WallSim). Marina é personagem FICTÍCIA e a curva de ritmo é ilustrativa.
 * Números reais: estoques médios (Murray & Rosenbloom 2018, Tabela 1) e a parede em 1,9 milhão de maratonistas (Smyth 2021).
 */

/** Ritmo da Marina em segundos por km, do km 0 ao 42 (5:00/km até o 30; queda de ~37% depois do 32, a média feminina de Smyth). */
export const PACE_S: readonly number[] = Array.from({ length: 43 }, (_, km) => {
    if (km <= 30) return 300;
    if (km === 31) return 312;
    if (km === 32) return 372;
    return [408, 402, 410, 404, 412][km % 5];
});

/** Nível dos dois tanques (0 → 1) em cada passo: largada, km 30, km 32 e depois. */
export const TANK_LEVELS: readonly { muscle: number; liver: number }[] = [
    { muscle: 1, liver: 1 },
    { muscle: 0.32, liver: 0.28 },
    { muscle: 0.08, liver: 0.06 },
    { muscle: 0.08, liver: 0.06 },
    { muscle: 0.08, liver: 0.06 },
];

export const WALL_BEATS: readonly string[] = [
    'Largada. Os dois tanques estão cheios.',
    'Até o km 30, ritmo de relógio: 5:00 por km.',
    'Km 32: o ritmo despenca e não volta.',
    'A pergunta que abre a aula.',
    'Não é só a Marina.',
];

export const WALL_QUESTION = {
    big: 'O que acabou?',
    options: ['o músculo', 'o fígado', 'a glicose do sangue', 'a cabeça'],
} as const;

export const WALL_STAT = {
    lead: 'batem no muro na maratona',
    men: { value: '28%', caption: 'dos homens' },
    women: { value: '17%', caption: 'das mulheres' },
    foot: 'quem bate perde ~40% do ritmo por ~10 km',
    design: 'observacional · N = 1.928.813 · ritmo, sem medir glicogênio',
} as const;

export const WALL_SOURCES = {
    stores: 'Estoques médios: Murray & Rosenbloom 2018, Nutr Rev (Tabela 1)',
    wall: 'Smyth 2021, PLoS One · "parede" inferida pela queda do ritmo',
} as const;

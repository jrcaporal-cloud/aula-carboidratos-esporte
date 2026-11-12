/** Slide 43 · Lactato é Moeda, não Lixo. BROOKS2018 (revisão); HUI2017 (camundongo, ¹³C, repouso). */

export const LACTATE_STEPS = [
    {
        phrase: 'A velha leitura: a fibra rápida faz lactato quando falta oxigênio, e ele é jogado fora.',
        source: 'Leitura clássica dos livros-texto.',
    },
    {
        phrase: 'O lactato se forma o tempo todo, com oxigênio. Sai da fibra rápida e vira combustível ou glicose nova.',
        source: 'Brooks GA. The science and translation of lactate shuttle theory. Cell Metab 2018;27(4):757-85.',
    },
    {
        phrase: 'Em camundongos, nenhum metabólito circula tanto: mais que a própria glicose.',
        source: 'Hui S et al. Glucose feeds the TCA cycle via circulating lactate. Nature 2017;551:115-8.',
    },
    {
        phrase: 'Em jejum, a glicose chega ao Krebs dos tecidos sobretudo como lactato: a glicólise numa célula, a queima em outra.',
        source: 'Hui S et al. Nature 2017;551:115-8 (exceto cérebro).',
    },
] as const;

export interface LactateNode {
    key: string;
    label: string;
    role: string;
    top: number;
    color: string;
}

/** Destinos da lançadeira (coluna da direita do mapa). */
export const DESTINATIONS = [
    { key: 'lenta', label: 'fibra lenta', role: 'queima como combustível', top: 12 },
    { key: 'coracao', label: 'coração', role: 'queima como combustível', top: 146 },
    { key: 'figado', label: 'fígado', role: 'refaz glicose', top: 280 },
] as const;

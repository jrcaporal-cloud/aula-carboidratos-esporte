/** Slide 122 · Proteína Ajuda? Depende. Números: dossiê 04 (VANLOON2000, MARGOLIS2021, CRAVEN2021). */

export type PanKind = 'cho' | 'mix';

export interface Pan {
    kind: PanKind;
    label: string;
    /** Taxa de ressíntese (µmol/g peso seco/h), quando o estudo dá um valor por braço. */
    value?: string;
}

export interface ProteinStep {
    phrase: string;
    design: string;
    left: Pan;
    right: Pan;
    /** Inclinação do travessão em graus: positivo = o prato da direita desce (repõe mais). */
    tilt: number;
    /** Efeito agrupado, quando o passo é de meta-análise. */
    effect?: string;
}

export const STEPS: readonly ProteinStep[] = [
    {
        phrase: 'Com pouco carboidrato, somar proteína mais que dobra a ressíntese.',
        design: 'van Loon 2000 · cruzado · n = 8',
        left: { kind: 'cho', label: 'CHO 0,8 g/kg/h', value: '16,6' },
        right: { kind: 'mix', label: 'CHO 0,8 + proteína 0,4', value: '35,4' },
        tilt: 10,
    },
    {
        phrase: 'Com carboidrato suficiente, o próprio carboidrato resolve.',
        design: 'van Loon 2000 · cruzado · n = 8',
        left: { kind: 'cho', label: 'CHO 1,2 g/kg/h', value: '44,8' },
        right: { kind: 'mix', label: 'CHO 0,8 + proteína 0,4', value: '35,4' },
        tilt: -6,
    },
    {
        phrase: 'Trocar parte do carboidrato por proteína, com as mesmas calorias: nada muda.',
        design: 'Margolis 2021 · meta-análise · 20 estudos',
        left: { kind: 'cho', label: 'só CHO' },
        right: { kind: 'mix', label: 'CHO + proteína, mesmas kcal' },
        tilt: 0,
        effect: 'g = −0,05 (IC95% −0,23 a 0,13)',
    },
    {
        phrase: 'Quando a proteína chega somando calorias, a ressíntese sobe.',
        design: 'Margolis 2021 · meta-análise · 20 estudos',
        left: { kind: 'cho', label: 'só CHO' },
        right: { kind: 'mix', label: 'CHO + proteína a mais' },
        tilt: 5,
        effect: 'g = 0,26 (IC95% 0,04 a 0,49)',
    },
    {
        phrase: 'Na média dos ensaios de recuperação curta, a proteína não acelera nem atrapalha.',
        design: 'Craven 2021 · meta-análise · 19 ensaios, n = 160',
        left: { kind: 'cho', label: 'só CHO' },
        right: { kind: 'mix', label: 'CHO + proteína' },
        tilt: 0,
        effect: '+0,4 mmol/kg/h (IC95% −2,7 a 3,4)',
    },
];

/** As condições que acendem no caderno à direita (passo em que aparecem). */
export const CONDITIONS: readonly { text: string; from: number }[] = [
    { text: 'o carboidrato está abaixo de ~1,2 g/kg/h', from: 1 },
    { text: 'a proteína soma calorias, não substitui', from: 3 },
];

export const UNIT = 'µmol/g/h';

export const SOURCE = 'van Loon LJ et al. Am J Clin Nutr 2000;72(1):106-11 · Margolis LM et al. Med Sci Sports Exerc 2021;53(2):384-93 · Craven J et al. Sports Med Open 2021;7:9';

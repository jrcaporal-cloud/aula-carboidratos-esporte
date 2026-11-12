import { C } from '../kit/palette';
import type { LedgerRow } from './SnShell';
import type { SnStep } from './supernova.content';

/**
 * Slide 147 · A torneira fechada (dossiê 05·STELLINGWERFF2006, 05·HAVEMANN2006, 01·HOWLETT1998)
 * + Peters SJ et al. 2001 (PDK após 3 dias de dieta rica em gordura; abstract conferido no Europe PMC em 12/11/2026).
 * −29% e −26% são cálculo nosso (1,69/2,39 e 37,3/50,5). O perfil de potência do Havemann é ilustrativo.
 */

export const PDH_STEPS: readonly SnStep[] = [
    {
        tab: 'O tanque',
        headline: 'O tanque volta a encher igual',
        text: 'Cruzado, 7 ciclistas: 5 dias de dieta rica em CHO (10,3 g/kg/d) × 5 dias rica em gordura (4,6 g/kg/d, 67% da energia), ambos com treino e seguidos de 1 dia de CHO alto. Glicogênio de repouso: 873 × 868 µmol/g ps. Pelo tanque, nada mudou.',
        sources: ['Stellingwerff 2006'],
    },
    {
        tab: 'A porta',
        headline: 'A porta da mitocôndria abre menos',
        text: 'O piruvato só entra no ciclo de Krebs como acetil-CoA, pela piruvato desidrogenase (PDH). Depois da gordura, a PDH ativa caiu de 2,39 para 1,69 mmol/kg/min (−29%). No mesmo exercício, ~45% mais gordura e ~30% menos CHO oxidados.',
        sources: ['Stellingwerff 2006'],
    },
    {
        tab: 'Quem fecha',
        headline: 'A PDK desliga a PDH',
        text: 'A quinase da PDH (PDK) desliga a enzima por fosforilação; Ca²⁺ e piruvato, que sobem com a potência, a religam. Em 6 homens, 3 dias de dieta rica em gordura levaram a atividade da PDK de 0,09 a 0,37 min⁻¹, com a proteína PDK4 no pico já no 1º dia.',
        sources: ['Peters 2001 (PDK, n = 6)', 'Howlett 1998'],
    },
    {
        tab: 'O sprint',
        headline: 'No sprint, sai menos glicogênio',
        text: 'Tanque igual, torneira mais fina: a glicogenólise caiu no 1º minuto (13,4 × 9,1) e no sprint de 1 min (50,5 × 37,3 mmol glicosil/kg ps/min, −26%). O carboidrato estava lá; o músculo não o liberou na velocidade que o sprint pede.',
        sources: ['Stellingwerff 2006'],
    },
    {
        tab: 'A prova',
        headline: 'Ritmo médio igual, ataque mais fraco',
        text: 'Havemann 2006 (cruzado, simples-cego, 8 ciclistas): 6 dias de gordura (68% da energia) + 1 dia de 8–10 g/kg de CHO × dieta rica em CHO. 100 km: desempenho igual. Sprints de 1 km: potência menor (P < 0,05).',
        sources: ['Havemann 2006'],
    },
];

export const PDH_CHIPS: readonly (readonly string[])[] = [
    ['cruzado · n = 7'],
    ['cruzado · n = 7'],
    ['cruzado · n = 7', 'PDK: n = 6, não atletas'],
    ['cruzado · n = 7'],
    ['cruzado · simples-cego · n = 8'],
];

export interface PdhArm {
    id: 'hcho' | 'fat';
    name: string;
    sub: string;
    glycogen: string;
    /** PDH ativa (mmol/kg peso úmido/min) e abertura relativa da "porta". */
    pdh: number;
    pdhText: string;
    /** Glicogenólise no sprint de 1 min (mmol glicosil/kg ps/min). */
    sprint: string;
    /** Espessura relativa do fluxo de CHO e de gordura (≈ −30% e ≈ +45%). */
    cho: number;
    fat: number;
    color: string;
}

export const ARMS: readonly PdhArm[] = [
    { id: 'hcho', name: 'CHO alto', sub: '5 d · 10,3 g/kg/d', glycogen: '873', pdh: 1, pdhText: '2,39', sprint: '50,5', cho: 1, fat: 1, color: C.glucose },
    { id: 'fat', name: 'gordura → CHO', sub: '5 d de gordura + 1 d de CHO', glycogen: '868', pdh: 0.71, pdhText: '1,69', sprint: '37,3', cho: 0.7, fat: 1.45, color: C.fat },
];

export const PDH_LEDGER: readonly LedgerRow[] = [
    { at: 0, label: 'glicogênio de repouso (µmol/g ps)', value: '873 × 868' },
    { at: 1, label: 'PDH ativa (mmol/kg/min)', value: '2,39 × 1,69', color: C.fat },
    { at: 2, label: 'PDK, 3 dias de gordura (min⁻¹)', value: '0,09 → 0,37', color: C.stone },
    { at: 3, label: 'glicogenólise, sprint de 1 min', value: '50,5 × 37,3', color: C.fat },
    { at: 4, label: '100 km · sprints de 1 km', value: 'igual · menor', color: C.fat },
];

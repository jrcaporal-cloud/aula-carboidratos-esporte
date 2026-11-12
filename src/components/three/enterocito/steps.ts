import { C } from '../../sims/kit/palette';
import type { Pose, StepInfo, StepLabel, Vec3 } from '../shared/modal/types';
import { APICAL_Y, CAPILLARY, DOOR, MOL_Z } from './layout';

/*
 * As 7 etapas do enterócito: a célula, as duas portas de entrada, o teto de uma pista, a hipótese do
 * GLUT2 apical (que caiu) e as duas pistas. Números de JEUK2000, JENTJENS2004, JENT2005 e RODER2014.
 */

const WRIGHT = 'Wright EM et al. Physiol Rev 2011;91(2):733-94.';
const FERRARIS = 'Ferraris RP et al. Annu Rev Nutr 2018;38:41-67.';
const JEUK = 'Jeukendrup AE, Jentjens R. Sports Med 2000;29(6):407-24.';
const RODER = 'Röder PV et al. PLoS One 2014;9(2):e89977.';
const J2004 = 'Jentjens RL et al. J Appl Physiol 2004;96(4):1277-84.';
const J2005 = 'Jentjens RL, Jeukendrup AE. Br J Nutr 2005;93(4):485-92.';

const lab = (id: string, text: string, sub: string | undefined, color: string, at: Vec3, dx: number, dy: number): StepLabel =>
    ({ id, text, sub, color, at, dx, dy });
const door = (d: { x: number; y: number }, dy = 0): Vec3 => [d.x, d.y + dy, MOL_Z + 0.2];

const OVERVIEW: Pose = { pos: [8, 3.5, 32], tgt: [0.8, 0.4, 0] };
const APICAL: Pose = { pos: [5.5, 9.5, 24], tgt: [0.6, 7.2, 0] };

export const ENTERO_STEPS: readonly StepInfo[] = [
    {
        badge: 'A CÉLULA', short: 'Célula', title: 'O enterócito em corte',
        text: 'Uma célula do intestino, cortada ao meio. No alto, as microvilosidades formam a borda em escova voltada ao lúmen; na base, o capilar que leva à veia porta.',
        sources: [WRIGHT], anim: 0.6, pose: OVERVIEW,
        labels: [
            lab('lumen', 'Lúmen', 'o que foi comido', C.caveat, [-6.5, 7.6, 0], 40, -40),
            lab('brush', 'Borda em escova', 'microvilosidades', '#A5B4D4', [2.6, APICAL_Y + 1.2, -0.35], 60, -60),
            lab('cell', 'Enterócito', 'cortado ao meio', C.caveat, [-2.2, 0.5, 0.1], -70, 0),
            lab('cap', 'Capilar', 'para a veia porta', '#E8A0B4', [3.2, CAPILLARY.y, 0.6], 70, 30),
        ],
    },
    {
        badge: 'SGLT1', short: 'SGLT1', title: 'Glicose e galactose entram com Na⁺',
        text: 'O SGLT1 leva glicose e galactose junto com Na⁺. Na base, a Na⁺/K⁺-ATPase gasta ATP e mantém o gradiente de Na⁺. A saída para o sangue é pelo GLUT2.',
        sources: [WRIGHT, FERRARIS], anim: 7.5, pose: OVERVIEW,
        labels: [
            lab('sglt1', 'SGLT1', 'glicose/galactose + Na⁺', C.glucose, door(DOOR.sglt1, 0.5), -90, -40),
            lab('glut2', 'GLUT2', 'saída para o sangue', C.caveat, door(DOOR.glut2, -0.3), -90, 40),
            lab('nak', 'Na⁺/K⁺-ATPase', 'gasta ATP', C.caveat, door(DOOR.nak, -0.3), 70, 40),
        ],
    },
    {
        badge: 'GLUT5', short: 'GLUT5', title: 'A frutose tem porta própria',
        text: 'A frutose entra pelo GLUT5, sem Na⁺, e também sai pelo GLUT2. Parte dela já é fosforilada no próprio enterócito pela frutoquinase (KHK).',
        sources: [FERRARIS], anim: 7.5, pose: OVERVIEW,
        labels: [
            lab('glut5', 'GLUT5', 'frutose, sem Na⁺', C.fructose, door(DOOR.glut5, 0.5), 70, -40),
            lab('khk', 'KHK', 'frutose → frutose-1-P', C.fructoseSoft, [DOOR.glut5.x + 0.4, 1.6, MOL_Z + 0.2], 80, 30),
        ],
    },
    {
        badge: 'UMA PISTA', short: 'Teto', title: 'Só glicose: o teto de ~1 g/min',
        text: 'Subir a glicose acima de 1,0–1,5 g/min não leva a oxidação exógena além de ~1,0–1,1 g/min. O gargalo está no intestino e no fígado, não no músculo.',
        sources: [JEUK], anim: 7.5, pose: APICAL,
        chips: [{ kind: 'design', text: 'revisão de estudos com isótopos' }, { kind: 'model', text: 'fila no SGLT1: ilustrativa' }],
        labels: [
            lab('queue', 'Fila no SGLT1', 'saturação: hipótese mais aceita', C.glucose, [DOOR.sglt1.x - 0.3, APICAL_Y + 4.5, MOL_Z], -70, -30),
        ],
    },
    {
        badge: 'HIPÓTESE', short: 'GLUT2?', title: 'GLUT2 no ápice? Não se sustentou',
        text: 'A ideia: com muita glicose, o GLUT2 subiria ao ápice. Em camundongos knockout, sem SGLT1 a absorção despencou; o GLUT2 "apical" era contaminação da membrana basal.',
        sources: [RODER, FERRARIS], anim: 0.8, pose: APICAL,
        chips: [{ kind: 'animal', text: 'camundongo knockout' }],
        labels: [
            lab('ghost', 'GLUT2 apical?', 'não se sustentou', C.risk, door(DOOR.glut2Apical, 0.5), 80, -50),
        ],
    },
    {
        badge: 'DUAS PISTAS', short: '2 pistas', title: 'Glicose + frutose passam do teto',
        text: 'Com 1,2 g/min de glicose + 0,6 de frutose, o pico de oxidação exógena foi 1,26 g/min, contra 0,80–0,83 só com glicose. Duas portas, duas filas.',
        sources: [J2004], anim: 7.5, pose: APICAL,
        chips: [{ kind: 'design', text: 'cruzado · n = 8 · isótopos' }, { kind: 'model', text: 'filas: ilustrativas' }],
        labels: [
            lab('sglt1b', 'SGLT1', 'glicose', C.glucose, door(DOOR.sglt1, -0.2), -80, 40),
            lab('glut5b', 'GLUT5', 'frutose', C.fructose, door(DOOR.glut5, -0.2), 80, 40),
        ],
    },
    {
        badge: '144 g/h', short: '144 g/h', title: '1:1 a 144 g/h: 1,75 g/min',
        text: '1,2 g/min de glicose + 1,2 de frutose (144 g/h, 1:1) levaram o pico a 1,75 g/min, contra 1,06 só com glicose. O 1,75 veio de 1:1, não de 2:1.',
        sources: [J2005], anim: 7.5, pose: APICAL,
        chips: [{ kind: 'design', text: 'cruzado · n = 8 · isótopos' }, { kind: 'model', text: 'filas: ilustrativas' }],
        labels: [
            lab('sglt1c', 'SGLT1', 'glicose', C.glucose, door(DOOR.sglt1, -0.2), -80, 40),
            lab('glut5c', 'GLUT5', 'frutose', C.fructose, door(DOOR.glut5, -0.2), 80, 40),
        ],
    },
];

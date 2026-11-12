import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';

/**
 * Quadros chapados da história de Claude Bernard (slide 21). Cada desenho ocupa um viewBox 460 × 330.
 * Formas simples e cores da paleta: na videochamada, silhueta lê melhor que detalhe.
 */
const INK = '#E5E7EB';
const DARK = '#04080F';

const Dog = () => (
    <g fill={C.co2}>
        <rect x={70} y={150} width={170} height={70} rx={34} />
        <circle cx={255} cy={135} r={38} />
        <polygon points="226,114 232,76 252,104" /><polygon points="258,102 276,70 282,114" />
        <rect x={270} y={132} width={40} height={24} rx={12} />
        <rect x={88} y={200} width={20} height={70} rx={8} />
        <rect x={128} y={200} width={20} height={70} rx={8} />
        <rect x={178} y={200} width={20} height={70} rx={8} />
        <rect x={210} y={200} width={20} height={70} rx={8} />
        <rect x={34} y={150} width={50} height={14} rx={7} transform="rotate(-28 70 158)" />
        <circle cx={262} cy={128} r={5} fill={DARK} />
    </g>
);

/** Tubo de ensaio com o sangue "doce" (âmbar). */
const Tube = ({ x }: { x: number }) => (
    <g>
        <rect x={x} y={80} width={46} height={180} rx={23} fill="none" stroke={INK} strokeWidth={4} />
        <rect x={x + 6} y={150} width={34} height={104} rx={17} fill={C.glucose} />
    </g>
);

export const Scene1848 = () => (
    <svg viewBox="0 0 460 330" className="h-full w-full" aria-hidden>
        <Dog />
        <Tube x={360} />
        <SvgText x={383} y={300} text="glicose" size={20} color={C.glucoseSoft} anchor="middle" />
        <SvgText x={150} y={305} text="não comera açúcar" size={20} color={INK} anchor="middle" />
    </svg>
);

/** Fígado (violeta = glicogênio) e o frasco com o pó branco isolado. */
const LIVER = 'M40 150 C40 90 120 70 210 80 C290 88 330 110 300 160 C270 210 190 250 120 240 C70 232 40 200 40 150 Z';

export const Scene1855 = () => (
    <svg viewBox="0 0 460 330" className="h-full w-full" aria-hidden>
        <path d={LIVER} fill={C.glycogen} />
        <SvgText x={170} y={168} text="fígado" size={22} color={INK} anchor="middle" />
        <g transform="translate(330 70)">
            <rect x={30} y={0} width={30} height={40} fill="none" stroke={INK} strokeWidth={4} />
            <path d="M30 40 L0 190 C-4 206 6 214 20 214 L70 214 C84 214 94 206 90 190 L60 40" fill="none" stroke={INK} strokeWidth={4} />
            <path d="M14 150 L76 150 L88 196 C90 204 84 208 76 208 L14 208 C6 208 0 204 2 196 Z" fill={INK} />
        </g>
        <SvgText x={375} y={310} text="glicogênio" size={22} color={C.glycogenSoft} anchor="middle" />
    </svg>
);

export const Scene1857 = () => (
    <svg viewBox="0 0 460 330" className="h-full w-full" aria-hidden>
        <rect x={110} y={30} width={240} height={280} rx={8} fill={INK} />
        <rect x={140} y={66} width={180} height={14} rx={4} fill={DARK} />
        <rect x={140} y={92} width={150} height={14} rx={4} fill={DARK} />
        <rect x={140} y={118} width={168} height={14} rx={4} fill={DARK} />
        <path d="M150 210 C150 180 190 172 230 175 C270 178 290 190 280 214 C270 238 236 256 204 252 C170 248 150 236 150 210 Z" fill={C.glycogen} />
        {[150, 172, 194].map(y => <rect key={y} x={140} y={y + 100} width={180 - (y - 150)} height={8} rx={4} fill={C.co2} />)}
    </svg>
);

/** Meio interno: o fígado repõe, o músculo retira, o nível do sangue fica constante. */
export const SceneMilieu = () => (
    <svg viewBox="0 0 460 330" className="h-full w-full" aria-hidden>
        <path d="M10 120 C10 80 60 66 110 72 C160 78 176 96 160 126 C144 156 100 176 64 170 C30 164 10 150 10 120 Z" fill={C.glycogen} />
        <SvgText x={88} y={210} text="fígado" size={20} color={C.glycogenSoft} anchor="middle" />
        <path d="M168 118 L208 118" stroke={C.glucose} strokeWidth={8} strokeLinecap="round" />
        <polygon points="206,104 230,118 206,132" fill={C.glucose} />
        <rect x={240} y={60} width={110} height={170} rx={14} fill="none" stroke={INK} strokeWidth={4} />
        <rect x={246} y={120} width={98} height={104} rx={10} fill={C.glucoseDeep} />
        <line x1={226} y1={120} x2={364} y2={120} stroke={INK} strokeWidth={3} strokeDasharray="8 6" />
        <SvgText x={295} y={270} text="sangue" size={20} color={INK} anchor="middle" />
        <path d="M360 176 L400 176" stroke={C.glucose} strokeWidth={8} strokeLinecap="round" />
        <polygon points="398,162 422,176 398,190" fill={C.glucose} />
        <SvgText x={392} y={222} text="tecidos" size={20} color={INK} anchor="middle" />
    </svg>
);

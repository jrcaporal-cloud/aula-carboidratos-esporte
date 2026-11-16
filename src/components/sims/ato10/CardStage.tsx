import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { Grow } from '../kit/Beat';
import { CountUp } from '../kit/CountUp';
import { C } from '../kit/palette';
import { DecideSlot } from './DecideShell';
import { HOUR_ROWS, MIXES, UNITS, type HourRow, type TokenKind, type UnitKind } from './supplementCard.content';

/**
 * Palco do slide 192 (O Cartão do Carboidrato). Três blocos que se somam e ficam:
 * 1) as unidades (quanto carboidrato tem cada formato); 2) uma hora de prova com o que entra e quando, para 30, 60 e
 * 90 g/h; 3) os 90 g/h desmontados por transportador nas duas proporções estudadas (2:1 e 1:0,8).
 * Ícones chapados, sem traço fino: a aula é por videochamada.
 */

const ICON_STROKE = 3;

/** Ícones dos formatos (24 × 28 de projeto). O gel de mistura tem a faixa rosa da frutose. */
const FormatIcon = ({ kind, size = 28 }: { kind: UnitKind | TokenKind; size?: number }) => {
    const w = size * 0.86;
    if (kind === 'gel' || kind === 'gelMix') {
        return (
            <svg width={w} height={size} viewBox="0 0 24 28" className="shrink-0" aria-hidden>
                <path d="M4 2h16v19l-5 5H9l-5-5z" fill={C.glucose} />
                <rect x={4} y={5} width={16} height={3} fill="#04080F" />
                {kind === 'gelMix' && <rect x={4} y={14} width={16} height={7} fill={C.fructose} />}
            </svg>
        );
    }
    if (kind === 'drink' || kind === 'sip') {
        return (
            <svg width={w} height={size} viewBox="0 0 24 28" className="shrink-0" aria-hidden>
                <rect x={9} y={1} width={6} height={4} rx={1} fill={C.co2} />
                <path d="M7 6h10l2 4v16H5V10z" fill="none" stroke={C.glucose} strokeWidth={ICON_STROKE} strokeLinejoin="round" />
                <rect x={7} y={14} width={10} height={10} fill={C.glucose} />
            </svg>
        );
    }
    if (kind === 'water') {
        return (
            <svg width={w} height={size} viewBox="0 0 24 28" className="shrink-0" aria-hidden>
                <path d="M12 3c4 6 7 10 7 14a7 7 0 0 1-14 0c0-4 3-8 7-14z" fill={C.lactateSoft} />
            </svg>
        );
    }
    if (kind === 'gummy') {
        return (
            <svg width={w} height={size} viewBox="0 0 24 28" className="shrink-0" aria-hidden>
                <circle cx={12} cy={9} r={6} fill={C.glucose} />
                <rect x={5} y={13} width={14} height={12} rx={5} fill={C.glucose} />
            </svg>
        );
    }
    return (
        <svg width={w} height={size} viewBox="0 0 24 28" className="shrink-0" aria-hidden>
            <rect x={3} y={8} width={18} height={12} rx={3} fill={C.glucose} />
            <rect x={9} y={8} width={3} height={12} fill="#04080F" />
            <rect x={15} y={8} width={3} height={12} fill="#04080F" />
        </svg>
    );
};

const Units = () => {
    const reduce = useReducedMotion() ?? false;
    return (
    <div className="grid grid-cols-[0.95fr_1.1fr_0.85fr_1.1fr] gap-2">
        {UNITS.map((u, i) => (
            <motion.div key={u.kind} className="flex flex-col rounded-xl border-2 border-white/15 px-2 py-1"
                initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stagger(i, 0.1, 0.1), duration: DUR.enter, ease: EASE_OUT }}>
                <span className="flex items-center gap-1">
                    <FormatIcon kind={u.kind} size={22} />
                    <span className="text-[16px] font-semibold text-white">{u.name}</span>
                    <span className="ml-auto whitespace-nowrap font-display text-[18px] font-bold leading-none tabular-nums" style={{ color: C.glucose }}>{u.grams}</span>
                </span>
                <span className="whitespace-nowrap text-[14px] leading-tight text-gray-300">{u.sub}</span>
            </motion.div>
        ))}
    </div>
    );
};

/** Trilho de 60 min: largura em px de projeto; o minuto vira posição. */
const TRACK_W = 370;
const TICKS = [0, 15, 30, 45, 60] as const;
const xOf = (min: number) => (min / 60) * (TRACK_W - 24);

const Axis = () => (
    <div className="grid grid-cols-[76px_370px_1fr] items-end gap-x-3">
        <span className="text-[15px] font-semibold text-gray-300">meta · min</span>
        <div className="relative h-[20px]">
            {TICKS.map(t => (
                <span key={t} className="absolute top-0 -translate-x-1/2 font-mono text-[14px] text-gray-300" style={{ left: xOf(t) + 12 }}>
                    {t}
                </span>
            ))}
        </div>
        <span className="text-right text-[15px] font-semibold text-gray-300">na hora</span>
    </div>
);

const Row = ({ row, fresh }: { row: HourRow; fresh: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="grid grid-cols-[76px_370px_1fr] items-center gap-x-3 gap-y-0.5">
            <span className="font-display text-[20px] font-bold leading-none tabular-nums" style={{ color: row.color }}>{row.goal}</span>
            <div className="relative h-[30px]">
                <div className="absolute left-[12px] top-[14px] h-[3px] rounded bg-slate-600" style={{ width: TRACK_W - 24 }} />
                {row.tokens.map((t, i) => (
                    <motion.span key={`${t.kind}-${t.min}`} className="absolute top-0" style={{ left: xOf(t.min) }}
                        initial={reduce || !fresh ? false : { opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: stagger(i, 0.15, 0.09), duration: DUR.enter, ease: EASE_OUT }}>
                        <FormatIcon kind={t.kind} size={28} />
                    </motion.span>
                ))}
            </div>
            <CountUp text={`= ${row.total}`} run={fresh} delay={0.6}
                className="text-right font-display text-[22px] font-bold leading-none" style={{ color: row.color }} />
            <span />
            <span className="col-span-2 text-[15px] leading-tight text-gray-200">{row.caption}</span>
        </div>
    );
};

const Hour = ({ step }: { step: number }) => (
    <div className="flex flex-col gap-1.5">
        <Axis />
        {HOUR_ROWS.filter(r => r.at <= step).map(r => <Row key={r.goal} row={r} fresh={r.at === step} />)}
    </div>
);

/** Barra de 90 g dividida por transportador: âmbar = glicose/maltodextrina (SGLT1), rosa = frutose (GLUT5). */
const MIX_W = 370;

const Mixes = () => (
    <div className="flex flex-col gap-1.5">
        <div className="grid grid-cols-[76px_370px_1fr] items-end gap-x-3">
            <span className="text-[15px] font-semibold text-gray-300">90 g/h</span>
            <span className="flex justify-between text-[15px] font-semibold">
                <span style={{ color: C.glucoseSoft }}>glicose ou malto · SGLT1</span>
                <span style={{ color: C.fructoseSoft }}>frutose · GLUT5</span>
            </span>
            <span />
        </div>
        {MIXES.map((m, i) => (
            <div key={m.ratio} className="grid grid-cols-[76px_370px_1fr] items-center gap-x-3">
                <span className="font-display text-[20px] font-bold leading-none" style={{ color: C.fructose }}>{m.ratio}</span>
                <div className="flex h-[28px] overflow-hidden rounded-md" style={{ width: MIX_W }}>
                    <div className="relative h-full" style={{ width: (m.glucose / 90) * MIX_W }}>
                        <Grow value={1} color={C.glucose} delay={stagger(i, 0.2, 0.15)} />
                        <span className="absolute inset-0 flex items-center pl-2 text-[17px] font-bold text-[#04080F]">{m.glucose} g</span>
                    </div>
                    <div className="relative h-full border-l-[3px] border-[#04080F]" style={{ width: (m.fructose / 90) * MIX_W }}>
                        <Grow value={1} color={C.fructose} delay={stagger(i, 0.45, 0.15)} />
                        <span className="absolute inset-0 flex items-center pl-2 text-[17px] font-bold text-[#04080F]">{m.fructose} g</span>
                    </div>
                </div>
                <span className="text-right text-[14px] leading-tight text-gray-300">{m.note}</span>
            </div>
        ))}
    </div>
);

export const CardStage = ({ step }: { step: number }) => (
    <div className="flex h-full flex-col gap-2 p-3">
        <span className="text-[16px] font-semibold text-gray-300">1 unidade = quanto carboidrato</span>
        <Units />
        <div className="border-t-2 border-white/15 pt-1.5">
            {step < 1 ? <div className="h-[170px]"><DecideSlot label="uma hora de prova" /></div> : <Hour step={step} />}
        </div>
        <div className="min-h-0 flex-1 border-t-2 border-white/15 pt-1.5">
            {step < 2 ? <DecideSlot label="a mistura, em gramas" /> : <Mixes />}
        </div>
    </div>
);

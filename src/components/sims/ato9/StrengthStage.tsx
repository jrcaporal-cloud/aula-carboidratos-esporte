import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { Grow } from '../kit/Beat';
import { castOf } from '../kit/cast';
import { br } from '../kit/format';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { ChainCell as Cell } from '../ato3/chainStrip';
import { HYPER, REVIEW, SPEND, type Finding } from './strength.content';

/**
 * Palco do slide 162 (640 × 420): o Paulo (fictício) no alto e a cadeia em 3 faixas numeradas, um estudo por elo.
 * 1 a sessão de força gasta parte do tanque (uma barra por protocolo, cada uma com o seu estudo) → 2 a força não muda
 * com CHO extra (Henselmans 2022, 49 estudos) → 3 a hipertrofia também não (Henselmans 2026, SMD de 11 ECRs).
 */

export const STAGE_W = 640;
export const STAGE_H = 420;

const Paulo = () => {
    const p = castOf('paulo');
    const Icon = p.icon;
    return (
        <div className="flex items-center gap-3 px-1">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <Icon size={26} strokeWidth={2.2} color={C.text} aria-hidden />
            </span>
            <div className="flex flex-col leading-tight">
                <span className="text-[17px] text-gray-200"><b className="text-[20px] text-white">{p.name}</b> · {p.age} anos · {p.kg} kg · {p.sport}</span>
                <span className="text-[17px] italic text-gray-100">{p.dilemma}</span>
            </div>
        </div>
    );
};

/** Barra-tanque: a trilha é o glicogênio de antes (100%); o cheio é o que sobrou, o tracejado é o que a sessão gastou. */
const SpendRow = ({ s, delay }: { s: (typeof SPEND)[number]; delay: number }) => {
    const left = 1 - s.drop / 100;
    return (
        <div className="flex items-center gap-2">
            <span className="w-[128px] shrink-0 text-[16px] font-semibold text-gray-100">{s.label}</span>
            <div className="relative h-[18px] flex-1">
                <div className="absolute inset-0 rounded-[3px] border-2 border-dashed" style={{ borderColor: C.glycogenSoft }} />
                <div className="absolute inset-y-0 left-0 overflow-hidden rounded-l-[3px]" style={{ width: `${left * 100}%` }}>
                    <Grow value={1} color={C.glycogen} delay={delay} />
                </div>
            </div>
            <span className="w-[54px] shrink-0 text-right font-mono text-[17px] font-bold tabular-nums" style={{ color: C.glycogenSoft }}>{s.text}</span>
            <span className="w-[84px] shrink-0 text-[15px] text-gray-300">{s.who}</span>
        </div>
    );
};

const CELL_COLOR: Record<Finding, string> = { positivo: C.glucose, nulo: '#64748B', contra: C.stone };
/** Índice do primeiro quadrado de cada linha (o escalonamento corre pelos 49). */
const OFFSETS = REVIEW.map((_, i) => REVIEW.slice(0, i).reduce((a, r) => a + r.cells.length, 0));

/** Henselmans 2022: os 49 estudos, um quadrado cada, por desenho. */
const Review = () => {
    const reduce = useReducedMotion();
    return (
        <div className="flex flex-col gap-[4px]">
            {REVIEW.map((r, ri) => (
                <div key={r.key} className="flex items-center gap-2">
                    <span className="w-[70px] shrink-0 text-[15px] leading-none text-gray-300">{r.label}</span>
                    <div className="flex gap-[2px]">
                        {r.cells.map((c, i) => (
                            <motion.span key={i} className="block h-[12px] w-[12px] rounded-[2px]"
                                style={c === 'contra' ? { border: `2px solid ${C.stone}` } : { background: CELL_COLOR[c] }}
                                initial={reduce ? false : { opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: stagger(OFFSETS[ri] + i, 0.2, 0.012), duration: DUR.enter, ease: EASE_OUT }} />
                        ))}
                    </div>
                </div>
            ))}
            <div className="flex gap-3 pt-0.5 text-[15px] leading-none text-gray-300">
                <span className="flex items-center gap-1"><i className="block h-3 w-3 rounded-[2px]" style={{ background: C.glucose }} />a favor do CHO</span>
                <span className="flex items-center gap-1"><i className="block h-3 w-3 rounded-[2px]" style={{ background: '#64748B' }} />nulo</span>
                <span className="flex items-center gap-1"><i className="block h-3 w-3 rounded-[2px]" style={{ border: `2px solid ${C.stone}` }} />contra</span>
            </div>
        </div>
    );
};

/** Henselmans 2026: rótulos à esquerda, pontos na régua do SMD (−0,5 a 0,5), valor à direita; nada encosta. */
const FW = 400;
const LBL = 138;
const P0 = LBL + 12;
const P1 = FW - 64;
const sx = (v: number) => P0 + ((v + 0.5) / 1) * (P1 - P0);

const Forest = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg viewBox={`0 0 ${FW} 92`} width={FW} height={92} role="img" aria-label="SMD 0,15 nos 11 ECRs, 0,15 nos isocalóricos, −0,26 nos 2 com imagem direta">
            <line x1={sx(0)} x2={sx(0)} y1={2} y2={70} stroke={C.text} strokeWidth={2} strokeDasharray="5 5" />
            {HYPER.map((h, i) => {
                const y = 12 + i * 22;
                const main = i === 0;
                const color = main ? C.glucoseSoft : '#E5E7EB';
                return (
                    <motion.g key={h.key} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ duration: DUR.enter, delay: 0.3 + i * 0.18, ease: EASE_OUT }}>
                        <SvgText x={0} y={y + 5} text={h.label} size={16} color={color} weight={main ? 700 : 600} />
                        <line x1={P0} x2={P1} y1={y} y2={y} stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
                        <circle cx={sx(h.smd)} cy={y} r={main ? 7 : 6} fill={main ? C.glucose : C.co2} />
                        <SvgText x={FW} y={y + 5} text={br(h.smd, 2)} anchor="end" size={16} color={color} weight={700} />
                    </motion.g>
                );
            })}
            <line x1={P0} x2={P1} y1={72} y2={72} stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
            <SvgText x={0} y={88} text="SMD" size={15} color={C.muted} weight={500} />
            {[-0.5, 0, 0.5].map(t => <SvgText key={t} x={sx(t)} y={89} text={br(t, t === 0 ? 0 : 1)} anchor="middle" size={15} color={C.muted} weight={500} />)}
        </svg>
    );
};

export const StrengthStage = ({ step }: { step: number }) => (
    <div className="grid gap-1.5" style={{ width: STAGE_W, height: STAGE_H, gridTemplateRows: 'auto 1fr 1fr 1fr' }}>
        <Paulo />
        <Cell n={1} title="Uma sessão gasta parte do tanque" note="tracejado = o que a sessão gastou" show={step >= 1} born={step === 1}>
            {SPEND.filter(s => step >= s.at).map(s => <SpendRow key={s.key} s={s} delay={s.at === step ? 0.25 : 0} />)}
        </Cell>
        <Cell n={2} title="Força: CHO extra não mudou" note="Henselmans 2022 · 49 estudos" show={step >= 3} born={step === 3}>
            <Review />
        </Cell>
        <Cell n={3} title="Músculo: também não" note="Henselmans 2026 · 11 ECRs" show={step >= 4} born={step === 4}>
            <Forest />
        </Cell>
    </div>
);

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Pause, Play, X } from 'lucide-react';
import { AnimalChip, CalcChip, DesignChip, IllustrativeChip } from '../../../sims/kit/chips';
import { Chip } from '../../../sims/kit/ui';
import { C } from '../../../sims/kit/palette';
import { DUR, EASE_OUT } from '../../../../lib/motion';
import type { StepChip, StepInfo } from './types';

/* Peças fixas do modal: painel lateral da etapa, trilha de etapas com ▶ e véu de carregamento. */

const ChipView = ({ chip }: { chip: StepChip }) => {
    switch (chip.kind) {
        case 'illustrative': return <IllustrativeChip />;
        case 'calc': return <CalcChip>{chip.text}</CalcChip>;
        case 'animal': return <AnimalChip>{chip.text ?? 'dado em animal'}</AnimalChip>;
        case 'design': return <DesignChip>{chip.text}</DesignChip>;
        case 'model': return <Chip color={C.caveat}>{chip.text}</Chip>;
    }
};

interface PanelProps { data: StepInfo; step: number; total: number; accent: string; onClose: () => void; children?: ReactNode }

export const StepPanel = ({ data, step, total, accent, onClose, children }: PanelProps) => (
    <aside className="absolute right-0 top-0 bottom-0 flex flex-col bg-[#0A1222]" style={{ width: 'var(--panel-w)' }}>
        <div className="flex items-center gap-3 px-6 pt-5 pb-2">
            <span className="flex-1 text-[15px] font-mono tracking-widest" style={{ color: accent }} aria-label={`Etapa ${step + 1} de ${total}`}>
                ETAPA {step + 1}/{total}
            </span>
            <button
                type="button" onClick={onClose} aria-label="Fechar modelo 3D (Esc)"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gray-200 transition-transform duration-150 ease-out hover:bg-white/20 hover:text-white active:scale-[0.96]"
            >
                <X size={19} aria-hidden />
            </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
            <motion.div key={step} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.enter, ease: EASE_OUT }}>
                <p className="mb-1.5 text-[15px] font-mono font-semibold tracking-widest" style={{ color: accent }}>{data.badge}</p>
                <h3 className="mb-3 text-[clamp(26px,1.7vw,32px)] font-semibold leading-[1.12] text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    {data.title}
                </h3>
                <p className="text-[clamp(20px,1.2vw,23px)] leading-[1.45] text-gray-100">{data.text}</p>
                {data.chips && data.chips.length > 0 && (
                    <div className="mt-3.5 flex flex-wrap gap-2">
                        {data.chips.map((c, i) => <ChipView key={i} chip={c} />)}
                    </div>
                )}
                {children}
                <ul className="mt-4 space-y-1">
                    {data.sources.map(s => <li key={s} className="text-[14px] leading-snug text-gray-400">{s}</li>)}
                </ul>
            </motion.div>
        </div>
        <p className="shrink-0 px-6 pb-4 pt-2 text-[14px] text-gray-400">
            ← → etapas · Espaço ▶ · Esc fecha
        </p>
    </aside>
);

interface RailProps { steps: readonly StepInfo[]; step: number; playing: boolean; accent: string; onGo: (i: number) => void; onTogglePlay: () => void }

/** Trilha de etapas: botão ▶ e uma pílula por etapa (a atual na cor do modelo). */
export const StepRail = ({ steps, step, playing, accent, onGo, onTogglePlay }: RailProps) => (
    <nav className="pointer-events-auto flex items-center gap-2 rounded-full bg-[rgba(4,10,20,0.9)] p-1.5" aria-label="Etapas do modelo">
        <button
            type="button" onClick={onTogglePlay} aria-label={playing ? 'Pausar a sequência (Espaço)' : 'Tocar a sequência (Espaço)'}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#04080F] transition-transform duration-150 ease-out active:scale-[0.96]"
            style={{ background: accent }}
        >
            {playing ? <Pause size={18} aria-hidden /> : <Play size={18} aria-hidden className="ml-0.5" />}
        </button>
        {steps.map((s, i) => {
            const on = i === step;
            return (
                <button
                    key={s.short} type="button" onClick={() => onGo(i)} aria-current={on ? 'step' : undefined}
                    className="h-10 rounded-full px-3 text-[15px] font-semibold transition-colors duration-200 ease-out active:scale-[0.97]"
                    style={on ? { background: `${accent}2E`, color: '#fff', boxShadow: `inset 0 0 0 2px ${accent}` } : { color: i < step ? '#D1D5DB' : '#9CA3AF' }}
                >
                    <span className="mr-1.5 font-mono" style={{ color: on ? accent : undefined }}>{i + 1}</span>{s.short}
                </button>
            );
        })}
    </nav>
);

export const LoadingVeil = ({ text }: { text: string }) => (
    <motion.div
        role="status" aria-live="polite"
        className="absolute inset-0 z-[44] flex items-center justify-center bg-[#04080F] pointer-events-none"
        initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
        <motion.p className="text-[18px] font-mono tracking-wider text-gray-300" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.3 }}>
            {text}
        </motion.p>
    </motion.div>
);

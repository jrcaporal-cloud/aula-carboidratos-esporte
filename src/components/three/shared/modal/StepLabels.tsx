import { Html } from '@react-three/drei';
import type { StepLabel } from './types';

/*
 * Rótulos HTML ancorados na cena, feitos para a videochamada: caixa chapada quase opaca, borda de
 * 2 px na cor da estrutura, texto ≥ 18 px, linha-guia de 2 px. Sem sombra e sem brilho.
 * Aparecem quando a câmera pousa (esmaecimento de 250 ms) e saem na troca de etapa.
 */

const PAD = 6;

const Label = ({ spec, index }: { spec: StepLabel; index: number }) => {
    const left = spec.dx < 0;
    return (
        <group position={[...spec.at]}>
            <Html zIndexRange={[40, 10]} style={{ pointerEvents: 'none' }}>
                <div
                    className="absolute left-0 top-0 opacity-0 animate-[label-in_250ms_cubic-bezier(0.23,1,0.32,1)_forwards]"
                    style={{ animationDelay: `${Math.min(index * 70, 280)}ms` }}
                >
                    <svg width={1} height={1} className="absolute left-0 top-0 overflow-visible" aria-hidden>
                        <line x1={0} y1={0} x2={spec.dx} y2={spec.dy} stroke={spec.color} strokeWidth={2} />
                        <circle cx={0} cy={0} r={5} fill={spec.color} stroke="#04080F" strokeWidth={2} />
                    </svg>
                    <div
                        className="absolute whitespace-nowrap rounded-lg px-3 py-1.5 font-body"
                        style={{
                            left: spec.dx + (left ? -PAD : PAD),
                            top: spec.dy,
                            transform: `translate(${left ? '-100%' : '0'}, -50%)`,
                            background: 'rgba(4,10,20,0.94)',
                            border: `2px solid ${spec.color}`,
                            textAlign: left ? 'right' : 'left',
                        }}
                    >
                        <div className="text-[19px] font-semibold leading-tight text-white">{spec.text}</div>
                        {spec.sub && <div className="mt-0.5 text-[16px] leading-snug text-gray-200">{spec.sub}</div>}
                    </div>
                </div>
            </Html>
        </group>
    );
};

export const StepLabels = ({ labels, visible }: { labels: readonly StepLabel[]; visible: boolean }) =>
    visible ? <>{labels.map((l, i) => <Label key={l.id} spec={l} index={i} />)}</> : null;

/** Keyframe do esmaecimento dos rótulos (injetado uma vez pelo modal). */
export const LABEL_KEYFRAMES = '@keyframes label-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }';

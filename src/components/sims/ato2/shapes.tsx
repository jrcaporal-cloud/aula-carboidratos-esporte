import { HEX, PENT, SUGAR_COLOR, type SugarKind } from './geometry';

export type { SugarKind } from './geometry';

/** Uma unidade de açúcar (raio 24 em escala 1). A galactose leva um furo para não depender só da cor. */
export const SugarShape = ({ kind }: { kind: SugarKind }) => {
    if (kind === 'gyg') return <rect x={-22} y={-22} width={44} height={44} rx={10} fill={SUGAR_COLOR.gyg} />;
    if (kind === 'fru') return <polygon points={PENT} fill={SUGAR_COLOR.fru} />;
    return (
        <g>
            <polygon points={HEX} fill={SUGAR_COLOR[kind]} />
            {kind === 'gal' && <circle r={8} fill="#04080F" />}
        </g>
    );
};

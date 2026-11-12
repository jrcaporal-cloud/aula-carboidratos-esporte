import type { ShellState } from '../shared/modal/types';
import { STUDIO_LIGHT, useToonRamp } from '../shared/toon';
import { Cell } from './Cell';
import { Molecules } from './Molecules';

/* Cena do enterócito: cenário fixo + moléculas. A porta "GLUT2 apical" só aparece na etapa da hipótese. */
export const EnteroScene = ({ clock, step }: ShellState) => {
    const ramp = useToonRamp();
    return (
        <>
            <ambientLight intensity={STUDIO_LIGHT.ambient} />
            <directionalLight position={[...STUDIO_LIGHT.keyPos]} intensity={STUDIO_LIGHT.key} />
            <directionalLight position={[...STUDIO_LIGHT.fillPos]} intensity={STUDIO_LIGHT.fill} />
            <Cell ramp={ramp} ghost={step === 4} />
            <Molecules clock={clock} ramp={ramp} />
        </>
    );
};

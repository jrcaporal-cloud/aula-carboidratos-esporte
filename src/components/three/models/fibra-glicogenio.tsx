import { useCallback, useState } from 'react';
import { C } from '../../sims/kit/palette';
import type { Modal3DProps } from '../registry';
import { FiberPanelKeys } from '../fibra-glicogenio/FiberKeys';
import { FiberHud } from '../fibra-glicogenio/FiberPanel';
import { FiberScene } from '../fibra-glicogenio/FiberScene';
import { FIBER_STEPS, KEY_PRESET, type Keys } from '../fibra-glicogenio/steps';
import { Modal3DShell } from '../shared/modal/Modal3DShell';

/*
 * Modelo 3D "fibra-glicogenio" (slides 40 e 65): a fibra em corte com os três endereços do glicogênio,
 * o GLUT4 subindo por duas chaves (insulina × contração) e o Ca²⁺ do RS (ligação com o slide 66).
 */

const CAMERA = { fov: 38, near: 0.1, far: 200, minDistance: 5, maxDistance: 70 } as const;

const FibraGlicogenio = ({ onClose }: Modal3DProps) => {
    // escolhas do espectador por etapa; sem escolha, vale o preset da etapa
    const [chosen, setChosen] = useState<Readonly<Record<number, Keys>>>({});
    const keysFor = useCallback((step: number): Keys | null => chosen[step] ?? KEY_PRESET[step] ?? null, [chosen]);
    const choose = useCallback((step: number, k: Keys) => setChosen(c => ({ ...c, [step]: k })), []);
    return (
        <Modal3DShell
            onClose={onClose}
            ariaLabel="Fibra muscular, glicogênio e GLUT4, em 3D"
            kicker="Modelo 3D · fibra muscular"
            title="Três endereços, duas chaves"
            scaleNote="corte esquemático · fora de escala"
            accent={C.glycogenSoft}
            loadingText="Montando a fibra…"
            steps={FIBER_STEPS}
            camera={CAMERA}
            scene={s => <FiberScene {...s} keys={keysFor(s.step)} />}
            hud={s => <FiberHud step={s.step} keys={keysFor(s.step)} />}
            panelExtra={s => <FiberPanelKeys keys={keysFor(s.step)} onChange={k => choose(s.step, k)} />}
        />
    );
};

export default FibraGlicogenio;

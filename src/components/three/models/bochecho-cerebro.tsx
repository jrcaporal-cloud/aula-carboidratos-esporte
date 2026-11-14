import { useState } from 'react';
import { C } from '../../sims/kit/palette';
import type { Modal3DProps } from '../registry';
import { RinseHud, RinseNumbers } from '../bochecho-cerebro/RinseHud';
import { RinseScene, type Rinse } from '../bochecho-cerebro/RinseScene';
import { RINSE_STEPS } from '../bochecho-cerebro/steps';
import { Modal3DShell } from '../shared/modal/Modal3DShell';

/*
 * Modelo 3D "bochecho-cerebro" (slide 110): o mecanismo POTENCIAL do bochecho com carboidrato, da boca
 * ao córtex motor. Cabeça em corte sagital, língua e botão gustativo (sensor não identificado), nervo
 * até o NTS, ínsula/opérculo e orbitofrontal, estriado e cingulado anterior (× sacarina) e M1.
 */

const CAMERA = { fov: 38, near: 0.1, far: 200, minDistance: 6, maxDistance: 70 } as const;

const BochechoCerebro = ({ onClose }: Modal3DProps) => {
    const [rinse, setRinse] = useState<Rinse>('carb');
    return (
        <Modal3DShell
            onClose={onClose}
            ariaLabel="Bochecho com carboidrato: da boca ao cérebro, em 3D"
            kicker="Modelo 3D · bochecho"
            title="Da boca ao córtex motor"
            scaleNote="mecanismo potencial · esquema fora de escala"
            accent={C.glucoseSoft}
            loadingText="Montando a cabeça em corte…"
            steps={RINSE_STEPS}
            camera={CAMERA}
            scene={s => <RinseScene {...s} rinse={rinse} />}
            hud={s => <RinseHud step={s.step} rinse={rinse} onRinse={setRinse} />}
            panelExtra={s => <RinseNumbers step={s.step} />}
            headerBackdrop
        />
    );
};

export default BochechoCerebro;

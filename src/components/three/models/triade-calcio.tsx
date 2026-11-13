import { C } from '../../sims/kit/palette';
import type { Modal3DProps } from '../registry';
import { Modal3DShell } from '../shared/modal/Modal3DShell';
import { TriadHud } from '../triade-calcio/TriadHud';
import { TriadScene } from '../triade-calcio/TriadScene';
import { TRIAD_STEPS } from '../triade-calcio/steps';

/*
 * Modelo 3D "triade-calcio" (slide 66): o acoplamento excitação-contração na tríade (túbulo T, DHPR,
 * RyR1, cisternas do RS, SERCA, troponina C), os três endereços do glicogênio e o "?" do elo
 * glicogênio → RyR1 (associação, causa não provada).
 */

const CAMERA = { fov: 38, near: 0.1, far: 200, minDistance: 4, maxDistance: 60 } as const;

const TriadeCalcio = ({ onClose }: Modal3DProps) => (
    <Modal3DShell
        onClose={onClose}
        ariaLabel="Tríade, cálcio e glicogênio na fibra muscular, em 3D"
        kicker="Modelo 3D · tríade"
        title="O cálcio que falha"
        scaleNote="corte esquemático · fora de escala"
        accent={C.insulinSoft}
        loadingText="Montando a tríade…"
        steps={TRIAD_STEPS}
        camera={CAMERA}
        scene={s => <TriadScene {...s} />}
        hud={s => <TriadHud step={s.step} />}
    />
);

export default TriadeCalcio;

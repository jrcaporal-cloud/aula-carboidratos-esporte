import { C } from '../../sims/kit/palette';
import type { Modal3DProps } from '../registry';
import { GranuleHud } from '../glicogenio-granulo/GranuleHud';
import { GranuleScene } from '../glicogenio-granulo/GranuleScene';
import { GRANULE_STEPS } from '../glicogenio-granulo/steps';
import { Modal3DShell } from '../shared/modal/Modal3DShell';

/*
 * Modelo 3D "glicogenio-granulo" (slide 22): o grânulo de glicogênio crescendo da glicogenina até a
 * casca de 12 camadas, depois a fosforilase mordendo as pontas e a sintase devolvendo glicose.
 */

const CAMERA = { fov: 38, near: 0.2, far: 400, minDistance: 5, maxDistance: 140 } as const;

const GlicogenioGranulo = ({ onClose }: Modal3DProps) => (
    <Modal3DShell
        onClose={onClose}
        ariaLabel="Grânulo de glicogênio em 3D"
        kicker="Modelo 3D · grânulo de glicogênio"
        title="A árvore de glicose"
        scaleNote="1 hexágono = 1 glicose · modelo estilizado"
        accent={C.glycogenSoft}
        loadingText="Montando 53 mil glicoses…"
        steps={GRANULE_STEPS}
        camera={CAMERA}
        scene={s => <GranuleScene {...s} />}
        hud={s => <GranuleHud step={s.step} />}
    />
);

export default GlicogenioGranulo;

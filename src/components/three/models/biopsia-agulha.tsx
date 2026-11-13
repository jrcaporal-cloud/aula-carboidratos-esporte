import { C } from '../../sims/kit/palette';
import type { Modal3DProps } from '../registry';
import { BiopsyNumber } from '../biopsia-agulha/BiopsyNumber';
import { BiopsyScene } from '../biopsia-agulha/BiopsyScene';
import { BIOPSY_STEPS } from '../biopsia-agulha/steps';
import { Modal3DShell } from '../shared/modal/Modal3DShell';

/*
 * Modelo 3D "biopsia-agulha" (slide 60): a coxa em corte, a agulha de Bergström entrando no vasto
 * lateral, o cilindro cortando o fragmento e o fragmento ampliado com os grânulos de glicogênio.
 */

const CAMERA = { fov: 38, near: 0.1, far: 200, minDistance: 4, maxDistance: 60 } as const;

const BiopsiaAgulha = ({ onClose }: Modal3DProps) => (
    <Modal3DShell
        onClose={onClose}
        ariaLabel="Biópsia por agulha de Bergström no vasto lateral, em 3D"
        kicker="Modelo 3D · biópsia por agulha"
        title="A agulha de Bergström"
        scaleNote="corte esquemático · fora de escala"
        accent={C.glycogenSoft}
        loadingText="Montando a coxa e a agulha…"
        steps={BIOPSY_STEPS}
        camera={CAMERA}
        scene={s => <BiopsyScene {...s} />}
        panelExtra={s => <BiopsyNumber step={s.step} />}
    />
);

export default BiopsiaAgulha;

import { C } from '../../sims/kit/palette';
import type { Modal3DProps } from '../registry';
import { EnteroHud } from '../enterocito/EnteroHud';
import { EnteroScene } from '../enterocito/EnteroScene';
import { ENTERO_STEPS } from '../enterocito/steps';
import { Modal3DShell } from '../shared/modal/Modal3DShell';

/*
 * Modelo 3D "enterocito" (slides 26 e 104): a célula do intestino com SGLT1 e GLUT5 no ápice e GLUT2
 * na base; o teto de uma pista, a hipótese do GLUT2 apical que caiu e as duas pistas (glicose + frutose).
 */

const CAMERA = { fov: 38, near: 0.1, far: 200, minDistance: 6, maxDistance: 60 } as const;

const Enterocito = ({ onClose }: Modal3DProps) => (
    <Modal3DShell
        onClose={onClose}
        ariaLabel="Enterócito e as duas pistas de absorção, em 3D"
        kicker="Modelo 3D · enterócito"
        title="Duas pistas no intestino"
        scaleNote="corte esquemático · fora de escala"
        accent={C.glucose}
        loadingText="Montando o enterócito…"
        steps={ENTERO_STEPS}
        camera={CAMERA}
        scene={s => <EnteroScene {...s} />}
        hud={s => <EnteroHud step={s.step} />}
    />
);

export default Enterocito;

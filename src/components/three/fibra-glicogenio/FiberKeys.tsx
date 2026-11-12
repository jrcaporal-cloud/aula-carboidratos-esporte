import { KeyControls } from './FiberPanel';
import type { Keys } from './steps';

/** Controles das chaves só nas etapas que as têm (insulina e contração). */
export const FiberPanelKeys = ({ keys, onChange }: { keys: Keys | null; onChange: (k: Keys) => void }) =>
    keys ? <KeyControls keys={keys} onChange={onChange} /> : null;

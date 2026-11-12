import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { phase } from '../shared/math';
import type { ClockRef } from '../shared/modal/types';
import { COLORS, MYOFIBRILS, MYO_R } from './layout';

/*
 * O Ca²⁺ saindo do RS: uma nuvem curta de íons em volta de cada miofibrila, disparada uma vez pela
 * etapa (não pisca em loop). Na etapa do cálcio sai 85% da nuvem (ORTENBLAD2011: liberação a 85%
 * logo após a prova). Íons grandes o bastante para o vídeo (≥ 4 px no quadro aberto).
 */

const PER = 6;
const COUNT = MYOFIBRILS.length * PER;
const M = new THREE.Matrix4();
const P = new THREE.Vector3();
const S = new THREE.Vector3();
const Q = new THREE.Quaternion();

/** Etapa → [início do disparo (s), fração da nuvem]. A etapa 4 só dispara se a contração estiver ligada. */
const PUFF: Readonly<Record<number, readonly [number, number]>> = { 4: [0.4, 1], 5: [1.6, 0.85] };

interface Props { clock: ClockRef; ramp: THREE.Texture; contraction: boolean }

export const Calcium = ({ clock, ramp, contraction }: Props) => {
    const mesh = useMemo(() => {
        const m = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.11, 1), new THREE.MeshToonMaterial({ color: COLORS.calcium, gradientMap: ramp }), COUNT);
        m.frustumCulled = false;
        return m;
    }, [ramp]);
    const live = useRef(mesh);
    useEffect(() => { live.current = mesh; }, [mesh]);
    useEffect(() => () => { mesh.geometry.dispose(); (mesh.material as THREE.Material).dispose(); mesh.dispose(); }, [mesh]);
    const on = useRef(contraction);
    useEffect(() => { on.current = contraction; }, [contraction]);

    useFrame(() => {
        const puff = PUFF[clock.step];
        const active = puff && (clock.step !== 4 || on.current);
        const u = active ? phase(clock.t, puff[0], puff[0] + 1.1) : 0;
        const amount = active ? puff[1] : 0;
        const m = live.current;
        MYOFIBRILS.forEach(([x, y], i) => {
            for (let j = 0; j < PER; j++) {
                const seed = ((i * 7 + j * 13) % 20) / 20;
                const a = (j / PER) * Math.PI * 2 + i * 0.7;
                const r = MYO_R + 0.12 + u * (0.35 + 0.15 * (j % 2));
                P.set(x + Math.cos(a) * r, y + Math.sin(a) * r, 0.05 + u * 0.45);
                M.compose(P, Q, S.setScalar(u > 0.02 && seed < amount ? 1 : 0));
                m.setMatrixAt(i * PER + j, M);
            }
        });
        m.instanceMatrix.needsUpdate = true;
    });
    return <primitive object={mesh} />;
};

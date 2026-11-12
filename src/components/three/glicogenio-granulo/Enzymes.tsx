import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { C } from '../../sims/kit/palette';
import { phase, seg } from '../shared/math';
import type { ClockRef } from '../shared/modal/types';
import { CHAIN } from './build';
import { ENZYME_CHAINS, GRANULE } from './data';
import { GLUCOSE_R } from './glucoseMaterial';
import { ENZYME_COLOR } from './steps';

/*
 * Etapas 5 e 6: as enzimas pousam nas pontas das cadeias externas. A fosforilase arranca as glicoses
 * da ponta (glicose-1-fosfato voa para fora) no mesmo ritmo em que o shader encolhe a cadeia; a sintase
 * traz glicoses de fora (UDP-glicose) que somem ao encaixar, quando o shader devolve a glicose violeta.
 * Tudo é função de (etapa, t): voltar ou repetir a etapa refaz a mesma cena.
 */

const PER_CHAIN = CHAIN - 4;
const FLYERS = ENZYME_CHAINS.length * PER_CHAIN;
const HIDE = new THREE.Vector3(0, 0, 0);
const M = new THREE.Matrix4();
const P = new THREE.Vector3();
const S = new THREE.Vector3();
const Q = new THREE.Quaternion();

const dimer = () => mergeGeometries([
    new THREE.SphereGeometry(1.0, 18, 12).translate(-0.72, 0, 0),
    new THREE.SphereGeometry(1.0, 18, 12).translate(0.72, 0, 0),
]);
const lobed = () => mergeGeometries([
    new THREE.SphereGeometry(1.1, 18, 12),
    new THREE.SphereGeometry(0.6, 14, 10).translate(0, 1.05, 0),
]);

/** Pose da enzima na cadeia i: chega de fora (u: 0 → 1) e pousa logo além da ponta. */
const placeEnzyme = (mesh: THREE.InstancedMesh, slot: number, ci: number, u: number) => {
    const c = GRANULE.chains[ci];
    const s = u <= 0 ? 0 : 1;
    P.copy(c.pts[CHAIN - 1]).addScaledVector(c.dir, 1.6 + (1 - u) * 16);
    Q.setFromUnitVectors(THREE.Object3D.DEFAULT_UP, c.dir);
    M.compose(P, Q, S.setScalar(s));
    mesh.setMatrixAt(slot, M);
};

interface Props { clock: ClockRef; ramp: THREE.Texture }

export const Enzymes = ({ clock, ramp }: Props) => {
    const parts = useMemo(() => {
        const mat = (color: string) => new THREE.MeshToonMaterial({ color, gradientMap: ramp });
        const phos = new THREE.InstancedMesh(dimer(), mat(ENZYME_COLOR.phosphorylase), ENZYME_CHAINS.length);
        const syn = new THREE.InstancedMesh(lobed(), mat(ENZYME_COLOR.synthase), ENZYME_CHAINS.length);
        const fly = new THREE.InstancedMesh(new THREE.CylinderGeometry(GLUCOSE_R * 1.15, GLUCOSE_R * 1.15, 0.2, 6), mat(C.glucose), FLYERS);
        for (const m of [phos, syn, fly]) { m.frustumCulled = false; m.count = m.instanceMatrix.count; }
        return { phos, syn, fly };
    }, [ramp]);

    useEffect(() => () => {
        for (const m of [parts.phos, parts.syn, parts.fly]) {
            m.geometry.dispose();
            (m.material as THREE.Material).dispose();
            m.dispose();
        }
    }, [parts]);

    const live = useRef(parts);
    useEffect(() => { live.current = parts; }, [parts]);

    useFrame(() => {
        const { step, t } = clock;
        const { phos, syn, fly } = live.current;
        const phosIn = step === 4 ? phase(t, 0, 1) : 0;
        const synIn = step === 5 ? phase(t, 0, 1) : 0;
        ENZYME_CHAINS.forEach((ci, i) => {
            const lag = (i % 5) * 0.04;
            placeEnzyme(phos, i, ci, Math.max(0, phosIn - lag));
            placeEnzyme(syn, i, ci, Math.max(0, synIn - lag));
        });
        ENZYME_CHAINS.forEach((ci, i) => {
            const c = GRANULE.chains[ci];
            for (let j = 0; j < PER_CHAIN; j++) {
                const k = CHAIN - 1 - j; // 12 → 4
                const slot = i * PER_CHAIN + j;
                if (step === 4) {
                    // sai quando o shader a remove (mesma conta de uBite) e voa para fora
                    const dt = t - (1 + (2 * j) / PER_CHAIN);
                    const live = dt > 0 && dt < 1.3;
                    P.copy(c.pts[k]).addScaledVector(c.dir, Math.max(dt, 0) * 9);
                    S.setScalar(live ? 1 - seg(dt, 0.9, 1.3) : 0);
                } else if (step === 5) {
                    // chega quando o shader a devolve (mesma conta de uRebuild)
                    const kk = 4 + j;
                    const arrive = 1 + (2 * j) / PER_CHAIN;
                    const u = seg(t, arrive - 1.1, arrive);
                    const live = u > 0 && u < 1;
                    P.copy(GRANULE.chains[ci].pts[kk]).addScaledVector(c.dir, (1 - u) * 10);
                    S.setScalar(live ? 1 : 0);
                } else {
                    P.copy(HIDE);
                    S.setScalar(0);
                }
                Q.setFromUnitVectors(THREE.Object3D.DEFAULT_UP, c.dir);
                M.compose(P, Q, S);
                fly.setMatrixAt(slot, M);
            }
        });
        phos.instanceMatrix.needsUpdate = true;
        syn.instanceMatrix.needsUpdate = true;
        fly.instanceMatrix.needsUpdate = true;
    });

    return (
        <>
            <primitive object={parts.phos} />
            <primitive object={parts.syn} />
            <primitive object={parts.fly} />
        </>
    );
};

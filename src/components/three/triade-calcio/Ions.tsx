import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { phase } from '../shared/math';
import type { ClockRef } from '../shared/modal/types';
import type { Params } from '../shared/tween';
import { COLORS } from './layout';
import { ION_COUNT, ION_R, ionOut, releasePath, troponinPos, uptakePath } from './kinematics';
import { ION_RELEASE, ION_UPTAKE_AT, STEP, type TriadKey } from './steps';

/*
 * Os íons de Ca²⁺: 8 fichas azuis grandes (4 por tríade), sem rastro e sem brilho. Cada etapa toca a
 * sua viagem uma vez: saída RyR1 → troponina C, volta troponina → SERCA. Com o glicogênio baixo sai
 * 85% (7 de 8; contagem ilustrativa, o número medido fica no placar).
 */

const M = new THREE.Matrix4();
const P = new THREE.Vector3();
const S = new THREE.Vector3();
const Q = new THREE.Quaternion();
const LEG = 1.0;
const STAGGER = 0.09;
/** Contorno escuro: casca 22% maior. */
const RIM = 1.22;

/** Onde está o íon i e se aparece, para (etapa, t, contração). */
const place = (i: number, step: number, t: number, con: number): number => {
    const rel = ION_RELEASE[step];
    if (rel) {
        if (!ionOut(i, rel.share)) return 0;
        const u = phase(t, rel.at + i * STAGGER, rel.at + LEG + i * STAGGER);
        releasePath(i, u, con, P);
        return u > 0.01 ? 1 : 0;
    }
    if (step === STEP.serca) {
        const u = phase(t, ION_UPTAKE_AT + i * STAGGER * 1.4, ION_UPTAKE_AT + LEG * 1.3 + i * STAGGER * 1.4);
        uptakePath(i, u, con, P);
        return u < 0.97 ? 1 : 0;
    }
    if (step === STEP.doubt) {
        troponinPos(i, con, P, 0.17);
        return ionOut(i, ION_RELEASE[STEP.low].share) ? 1 : 0;
    }
    return 0;
};

interface Props { clock: ClockRef; params: Params<TriadKey> }

export const Ions = ({ clock, params }: Props) => {
    const parts = useMemo(() => {
        // ficha chapada na cor do slide + contorno escuro (casca de trás, um pouco maior), como no 2D
        const geo = new THREE.IcosahedronGeometry(ION_R, 2);
        const fill = new THREE.InstancedMesh(geo, new THREE.MeshBasicMaterial({ color: COLORS.calcium }), ION_COUNT);
        const rim = new THREE.InstancedMesh(geo, new THREE.MeshBasicMaterial({ color: '#04080F', side: THREE.BackSide }), ION_COUNT);
        for (const m of [fill, rim]) {
            m.frustumCulled = false;
            for (let i = 0; i < ION_COUNT; i++) m.setMatrixAt(i, M.compose(P.set(0, 0, 0), Q, S.setScalar(0)));
        }
        return { fill, rim, geo };
    }, []);
    const live = useRef(parts);
    useEffect(() => { live.current = parts; }, [parts]);
    useEffect(() => () => {
        for (const m of [parts.fill, parts.rim]) { (m.material as THREE.Material).dispose(); m.dispose(); }
        parts.geo.dispose();
    }, [parts]);

    useFrame(() => {
        const { fill, rim } = live.current;
        for (let i = 0; i < ION_COUNT; i++) {
            const s = place(i, clock.step, clock.t, params.con);
            fill.setMatrixAt(i, M.compose(P, Q, S.setScalar(s)));
            rim.setMatrixAt(i, M.compose(P, Q, S.setScalar(s * RIM)));
        }
        fill.instanceMatrix.needsUpdate = true;
        rim.instanceMatrix.needsUpdate = true;
    });
    return <><primitive object={parts.fill} /><primitive object={parts.rim} /></>;
};

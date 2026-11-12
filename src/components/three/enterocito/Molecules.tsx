import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import type { ClockRef } from '../shared/modal/types';
import { APICAL_Y, DOOR, MOL_Z } from './layout';
import { FROZEN_AT, SCHEDULES, SPEED, type Kind, type Mol } from './schedule';

/*
 * As moléculas: glicose e galactose em hexágono (piranose), frutose em pentágono (furanose), Na⁺ em
 * esfera. Três InstancedMesh; por quadro só as matrizes mudam, com objetos de rascunho reaproveitados.
 */

const CAP = { hex: 64, pent: 48, ion: 24 } as const;
const COLOR: Record<Kind, THREE.Color> = {
    glc: new THREE.Color(C.glucose), gal: new THREE.Color(C.glucoseSoft), fru: new THREE.Color(C.fructose), na: new THREE.Color('#E2E8F0'),
};
const KHK_DONE = new THREE.Color('#9D174D');
const M = new THREE.Matrix4();
const P = new THREE.Vector3();
const S = new THREE.Vector3();
const USED = { hex: 0, pent: 0, ion: 0 };
const FACE = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);

/** Marca matrizes e cores para subir à GPU neste quadro. */
const flag = (mesh: THREE.InstancedMesh) => {
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
};

/** Ponto contínuo da fila (zigue-zague) para um lugar fracionário. */
const slotAt = (x: number, slot: number, out: THREE.Vector3) =>
    out.set(x - Math.cos(slot * Math.PI) * 0.22, APICAL_Y + 1.0 + slot * 0.48, MOL_Z);

const alongPost = (m: Mol, s: number, out: THREE.Vector3): boolean => {
    const L = m.postLen;
    if (s >= L[L.length - 1]) { const e = m.post[m.post.length - 1]; out.set(e[0], e[1], MOL_Z); return false; }
    let i = 1;
    while (L[i] < s) i++;
    const k = (s - L[i - 1]) / Math.max(L[i] - L[i - 1], 1e-4);
    const a = m.post[i - 1];
    const b = m.post[i];
    out.set(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, MOL_Z);
    return true;
};

/** Posição de uma molécula no instante t; devolve a escala (0 = escondida). */
const place = (m: Mol, all: readonly Mol[], t: number, out: THREE.Vector3): number => {
    if (t < m.t0) return 0;
    if (t < m.arrive) {
        const k = (t - m.t0) / Math.max(m.arrive - m.t0, 1e-4);
        out.set(m.pre[0][0] + (m.pre[1][0] - m.pre[0][0]) * k, m.pre[0][1] + (m.pre[1][1] - m.pre[0][1]) * k, MOL_Z);
        return 1;
    }
    if (t < m.pass) {
        let slot = 0;
        for (const o of all) if (o.door === m.door && o.kind !== 'na' && o.pass < m.pass) slot += Math.min(Math.max((o.pass - t) / 0.35, 0), 1);
        slotAt(DOOR[m.door].x, slot, out);
        return 1;
    }
    const moving = alongPost(m, (t - m.pass) * SPEED, out);
    // a frutose da KHK fica no citosol (fosforilada); as outras somem no fim do capilar
    return moving ? 1 : m.post.length <= 4 ? 0.85 : 0;
};

interface Props { clock: ClockRef; ramp: THREE.Texture }

export const Molecules = ({ clock, ramp }: Props) => {
    const parts = useMemo(() => {
        const mat = () => new THREE.MeshToonMaterial({ color: '#ffffff', gradientMap: ramp });
        const make = (geo: THREE.BufferGeometry, n: number) => {
            const mesh = new THREE.InstancedMesh(geo, mat(), n);
            mesh.frustumCulled = false;
            for (let i = 0; i < n; i++) mesh.setColorAt(i, COLOR.glc);
            return mesh;
        };
        const hex = make(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 6), CAP.hex);
        const pent = make(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 5), CAP.pent);
        const ion = make(new THREE.SphereGeometry(0.17, 14, 10), CAP.ion);
        return { hex, pent, ion, list: [hex, pent, ion] as const };
    }, [ramp]);
    const live = useRef(parts);
    useEffect(() => { live.current = parts; }, [parts]);
    useEffect(() => () => {
        for (const m of parts.list) { m.geometry.dispose(); (m.material as THREE.Material).dispose(); m.dispose(); }
    }, [parts]);

    useFrame(() => {
        const { hex, pent, ion } = live.current;
        const sched = SCHEDULES[clock.step];
        const t = FROZEN_AT[clock.step] ?? clock.t;
        const used = USED;
        used.hex = 0; used.pent = 0; used.ion = 0;
        for (const m of sched) {
            const s = place(m, sched, t, P);
            const key = m.kind === 'fru' ? 'pent' : m.kind === 'na' ? 'ion' : 'hex';
            const mesh = key === 'pent' ? pent : key === 'ion' ? ion : hex;
            const i = used[key]++;
            if (i >= CAP[key]) continue;
            M.compose(P, FACE, S.setScalar(s));
            mesh.setMatrixAt(i, M);
            mesh.setColorAt(i, m.kind === 'fru' && s > 0 && s < 1 ? KHK_DONE : COLOR[m.kind]);
        }
        hex.count = Math.min(used.hex, CAP.hex);
        pent.count = Math.min(used.pent, CAP.pent);
        ion.count = Math.min(used.ion, CAP.ion);
        flag(hex);
        flag(pent);
        flag(ion);
    });

    return (
        <>
            <primitive object={parts.hex} />
            <primitive object={parts.pent} />
            <primitive object={parts.ion} />
        </>
    );
};

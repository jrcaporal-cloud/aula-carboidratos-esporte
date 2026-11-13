import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Params } from '../shared/tween';
import { A_HALF, ACTIN_LEN, ACTIN_YZ, COLORS, FRONT_Z, MYOSIN_YZ, MYO_R, MYO_Z } from './layout';
import { ION_COUNT, troponinPos, zLineX } from './kinematics';
import type { TriadKey } from './steps';

/*
 * As miofibrilas. As duas de trás são cilindros fechados (banda A escura, banda I clara); a da frente
 * vem aberta: miosina (grossa, fixa no centro), actina (fina, presa à linha Z) e a troponina C onde o
 * Ca²⁺ pousa. Na contração as linhas Z andam para o centro, a actina vai junto e a banda I encurta;
 * a banda A não muda de tamanho.
 */

const BACK_Z = MYO_Z.filter(z => z !== FRONT_Z);
const SIDES = [-1, 1] as const;
const ACTIN_R = 0.065;
const MYOSIN_R = 0.14;
const M = new THREE.Matrix4();
const P = new THREE.Vector3();
const S = new THREE.Vector3();
const Q = new THREE.Quaternion();

interface Parts {
    aBand: THREE.InstancedMesh;
    iBand: THREE.InstancedMesh;
    zDisc: THREE.InstancedMesh;
    myosin: THREE.InstancedMesh;
    actin: THREE.InstancedMesh;
    tnc: THREE.InstancedMesh;
}

const build = (ramp: THREE.Texture): Parts => {
    const toon = (color: string) => new THREE.MeshToonMaterial({ color, gradientMap: ramp });
    const alongX = (r: number, seg: number) => new THREE.CylinderGeometry(r, r, 1, seg).rotateZ(Math.PI / 2);
    const parts: Parts = {
        aBand: new THREE.InstancedMesh(alongX(MYO_R, 32), toon(COLORS.aBand), BACK_Z.length),
        iBand: new THREE.InstancedMesh(alongX(MYO_R - 0.04, 32), toon(COLORS.iBand), BACK_Z.length * 2),
        zDisc: new THREE.InstancedMesh(alongX(MYO_R + 0.04, 32), toon(COLORS.zline), MYO_Z.length * 2),
        myosin: new THREE.InstancedMesh(alongX(MYOSIN_R, 10), toon(COLORS.myosin), MYOSIN_YZ.length),
        actin: new THREE.InstancedMesh(alongX(ACTIN_R, 6), toon(COLORS.actin), ACTIN_YZ.length * 2),
        tnc: new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.1, 1), toon(COLORS.troponin), ION_COUNT),
    };
    // fixos: banda A das miofibrilas de trás e a miosina da miofibrila aberta
    BACK_Z.forEach((z, i) => parts.aBand.setMatrixAt(i, M.compose(P.set(0, 0, z), Q.identity(), S.set(A_HALF * 2, 1, 1))));
    MYOSIN_YZ.forEach(([y, z], i) => parts.myosin.setMatrixAt(i, M.compose(P.set(0, y, FRONT_Z + z), Q.identity(), S.set(A_HALF * 2, 1, 1))));
    for (const m of Object.values(parts)) m.frustumCulled = false;
    return parts;
};

/** Escreve as peças que andam com a linha Z. */
const pose = (p: Parts, con: number) => {
    SIDES.forEach((s, si) => {
        const zx = zLineX(s, con);
        const iLen = Math.abs(zx) - A_HALF;
        BACK_Z.forEach((z, k) => p.iBand.setMatrixAt(si * BACK_Z.length + k, M.compose(P.set(s * (A_HALF + iLen / 2), 0, z), Q.identity(), S.set(iLen, 1, 1))));
        MYO_Z.forEach((z, k) => p.zDisc.setMatrixAt(si * MYO_Z.length + k, M.compose(P.set(zx, 0, z), Q.identity(), S.set(0.14, 1, 1))));
        ACTIN_YZ.forEach(([y, z], k) => p.actin.setMatrixAt(si * ACTIN_YZ.length + k, M.compose(P.set(zx - (s * ACTIN_LEN) / 2, y, FRONT_Z + z), Q.identity(), S.set(ACTIN_LEN, 1, 1))));
    });
    for (let i = 0; i < ION_COUNT; i++) p.tnc.setMatrixAt(i, M.compose(troponinPos(i, con, P, 0.04), Q.identity(), S.setScalar(1)));
    for (const m of [p.iBand, p.zDisc, p.actin, p.tnc]) m.instanceMatrix.needsUpdate = true;
};

interface Props { params: Params<TriadKey>; ramp: THREE.Texture }

export const Myofibrils = ({ params, ramp }: Props) => {
    const parts = useMemo(() => {
        const p = build(ramp);
        pose(p, 0);
        return p;
    }, [ramp]);
    const live = useRef(parts);
    useEffect(() => { live.current = parts; }, [parts]);
    useEffect(() => () => {
        for (const m of Object.values(parts)) {
            m.geometry.dispose();
            (m.material as THREE.Material).dispose();
            m.dispose();
        }
    }, [parts]);
    const last = useRef(-1);

    useFrame(() => {
        const con = params.con;
        if (Math.abs(con - last.current) < 1e-4) return;
        last.current = con;
        pose(live.current, con);
    });

    return (
        <group>
            {Object.values(parts).map(m => <primitive key={m.uuid} object={m} />)}
        </group>
    );
};


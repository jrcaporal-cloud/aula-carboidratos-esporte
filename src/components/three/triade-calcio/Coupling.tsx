import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { seg } from '../shared/math';
import type { ClockRef } from '../shared/modal/types';
import type { Params } from '../shared/tween';
import { COLORS, FRONT_Z, JUNCTIONS, MEM_Y, RAIL_Y, RING_R, T_TUBE, TRIAD_X } from './layout';
import { AP_WINDOW, type TriadKey } from './steps';

/*
 * O acoplamento: o potencial de ação (anel branco) desce o túbulo T e corre pelo trilho até as
 * miofibrilas; o DHPR (âmbar, na parede do túbulo) inclina e "puxa" o RyR1 (azul, na cisterna), que
 * se abre em duas metades. Os pares ficam no arco da miofibrila aberta que a câmera vê.
 */

const M = new THREE.Matrix4();
const P = new THREE.Vector3();
const S = new THREE.Vector3();
const Q = new THREE.Quaternion();
const QT = new THREE.Quaternion();
const X = new THREE.Vector3(1, 0, 0);
const Z = new THREE.Vector3(0, 0, 1);
const UP = new THREE.Quaternion().setFromAxisAngle(X, Math.PI / 2);
const STUB_SHARE = 0.55;

interface Parts { dhpr: THREE.InstancedMesh; ryr: THREE.InstancedMesh; ap: THREE.InstancedMesh }

/** Orientação de um par no anel: y local = direção radial, z local = tangente. */
const radial = (a: number, out: THREE.Quaternion) => out.setFromAxisAngle(X, Math.PI / 2 - a);

const writeJunctions = (p: Parts, gate: number) => {
    JUNCTIONS.forEach((j, i) => {
        // DHPR: na parede do túbulo, inclina para o lado da cisterna quando o sinal chega
        radial(j.a, Q).multiply(QT.setFromAxisAngle(Z, -j.side * gate * 0.5));
        P.set(j.x + j.side * (T_TUBE + 0.08), RING_R * Math.sin(j.a), FRONT_Z + RING_R * Math.cos(j.a));
        p.dhpr.setMatrixAt(i, M.compose(P, Q, S.setScalar(1)));
        // RyR1: duas metades que se afastam pela tangente (o canal abre)
        radial(j.a, Q);
        const open = 0.07 + gate * 0.08;
        for (const h of [-1, 1]) {
            const ta = j.a + (h * open) / RING_R;
            P.set(j.x + j.side * 0.41, RING_R * Math.sin(ta), FRONT_Z + RING_R * Math.cos(ta));
            p.ryr.setMatrixAt(i * 2 + (h > 0 ? 1 : 0), M.compose(P, Q, S.setScalar(1)));
        }
    });
    p.dhpr.instanceMatrix.needsUpdate = true;
    p.ryr.instanceMatrix.needsUpdate = true;
};

/** Anel do potencial de ação: tubo abaixo (u até STUB_SHARE) e depois pelo trilho, para os dois lados. */
const writeAp = (p: Parts, u: number) => {
    const on = u > 0 && u < 1 ? 1 : 0;
    TRIAD_X.forEach((x, k) => {
        for (const dir of [-1, 1]) {
            const i = k * 2 + (dir > 0 ? 1 : 0);
            if (u < STUB_SHARE) {
                P.set(x, MEM_Y - (MEM_Y - RAIL_Y) * (u / STUB_SHARE), 0);
                Q.copy(UP);
            } else {
                P.set(x, RAIL_Y, dir * FRONT_Z * ((u - STUB_SHARE) / (1 - STUB_SHARE)));
                Q.identity();
            }
            p.ap.setMatrixAt(i, M.compose(P, Q, S.setScalar(on)));
        }
    });
    p.ap.instanceMatrix.needsUpdate = true;
};

interface Props { clock: ClockRef; params: Params<TriadKey>; ramp: THREE.Texture }

export const Coupling = ({ clock, params, ramp }: Props) => {
    const parts = useMemo<Parts>(() => {
        const toon = (color: string) => new THREE.MeshToonMaterial({ color, gradientMap: ramp });
        const p: Parts = {
            dhpr: new THREE.InstancedMesh(new THREE.BoxGeometry(0.14, 0.26, 0.2), toon(COLORS.dhpr), JUNCTIONS.length),
            ryr: new THREE.InstancedMesh(new THREE.BoxGeometry(0.2, 0.32, 0.12), toon(COLORS.ryr), JUNCTIONS.length * 2),
            ap: new THREE.InstancedMesh(new THREE.TorusGeometry(T_TUBE + 0.15, 0.08, 8, 28), new THREE.MeshBasicMaterial({ color: COLORS.ap }), TRIAD_X.length * 2),
        };
        for (const m of Object.values(p)) m.frustumCulled = false;
        writeJunctions(p, 0);
        writeAp(p, 0);
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

    useFrame(() => {
        const p = live.current;
        writeJunctions(p, params.gate);
        const w = AP_WINDOW[clock.step];
        writeAp(p, w ? seg(clock.t, w[0], w[1]) : 0);
    });

    return (
        <group>
            {Object.values(parts).map(m => <primitive key={m.uuid} object={m} />)}
        </group>
    );
};

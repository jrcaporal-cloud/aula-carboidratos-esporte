import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { lerp, smooth } from '../shared/math';
import type { Params } from '../shared/tween';
import { FRAG_OUT, NEEDLE, PRE, TIP_IN, TISSUE, WIN_C } from './layout';
import { closedOf, tipXOf } from './motion';
import type { BiopsyKey } from './steps';

/*
 * A agulha de Bergström, deitada logo à frente da face cortada: cânula de ponta fechada com uma janela
 * voltada para a câmera, o cilindro cortante por dentro (aparece pela janela e atrás do colar) e o
 * êmbolo na ponta de trás. O fragmento é um elipsoide na cor do vasto lateral. Por quadro, só posições
 * e escalas mudam (nada é alocado no useFrame).
 */

const DEG = Math.PI / 180;
const ALONG_X: readonly [number, number, number] = [0, 0, -Math.PI / 2];
const WIN_LEN = NEEDLE.win[1] - NEEDLE.win[0];
const LINER_R = NEEDLE.r - 0.03;
const STEEL = '#D6D3D1';
const LUMEN = '#141B27';

/** Trecho de tubo ao longo de x, de x0 a x1 (opcionalmente sem a frente: a janela). */
const Tube = ({ x0, x1, r, ramp, color, gap = 0 }: { x0: number; x1: number; r: number; ramp: THREE.Texture; color: string; gap?: number }) => (
    <mesh position={[(x0 + x1) / 2, 0, 0]} rotation={[...ALONG_X]}>
        <cylinderGeometry args={[r, r, x1 - x0, 40, 1, true, gap / 2, Math.PI * 2 - gap]} />
        <meshToonMaterial color={color} gradientMap={ramp} />
    </mesh>
);

export const Needle = ({ params, ramp }: { params: Params<BiopsyKey>; ramp: THREE.Texture }) => {
    const group = useRef<THREE.Group>(null);
    const cutter = useRef<THREE.Group>(null);
    useFrame(() => {
        const g = group.current;
        const c = cutter.current;
        if (!g || !c) return;
        g.visible = params.show > 0.5;
        g.position.x = tipXOf(params);
        c.position.x = lerp(NEEDLE.cutOpen, NEEDLE.cutClosed, closedOf(params));
    });
    const { r, tipLen, collar, knob } = NEEDLE;
    return (
        <group ref={group} position={[TIP_IN + PRE, NEEDLE.y, NEEDLE.z]}>
            {/* ponta fechada */}
            <mesh position={[tipLen / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <coneGeometry args={[r, tipLen, 40]} />
                <meshToonMaterial color={STEEL} gradientMap={ramp} />
            </mesh>
            <Tube x0={tipLen} x1={NEEDLE.win[0]} r={r} ramp={ramp} color={STEEL} />
            <Tube x0={NEEDLE.win[0]} x1={NEEDLE.win[1]} r={r} ramp={ramp} color={STEEL} gap={NEEDLE.winArc * DEG} />
            <Tube x0={NEEDLE.win[1]} x1={collar.x} r={r} ramp={ramp} color={STEEL} />
            {/* forro escuro: o que se vê pela janela aberta */}
            <mesh position={[(tipLen + collar.x) / 2, 0, 0]} rotation={[...ALONG_X]}>
                <cylinderGeometry args={[LINER_R, LINER_R, collar.x - tipLen, 32, 1, true]} />
                <meshBasicMaterial color={LUMEN} side={THREE.BackSide} />
            </mesh>
            {/* colar da cânula */}
            <mesh position={[collar.x + collar.len / 2, 0, 0]} rotation={[...ALONG_X]}>
                <cylinderGeometry args={[collar.r, collar.r, collar.len, 40]} />
                <meshToonMaterial color="#A8A29E" gradientMap={ramp} />
            </mesh>
            {/* cilindro cortante + êmbolo: andam juntos; x = frente do cilindro */}
            <group ref={cutter} position={[NEEDLE.cutOpen, 0, 0]}>
                <mesh position={[NEEDLE.cutterLen / 2, 0, 0]} rotation={[...ALONG_X]}>
                    <cylinderGeometry args={[NEEDLE.cutterR, NEEDLE.cutterR, NEEDLE.cutterLen, 32]} />
                    <meshToonMaterial color={C.co2} gradientMap={ramp} />
                </mesh>
                <mesh position={[NEEDLE.cutterLen + knob.len / 2, 0, 0]} rotation={[...ALONG_X]}>
                    <cylinderGeometry args={[knob.r, knob.r, knob.len, 40]} />
                    <meshToonMaterial color={C.caveat} gradientMap={ramp} />
                </mesh>
            </group>
        </group>
    );
};

/** O pedaço de músculo: cai na janela, fica preso no cilindro, sai com a agulha e é retirado. */
export const Fragment = ({ params, ramp }: { params: Params<BiopsyKey>; ramp: THREE.Texture }) => {
    const ref = useRef<THREE.Mesh>(null);
    useFrame(() => {
        const m = ref.current;
        if (!m) return;
        const t = params.tissue;
        const l = smooth(params.lift);
        m.visible = params.show > 0.5 && t > 0.01;
        const x0 = tipXOf(params) + WIN_C;
        m.position.set(lerp(x0, FRAG_OUT[0], l), lerp(NEEDLE.y, FRAG_OUT[1], l), lerp(NEEDLE.z - 0.04, FRAG_OUT[2], l));
        const s = Math.max(t, 0.001) * (1 + 0.8 * l);
        m.scale.set(WIN_LEN * 0.4 * s, 0.21 * s, 0.21 * s);
    });
    return (
        <mesh ref={ref} visible={false}>
            <sphereGeometry args={[1, 32, 16]} />
            <meshToonMaterial color={TISSUE.vl} gradientMap={ramp} />
        </mesh>
    );
};

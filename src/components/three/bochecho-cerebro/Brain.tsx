import { useMemo, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import type { Params } from '../shared/tween';
import { domeGeometry, type Vec2 } from './geometry';
import { ACC, BRAIN, CALLOSUM, COLORS, INSULA, M1_K, M1_PHI, M1_SPAN, NTS, OFC, STRIATUM, type Ellipsoid } from './layout';
import { colorPair, toon, useOwned, withGyri } from './materials';
import type { RinseKey } from './steps';

/*
 * O hemisfério aberto no corte: o forro (lado de dentro, opaco, com giros) dá profundidade visto do
 * corte; o córtex em vidro só aparece de fora. Dentro, cada região é uma peça separada, em ardósia
 * clara em repouso e âmbar quando é a vez dela (uma região-acento por etapa): ínsula/opérculo
 * frontal, orbitofrontal, estriado, cingulado anterior (na face medial) e M1 (forrando o alto da
 * parede). O NTS fica marcado (anel claro) na face cortada do bulbo.
 */

const BRAIN_GEO = () => domeGeometry(BRAIN, { rings: 24 });
const M1_GEO = () => domeGeometry(BRAIN, { rings: 14, k: M1_K, span: M1_SPAN, phi: M1_PHI });
const SPHERE = () => new THREE.SphereGeometry(1, 32, 20);

const tubeOf = (pts: readonly (readonly [number, number, number])[], r: number) =>
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)), false, 'centripetal'), 64, r, 12, false);

/** Quanto cada região está acesa agora (0–1); `carb` apaga estriado e cingulado com sacarina. */
export interface Lights { params: Params<RinseKey>; carb: MutableRefObject<number> }

const EllipsoidPart = ({ e, geo, mat }: { e: Ellipsoid; geo: THREE.BufferGeometry; mat: THREE.Material }) => (
    <mesh geometry={geo} material={mat} position={[...e.c]} rotation={e.rot ? [...e.rot] : [0, 0, 0]} scale={[...e.r]} />
);

const rimPoints = (o: readonly Vec2[]): [number, number, number][] => [...o, o[0]].map(([x, y]) => [x, y, 0.01]);

export const Brain = ({ ramp, lights }: { ramp: THREE.Texture; lights: Lights }) => {
    const shellGeo = useOwned(BRAIN_GEO, []);
    const m1Geo = useOwned(M1_GEO, []);
    const sphere = useOwned(SPHERE, []);
    const accGeo = useOwned(() => tubeOf(ACC, 0.5), []);
    const ccGeo = useOwned(() => tubeOf(CALLOSUM, 0.22), []);
    const lining = useOwned(() => withGyri(toon(COLORS.brainInside, ramp, { side: THREE.BackSide }), 0.3), [ramp]);
    const glass = useOwned(() => withGyri(toon(COLORS.brainGlass, ramp, { opacity: 0.22 }), 0.25), [ramp]);
    const cc = useOwned(() => toon(COLORS.callosum, ramp), [ramp]);
    const mats = {
        ins: useOwned(() => toon(COLORS.calm, ramp), [ramp]),
        ofc: useOwned(() => toon(COLORS.calm, ramp), [ramp]),
        str: useOwned(() => toon(COLORS.calm, ramp), [ramp]),
        acc: useOwned(() => toon(COLORS.calm, ramp), [ramp]),
        m1: useOwned(() => toon(COLORS.calm, ramp, { side: THREE.DoubleSide }), [ramp]),
        nts: useOwned(() => toon(COLORS.calm, ramp), [ramp]),
    };
    const pair = useMemo(() => colorPair(COLORS.calm, COLORS.lit), []);
    const rim = useMemo(() => rimPoints(BRAIN.outline), []);

    useFrame(() => {
        const p = lights.params;
        const carb = lights.carb.current;
        const [calm, lit] = pair;
        mats.ins.color.lerpColors(calm, lit, p.ins);
        mats.ofc.color.lerpColors(calm, lit, p.ofc);
        mats.str.color.lerpColors(calm, lit, p.str * carb);
        mats.acc.color.lerpColors(calm, lit, p.acc * carb);
        mats.m1.color.lerpColors(calm, lit, p.m1);
        mats.nts.color.lerpColors(calm, lit, p.nts);
    });

    return (
        <group>
            <mesh geometry={shellGeo} material={lining} />
            <mesh geometry={shellGeo} material={glass} renderOrder={2} />
            <Line points={rim} color={COLORS.brainRim} lineWidth={2.5} />
            <mesh geometry={ccGeo} material={cc} />
            <mesh geometry={accGeo} material={mats.acc} />
            <mesh geometry={m1Geo} material={mats.m1} />
            <EllipsoidPart e={INSULA} geo={sphere} mat={mats.ins} />
            <EllipsoidPart e={OFC} geo={sphere} mat={mats.ofc} />
            {STRIATUM.map((e, i) => <EllipsoidPart key={i} e={e} geo={sphere} mat={mats.str} />)}
            <EllipsoidPart e={NTS} geo={sphere} mat={mats.nts} />
            {/* o NTS marcado na face cortada do bulbo: anel claro em volta */}
            <mesh position={[NTS.c[0], NTS.c[1], 0.02]}>
                <ringGeometry args={[NTS.r[0] + 0.08, NTS.r[0] + 0.2, 40]} />
                <meshBasicMaterial color={COLORS.pathOn} />
            </mesh>
        </group>
    );
};

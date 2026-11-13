import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import {
    CIST_DX, CIST_TUBE, COLORS, FRONT_Z, LONG_ANGLES, LONG_R, LONG_TUBE, LONG_X0, MEM_X, MEM_Y, MEM_Z, MYO_Z, RAIL_Y, RING_R,
    SERCA_ANGLES, SERCA_X, T_TUBE, TRIAD_X, WINDOW,
} from './layout';

/*
 * A parte fixa da tríade: sarcolema (placa cortada na frente), túbulos T (anel em volta de cada
 * miofibrila + trilho + tubo até a membrana), cisternas do RS dos dois lados de cada túbulo, RS
 * longitudinal sobre a banda A e as bombas SERCA. Tudo instanciado por tipo.
 */

const RING_ROT = new THREE.Matrix4().makeRotationY(Math.PI / 2);
const ALONG_X = new THREE.Matrix4().makeRotationZ(Math.PI / 2);
const ALONG_Z = new THREE.Matrix4().makeRotationX(Math.PI / 2);

const at = (x: number, y: number, z: number, rot?: THREE.Matrix4) => {
    const m = new THREE.Matrix4().makeTranslation(x, y, z);
    return rot ? m.multiply(rot) : m;
};

/** Malha instanciada estática: geometria + material toon + matrizes, liberada ao desmontar. */
const useStatic = (geo: () => THREE.BufferGeometry, color: string, ramp: THREE.Texture, mats: readonly THREE.Matrix4[], open = false) => {
    const mesh = useMemo(() => {
        // anel cortado: as duas faces, para a boca do tubo não ficar transparente
        const side = open ? THREE.DoubleSide : THREE.FrontSide;
        const m = new THREE.InstancedMesh(geo(), new THREE.MeshToonMaterial({ color, gradientMap: ramp, side }), mats.length);
        mats.forEach((mat, i) => m.setMatrixAt(i, mat));
        m.instanceMatrix.needsUpdate = true;
        m.computeBoundingSphere();
        return m;
    }, [geo, color, ramp, mats, open]);
    useEffect(() => () => { mesh.geometry.dispose(); (mesh.material as THREE.Material).dispose(); mesh.dispose(); }, [mesh]);
    return mesh;
};

const BACK_Z = MYO_Z.filter(z => z !== FRONT_Z);
const T_RINGS = TRIAD_X.flatMap(x => BACK_Z.map(z => at(x, 0, z, RING_ROT)));
const T_RINGS_CUT = TRIAD_X.map(x => at(x, 0, FRONT_Z, RING_ROT));
const CISTERNS = TRIAD_X.flatMap(x => [-1, 1].flatMap(s => BACK_Z.map(z => at(x + s * CIST_DX, 0, z, RING_ROT))));
const CISTERNS_CUT = TRIAD_X.flatMap(x => [-1, 1].map(s => at(x + s * CIST_DX, 0, FRONT_Z, RING_ROT)));
const LONG_LEN = LONG_X0 * 2;
const LONG_TUBES = MYO_Z.flatMap(z => LONG_ANGLES.map(a => at(0, LONG_R * Math.sin(a), z + LONG_R * Math.cos(a), ALONG_X)));
const RAIL_SPAN = MYO_Z[MYO_Z.length - 1] - MYO_Z[0];
const RAILS = TRIAD_X.map(x => at(x, RAIL_Y, (MYO_Z[0] + MYO_Z[MYO_Z.length - 1]) / 2, ALONG_Z));
const STUB_LEN = MEM_Y - RAIL_Y;
const STUBS = TRIAD_X.map(x => at(x, RAIL_Y + STUB_LEN / 2, 0));

/** SERCA: cilindro curto saindo do tubo longitudinal em direção à miofibrila (miofibrila da frente). */
const SERCAS = [-1, 1].flatMap(s => SERCA_X.flatMap(x => SERCA_ANGLES.map(a => {
    const r = LONG_R - LONG_TUBE - 0.08;
    const rot = new THREE.Matrix4().makeRotationX(Math.PI / 2 - a);
    return at(s * x, r * Math.sin(a), FRONT_Z + r * Math.cos(a), rot);
})));

const geoTRing = () => new THREE.TorusGeometry(RING_R, T_TUBE, 10, 48);
const geoCist = () => new THREE.TorusGeometry(RING_R, CIST_TUBE, 12, 48);

/**
 * Anel cortado: cobre tudo menos a janela da frente. No anel girado (RING_ROT), o ângulo local θ do
 * toro corresponde a a = π − θ; o arco começa em θ0 = −π − WINDOW[0] e mede 2π − largura da janela.
 */
const cutRing = (tube: number, radial: number) => () => {
    const arc = Math.PI * 2 - (WINDOW[1] - WINDOW[0]);
    return new THREE.TorusGeometry(RING_R, tube, radial, 40, arc).rotateZ(-Math.PI - WINDOW[0]);
};
const geoTRingCut = cutRing(T_TUBE, 10);
const geoCistCut = cutRing(CIST_TUBE, 12);
const geoLong = () => new THREE.CylinderGeometry(LONG_TUBE, LONG_TUBE, LONG_LEN, 10);
const geoRail = () => new THREE.CylinderGeometry(T_TUBE, T_TUBE, RAIL_SPAN, 10);
const geoStub = () => new THREE.CylinderGeometry(T_TUBE + 0.04, T_TUBE + 0.04, STUB_LEN, 12);
const geoSerca = () => new THREE.CylinderGeometry(0.17, 0.17, 0.3, 14);

const Membrane = ({ ramp }: { ramp: THREE.Texture }) => {
    const depth = MEM_Z[1] - MEM_Z[0];
    const cz = (MEM_Z[0] + MEM_Z[1]) / 2;
    return (
        <group>
            <mesh position={[0, MEM_Y + 0.09, cz]}>
                <boxGeometry args={[MEM_X * 2, 0.18, depth]} />
                <meshToonMaterial color={COLORS.sarcolemma} gradientMap={ramp} />
            </mesh>
            {/* borda clara na face cortada (frente) */}
            <mesh position={[0, MEM_Y + 0.09, MEM_Z[1] + 0.005]}>
                <planeGeometry args={[MEM_X * 2, 0.18]} />
                <meshBasicMaterial color={COLORS.sarcolemmaEdge} />
            </mesh>
            {/* a boca de cada túbulo T no sarcolema */}
            {TRIAD_X.map(x => (
                <mesh key={x} position={[x, MEM_Y + 0.185, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[T_TUBE + 0.04, T_TUBE + 0.2, 24]} />
                    <meshBasicMaterial color={COLORS.ttubule} />
                </mesh>
            ))}
        </group>
    );
};

export const Structure = ({ ramp }: { ramp: THREE.Texture }) => {
    const tRings = useStatic(geoTRing, COLORS.ttubule, ramp, T_RINGS);
    const rails = useStatic(geoRail, COLORS.ttubule, ramp, RAILS);
    const stubs = useStatic(geoStub, COLORS.ttubule, ramp, STUBS);
    const cist = useStatic(geoCist, COLORS.sr, ramp, CISTERNS);
    const tRingsCut = useStatic(geoTRingCut, COLORS.ttubule, ramp, T_RINGS_CUT, true);
    const cistCut = useStatic(geoCistCut, COLORS.sr, ramp, CISTERNS_CUT, true);
    const longs = useStatic(geoLong, COLORS.sr, ramp, LONG_TUBES);
    const serca = useStatic(geoSerca, COLORS.serca, ramp, SERCAS);
    return (
        <group>
            <Membrane ramp={ramp} />
            {[tRings, tRingsCut, rails, stubs, cist, cistCut, longs, serca].map(m => <primitive key={m.uuid} object={m} />)}
        </group>
    );
};

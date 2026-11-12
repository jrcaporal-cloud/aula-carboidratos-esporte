import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { COLORS, FIBER_LEN, FIBER_R, MYOFIBRILS, MYO_R } from './layout';

/*
 * O corpo da fibra: sarcolema (parede + borda clara na face cortada), sarcoplasma, miofibrilas
 * instanciadas, o retículo sarcoplasmático (anel em volta de cada miofibrila) e túbulos T.
 * As miofibrilas usam MeshToonMaterial + onBeforeCompile: na tampa (a face cortada), a rede de
 * filamentos grossos em pontos; na lateral, as estrias do sarcômero. Os dois padrões esmaecem por
 * fwidth quando o período cai abaixo de ~4 px, em vez de virar moiré no codec.
 */

const HALF = FIBER_LEN / 2;
const Z0 = -HALF;

const MYO_PATCH_VS_HEAD = 'varying vec3 vLocal;\n';
const MYO_PATCH_VS = '#include <begin_vertex>\nvLocal = position;\n';
const MYO_PATCH_FS_HEAD = /* glsl */ `
varying vec3 vLocal;
float latticeDots(vec2 p, float period) {
    // rede hexagonal: duas grades retangulares deslocadas
    vec2 s = vec2(1.0, 1.7320508) * period;
    vec2 a = mod(p, s) - 0.5 * s;
    vec2 b = mod(p - 0.5 * s, s) - 0.5 * s;
    float d = min(length(a), length(b));
    float w = fwidth(d) + 1e-4;
    float dot_ = 1.0 - smoothstep(0.32 * period - w, 0.32 * period + w, d);
    float fade = 1.0 - smoothstep(0.08, 0.2, fwidth(p.x) / period); // < ~5 px por período: some
    return dot_ * fade;
}
float bands(float y, float period) {
    float f = abs(fract(y / period) - 0.5) * 2.0;
    float w = fwidth(y / period) * 2.0 + 1e-4;
    float band = smoothstep(0.45 - w, 0.45 + w, f);
    float fade = 1.0 - smoothstep(0.1, 0.25, fwidth(y) / period);
    return band * fade;
}
`;
const MYO_PATCH_FS = /* glsl */ `
vec4 diffuseColor = vec4( diffuse, opacity );
{
    float cap = step(${(HALF - 0.002).toFixed(3)}, vLocal.y);
    // os dois padrões são sempre calculados (fwidth fora de desvio condicional)
    float k = mix(bands(vLocal.y, 1.3), latticeDots(vLocal.xz, 0.24), cap);
    diffuseColor.rgb *= 1.0 - 0.32 * k;
}
`;

const makeMyoMaterial = (ramp: THREE.Texture) => {
    const m = new THREE.MeshToonMaterial({ color: COLORS.myofibril, gradientMap: ramp });
    m.onBeforeCompile = shader => {
        shader.vertexShader = MYO_PATCH_VS_HEAD + shader.vertexShader.replace('#include <begin_vertex>', MYO_PATCH_VS);
        shader.fragmentShader = MYO_PATCH_FS_HEAD + shader.fragmentShader.replace('vec4 diffuseColor = vec4( diffuse, opacity );', MYO_PATCH_FS);
    };
    m.customProgramCacheKey = () => 'fibra-miofibrila-v1';
    return m;
};

const Myofibrils = ({ ramp }: { ramp: THREE.Texture }) => {
    const ref = useRef<THREE.InstancedMesh>(null);
    const material = useMemo(() => makeMyoMaterial(ramp), [ramp]);
    useEffect(() => () => material.dispose(), [material]);
    useLayoutEffect(() => {
        const mesh = ref.current;
        if (!mesh) return;
        const m = new THREE.Matrix4();
        const rot = new THREE.Matrix4().makeRotationX(Math.PI / 2);
        MYOFIBRILS.forEach(([x, y], i) => mesh.setMatrixAt(i, m.makeTranslation(x, y, Z0).multiply(rot)));
        mesh.instanceMatrix.needsUpdate = true;
    }, []);
    return (
        <instancedMesh ref={ref} args={[undefined, material, MYOFIBRILS.length]}>
            <cylinderGeometry args={[MYO_R, MYO_R, FIBER_LEN, 28]} />
        </instancedMesh>
    );
};

/** Retículo sarcoplasmático: um anel em volta de cada miofibrila, logo atrás da face cortada. */
const Reticulum = ({ ramp }: { ramp: THREE.Texture }) => {
    const ref = useRef<THREE.InstancedMesh>(null);
    useLayoutEffect(() => {
        const mesh = ref.current;
        if (!mesh) return;
        const m = new THREE.Matrix4();
        MYOFIBRILS.forEach(([x, y], i) => mesh.setMatrixAt(i, m.makeTranslation(x, y, -0.02)));
        mesh.instanceMatrix.needsUpdate = true;
    }, []);
    return (
        <instancedMesh ref={ref} args={[undefined, undefined, MYOFIBRILS.length]}>
            <torusGeometry args={[MYO_R + 0.1, 0.09, 8, 36]} />
            <meshToonMaterial color={COLORS.sr} gradientMap={ramp} />
        </instancedMesh>
    );
};

const T_ANGLES = [0.2, 1.25, 2.3, 3.35, 4.4, 5.45];

export const Fiber = ({ ramp }: { ramp: THREE.Texture }) => (
    <group>
        {/* sarcoplasma (fundo da face cortada) */}
        <mesh position={[0, 0, -0.04]}><circleGeometry args={[FIBER_R, 96]} /><meshBasicMaterial color={COLORS.sarcoplasm} /></mesh>
        <mesh position={[0, 0, Z0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[FIBER_R + 0.3, FIBER_R + 0.3, FIBER_LEN, 120, 1, true]} />
            <meshToonMaterial color={COLORS.sarcolemma} gradientMap={ramp} />
        </mesh>
        <mesh position={[0, 0, 0.01]}><ringGeometry args={[FIBER_R, FIBER_R + 0.34, 120]} /><meshBasicMaterial color={COLORS.sarcolemmaEdge} /></mesh>
        <Myofibrils ramp={ramp} />
        <Reticulum ramp={ramp} />
        {/* túbulos T: entram pela membrana, logo atrás do RS */}
        {T_ANGLES.map(a => (
            <mesh key={a} position={[Math.cos(a) * (FIBER_R - 2.2), Math.sin(a) * (FIBER_R - 2.2), -0.9]} rotation={[0, 0, a - Math.PI / 2]}>
                <cylinderGeometry args={[0.14, 0.14, 4.6, 10]} />
                <meshToonMaterial color={COLORS.ttubule} gradientMap={ramp} />
            </mesh>
        ))}
    </group>
);

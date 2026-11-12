import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { SCREEN_PX_GLSL, drawingHeight } from '../shared/toon';
import type { Params } from '../shared/tween';
import { GRANULES } from './layout';
import type { FiberKey } from './steps';

/*
 * Os grânulos de glicogênio dos três endereços: uma InstancedMesh; cada grânulo sabe o endereço e
 * duas sementes (atributo aG). Revelação por endereço (uShow) e esvaziamento (uDeplete) são
 * uniformes: o quadro só escreve 6 números. Abaixo de ~1,5 px o grânulo não some: fica com 1,5 px.
 */

const R = 0.17;

const HEAD = /* glsl */ `
attribute vec3 aG;
uniform vec3 uShow, uDeplete;
${SCREEN_PX_GLSL}
`;
const BODY = /* glsl */ `
#include <begin_vertex>
{
    float pool = aG.x;
    float show = pool < 0.5 ? uShow.x : (pool < 1.5 ? uShow.y : uShow.z);
    float dep = pool < 0.5 ? uDeplete.x : (pool < 1.5 ? uDeplete.y : uDeplete.z);
    float s = clamp((show * 1.4 - aG.y * 0.4) * 2.5, 0.0, 1.0);
    s *= clamp((aG.z - dep) * 12.0, 0.0, 1.0);
    vec3 c = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    float px = screenPx((modelViewMatrix * vec4(c, 1.0)).xyz, ${R.toFixed(2)});
    transformed *= s * clamp(1.5 / max(px, 0.01), 1.0, 3.0);
}
`;

interface Props { params: Params<FiberKey>; ramp: THREE.Texture }

export const Glycogen = ({ params, ramp }: Props) => {
    const built = useMemo(() => {
        const uniforms = { uShow: { value: new THREE.Vector3() }, uDeplete: { value: new THREE.Vector3() }, uViewportH: { value: 720 } };
        const material = new THREE.MeshToonMaterial({ color: C.glycogen, gradientMap: ramp });
        material.onBeforeCompile = shader => {
            Object.assign(shader.uniforms, uniforms);
            shader.vertexShader = HEAD + shader.vertexShader.replace('#include <begin_vertex>', BODY);
        };
        material.customProgramCacheKey = () => 'fibra-glicogenio-graos-v1';
        const geo = new THREE.IcosahedronGeometry(R, 1);
        geo.setAttribute('aG', new THREE.InstancedBufferAttribute(new Float32Array(GRANULES.flatMap(g => [g.pool, g.reveal, g.deplete])), 3));
        const mesh = new THREE.InstancedMesh(geo, material, GRANULES.length);
        const m = new THREE.Matrix4();
        GRANULES.forEach((g, i) => mesh.setMatrixAt(i, m.makeTranslation(g.x, g.y, g.z)));
        mesh.frustumCulled = false;
        return { mesh, uniforms };
    }, [ramp]);
    const gpu = useRef(built.uniforms);
    useEffect(() => { gpu.current = built.uniforms; }, [built]);
    useEffect(() => () => {
        built.mesh.geometry.dispose();
        (built.mesh.material as THREE.Material).dispose();
        built.mesh.dispose();
    }, [built]);

    useFrame(state => {
        const u = gpu.current;
        u.uViewportH.value = drawingHeight(state);
        u.uShow.value.set(params.show0, params.show1, params.show2);
        u.uDeplete.value.set(params.dep0, params.dep1, params.dep2);
    });
    return <primitive object={built.mesh} />;
};

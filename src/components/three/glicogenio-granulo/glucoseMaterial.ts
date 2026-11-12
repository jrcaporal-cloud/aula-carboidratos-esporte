import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { SCREEN_PX_GLSL } from '../shared/toon';

/*
 * Material das ~53 mil glicoses (uma InstancedMesh, um draw call). Tudo o que muda por etapa é
 * uniforme: a CPU não toca nas instâncias depois de montadas. Cada glicose sabe a camada, a posição
 * na cadeia e a semente (atributo aData) e decide no vértice se existe, de que cor é e de que tamanho:
 *   uTiers   camadas crescidas (fracionário: a cadeia cresce glicose a glicose)
 *   uFresh   a frente de crescimento em âmbar (some quando a etapa termina)
 *   uShell   a casca externa (camada 12) acende em âmbar claro
 *   uCutN/D  corte: some o que passa do plano (vê-se o interior)
 *   uBite    fosforilase: as cadeias externas perdem glicoses da ponta até sobrarem 4
 *   uRebuild sintase: as glicoses voltam da 5ª para a ponta
 * Abaixo de ~1,5 px a glicose não some nem cintila: fica com 1,5 px e funde na cor de massa.
 */

export const GLUCOSE_R = 0.3;

export interface GlucoseUniforms {
    uTiers: { value: number };
    uFresh: { value: number };
    uShell: { value: number };
    uCutN: { value: THREE.Vector3 };
    uCutD: { value: number };
    uBite: { value: number };
    uRebuild: { value: number };
    uViewportH: { value: number };
    uViolet: { value: THREE.Color };
    uAmber: { value: THREE.Color };
    uShellCol: { value: THREE.Color };
    uMass: { value: THREE.Color };
}

const HEAD = /* glsl */ `
attribute vec4 aData;
varying vec3 vCol;
uniform float uTiers, uFresh, uShell, uCutD, uBite, uRebuild;
uniform vec3 uCutN, uViolet, uAmber, uShellCol, uMass;
${SCREEN_PX_GLSL}
`;

const BODY = /* glsl */ `
#include <begin_vertex>
{
    float tier = aData.x;
    float k = aData.y;
    float th = (tier - 1.0) + (k + 1.0) / 13.0;
    float grown = clamp((uTiers - th) * 8.0, 0.0, 1.0);
    float outer = step(11.5, tier) * step(3.5, k);
    float bitten = clamp(k - (12.0 - uBite * 9.0), 0.0, 1.0);
    float back = clamp(3.0 + uRebuild * 9.0 - k + 1.0, 0.0, 1.0);
    float present = grown * (1.0 - outer * bitten * (1.0 - back));
    vec3 cLocal = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    float keep = 1.0 - step(uCutD, dot(cLocal, uCutN));
    vec3 cView = (modelViewMatrix * vec4(cLocal, 1.0)).xyz;
    float px = screenPx(cView, ${GLUCOSE_R.toFixed(2)});
    float lift = clamp(1.5 / max(px, 0.01), 1.0, 3.0);
    float merge = 1.0 - smoothstep(0.9, 1.6, px);

    // trocas de cor por degrau, nunca por mistura: violeta + âmbar misturados dariam rosa (= frutose)
    float fresh = uFresh * step(uTiers - th, 0.6);
    float lit = step(11.5, tier) * step(aData.z, uShell);
    vec3 col = mix(uViolet, uShellCol, lit);
    col = mix(col, uAmber, step(0.5, fresh));
    vCol = mix(col, uMass, merge * 0.8);
    transformed *= present * keep * lift;
}
`;

export const makeGlucoseMaterial = (ramp: THREE.Texture): { material: THREE.MeshToonMaterial; uniforms: GlucoseUniforms } => {
    const uniforms: GlucoseUniforms = {
        uTiers: { value: 0 },
        uFresh: { value: 0 },
        uShell: { value: 0 },
        uCutN: { value: new THREE.Vector3(-0.35, 0.3, 1).normalize() },
        uCutD: { value: 99 },
        uBite: { value: 0 },
        uRebuild: { value: 0 },
        uViewportH: { value: 720 },
        uViolet: { value: new THREE.Color(C.glycogen) },
        uAmber: { value: new THREE.Color(C.glucose) },
        uShellCol: { value: new THREE.Color(C.glucoseSoft) },
        uMass: { value: new THREE.Color('#5B3BB0') },
    };
    const material = new THREE.MeshToonMaterial({ color: '#ffffff', gradientMap: ramp });
    material.onBeforeCompile = shader => {
        Object.assign(shader.uniforms, uniforms);
        shader.vertexShader = HEAD + shader.vertexShader.replace('#include <begin_vertex>', BODY);
        shader.fragmentShader = 'varying vec3 vCol;\n' + shader.fragmentShader.replace(
            'vec4 diffuseColor = vec4( diffuse, opacity );',
            'vec4 diffuseColor = vec4( vCol, opacity );',
        );
    };
    material.customProgramCacheKey = () => 'granulo-glicose-v1';
    return { material, uniforms };
};

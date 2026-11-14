import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

/*
 * Materiais do bochecho: toon de 3 faixas (o mesmo das outras cenas), vidro translúcido para a pele e
 * o córtex vistos de fora, e o padrão de giros (onBeforeCompile) no forro do cérebro: linhas largas
 * (~1,6 unidade entre elas, dezenas de pixels no vídeo) que somem por fwidth antes de cintilar.
 */

const GYRI_VS_HEAD = 'varying vec3 vObj;\n';
const GYRI_VS = '#include <begin_vertex>\nvObj = position;\n';
const GYRI_FS_HEAD = /* glsl */ `
varying vec3 vObj;
float gyriLine(vec3 p) {
    float a = p.x * 1.9 + 1.7 * sin(p.y * 1.1 + 0.6 * p.z) + 1.2 * sin(p.z * 1.4 - p.x * 0.5) + 0.9 * sin(p.y * 2.3);
    float w = fwidth(a);
    float d = abs(fract(a / 3.14159 + 0.5) - 0.5) * 3.14159;
    float line = 1.0 - smoothstep(0.16 - w, 0.16 + w, d);
    return line * (1.0 - smoothstep(0.45, 1.1, w));
}
`;
const gyriMain = (strength: number) => /* glsl */ `
vec4 diffuseColor = vec4( diffuse, opacity );
diffuseColor.rgb *= 1.0 - ${strength.toFixed(2)} * gyriLine(vObj);
`;

/** Liga o padrão de giros num MeshToonMaterial (cache de programa próprio por intensidade). */
export const withGyri = <M extends THREE.MeshToonMaterial>(m: M, strength: number): M => {
    m.onBeforeCompile = shader => {
        shader.vertexShader = GYRI_VS_HEAD + shader.vertexShader.replace('#include <begin_vertex>', GYRI_VS);
        shader.fragmentShader = GYRI_FS_HEAD + shader.fragmentShader.replace('vec4 diffuseColor = vec4( diffuse, opacity );', gyriMain(strength));
    };
    m.customProgramCacheKey = () => `bochecho-giros-${strength.toFixed(2)}`;
    return m;
};

export interface ToonOpts { side?: THREE.Side; opacity?: number }

export const toon = (color: string, ramp: THREE.Texture, o: ToonOpts = {}): THREE.MeshToonMaterial => {
    const glass = o.opacity !== undefined && o.opacity < 1;
    return new THREE.MeshToonMaterial({
        color, gradientMap: ramp, side: o.side ?? THREE.FrontSide,
        transparent: glass, opacity: o.opacity ?? 1, depthWrite: !glass,
    });
};

/** Cria uma vez e libera ao desmontar (materiais e geometrias imperativos). */
export const useOwned = <T extends { dispose: () => void }>(make: () => T, deps: readonly unknown[]): T => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const obj = useMemo(make, deps);
    useEffect(() => () => obj.dispose(), [obj]);
    return obj;
};

/** Cores fixas para a interpolação repouso → aceso (nada alocado por quadro). */
export const colorPair = (calm: string, lit: string): readonly [THREE.Color, THREE.Color] => [new THREE.Color(calm), new THREE.Color(lit)];

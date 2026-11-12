import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

/*
 * Luz chapada para a videochamada: MeshToonMaterial com 3 faixas (sombra, meio-tom, luz). Faixas
 * largas sobrevivem ao codec; degradê de Phong vira bloco. Mais o pedaço de GLSL que mede o tamanho
 * de um objeto na tela, para esmaecer o detalhe que cairia abaixo de ~1 px (vira cintilação no vídeo).
 */

/** Rampa de 3 faixas (NearestFilter: sem transição suave entre elas). Descartada pelo dono. */
export const makeToonRamp = (): THREE.DataTexture => {
    const tex = new THREE.DataTexture(new Uint8Array([110, 190, 255]), 3, 1, THREE.RedFormat);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    tex.needsUpdate = true;
    return tex;
};

/** Uma rampa por cena, liberada ao fechar o modal. */
export const useToonRamp = (): THREE.DataTexture => {
    const ramp = useMemo(() => makeToonRamp(), []);
    useEffect(() => () => ramp.dispose(), [ramp]);
    return ramp;
};

/** Material toon simples, descartado ao desmontar. */
export const useToon = (color: string, ramp: THREE.Texture): THREE.MeshToonMaterial => {
    const mat = useMemo(() => new THREE.MeshToonMaterial({ color, gradientMap: ramp }), [color, ramp]);
    useEffect(() => () => mat.dispose(), [mat]);
    return mat;
};

/** Altura do buffer de desenho em pixels físicos (para o uniforme `uViewportH`), lida no useFrame. */
export const drawingHeight = (state: { size: { height: number }; viewport: { dpr: number } }): number => state.size.height * state.viewport.dpr;

/**
 * GLSL (vértice): diâmetro em pixels de uma esfera de raio `r` centrada em `centerView` (espaço
 * da câmera). Usa projectionMatrix[1][1] = 1/tan(fov/2).
 */
export const SCREEN_PX_GLSL = /* glsl */ `
uniform float uViewportH;
float screenPx(vec3 centerView, float r) {
    return 2.0 * r * projectionMatrix[1][1] * 0.5 * uViewportH / max(-centerView.z, 0.001);
}
`;

/** Lambert de luz de estúdio: uma luz-chave alta e um ambiente forte (sombra nunca preta). */
export const STUDIO_LIGHT = { ambient: 1.35, key: 2.1, keyPos: [8, 14, 10] as const, fill: 0.55, fillPos: [-10, -4, -6] as const };

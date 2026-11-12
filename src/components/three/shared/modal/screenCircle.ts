import * as THREE from 'three';
import type { Pose, Vec3 } from './types';

/**
 * Ponto de um círculo de raio `r` em volta de `center`, no plano da tela de uma pose de câmera
 * (ângulo em graus, 0 = direita, 90 = cima). Serve para ancorar rótulos em anéis-régua voltados
 * para a câmera, que não têm ponto fixo no mundo.
 */
export const onScreenCircle = (pose: Pose, center: Vec3, r: number, deg: number): Vec3 => {
    const fwd = new THREE.Vector3(...pose.tgt).sub(new THREE.Vector3(...pose.pos)).normalize();
    const right = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0, 1, 0)).normalize();
    const up = new THREE.Vector3().crossVectors(right, fwd);
    const a = THREE.MathUtils.degToRad(deg);
    const p = new THREE.Vector3(...center).addScaledVector(right, Math.cos(a) * r).addScaledVector(up, Math.sin(a) * r);
    return [p.x, p.y, p.z];
};

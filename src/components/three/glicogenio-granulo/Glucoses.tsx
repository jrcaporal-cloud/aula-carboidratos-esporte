import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { seg } from '../shared/math';
import type { ClockRef } from '../shared/modal/types';
import { drawingHeight } from '../shared/toon';
import type { Params } from '../shared/tween';
import { CUT_N, GRANULE } from './data';
import { GLUCOSE_R, makeGlucoseMaterial } from './glucoseMaterial';
import { FRESH_FADE, GROW_END, type SceneKey } from './steps';

/*
 * As glicoses do grânulo: prismas hexagonais (o anel da glicopiranose) com a face virada para fora,
 * como escamas. Matrizes montadas uma vez; por quadro só mudam uniformes, e só enquanto a etapa anima.
 */

const UP = new THREE.Vector3(0, 1, 0);

const buildMesh = (material: THREE.Material) => {
    const geo = new THREE.CylinderGeometry(GLUCOSE_R, GLUCOSE_R, 0.17, 6);
    const mesh = new THREE.InstancedMesh(geo, material, GRANULE.count);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const spin = new THREE.Quaternion();
    const p = new THREE.Vector3();
    const n = new THREE.Vector3();
    const one = new THREE.Vector3(1, 1, 1);
    for (let i = 0; i < GRANULE.count; i++) {
        p.fromArray(GRANULE.pos, i * 3);
        n.copy(p).normalize();
        if (n.lengthSq() < 0.5) n.set(0, 1, 0);
        q.setFromUnitVectors(UP, n);
        spin.setFromAxisAngle(UP, GRANULE.data[i * 4 + 2] * Math.PI);
        m.compose(p, q.multiply(spin), one);
        mesh.setMatrixAt(i, m);
    }
    geo.setAttribute('aData', new THREE.InstancedBufferAttribute(GRANULE.data, 4));
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
    mesh.frustumCulled = false; // a esfera de contorno não acompanha o corte nem o crescimento
    return mesh;
};

interface Props { clock: ClockRef; ramp: THREE.Texture; params: Params<SceneKey> }

export const Glucoses = ({ clock, ramp, params }: Props) => {
    const { material, uniforms } = useMemo(() => makeGlucoseMaterial(ramp), [ramp]);
    const mesh = useMemo(() => buildMesh(material), [material]);
    // uniformes vivem numa ref: o quadro os altera no lugar (sem re-render, sem alocação)
    const gpu = useRef(uniforms);
    useEffect(() => { gpu.current = uniforms; }, [uniforms]);
    useEffect(() => () => { mesh.geometry.dispose(); material.dispose(); mesh.dispose(); }, [mesh, material]);

    useFrame(state => {
        const { step, t } = clock;
        const p = params;
        const uniforms = gpu.current;
        uniforms.uViewportH.value = drawingHeight(state);
        uniforms.uCutN.value.copy(CUT_N);
        uniforms.uTiers.value = p.tiers;
        uniforms.uShell.value = p.shell;
        uniforms.uCutD.value = p.cut;
        uniforms.uFresh.value = GROW_END[step] > 0 ? 1 - seg(t, GROW_END[step], GROW_END[step] + FRESH_FADE) : 0;
        uniforms.uBite.value = step === 4 ? seg(t, 1, 3) : step === 5 ? 1 : 0;
        uniforms.uRebuild.value = step === 5 ? seg(t, 1, 3) : 0;
    });

    return <primitive object={mesh} />;
};

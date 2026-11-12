import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { smoother } from '../math';
import type { Pose } from './types';

/*
 * Câmera dos modais: órbita livre (drei) + voo curto até a pose da etapa. O voo interpola o alvo em
 * linha reta e a câmera em coordenadas esféricas em volta dele (gira pelo caminho curto). Tocar no
 * canvas interrompe o voo. A etapa só "assenta" (rótulos e animação começam) quando o voo termina.
 */

interface Flight {
    active: boolean;
    u: number;
    dur: number;
    fromT: THREE.Vector3;
    toT: THREE.Vector3;
    a: THREE.Spherical;
    b: THREE.Spherical;
}

interface Props {
    poses: readonly Pose[];
    step: number;
    recenterKey: number;
    reduced: boolean;
    minDistance: number;
    maxDistance: number;
    onSettled: (step: number) => void;
}

const FLIGHT_S = 1.1;
const TMP = new THREE.Vector3();
const SPH = new THREE.Spherical();

export const CameraRig = ({ poses, step, recenterKey, reduced, minDistance, maxDistance, onSettled }: Props) => {
    const get = useThree(s => s.get);
    const gl = useThree(s => s.gl);
    const invalidate = useThree(s => s.invalidate);
    const controlsRef = useRef<OrbitControlsImpl>(null);
    const flight = useRef<Flight>({
        active: false, u: 0, dur: FLIGHT_S, fromT: new THREE.Vector3(), toT: new THREE.Vector3(),
        a: new THREE.Spherical(), b: new THREE.Spherical(),
    });
    const pending = useRef<number | null>(null);
    const first = useRef(true);

    // declarado antes do efeito da etapa: já aponta para o onSettled atual quando o voo começa
    const finish = useRef<() => void>(() => undefined);
    useEffect(() => {
        finish.current = () => {
            flight.current.active = false;
            if (pending.current !== null) { onSettled(pending.current); pending.current = null; }
        };
    }, [onSettled]);

    // o toque do usuário vence o voo
    useEffect(() => {
        const el = gl.domElement;
        const stop = () => { if (flight.current.active) finish.current(); };
        el.addEventListener('pointerdown', stop);
        el.addEventListener('wheel', stop, { passive: true });
        return () => { el.removeEventListener('pointerdown', stop); el.removeEventListener('wheel', stop); };
    }, [gl]);

    useEffect(() => {
        const controls = controlsRef.current;
        if (!controls) return;
        const { camera } = get();
        const goal = poses[step];
        const f = flight.current;
        pending.current = step;
        if (first.current || reduced) {
            first.current = false;
            camera.position.set(...goal.pos);
            controls.target.set(...goal.tgt);
            controls.update();
            finish.current();
            invalidate();
            return;
        }
        f.fromT.copy(controls.target);
        f.toT.set(...goal.tgt);
        f.a.setFromVector3(TMP.subVectors(camera.position, controls.target));
        f.b.setFromVector3(TMP.set(...goal.pos).sub(f.toT));
        const dTheta = f.b.theta - f.a.theta;
        f.b.theta = f.a.theta + Math.atan2(Math.sin(dTheta), Math.cos(dTheta));
        f.u = 0;
        f.active = true;
        invalidate();
    }, [step, recenterKey, poses, reduced, get, invalidate]);

    useFrame(({ camera }, dt) => {
        const f = flight.current;
        const controls = controlsRef.current;
        if (!f.active || !controls) return;
        f.u = Math.min(1, f.u + Math.min(dt, 1 / 30) / f.dur);
        const e = smoother(f.u);
        controls.target.lerpVectors(f.fromT, f.toT, e);
        SPH.radius = THREE.MathUtils.lerp(f.a.radius, f.b.radius, e);
        SPH.phi = THREE.MathUtils.lerp(f.a.phi, f.b.phi, e);
        SPH.theta = THREE.MathUtils.lerp(f.a.theta, f.b.theta, e);
        SPH.makeSafe();
        camera.position.setFromSpherical(SPH).add(controls.target);
        controls.update();
        if (f.u >= 1) finish.current();
        else invalidate();
    });

    return (
        <OrbitControls
            ref={controlsRef}
            makeDefault
            enableDamping
            dampingFactor={0.12}
            enablePan={false}
            minDistance={minDistance}
            maxDistance={maxDistance}
            rotateSpeed={0.6}
            zoomSpeed={0.8}
        />
    );
};

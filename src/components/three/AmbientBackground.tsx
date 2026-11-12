import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { useStore } from '../../store/useStore';
import { ANIMATED_BACKGROUND_SLIDES, DECK } from '../deck/slides';
import { moodFor, type Mood } from '../deck/actMood';
import { rng } from './shared/math';
import { C } from '../sims/kit/palette';

const RING_COUNT = 40;
const FIELD = { x: 34, y: 20, z: 26 };
const RING_RADIUS = 0.9;

/**
 * Anel de glicose esquemático (piranose): seis átomos num hexágono plano, ligados por bastões finos.
 * Tudo numa geometria só, instanciada — um draw call para todos os anéis.
 */
const makeGlucoseRingGeometry = () => {
    const parts: THREE.BufferGeometry[] = [];
    const corner = (k: number) => {
        const a = (k * Math.PI) / 3 + Math.PI / 6;
        return new THREE.Vector3(Math.cos(a) * RING_RADIUS, Math.sin(a) * RING_RADIUS, 0);
    };
    for (let k = 0; k < 6; k++) {
        const atom = new THREE.SphereGeometry(k === 0 ? 0.3 : 0.24, 10, 8);
        const p = corner(k);
        atom.translate(p.x, p.y, p.z);
        parts.push(atom);
        // Bastão até o vizinho: cilindro deitado no plano do anel, centrado no meio da aresta.
        const q = corner(k + 1);
        const bond = new THREE.CylinderGeometry(0.07, 0.07, RING_RADIUS, 6, 1);
        bond.rotateZ(Math.atan2(q.y - p.y, q.x - p.x) - Math.PI / 2);
        bond.translate((p.x + q.x) / 2, (p.y + q.y) / 2, 0);
        parts.push(bond);
    }
    const geo = mergeGeometries(parts);
    geo.computeVertexNormals();
    return geo;
};

/** Valores do clima no quadro atual: caminham até o clima do slide (ver `deck/actMood.ts`). */
interface Live {
    rings: number;
    sparks: number;
    warm: number;
    speed: number;
    pull: number;
    ringColor: THREE.Color;
    ringGlow: THREE.Color;
}

const liveFrom = (m: Mood): Live => ({
    rings: m.rings, sparks: m.sparks, warm: m.warm, speed: m.speed, pull: m.pull,
    ringColor: new THREE.Color(m.ringColor), ringGlow: new THREE.Color(m.ringGlow),
});

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

/** Leva o clima vivo até o alvo, mais devagar quando o clima pede uma troca longa (o fecho). */
const MoodDriver = ({ target, liveRef }: { target: Mood; liveRef: RefObject<Live> }) => {
    const ringColor = useMemo(() => new THREE.Color(target.ringColor), [target.ringColor]);
    const ringGlow = useMemo(() => new THREE.Color(target.ringGlow), [target.ringGlow]);
    useFrame((_, delta) => {
        const live = liveRef.current;
        const a = 1 - Math.exp(-Math.min(delta, 0.05) * (4000 / target.settleMs));
        live.rings += (target.rings - live.rings) * a;
        live.sparks += (target.sparks - live.sparks) * a;
        live.warm += (target.warm - live.warm) * a;
        live.speed += (target.speed - live.speed) * a;
        live.pull += (target.pull - live.pull) * a;
        live.ringColor.lerp(ringColor, a);
        live.ringGlow.lerp(ringGlow, a);
    });
    return null;
};

interface Drifter {
    pos: THREE.Vector3;
    rot: THREE.Euler;
    spin: THREE.Vector3;
    speed: number;
    scale: number;
}

const makeDrifters = (count: number, seed: number, speed: [number, number], scale: [number, number]): Drifter[] => {
    const rand = rng(seed);
    return Array.from({ length: count }, () => ({
        pos: new THREE.Vector3((rand() - 0.5) * FIELD.x * 2, (rand() - 0.5) * FIELD.y * 2, -rand() * FIELD.z - 4),
        rot: new THREE.Euler(rand() * Math.PI, rand() * Math.PI, rand() * Math.PI),
        spin: new THREE.Vector3((rand() - 0.5) * 0.4, (rand() - 0.5) * 0.4, (rand() - 0.5) * 0.3),
        speed: speed[0] + rand() * (speed[1] - speed[0]),
        scale: scale[0] + rand() * (scale[1] - scale[0]),
    }));
};

/*
 * Passos do laço de quadros, fora dos componentes (o compilador do React não deixa mutar ali o que veio
 * de um hook) e em `for` simples, sem closure por quadro.
 */
const advanceRings = (rings: Drifter[], dt: number, visible: number, dummy: THREE.Object3D, mesh: THREE.InstancedMesh) => {
    for (let i = 0; i < rings.length; i++) {
        const c = rings[i];
        c.pos.x += c.speed * dt;
        c.pos.y += Math.sin(c.pos.x * 0.15 + i) * 0.1 * dt;
        if (c.pos.x > FIELD.x) c.pos.x = -FIELD.x;
        c.rot.x += c.spin.x * dt;
        c.rot.y += c.spin.y * dt;
        c.rot.z += c.spin.z * dt;
        dummy.position.copy(c.pos);
        dummy.rotation.copy(c.rot);
        // Anéis além da fração do clima encolhem até sumir (sem "estalo" de aparecer/desaparecer).
        dummy.scale.setScalar(c.scale * clamp01(visible - i));
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
    }
};

/** Anéis de glicose derivando devagar, girando no próprio eixo. */
const GlucoseRings = ({ liveRef }: { liveRef: RefObject<Live> }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const materialRef = useRef<THREE.MeshStandardMaterial>(null);
    const geometry = useMemo(() => makeGlucoseRingGeometry(), []);
    const rings = useMemo(() => makeDrifters(RING_COUNT, 7, [0.35, 0.9], [0.6, 1.15]), []);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((_, delta) => {
        const mesh = meshRef.current;
        if (!mesh) return;
        const live = liveRef.current;
        const dt = Math.min(delta, 0.05) * live.speed;
        advanceRings(rings, dt, live.rings * RING_COUNT, dummy, mesh);
        mesh.instanceMatrix.needsUpdate = true;
        materialRef.current?.color.copy(live.ringColor);
        materialRef.current?.emissive.copy(live.ringGlow);
    });

    return (
        <instancedMesh ref={meshRef} args={[geometry, undefined, RING_COUNT]}>
            <meshStandardMaterial ref={materialRef} color={C.glucose} emissive={C.glucoseDeep} emissiveIntensity={0.6} roughness={0.4} metalness={0.05} />
        </instancedMesh>
    );
};

/** Luz quente (âmbar) que acompanha o clima. */
const WarmLight = ({ liveRef }: { liveRef: RefObject<Live> }) => {
    const ref = useRef<THREE.PointLight>(null);
    useFrame(() => { if (ref.current) ref.current.intensity = liveRef.current.warm; });
    return <pointLight ref={ref} position={[-12, -4, 4]} intensity={2.2} distance={40} color={C.glucose} />;
};

/** Parallax suave com o mouse + leve aproximação ao avançar na aula. */
const CameraDrift = ({ liveRef }: { liveRef: RefObject<Live> }) => {
    const slide = useStore(s => s.currentSlide);
    // criado uma vez (inicializador preguiçoso); o ref só carrega o vetor que o useFrame reescreve
    const [scratch] = useState(() => new THREE.Vector3());
    const target = useRef(scratch);
    useFrame(({ camera, pointer }, delta) => {
        target.current.set(pointer.x * 1.6, pointer.y * 1.0, 16 - Math.min(slide, 40) * 0.08 + liveRef.current.pull);
        camera.position.lerp(target.current, Math.min(delta * 1.5, 1));
        camera.lookAt(0, 0, -10);
    });
    return null;
};

/**
 * Fundo 3D da aula: anéis de glicose derivando (sem faíscas: partícula fina vira borrão no codec da videochamada) — tema da aula, baixo custo
 * (um mesh instanciado + uma nuvem de pontos, sem pós-processamento, dpr 1) e atenuado nos slides de conteúdo.
 * Cada ato tem seu clima (cor dos anéis, densidade, ritmo); ver `deck/actMood.ts`.
 */
export const AmbientBackground = () => {
    const slide = useStore(s => s.currentSlide);
    const modalOpen = useStore(s => s.modalOpen);
    const item = DECK[slide] ?? DECK[0];
    const mood = moodFor(item.slide.id, item.section);
    // clima inicial calculado uma vez só (não a cada render); os valores vivos mudam pelo ref no useFrame
    const [initialLive] = useState(() => liveFrom(mood));
    const liveRef = useRef<Live>(initialLive);

    // Ao trocar de clima, o fundo anima até assentar e depois volta a congelar.
    const [settling, setSettling] = useState(false);
    useEffect(() => {
        const start = window.setTimeout(() => setSettling(true), 0);
        const stop = window.setTimeout(() => setSettling(false), mood.settleMs);
        return () => { window.clearTimeout(start); window.clearTimeout(stop); };
    }, [mood]);
    const animated = settling || ANIMATED_BACKGROUND_SLIDES.has(slide);

    return (
        <div
            aria-hidden
            className="absolute inset-0 z-0 transition-opacity"
            style={{ opacity: mood.opacity, transitionDuration: `${Math.min(mood.settleMs, 4000)}ms` }}
        >
            <Canvas
                dpr={1}
                frameloop={modalOpen ? 'never' : animated ? 'always' : 'demand'}
                camera={{ position: [0, 0, 16], fov: 50 }}
                gl={{ antialias: false, powerPreference: 'low-power' }}
            >
                <color attach="background" args={['#04080F']} />
                <fog attach="fog" args={['#04080F', 14, 46]} />
                <ambientLight intensity={0.35} color="#1e293b" />
                <directionalLight position={[8, 10, 12]} intensity={1.3} color="#fef3c7" />
                <MoodDriver target={mood} liveRef={liveRef} />
                <WarmLight liveRef={liveRef} />
                <CameraDrift liveRef={liveRef} />
                <GlucoseRings liveRef={liveRef} />
            </Canvas>
            {/* Véu chapado (sem degradê: o codec da videochamada transforma degradê em faixas): contraste do texto. */}
            <div className="absolute inset-0 pointer-events-none bg-[#04080F]/45" />
        </div>
    );
};

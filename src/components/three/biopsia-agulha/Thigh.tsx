import * as THREE from 'three';
import { BED, FASCIA, FAT, FEMUR, MUSCLES, OVALS, SKIN, SLAB_DEPTH, TISSUE, ellipseShape, grow, shapeOf, type MuscleId } from './layout';

/*
 * A coxa em corte: uma fatia extrudada (a lateral é a pele) e, na face cortada, as camadas em cores
 * chapadas (MeshBasic: a cor da paleta sai igual no vídeo). Cada camada fica 0,01 à frente da anterior,
 * sem disputa de profundidade. Formas criadas uma vez no carregamento; o R3F libera as geometrias.
 */

const SKIN_SHAPE = ellipseShape(SKIN.rx, SKIN.ry);
const SLAB_OPTS = { depth: SLAB_DEPTH, bevelEnabled: false, curveSegments: 72 } as const;
const FACE: readonly { shape: THREE.Shape; color: string }[] = [
    { shape: ellipseShape(FAT.rx, FAT.ry), color: TISSUE.fat },
    { shape: ellipseShape(FASCIA.rx, FASCIA.ry), color: TISSUE.fascia },
    { shape: ellipseShape(BED.rx, BED.ry), color: TISSUE.septum },
];
const MUSCLE_ORDER: readonly MuscleId[] = ['vi', 'vm', 'add', 'semi', 'bf', 'vl'];
const MUSCLE_SHAPES = MUSCLE_ORDER.map(id => ({ id, shape: shapeOf(MUSCLES[id]) }));
/** Ovais por cima dos outros: primeiro a borda (septo), depois o músculo. */
const OVAL_SHAPES = OVALS.map(id => ({ id, shape: shapeOf(MUSCLES[id]), rim: shapeOf(grow(MUSCLES[id], 0.13)) }));

export const Thigh = ({ ramp }: { ramp: THREE.Texture }) => (
    <group>
        {/* a fatia: começa em z = 0 e vai para trás; a lateral é a pele */}
        <mesh position={[0, 0, -SLAB_DEPTH]}>
            <extrudeGeometry args={[SKIN_SHAPE, SLAB_OPTS]} />
            <meshToonMaterial color={TISSUE.skin} gradientMap={ramp} />
        </mesh>
        <mesh position={[0, 0, 0.005]}>
            <shapeGeometry args={[SKIN_SHAPE, 72]} />
            <meshBasicMaterial color={TISSUE.skin} />
        </mesh>
        {FACE.map((f, i) => (
            <mesh key={f.color} position={[0, 0, 0.012 + i * 0.01]}>
                <shapeGeometry args={[f.shape, 72]} />
                <meshBasicMaterial color={f.color} />
            </mesh>
        ))}
        {/* cada músculo na sua profundidade: bordas que se tocam não cintilam */}
        {MUSCLE_SHAPES.map((m, i) => (
            <mesh key={m.id} position={[0, 0, 0.04 + i * 0.004]}>
                <shapeGeometry args={[m.shape, 4]} />
                <meshBasicMaterial color={m.id === 'vl' ? TISSUE.vl : TISSUE.muscle} />
            </mesh>
        ))}
        {OVAL_SHAPES.map(m => (
            <group key={m.id}>
                <mesh position={[0, 0, 0.07]}><shapeGeometry args={[m.rim, 4]} /><meshBasicMaterial color={TISSUE.septum} /></mesh>
                <mesh position={[0, 0, 0.075]}><shapeGeometry args={[m.shape, 4]} /><meshBasicMaterial color={TISSUE.muscle} /></mesh>
            </group>
        ))}
        <mesh position={[FEMUR.c[0], FEMUR.c[1], 0.08]}><circleGeometry args={[FEMUR.r, 48]} /><meshBasicMaterial color={TISSUE.bone} /></mesh>
        <mesh position={[FEMUR.c[0], FEMUR.c[1], 0.085]}><circleGeometry args={[FEMUR.marrow, 40]} /><meshBasicMaterial color={TISSUE.marrow} /></mesh>
    </group>
);

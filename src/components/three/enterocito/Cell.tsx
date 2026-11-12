import { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { APICAL_Y, BASAL_Y, CAPILLARY, CELL, CELL_COLORS, DOOR, MOL_Z, NEIGHBOR_X } from './layout';

/*
 * O cenário fixo: o enterócito cortado ao meio (face z = 0), duas vizinhas, a borda em escova
 * (microvilosidades instanciadas), as portas na membrana e o capilar aberto embaixo. Declarativo:
 * o R3F libera geometrias e materiais ao fechar o modal.
 */

const MV = { perCell: 11, rows: 5, r: 0.17, len: 1.25 } as const;

const Microvilli = ({ ramp }: { ramp: THREE.Texture }) => {
    const ref = useRef<THREE.InstancedMesh>(null);
    const count = MV.perCell * MV.rows * 3;
    useLayoutEffect(() => {
        const mesh = ref.current;
        if (!mesh) return;
        const m = new THREE.Matrix4();
        let i = 0;
        for (const cx of [-NEIGHBOR_X, 0, NEIGHBOR_X]) {
            for (let a = 0; a < MV.perCell; a++) {
                for (let b = 0; b < MV.rows; b++) {
                    const x = cx - CELL.w / 2 + 0.3 + a * ((CELL.w - 0.6) / (MV.perCell - 1));
                    const z = -0.35 - b * 0.85;
                    m.makeTranslation(x, APICAL_Y + MV.len / 2 + 0.15, z);
                    mesh.setMatrixAt(i++, m);
                }
            }
        }
        mesh.instanceMatrix.needsUpdate = true;
    }, []);
    return (
        <instancedMesh ref={ref} args={[undefined, undefined, count]}>
            <capsuleGeometry args={[MV.r, MV.len - 2 * MV.r, 4, 10]} />
            <meshToonMaterial color={CELL_COLORS.microvilli} gradientMap={ramp} />
        </instancedMesh>
    );
};

/** Moldura de membrana na face cortada (2 bordas grossas, legíveis no vídeo). */
const MembraneFrame = ({ x, color }: { x: number; color: string }) => {
    const t = 0.16;
    return (
        <group position={[x, 0, 0.03]}>
            <mesh position={[0, APICAL_Y, 0]}><boxGeometry args={[CELL.w, t, 0.08]} /><meshBasicMaterial color={color} /></mesh>
            <mesh position={[0, BASAL_Y, 0]}><boxGeometry args={[CELL.w, t, 0.08]} /><meshBasicMaterial color={color} /></mesh>
            <mesh position={[-CELL.w / 2, 0, 0]}><boxGeometry args={[t, CELL.h, 0.08]} /><meshBasicMaterial color={color} /></mesh>
            <mesh position={[CELL.w / 2, 0, 0]}><boxGeometry args={[t, CELL.h, 0.08]} /><meshBasicMaterial color={color} /></mesh>
        </group>
    );
};

/** Porta: dois lóbulos com um vão no meio, por onde a molécula passa. */
const Door = ({ x, y, color, ramp, visible = true }: { x: number; y: number; color: string; ramp: THREE.Texture; visible?: boolean }) => (
    <group position={[x, y, MOL_Z - 0.15]} visible={visible}>
        {[-0.4, 0.4].map(dx => (
            <mesh key={dx} position={[dx, 0, 0]}>
                <capsuleGeometry args={[0.26, 0.75, 4, 12]} />
                <meshToonMaterial color={color} gradientMap={ramp} />
            </mesh>
        ))}
    </group>
);

export const Cell = ({ ramp, ghost }: { ramp: THREE.Texture; ghost: boolean }) => (
    <group>
        {[-NEIGHBOR_X, NEIGHBOR_X].map(x => (
            <mesh key={x} position={[x, 0, -CELL.d / 2]}>
                <boxGeometry args={[CELL.w, CELL.h, CELL.d]} />
                <meshToonMaterial color={CELL_COLORS.neighbor} gradientMap={ramp} />
            </mesh>
        ))}
        <mesh position={[0, 0, -CELL.d / 2]}>
            <boxGeometry args={[CELL.w, CELL.h, CELL.d]} />
            <meshToonMaterial color={CELL_COLORS.face} gradientMap={ramp} />
        </mesh>
        {/* núcleo cortado */}
        <mesh position={[0.2, -1.6, 0.012]}><circleGeometry args={[1.3, 40]} /><meshBasicMaterial color="#26344F" /></mesh>
        <MembraneFrame x={0} color={CELL_COLORS.membrane} />
        <MembraneFrame x={-NEIGHBOR_X} color="#475569" />
        <MembraneFrame x={NEIGHBOR_X} color="#475569" />
        <Microvilli ramp={ramp} />
        <Door {...DOOR.sglt1} ramp={ramp} />
        <Door {...DOOR.glut5} ramp={ramp} />
        <Door {...DOOR.glut2} ramp={ramp} />
        <group position={[DOOR.nak.x, DOOR.nak.y, MOL_Z - 0.15]}>
            <mesh><boxGeometry args={[1.0, 1.1, 0.6]} /><meshToonMaterial color={DOOR.nak.color} gradientMap={ramp} /></mesh>
        </group>
        <Door {...DOOR.glut2Apical} ramp={ramp} visible={ghost} />
        {/* membrana basal e capilar aberto para a câmera */}
        <mesh position={[0, BASAL_Y - 0.3, -CELL.d / 2]}><boxGeometry args={[NEIGHBOR_X * 2 + CELL.w, 0.18, CELL.d]} /><meshToonMaterial color="#334155" gradientMap={ramp} /></mesh>
        <mesh position={[0, CAPILLARY.y, -0.2]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[CAPILLARY.r, CAPILLARY.r, CAPILLARY.len, 40, 1, true, Math.PI / 2, Math.PI]} />
            <meshToonMaterial color={CELL_COLORS.capillary} gradientMap={ramp} side={THREE.DoubleSide} />
        </mesh>
    </group>
);

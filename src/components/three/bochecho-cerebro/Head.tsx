import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { capShape, domeGeometry, halfTube, insetBand, type Vec2 } from './geometry';
import { CEREBELLUM, COLORS, HEAD, MANDIBLE, PALATE, STEM_OUTLINE, STEM_PTS, STEM_R, TEETH, isVault } from './layout';
import { toon, useOwned } from './materials';

/*
 * A cabeça em meia-secção: por dentro, o forro escuro (lado de trás da cúpula, opaco) emoldura o corte;
 * por fora, a pele em vidro claro (só aparece girando a cabeça). No plano do corte: o contorno da pele,
 * o osso do crânio, palato, mandíbula e incisivos em cores chapadas; cerebelo e tronco + medula.
 */

const toPoints = (o: readonly Vec2[], z: number): [number, number, number][] => [...o, o[0]].map(([x, y]) => [x, y, z]);

const HEAD_GEO = () => domeGeometry(HEAD, { rings: 22 });
const CEREB_GEO = () => domeGeometry(CEREBELLUM, { rings: 14 });
const STEM_GEO = () => halfTube(STEM_PTS, STEM_R).geometry;
const VAULT_GEO = () => insetBand(HEAD.outline, HEAD.center, 0.22, 0.85, isVault);

const Flat = ({ outline, color, z }: { outline: readonly Vec2[]; color: string; z: number }) => {
    const shape = useMemo(() => capShape(outline), [outline]);
    return (
        <mesh position={[0, 0, z]}>
            <shapeGeometry args={[shape, 8]} />
            <meshBasicMaterial color={color} />
        </mesh>
    );
};

export const Head = ({ ramp }: { ramp: THREE.Texture }) => {
    const headGeo = useOwned(HEAD_GEO, []);
    const cerebGeo = useOwned(CEREB_GEO, []);
    const vaultGeo = useOwned(VAULT_GEO, []);
    const stemGeo = useOwned(STEM_GEO, []);
    const inside = useOwned(() => toon(COLORS.headInside, ramp, { side: THREE.BackSide }), [ramp]);
    const skin = useOwned(() => toon(COLORS.skin, ramp, { opacity: 0.16 }), [ramp]);
    const cereb = useOwned(() => toon(COLORS.cerebellum, ramp), [ramp]);
    const stem = useOwned(() => toon(COLORS.stem, ramp, { side: THREE.DoubleSide }), [ramp]);
    const skinLine = useMemo(() => toPoints(HEAD.outline, 0.02), []);
    return (
        <group>
            <mesh geometry={headGeo} material={inside} />
            <mesh geometry={headGeo} material={skin} renderOrder={3} />
            <Line points={skinLine} color={COLORS.skin} lineWidth={3} />
            <mesh geometry={vaultGeo} position={[0, 0, 0.01]}>
                <meshBasicMaterial color={COLORS.bone} side={THREE.DoubleSide} />
            </mesh>
            <Flat outline={PALATE} color={COLORS.bone} z={0.012} />
            <Flat outline={MANDIBLE} color={COLORS.bone} z={0.012} />
            {TEETH.map((t, i) => <Flat key={i} outline={t} color={COLORS.tooth} z={0.014} />)}
            <mesh geometry={cerebGeo} material={cereb} />
            <Flat outline={CEREBELLUM.outline} color={COLORS.cerebellumCut} z={0.004} />
            <mesh geometry={stemGeo} material={stem} />
            <Flat outline={STEM_OUTLINE} color={COLORS.stemCut} z={0.006} />
        </group>
    );
};

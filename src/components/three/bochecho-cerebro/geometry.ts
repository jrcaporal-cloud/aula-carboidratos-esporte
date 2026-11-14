import * as THREE from 'three';

/*
 * Formas do corte sagital (plano z = 0, a metade que fica vai para z < 0). Três construtores puros,
 * chamados uma vez no carregamento do módulo:
 *  - contorno: curva fechada suave por pontos de controle, amostrada por comprimento e sempre anti-horária;
 *  - cúpula: o contorno "inflado" para trás (cada ponto desce até o polo em z = −depth por um quarto de
 *    elipse), aberta na face do corte. Serve para a cabeça, o cérebro, o cerebelo e a língua;
 *  - meio tubo: linha central no plano do corte com raio variável e seção em meia-lua (tronco e medula).
 */

export type Vec2 = readonly [number, number];

/** Contorno fechado amostrado por comprimento de arco, orientado no sentido anti-horário. */
export const sampleOutline = (pts: readonly Vec2[], n: number): Vec2[] => {
    const curve = new THREE.CatmullRomCurve3(pts.map(([x, y]) => new THREE.Vector3(x, y, 0)), true, 'centripetal');
    const out: Vec2[] = curve.getSpacedPoints(n).slice(0, n).map(v => [v.x, v.y] as const);
    let area = 0;
    out.forEach(([x0, y0], i) => { const [x1, y1] = out[(i + 1) % out.length]; area += x0 * y1 - x1 * y0; });
    return area < 0 ? out.reverse() : out;
};

export interface DomeSpec {
    outline: readonly Vec2[];
    center: Vec2;
    depth: number;
}

/** Ponto da cúpula: índice do contorno, ângulo φ (0 = borda do corte, π/2 = polo) e fator de encolhimento. */
export const domePoint = (d: DomeSpec, i: number, phi: number, k = 1): [number, number, number] => {
    const [px, py] = d.outline[((i % d.outline.length) + d.outline.length) % d.outline.length];
    const [cx, cy] = d.center;
    const c = Math.cos(phi) * k;
    return [cx + (px - cx) * c, cy + (py - cy) * c, -d.depth * Math.sin(phi) * k];
};

interface DomeOpts {
    rings?: number;
    /** Encolhe para dentro (k < 1): faixas que forram a parede por dentro. */
    k?: number;
    /** Só um trecho do contorno [i0, i1] (faixa aberta) em vez do contorno inteiro. */
    span?: readonly [number, number];
    phi?: readonly [number, number];
}

/** Cúpula aberta no plano do corte; normais para fora (contorno anti-horário). */
export const domeGeometry = (d: DomeSpec, opts: DomeOpts = {}): THREE.BufferGeometry => {
    const rings = opts.rings ?? 18;
    const [p0, p1] = opts.phi ?? [0, Math.PI / 2];
    const closed = !opts.span;
    const [i0, i1] = opts.span ?? [0, d.outline.length];
    const cols = closed ? d.outline.length : i1 - i0 + 1;
    const pos: number[] = [];
    for (let c = 0; c < cols; c++) {
        for (let j = 0; j <= rings; j++) pos.push(...domePoint(d, i0 + c, p0 + ((p1 - p0) * j) / rings, opts.k));
    }
    const idx: number[] = [];
    const at = (c: number, j: number) => (closed ? c % cols : c) * (rings + 1) + j;
    const segs = closed ? cols : cols - 1;
    for (let c = 0; c < segs; c++) {
        for (let j = 0; j < rings; j++) {
            const a = at(c, j); const b = at(c + 1, j); const e = at(c, j + 1); const f = at(c + 1, j + 1);
            idx.push(a, e, b, b, e, f);
        }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
};

/** Tampa plana do corte (z = 0) com o contorno dado. */
export const capShape = (outline: readonly Vec2[]): THREE.Shape => new THREE.Shape(outline.map(([x, y]) => new THREE.Vector2(x, y)));

export interface HalfTube { geometry: THREE.BufferGeometry; outline: Vec2[] }

/**
 * Meio tubo: linha central (no plano do corte) com um raio por ponto de controle; a seção é meia
 * circunferência voltada para −z. Devolve também o contorno da face cortada.
 */
export const halfTube = (pts: readonly Vec2[], radii: readonly number[], samples = 64, radial = 14): HalfTube => {
    const curve = new THREE.CatmullRomCurve3(pts.map(([x, y]) => new THREE.Vector3(x, y, 0)), false, 'centripetal');
    const pos: number[] = [];
    const left: Vec2[] = [];
    const right: Vec2[] = [];
    const p = new THREE.Vector3();
    const t = new THREE.Vector3();
    for (let s = 0; s <= samples; s++) {
        const u = s / samples;
        curve.getPoint(u, p);
        curve.getTangent(u, t);
        const f = u * (radii.length - 1);
        const k = Math.min(Math.floor(f), radii.length - 2);
        const r = radii[k] + (radii[k + 1] - radii[k]) * (f - k);
        const nx = -t.y; const ny = t.x;
        left.push([p.x + nx * r, p.y + ny * r]);
        right.push([p.x - nx * r, p.y - ny * r]);
        for (let j = 0; j <= radial; j++) {
            const a = (Math.PI * j) / radial;
            pos.push(p.x + Math.cos(a) * nx * r, p.y + Math.cos(a) * ny * r, -Math.sin(a) * r);
        }
    }
    const idx: number[] = [];
    for (let s = 0; s < samples; s++) {
        for (let j = 0; j < radial; j++) {
            const a = s * (radial + 1) + j; const b = a + radial + 1;
            idx.push(a, b, a + 1, a + 1, b, b + 1);
        }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geometry.setIndex(idx);
    geometry.computeVertexNormals();
    return { geometry, outline: [...left, ...right.reverse()] };
};

/** Faixa entre dois deslocamentos para dentro de um trecho do contorno (o osso do crânio no corte). */
export const insetBand = (outline: readonly Vec2[], center: Vec2, from: number, to: number, keep: (i: number) => boolean): THREE.BufferGeometry => {
    const pos: number[] = [];
    const idx: number[] = [];
    let prev = -1;
    outline.forEach(([x, y], i) => {
        if (!keep(i)) { prev = -1; return; }
        const [ax, ay] = outline[(i - 1 + outline.length) % outline.length];
        const [bx, by] = outline[(i + 1) % outline.length];
        let nx = -(by - ay); let ny = bx - ax;
        const len = Math.hypot(nx, ny) || 1;
        nx /= len; ny /= len;
        // normal para dentro: aponta para o centro
        if (nx * (center[0] - x) + ny * (center[1] - y) < 0) { nx = -nx; ny = -ny; }
        const v = pos.length / 3;
        pos.push(x + nx * from, y + ny * from, 0, x + nx * to, y + ny * to, 0);
        if (prev >= 0) idx.push(prev, prev + 1, v, v, prev + 1, v + 1);
        prev = v;
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    return g;
};

/** Tabela de pontos igualmente espaçados de uma curva 3D (para os pulsos andarem sem alocar). */
export const pathTable = (pts: readonly (readonly [number, number, number])[], n = 96): Float32Array => {
    const curve = new THREE.CatmullRomCurve3(pts.map(([x, y, z]) => new THREE.Vector3(x, y, z)), false, 'centripetal');
    const out = new Float32Array(n * 3);
    curve.getSpacedPoints(n - 1).forEach((v, i) => out.set([v.x, v.y, v.z], i * 3));
    return out;
};

/** Ponto u ∈ [0, 1] da tabela, escrito em `out`. */
export const samplePath = (table: Float32Array, u: number, out: THREE.Vector3): THREE.Vector3 => {
    const n = table.length / 3;
    const f = Math.min(Math.max(u, 0), 1) * (n - 1);
    const i = Math.min(Math.floor(f), n - 2);
    const k = f - i;
    const a = i * 3; const b = a + 3;
    return out.set(
        table[a] + (table[b] - table[a]) * k,
        table[a + 1] + (table[b + 1] - table[a + 1]) * k,
        table[a + 2] + (table[b + 2] - table[a + 2]) * k,
    );
};

/** Marca as matrizes de uma malha instanciada para subir à GPU no próximo quadro. */
export const touch = (m: THREE.InstancedMesh): void => { m.instanceMatrix.needsUpdate = true; };

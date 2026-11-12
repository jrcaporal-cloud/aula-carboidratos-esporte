/**
 * Linguagem de cor da aula "Carboidratos no Esporte" (a mesma no 2D, no 3D e no CSS).
 * Pensada para aula ONLINE (videochamada comprime e borra degradês): cores chapadas, alto contraste
 * sobre o fundo #04080F (todas ≥ 4,5:1; texto pequeno usa as variantes `Soft`).
 *
 *   âmbar   glucose   glicose / carboidrato / "combustível" (a cor-tema da aula)
 *   violeta glycogen  glicogênio (o estoque)
 *   pink    fructose  frutose (o segundo transportador, GLUT5)
 *   lima    fat       gordura / ácidos graxos
 *   ciano   lactate   lactato
 *   azul    insulin   insulina / sinalização
 *   laranja protein   proteína / aminoácidos (laranja escuro: separa do âmbar pela luminância)
 *   vermelho risk     desconforto gastrointestinal / risco
 *   verde   ok        "funciona" / recomendado (nunca sozinho contra `risk`: sempre com ícone ou texto)
 *   ardósia co2       CO₂ / neutro / eixo
 *   neutros sem significado químico: `caveat` (selos "ilustrativo", "cálculo", "caso fictício") e
 *   `stone` (veredito "depende" / sinal de cautela).
 *
 * Daltonismo: todos os pares semânticos foram simulados (Machado 2009, deuteranopia e protanopia,
 * severidade 1) e ficam com ΔE*ab ≥ 13 entre si. Por isso glicogênio é #8B5CF6 (o #A78BFA colapsa com
 * o azul da insulina, ΔE 0,3), frutose é #EC4899 e lactato é #22D3EE (rosa claro × verde-água colapsavam,
 * ΔE 6), gordura é #BEF264 e proteína #EA580C (lima × laranja médio colapsavam, ΔE 7).
 */
export const C = {
    glucose: '#F59E0B',
    glucoseSoft: '#FCD34D',
    glucoseDeep: '#B45309',
    glycogen: '#8B5CF6',
    glycogenSoft: '#C4B5FD',
    fructose: '#EC4899',
    fructoseSoft: '#F9A8D4',
    fat: '#BEF264',
    lactate: '#22D3EE',
    lactateSoft: '#67E8F9',
    insulin: '#60A5FA',
    insulinSoft: '#93C5FD',
    protein: '#EA580C',
    proteinSoft: '#FDBA74',
    risk: '#F43F5E',
    ok: '#34D399',
    co2: '#94A3B8',
    text: '#F3F4F6',
    muted: '#9CA3AF',
    caveat: '#CBD5E1',
    stone: '#E7E5E4',
} as const;

/** Cores semânticas em ordem de uso (os atos definem a sua em data/chapters.ts). */
export const ACT_PALETTE: readonly string[] = [
    C.glucose, C.glycogen, C.insulin, C.lactate, C.fructose, C.fat, C.protein, C.ok,
];

export const PANEL_BG = { background: 'rgba(4,10,20,0.74)' } as const;

/**
 * Família do texto corrido para títulos pequenos (< 30 px). Vai inline porque a regra global
 * `h1…h6 { font-family: display }` do index.css fica fora de camada e vence a classe `font-body`.
 * A Clash Display com tracking negativo cola as palavras nesses tamanhos.
 */
export const BODY_FONT = { fontFamily: 'var(--font-body)' } as const;

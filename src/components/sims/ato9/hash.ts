/** Pseudoaleatório estável (mesmo desenho a cada carga): hash de um inteiro para [0, 1). */
export const hash01 = (n: number): number => {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
};

/** Nome de um modelo 3D = nome do arquivo em `three/models/` (sem extensão). */
export type Model3D = string;

/** Slides que ganham um visualizador 3D (por id do JSON) e qual modelo cada um abre (tecla 3). */
export const MODEL_3D_BY_SLIDE: ReadonlyMap<number, Model3D> = new Map<number, Model3D>([
    [22, 'glicogenio-granulo'],
    [26, 'enterocito'],
    [40, 'fibra-glicogenio'],
    [65, 'fibra-glicogenio'],
    [104, 'enterocito'],
]);

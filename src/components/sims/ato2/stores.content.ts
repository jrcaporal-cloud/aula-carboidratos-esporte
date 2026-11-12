/**
 * Slide 24 · Quanto Cabe no Corpo. Quadrados com ÁREA proporcional à massa (e, portanto, à energia do CHO).
 * No último passo a régua "afasta a câmera" (escala) e a gordura entra ao lado, só para dar escala.
 *
 * Cálculo da gordura (rotulado na tela): pessoa de 70 kg com 15% de gordura = 10,5 kg × 9 kcal/g ≈ 94.500 kcal.
 * Carboidrato total: (4 + 100 + 400 a 500) g × 4 kcal/g ≈ 2.000–2.400 kcal → a gordura guarda ~40× mais.
 */
export const PX_PER_ROOT_G = 12; // lado do quadrado = 12 px × √gramas (na escala 1)
export const side = (grams: number): number => PX_PER_ROOT_G * Math.sqrt(grams);

export const FAT_G_EQUIV = 94500 / 4; // gordura em "gramas de CHO equivalentes" (mesma régua de energia)
export const ZOOM_OUT = 0.18;

export interface StoresStep { tab: string; value: string; caption: string; zoom: number }

export const STEPS: readonly StoresStep[] = [
    { tab: 'Sangue', value: '4 g', caption: 'de glicose circulando no sangue de uma pessoa de 70 kg', zoom: 1 },
    { tab: 'Fígado', value: '~100 g', caption: 'de glicogênio no fígado, que repõe esses 4 g sem parar', zoom: 1 },
    { tab: 'Músculo', value: '~400–500 g', caption: 'de glicogênio no músculo. As estimativas variam entre revisões', zoom: 1 },
    { tab: 'Em energia', value: '~40×', caption: 'mais energia guardada na gordura do que em todo o carboidrato', zoom: ZOOM_OUT },
];

export const SOURCE = 'Wasserman DH. Am J Physiol Endocrinol Metab 2009 · Hearris MA et al. Nutrients 2018 · Jensen J et al. Front Physiol 2011';

/**
 * Linha de fonte de um slide que acumula passos: junta, sem repetir, as fontes de todos os passos já vistos.
 * Assim o quadro final cita tudo o que continua na tela, e não só o estudo do último passo.
 * Cada passo pode ter uma fonte (texto) ou várias (lista).
 */
export const sourcesUpTo = (sources: readonly (string | readonly string[])[], step: number): string =>
    [...new Set(sources.slice(0, step + 1).flat())].join(' · ');

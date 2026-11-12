/**
 * Slide 13 · O Que a Turma Já Acha (MythVoteSim). Oito afirmações para a turma votar no chat da chamada.
 * As respostas NÃO aparecem aqui: o veredito de cada uma vem no slide 189 (Ato X).
 */
export interface Myth {
    /** A afirmação como a turma lê (neutra, sem pista da resposta). */
    text: string;
    /** Rótulo curto para o quadro-resumo. */
    short: string;
}

export const MYTHS: readonly Myth[] = [
    { text: 'Carboidrato de índice glicêmico baixo antes do treino rende mais.', short: 'IG baixo antes rende mais' },
    { text: 'Ninguém absorve mais de 60 g de carboidrato por hora.', short: 'Teto de 60 g/h' },
    { text: 'Frutose atrapalha durante a prova.', short: 'Frutose atrapalha' },
    { text: 'Macarrão na véspera já é uma carga de carboidrato.', short: 'Macarrão na véspera é carga' },
    { text: 'Quem treina força precisa de carboidrato no pós-treino.', short: 'Força pede carbo pós-treino' },
    { text: 'Dieta low-carb melhora o desempenho na prova.', short: 'Low-carb melhora a prova' },
    { text: 'Comer 1 h antes causa hipoglicemia de rebote que derruba o desempenho.', short: 'Rebote de quem come 1 h antes' },
    { text: 'Mulher não supercompensa glicogênio.', short: 'Mulher não supercompensa' },
];

export interface Tally {
    agree: number;
    disagree: number;
}

export const EMPTY_TALLIES: readonly Tally[] = MYTHS.map(() => ({ agree: 0, disagree: 0 }));

/** Os votos ficam na sessão do navegador: sair do slide e voltar não perde a contagem. */
export const STORAGE_KEY = 'aula-carboidratos:votos-mitos:v1';

const isCount = (n: unknown): n is number => typeof n === 'number' && Number.isInteger(n) && n >= 0 && n < 10000;

/** Lê e valida os votos guardados; qualquer coisa fora do formato volta ao zero. */
export const loadTallies = (): readonly Tally[] => {
    try {
        const raw: unknown = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? 'null');
        if (!Array.isArray(raw) || raw.length !== MYTHS.length) return EMPTY_TALLIES;
        const ok = raw.every(t => t && typeof t === 'object' && isCount((t as Tally).agree) && isCount((t as Tally).disagree));
        return ok ? raw.map(t => ({ agree: (t as Tally).agree, disagree: (t as Tally).disagree })) : EMPTY_TALLIES;
    } catch {
        return EMPTY_TALLIES;
    }
};

export const saveTallies = (tallies: readonly Tally[]): void => {
    try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tallies));
    } catch {
        // armazenamento bloqueado (janela privada): a contagem segue só na memória
    }
};

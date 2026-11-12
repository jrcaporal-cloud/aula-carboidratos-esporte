import { Bike, Dumbbell, Footprints, Goal, Scale, type LucideIcon } from 'lucide-react';

/**
 * Os cinco atletas FICTÍCIOS que atravessam a aula (fonte única: nome, idade, peso e dilema).
 * Todo slide que mostrar um deles leva o selo "caso fictício" (kit/chips.tsx).
 * A identidade de cada um é o ícone e o nome, não uma cor: na aula a cor é química (o tanque é sempre violeta).
 */
export type CastId = 'marina' | 'diego' | 'lara' | 'tiago' | 'paulo';

export interface CastMember {
    id: CastId;
    name: string;
    age: number;
    kg: number;
    sport: string;
    /** Duração típica do esforço, como o atleta descreveria. */
    effort: string;
    /** O problema dele, na voz dele. */
    dilemma: string;
    icon: LucideIcon;
}

export const CAST: readonly CastMember[] = [
    { id: 'marina', name: 'Marina', age: 34, kg: 58, sport: 'maratona amadora', effort: '~3h30', dilemma: '"Bati no muro no km 32."', icon: Footprints },
    { id: 'diego', name: 'Diego', age: 29, kg: 72, sport: 'triatlo Ironman', effort: '~10 h', dilemma: '"Acima de 60 g/h o intestino trava."', icon: Bike },
    { id: 'lara', name: 'Lara', age: 22, kg: 60, sport: 'futebol, meio-campo', effort: 'jogo a cada 72 h', dilemma: '"Como pouco carboidrato para não inchar."', icon: Goal },
    { id: 'tiago', name: 'Tiago', age: 24, kg: 73, sport: 'judô, −73 kg', effort: 'pesagem na véspera', dilemma: '"Corto 4–5% do peso na semana da luta."', icon: Scale },
    { id: 'paulo', name: 'Paulo', age: 41, kg: 85, sport: 'musculação, hipertrofia', effort: '~1 h', dilemma: '"Sem carbo pós-treino eu não cresço."', icon: Dumbbell },
];

export const castOf = (id: CastId): CastMember => {
    const member = CAST.find(c => c.id === id);
    if (!member) throw new Error(`Personagem desconhecido: ${id}`);
    return member;
};

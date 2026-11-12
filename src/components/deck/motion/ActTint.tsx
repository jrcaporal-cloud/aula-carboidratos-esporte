import { CHAPTERS } from '../../../data/chapters';
import { actOfSection } from '../acts';

/** Força do tom: o suficiente para a sala "mudar de cor" a cada ato, sem baixar o contraste do texto. */
const TINT_OPACITY = 0.045;

/**
 * Tom de fundo do ato: uma camada chapada por ato (sem degradê: o codec da videochamada faz faixas),
 * só a do ato atual acesa, trocando por opacidade (compositor). Fica atrás dos slides.
 */
export const ActTint = ({ section }: { section: string }) => {
    const act = actOfSection(section);
    return (
        <div aria-hidden className="absolute inset-0 z-0 pointer-events-none">
            {CHAPTERS.map((c, i) => (
                <div
                    key={c.roman}
                    data-act-tint={c.roman}
                    className="absolute inset-0 motion-safe:transition-opacity motion-safe:duration-[1200ms]"
                    style={{ background: c.color, opacity: act === i ? TINT_OPACITY : 0 }}
                />
            ))}
        </div>
    );
};

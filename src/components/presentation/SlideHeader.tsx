import { motion } from 'framer-motion';
import { chapterOfSection } from '../deck/acts';
import { enterLayer, useSlideMotion } from '../deck/motion/transitions';

interface SlideHeaderProps {
    title: string;
    subtitle?: string | null;
    /** Seção herdada do slide ("Ato III · …"): a barra do título ganha a cor do ato. */
    section?: string;
}

const tidy = (text: string) => text.replace(/\s+/g, ' ').trim();

/**
 * Cabeçalho único de todos os slides: barra na cor do ato à esquerda, título e subtítulo.
 * Entra em parallax com a troca de slide: o título anda pouco e chega primeiro, o subtítulo logo depois.
 */
export const SlideHeader = ({ title, subtitle, section }: SlideHeaderProps) => {
    const sub = subtitle ? tidy(subtitle) : '';
    const actColor = section ? chapterOfSection(section)?.color : undefined;
    const m = useSlideMotion();
    const titleIn = enterLayer(m, 24, 0);
    const subIn = enterLayer(m, 36, 0.03);
    return (
        <div className="mb-6 border-l-4 border-brand-deep pl-7 pointer-events-none" style={actColor ? { borderLeftColor: actColor } : undefined}>
            <motion.h2
                initial={titleIn.initial}
                animate={titleIn.animate}
                className="text-[2.9rem] leading-[1.06] font-display font-semibold text-white"
            >
                {tidy(title)}
            </motion.h2>
            {sub && (
                <motion.p
                    initial={subIn.initial}
                    animate={subIn.animate}
                    className="mt-2 text-[1.45rem] leading-snug text-gray-300 font-light max-w-4xl"
                >
                    {sub}
                </motion.p>
            )}
        </div>
    );
};

import { motion } from 'framer-motion';
import type { SlideSchema } from './TitleSlide';
import { renderSlideContent } from './slideContent';
import { SlideHeader } from './SlideHeader';
import { enterLayer, useSlideMotion } from '../deck/motion/transitions';

/** `section` é a seção herdada do deck (o JSON só a declara no 1º slide de cada uma); colore a barra do título. */
export const ProseSlide = ({ slide, section }: { slide: SlideSchema; section?: string }) => {
    // Parallax: o conteúdo anda mais que o cabeçalho e chega 60 ms depois.
    const content = enterLayer(useSlideMotion(), 64, 0.06);
    return (
        <div className="w-full flex flex-col justify-center py-4 px-8 relative z-10 max-w-[1200px] mx-auto">

            <SlideHeader title={slide.title} subtitle={slide.subtitle} section={section} />

            {/* Conteúdo / componente. O que vem depois do simulador (as fontes) fica recolhido atrás da tecla D. */}
            {slide.content && (
                <motion.div
                    initial={content.initial}
                    animate={content.animate}
                    className="prose prose-invert prose-p:text-gray-200 prose-headings:font-display prose-headings:text-white max-w-none prose-xl w-full custom-presentation-content pointer-events-auto"
                >
                    {renderSlideContent(slide.content, { collapseAfter: true })}
                </motion.div>
            )}
        </div>
    );
};

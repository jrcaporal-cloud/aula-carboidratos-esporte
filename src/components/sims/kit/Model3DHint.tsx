import { Box } from 'lucide-react';

/**
 * Lembrete de que o slide tem um modelo 3D (tecla 3). Um só desenho na aula toda:
 * neutro, borda de 2 px, ícone de caixa. A cor fica para o conteúdo, não para o atalho.
 */
export const Model3DHint = ({ label }: { label: string }) => (
    <span className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border-2 border-slate-600 px-3 py-1.5 text-[16px] text-gray-200">
        <Box size={18} aria-hidden /> tecla 3: {label}
    </span>
);

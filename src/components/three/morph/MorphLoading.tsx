/** Indicador estático enquanto o arquivo do modelo 3D ainda está chegando (o véu escuro fica atrás). Sem brilho nem pulsar. */
export const MorphLoading = ({ accent }: { accent: string }) => (
    <div role="status" aria-live="polite" className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none">
        <span aria-hidden className="w-6 h-6 rounded-full border-[3px]" style={{ borderColor: accent, background: '#04080F' }} />
        <p className="text-[16px] font-mono tracking-wider text-gray-200">Abrindo o modelo 3D…</p>
    </div>
);

/**
 * Relógio da etapa, lido por quadro (mutável, fora do React): `t` corre de 0 a `anim` depois que a
 * câmera pousa; parado no fim, a cena deixa de pedir quadros. Mudado só pelos próprios métodos.
 */
export class StepClock {
    step = 0;
    t = 0;
    anim = 1;
    running = false;

    /** Nova etapa ou pouso da câmera: recomeça do zero (com movimento reduzido, pula para o fim). */
    reset(step: number, anim: number, settled: boolean, reduced: boolean): void {
        this.step = step;
        this.anim = anim;
        this.t = settled && reduced ? anim : 0;
        this.running = settled && !reduced;
    }

    /** Avança o tempo; devolve true enquanto ainda há animação a desenhar. */
    tick(dt: number): boolean {
        if (!this.running) return false;
        // dt limitado: depois de um tempo parado (demand), o primeiro quadro não pula a animação
        this.t = Math.min(this.anim, this.t + Math.min(dt, 1 / 30));
        if (this.t >= this.anim) this.running = false;
        return true;
    }
}

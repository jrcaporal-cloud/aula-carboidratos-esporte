import * as THREE from 'three';
import type { Params } from '../shared/tween';
import { PRE, PULL, TIP_IN } from './layout';
import type { BiopsyKey } from './steps';

/* Leitura dos parâmetros da etapa (funções puras, chamadas por quadro sem alocar). */

/** Fração do cilindro fechado (0 = janela aberta, 1 = fechada). */
export const closedOf = (p: Params<BiopsyKey>): number => THREE.MathUtils.clamp(p.seal - p.open + p.cut - p.reopen, 0, 1);
/** x do mundo da ponta da agulha. */
export const tipXOf = (p: Params<BiopsyKey>): number => TIP_IN + (1 - p.push) * PRE + p.pull * PULL;

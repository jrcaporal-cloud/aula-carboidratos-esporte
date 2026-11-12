# Carboidratos no Esporte

Aula interativa sobre carboidratos no exercício (do glicogênio à linha de chegada), para pós-graduação, apresentada online.
React 19 + TypeScript + Vite + Tailwind v4 + framer-motion + React Three Fiber. Motor copiado da aula "Ácido, Base e Performance"
(aula-tamponantes-esporte), sem o conteúdo dela.

**Estado:** esqueleto — capa + 1 slide de demonstração (`DemoSim`). Atos em `src/data/chapters.ts` (placeholders),
paleta semântica em `src/components/sims/kit/palette.ts`. Pesquisa em `docs/dossie/`.

## Como usar na sala

| Tecla | O que faz |
|---|---|
| `→` `Espaço` `PageDown` | avança um passo; ao fim dos passos, vai ao próximo slide |
| `←` `PageUp` | volta |
| `G` | visão geral de todos os slides |
| `P` | janela do apresentador (notas, ritmo, cronômetro), sincronizada com a aula |
| `D` | abre/fecha as fontes do slide |
| `F` | tela cheia |
| `3` | modelo 3D do slide, quando houver (`src/components/deck/models3d.ts`) |

O endereço acompanha o ponto da aula (`#/27/3` = slide 27, terceiro passo).

### Versões por tempo

Por enquanto só a versão completa; as curtas (`?tempo=…`) entram em `src/data/modes.ts`.

### Sem internet

Depois da primeira visita (com internet), a aula abre e roda offline (service worker em `public/sw.js`).

## De onde vêm os números

Toda afirmação numérica deve vir dos dossiês em `docs/dossie/`. Simulações didáticas levam o selo "valores ilustrativos"; contas próprias, "cálculo"; personagens, "caso fictício".

## Para editar

- Texto e fontes de cada ato: `docs/fragmentos/ato-N.json`; notas do apresentador: `docs/fragmentos/ato-N.notas.json`.
  Depois de editar, rode `python3 scripts/montar-aula.py` (gera `src/data/parsedPresentation.json` e `src/data/notas.json`).
- Simuladores: `src/components/sims/Nome.tsx` (export default, sem props; `useSlideSteps(n)` para os passos). Entram pelo token `[[COMP:Nome]]`. Bancada isolada: `?sim=Nome`.
- Modelos 3D: `src/components/three/models/nome.tsx` (registro automático pelo nome do arquivo; ligação com o slide em `src/components/deck/models3d.ts`). Bancada: `?model=nome`.
- Checagem de um simulador ou slide: `node scripts/qa/sim-check.mjs <Nome|#/n> <porta> [pasta] [1280x720]`.

```bash
npm install
npm run dev      # ou o launch "aula-carboidratos" (porta 5360)
npm run build    # tsc + vite build
npm run lint
npm test         # estrutura da aula: atos, notas, versões por tempo, fontes, modelos 3D
```

## Publicar

Destino (ainda não publicado): https://jrcaporal-cloud.github.io/aula-carboidratos-esporte/ (GitHub Pages, branch `gh-pages`).

```bash
npm run publicar
```

Roda os testes, compila e envia `dist/` para o branch `gh-pages`. O código-fonte fica na `main` (`git push` normal).

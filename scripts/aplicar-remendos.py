#!/usr/bin/env python3
"""Junta os remendos da refação (docs/fragmentos/_remendos/<id>.json) nos fragmentos e nas notas.

Remendo: {"slide": {"title"?, "subtitle"?, "fontes"?: [str]}, "notas": {"minutos"?, "mensagem"?, "pergunta"?, "transicao"?}}
"fontes" substitui a lista <ul> depois de <h4>Fontes</h4>. Depois rode scripts/montar-aula.py.
Uso: python3 scripts/aplicar-remendos.py [--seco]
"""
import html
import json
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
FRAG = RAIZ / 'docs' / 'fragmentos'
REMENDOS = FRAG / '_remendos'
SECO = '--seco' in sys.argv

FONTES_RE = re.compile(r'(<h4>Fontes</h4>)<ul>.*?</ul>', re.S)


def carregar(path: Path):
    return json.loads(path.read_text(encoding='utf-8'))


def salvar(path: Path, dado) -> None:
    if not SECO:
        path.write_text(json.dumps(dado, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def lista_fontes(fontes: list[str]) -> str:
    return '<ul>' + ''.join(f'<li>{html.escape(f, quote=False)}</li>' for f in fontes) + '</ul>'


def com_fontes(content: str, fontes: list[str]) -> str:
    nova = lista_fontes(fontes)
    if FONTES_RE.search(content):
        return FONTES_RE.sub(lambda m: m.group(1) + nova, content, count=1)
    return content + '<h4>Fontes</h4>' + nova


def main() -> None:
    atos = {p: carregar(p) for p in sorted(FRAG.glob('ato-*.json')) if not p.name.endswith('.notas.json')}
    notas = {p: carregar(p) for p in sorted(FRAG.glob('ato-*.notas.json'))}
    onde = {str(s['id']): (p, i) for p, slides in atos.items() for i, s in enumerate(slides)}

    tocados_atos, tocadas_notas, problemas = set(), set(), []
    for arq in sorted(REMENDOS.glob('*.json')):
        sid = arq.stem
        try:
            remendo = carregar(arq)
        except json.JSONDecodeError as e:
            problemas.append(f'{arq.name}: JSON inválido ({e})')
            continue
        if sid not in onde:
            problemas.append(f'{arq.name}: id {sid} não existe nos fragmentos')
            continue
        p, i = onde[sid]
        slide = dict(atos[p][i])
        mud = remendo.get('slide') or {}
        for chave in ('title', 'subtitle'):
            if chave in mud:
                slide[chave] = mud[chave]
        if 'fontes' in mud:
            slide['content'] = com_fontes(slide['content'], mud['fontes'])
        atos[p] = [*atos[p][:i], slide, *atos[p][i + 1:]]
        tocados_atos.add(p)

        if remendo.get('notas'):
            pn = p.with_name(p.stem + '.notas.json')
            base = notas[pn].get(sid, {})
            notas[pn] = {**notas[pn], sid: {**base, **remendo['notas']}}
            tocadas_notas.add(pn)
        print(f'ok {sid}: {", ".join(sorted(mud)) or "-"} | notas: {", ".join(sorted(remendo.get("notas") or {})) or "-"}')

    for p in tocados_atos:
        salvar(p, atos[p])
    for p in tocadas_notas:
        salvar(p, notas[p])
    for linha in problemas:
        print('PROBLEMA', linha)
    print(f'{"(seco) " if SECO else ""}{len(tocados_atos)} fragmentos e {len(tocadas_notas)} arquivos de notas atualizados.')


if __name__ == '__main__':
    main()

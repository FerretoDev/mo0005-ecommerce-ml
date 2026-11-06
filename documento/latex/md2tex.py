#!/usr/bin/env python3
"""Convierte ../plantilla-entregable.md a main.tex (sin depender de pandoc).

Uso (desde esta carpeta):
    python md2tex.py
    latexmk -xelatex main.tex

El Markdown es la fuente: si cambia, se vuelve a correr este script y se recompila.
Soporta el subconjunto de Markdown usado en la plantilla: portada, encabezados,
párrafos, negrita/cursiva/código en línea, enlaces, listas, tablas y bloques de código.
"""
import os
import re
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
FUENTE = os.path.join(AQUI, '..', 'plantilla-entregable.md')
SALIDA = os.path.join(AQUI, 'main.tex')

UNICODE = {
    '≤': r'$\leq$', '≥': r'$\geq$', '→': r'$\rightarrow$', '←': r'$\leftarrow$',
    '−': r'$-$', '÷': r'$\div$', '×': r'$\times$', '≈': r'$\approx$', '≠': r'$\neq$',
    '±': r'$\pm$', '↑': r'$\uparrow$', '↓': r'$\downarrow$', '✓': r'$\checkmark$',
    ' ': '~', ' ': '~',
}
ESPECIALES = {
    '\\': r'\textbackslash{}', '{': r'\{', '}': r'\}', '$': r'\$', '&': r'\&',
    '#': r'\#', '%': r'\%', '~': r'\textasciitilde{}', '^': r'\textasciicircum{}',
    '_': r'\_\allowbreak{}',
}


def esc(t):
    """Escapa texto normal."""
    out = []
    for c in t:
        if c in ESPECIALES:
            out.append(ESPECIALES[c])
        elif c in UNICODE:
            out.append(UNICODE[c])
        else:
            out.append(c)
    return ''.join(out)


def esc_code(t):
    """Escapa texto dentro de \\texttt (permite cortes tras _ y /)."""
    s = esc(t)
    return s.replace('/', r'/\allowbreak{}')


TOKEN = re.compile(
    r'`([^`]+)`'
    r'|\[([^\]]+)\]\((https?://[^)\s]+)\)'
    r'|(https?://[^\s)<>]*[^\s).,;:<>])'
    r'|\*\*(.+?)\*\*'
    r'|(?<![*\w])\*(?!\s)(.+?)(?<!\s)\*(?![*\w])'
)


def inline(s):
    out, pos = [], 0
    for m in TOKEN.finditer(s):
        out.append(esc(s[pos:m.start()]))
        code, ltxt, lurl, url, bold, ital = m.groups()
        if code is not None:
            out.append(r'\texttt{' + esc_code(code) + '}')
        elif ltxt is not None:
            out.append(r'\href{' + lurl.replace('%', r'\%').replace('#', r'\#') + '}{' + inline(ltxt) + '}')
        elif url is not None:
            out.append(r'\url{' + url + '}')
        elif bold is not None:
            out.append(r'\textbf{' + inline(bold) + '}')
        else:
            out.append(r'\emph{' + inline(ital) + '}')
        pos = m.end()
    out.append(esc(s[pos:]))
    return ''.join(out)


def split_row(line):
    line = line.strip()
    if line.startswith('|'):
        line = line[1:]
    if line.endswith('|'):
        line = line[:-1]
    return [c.strip() for c in re.split(r'(?<!\\)\|', line)]


def tabla(filas):
    """filas: lista de listas (encabezado, separador, datos...)."""
    enc, datos = filas[0], filas[2:]
    n = len(enc)
    datos = [(r + [''] * n)[:n] for r in datos]
    pesos = []
    for j in range(n):
        m = max([len(enc[j])] + [len(r[j]) for r in datos])
        pesos.append(max(6, min(m, 55)))
    tot = sum(pesos)
    esp = 2 * n  # \tabcolsep a cada lado de cada columna
    cols = ''
    for p in pesos:
        cols += (r'>{\raggedright\arraybackslash}p{\dimexpr(\linewidth-%d\tabcolsep-%d\arrayrulewidth)*%d/%d\relax}|'
                 % (esp, n + 1, p, tot))
    cols = '|' + cols
    vacio = all(c == '' for c in enc)
    L = [r'{\small', r'\begin{longtable}{' + cols + '}', r'\hline']
    if not vacio:
        cab = ' & '.join(r'\textbf{' + inline(c) + '}' for c in enc) + r' \\ \hline'
        L += [r'\rowcolor{gray!15}' + cab if False else cab, r'\endhead']
    for r in datos:
        L.append(' & '.join(inline(c) for c in r) + r' \\ \hline')
    L += [r'\end{longtable}', '}']
    return '\n'.join(L)


def portada(lineas):
    parrafos = [p.strip() for p in '\n'.join(lineas).split('\n\n') if p.strip()]
    L = [r'\begin{titlepage}', r'\centering', r'\vspace*{1cm}']
    for p in parrafos:
        t = inline(p.replace('\n', ' '))
        if len(p) > 80 and p.startswith('**'):
            L.append(r'\vspace{1cm}{\LARGE ' + t + r'\par}\vspace{1cm}')
        else:
            L.append(t + r'\par\medskip')
    L.append(r'\end{titlepage}')
    return '\n'.join(L)


PREAMBULO = r'''\documentclass[11pt,a4paper]{article}
\usepackage{fontspec}
\usepackage[spanish,es-nodecimaldot]{babel}
\usepackage[margin=2.5cm]{geometry}
\usepackage{xcolor}
\usepackage{array}
\usepackage{longtable}
\usepackage{listings}
\usepackage[hidelinks]{hyperref}
\urlstyle{same}
\Urlmuskip=0mu plus 1mu
\def\UrlBreaks{\do\/\do\-\do\?\do\=\do\.\do\_\do\a\do\b\do\c\do\d\do\e\do\f\do\g\do\h\do\i\do\j\do\k\do\l\do\m\do\n\do\o\do\p\do\q\do\r\do\s\do\t\do\u\do\v\do\w\do\x\do\y\do\z\do\A\do\B\do\C\do\D\do\E\do\F\do\G\do\H\do\I\do\J\do\K\do\L\do\M\do\N\do\O\do\P\do\Q\do\R\do\S\do\T\do\U\do\V\do\W\do\X\do\Y\do\Z\do\0\do\1\do\2\do\3\do\4\do\5\do\6\do\7\do\8\do\9}
\setlength{\tabcolsep}{4pt}
\setlength{\parindent}{0pt}
\setlength{\parskip}{6pt}
\setlength{\emergencystretch}{3em}
\renewcommand{\arraystretch}{1.25}
\setcounter{secnumdepth}{0}
\setcounter{tocdepth}{2}
\lstset{
  basicstyle=\ttfamily\footnotesize,
  breaklines=true,
  breakatwhitespace=false,
  columns=fullflexible,
  keepspaces=true,
  frame=single,
  rulecolor=\color{gray!60},
  backgroundcolor=\color{gray!6},
  xleftmargin=4pt, xrightmargin=4pt,
  aboveskip=8pt, belowskip=8pt
}
\title{Entregable 1}
\author{Última Milla Labs}
\date{}
\begin{document}
'''


def convertir(md):
    L = md.replace('\r\n', '\n').split('\n')
    # portada: hasta la primera línea '---'
    i = L.index('---')
    out = [PREAMBULO, portada(L[:i]), r'\newpage', r'\tableofcontents', r'\newpage']
    i += 1
    parrafo, lista = [], None  # lista: ('itemize'|'enumerate', [items])

    def cerrar_parrafo():
        if parrafo:
            out.append(inline(' '.join(parrafo)) + '\n')
            parrafo.clear()

    def cerrar_lista():
        nonlocal lista
        if lista:
            kind, items = lista
            out.append(r'\begin{%s}' % kind)
            out.extend(r'\item ' + inline(it) for it in items)
            out.append(r'\end{%s}' % kind)
            lista = None

    while i < len(L):
        ln = L[i]
        if ln.startswith('```'):
            cerrar_parrafo(); cerrar_lista()
            i += 1
            bloque = []
            while i < len(L) and not L[i].startswith('```'):
                bloque.append(L[i]); i += 1
            i += 1
            out.append(r'\begin{lstlisting}'); out.extend(bloque); out.append(r'\end{lstlisting}')
            continue
        m = re.match(r'^(#{1,4}) (.*)$', ln)
        if m:
            cerrar_parrafo(); cerrar_lista()
            nivel, txt = len(m.group(1)), m.group(2).strip()
            cmd = {1: 'section', 2: 'subsection', 3: 'subsubsection', 4: 'paragraph'}[nivel]
            plano = re.sub(r'[*`]', '', txt)
            out.append(r'\%s{%s}' % (cmd, esc(plano)))
            i += 1
            continue
        if ln.strip() == '---':
            cerrar_parrafo(); cerrar_lista()
            out.append(r'\medskip\noindent\rule{\linewidth}{0.4pt}\medskip')
            i += 1
            continue
        if ln.lstrip().startswith('|'):
            cerrar_parrafo(); cerrar_lista()
            filas = []
            while i < len(L) and L[i].lstrip().startswith('|'):
                filas.append(split_row(L[i])); i += 1
            if len(filas) >= 2:
                out.append(tabla(filas))
            continue
        mb = re.match(r'^[-*] (.*)$', ln)
        me = re.match(r'^\d+\. (.*)$', ln)
        if mb or me:
            cerrar_parrafo()
            kind = 'itemize' if mb else 'enumerate'
            if lista and lista[0] != kind:
                cerrar_lista()
            if not lista:
                lista = (kind, [])
            lista[1].append((mb or me).group(1))
            i += 1
            continue
        if lista and ln.startswith('  ') and ln.strip():
            lista[1][-1] += ' ' + ln.strip()
            i += 1
            continue
        if not ln.strip():
            cerrar_parrafo(); cerrar_lista()
            i += 1
            continue
        cerrar_lista()
        parrafo.append(ln.strip())
        i += 1
    cerrar_parrafo(); cerrar_lista()
    out.append(r'\end{document}')
    return '\n'.join(out) + '\n'


if __name__ == '__main__':
    with open(FUENTE, encoding='utf-8') as f:
        tex = convertir(f.read())
    with open(SALIDA, 'w', encoding='utf-8', newline='\n') as f:
        f.write(tex)
    print('Generado', os.path.relpath(SALIDA), '(', tex.count('\n'), 'líneas )')

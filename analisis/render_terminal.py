#!/usr/bin/env python3
"""Dibuja la salida de un comando (archivo .txt) como una captura de terminal (PNG).

El texto de la salida se dibuja tal cual, sin editarlo. Solo se agrega una
primera linea con el prompt y el comando ejecutado.

Uso:
    python3 analisis/render_terminal.py SALIDA.txt DESTINO.png "comando ejecutado"
(un salto de linea en el comando se dibuja como continuacion)
Requiere Pillow y la fuente DejaVu Sans Mono.
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
TAM = 22
FONDO, TEXTO, PROMPT = (30, 30, 30), (220, 220, 220), (120, 220, 120)
MARGEN, INTERLINEADO = 24, 6


def main(txt, png, comando):
    salida = Path(txt).read_text(encoding="utf-8").rstrip("\n").split("\n")
    fuente = ImageFont.truetype(FONT, TAM)
    prompt = "maru@olist:~$ "
    # El comando puede venir en varias lineas (separadas por \n literal o real).
    cmds = comando.replace("\\n", "\n").split("\n")
    lineas = [(prompt + cmds[0], True)] + [("    " + c, None) for c in cmds[1:]]
    lineas += [(l.expandtabs(8), False) for l in salida]
    ancho_car = fuente.getlength("M")
    alto = TAM + INTERLINEADO
    ancho = int(max(len(t) for t, _ in lineas) * ancho_car) + 2 * MARGEN
    img = Image.new("RGB", (ancho, alto * len(lineas) + 2 * MARGEN), FONDO)
    d = ImageDraw.Draw(img)
    for i, (t, es_cmd) in enumerate(lineas):
        y = MARGEN + i * alto
        if es_cmd:
            d.text((MARGEN, y), prompt, font=fuente, fill=PROMPT)
            d.text((MARGEN + len(prompt) * ancho_car, y), t[len(prompt):], font=fuente, fill=TEXTO)
        else:
            d.text((MARGEN, y), t, font=fuente, fill=TEXTO)
    img.save(png)


if __name__ == "__main__":
    if len(sys.argv) != 4:
        sys.exit(__doc__)
    main(*sys.argv[1:])

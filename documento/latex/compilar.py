#!/usr/bin/env python3
"""Compila documento/latex/main.tex con XeLaTeX y deja main.pdf al lado.

Uso (desde cualquier carpeta):
    python documento/latex/compilar.py            # compila main.tex
    python documento/latex/compilar.py --limpiar  # borra los auxiliares antes de compilar
    python documento/latex/compilar.py otro.tex   # compila otro archivo de esta carpeta

Busca latexmk en el PATH y, si no esta, en las instalaciones tipicas de
TinyTeX / MiKTeX / TeX Live. Muestra solo los errores del log.
"""
import argparse
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

CARPETA = Path(__file__).resolve().parent
AUXILIARES = (".aux", ".log", ".out", ".toc", ".xdv", ".fls", ".fdb_latexmk",
              ".bbl", ".blg", ".bcf", ".run.xml", ".lot", ".lof")


def buscar_latexmk():
    """Devuelve la ruta de latexmk o None."""
    ruta = shutil.which("latexmk")
    if ruta:
        return ruta
    candidatos = []
    home = Path.home()
    appdata = os.environ.get("APPDATA", "")
    localapp = os.environ.get("LOCALAPPDATA", "")
    if appdata:
        candidatos.append(Path(appdata) / "TinyTeX" / "bin" / "windows" / "latexmk.exe")
    if localapp:
        candidatos.append(Path(localapp) / "Programs" / "MiKTeX" / "miktex" / "bin" / "x64" / "latexmk.exe")
    candidatos += [
        Path("C:/Program Files/MiKTeX/miktex/bin/x64/latexmk.exe"),
        home / ".TinyTeX" / "bin" / "x86_64-linux" / "latexmk",
        Path("/Library/TeX/texbin/latexmk"),
        Path("/usr/bin/latexmk"),
    ]
    for c in candidatos:
        if c.exists():
            return str(c)
    return None


def errores_del_log(log):
    """Extrae las lineas de error ('! ...') con su contexto del archivo .log."""
    if not log.exists():
        return []
    lineas = log.read_text(encoding="utf-8", errors="replace").splitlines()
    salida = []
    for i, linea in enumerate(lineas):
        if linea.startswith("!"):
            contexto = [l for l in lineas[i:i + 4] if l.strip()]
            salida.append("\n".join(contexto))
    return salida


def main():
    ap = argparse.ArgumentParser(description="Compila el .tex con XeLaTeX (latexmk).")
    ap.add_argument("archivo", nargs="?", default="main.tex", help="archivo .tex (por defecto main.tex)")
    ap.add_argument("--limpiar", action="store_true", help="borra los auxiliares antes de compilar")
    args = ap.parse_args()

    tex = (CARPETA / args.archivo).resolve()
    if not tex.exists():
        sys.exit(f"No existe {tex}")

    latexmk = buscar_latexmk()
    if not latexmk:
        sys.exit("No encontre latexmk. Instala TinyTeX, MiKTeX o TeX Live y vuelve a intentar.")

    # TinyTeX necesita su carpeta bin en el PATH para que latexmk encuentre xelatex y perl.
    env = os.environ.copy()
    env["PATH"] = str(Path(latexmk).parent) + os.pathsep + env.get("PATH", "")

    if args.limpiar:
        for ext in AUXILIARES:
            for f in CARPETA.glob(tex.stem + ext):
                f.unlink()
        print("Auxiliares borrados.")

    print(f"Compilando {tex.name} con {latexmk} ...")
    # -g fuerza la recompilacion: latexmk se acuerda de errores anteriores y se niega a repetir.
    cmd = [latexmk, "-g", "-xelatex", "-interaction=nonstopmode", "-halt-on-error", tex.name]
    r = subprocess.run(cmd, cwd=CARPETA, env=env, capture_output=True, text=True,
                       encoding="utf-8", errors="replace")

    log = tex.with_suffix(".log")
    pdf = tex.with_suffix(".pdf")
    errores = errores_del_log(log)
    log_txt = log.read_text(encoding="utf-8", errors="replace") if log.exists() else ""
    faltan = sorted(set(re.findall(r"File `([^']+)' not found", log_txt)))

    if r.returncode != 0 or errores:
        print("\nLa compilacion fallo.")
        for e in errores[:5]:
            print("-" * 60)
            print(e)
        if faltan:
            print("\nPaquetes de LaTeX que faltan:", ", ".join(faltan))
            print("Instalalos con:  tlmgr install <paquete>   (TinyTeX) o desde la consola de MiKTeX.")
        if not errores:
            print((r.stdout + r.stderr)[-1500:])
        sys.exit(1)

    paginas = re.search(r"Output written on .*\((\d+) pages", log_txt)
    kb = pdf.stat().st_size // 1024 if pdf.exists() else 0
    print(f"Listo: {pdf.name} ({paginas.group(1) if paginas else '?'} paginas, {kb} KB)")
    print(pdf)


if __name__ == "__main__":
    main()

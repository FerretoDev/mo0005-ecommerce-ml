"""Agrega animaciones de entrada y transiciones a presentacion.pptx.

Cada objeto llamado "cN_MM_efecto_..." recibe una animación de entrada:
N = clic en que aparece (0 = automático al entrar a la diapositiva), MM = orden
dentro del clic (se escalonan 0.12 s), efecto = fade | wipeL | wipeU.
Uso: python3 animar.py ../presentacion.pptx
"""
import re, sys, zipfile, shutil, os, tempfile

FILTRO = {'fade': ('10', '0', 'fade'), 'wipeL': ('22', '8', 'wipe(left)'), 'wipeU': ('22', '4', 'wipe(down)')}

def timing(grupos):
    ids = iter(range(3, 100000))
    clicks = []
    for click in sorted(grupos):
        efectos = []
        for k, (orden, spid, ef) in enumerate(sorted(grupos[click])):
            pid, sub, filt = FILTRO[ef]
            tipo = ('clickEffect' if click else 'afterEffect') if k == 0 else 'withEffect'
            delay = min(k * 120, 2400) if len(grupos[click]) < 40 else min(k * 8, 1600)
            dur = 600 if ef == 'fade' else 900
            efectos.append(
                f'<p:par><p:cTn id="{next(ids)}" presetID="{pid}" presetClass="entr" presetSubtype="{sub}" fill="hold" nodeType="{tipo}">'
                f'<p:stCondLst><p:cond delay="{delay}"/></p:stCondLst><p:childTnLst>'
                f'<p:set><p:cBhvr><p:cTn id="{next(ids)}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>'
                f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl><p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr>'
                f'<p:to><p:strVal val="visible"/></p:to></p:set>'
                f'<p:animEffect transition="in" filter="{filt}"><p:cBhvr><p:cTn id="{next(ids)}" dur="{dur}"/>'
                f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl></p:cBhvr></p:animEffect>'
                f'</p:childTnLst></p:cTn></p:par>')
        if click == 0:
            cond = '<p:cond delay="indefinite"/><p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond>'
        else:
            cond = '<p:cond delay="indefinite"/>'
        clicks.append(f'<p:par><p:cTn id="{next(ids)}" fill="hold"><p:stCondLst>{cond}</p:stCondLst><p:childTnLst>'
                      f'<p:par><p:cTn id="{next(ids)}" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>'
                      + ''.join(efectos) + '</p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par>')
    return ('<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>'
            '<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>'
            + ''.join(clicks) +
            '</p:childTnLst></p:cTn><p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>'
            '<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq>'
            '</p:childTnLst></p:cTn></p:par></p:tnLst></p:timing>')

def procesar(xml):
    grupos = {}
    for m in re.finditer(r'<p:cNvPr id="(\d+)" name="c(\d+)_(\d+)_(fade|wipeL|wipeU)_[^"]*"', xml):
        spid, click, orden, ef = m.group(1), int(m.group(2)), int(m.group(3)), m.group(4)
        grupos.setdefault(click, []).append((orden, spid, ef))
    # renumerar clics para que no queden huecos
    claves = sorted(grupos)
    inicio = 0 if 0 in grupos else 1
    grupos = {i + inicio: grupos[k] for i, k in enumerate(claves)}
    xml = re.sub(r'<p:transition.*?</p:transition>|<p:transition[^>]*/>', '', xml, flags=re.S)
    xml = re.sub(r'<p:timing>.*?</p:timing>', '', xml, flags=re.S)
    extra = '<p:transition spd="med"><p:fade/></p:transition>' + (timing(grupos) if grupos else '')
    pos = xml.find('<p:extLst') if '<p:extLst' in xml[xml.rfind('</p:cSld>'):] else -1
    if pos != -1 and pos > xml.rfind('</p:cSld>'):
        return xml[:pos] + extra + xml[pos:]
    return xml.replace('</p:sld>', extra + '</p:sld>')

def main(ruta):
    tmp = ruta + '.tmp'
    with zipfile.ZipFile(ruta) as zin, zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if re.match(r'ppt/slides/slide\d+\.xml$', item.filename):
                data = procesar(data.decode('utf-8')).encode('utf-8')
            zout.writestr(item, data)
    os.replace(tmp, ruta)
    print('animaciones agregadas:', ruta)

if __name__ == '__main__':
    main(sys.argv[1])

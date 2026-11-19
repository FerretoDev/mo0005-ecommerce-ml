// Genera presentacion.pptx. Uso (desde presentacion/fuente):  node generar.js && python3 animar.py ../presentacion.pptx
// Nombres de objeto "cN_MM_efecto_..." => el script animar.py les agrega animaciones de entrada
// (N = clic en que aparecen, 0 = automático; MM = orden dentro del clic; efecto = fade | wipeL | wipeU).
const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

const THEME = {
  name: 'Entregas Olist',
  headFontFace: 'Calibri',
  bodyFontFace: 'Calibri',
  colors: {
    dk1: '1F2433', lt1: 'FFFFFF', dk2: '1F2A44', lt2: 'EEF1F6',
    accent1: '1F2A44', accent2: '2A8C82', accent3: 'E8772E', accent4: 'E8772E', accent5: '5B6B8C', accent6: '9AA5B8',
    hlink: '2A8C82', folHlink: '5B6B8C',
  },
};
// Colores en hex para opciones que solo aceptan hex
const H = { navy: '1F2A44', teal: '2A8C82', coral: 'E8772E', amber: 'E8772E', slate: '5B6B8C', gris: '9AA5B8', claro: 'EEF1F6', texto: '1F2433', linea: 'D5DAE3', blanco: 'FFFFFF', suave: '5B6475' };

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.333 x 7.5
pres.author = 'Marcos Ferreto, David Moya, Sebastián Sánchez y Kendall Alvarado';
pres.title = 'Entregas tardías, satisfacción y fidelización de clientes en Olist';
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const W = 13.333;

// ---------- layouts ----------
pres.defineSlideMaster({
  title: 'PORTADA', background: { color: H.navy },
  objects: [],
  slideNumber: undefined,
});
pres.defineSlideMaster({
  title: 'DIVISOR', background: { color: H.navy },
  objects: [
    { placeholder: { options: { name: 'parte', type: 'body', x: 0.9, y: 2.2, w: 11.5, h: 0.5, fontSize: 18, color: 'C9D1E0', margin: 0 }, text: '' } },
    { placeholder: { options: { name: 'title', type: 'title', x: 0.9, y: 2.8, w: 11.5, h: 1.9, fontSize: 40, bold: true, color: H.blanco, fontFace: 'Calibri', margin: 0, valign: 'top', align: 'left' }, text: '' } },
    { placeholder: { options: { name: 'body', type: 'body', x: 0.9, y: 4.85, w: 11.5, h: 1.4, fontSize: 18, color: 'C9D1E0', margin: 0, valign: 'top' }, text: '' } },
  ],
});
const PRES = { M: 'Marcos Ferreto Estrada', D: 'David Moya Correas', S: 'Sebastián Sánchez Vega', K: 'Kendall Alvarado Artavia' };
for (const [k, nombre] of Object.entries(PRES)) {
  pres.defineSlideMaster({
    title: 'CONTENIDO_' + k, background: { color: H.blanco },
    margin: [0.5, 0.6, 0.7, 0.6],
    objects: [
      { placeholder: { options: { name: 'title', type: 'title', x: 0.6, y: 0.35, w: 12.1, h: 0.9, fontSize: 30, bold: true, color: H.navy, fontFace: 'Calibri', margin: 0, valign: 'middle', align: 'left' }, text: '' } },
      { text: { text: 'MO-0005 Análisis de Algoritmos · UCR, Sede de Occidente', options: { x: 0.6, y: 7.02, w: 7, h: 0.3, fontSize: 10, color: H.suave, margin: 0 } } },
      { text: { text: 'Expone: ' + nombre, options: { x: 7.4, y: 7.02, w: 4.6, h: 0.3, fontSize: 10, color: H.suave, align: 'right', margin: 0 } } },
    ],
    slideNumber: { x: 12.15, y: 7.02, w: 0.6, h: 0.3, fontSize: 10, color: H.suave, align: 'right' },
  });
}

// ---------- utilidades ----------
let n = 0;
const nm = (click, eff, desc) => `c${click}_${String(n++).padStart(3, '0')}_${eff}_${desc}`;
function txt(s, text, o) { s.addText(text, Object.assign({ isTextBox: true, margin: 0, fontSize: 16, color: H.texto, valign: 'top' }, o)); }
function nuevo(k, titulo, seccion) {
  const s = pres.addSlide({ masterName: 'CONTENIDO_' + k, sectionTitle: seccion });
  s.addText(titulo, { placeholder: 'title' });
  return s;
}
function dato(s, x, y, w, cifra, etiqueta, color, click, orden) {
  s.addText([
    { text: cifra, options: { fontSize: 40, bold: true, color: color || H.navy, fontFace: 'Calibri', breakLine: true } },
    { text: etiqueta, options: { fontSize: 15, color: H.suave } },
  ], { x, y, w, h: 1.4, isTextBox: true, margin: 0, valign: 'top', objectName: nm(click, 'fade', 'dato' + (orden || '')) });
}
function tarjeta(s, x, y, w, h, click, desc, fill) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: fill || H.claro }, line: { color: fill || H.claro }, objectName: nm(click, 'fade', desc) });
}
// recuadro de interpretación: qué significa lo que se muestra
function ejemplo(s, x, y, w, h, texto, click, fs) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.06, fill: { color: H.claro }, line: { color: H.claro }, objectName: nm(click, 'fade', 'ej') });
  s.addText(texto, { x: x + 0.2, y: y + 0.1, w: w - 0.4, h: h - 0.2, fontSize: fs || 15, color: H.navy, valign: 'middle', isTextBox: true, margin: 0, objectName: nm(click, 'fade', 'ejt') });
}
const axis = { catAxisLabelColor: H.suave, valAxisLabelColor: H.suave, catAxisLabelFontFace: '+mn-lt', valAxisLabelFontFace: '+mn-lt', catAxisLabelFontSize: 12, valAxisLabelFontSize: 12, valGridLine: { color: 'E3E7EE', size: 0.75 }, catGridLine: { style: 'none' }, catAxisLineShow: true, valAxisLineShow: false, dataLabelFontFace: '+mn-lt', dataLabelFontSize: 12, dataLabelColor: H.texto, titleFontFace: '+mn-lt', titleFontSize: 14, titleColor: H.texto, legendFontFace: '+mn-lt', legendFontSize: 12, legendColor: H.texto };

// nodo estilo KNIME: caja, nombre y luz de estado
function nodo(s, x, y, nombre, detalle, color, click, i) {
  const desc = 'nodo';
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 0.62, h: 0.62, rectRadius: 0.1, fill: { color }, line: { color: H.navy, width: 1 }, objectName: nm(click, 'fade', desc + i + 'a') });
  s.addShape(pres.shapes.OVAL, { x: x + 0.21, y: y + 0.72, w: 0.2, h: 0.2, fill: { color: '3FAE5A' }, line: { color: '2C7A40', width: 0.75 }, objectName: nm(click, 'fade', desc + i + 'b') });
  s.addText([
    { text: nombre, options: { bold: true, fontSize: 12, color: H.texto, breakLine: true } },
    { text: detalle, options: { fontSize: 11, color: H.suave } },
  ], { x: x - 0.55, y: y + 1.0, w: 1.72, h: 0.85, align: 'center', isTextBox: true, margin: 0, valign: 'top', objectName: nm(click, 'fade', desc + i + 'c') });
}
function flecha(s, x1, y1, x2, y2, click, color) {
  s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.max(Math.abs(x2 - x1), 0.001), h: Math.max(Math.abs(y2 - y1), 0.001), flipV: y2 < y1, flipH: x2 < x1, line: { color: color || H.slate, width: 1.5, endArrowType: 'triangle' }, objectName: nm(click, 'wipeL', 'flecha') });
}

// =====================================================================
// 1. PORTADA
pres.addSection({ title: 'Inicio' });
{
  const s = pres.addSlide({ masterName: 'PORTADA', sectionTitle: 'Inicio' });
  txt(s, 'Universidad de Costa Rica · Sede de Occidente · Recinto de Grecia', { x: 0.9, y: 0.8, w: 11.5, h: 0.4, fontSize: 16, color: 'C9D1E0' });
  s.addText('Entregas tardías, satisfacción y fidelización de clientes en Olist', { x: 0.9, y: 1.6, w: 11, h: 1.9, fontSize: 40, bold: true, color: H.blanco, fontFace: 'Calibri', isTextBox: true, margin: 0, valign: 'top', objectName: nm(0, 'fade', 'titulo') });
  txt(s, 'Modelos de aprendizaje automático e indicadores analíticos', { x: 0.9, y: 3.55, w: 11, h: 0.5, fontSize: 22, color: 'E3E8F2', objectName: nm(0, 'fade', 'sub') });
  s.addShape(pres.shapes.LINE, { x: 0.9, y: 4.45, w: 2.2, h: 0, line: { color: H.amber, width: 2.5 }, objectName: nm(0, 'wipeL', 'regla') });
  txt(s, [
    { text: 'Marcos Ferreto Estrada – C5F092', options: { breakLine: true } },
    { text: 'David Moya Correas – C4H773', options: { breakLine: true } },
    { text: 'Sebastián Sánchez Vega – C4J823', options: { breakLine: true } },
    { text: 'Kendall Alvarado Artavia – C5C322' },
  ], { x: 0.9, y: 4.8, w: 6, h: 1.6, fontSize: 16, color: H.blanco, paraSpaceAfter: 4, objectName: nm(0, 'fade', 'autores') });
  txt(s, [
    { text: 'MO-0005 Análisis de Algoritmos, Grupo 01', options: { breakLine: true } },
    { text: 'Prof. Manfred Mejías Acevedo', options: { breakLine: true } },
    { text: 'II Ciclo 2026' },
  ], { x: 7.4, y: 4.8, w: 5, h: 1.2, fontSize: 16, color: 'C9D1E0', paraSpaceAfter: 4, objectName: nm(0, 'fade', 'curso') });
  s.addNotes('Presentación del equipo y del tema.\n- Analizamos los datos públicos de Olist (comercio electrónico en Brasil).\n- Pregunta central: qué pasa cuando un pedido llega tarde y si se puede anticipar.\n- Cada uno presenta el workflow que construyó.');
}

// 2. CONTENIDO
{
  const s = nuevo('M', 'Contenido de la exposición', 'Inicio');
  const partes = [
    ['1', 'Marcos Ferreto', 'El problema, cómo trabajamos y cómo preparamos los datos'],
    ['2', 'David Moya', 'Modelo 1: qué tipos de pedidos hay'],
    ['3', 'Sebastián Sánchez', 'Modelo 2: anticipar qué pedidos llegarán tarde'],
    ['4', 'Kendall Alvarado', 'Indicadores, dashboard y conclusiones'],
  ];
  partes.forEach((p, i) => {
    const y = 1.65 + i * 1.25;
    s.addShape(pres.shapes.OVAL, { x: 0.8, y, w: 0.8, h: 0.8, fill: { color: i === 0 ? H.navy : H.claro }, line: { color: H.navy, width: 1.25 }, objectName: nm(0, 'fade', 'num' + i) });
    s.addText(p[0], { x: 0.8, y, w: 0.8, h: 0.8, align: 'center', valign: 'middle', fontSize: 24, bold: true, fontFace: 'Calibri', color: i === 0 ? H.blanco : H.navy, isTextBox: true, margin: 0, objectName: nm(0, 'fade', 'numt' + i) });
    txt(s, [{ text: p[1], options: { bold: true, fontSize: 20, color: H.navy, breakLine: true } }, { text: p[2], options: { fontSize: 16, color: H.suave } }], { x: 1.9, y: y - 0.02, w: 10.5, h: 0.95, objectName: nm(0, 'fade', 'parte' + i) });
  });
  s.addNotes('- Orden de la exposición = orden en que fluyen los datos.\n- Marcos: problema, datos y ETL. Moya: Modelo 1. Sebastián: Modelo 2. Kendall: KPI, dashboard y conclusiones.');
}

// ---------- PARTE 1: MARCOS ----------
function divisor(sec, parte, titulo, cuerpo, notas) {
  pres.addSection({ title: sec });
  const s = pres.addSlide({ masterName: 'DIVISOR', sectionTitle: sec });
  s.addText(parte, { placeholder: 'parte' });
  s.addText(titulo, { placeholder: 'title' });
  s.addText(cuerpo, { placeholder: 'body' });
  s.addNotes(notas);
  return s;
}
divisor('1. Negocio y datos', 'Parte 1 · Marcos Ferreto Estrada', 'Comprensión del negocio y de los datos', 'Qué es Olist, cuál es el problema y cómo preparamos los datos', '- Primera parte: el problema y cómo preparamos los datos.');

// 4. Contexto
{
  const s = nuevo('M', '¿Qué es Olist y qué datos usamos?', '1. Negocio y datos');
  txt(s, 'Olist es una empresa de Brasil que pone a tiendas pequeñas a vender en plataformas grandes, como Mercado Libre o Amazon. Así viaja un pedido:', { x: 0.6, y: 1.5, w: 6.3, h: 0.95, fontSize: 17, objectName: nm(0, 'fade', 'intro') });
  const pasos = [['1', 'El cliente compra', 'por ejemplo, una lámpara'], ['2', 'La tienda empaca', 'una tienda pequeña de São Paulo'], ['3', 'Una transportista lo lleva', 'Olist no tiene camiones'], ['4', 'El cliente califica', 'de 1 a 5 estrellas, a Olist']];
  pasos.forEach((p, i) => {
    const y = 2.6 + i * 0.78;
    s.addShape(pres.shapes.OVAL, { x: 0.6, y, w: 0.55, h: 0.55, fill: { color: i === 3 ? H.amber : H.navy }, line: { color: i === 3 ? H.amber : H.navy }, objectName: nm(0, 'fade', 'paso' + i) });
    s.addText(p[0], { x: 0.6, y, w: 0.55, h: 0.55, align: 'center', valign: 'middle', bold: true, fontSize: 16, color: H.blanco, isTextBox: true, margin: 0, objectName: nm(0, 'fade', 'pason' + i) });
    txt(s, [{ text: p[1], options: { bold: true, fontSize: 16, breakLine: true } }, { text: p[2], options: { fontSize: 13, color: H.suave } }], { x: 1.35, y: y - 0.04, w: 5.4, h: 0.7, objectName: nm(0, 'fade', 'pasot' + i) });
  });
  ejemplo(s, 0.6, 5.75, 6.3, 1.05, 'Olist no controla el envío, pero el cliente lo califica a él: un retraso de la transportista termina afectando la reputación de Olist.', 1, 14);
  const d = [['99 441', 'pedidos, sep. 2016 – oct. 2018'], ['3 095', 'tiendas vendedoras'], ['27', 'estados de Brasil'], ['9', 'tablas relacionadas (127 MB)']];
  d.forEach((v, i) => {
    const x = 7.3 + (i % 2) * 2.85, y = 1.6 + Math.floor(i / 2) * 2.1;
    tarjeta(s, x, y, 2.6, 1.8, 2, 'tarj' + i);
    dato(s, x + 0.25, y + 0.25, 2.2, v[0], v[1], H.navy, 2, i);
  });
  s.addNotes('- Olist pone a tiendas pequeñas a vender en marketplaces grandes.\n- No tiene bodega ni transporte; aun así promete la fecha y recibe la reseña.\n- Datos: 99 441 pedidos, 3 095 tiendas, 27 estados, 9 tablas.');
}

// 5. Problema
{
  const s = nuevo('M', 'El problema: cuando un pedido llega tarde', '1. Negocio y datos');
  s.addChart(pres.charts.BAR, [{ name: 'Calificación promedio', labels: ['A tiempo', 'Tarde'], values: [4.30, 2.57] }], Object.assign({}, axis, {
    x: 0.6, y: 1.5, w: 5.4, h: 3.7, barDir: 'col', chartColors: [H.teal, H.coral], invertedColors: [H.coral], varyColors: true,
    showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0.00', dataLabelFontSize: 16, dataLabelFontBold: true, valAxisMinVal: 0, valAxisMaxVal: 5, valAxisMajorUnit: 1,
    showTitle: true, title: 'Calificación promedio (1 a 5 estrellas)', showLegend: false, barGapWidthPct: 70, objectName: nm(1, 'wipeU', 'grafico'),
  }));
  const filas = [
    ['8.07 %', 'de los pedidos llega después de la fecha prometida', H.coral],
    ['53.9 %', 'de los pedidos tardíos recibe una reseña negativa (9.2 % si llega a tiempo)', H.coral],
    ['3.12 %', 'de los clientes vuelve a comprar: 4.34 % si su primer pedido llegó a tiempo y 2.97 % si llegó tarde', H.navy],
  ];
  filas.forEach((f, i) => {
    const y = 1.6 + i * 1.5;
    txt(s, f[0], { x: 6.6, y, w: 2.1, h: 0.8, fontSize: 32, bold: true, fontFace: 'Calibri', color: f[2], objectName: nm(i === 0 ? 0 : i + 1, 'fade', 'cifra' + i) });
    txt(s, f[1], { x: 8.8, y: y + 0.05, w: 4.0, h: 1.2, fontSize: 16, color: H.texto, objectName: nm(i === 0 ? 0 : i + 1, 'fade', 'desc' + i) });
  });
  ejemplo(s, 0.6, 5.35, 5.4, 1.45, 'Cuando un pedido llega tarde, llega en promedio 9.4 días después de lo prometido, y más de la mitad de esos clientes deja una reseña negativa.', 1, 14);
  txt(s, 'Pregunta del proyecto: ¿podemos medir esta cadena, identificar dónde ocurre y anticipar el retraso al momento de la compra?', { x: 6.6, y: 6.05, w: 6.2, h: 0.7, fontSize: 15, italic: true, color: H.navy, objectName: nm(4, 'fade', 'pregunta') });
  s.addNotes('- 8.07 % de los pedidos llega tarde.\n- Calificación: 4.30 a tiempo vs 2.57 tarde; 53.9 % de reseñas negativas con retraso.\n- Recompra 3.12 % (4.34 % vs 2.97 % según el primer pedido): efecto pequeño, decirlo así.\n- Cerrar con la pregunta del proyecto.');
}

// 6. Objetivos e hipótesis
{
  const s = nuevo('M', 'Qué queremos lograr y qué queremos comprobar', '1. Negocio y datos');
  const filas = [
    [{ text: 'Objetivo', options: { bold: true, color: H.blanco, fill: { color: H.navy } } }, { text: 'Hoy', options: { bold: true, color: H.blanco, fill: { color: H.navy }, align: 'right' } }, { text: 'Meta', options: { bold: true, color: H.blanco, fill: { color: H.navy }, align: 'right' } }],
    ['Menos pedidos tarde', { text: '8.07 %', options: { align: 'right' } }, { text: '< 6 %', options: { align: 'right' } }],
    ['Clientes más satisfechos (estrellas)', { text: '4.16', options: { align: 'right' } }, { text: '≥ 4.30', options: { align: 'right' } }],
    ['Más clientes que vuelven a comprar', { text: '3.12 %', options: { align: 'right' } }, { text: '4 %', options: { align: 'right' } }],
  ];
  s.addTable(filas, { x: 0.6, y: 1.6, w: 6.3, colW: [4.3, 1.0, 1.0], fontSize: 15, color: H.texto, border: { type: 'solid', pt: 0.75, color: H.linea }, rowH: 0.55, valign: 'middle', objectName: nm(0, 'fade', 'tabla') });
  const hip = [
    ['H1', '¿Los pedidos que llegan tarde reciben menos estrellas?'],
    ['H2', '¿Importa a qué estado va el pedido?'],
    ['H3', '¿Un modelo puede anticipar el retraso mejor que una regla simple?'],
    ['H4', '¿Hay tipos de compra que quedan peor calificados?'],
  ];
  hip.forEach((h, i) => {
    const y = 1.6 + i * 1.15;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.5, y, w: 0.75, h: 0.75, rectRadius: 0.1, fill: { color: H.amber }, line: { color: H.amber }, objectName: nm(i + 1, 'fade', 'h' + i) });
    s.addText(h[0], { x: 7.5, y, w: 0.75, h: 0.75, align: 'center', valign: 'middle', bold: true, fontSize: 18, color: H.navy, isTextBox: true, margin: 0, objectName: nm(i + 1, 'fade', 'ht' + i) });
    txt(s, h[1], { x: 8.45, y: y + 0.05, w: 4.3, h: 0.9, fontSize: 16, objectName: nm(i + 1, 'fade', 'hd' + i) });
  });
  s.addNotes('- Tres objetivos con su meta: < 6 % tardías, calificación 4.30, recompra 4 %.\n- Cuatro hipótesis; Kendall presenta el resultado al final.');
}

// 7. CRISP-DM
{
  const s = nuevo('M', 'Cómo trabajamos: metodología CRISP-DM', '1. Negocio y datos');
  const fases = [
    ['Comprensión del negocio', 'Olist, problema, objetivos'],
    ['Comprensión de los datos', '9 tablas en PostgreSQL'],
    ['Preparación de los datos', 'Workflow 01-ETL'],
    ['Modelado', 'k-means y clasificación'],
    ['Evaluación', 'Validación e hipótesis'],
    ['Despliegue', 'KPI y dashboard'],
  ];
  const cx = 4.0, cy = 4.15, rx = 2.75, ry = 2.05;
  s.addShape(pres.shapes.OVAL, { x: cx - rx, y: cy - ry, w: rx * 2, h: ry * 2, fill: { type: 'none' }, line: { color: H.linea, width: 2, dashType: 'dash' }, objectName: nm(0, 'fade', 'ciclo') });
  s.addText('Ciclo de\nCRISP-DM', { x: cx - 1, y: cy - 0.45, w: 2, h: 0.9, align: 'center', valign: 'middle', fontSize: 16, bold: true, color: H.slate, isTextBox: true, margin: 0, objectName: nm(0, 'fade', 'centro') });
  fases.forEach((f, i) => {
    const a = -Math.PI / 2 + i * Math.PI / 3;
    const x = cx + rx * Math.cos(a) - 1.05, y = cy + ry * Math.sin(a) - 0.42;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 2.1, h: 0.84, rectRadius: 0.1, fill: { color: H.navy }, line: { color: H.navy }, objectName: nm(1, 'fade', 'fase' + i) });
    s.addText([{ text: f[0], options: { bold: true, fontSize: 12, color: H.blanco, breakLine: true } }, { text: f[1], options: { fontSize: 11, color: 'C9D1E0' } }], { x: x + 0.08, y, w: 1.94, h: 0.84, align: 'center', valign: 'middle', isTextBox: true, margin: 0, objectName: nm(1, 'fade', 'faset' + i) });
  });
  txt(s, 'Herramientas', { x: 7.9, y: 1.6, w: 4.8, h: 0.4, fontSize: 20, bold: true, color: H.navy, objectName: nm(2, 'fade', 'herr') });
  const herr = [
    ['PostgreSQL', 'guarda las 9 tablas de datos'],
    ['KNIME', '4 flujos de trabajo, uno por integrante'],
    ['Power BI', 'el dashboard con los indicadores'],
    ['GitHub', 'donde compartimos todo el proyecto'],
  ];
  herr.forEach((h, i) => txt(s, [{ text: h[0], options: { bold: true, breakLine: true } }, { text: h[1], options: { color: H.suave, fontSize: 14 } }], { x: 7.9, y: 2.1 + i * 0.85, w: 4.8, h: 0.8, fontSize: 16, objectName: nm(2, 'fade', 'herr' + i) }));
  ejemplo(s, 7.9, 5.6, 4.85, 1.2, 'Cada fase dejó un producto en el repositorio: la base de datos, los cuatro workflows y el dashboard.', 1, 14);
  s.addNotes('- CRISP-DM: seis fases en ciclo; cada parte de la exposición corresponde a una.\n- Herramientas: PostgreSQL, KNIME, Power BI y GitHub.');
}

// 8. Modelo E-R y PostgreSQL
{
  const s = nuevo('M', 'Los datos: 9 tablas conectadas en PostgreSQL', '1. Negocio y datos');
  const T = {
    customers: [0.6, 1.55, 'customers', '99 441'],
    orders: [3.35, 1.55, 'orders', '99 441'],
    reviews: [6.1, 1.55, 'order_reviews', '99 224'],
    geo: [0.6, 3.75, 'geolocation', '1 000 163'],
    items: [3.35, 3.75, 'order_items', '112 650'],
    payments: [6.1, 3.75, 'order_payments', '103 886'],
    sellers: [0.6, 5.55, 'sellers', '3 095'],
    products: [3.35, 5.55, 'products', '32 951'],
    trans: [6.1, 5.55, 'category_translation', '71'],
  };
  const tw = 2.35, th = 1.0;
  const rel = [['customers', 'orders'], ['orders', 'reviews'], ['orders', 'items'], ['orders', 'payments'], ['items', 'products'], ['items', 'sellers'], ['products', 'trans'], ['customers', 'geo'], ['sellers', 'geo']];
  const centro = k => [T[k][0] + tw / 2, T[k][1] + th / 2];
  rel.forEach(([a, b]) => {
    const [x1, y1] = centro(a), [x2, y2] = centro(b);
    const logica = (a === 'products' && b === 'trans') || b === 'geo';
    s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.max(Math.abs(x2 - x1), 0.001), h: Math.max(Math.abs(y2 - y1), 0.001), flipH: (x2 < x1) !== (y2 < y1) && Math.abs(x2 - x1) > 0.01 && Math.abs(y2 - y1) > 0.01, line: { color: H.slate, width: 1.5, dashType: logica ? 'dash' : 'solid' }, objectName: nm(1, 'fade', 'rel') });
  });
  Object.entries(T).forEach(([k, t]) => {
    const central = k === 'orders';
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: t[0], y: t[1], w: tw, h: th, rectRadius: 0.06, fill: { color: central ? H.navy : H.blanco }, line: { color: H.navy, width: 1.25 }, objectName: nm(0, 'fade', 'tabla' + k) });
    s.addText([{ text: t[2], options: { bold: true, fontSize: 14, color: central ? H.blanco : H.navy, breakLine: true } }, { text: t[3] + ' filas', options: { fontSize: 12, color: central ? 'C9D1E0' : H.suave } }], { x: t[0], y: t[1], w: tw, h: th, align: 'center', valign: 'middle', isTextBox: true, margin: 0, objectName: nm(0, 'fade', 'tablat' + k) });
  });
  txt(s, 'Carga verificada', { x: 9.2, y: 1.6, w: 3.6, h: 0.4, fontSize: 20, bold: true, color: H.navy, objectName: nm(2, 'fade', 'vt') });
  txt(s, [
    { text: 'Un script carga los 9 archivos en PostgreSQL.', options: { bullet: true, breakLine: true } },
    { text: 'Luego comparamos cuántas filas tiene cada tabla contra su archivo original.', options: { bullet: true } },
  ], { x: 9.2, y: 2.1, w: 3.6, h: 2.7, fontSize: 15, paraSpaceAfter: 8, objectName: nm(2, 'fade', 'vtx') });
  ejemplo(s, 9.2, 3.25, 3.55, 1.55, 'El pedido (orders) es el centro: desde él se llega al cliente, los productos, el pago y la reseña.', 1, 13);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 9.2, y: 5.0, w: 3.5, h: 1.3, rectRadius: 0.08, fill: { color: 'E3F1EF' }, line: { color: H.teal, width: 1.25 }, objectName: nm(3, 'fade', 'ok') });
  txt(s, [{ text: '9 de 9', options: { fontSize: 32, bold: true, fontFace: 'Calibri', color: H.teal, breakLine: true } }, { text: 'tablas coinciden fila por fila', options: { fontSize: 14, color: H.texto } }], { x: 9.4, y: 5.1, w: 3.2, h: 1.1, objectName: nm(3, 'fade', 'okt') });
  txt(s, 'En el centro, el pedido (orders). Las líneas muestran cómo se conectan las tablas.', { x: 0.6, y: 6.62, w: 8.3, h: 0.3, fontSize: 11, color: H.suave, objectName: nm(1, 'fade', 'ley') });
  s.addNotes('- 9 tablas; orders es la central.\n- Líneas discontinuas: relaciones lógicas (código postal, traducción de categorías).\n- Script de carga + comparación de conteos: 9 de 9 tablas coinciden.');
}

// 9. Workflow 01-ETL
{
  const s = nuevo('M', 'Limpiar y unir los datos: workflow 01-ETL', '1. Negocio y datos');
  const nodos = [
    ['CSV Reader', '9 archivos', 'F0A54A'],
    ['GroupBy', 'resume por pedido', 'F4D35E'],
    ['Joiner', 'une las tablas', 'F4D35E'],
    ['Row Filter', 'solo entregados (2017–2018)', 'F4D35E'],
    ['Date&Time Difference', 'días de entrega y de retraso', 'F4D35E'],
    ['Rule Engine', '¿llegó tarde?', 'F4D35E'],
    ['CSV Writer', 'guarda la tabla final', 'F0A54A'],
  ];
  const y = 2.0;
  nodos.forEach((d, i) => {
    const x = 1.05 + i * 1.78;
    if (i > 0) flecha(s, x - 1.13, y + 0.31, x - 0.03, y + 0.31, 1);
    nodo(s, x, y, d[0], d[1], d[2], 1, i);
  });
  txt(s, 'El flujo tiene 40 nodos; estos son los pasos principales', { x: 0.6, y: 1.45, w: 8, h: 0.35, fontSize: 13, color: H.suave, objectName: nm(0, 'fade', 'nota') });
  ejemplo(s, 0.6, 4.05, 12.15, 0.75, 'La información de cada pedido estaba repartida en varios archivos; el workflow deja una sola fila por pedido, lista para los modelos.', 2, 15);
  tarjeta(s, 0.6, 5.0, 3.9, 1.75, 3, 'r1');
  dato(s, 0.85, 5.15, 3.5, '96 144', 'pedidos listos para analizar', H.navy, 3, 1);
  tarjeta(s, 4.75, 5.0, 3.9, 1.75, 3, 'r2');
  dato(s, 5.0, 5.15, 3.5, '✓ Cuadra', 'el mismo número que da PostgreSQL', H.teal, 3, 2);
  tarjeta(s, 8.9, 5.0, 3.85, 1.75, 3, 'r3');
  dato(s, 9.15, 5.15, 3.4, '8.07 %', 'de esos pedidos llegó tarde', H.coral, 3, 3);
  s.addNotes('- Workflow 01-ETL: 40 nodos; mostrar los pasos principales.\n- Agrupar ítems, pagos y reseñas por pedido; unir; filtrar entregados 2017–2018; calcular días y es_tardio.\n- Resultado: 96 144 pedidos, igual que la vista de control en PostgreSQL; 8.07 % tardíos.\n- Pasar la palabra a Moya.');
}

// ---------- PARTE 2: MOYA ----------
divisor('2. Modelo 1', 'Parte 2 · David Moya Correas', 'Modelo 1: ¿qué tipos de pedidos hay?', 'Agrupamos los pedidos parecidos y vimos a cuál grupo le va peor', '- Modelo 1: segmentación de pedidos con k-means.');

// 11. Planteamiento + workflow 02
{
  const s = nuevo('D', 'Modelo 1: agrupar pedidos parecidos (k-means)', '2. Modelo 1');
  txt(s, [
    { text: 'Pregunta: ', options: { bold: true, color: H.navy } },
    { text: 'si juntamos los pedidos parecidos, ¿qué grupos aparecen y a cuál le va peor?' },
  ], { x: 0.6, y: 1.5, w: 12.1, h: 0.5, fontSize: 18, objectName: nm(0, 'fade', 'preg') });
  const filas = [
    [{ text: 'Lo que el modelo mira de cada pedido', options: { bold: true, color: H.blanco, fill: { color: H.navy } } }],
    ['Precio'], ['Costo del envío'], ['Número de cuotas'], ['Días que tardó en llegar'], ['Días de retraso'], ['Si iba al mismo estado de la tienda'],
  ];
  s.addTable(filas, { x: 0.6, y: 2.2, w: 5.4, colW: [5.4], fontSize: 15, color: H.texto, border: { type: 'solid', pt: 0.75, color: H.linea }, rowH: 0.42, objectName: nm(0, 'fade', 'tabla') });
  ejemplo(s, 0.6, 5.2, 5.4, 1.6, 'La calificación no entra al modelo. Se usa después para comprobar si algún grupo queda peor calificado (H4).', 0, 14);
  const nodos = [['CSV Reader', 'ordenes_etl.csv', 'F0A54A'], ['Math Formula', 'ajusta precio y envío', 'F4D35E'], ['Normalizer', 'pone todo en la misma escala', 'F4D35E'], ['k-Means', 'forma 4 grupos', '4FA36B'], ['GroupBy', 'describe cada grupo', 'F4D35E'], ['One-way ANOVA', 'compara las estrellas', '4FA36B']];
  nodos.forEach((d, i) => {
    const fila = Math.floor(i / 3), col = fila === 0 ? i % 3 : 2 - (i % 3);
    const x = 7.15 + col * 1.95, y = 2.2 + fila * 2.15;
    if (i % 3 > 0) {
      if (fila === 0) flecha(s, x - 1.3, y + 0.31, x - 0.03, y + 0.31, 1);
      else flecha(s, x + 1.92, y + 0.31, x + 0.65, y + 0.31, 1);
    }
    nodo(s, x, y, d[0], d[1], d[2], 1, i);
  });
  { // codo: de Normalizer (fila 1, col 3) a k-Means (fila 2, col 3)
    const x = 7.15 + 2 * 1.95, y1 = 2.2 + 0.31, y2 = 2.2 + 2.15 + 0.31;
    s.addShape(pres.shapes.LINE, { x: x + 0.65, y: y1, w: 0.45, h: 0, line: { color: H.slate, width: 1.5 }, objectName: nm(1, 'wipeL', 'codo1') });
    s.addShape(pres.shapes.LINE, { x: x + 1.1, y: y1, w: 0, h: y2 - y1, line: { color: H.slate, width: 1.5 }, objectName: nm(1, 'wipeU', 'codo2') });
    s.addShape(pres.shapes.LINE, { x: x + 0.65, y: y2, w: 0.45, h: 0, flipH: true, line: { color: H.slate, width: 1.5, endArrowType: 'triangle' }, objectName: nm(1, 'fade', 'codo3') });
  }
  txt(s, 'Workflow 02-Clustering en KNIME (14 nodos)', { x: 6.75, y: 6.35, w: 6, h: 0.35, fontSize: 12, color: H.suave, objectName: nm(1, 'fade', 'nn') });
  s.addNotes('- k-means agrupa pedidos parecidos sin etiquetas previas.\n- Seis variables; precio y flete con logaritmo; todo estandarizado.\n- La calificación queda fuera para no hacer circular la prueba de H4.\n- Recorrer el workflow 02.');
}

// 12. Elección de k
{
  const s = nuevo('D', '¿Cuántos grupos? Probamos de 2 a 8 y el mejor fue 4', '2. Modelo 1');
  const ks = ['2', '3', '4', '5', '6', '7', '8'];
  s.addChart(pres.charts.LINE, [{ name: 'Silueta', labels: ks, values: [0.272, 0.287, 0.305, 0.272, 0.231, 0.230, 0.221] }], Object.assign({}, axis, {
    x: 0.6, y: 1.5, w: 6.0, h: 4.0, chartColors: [H.navy], lineSize: 2.5, lineDataSymbol: 'circle', lineDataSymbolSize: 9, showValue: true, dataLabelPosition: 't', dataLabelFormatCode: '0.000',
    valAxisMinVal: 0.2, valAxisMaxVal: 0.32, valAxisLabelFormatCode: '0.00', showTitle: true, title: 'Qué tan separados quedan los grupos (más alto = mejor)', showLegend: false, catAxisTitle: 'número de grupos', showCatAxisTitle: true, catAxisTitleFontSize: 12, catAxisTitleColor: H.suave, objectName: nm(0, 'wipeL', 'silueta'),
  }));
  s.addChart(pres.charts.LINE, [{ name: 'Inercia', labels: ks, values: [444062, 368642, 301593, 273977, 253415, 240525, 222060] }], Object.assign({}, axis, {
    x: 6.9, y: 1.5, w: 5.9, h: 4.0, chartColors: [H.slate], lineSize: 2.5, lineDataSymbol: 'circle', lineDataSymbolSize: 9, valAxisLabelFormatCode: '#,##0', valAxisMinVal: 200000,
    showTitle: true, title: 'Qué tan compactos quedan (el «codo» marca dónde deja de mejorar)', showLegend: false, catAxisTitle: 'número de grupos', showCatAxisTitle: true, catAxisTitleFontSize: 12, catAxisTitleColor: H.suave, objectName: nm(1, 'wipeL', 'codo'),
  }));
  ejemplo(s, 0.6, 5.65, 12.15, 1.15, 'Con 4 grupos la separación es máxima (silueta 0.305) y coincide con el codo. Al repetirlo con 5 semillas distintas se obtienen los mismos grupos.', 2, 15);
  s.addNotes('- Probamos k de 2 a 8.\n- Silueta máxima en k = 4 (0.305; 0.297 en KNIME); el codo coincide.\n- Estable con 5 semillas (ARI ≥ 0.999).\n- Silueta moderada: grupos útiles para describir, no categorías rígidas.');
}

// 13. Dispersión de segmentos (muestra real)
{
  const s = nuevo('D', 'Los cuatro grupos de pedidos', '2. Modelo 1');
  const pts = JSON.parse(fs.readFileSync(path.join(__dirname, 'muestra_segmentos.json'), 'utf8'));
  const X0 = 1.3, X1 = 8.3, Y0 = 6.05, Y1 = 1.65; // área del gráfico
  const xs = v => X0 + (v / 60) * (X1 - X0);
  const ys = v => Y0 - ((v - 0.7) / (3.4 - 0.7)) * (Y0 - Y1);
  s.addShape(pres.shapes.LINE, { x: X0, y: Y0, w: X1 - X0, h: 0, line: { color: H.suave, width: 1 }, objectName: nm(0, 'fade', 'ejex') });
  s.addShape(pres.shapes.LINE, { x: X0, y: Y1, w: 0, h: Y0 - Y1, line: { color: H.suave, width: 1 }, objectName: nm(0, 'fade', 'ejey') });
  [0, 10, 20, 30, 40, 50, 60].forEach(v => txt(s, String(v), { x: xs(v) - 0.3, y: Y0 + 0.07, w: 0.6, h: 0.25, fontSize: 11, color: H.suave, align: 'center', objectName: nm(0, 'fade', 'tx') }));
  [[1, '10'], [2, '100'], [3, '1 000']].forEach(([v, l]) => txt(s, l, { x: X0 - 0.75, y: ys(v) - 0.12, w: 0.65, h: 0.25, fontSize: 11, color: H.suave, align: 'right', objectName: nm(0, 'fade', 'ty') }));
  txt(s, 'días de entrega', { x: X0, y: Y0 + 0.33, w: X1 - X0, h: 0.3, fontSize: 12, color: H.suave, align: 'center', objectName: nm(0, 'fade', 'tx') });
  txt(s, 'precio (reales, escala log)', { x: 0.25, y: Y1 - 0.42, w: 3, h: 0.3, fontSize: 12, color: H.suave, objectName: nm(0, 'fade', 'ty') });
  const r = 0.075;
  pts.forEach(p => s.addShape(pres.shapes.OVAL, { x: xs(p[0]) - r, y: ys(p[1]) - r, w: 2 * r, h: 2 * r, fill: { color: 'C3C9D4' }, line: { color: 'C3C9D4', width: 0.25 }, objectName: 'punto_gris' }));
  const grupos = [
    ['Estándar entre estados', '9AA5B8', '43.2 % · 0.7 % tardías · 4.31'],
    ['Locales rápidas', H.teal, '31.7 % · 4.5 % tardías · 4.32'],
    ['Compras grandes a plazos', H.navy, '17.4 % · 2.6 % tardías · 4.16'],
    ['Entregas problemáticas', H.coral, '7.7 % · 77.4 % tardías · 2.59'],
  ];
  grupos.forEach((g, i) => {
    const click = i + 1;
    pts.filter(p => p[2] === g[0]).forEach(p => s.addShape(pres.shapes.OVAL, { x: xs(p[0]) - r, y: ys(p[1]) - r, w: 2 * r, h: 2 * r, fill: { color: g[1] }, line: { color: H.blanco, width: 0.5 }, objectName: nm(click, 'fade', 'p') }));
    const y = 1.7 + i * 1.12;
    s.addShape(pres.shapes.OVAL, { x: 9.0, y: y + 0.07, w: 0.28, h: 0.28, fill: { color: g[1] }, line: { color: g[1] }, objectName: nm(click, 'fade', 'ley') });
    txt(s, [{ text: g[0], options: { bold: true, fontSize: 16, color: H.texto, breakLine: true } }, { text: g[2], options: { fontSize: 13, color: H.suave } }], { x: 9.45, y, w: 3.4, h: 0.9, objectName: nm(click, 'fade', 'leyt') });
  });
  txt(s, '260 pedidos reales al azar. Debajo de cada grupo: tamaño · % que llega tarde · estrellas.', { x: 9.0, y: 6.15, w: 3.85, h: 0.75, fontSize: 11, color: H.suave, objectName: nm(0, 'fade', 'nota') });
  s.addNotes('- Muestra de 260 pedidos reales; ejes: días de entrega y precio.\n- Mostrar los grupos uno por uno con cada clic.\n- Aclarar: el modelo usa 6 variables y aquí se ven 2.');
}

// 14. Perfil y H4
{
  const s = nuevo('D', 'Un grupo pequeño concentra los retrasos', '2. Modelo 1');
  const hd = t => ({ text: t, options: { bold: true, color: H.blanco, fill: { color: H.navy }, align: 'right' } });
  const filas = [
    [{ text: 'Grupo', options: { bold: true, color: H.blanco, fill: { color: H.navy } } }, hd('Pedidos'), hd('Días en llegar'), hd('Llegan tarde'), hd('Estrellas'), hd('Reseñas malas')],
    ['Estándar entre estados', '41 511', '12.4', '0.7 %', '4.31', '8.6 %'],
    ['Locales rápidas', '30 509', '7.3', '4.5 %', '4.32', '8.9 %'],
    ['Compras grandes a plazos', '16 767', '12.4', '2.6 %', '4.16', '12.7 %'],
    ['Entregas problemáticas', '7 357', '35.1', '77.4 %', '2.59', '52.8 %'],
  ].map((f, i) => i === 0 ? f : f.map((c, j) => ({ text: c, options: { align: j ? 'right' : 'left', bold: i === 4, color: i === 4 ? H.coral : H.texto } })));
  s.addTable(filas, { x: 0.6, y: 1.55, w: 12.1, colW: [3.6, 1.6, 1.7, 1.7, 1.6, 1.9], fontSize: 16, border: { type: 'solid', pt: 0.75, color: H.linea }, rowH: 0.5, valign: 'middle', objectName: nm(0, 'fade', 'tabla') });
  tarjeta(s, 0.6, 4.4, 5.85, 2.3, 1, 'h4');
  txt(s, [{ text: 'H4: sí, hay grupos peor calificados', options: { bold: true, fontSize: 20, color: H.teal, breakLine: true } }, { text: 'La diferencia de estrellas entre grupos es real, no casualidad (prueba de Kruskal-Wallis, p < 0.001).', options: { fontSize: 16 } }], { x: 0.85, y: 4.6, w: 5.4, h: 1.9, objectName: nm(1, 'fade', 'h4t') });
  tarjeta(s, 6.85, 4.4, 5.85, 2.3, 2, 'sens');
  txt(s, [{ text: 'Pero lo que pesa es la entrega', options: { bold: true, fontSize: 20, color: 'C25E1C', breakLine: true } }, { text: 'Si agrupamos solo por lo que se compró, las estrellas casi no cambian (de 4.02 a 4.29). Lo que baja la calificación es el retraso.', options: { fontSize: 16 } }], { x: 7.1, y: 4.6, w: 5.4, h: 1.95, objectName: nm(2, 'fade', 'senst') });
  s.addNotes('- Fila naranja: entregas problemáticas (7.7 %): 35 días, 77 % tardías, 2.59 estrellas.\n- H4 se confirma (Kruskal-Wallis H = 7 767, p < 0.001).\n- Advertencia: ese grupo se forma con el retraso; con variables de compra la calificación casi no cambia (4.02–4.29).\n- Pasar la palabra a Sebastián.');
}

// ---------- PARTE 3: SEBASTIÁN ----------
divisor('3. Modelo 2', 'Parte 3 · Sebastián Sánchez Vega', 'Modelo 2: ¿se puede anticipar el retraso?', 'Un modelo que, al momento de la compra, estima si el pedido llegará tarde', '- Modelo 2: predicción del retraso al comprar.');

// 16. Planteamiento + partición + workflow
{
  const s = nuevo('S', 'Modelo 2: ¿se puede saber si un pedido llegará tarde?', '3. Modelo 2');
  txt(s, [
    { text: 'Idea: ', options: { bold: true, color: H.navy } },
    { text: 'al momento de la compra, estimar si el pedido llegará tarde. El modelo solo usa lo que se sabe al comprar: precio, envío, peso, tamaño, plazo prometido, estados, categoría y día.' },
  ], { x: 0.6, y: 1.45, w: 12.1, h: 0.9, fontSize: 16, objectName: nm(0, 'fade', 'obj') });
  // línea de tiempo
  const x0 = 0.6, x1 = 12.7, y = 2.65, corte = x0 + (x1 - x0) * (15 / 20);
  s.addShape(pres.shapes.RECTANGLE, { x: x0, y, w: corte - x0 - 0.04, h: 0.55, fill: { color: H.navy }, line: { color: H.navy }, objectName: nm(1, 'wipeL', 'train') });
  s.addText('Aprende con 64 052 pedidos (ene. 2017 – mar. 2018)', { x: x0 + 0.15, y, w: corte - x0 - 0.3, h: 0.55, fontSize: 14, bold: true, color: H.blanco, valign: 'middle', isTextBox: true, margin: 0, objectName: nm(1, 'fade', 'traint') });
  s.addShape(pres.shapes.RECTANGLE, { x: corte + 0.04, y, w: x1 - corte - 0.04, h: 0.55, fill: { color: H.teal }, line: { color: H.teal }, objectName: nm(2, 'wipeL', 'test') });
  s.addText('Se evalúa con 32 092 (abr. – ago. 2018)', { x: corte + 0.15, y, w: x1 - corte - 0.2, h: 0.55, fontSize: 14, bold: true, color: H.blanco, valign: 'middle', isTextBox: true, margin: 0, objectName: nm(2, 'fade', 'testt') });
  txt(s, 'Como un examen: el modelo aprende con el pasado y lo evaluamos con meses que nunca vio.', { x: 0.6, y: 3.3, w: 12.1, h: 0.35, fontSize: 13, color: H.suave, objectName: nm(2, 'fade', 'part') });
  const nodos = [['CSV Reader', 'ordenes_etl.csv', 'F0A54A'], ['Row Splitter', 'separa pasado y examen', 'F4D35E'], ['Equal Size Sampling', 'equilibra tarde y a tiempo', 'F4D35E'], ['Learner', 'entrena los 2 modelos', '4FA36B'], ['Predictor', 'estima el riesgo', '4FA36B'], ['Scorer y ROC', 'mide los aciertos', '6C8FC7']];
  nodos.forEach((d, i) => {
    const x = 1.05 + i * 2.1, yy = 4.0;
    if (i > 0) flecha(s, x - 1.45, yy + 0.31, x - 0.03, yy + 0.31, 3);
    nodo(s, x, yy, d[0], d[1], d[2], 3, i);
  });
  ejemplo(s, 0.6, 6.0, 12.15, 0.8, 'El modelo no responde sí o no: da una probabilidad de retraso para cada pedido, y con ella se ordenan los pedidos por riesgo.', 4, 15);
  s.addNotes('- Objetivo: estimar el riesgo de retraso al momento de la compra.\n- Solo 13 variables conocidas al comprar (evitar fuga de información).\n- Partición temporal: entrenamiento hasta marzo de 2018, prueba abril–agosto (5.85 % vs 9.19 % tardíos).\n- Recorrer el workflow 03.');
}

// 17. Resultados AUC
{
  const s = nuevo('S', 'El modelo más sencillo fue el que mejor predijo', '3. Modelo 2');
  s.addChart([
    { type: pres.charts.BAR, data: [{ name: 'AUC', labels: ['Decir siempre «a tiempo»', '«Otro estado = tarde»', 'Random Forest', 'Regresión logística'], values: [0.500, 0.472, 0.590, 0.719] }], options: { barDir: 'col', chartColors: [H.navy], barGapWidthPct: 60, showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0.00' } },
    { type: pres.charts.LINE, data: [{ name: 'Meta: 0.60', labels: ['Decir siempre «a tiempo»', '«Otro estado = tarde»', 'Random Forest', 'Regresión logística'], values: [0.6, 0.6, 0.6, 0.6] }], options: { chartColors: [H.coral], lineSize: 2, lineDash: 'dash', lineDataSymbol: 'none', showValue: false } },
  ], Object.assign({}, axis, {
    x: 0.6, y: 1.5, w: 7.2, h: 5.2, valAxisMinVal: 0, valAxisMaxVal: 0.8, valAxisMajorUnit: 0.2, valAxisLabelFormatCode: '0.0',
    showTitle: true, title: 'Puntaje AUC en el examen (0.5 = adivinar al azar; 1 = perfecto)', showLegend: true, legendPos: 'b', objectName: nm(0, 'wipeU', 'auc'),
  }));
  txt(s, [
    { text: 'H3: sí', options: { bold: true, color: H.teal, fontSize: 22, breakLine: true } },
    { text: 'La regresión logística es la única que pasa la meta de 0.60 y le gana a las reglas simples.', options: { breakLine: true } },
    { text: ' ', options: { breakLine: true, fontSize: 10 } },
    { text: 'Comparamos 2 modelos contra 2 reglas de sentido común.', options: { color: H.suave } },
  ], { x: 8.2, y: 1.8, w: 4.6, h: 3.0, fontSize: 17, objectName: nm(1, 'fade', 'concl') });
  ejemplo(s, 8.2, 5.0, 4.6, 1.75, 'Las dos reglas simples no superan el 0.5 del azar. La regresión logística sí, y pasa la meta de 0.60.', 2, 15);
  s.addNotes('- AUC: 0.5 equivale al azar.\n- Reglas simples: 0.50 y 0.47. Random Forest: 0.59. Regresión logística: 0.72.\n- H3 se confirma.\n- Un modelo lineal puede ganar cuando la señal es débil.');
}

// 18. Uso: niveles de riesgo
{
  const s = nuevo('S', 'Para qué sirve: saber qué pedidos vigilar primero', '3. Modelo 2');
  dato(s, 0.6, 1.6, 5, '79 de 100', 'pedidos que llegaron tarde, el modelo los había marcado', H.teal, 0, 1);
  dato(s, 0.6, 3.25, 5, '1 de 10', 'alertas termina en retraso: avisa de más, por eso no sirve para decidir solo', H.coral, 1, 2);
  ejemplo(s, 0.6, 4.9, 5.4, 1.85, 'Detecta la mayoría de los retrasos a cambio de muchas falsas alarmas: sirve para decidir qué pedidos revisar primero, no para decidir solo.', 2, 15);
  s.addChart(pres.charts.BAR, [{ name: '% tardías', labels: ['Riesgo alto\n3 210 pedidos', 'Riesgo medio\n4 813', 'Riesgo bajo\n24 069'], values: [13.3, 11.3, 3.8] }], Object.assign({}, axis, {
    x: 6.4, y: 1.5, w: 6.4, h: 4.6, barDir: 'col', chartColors: [H.coral], showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0.0"%"', dataLabelFontSize: 14, dataLabelFontBold: true,
    valAxisMinVal: 0, valAxisMaxVal: 16, valAxisLabelFormatCode: '0"%"', showTitle: true, title: '% que llega tarde según el riesgo que dio el modelo', showLegend: false, barGapWidthPct: 60, objectName: nm(2, 'wipeU', 'riesgo'),
  }));
  txt(s, 'El grupo de riesgo alto llega tarde 3.5 veces más que el de riesgo bajo y concentra el 22.8 % de todos los retrasos.', { x: 6.4, y: 6.2, w: 6.4, h: 0.6, fontSize: 13, color: H.suave, objectName: nm(2, 'fade', 'nota') });
  s.addNotes('- Exhaustividad 0.787: detecta 79 de cada 100 tardíos.\n- Precisión 0.100: 1 de cada 10 alertas es un retraso real.\n- Uso: priorizar. Riesgo alto: 13.3 % tardías vs 3.8 % en riesgo bajo; concentra el 22.8 % de los retrasos.');
}

// 19. Geografía
{
  const s = nuevo('S', 'Sorpresa: en 2018 cambió dónde se atrasan los pedidos', '3. Modelo 2');
  s.addChart(pres.charts.BAR, [
    { name: 'Mismo estado', labels: ['Hasta mar. 2018', 'Abr. – ago. 2018'], values: [5.7, 6.6] },
    { name: 'A otro estado', labels: ['Hasta mar. 2018', 'Abr. – ago. 2018'], values: [11.0, 5.3] },
  ], Object.assign({}, axis, {
    x: 0.6, y: 1.5, w: 7.2, h: 5.2, barDir: 'col', barGrouping: 'clustered', chartColors: [H.teal, H.coral], showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0.0"%"', dataLabelFontSize: 14, dataLabelFontBold: true,
    valAxisMinVal: 0, valAxisMaxVal: 12, valAxisLabelFormatCode: '0"%"', showTitle: true, title: '% de pedidos que llegan tarde', showLegend: true, legendPos: 'b', barGapWidthPct: 80, objectName: nm(0, 'wipeU', 'geo'),
  }));
  txt(s, [
    { text: 'Hasta marzo de 2018, enviar a otro estado era más riesgoso: casi el doble de retrasos.', options: { bullet: true, breakLine: true } },
    { text: 'De abril a agosto se dio vuelta.', options: { bullet: true, breakLine: true } },
    { text: 'Por eso la regla «otro estado = tarde» falló en el examen.', options: { bullet: true } },
  ], { x: 8.2, y: 1.6, w: 4.6, h: 3.3, fontSize: 16, paraSpaceAfter: 10, objectName: nm(1, 'fade', 'txt') });
  tarjeta(s, 8.2, 5.05, 4.6, 1.6, 2, 'lec');
  txt(s, [{ text: 'Lección', options: { bold: true, color: H.navy, breakLine: true } }, { text: 'Una relación que se cumplía en 2017 dejó de cumplirse en 2018: el modelo hay que revisarlo y reentrenarlo periódicamente.', options: {} }], { x: 8.4, y: 5.2, w: 4.25, h: 1.35, fontSize: 15, objectName: nm(2, 'fade', 'lect') });
  s.addNotes('- Entrenamiento: entre estados 11.0 % vs mismo estado 5.7 %.\n- Prueba: se invierte (5.3 % vs 6.6 %); por eso la regla geográfica da AUC 0.47.\n- H2: se confirma en el periodo completo, pero no es estable.\n- Pasar la palabra a Kendall.');
}

// ---------- PARTE 4: KENDALL ----------
divisor('4. KPI y conclusiones', 'Parte 4 · Kendall Alvarado Artavia', 'Indicadores, dashboard y conclusiones', 'Cómo medir la mejora, qué comprobamos y qué recomendamos', '- Indicadores, dashboard y conclusiones.');

// 21. KPI
{
  const s = nuevo('K', '11 indicadores para saber si Olist mejora', '4. KPI y conclusiones');
  const grupos = [
    ['¿Llegan a tiempo?', [['Pedidos que llegan tarde', '8.07 %', 'meta < 6 %'], ['Días en llegar (promedio)', '12.5'], ['Días de atraso, cuando hay', '9.4'], ['Días: otro estado vs. mismo', '15.1 vs 7.9'], ['Pedidos que no se completan', '1.24 %']]],
    ['¿Están contentos los clientes?', [['Estrellas promedio', '4.16', 'meta ≥ 4.30'], ['Reseñas malas (1–2 estrellas)', '12.73 %', 'meta < 10 %'], ['Estrellas que se pierden por llegar tarde', '1.72']]],
    ['¿Vuelven a comprar?', [['Clientes que vuelven', '3.12 %', 'meta 4 %'], ['Si el primer pedido llegó a tiempo vs. tarde', '4.34 vs 2.97 %'], ['Sin vs. con reseña mala', '4.32 vs 3.73 %']]],
  ];
  grupos.forEach((g, gi) => {
    const x = 0.6 + gi * 4.1;
    tarjeta(s, x, 1.5, 3.85, 5.1, gi, 'kpi' + gi);
    txt(s, g[0], { x: x + 0.25, y: 1.7, w: 3.4, h: 0.5, fontSize: 18, bold: true, color: H.navy, objectName: nm(gi, 'fade', 'kt' + gi) });
    g[1].forEach((k, i) => {
      const y = 2.35 + i * 0.86;
      txt(s, [{ text: k[1], options: { fontSize: 20, bold: true, fontFace: 'Calibri', color: k[2] ? H.coral : H.navy, breakLine: true } }, { text: k[0] + (k[2] ? ' (' + k[2] + ')' : ''), options: { fontSize: 12, color: H.texto } }], { x: x + 0.25, y, w: 3.45, h: 0.8, objectName: nm(gi, 'fade', 'k' + gi + i) });
    });
  });
  txt(s, 'En naranja, los indicadores que tienen meta: hoy ninguno la alcanza.', { x: 0.6, y: 6.66, w: 8, h: 0.3, fontSize: 12, color: H.suave, objectName: nm(3, 'fade', 'nota') });
  s.addNotes('- 11 indicadores en tres preguntas: ¿llegan a tiempo?, ¿están contentos?, ¿vuelven?\n- Calculados en el workflow 04 y verificados con SQL.\n- Los cuatro que tienen meta no la cumplen hoy.');
}

// 22. Dashboard
{
  const s = nuevo('K', 'Dashboard: cuando suben los retrasos, baja la calificación', '4. KPI y conclusiones');
  const meses = ['ene 17', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic', 'ene 18', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago'];
  const tarde = [3.07, 3.21, 5.58, 7.86, 3.61, 3.86, 3.43, 3.32, 5.20, 5.29, 14.31, 8.38, 6.56, 15.97, 21.36, 5.31, 8.22, 1.31, 4.20, 9.88];
  const cal = [4.20, 4.20, 4.19, 4.14, 4.24, 4.22, 4.26, 4.31, 4.27, 4.21, 3.99, 4.09, 4.11, 3.88, 3.81, 4.21, 4.24, 4.31, 4.32, 4.32];
  s.addChart(pres.charts.LINE, [{ name: '% tardías', labels: meses, values: tarde }], Object.assign({}, axis, {
    x: 0.6, y: 1.45, w: 7.4, h: 2.65, chartColors: [H.coral], lineSize: 2.5, lineDataSymbol: 'circle', lineDataSymbolSize: 6, valAxisMinVal: 0, valAxisMaxVal: 25, valAxisMajorUnit: 5, valAxisLabelFormatCode: '0"%"', catAxisLabelFontSize: 10,
    showTitle: true, title: '% de entregas tardías por mes de compra', showLegend: false, objectName: nm(0, 'wipeL', 'tarde'),
  }));
  s.addChart(pres.charts.LINE, [{ name: 'Calificación', labels: meses, values: cal }], Object.assign({}, axis, {
    x: 0.6, y: 4.2, w: 7.4, h: 2.65, chartColors: [H.navy], lineSize: 2.5, lineDataSymbol: 'circle', lineDataSymbolSize: 6, valAxisMinVal: 3.7, valAxisMaxVal: 4.4, valAxisMajorUnit: 0.1, valAxisLabelFormatCode: '0.0', catAxisLabelFontSize: 10,
    showTitle: true, title: 'Calificación promedio por mes de compra', showLegend: false, objectName: nm(1, 'wipeL', 'cal'),
  }));
  s.addChart(pres.charts.BAR, [{ name: '% tardías', labels: ['Alagoas', 'Maranhão', 'Piauí', 'Sergipe', 'Ceará', 'Río de Janeiro', 'São Paulo'], values: [23.8, 19.6, 16.0, 15.4, 15.3, 13.4, 5.9] }], Object.assign({}, axis, {
    x: 8.3, y: 1.45, w: 4.5, h: 4.4, barDir: 'bar', chartColors: [H.coral], catAxisOrientation: 'maxMin', showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0.0"%"', valAxisHidden: true, valGridLine: { style: 'none' }, valAxisMaxVal: 30, valAxisMinVal: 0,
    showTitle: true, title: '% tardías por estado del cliente', showLegend: false, barGapWidthPct: 50, objectName: nm(2, 'wipeL', 'estados'),
  }));
  txt(s, 'Noviembre de 2017, mes del Black Friday, tuvo el récord de pedidos y un pico de retrasos (14.3 %); en marzo de 2018 llegaron a 21.4 %. Esos meses bajan las estrellas.', { x: 8.3, y: 5.9, w: 4.5, h: 1.0, fontSize: 13, color: H.suave, objectName: nm(2, 'fade', 'nota') });
  s.addNotes('- Dashboard de Power BI: cinco páginas; medidas verificadas con DAX.\n- Retrasos por mes con picos en noviembre de 2017 y febrero–marzo de 2018; la calificación cae en esos meses.\n- Por estado: Alagoas 23.8 %, Maranhão 19.6 %, São Paulo 5.9 %.');
}

// 23. Hipótesis
{
  const s = nuevo('K', '¿Qué pasó con las cuatro hipótesis?', '4. KPI y conclusiones');
  const hip = [
    ['H1', '¿Tarde = menos estrellas?', 'Sí', '4.30 a tiempo vs 2.57 tarde (Mann-Whitney, p < 0.001)', H.teal],
    ['H2', '¿Importa a qué estado va?', 'Sí, pero cambió en 2018', 'Diferencia clara en todo el periodo (χ², p < 0.001)', H.amber],
    ['H3', '¿Se puede anticipar el retraso?', 'Sí, para priorizar', 'Regresión logística: AUC 0.72, arriba de la meta de 0.60', H.teal],
    ['H4', '¿Hay compras peor calificadas?', 'Sí, por la entrega', 'Diferencia real entre grupos (Kruskal-Wallis, p < 0.001)', H.amber],
  ];
  hip.forEach((h, i) => {
    const y = 1.55 + i * 1.3;
    tarjeta(s, 0.6, y, 12.1, 1.1, i, 'f' + i);
    s.addShape(pres.shapes.OVAL, { x: 0.85, y: y + 0.17, w: 0.76, h: 0.76, fill: { color: h[4] }, line: { color: h[4] }, objectName: nm(i, 'fade', 'c' + i) });
    s.addText(h[0], { x: 0.85, y: y + 0.17, w: 0.76, h: 0.76, align: 'center', valign: 'middle', bold: true, fontSize: 18, color: H.blanco, isTextBox: true, margin: 0, objectName: nm(i, 'fade', 'ct' + i) });
    txt(s, h[1], { x: 1.9, y: y + 0.12, w: 4.6, h: 0.85, fontSize: 16, bold: true, valign: 'middle', objectName: nm(i, 'fade', 'd' + i) });
    txt(s, h[2], { x: 6.6, y: y + 0.12, w: 2.3, h: 0.85, fontSize: 16, bold: true, color: h[4] === H.teal ? H.teal : 'C25E1C', valign: 'middle', objectName: nm(i, 'fade', 'r' + i) });
    txt(s, h[3], { x: 9.0, y: y + 0.12, w: 3.55, h: 0.85, fontSize: 13, color: H.suave, valign: 'middle', objectName: nm(i, 'fade', 'e' + i) });
  });
  s.addNotes('- H1 sí (efecto grande).\n- H2 sí, pero cambia en 2018.\n- H3 sí (AUC 0.72).\n- H4 sí, con la advertencia de la logística.');
}

// 24. Conclusiones y recomendaciones
{
  const s = nuevo('K', 'Conclusiones y qué le recomendamos a Olist', '4. KPI y conclusiones');
  txt(s, 'Conclusiones', { x: 0.6, y: 1.5, w: 5.6, h: 0.45, fontSize: 20, bold: true, color: H.navy, objectName: nm(0, 'fade', 'ct') });
  txt(s, [
    { text: 'Llegar tarde es lo que más baja la calificación: cuesta casi 2 estrellas.', options: { bullet: true, breakLine: true } },
    { text: 'Se puede anticipar lo suficiente para saber qué pedidos vigilar.', options: { bullet: true, breakLine: true } },
    { text: 'Dónde se atrasan los pedidos cambia con el tiempo: hay que revisar seguido.', options: { bullet: true, breakLine: true } },
    { text: 'Que el cliente vuelva depende de más cosas que la entrega.', options: { bullet: true } },
  ], { x: 0.6, y: 2.05, w: 5.6, h: 4.3, fontSize: 16, paraSpaceAfter: 12, objectName: nm(0, 'fade', 'c') });
  const rec = [
    ['Priorizar', 'Seguir primero los pedidos de riesgo alto del Modelo 2.'],
    ['Avisar', 'Avisar al cliente cuando el pedido viene atrasado, antes de que reclame.'],
    ['Corregir rutas', 'Revisar la logística en Alagoas y Maranhão y los plazos entre estados.'],
    ['Monitorear', 'Revisar los KPI por región cada mes y reentrenar el modelo.'],
  ];
  rec.forEach((r, i) => {
    const x = 6.75 + (i % 2) * 3.05, y = 1.55 + Math.floor(i / 2) * 2.45;
    tarjeta(s, x, y, 2.85, 2.2, i + 1, 'rec' + i);
    txt(s, [{ text: r[0], options: { bold: true, fontSize: 18, color: H.teal, breakLine: true } }, { text: r[1], options: { fontSize: 15 } }], { x: x + 0.2, y: y + 0.2, w: 2.45, h: 1.85, objectName: nm(i + 1, 'fade', 'rect' + i) });
  });
  txt(s, 'Meta propuesta: bajar las entregas tardías de 8.07 % a menos de 6 %.', { x: 6.75, y: 6.45, w: 6, h: 0.4, fontSize: 15, bold: true, color: H.navy, objectName: nm(5, 'fade', 'meta') });
  s.addNotes('- El retraso es lo que más baja la calificación.\n- Se puede anticipar lo suficiente para priorizar.\n- La recompra depende de más factores.\n- Recomendaciones: priorizar, avisar, corregir rutas, monitorear. Meta: < 6 % tardías.');
}

// 25. Referencias
{
  const s = nuevo('K', 'Referencias principales', '4. KPI y conclusiones');
  const refs = [
    'Breiman, L. (2001). Random forests. Machine Learning, 45(1), 5–32.',
    'Chapman, P., et al. (2000). CRISP-DM 1.0: Step-by-step data mining guide. SPSS Inc.',
    'Fawcett, T. (2006). An introduction to ROC analysis. Pattern Recognition Letters, 27(8), 861–874.',
    'Hosmer, D. W., Lemeshow, S., y Sturdivant, R. X. (2013). Applied logistic regression (3.ª ed.). Wiley.',
    'James, G., Witten, D., Hastie, T., y Tibshirani, R. (2021). An introduction to statistical learning (2.ª ed.). Springer.',
    'Kruskal, W. H., y Wallis, W. A. (1952). Use of ranks in one-criterion variance analysis. JASA, 47(260), 583–621.',
    'MacQueen, J. (1967). Some methods for classification and analysis of multivariate observations. Proc. 5th Berkeley Symposium, 1, 281–297.',
    'Olist. (2018). Brazilian E-Commerce Public Dataset by Olist [Conjunto de datos]. Kaggle.',
    'Rousseeuw, P. J. (1987). Silhouettes: A graphical aid to the interpretation and validation of cluster analysis. J. Comput. Appl. Math., 20, 53–65.',
  ];
  txt(s, refs.map((r, i) => ({ text: r, options: { breakLine: i < refs.length - 1, indentLevel: 0 } })), { x: 0.6, y: 1.5, w: 12.1, h: 5.3, fontSize: 16, paraSpaceAfter: 9, color: H.texto, objectName: nm(0, 'fade', 'refs') });
  s.addNotes('- Referencias principales; la lista completa en APA está en el documento.');
}

// 26. Preguntas
{
  const s = pres.addSlide({ masterName: 'PORTADA', sectionTitle: '4. KPI y conclusiones' });
  s.addText('Gracias', { x: 0.9, y: 2.3, w: 11.5, h: 1.2, fontSize: 54, bold: true, color: H.blanco, fontFace: 'Calibri', isTextBox: true, margin: 0, objectName: nm(0, 'fade', 'g') });
  txt(s, '¿Preguntas?', { x: 0.9, y: 3.5, w: 11.5, h: 0.8, fontSize: 30, color: 'E3E8F2', objectName: nm(0, 'fade', 'p') });
  s.addShape(pres.shapes.LINE, { x: 0.9, y: 4.6, w: 2.2, h: 0, line: { color: H.amber, width: 2.5 }, objectName: nm(0, 'wipeL', 'regla') });
  txt(s, 'Repositorio del proyecto: github.com/FerretoDev/mo0005-ecommerce-ml', { x: 0.9, y: 4.9, w: 11.5, h: 0.5, fontSize: 16, color: 'C9D1E0', objectName: nm(0, 'fade', 'repo') });
  s.addNotes('- Abrir preguntas. Cada uno responde sobre su parte.');
}

const salida = path.join(__dirname, '..', 'presentacion.pptx');
pres.writeFile({ fileName: salida }).then(async () => {
  // Aplica los colores del tema (script apply_theme.js de la skill pptx, si está disponible)
  try {
    const { applyTheme } = require(process.env.PPTX_SKILL + '/scripts/apply_theme.js');
    await applyTheme(salida, THEME);
  } catch (e) { console.warn('Sin apply_theme.js: se usan los colores por defecto del tema.'); }
  console.log('ok', salida);
});

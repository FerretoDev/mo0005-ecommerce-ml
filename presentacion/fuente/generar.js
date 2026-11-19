// Genera presentacion.pptx. Uso (desde presentacion/fuente):  node generar.js && python3 animar.py ../presentacion.pptx
// Nombres de objeto "cN_MM_efecto_..." => el script animar.py les agrega animaciones de entrada
// (N = clic en que aparecen, 0 = automático; MM = orden dentro del clic; efecto = fade | wipeL | wipeU).
const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

const THEME = {
  name: 'Entregas Olist',
  headFontFace: 'Cambria',
  bodyFontFace: 'Calibri',
  colors: {
    dk1: '1F2433', lt1: 'FFFFFF', dk2: '1F2A44', lt2: 'EEF1F6',
    accent1: '1F2A44', accent2: '2A8C82', accent3: 'D1495B', accent4: 'E3A72F', accent5: '5B6B8C', accent6: '9AA5B8',
    hlink: '2A8C82', folHlink: '5B6B8C',
  },
};
// Colores en hex para opciones que solo aceptan hex
const H = { navy: '1F2A44', teal: '2A8C82', coral: 'D1495B', amber: 'E3A72F', slate: '5B6B8C', gris: '9AA5B8', claro: 'EEF1F6', texto: '1F2433', linea: 'D5DAE3', blanco: 'FFFFFF', suave: '5B6475' };

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
    { placeholder: { options: { name: 'title', type: 'title', x: 0.9, y: 2.8, w: 11.5, h: 1.9, fontSize: 40, bold: true, color: H.blanco, fontFace: 'Cambria', margin: 0, valign: 'top', align: 'left' }, text: '' } },
    { placeholder: { options: { name: 'body', type: 'body', x: 0.9, y: 4.85, w: 11.5, h: 1.4, fontSize: 18, color: 'C9D1E0', margin: 0, valign: 'top' }, text: '' } },
  ],
});
const PRES = { M: 'Marcos Ferreto Estrada', D: 'David Moya Correas', S: 'Sebastián Sánchez Vega', K: 'Kendall Alvarado Artavia' };
for (const [k, nombre] of Object.entries(PRES)) {
  pres.defineSlideMaster({
    title: 'CONTENIDO_' + k, background: { color: H.blanco },
    margin: [0.5, 0.6, 0.7, 0.6],
    objects: [
      { placeholder: { options: { name: 'title', type: 'title', x: 0.6, y: 0.35, w: 12.1, h: 0.9, fontSize: 30, bold: true, color: H.navy, fontFace: 'Cambria', margin: 0, valign: 'middle', align: 'left' }, text: '' } },
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
    { text: cifra, options: { fontSize: 40, bold: true, color: color || H.navy, fontFace: 'Cambria', breakLine: true } },
    { text: etiqueta, options: { fontSize: 15, color: H.suave } },
  ], { x, y, w, h: 1.4, isTextBox: true, margin: 0, valign: 'top', objectName: nm(click, 'fade', 'dato' + (orden || '')) });
}
function tarjeta(s, x, y, w, h, click, desc, fill) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: fill || H.claro }, line: { color: fill || H.claro }, objectName: nm(click, 'fade', desc) });
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
  s.addText('Entregas tardías, satisfacción y fidelización de clientes en Olist', { x: 0.9, y: 1.6, w: 11, h: 1.9, fontSize: 40, bold: true, color: H.blanco, fontFace: 'Cambria', isTextBox: true, margin: 0, valign: 'top', objectName: nm(0, 'fade', 'titulo') });
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
  s.addNotes('Buenos días. Somos Marcos, Moya, Sebastián y Kendall. Les vamos a presentar el proyecto del curso: analizamos los datos públicos de Olist, una tienda en línea de Brasil, para entender qué pasa cuando un pedido llega tarde, cómo afecta eso a la satisfacción y a la recompra, y si se puede anticipar. Cada uno va a presentar la parte del trabajo que construyó.');
}

// 2. CONTENIDO
{
  const s = nuevo('M', 'Contenido de la exposición', 'Inicio');
  const partes = [
    ['1', 'Marcos Ferreto', 'Contexto, problema y objetivos · Metodología · Datos y PostgreSQL · Workflow 01-ETL'],
    ['2', 'David Moya', 'Modelo 1: segmentación de pedidos con k-means · Workflow 02-Clustering'],
    ['3', 'Sebastián Sánchez', 'Modelo 2: predicción del retraso al comprar · Workflow 03-Prediccion'],
    ['4', 'Kendall Alvarado', 'Indicadores (KPI) y dashboard · Hipótesis · Conclusiones · Workflow 04-KPIs'],
  ];
  partes.forEach((p, i) => {
    const y = 1.65 + i * 1.25;
    s.addShape(pres.shapes.OVAL, { x: 0.8, y, w: 0.8, h: 0.8, fill: { color: i === 0 ? H.navy : H.claro }, line: { color: H.navy, width: 1.25 }, objectName: nm(0, 'fade', 'num' + i) });
    s.addText(p[0], { x: 0.8, y, w: 0.8, h: 0.8, align: 'center', valign: 'middle', fontSize: 24, bold: true, fontFace: 'Cambria', color: i === 0 ? H.blanco : H.navy, isTextBox: true, margin: 0, objectName: nm(0, 'fade', 'numt' + i) });
    txt(s, [{ text: p[1], options: { bold: true, fontSize: 20, color: H.navy, breakLine: true } }, { text: p[2], options: { fontSize: 16, color: H.suave } }], { x: 1.9, y: y - 0.02, w: 10.5, h: 0.95, objectName: nm(0, 'fade', 'parte' + i) });
  });
  s.addNotes('La exposición sigue el mismo orden en que trabajamos los datos: primero yo presento el contexto, la metodología y cómo preparamos los datos; luego Moya presenta la segmentación, Sebastián la predicción del retraso y Kendall cierra con los indicadores, el dashboard y las conclusiones. Cada parte corresponde a un workflow de KNIME que hizo esa persona.');
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
divisor('1. Negocio y datos', 'Parte 1 · Marcos Ferreto Estrada', 'Comprensión del negocio y de los datos', 'Contexto de Olist, problema, objetivos e hipótesis, metodología, base de datos en PostgreSQL y workflow 01-ETL', 'Arranco con la primera parte: qué es Olist, cuál es el problema que estudiamos y cómo preparamos los datos para que el resto del equipo pudiera trabajar.');

// 4. Contexto
{
  const s = nuevo('M', 'Olist y el conjunto de datos', '1. Negocio y datos');
  txt(s, [
    { text: 'Olist conecta a pequeñas tiendas con los grandes marketplaces de Brasil.', options: { bullet: true, breakLine: true } },
    { text: 'No tiene bodega ni flota: cada pedido lo despacha la tienda y lo transporta un tercero.', options: { bullet: true, breakLine: true } },
    { text: 'Aun así, Olist promete la fecha de entrega y recibe la reseña del cliente.', options: { bullet: true, breakLine: true } },
    { text: 'Usamos su conjunto de datos público (Kaggle), con pedidos reales anonimizados.', options: { bullet: true } },
  ], { x: 0.6, y: 1.6, w: 6.2, h: 3.6, fontSize: 18, paraSpaceAfter: 12, objectName: nm(0, 'fade', 'texto') });
  const d = [['99 441', 'pedidos, sep. 2016 – oct. 2018'], ['3 095', 'tiendas vendedoras'], ['27', 'estados de Brasil'], ['9', 'tablas relacionadas (127 MB)']];
  d.forEach((v, i) => {
    const x = 7.3 + (i % 2) * 2.85, y = 1.6 + Math.floor(i / 2) * 2.1;
    tarjeta(s, x, y, 2.6, 1.8, 1, 'tarj' + i);
    dato(s, x + 0.25, y + 0.25, 2.2, v[0], v[1], H.navy, 1, i);
  });
  s.addNotes('Olist es una empresa brasileña que funciona como intermediaria: le permite a tiendas pequeñas vender en los marketplaces grandes. Lo importante para nuestro problema es que Olist no controla la logística: la tienda despacha y una transportista entrega, pero Olist promete la fecha y recibe la reseña. Trabajamos con su conjunto de datos público: casi cien mil pedidos, tres mil tiendas, los 27 estados y nueve tablas relacionadas. (Clic para mostrar las cifras.)');
}

// 5. Problema
{
  const s = nuevo('M', 'El problema: el retraso afecta la satisfacción y la recompra', '1. Negocio y datos');
  s.addChart(pres.charts.BAR, [{ name: 'Calificación promedio', labels: ['A tiempo', 'Tarde'], values: [4.30, 2.57] }], Object.assign({}, axis, {
    x: 0.6, y: 1.5, w: 5.4, h: 4.6, barDir: 'col', chartColors: [H.teal, H.coral], invertedColors: [H.coral], varyColors: true,
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
    txt(s, f[0], { x: 6.6, y, w: 2.1, h: 0.8, fontSize: 32, bold: true, fontFace: 'Cambria', color: f[2], objectName: nm(i === 0 ? 0 : i + 1, 'fade', 'cifra' + i) });
    txt(s, f[1], { x: 8.8, y: y + 0.05, w: 4.0, h: 1.2, fontSize: 16, color: H.texto, objectName: nm(i === 0 ? 0 : i + 1, 'fade', 'desc' + i) });
  });
  txt(s, 'Pregunta del proyecto: ¿podemos medir esta cadena, identificar dónde ocurre y anticipar el retraso al momento de la compra?', { x: 6.6, y: 6.05, w: 6.2, h: 0.7, fontSize: 15, italic: true, color: H.navy, objectName: nm(4, 'fade', 'pregunta') });
  s.addNotes('El problema en tres datos. Primero, el 8 % de los pedidos llega tarde. (Clic) Cuando eso pasa, la calificación cae de 4.30 a 2.57 estrellas, y más de la mitad deja una reseña negativa. (Clic) Y la recompra ya es baja: 3 de cada 100 clientes vuelven; un poco más si su primer pedido llegó a tiempo. Ojo: el efecto sobre la satisfacción es fuerte; sobre la recompra es pequeño, y lo vamos a decir así. (Clic) De ahí sale la pregunta del proyecto.');
}

// 6. Objetivos e hipótesis
{
  const s = nuevo('M', 'Objetivos estratégicos e hipótesis', '1. Negocio y datos');
  const filas = [
    [{ text: 'Objetivo estratégico', options: { bold: true, color: H.blanco, fill: { color: H.navy } } }, { text: 'Actual', options: { bold: true, color: H.blanco, fill: { color: H.navy }, align: 'right' } }, { text: 'Meta', options: { bold: true, color: H.blanco, fill: { color: H.navy }, align: 'right' } }],
    ['OE1 · Cumplir los plazos de entrega (% tardías)', { text: '8.07 %', options: { align: 'right' } }, { text: '< 6 %', options: { align: 'right' } }],
    ['OE2 · Elevar la satisfacción (calificación)', { text: '4.16', options: { align: 'right' } }, { text: '≥ 4.30', options: { align: 'right' } }],
    ['OE3 · Fortalecer la fidelización (recompra)', { text: '3.12 %', options: { align: 'right' } }, { text: '4 %', options: { align: 'right' } }],
  ];
  s.addTable(filas, { x: 0.6, y: 1.6, w: 6.3, colW: [4.3, 1.0, 1.0], fontSize: 15, color: H.texto, border: { type: 'solid', pt: 0.75, color: H.linea }, rowH: 0.55, valign: 'middle', objectName: nm(0, 'fade', 'tabla') });
  const hip = [
    ['H1', 'Los pedidos tardíos reciben una calificación más baja.'],
    ['H2', 'El retraso depende de la región y de si el envío es entre estados distintos.'],
    ['H3', 'Un modelo anticipa el retraso mejor que una regla simple (AUC > 0.60).'],
    ['H4', 'Los segmentos de experiencia de compra difieren en satisfacción.'],
  ];
  hip.forEach((h, i) => {
    const y = 1.6 + i * 1.15;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.5, y, w: 0.75, h: 0.75, rectRadius: 0.1, fill: { color: H.amber }, line: { color: H.amber }, objectName: nm(i + 1, 'fade', 'h' + i) });
    s.addText(h[0], { x: 7.5, y, w: 0.75, h: 0.75, align: 'center', valign: 'middle', bold: true, fontSize: 18, color: H.navy, isTextBox: true, margin: 0, objectName: nm(i + 1, 'fade', 'ht' + i) });
    txt(s, h[1], { x: 8.45, y: y + 0.05, w: 4.3, h: 0.9, fontSize: 16, objectName: nm(i + 1, 'fade', 'hd' + i) });
  });
  s.addNotes('Definimos tres objetivos estratégicos para Olist, con su valor actual y una meta propuesta por nosotros: bajar las entregas tardías a menos de 6 %, subir la calificación a 4.30 y la recompra a 4 %. (Clics) Y planteamos cuatro hipótesis que el análisis tenía que confirmar o rechazar. Al final Kendall presenta el resultado de cada una.');
}

// 7. CRISP-DM
{
  const s = nuevo('M', 'Metodología: CRISP-DM', '1. Negocio y datos');
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
    ['PostgreSQL (Docker)', 'base de datos con las 9 tablas; reemplaza a Snowflake'],
    ['KNIME', '4 workflows, uno por integrante; reemplaza a Dataiku, con autorización del profesor'],
    ['Power BI', 'dashboard con los 11 indicadores'],
    ['GitHub', 'repositorio con los workflows, consultas y documentación'],
  ];
  herr.forEach((h, i) => txt(s, [{ text: h[0], options: { bold: true, breakLine: true } }, { text: h[1], options: { color: H.suave, fontSize: 14 } }], { x: 7.9, y: 2.15 + i * 1.12, w: 4.8, h: 1.0, fontSize: 16, objectName: nm(2, 'fade', 'herr' + i) }));
  s.addNotes('Seguimos CRISP-DM, el proceso estándar para proyectos de minería de datos. Tiene seis fases en ciclo, y cada parte de la exposición corresponde a una: negocio y datos, preparación, modelado, evaluación y despliegue en el dashboard. (Clic) En herramientas, el curso proponía Snowflake y Dataiku; usamos PostgreSQL en Docker porque es gratuito y reproducible, y KNIME con autorización del profesor. Todo quedó versionado en GitHub.');
}

// 8. Modelo E-R y PostgreSQL
{
  const s = nuevo('M', 'Comprensión de los datos: modelo relacional en PostgreSQL', '1. Negocio y datos');
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
    { text: 'Un script (cargar.sh) crea el esquema olist en PostgreSQL y carga los 9 CSV.', options: { bullet: true, breakLine: true } },
    { text: 'Se compara el número de filas de cada tabla con su CSV.', options: { bullet: true, breakLine: true } },
    { text: 'Una vista de control (v_pedidos_base) sirve de referencia para el ETL.', options: { bullet: true } },
  ], { x: 9.2, y: 2.1, w: 3.6, h: 2.7, fontSize: 15, paraSpaceAfter: 8, objectName: nm(2, 'fade', 'vtx') });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 9.2, y: 5.0, w: 3.5, h: 1.3, rectRadius: 0.08, fill: { color: 'E3F1EF' }, line: { color: H.teal, width: 1.25 }, objectName: nm(3, 'fade', 'ok') });
  txt(s, [{ text: '9 de 9', options: { fontSize: 32, bold: true, fontFace: 'Cambria', color: H.teal, breakLine: true } }, { text: 'tablas coinciden fila por fila', options: { fontSize: 14, color: H.texto } }], { x: 9.4, y: 5.1, w: 3.2, h: 1.1, objectName: nm(3, 'fade', 'okt') });
  txt(s, 'Línea continua: llave foránea · discontinua: relación lógica (prefijo postal, traducción)', { x: 0.6, y: 6.62, w: 8.3, h: 0.3, fontSize: 11, color: H.suave, objectName: nm(1, 'fade', 'ley') });
  s.addNotes('Esta es mi parte de infraestructura. Los datos vienen en nueve tablas: en el centro está orders, el pedido, que se relaciona con el cliente, los ítems, los pagos y las reseñas; los ítems a su vez apuntan al producto y a la tienda. (Clic) Las líneas discontinuas son relaciones lógicas que no se pueden imponer como llave, como el código postal. (Clic) Monté PostgreSQL en Docker con un script que crea el esquema, carga todo y compara los conteos. (Clic) Las nueve tablas coinciden fila por fila con los CSV originales.');
}

// 9. Workflow 01-ETL
{
  const s = nuevo('M', 'Preparación de los datos: workflow 01-ETL en KNIME', '1. Negocio y datos');
  const nodos = [
    ['CSV Reader', '9 archivos', 'F0A54A'],
    ['GroupBy', 'ítems, pagos y reseñas por pedido', 'F4D35E'],
    ['Joiner', '4 uniones (Left Outer)', 'F4D35E'],
    ['Row Filter', 'entregados, ene. 2017 – ago. 2018', 'F4D35E'],
    ['Date&Time Difference', 'plazo, entrega y retraso', 'F4D35E'],
    ['Rule Engine', 'es_tardio, mismo_estado', 'F4D35E'],
    ['CSV Writer', 'ordenes_etl.csv', 'F0A54A'],
  ];
  const y = 2.0;
  nodos.forEach((d, i) => {
    const x = 1.05 + i * 1.78;
    if (i > 0) flecha(s, x - 1.13, y + 0.31, x - 0.03, y + 0.31, 1);
    nodo(s, x, y, d[0], d[1], d[2], 1, i);
  });
  txt(s, '40 nodos en total; aquí se muestran los pasos principales', { x: 0.6, y: 1.45, w: 8, h: 0.35, fontSize: 13, color: H.suave, objectName: nm(0, 'fade', 'nota') });
  tarjeta(s, 0.6, 4.55, 3.9, 1.95, 2, 'r1');
  dato(s, 0.85, 4.75, 3.5, '96 144', 'pedidos entregados en la tabla final (29 columnas)', H.navy, 2, 1);
  tarjeta(s, 4.75, 4.55, 3.9, 1.95, 2, 'r2');
  dato(s, 5.0, 4.75, 3.5, '= PostgreSQL', 'mismo conteo que la vista de control v_pedidos_base', H.teal, 2, 2);
  tarjeta(s, 8.9, 4.55, 3.85, 1.95, 2, 'r3');
  dato(s, 9.15, 4.75, 3.4, '8.07 %', 'de los pedidos de la tabla final llegó tarde', H.coral, 2, 3);
  s.addNotes('Este es el workflow 01-ETL que construí en KNIME, con 40 nodos; aquí van los pasos principales. (Clic: los nodos se ejecutan) Leo los nueve CSV, resumo ítems, pagos y reseñas por pedido, uno todo con cuatro Joiner, filtro los pedidos entregados entre enero de 2017 y agosto de 2018, calculo en días el plazo prometido, la entrega y el retraso, y creo las variables es_tardio y mismo_estado. (Clic) El resultado son 96 144 pedidos, exactamente el mismo número que da la vista de control en PostgreSQL, con 8.07 % de entregas tardías. Esta tabla es la entrada de los otros tres workflows. Le paso la palabra a Moya.');
}

// ---------- PARTE 2: MOYA ----------
divisor('2. Modelo 1', 'Parte 2 · David Moya Correas', 'Modelo 1: segmentación de la experiencia de compra', 'Algoritmo k-means, elección del número de grupos, perfiles de los segmentos y prueba de la hipótesis H4 (workflow 02-Clustering)', 'Gracias, Marcos. Mi parte es el primer modelo, que es no supervisado: buscamos grupos de pedidos con experiencias de compra y entrega parecidas.');

// 11. Planteamiento + workflow 02
{
  const s = nuevo('D', 'Planteamiento del Modelo 1 y workflow 02-Clustering', '2. Modelo 1');
  txt(s, [
    { text: 'Pregunta: ', options: { bold: true, color: H.navy } },
    { text: '¿qué tipos de experiencia de compra y entrega hay en Olist, y difieren en satisfacción?' },
  ], { x: 0.6, y: 1.5, w: 12.1, h: 0.5, fontSize: 18, objectName: nm(0, 'fade', 'preg') });
  const filas = [
    [{ text: 'Variable de entrada', options: { bold: true, color: H.blanco, fill: { color: H.navy } } }, { text: 'Preparación', options: { bold: true, color: H.blanco, fill: { color: H.navy } } }],
    ['Precio total', 'logaritmo + estandarización z'], ['Flete total', 'logaritmo + estandarización z'], ['Número de cuotas', 'estandarización z'],
    ['Días de entrega', 'estandarización z'], ['Días de retraso', 'estandarización z'], ['Mismo estado (0/1)', 'estandarización z'],
  ];
  s.addTable(filas, { x: 0.6, y: 2.2, w: 5.4, colW: [2.4, 3.0], fontSize: 14, color: H.texto, border: { type: 'solid', pt: 0.75, color: H.linea }, rowH: 0.42, objectName: nm(0, 'fade', 'tabla') });
  txt(s, 'La calificación no entra al modelo: se usa después para comprobar H4 sin circularidad.', { x: 0.6, y: 5.35, w: 5.4, h: 0.8, fontSize: 14, italic: true, color: H.slate, objectName: nm(0, 'fade', 'nota') });
  const nodos = [['CSV Reader', 'ordenes_etl.csv', 'F0A54A'], ['Math Formula', 'ln(precio + 1), ln(flete + 1)', 'F4D35E'], ['Normalizer', 'z-score, 6 variables', 'F4D35E'], ['k-Means', 'k = 4, semilla fija', '4FA36B'], ['GroupBy', 'perfil por grupo', 'F4D35E'], ['One-way ANOVA', 'calificación por grupo', '4FA36B']];
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
  txt(s, '14 nodos; también escribe segmentos_modelo1.csv para Power BI', { x: 6.75, y: 6.35, w: 6, h: 0.35, fontSize: 12, color: H.suave, objectName: nm(1, 'fade', 'nn') });
  s.addNotes('La pregunta es qué tipos de experiencia de compra hay. Usamos seis variables de cada pedido: precio, flete, cuotas, días de entrega, días de retraso y si cliente y tienda están en el mismo estado. Precio y flete van con logaritmo porque tienen colas muy largas, y todo se estandariza para que ninguna variable pese más que otra en la distancia. Importante: la calificación no entra al modelo, así la prueba de H4 no es circular. (Clic) Así quedó el workflow 02 en KNIME: lectura, logaritmos, normalización, k-means con k igual a 4, el perfil de cada grupo y la prueba de la calificación.');
}

// 12. Elección de k
{
  const s = nuevo('D', 'Elección del número de grupos: silueta y codo', '2. Modelo 1');
  const ks = ['2', '3', '4', '5', '6', '7', '8'];
  s.addChart(pres.charts.LINE, [{ name: 'Silueta', labels: ks, values: [0.272, 0.287, 0.305, 0.272, 0.231, 0.230, 0.221] }], Object.assign({}, axis, {
    x: 0.6, y: 1.5, w: 6.0, h: 4.4, chartColors: [H.navy], lineSize: 2.5, lineDataSymbol: 'circle', lineDataSymbolSize: 9, showValue: true, dataLabelPosition: 't', dataLabelFormatCode: '0.000',
    valAxisMinVal: 0.2, valAxisMaxVal: 0.32, valAxisLabelFormatCode: '0.00', showTitle: true, title: 'Coeficiente de silueta (más alto = mejor separación)', showLegend: false, catAxisTitle: 'número de grupos (k)', showCatAxisTitle: true, catAxisTitleFontSize: 12, catAxisTitleColor: H.suave, objectName: nm(0, 'wipeL', 'silueta'),
  }));
  s.addChart(pres.charts.LINE, [{ name: 'Inercia', labels: ks, values: [444062, 368642, 301593, 273977, 253415, 240525, 222060] }], Object.assign({}, axis, {
    x: 6.9, y: 1.5, w: 5.9, h: 4.4, chartColors: [H.slate], lineSize: 2.5, lineDataSymbol: 'circle', lineDataSymbolSize: 9, valAxisLabelFormatCode: '#,##0', valAxisMinVal: 200000,
    showTitle: true, title: 'Inercia (método del codo)', showLegend: false, catAxisTitle: 'número de grupos (k)', showCatAxisTitle: true, catAxisTitleFontSize: 12, catAxisTitleColor: H.suave, objectName: nm(1, 'wipeL', 'codo'),
  }));
  txt(s, [
    { text: 'k = 4: ', options: { bold: true, color: H.navy } },
    { text: 'máxima silueta (0.305; 0.297 en KNIME) y el codo cae en el mismo punto. Con 5 semillas distintas se obtiene la misma agrupación (índice de Rand ajustado ≥ 0.999). Una silueta de 0.3 indica estructura moderada: grupos útiles para describir y priorizar.' },
  ], { x: 0.6, y: 6.05, w: 12.1, h: 0.85, fontSize: 15, objectName: nm(2, 'fade', 'concl') });
  s.addNotes('Para elegir cuántos grupos probamos k de 2 a 8. A la izquierda, la silueta mide qué tan separados quedan los grupos: el máximo está en 4. (Clic) A la derecha, la inercia baja siempre, pero a partir de 4 baja mucho más despacio: ese es el codo. (Clic) Además repetimos con cinco semillas y salió la misma agrupación. Una silueta de 0.3 es moderada: los grupos existen pero sus bordes son difusos, así que los usamos para describir, no como categorías rígidas.');
}

// 13. Dispersión de segmentos (muestra real)
{
  const s = nuevo('D', 'Los cuatro segmentos en una muestra de pedidos', '2. Modelo 1');
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
    ['Estándar entre estados', H.slate, '43.2 % · 0.7 % tardías · 4.31'],
    ['Locales rápidas', H.teal, '31.7 % · 4.5 % tardías · 4.32'],
    ['Compras grandes a plazos', H.amber, '17.4 % · 2.6 % tardías · 4.16'],
    ['Entregas problemáticas', H.coral, '7.7 % · 77.4 % tardías · 2.59'],
  ];
  grupos.forEach((g, i) => {
    const click = i + 1;
    pts.filter(p => p[2] === g[0]).forEach(p => s.addShape(pres.shapes.OVAL, { x: xs(p[0]) - r, y: ys(p[1]) - r, w: 2 * r, h: 2 * r, fill: { color: g[1] }, line: { color: H.blanco, width: 0.5 }, objectName: nm(click, 'fade', 'p') }));
    const y = 1.7 + i * 1.12;
    s.addShape(pres.shapes.OVAL, { x: 9.0, y: y + 0.07, w: 0.28, h: 0.28, fill: { color: g[1] }, line: { color: g[1] }, objectName: nm(click, 'fade', 'ley') });
    txt(s, [{ text: g[0], options: { bold: true, fontSize: 16, color: H.texto, breakLine: true } }, { text: g[2], options: { fontSize: 13, color: H.suave } }], { x: 9.45, y, w: 3.4, h: 0.9, objectName: nm(click, 'fade', 'leyt') });
  });
  txt(s, 'Muestra aleatoria de 260 pedidos reales. El modelo usa 6 variables; aquí se ven 2. Porcentajes: tamaño del grupo · % tardías · calificación.', { x: 9.0, y: 6.15, w: 3.85, h: 0.75, fontSize: 11, color: H.suave, objectName: nm(0, 'fade', 'nota') });
  s.addNotes('Para verlo, tomamos 260 pedidos reales al azar y los ubicamos por días de entrega y precio. Al principio son solo puntos grises: el algoritmo no sabe nada de grupos. (Clic) El grupo más grande: compras baratas entre estados distintos, que casi nunca llegan tarde. (Clic) Las compras locales, cliente y tienda en el mismo estado: las más rápidas. (Clic) Las compras grandes pagadas a plazos, arriba porque son más caras. (Clic) Y las entregas problemáticas, a la derecha: 7.7 % de los pedidos, 77 % llega tarde y la calificación cae a 2.59. Ojo: el modelo usa seis variables y aquí solo se ven dos, por eso algunos grupos se traslapan.');
}

// 14. Perfil y H4
{
  const s = nuevo('D', 'Perfil de los segmentos y prueba de H4', '2. Modelo 1');
  const hd = t => ({ text: t, options: { bold: true, color: H.blanco, fill: { color: H.navy }, align: 'right' } });
  const filas = [
    [{ text: 'Segmento', options: { bold: true, color: H.blanco, fill: { color: H.navy } } }, hd('Pedidos'), hd('Precio (mediana)'), hd('Cuotas'), hd('Entrega (días)'), hd('Mismo estado'), hd('Tardías'), hd('Calificación'), hd('Reseñas neg.')],
    ['Compras grandes a plazos', '16 767', '219.00', '7.1', '12.4', '22 %', '2.6 %', '4.16', '12.7 %'],
    ['Estándar entre estados', '41 511', '69.90', '1.9', '12.4', '0 %', '0.7 %', '4.31', '8.6 %'],
    ['Locales rápidas', '30 509', '64.99', '2.1', '7.3', '99 %', '4.5 %', '4.32', '8.9 %'],
    ['Entregas problemáticas', '7 357', '98.00', '2.8', '35.1', '9 %', '77.4 %', '2.59', '52.8 %'],
  ].map((f, i) => i === 0 ? f : f.map((c, j) => ({ text: c, options: { align: j ? 'right' : 'left', bold: i === 4, color: i === 4 ? H.coral : H.texto } })));
  s.addTable(filas, { x: 0.6, y: 1.55, w: 12.1, colW: [2.9, 1.0, 1.35, 0.9, 1.25, 1.2, 1.0, 1.2, 1.3], fontSize: 14, border: { type: 'solid', pt: 0.75, color: H.linea }, rowH: 0.5, valign: 'middle', objectName: nm(0, 'fade', 'tabla') });
  tarjeta(s, 0.6, 4.4, 5.85, 2.3, 1, 'h4');
  txt(s, [{ text: 'H4 se confirma', options: { bold: true, fontSize: 20, color: H.teal, breakLine: true } }, { text: 'La calificación difiere entre segmentos: Kruskal-Wallis H = 7 767, p < 0.001 (ANOVA en KNIME: F = 4 477.7).', options: { fontSize: 15 } }], { x: 0.85, y: 4.6, w: 5.4, h: 1.9, objectName: nm(1, 'fade', 'h4t') });
  tarjeta(s, 6.85, 4.4, 5.85, 2.3, 2, 'sens');
  txt(s, [{ text: 'Advertencia y prueba de sensibilidad', options: { bold: true, fontSize: 20, color: H.amber, breakLine: true } }, { text: 'El segmento problemático se forma con los días de retraso. Repitiendo solo con variables de compra (k = 3), la calificación apenas varía: de 4.02 a 4.29. La satisfacción depende de la logística.', options: { fontSize: 15 } }], { x: 7.1, y: 4.6, w: 5.4, h: 1.95, objectName: nm(2, 'fade', 'senst') });
  s.addNotes('Esta tabla es el perfil de cada segmento con los resultados de KNIME. La fila en rojo es el grupo de entregas problemáticas: 35 días de entrega, 77 % tardíos y más de la mitad con reseña negativa. (Clic) La prueba de Kruskal-Wallis confirma que la calificación difiere entre grupos, así que H4 se cumple. (Clic) Pero con una advertencia honesta: ese grupo se forma justamente con los días de retraso. Por eso repetimos el modelo solo con lo que se sabe al comprar, y ahí la calificación casi no cambia. Conclusión: lo que mueve la satisfacción es la logística, no el tipo de compra. Le paso a Sebastián.');
}

// ---------- PARTE 3: SEBASTIÁN ----------
divisor('3. Modelo 2', 'Parte 3 · Sebastián Sánchez Vega', 'Modelo 2: predicción del retraso al momento de la compra', 'Variables disponibles al comprar, partición temporal, comparación de algoritmos, uso del modelo y prueba de la hipótesis H3 (workflow 03-Prediccion)', 'Gracias, Moya. Mi parte es el segundo modelo, que es supervisado: queremos predecir si un pedido va a llegar tarde en el momento en que se compra.');

// 16. Planteamiento + partición + workflow
{
  const s = nuevo('S', 'Planteamiento del Modelo 2 y workflow 03-Prediccion', '3. Modelo 2');
  txt(s, [
    { text: 'Objetivo: ', options: { bold: true, color: H.navy } },
    { text: 'predecir es_tardio con 13 variables conocidas al comprar (precio, flete, cuotas, peso, volumen, plazo prometido, estados, categoría, día de la semana). Nada posterior a la compra, para evitar fuga de información.' },
  ], { x: 0.6, y: 1.45, w: 12.1, h: 0.9, fontSize: 16, objectName: nm(0, 'fade', 'obj') });
  // línea de tiempo
  const x0 = 0.6, x1 = 12.7, y = 2.65, corte = x0 + (x1 - x0) * (15 / 20);
  s.addShape(pres.shapes.RECTANGLE, { x: x0, y, w: corte - x0 - 0.04, h: 0.55, fill: { color: H.navy }, line: { color: H.navy }, objectName: nm(1, 'wipeL', 'train') });
  s.addText('Entrenamiento: 64 052 pedidos (ene. 2017 – mar. 2018) · 9.19 % tardías', { x: x0 + 0.15, y, w: corte - x0 - 0.3, h: 0.55, fontSize: 14, bold: true, color: H.blanco, valign: 'middle', isTextBox: true, margin: 0, objectName: nm(1, 'fade', 'traint') });
  s.addShape(pres.shapes.RECTANGLE, { x: corte + 0.04, y, w: x1 - corte - 0.04, h: 0.55, fill: { color: H.teal }, line: { color: H.teal }, objectName: nm(2, 'wipeL', 'test') });
  s.addText('Prueba: 32 092 (abr. – ago. 2018) · 5.85 %', { x: corte + 0.15, y, w: x1 - corte - 0.2, h: 0.55, fontSize: 14, bold: true, color: H.blanco, valign: 'middle', isTextBox: true, margin: 0, objectName: nm(2, 'fade', 'testt') });
  txt(s, 'Partición temporal: se entrena con el pasado y se evalúa con meses que el modelo nunca vio.', { x: 0.6, y: 3.3, w: 12.1, h: 0.35, fontSize: 13, color: H.suave, objectName: nm(2, 'fade', 'part') });
  const nodos = [['CSV Reader', 'ordenes_etl.csv', 'F0A54A'], ['Row Splitter', 'corte 2018-04-01', 'F4D35E'], ['Equal Size Sampling', 'balancea clases (solo entrenamiento)', 'F4D35E'], ['Learner', 'regresión logística y Random Forest', '4FA36B'], ['Predictor', 'probabilidad de retraso', '4FA36B'], ['Scorer y ROC', 'métricas y AUC', '6C8FC7']];
  nodos.forEach((d, i) => {
    const x = 1.05 + i * 2.1, yy = 4.0;
    if (i > 0) flecha(s, x - 1.45, yy + 0.31, x - 0.03, yy + 0.31, 3);
    nodo(s, x, yy, d[0], d[1], d[2], 3, i);
  });
  s.addNotes('La idea es avisar en el momento de la compra, cuando todavía se puede hacer algo. Por eso el modelo solo usa 13 variables conocidas al comprar; usar algo posterior sería hacer trampa. (Clic) Para evaluarlo como en la vida real partimos los datos en el tiempo: entrenamos con compras hasta marzo de 2018… (Clic) …y probamos con abril a agosto. Ojo: en la prueba hay menos tardíos, 5.85 contra 9.19 %. (Clic) Este es el workflow 03: partición, balanceo de clases solo en entrenamiento, los dos algoritmos, sus predicciones y la evaluación.');
}

// 17. Resultados AUC
{
  const s = nuevo('S', 'Resultados: la regresión logística supera las reglas simples', '3. Modelo 2');
  s.addChart([
    { type: pres.charts.BAR, data: [{ name: 'AUC', labels: ['Siempre a tiempo', 'Estados distintos = tarde', 'Random Forest', 'Regresión logística'], values: [0.500, 0.472, 0.590, 0.719] }], options: { barDir: 'col', chartColors: [H.navy], barGapWidthPct: 60, showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0.00' } },
    { type: pres.charts.LINE, data: [{ name: 'Criterio H3 (0.60)', labels: ['Siempre a tiempo', 'Estados distintos = tarde', 'Random Forest', 'Regresión logística'], values: [0.6, 0.6, 0.6, 0.6] }], options: { chartColors: [H.coral], lineSize: 2, lineDash: 'dash', lineDataSymbol: 'none', showValue: false } },
  ], Object.assign({}, axis, {
    x: 0.6, y: 1.5, w: 7.2, h: 5.2, valAxisMinVal: 0, valAxisMaxVal: 0.8, valAxisMajorUnit: 0.2, valAxisLabelFormatCode: '0.0',
    showTitle: true, title: 'AUC en la prueba (0.5 = azar; 1 = perfecto)', showLegend: true, legendPos: 'b', objectName: nm(0, 'wipeU', 'auc'),
  }));
  const hd = t => ({ text: t, options: { bold: true, color: H.blanco, fill: { color: H.navy }, align: 'right' } });
  s.addTable([
    [{ text: 'Modelo', options: { bold: true, color: H.blanco, fill: { color: H.navy } } }, hd('AUC'), hd('Precisión'), hd('Exhaust.'), hd('F1')],
    ['Random Forest', '0.590', '0.078', '0.460', '0.133'].map((c, j) => ({ text: c, options: { align: j ? 'right' : 'left' } })),
    ['Regresión logística', '0.719', '0.100', '0.787', '0.177'].map((c, j) => ({ text: c, options: { align: j ? 'right' : 'left', bold: true } })),
  ], { x: 8.0, y: 1.6, w: 4.8, colW: [1.7, 0.65, 0.9, 0.9, 0.65], fontSize: 12, border: { type: 'solid', pt: 0.75, color: H.linea }, rowH: 0.45, valign: 'middle', objectName: nm(1, 'fade', 'tabla') });
  txt(s, [
    { text: 'H3 se confirma: ', options: { bold: true, color: H.teal } },
    { text: 'la regresión logística es el único modelo con AUC > 0.60 y supera las dos reglas simples.', options: { breakLine: true } },
    { text: ' ', options: { breakLine: true, fontSize: 8 } },
    { text: 'Que un modelo lineal gane a uno de árboles es esperable cuando la señal es débil y casi lineal.', options: { color: H.suave } },
  ], { x: 8.0, y: 3.4, w: 4.8, h: 2.8, fontSize: 15, objectName: nm(2, 'fade', 'concl') });
  s.addNotes('Comparamos los dos algoritmos con dos reglas simples, usando el AUC, que va de 0.5, como tirar una moneda, a 1, perfecto. Decir siempre "a tiempo" da 0.5. La regla de "si va a otro estado, llega tarde" queda incluso debajo, 0.47; ya explico por qué. El Random Forest llega a 0.59 y la regresión logística a 0.72. (Clic) En la tabla, las métricas para la clase tardía. (Clic) La regresión logística es la única que pasa el criterio de 0.60 y supera las reglas, así que H3 se confirma.');
}

// 18. Uso: niveles de riesgo
{
  const s = nuevo('S', 'Uso del modelo: priorizar el seguimiento de pedidos', '3. Modelo 2');
  dato(s, 0.6, 1.6, 5, '79 de 100', 'pedidos tardíos son detectados por el modelo (exhaustividad 0.787)', H.teal, 0, 1);
  dato(s, 0.6, 3.25, 5, '1 de 10', 'alertas corresponde a un retraso real (precisión 0.100): no sirve para decidir de forma automática', H.coral, 1, 2);
  txt(s, 'Uso propuesto: ordenar los pedidos por riesgo y revisar primero los de riesgo alto.', { x: 0.6, y: 5.0, w: 5.2, h: 0.9, fontSize: 16, bold: true, color: H.navy, objectName: nm(2, 'fade', 'uso') });
  s.addChart(pres.charts.BAR, [{ name: '% tardías', labels: ['Riesgo alto\n3 210 pedidos', 'Riesgo medio\n4 813', 'Riesgo bajo\n24 069'], values: [13.3, 11.3, 3.8] }], Object.assign({}, axis, {
    x: 6.4, y: 1.5, w: 6.4, h: 4.6, barDir: 'col', chartColors: [H.coral], showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0.0"%"', dataLabelFontSize: 14, dataLabelFontBold: true,
    valAxisMinVal: 0, valAxisMaxVal: 16, valAxisLabelFormatCode: '0"%"', showTitle: true, title: 'Entregas tardías según el nivel de riesgo (prueba)', showLegend: false, barGapWidthPct: 60, objectName: nm(2, 'wipeU', 'riesgo'),
  }));
  txt(s, 'El grupo de riesgo alto llega tarde 3.5 veces más que el de riesgo bajo y concentra el 22.8 % de todos los retrasos.', { x: 6.4, y: 6.2, w: 6.4, h: 0.6, fontSize: 13, color: H.suave, objectName: nm(2, 'fade', 'nota') });
  s.addNotes('¿Cómo se usa? El modelo detecta 79 de cada 100 pedidos que van a llegar tarde. (Clic) Pero genera muchas falsas alarmas: de cada 10 alertas, solo una termina en retraso. Por eso no lo proponemos para decisiones automáticas. (Clic) Lo proponemos para priorizar: si dividimos los pedidos en tres niveles de riesgo, el nivel alto llega tarde 3.5 veces más que el bajo y concentra casi una cuarta parte de los retrasos.');
}

// 19. Geografía
{
  const s = nuevo('S', 'Hallazgo: la relación entre geografía y retraso cambió en 2018', '3. Modelo 2');
  s.addChart(pres.charts.BAR, [
    { name: 'Mismo estado', labels: ['Entrenamiento (hasta mar. 2018)', 'Prueba (abr. – ago. 2018)'], values: [5.7, 6.6] },
    { name: 'Estados distintos', labels: ['Entrenamiento (hasta mar. 2018)', 'Prueba (abr. – ago. 2018)'], values: [11.0, 5.3] },
  ], Object.assign({}, axis, {
    x: 0.6, y: 1.5, w: 7.2, h: 5.2, barDir: 'col', barGrouping: 'clustered', chartColors: [H.teal, H.coral], showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0.0"%"', dataLabelFontSize: 14, dataLabelFontBold: true,
    valAxisMinVal: 0, valAxisMaxVal: 12, valAxisLabelFormatCode: '0"%"', showTitle: true, title: '% de entregas tardías por tipo de envío', showLegend: true, legendPos: 'b', barGapWidthPct: 80, objectName: nm(0, 'wipeU', 'geo'),
  }));
  txt(s, [
    { text: 'En el entrenamiento, los envíos entre estados llegaban tarde casi el doble.', options: { bullet: true, breakLine: true } },
    { text: 'En la prueba la relación se invierte: los del mismo estado llegan tarde más.', options: { bullet: true, breakLine: true } },
    { text: 'Por eso la regla «estados distintos = tarde» queda por debajo del azar (AUC 0.47).', options: { bullet: true } },
  ], { x: 8.2, y: 1.6, w: 4.6, h: 3.3, fontSize: 16, paraSpaceAfter: 10, objectName: nm(1, 'fade', 'txt') });
  tarjeta(s, 8.2, 5.05, 4.6, 1.6, 2, 'lec');
  txt(s, [{ text: 'Implicación', options: { bold: true, color: H.navy, breakLine: true } }, { text: 'El modelo debe monitorearse y reentrenarse periódicamente. H2 se confirma con un matiz temporal.', options: {} }], { x: 8.4, y: 5.2, w: 4.25, h: 1.35, fontSize: 15, objectName: nm(2, 'fade', 'lect') });
  s.addNotes('Y este fue un hallazgo inesperado. En el periodo de entrenamiento, los pedidos entre estados distintos llegaban tarde casi el doble: 11 contra 5.7 %. (Clic) Pero de abril a agosto de 2018 se invierte. Por eso la regla geográfica queda por debajo del azar. (Clic) La lección para Olist es que un modelo así hay que monitorearlo y reentrenarlo, y para H2: se confirma en el periodo completo, pero no es estable en el tiempo. Le paso a Kendall.');
}

// ---------- PARTE 4: KENDALL ----------
divisor('4. KPI y conclusiones', 'Parte 4 · Kendall Alvarado Artavia', 'Indicadores, dashboard y conclusiones', 'Los 11 KPI por objetivo estratégico, el dashboard en Power BI, el contraste de hipótesis y las recomendaciones para Olist (workflow 04-KPIs)', 'Gracias, Sebastián. Mi parte es convertir todo esto en indicadores que Olist pueda seguir y cerrar con las conclusiones.');

// 21. KPI
{
  const s = nuevo('K', 'Los 11 indicadores clave por objetivo estratégico', '4. KPI y conclusiones');
  const hd = t => ({ text: t, options: { bold: true, color: H.blanco, fill: { color: H.navy } } });
  const no = { text: 'No cumple', options: { color: H.coral, bold: true } };
  const ref = { text: 'Referencia', options: { color: H.suave } };
  const filas = [
    [hd('Objetivo'), hd('Indicador'), { text: 'Valor', options: { bold: true, color: H.blanco, fill: { color: H.navy }, align: 'right' } }, { text: 'Meta', options: { bold: true, color: H.blanco, fill: { color: H.navy }, align: 'right' } }, hd('Estado')],
    ['OE1 · Plazos', '1. % de entregas tardías', '8.07 %', '< 6 %', no],
    ['', '2. Tiempo promedio de entrega', '12.5 días', '–', ref],
    ['', '3. Retraso promedio de los tardíos', '9.4 días', '–', ref],
    ['', '4. Entrega: estados distintos vs. mismo estado', '15.1 vs 7.9 días', '–', ref],
    ['', '5. % de pedidos no concretados', '1.24 %', '–', ref],
    ['OE2 · Satisfacción', '6. Calificación promedio', '4.16', '≥ 4.30', no],
    ['', '7. % de reseñas negativas (1–2)', '12.73 %', '< 10 %', no],
    ['', '8. Brecha de calificación (a tiempo − tarde)', '1.72', '–', ref],
    ['OE3 · Fidelización', '9. Tasa de recompra', '3.12 %', '4 %', no],
    ['', '10. Recompra: primer pedido a tiempo vs. tarde', '4.34 vs 2.97 %', '–', ref],
    ['', '11. Recompra: sin vs. con reseña negativa', '4.32 vs 3.73 %', '–', ref],
  ].map((f, i) => i === 0 ? f : f.map((c, j) => typeof c === 'string' ? { text: c, options: { align: j === 2 || j === 3 ? 'right' : 'left', bold: j === 0 } } : c));
  s.addTable(filas, { x: 0.6, y: 1.45, w: 12.1, colW: [2.2, 5.0, 2.0, 1.2, 1.7], fontSize: 14, color: H.texto, border: { type: 'solid', pt: 0.75, color: H.linea }, rowH: 0.42, valign: 'middle', objectName: nm(0, 'fade', 'tabla') });
  s.addNotes('Estos son los 11 KPI, agrupados por los tres objetivos estratégicos, calculados en el workflow 04 y verificados contra las consultas SQL. Los que tienen meta hoy no la cumplen: 8 % de tardíos frente a menos de 6, 4.16 de calificación frente a 4.30, 12.7 % de reseñas negativas y 3.12 % de recompra. Los demás son de referencia y ayudan a explicar: por ejemplo, un envío entre estados tarda casi el doble, y un pedido tarde pierde 1.72 estrellas.');
}

// 22. Dashboard
{
  const s = nuevo('K', 'Dashboard: evolución mensual y estados con más retraso', '4. KPI y conclusiones');
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
  txt(s, 'Picos en nov. 2017 (14.3 %) y mar. 2018 (21.4 %): en esos meses la calificación cae a 3.99 y 3.81.', { x: 8.3, y: 5.95, w: 4.5, h: 0.9, fontSize: 13, color: H.suave, objectName: nm(2, 'fade', 'nota') });
  s.addNotes('El dashboard de Power BI tiene cinco páginas: un resumen con filtro por estado, una por cada objetivo y una con los segmentos y el riesgo del Modelo 2; sus medidas se verificaron con consultas DAX. Aquí lo principal: los retrasos por mes tienen picos en noviembre de 2017 y en febrero y marzo de 2018… (Clic) …y justo en esos meses cae la calificación; las dos curvas son como un espejo. (Clic) Por estado, Alagoas y Maranhão tienen entre 20 y 24 % de tardíos, contra 6 % en São Paulo.');
}

// 23. Hipótesis
{
  const s = nuevo('K', 'Contraste de hipótesis', '4. KPI y conclusiones');
  const hip = [
    ['H1', 'Los pedidos tardíos reciben menor calificación', 'Se confirma', '4.30 vs 2.57; Mann-Whitney p < 0.001, efecto grande', H.teal],
    ['H2', 'El retraso depende de la región y de la distancia', 'Se confirma, con matiz', 'χ² p < 0.001 en el periodo completo; la relación se invierte en 2018', H.amber],
    ['H3', 'Un modelo anticipa el retraso mejor que una regla', 'Se confirma', 'Regresión logística AUC 0.719 > 0.60 y > reglas simples', H.teal],
    ['H4', 'Los segmentos difieren en satisfacción', 'Se confirma, con advertencia', 'Kruskal-Wallis H = 7 767; el efecto viene de la logística', H.amber],
  ];
  hip.forEach((h, i) => {
    const y = 1.55 + i * 1.3;
    tarjeta(s, 0.6, y, 12.1, 1.1, i, 'f' + i);
    s.addShape(pres.shapes.OVAL, { x: 0.85, y: y + 0.17, w: 0.76, h: 0.76, fill: { color: h[4] }, line: { color: h[4] }, objectName: nm(i, 'fade', 'c' + i) });
    s.addText(h[0], { x: 0.85, y: y + 0.17, w: 0.76, h: 0.76, align: 'center', valign: 'middle', bold: true, fontSize: 18, color: H.blanco, isTextBox: true, margin: 0, objectName: nm(i, 'fade', 'ct' + i) });
    txt(s, h[1], { x: 1.9, y: y + 0.12, w: 4.6, h: 0.85, fontSize: 16, bold: true, valign: 'middle', objectName: nm(i, 'fade', 'd' + i) });
    txt(s, h[2], { x: 6.6, y: y + 0.12, w: 2.3, h: 0.85, fontSize: 16, bold: true, color: h[4] === H.teal ? H.teal : 'A97A12', valign: 'middle', objectName: nm(i, 'fade', 'r' + i) });
    txt(s, h[3], { x: 9.0, y: y + 0.12, w: 3.55, h: 0.85, fontSize: 13, color: H.suave, valign: 'middle', objectName: nm(i, 'fade', 'e' + i) });
  });
  s.addNotes('Volvemos a las cuatro hipótesis. H1 se confirma con un efecto grande. (Clic) H2 se confirma para el periodo completo, pero vimos que la relación cambia en 2018. (Clic) H3 se confirma: la regresión logística supera el criterio y las reglas simples. (Clic) Y H4 se confirma, con la advertencia de que la diferencia viene de la logística.');
}

// 24. Conclusiones y recomendaciones
{
  const s = nuevo('K', 'Conclusiones y recomendaciones para Olist', '4. KPI y conclusiones');
  txt(s, 'Conclusiones', { x: 0.6, y: 1.5, w: 5.6, h: 0.45, fontSize: 20, bold: true, color: H.navy, objectName: nm(0, 'fade', 'ct') });
  txt(s, [
    { text: 'El retraso es el principal factor de insatisfacción: cuesta 1.72 estrellas.', options: { bullet: true, breakLine: true } },
    { text: 'Se puede anticipar lo suficiente para priorizar (AUC 0.72), no para automatizar.', options: { bullet: true, breakLine: true } },
    { text: 'La geografía del retraso cambia en el tiempo: hay que monitorear.', options: { bullet: true, breakLine: true } },
    { text: 'La recompra depende de más que la entrega (4.34 % vs 2.97 %).', options: { bullet: true } },
  ], { x: 0.6, y: 2.05, w: 5.6, h: 4.3, fontSize: 16, paraSpaceAfter: 12, objectName: nm(0, 'fade', 'c') });
  const rec = [
    ['Priorizar', 'Seguir primero los pedidos de riesgo alto del Modelo 2.'],
    ['Avisar', 'Contactar al cliente de forma proactiva cuando un pedido se retrasa.'],
    ['Corregir rutas', 'Revisar la logística en Alagoas y Maranhão y los plazos entre estados.'],
    ['Monitorear', 'Revisar los KPI por región cada mes y reentrenar el modelo.'],
  ];
  rec.forEach((r, i) => {
    const x = 6.75 + (i % 2) * 3.05, y = 1.55 + Math.floor(i / 2) * 2.45;
    tarjeta(s, x, y, 2.85, 2.2, i + 1, 'rec' + i);
    txt(s, [{ text: r[0], options: { bold: true, fontSize: 18, color: H.teal, breakLine: true } }, { text: r[1], options: { fontSize: 15 } }], { x: x + 0.2, y: y + 0.2, w: 2.45, h: 1.85, objectName: nm(i + 1, 'fade', 'rect' + i) });
  });
  txt(s, 'Meta propuesta: bajar las entregas tardías de 8.07 % a menos de 6 %.', { x: 6.75, y: 6.45, w: 6, h: 0.4, fontSize: 15, bold: true, color: H.navy, objectName: nm(5, 'fade', 'meta') });
  s.addNotes('En conclusión: el retraso es el principal enemigo de la satisfacción en Olist; se puede anticipar lo suficiente para priorizar; la relación con la geografía cambia en el tiempo; y la recompra depende de más cosas que la entrega. (Clics) Por eso recomendamos cuatro acciones: priorizar con el modelo, avisar al cliente antes, corregir las rutas en los estados críticos y monitorear cada mes. La meta: bajar de 8 a menos de 6 % de entregas tardías.');
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
  s.addNotes('Estas son las referencias principales; la lista completa en formato APA está en el documento.');
}

// 26. Preguntas
{
  const s = pres.addSlide({ masterName: 'PORTADA', sectionTitle: '4. KPI y conclusiones' });
  s.addText('Gracias', { x: 0.9, y: 2.3, w: 11.5, h: 1.2, fontSize: 54, bold: true, color: H.blanco, fontFace: 'Cambria', isTextBox: true, margin: 0, objectName: nm(0, 'fade', 'g') });
  txt(s, '¿Preguntas?', { x: 0.9, y: 3.5, w: 11.5, h: 0.8, fontSize: 30, color: 'E3E8F2', objectName: nm(0, 'fade', 'p') });
  s.addShape(pres.shapes.LINE, { x: 0.9, y: 4.6, w: 2.2, h: 0, line: { color: H.amber, width: 2.5 }, objectName: nm(0, 'wipeL', 'regla') });
  txt(s, 'Repositorio del proyecto: github.com/FerretoDev/mo0005-ecommerce-ml', { x: 0.9, y: 4.9, w: 11.5, h: 0.5, fontSize: 16, color: 'C9D1E0', objectName: nm(0, 'fade', 'repo') });
  s.addNotes('Muchas gracias. Con gusto respondemos preguntas: Marcos sobre los datos y PostgreSQL, Moya sobre la segmentación, Sebastián sobre la predicción y Kendall sobre los indicadores y el dashboard.');
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

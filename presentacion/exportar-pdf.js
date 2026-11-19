// Genera presentacion.pdf (una diapositiva por página, 1920×1080) para subirla a Mediación Virtual.
// Uso, desde la carpeta presentacion/:  node exportar-pdf.js
// Requiere Playwright con Chromium:      npm i -D playwright && npx playwright install chromium
const { chromium } = require('playwright');
const { pathToFileURL } = require('node:url');
const path = require('node:path');

(async () => {
const dir = __dirname;
const url = pathToFileURL(path.join(dir, 'index.html')).href;
const salida = path.join(dir, 'presentacion.pdf');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(url, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);

// Estado final de la animación del ETL: el paquete al final y el contador en 96 144.
await page.evaluate(() => {
  const p = document.getElementById('paquete-etl');
  const c = document.getElementById('contador');
  if (p) p.setAttribute('transform', 'translate(1500 212)');
  if (c) c.textContent = '96 144';
});

await page.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
await page.pdf({
  path: salida,
  width: '1920px',
  height: '1080px',
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  preferCSSPageSize: true,
});
await browser.close();
console.log('PDF generado:', salida);
})();

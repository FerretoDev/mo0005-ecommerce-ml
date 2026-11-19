# Presentación de la defensa

Presentación en HTML, como un PowerPoint: 20 diapositivas en 16:9, con animaciones SVG. Funciona sin internet, porque la fuente va incluida en `fonts/`.

## Cómo abrirla

Abrir `index.html` en Chrome o Edge y presionar **F** para ponerla en pantalla completa.

| Tecla | Acción |
| --- | --- |
| → · Espacio · Enter · AvPág · clic en la mitad derecha | Siguiente diapositiva |
| ← · Retroceso · RePág · clic en la mitad izquierda | Diapositiva anterior |
| Inicio · Fin | Primera · última |
| **N** | Notas del orador: quién presenta, tiempo sugerido y cronómetro |
| **F** | Pantalla completa |

Para ir directo a una diapositiva, agregar `#número` a la dirección (por ejemplo `index.html#12`).

## Orden y tiempos (17–19 minutos)

La barra inferior es la ruta del pedido: el paquete avanza con cada diapositiva y marca quién presenta.

| Bloque | Diapositivas | Presenta | Contenido | Tiempo |
| --- | --- | --- | --- | --- |
| 1 | 1–7 | Marcos | Olist y su reto, el problema, objetivos e hipótesis, infraestructura (PostgreSQL, GitHub) y workflow 01-ETL | ≈ 5:20 |
| 2 | 8–11 | Moya | Modelo 1: k-means, elección de k, cuatro segmentos y H4 (02-Clustering) | ≈ 3:40 |
| 3 | 12–15 | Sebastián | Modelo 2: partición temporal, AUC, cómo usarlo y el cambio en la geografía (03-Prediccion) | ≈ 4:30 |
| 4 | 16–20 | Kendall | 11 KPI, dashboard, propuesta de valor, hipótesis y conclusiones (04-KPIs) | ≈ 4:35 |

Las notas de cada diapositiva (tecla **N**) traen un guion sugerido que termina con el pase al siguiente compañero.

## PDF para Mediación Virtual

`presentacion.pdf` ya está generado (una diapositiva por página). Si se cambia `index.html`, se regenera con:

```bash
cd presentacion
npm i -D playwright && npx playwright install chromium   # solo la primera vez
node exportar-pdf.js
```

También sirve imprimir desde Chrome (Ctrl+P → Guardar como PDF, sin márgenes y con gráficos de fondo).

## Archivos

- `index.html`: la presentación (CSS y JavaScript incluidos).
- `fonts/`: Archivo, con licencia SIL Open Font License (`OFL.txt`).
- `img/`: capturas del dashboard de Power BI.
- `exportar-pdf.js`: genera el PDF con Playwright.
- `presentacion.pdf`: versión para subir.

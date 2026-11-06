# 01-ETL en KNIME: carga de CSV, joins y salida (sin PostgreSQL ni Docker)

Mientras no haya base de datos, KNIME lee directamente `knime/datos/*.csv`. Cuando se monte Postgres, solo se
reemplazan los nodos *CSV Reader* por *PostgreSQL Connector + DB Table Selector*; el resto del flujo no cambia.

## Antes de empezar
1. `git pull origin main`
2. Avisar al equipo que vas a abrir `01-ETL` (un solo editor por workflow).
3. Abrir KNIME con el workspace en la carpeta `knime/` del repo.

## Dónde van los CSV
KNIME no permite rutas relativas que salgan de la raíz del workspace (`knime/`), por eso `../../datos` falla.
Los CSV viven en **`knime/datos/`** y están versionados: `git pull origin main` los trae (~125 MB).
Los scripts SQL y notas siguen en `/datos`.

## Nodos del workflow `01-ETL`

Cadena principal: `CSV Readers → GroupBy / Joiner (pedido + cliente + items + pagos + reseñas) → Row Filter delivered → Column Renamer → Joiner con la rama del primer ítem → Rule Engine mismo_estado → String to Date&Time → Row Filter ventana → fechas y variables derivadas → Rule Engine es_tardio → Math Formula → Column Filter → Missing Value → CSV Writer`.

| IDs | Nodo | Qué hace |
| :--- | :--- | :--- |
| 6 a 14 | CSV Reader (x9) | Un nodo por archivo, ruta `../datos/<archivo>.csv` relativa al workflow, UTF-8 |
| 15 a 17 | GroupBy | Por `order_id`: items (suma de precio y flete, máximo de `order_item_id`), pagos (suma, máximo de cuotas) y reseñas (promedio) |
| 18 a 21 | Joiner (Left Outer) | Orders + Customers, y luego items, pagos y reseñas agregados |
| 22 | Row Filter | Solo `order_status = delivered` |
| 23 | Column Renamer | `total_precio`, `total_flete`, `num_items`, `total_pagado`, `max_cuotas`, `review_promedio` |
| 28 a 31 | Row Filter + 3 Joiner | Rama del primer ítem (`order_item_id = 1`) con sellers, products y traducción |
| 32 | Joiner | Une la rama al pedido por `order_id` |
| 33 | Rule Engine | `mismo_estado` = 1 si `customer_state = seller_state` |
| 25 | String to Date&Time | Convierte las 5 columnas `order_*` a Date&Time (con hora) |
| 37 | Row Filter | Ventana: entrega desde 2017-01-01 hasta antes de 2018-09-01 (96 144 filas) |
| 38, 26, 27 | Date&Time Difference | En segundos: `segundos_plazo`, `segundos_entrega`, `segundos_retraso` |
| 39, 35, 36 | Math Formula | `/ 86400`: `plazo_estimado_dias`, `dias_entrega`, `dias_retraso` |
| 34 | Rule Engine | `es_tardio` = 1 si `segundos_retraso > 0` |
| 40, 41 | Math Formula | `relacion_precio_flete` y `volumen_cm3` |
| 42 | Column Filter | Deja 29 columnas |
| 43 | Missing Value | Categoría ausente a «desconocida» (1 376 pedidos) |
| 44 | Statistics | Resumen de la tabla final (avisa por columnas con más de 1 000 valores distintos) |
| 24 | CSV Writer | Escribe `knime/datos/ordenes_etl.csv` (versionado en Git, unos 33 MB; regenerar y subir si cambia el ETL) |

Los Date&Time Difference miden en segundos porque con granularidad Day KNIME no ofrece decimales. Se divide entre 86 400 y así un pedido entregado el día estimado, pero tras las 00:00, cuenta como tardío.

## Tipos de columna (sección *Transformation* de cada CSV Reader)
- **Códigos postales** (`customer_zip_code_prefix`, `seller_zip_code_prefix`, `geolocation_zip_code_prefix`): **String**.
  Como Integer se pierden los ceros a la izquierda (`01037` pasa a `1037`) y fallan los joins por código postal.
  Son identificadores, no cantidades.
- IDs (`*_id`): String. `price`, `freight_value`, `payment_value`, `geolocation_lat/lng`: Double.
  `review_score`, `payment_installments`, `order_item_id` y las medidas de `products`: Integer.
- Fechas: String en el reader; se convierten con *String to Date&Time*.
- Nulos legítimos: `order_approved_at`, `order_delivered_*`, `review_comment_*` y varias columnas de `products`.

## Resultado y validaciones
- `ordenes_etl.csv`: **96 144 filas** (una por `order_id`, sin duplicados) y **29 columnas**.
- `es_tardio` promedia **0,0807** (8,07 %), igual al KPI 1 de `kpis/kpis.sql`.
- Antes de los filtros, el Joiner #21 tiene 99 441 filas (una por orden). Tras `delivered` quedan 96 478 y la ventana de fechas deja 96 144.
- Nulos que quedan: `review_promedio` 642, peso y medidas 16 (también `volumen_cm3`), `order_approved_at` 14 y `order_delivered_carrier_date` 1.
- Si se mide solo con fecha (granularidad Day, sin hora), `es_tardio` sale en 6,73 % y no en 8,07 %.

## Formato de las fechas en `ordenes_etl.csv`
KNIME escribe las fechas sin los segundos cuando valen cero: `2018-06-11T21:17` en lugar de `2018-06-11T21:17:00`. Por eso conviven dos formatos en una misma columna: 1 559 filas de `order_purchase_timestamp`, 889 de `order_approved_at`, 28 519 de `order_delivered_carrier_date` y 1 563 de `order_delivered_customer_date` salen así, y las 96 144 de `order_estimated_delivery_date` (siempre a las 00:00). KNIME y la mayoría de los lectores las leen bien, pero un script con formato fijo falla. Si Power BI u otra herramienta da problema, convertir esas columnas a texto con formato fijo `yyyy-MM-dd HH:mm:ss` antes del CSV Writer (nodo *Date&Time to String*).

## Antes de guardar y commitear
Reset (F8) a todos los nodos (con los datos guardados `knime/01-ETL` pesa cientos de MB; reseteado, menos de 1 MB), guardar, cerrar KNIME y:
```bash
git add knime/01-ETL
git commit -m "feat(knime): descripcion corta del cambio en 01-ETL"
git push origin main
```

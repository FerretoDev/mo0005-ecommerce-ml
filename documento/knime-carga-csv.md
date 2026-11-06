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

| IDs | Nodo | Qué hace |
| :--- | :--- | :--- |
| 6 a 14 | CSV Reader (x9) | Un nodo por archivo, ruta `../datos/<archivo>.csv` relativa al workflow, UTF-8 |
| 15 | GroupBy (Order Items) | Por `order_id`: suma de `price`, suma de `freight_value`, máximo de `order_item_id` |
| 16 | GroupBy (Payments) | Por `order_id`: suma de `payment_value`, máximo de `payment_installments` |
| 17 | GroupBy (Reviews) | Por `order_id`: promedio de `review_score` |
| 18 | Joiner | Orders + Customers por `customer_id` |
| 19 a 21 | Joiner (Left Outer) | Añade items, pagos y reseñas agregados por `order_id` |
| 22 | Row Filter | Solo `order_status = delivered` |
| 23 | Column Renamer | `total_precio`, `total_flete`, `num_items`, `total_pagado`, `max_cuotas`, `review_promedio` |
| 25 | String to Date&Time | Convierte las 5 columnas `order_*` a fecha |
| 26 | Date&Time Difference | `dias_entrega` = entrega al cliente - compra (días) |
| 27 | Date&Time Difference | `dias_retraso` = entrega al cliente - fecha estimada (días; positivo = tarde) |
| 24 | CSV Writer | Escribe `knime/datos/ordenes_etl.csv` (ignorado en Git, se regenera) |

Los nodos 25 a 27 se agregaron a mano en la interfaz de KNIME (String to Date&Time y Date&Time Difference).

## Tipos de columna (sección *Transformation* de cada CSV Reader)
- **Códigos postales** (`customer_zip_code_prefix`, `seller_zip_code_prefix`, `geolocation_zip_code_prefix`): **String**.
  Como Integer se pierden los ceros a la izquierda (`01037` pasa a `1037`) y fallan los joins por código postal.
  Son identificadores, no cantidades.
- IDs (`*_id`): String. `price`, `freight_value`, `payment_value`, `geolocation_lat/lng`: Double.
  `review_score`, `payment_installments`, `order_item_id` y las medidas de `products`: Integer.
- Fechas: String en el reader; se convierten con *String to Date&Time*.
- Nulos legítimos: `order_approved_at`, `order_delivered_*`, `review_comment_*` y varias columnas de `products`.

## Resultado y validaciones
- `ordenes_etl.csv`: **96 478 filas** (órdenes `delivered`), una por `order_id`, con 20 columnas.
- Entregas tardías (`dias_retraso > 0`): 6 534 (6,8 %).
- 8 órdenes `delivered` no tienen fecha de entrega al cliente; `dias_entrega` y `dias_retraso` quedan vacíos.
- El Joiner #21 antes del filtro tiene 99 441 filas (una por orden, sin duplicados).

## Pendiente: diferencias con `datos/views.sql` y `knime/Flujo con KNIME.md`
La definición del equipo de la población y las variables es más amplia. Esta versión base aún no incluye:
- Ventana de fechas de entrega entre 2017-01-01 y 2018-08-31 (las vistas SQL dan 8,07 % de tardías; esta versión, 6,8 %, porque no filtra por fechas).
- `es_tardio`, `plazo_estimado_dias`, `mismo_estado`, `relacion_precio_flete`.
- Joins con Products, Sellers y Translation: categoría, `peso_g`, `volumen_cm3` y `seller_state`.

## Antes de guardar y commitear
Reset (F8) a todos los nodos, guardar, cerrar KNIME y:
```bash
git add knime/01-ETL
git commit -m "feat(knime): descripcion corta del cambio en 01-ETL"
git push origin main
```

# Carga de los CSV de Olist en KNIME (sin PostgreSQL ni Docker)

Mientras no haya base de datos, KNIME lee directamente `/datos/*.csv`. Más adelante,
si se monta Postgres, solo se reemplazan los nodos *CSV Reader* por *PostgreSQL Connector + DB Table Selector*;
el resto del flujo no cambia (mismos nombres de columnas).

## Antes de empezar
1. `git pull origin main`
2. Avisar al equipo que vas a abrir `01-ETL` (regla de oro: un solo editor por workflow).

## Dónde van los CSV
KNIME no permite rutas relativas que salgan de la raíz del workspace (`knime/`), por eso los CSV viven en
**`knime/datos/`** y están versionados en Git: con `git pull origin main` todo el equipo los recibe (~125 MB).
Los scripts y notas (`datos/*.sql`, `LEER.md`) siguen en `/datos`.

## Un nodo CSV Reader por archivo (9 en total)
En `knime/01-ETL`, arrastra **CSV Reader** y configura:

- **Source → Read from:** `Relative to` → **Current workflow**
- **Path:** `../datos/<archivo>.csv` (ruta relativa al workflow `knime/01-ETL`)
- **Encoding:** UTF-8 (el de `product_category_name_translation.csv` trae BOM; UTF-8 lo maneja)
- Column delimiter `,` · Quote `"` · primera fila = encabezado

| Nodo (nombre sugerido) | Archivo | Filas aprox. |
| :--- | :--- | ---: |
| Customers | olist_customers_dataset.csv | 99 441 |
| Orders | olist_orders_dataset.csv | 99 441 |
| Order Items | olist_order_items_dataset.csv | 112 650 |
| Payments | olist_order_payments_dataset.csv | 103 886 |
| Reviews | olist_order_reviews_dataset.csv | ~99 224 (hay saltos de línea dentro de comentarios, por eso el conteo de líneas es mayor) |
| Products | olist_products_dataset.csv | 32 951 |
| Sellers | olist_sellers_dataset.csv | 3 095 |
| Geolocation | olist_geolocation_dataset.csv | 1 000 163 (62 MB; leer solo si se necesita) |
| Category Translation | product_category_name_translation.csv | 71 |

## Ajustes de tipos (pestaña *Transformation*)
- **Códigos postales** (`customer_zip_code_prefix`, `seller_zip_code_prefix`, `geolocation_zip_code_prefix`):
  forzar a **String**. Si KNIME los infiere como Integer se pierden ceros a la izquierda (`01037` → `1037`) y
  fallan los joins con geolocalización.
- **Fechas** (`order_*`, `shipping_limit_date`, `review_*`): convertir a *Local Date&Time* con
  **String to Date&Time** (formato `yyyy-MM-dd HH:mm:ss`) si el reader las deja como String.
- `price`, `freight_value`, `payment_value`: Double. `review_score`, `payment_installments`: Integer.
- `order_approved_at`, `order_delivered_*`, `review_comment_*` y varias columnas de `products` tienen **nulos legítimos**; no eliminarlos en la carga.

## Joins del ETL (según el diagrama ER)
```
Orders ─ customer_id ─► Customers
Orders ─ order_id ─► Order Items ─ product_id ─► Products ─ product_category_name ─► Category Translation
                                  └ seller_id ─► Sellers
Orders ─ order_id ─► Payments
Orders ─ order_id ─► Reviews   (Left Outer: no todas las órdenes tienen reseña)
```
Usar **Joiner** con *Left Outer* partiendo de Orders. Ojo: Items, Payments y Reviews pueden tener varias filas por orden;
agregar con **GroupBy** (por `order_id`) antes de unir si se quiere una fila por orden.

## Limpieza pendiente en el workflow actual
`01-ETL/workflow.knime` tiene nodos sueltos y sin conexiones (Decision Tree View/Image, Excel Writer,
Google Sheets Reader, CSV Writer) que no pertenecen al ETL. Conviene borrarlos o moverlos a `03-Prediccion`.

## Antes de guardar y commitear
Clic derecho en los nodos pesados (Geolocation, Reviews, Joiners) → **Reset**, guardar, cerrar KNIME, y:
```bash
git add knime/01-ETL
git commit -m "feat(knime): cargar csv de olist con rutas relativas en 01-ETL"
git push origin main
```

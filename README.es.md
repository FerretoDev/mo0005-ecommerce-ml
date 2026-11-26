# Proyecto MO-0005: Análisis de Clientes E-commerce

> English version: [README.md](README.md)

[![KNIME](https://img.shields.io/badge/KNIME-Analytics%20Platform-orange?logo=knime&logoColor=white)](https://www.knime.com/)
[![Power BI](https://img.shields.io/badge/Power%20BI-Dashboard-F2C811?logo=powerbi&logoColor=black)](https://powerbi.microsoft.com/)
[![Storage](https://img.shields.io/badge/Storage-PostgreSQL%20(Docker)-blue?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Dataset](https://img.shields.io/badge/Dataset-Olist%20Kaggle-20BEFF?logo=kaggle&logoColor=white)](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce)

## Descripción

Proyecto del curso **MO-0005 Análisis de Algoritmos** (Grupo 02, II Ciclo 2026), Universidad de Costa Rica, Sede de Occidente, Recinto de Grecia. Profesor: Manfred Mejías Acevedo.

El proyecto aplica análisis de datos y aprendizaje automático a clientes de e-commerce, con el dataset público de Olist, KNIME, PostgreSQL (Docker) y Power BI. Cubre el ciclo completo de los datos: extracción, limpieza e integración de varias fuentes, segmentación de pedidos, predicción de entregas tardías y presentación de indicadores en un dashboard interactivo.

**Equipo:** Marcos Ferreto Estrada, Kendall Alvarado Artavia, David Moya Correas y Sebastián Sánchez Vega.

## Entregables

- Informe (LaTeX, APA): [`documento/latex/main.pdf`](documento/latex/main.pdf), fuente en [`documento/latex/main.tex`](documento/latex/main.tex).
- Presentación: [`presentacion/presentacion.pptx`](presentacion/presentacion.pptx) y [`presentacion/presentacion.pdf`](presentacion/presentacion.pdf).
- Dashboard: [`powerbi/dashboard_olist.pbix`](powerbi/dashboard_olist.pbix).
- Flujos de KNIME: [`knime/`](knime/).

## Herramientas

- **KNIME Analytics Platform:** flujos de ETL y modelos de aprendizaje automático.
- **PostgreSQL (Docker):** almacenamiento relacional de las tablas del negocio. Se eligió PostgreSQL local en lugar de Snowflake por reproducibilidad: cualquiera levanta la misma base con un solo comando.
- **Power BI:** dashboard con los resultados de los modelos y los KPI.
- **Git / GitHub:** control de versiones.

## Flujos y resultados

| Workflow | Descripción |
| :--- | :--- |
| `01-ETL` | Lee los 9 CSV, une pedido + cliente + items + pagos + reseñas + vendedor/producto, filtra `delivered` y la ventana de entrega (2017-01 a 2018-08), calcula las variables derivadas (`es_tardio`, `dias_entrega`, `dias_retraso`, `mismo_estado`, etc.) y exporta `knime/datos/ordenes_etl.csv` (96 144 pedidos, 29 columnas; `es_tardio` = 8,07 %). |
| `02-Clustering` | k-means con k = 4 (grupos de 7 357 / 16 767 / 30 509 / 41 511 pedidos), perfil de segmentos, silueta global 0,297, prueba de H4 con One-way ANOVA (F = 4 477,7; p < 0,001). Salida: `knime/datos/segmentos_modelo1.csv` (`order_id` + `Cluster`). La tabla de k (2 a 8) se calcula en `analisis/pruebas_estadisticas.py`. |
| `03-Prediccion` | Predice `es_tardio` al comprar con regresión logística y Random Forest frente a dos líneas base, con partición temporal (corte 2018-04-01; 64 052 pedidos de entrenamiento y 32 092 de prueba). AUC de prueba: regresión logística 0,719, Random Forest 0,590, líneas base 0,500 y 0,472. Validación cruzada de 5 particiones del tamaño mínimo de nodo del Random Forest (10, 20, 40 y 80; AUC de 0,686 a 0,688, se mantiene 20). Salida: `knime/datos/predicciones_modelo2.csv` (solo pedidos de prueba). |
| `04-KPIs` | Calcula los 11 KPI (verificados contra `datos/resultados_kpis.txt`), une el segmento y las probabilidades de los modelos anteriores y escribe `knime/datos/pedidos_kpi.csv` (96 144 pedidos, 18 columnas) y `knime/datos/clientes_kpi.csv` (96 096 clientes, 8 columnas) para Power BI. |

## Estructura del repositorio

```text
mo0005-ecommerce-ml/
├── README.md, README.es.md
├── LICENSE
├── docker-compose.yml        # Servicio PostgreSQL (olist-db)
├── cargar.sh                 # Levanta la base, carga los CSV y valida conteos
├── analisis/
│   └── pruebas_estadisticas.py   # Cálculos hechos en Python (tabla de k, pruebas de hipótesis)
├── datos/                    # schema.sql, views.sql y resultados_kpis.txt
├── diagrama-er/              # Diagrama entidad-relación (.drawio y .png)
├── documento/
│   ├── capturas/             # Capturas usadas en el informe
│   └── latex/                # main.tex, main.pdf y compilar.py
├── knime/
│   ├── datos/                # CSV de Olist y salidas de los flujos
│   ├── 01-ETL/
│   ├── 02-Clustering/
│   ├── 03-Prediccion/
│   └── 04-KPIs/
├── kpis/                     # kpis.sql (consultas de los 11 KPI)
├── powerbi/                  # dashboard_olist.pbix
└── presentacion/             # presentacion.pptx/.pdf y fuente/ (scripts de generación)
```

KNIME no permite rutas relativas fuera de su workspace (`knime/`), por eso los CSV viven en `knime/datos/`; `cargar.sh` los lee desde esa misma carpeta.

## Dataset (Olist E-Commerce)

El proyecto utiliza el dataset público **Brazilian E-Commerce Public Dataset by Olist**, disponible en [Kaggle](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce). Contiene información real de aproximadamente 100 000 pedidos realizados entre 2016 y 2018 en Brasil. Los archivos están versionados en `knime/datos/`, así que no hace falta descargarlos de Kaggle.

- `olist_customers_dataset.csv`: clientes y sus ubicaciones.
- `olist_orders_dataset.csv`: historial de pedidos y estados de envío.
- `olist_order_items_dataset.csv`: artículos de cada pedido, precios y flete.
- `olist_order_payments_dataset.csv`: métodos de pago y número de cuotas.
- `olist_order_reviews_dataset.csv`: reseñas y calificaciones de los clientes.
- `olist_products_dataset.csv`: dimensiones, pesos y categorías de productos.
- `olist_sellers_dataset.csv`: vendedores y sus regiones.
- `olist_geolocation_dataset.csv`: coordenadas por código postal.
- `product_category_name_translation.csv`: traducción de categorías de portugués a inglés.

## Cómo levantar la base de datos

Requisitos: Docker con Docker Compose.

```bash
git clone https://github.com/FerretoDev/mo0005-ecommerce-ml.git
cd mo0005-ecommerce-ml
./cargar.sh            # levanta PostgreSQL, crea el esquema, carga los 9 CSV y valida conteos
./cargar.sh --kpis     # lo anterior + ejecuta kpis/kpis.sql y guarda datos/resultados_kpis.txt
```

`cargar.sh` es idempotente: cada ejecución recrea el esquema `olist` desde cero, sin duplicar filas, y termina con error si algún conteo no coincide con lo esperado.

Datos de conexión (solo uso local):

| Parámetro | Valor |
| :--- | :--- |
| Host | `localhost` |
| Puerto | `5432` |
| Usuario | `postgres` |
| Contraseña | `postgres` |
| Base de datos | `postgres` |
| Esquema | `olist` |

Las tablas analíticas están en las vistas `olist.v_pedidos_base` y `olist.v_clientes`.

## Cómo abrir los flujos de KNIME

1. Abrir KNIME Analytics Platform y usar la carpeta `knime/` como workspace.
2. Abrir `01-ETL`, `02-Clustering`, `03-Prediccion` o `04-KPIs`.
3. Ejecutar todos los nodos (Shift+F7). Los flujos leen los CSV de `knime/datos/` y escriben sus salidas ahí mismo.

`ordenes_etl.csv` ya viene en el repositorio (unos 33 MB), por lo que no hace falta correr el ETL antes de los otros flujos. Los flujos también pueden leer de la base PostgreSQL con el nodo *PostgreSQL Connector*.

## Cómo abrir el dashboard de Power BI

Abrir `powerbi/dashboard_olist.pbix` en Power BI Desktop. Lee los CSV que genera KNIME en `knime/datos/`. Si el repositorio está en otra carpeta, hay que actualizar el parámetro `RutaDatos` (Inicio, Transformar datos, Administrar parámetros). Las tablas del modelo y las páginas se describen en [`powerbi/LEER.md`](powerbi/LEER.md).

## Cómo compilar el informe

Requiere una distribución de LaTeX con XeLaTeX y latexmk (TeX Live, MiKTeX o TinyTeX):

```bash
python documento/latex/compilar.py             # compila main.tex y deja main.pdf al lado
python documento/latex/compilar.py --limpiar   # borra los auxiliares antes de compilar
```

## Cálculos en Python

`analisis/pruebas_estadisticas.py` reproduce los cálculos del informe que se hicieron fuera de KNIME (tabla de k, estabilidad entre semillas, pruebas de hipótesis):

```bash
pip install pandas numpy scipy scikit-learn
python analisis/pruebas_estadisticas.py
```

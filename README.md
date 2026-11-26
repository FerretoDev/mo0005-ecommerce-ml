# MO-0005 Project: E-commerce Customer Analytics

[![KNIME](https://img.shields.io/badge/KNIME-Analytics%20Platform-orange?logo=knime&logoColor=white)](https://www.knime.com/)
[![Power BI](https://img.shields.io/badge/Power%20BI-Dashboard-F2C811?logo=powerbi&logoColor=black)](https://powerbi.microsoft.com/)
[![Storage](https://img.shields.io/badge/Storage-PostgreSQL%20(Docker)-blue?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Dataset](https://img.shields.io/badge/Dataset-Olist%20Kaggle-20BEFF?logo=kaggle&logoColor=white)](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce)

> Spanish version: [README.es.md](README.es.md)

## Overview

Course project for **MO-0005 Análisis de Algoritmos** (Group 02, second semester 2026), Universidad de Costa Rica, Sede de Occidente, Recinto de Grecia. Professor: Manfred Mejías Acevedo.

**Question.** In Olist, a Brazilian marketplace, 8 of every 100 orders arrive after the promised date. Does that hurt customer satisfaction and repurchase, and can the delay be anticipated at purchase time?

**Approach.** CRISP-DM on the public Olist dataset (~100k orders, 9 tables): the data is loaded into PostgreSQL (Docker), cleaned and joined in KNIME, analysed with two machine learning models (k-means segmentation and late-delivery classification) and tracked with 11 KPIs in a Power BI dashboard. Results are written up in an APA report (LaTeX).

## Key results

| Finding | Value |
| :--- | :--- |
| Late deliveries | 8.07% of 96,144 delivered orders |
| Average rating, on time vs. late | 4.30 vs. 2.57 stars (53.9% of late orders get a negative review) |
| Repurchase, first order on time vs. late | 4.34% vs. 2.97% |
| Order segments (k-means, k = 4) | One segment (7.7% of orders) holds 77% late deliveries and a 2.59 rating |
| Late-delivery model (test AUC) | Logistic regression 0.719 vs. Random Forest 0.590 and baselines 0.500 / 0.472 |
| Model use | Detects 79 of every 100 late orders; high-risk orders are late 3.5 times more often than low-risk ones |
| Stability | The state-to-state delay pattern reversed in 2018, so the model needs periodic retraining |

| Order segments | Model comparison | Monthly trend |
| :---: | :---: | :---: |
| ![Segments](.github/assets/segmentos.png) | ![AUC](.github/assets/modelos-auc.png) | ![Monthly trend](.github/assets/evolucion-mensual.png) |

## Team and contributions

| Member | Main contribution |
| :--- | :--- |
| Marcos Ferreto Estrada | Project setup and repository, PostgreSQL in Docker with the loading script (`cargar.sh`), `01-ETL` workflow, co-author of `02-Clustering` |
| David Moya Correas | `02-Clustering` workflow (k-means segmentation and hypothesis H4) |
| Sebastián Sánchez Vega | `03-Prediccion` workflow (late-delivery classification) |
| Kendall Alvarado Artavia | `04-KPIs` workflow and the Power BI dashboard |

## Deliverables

- Report (LaTeX, APA): [`documento/latex/main.pdf`](documento/latex/main.pdf), source in [`documento/latex/main.tex`](documento/latex/main.tex).
- Presentation: [`presentacion/presentacion.pptx`](presentacion/presentacion.pptx) and [`presentacion/presentacion.pdf`](presentacion/presentacion.pdf).
- Dashboard: [`powerbi/dashboard_olist.pbix`](powerbi/dashboard_olist.pbix).
- KNIME workflows: [`knime/`](knime/).

## Tools

- **KNIME Analytics Platform:** ETL workflows and machine learning models.
- **PostgreSQL (Docker):** relational storage for the business tables. A local PostgreSQL was chosen over Snowflake for reproducibility: anyone starts the same database with one command.
- **Power BI:** dashboard with the model results and the KPIs.
- **Git / GitHub:** version control.

Versions used: KNIME Analytics Platform 5.12, PostgreSQL 16 (`postgres:16` image), Python 3.11+ (see `analisis/requirements.txt`), Power BI Desktop and XeLaTeX with the `apa7` class.

## Workflows and results

| Workflow | Description |
| :--- | :--- |
| `01-ETL` | Reads the 9 CSV files, joins orders with customers, items, payments, reviews and seller/product data, keeps `delivered` orders within the delivery window (2017-01 to 2018-08), computes derived variables (`es_tardio`, `dias_entrega`, `dias_retraso`, `mismo_estado`, ...) and exports `knime/datos/ordenes_etl.csv` (96,144 orders, 29 columns; late deliveries = 8.07%). |
| `02-Clustering` | k-means with k = 4 (groups of 7,357 / 16,767 / 30,509 / 41,511 orders), segment profiles, overall silhouette 0.297, one-way ANOVA test of hypothesis H4 (F = 4,477.7; p < 0.001). Output: `knime/datos/segmentos_modelo1.csv` (`order_id` + `Cluster`). The table of k values (2 to 8) is computed in `analisis/pruebas_estadisticas.py`. |
| `03-Prediccion` | Predicts late delivery (`es_tardio`) at purchase time with logistic regression and Random Forest against two baselines, with a temporal split (cutoff 2018-04-01; 64,052 training and 32,092 test orders). Test AUC: logistic regression 0.719, Random Forest 0.590, baselines 0.500 and 0.472. Five-fold cross-validation of the Random Forest minimum node size (10, 20, 40, 80; AUC 0.686 to 0.688, 20 kept). Output: `knime/datos/predicciones_modelo2.csv` (test orders only). |
| `04-KPIs` | Computes the 11 KPIs (checked against `datos/resultados_kpis.txt`), joins the segment and the probabilities from the previous models, and writes `knime/datos/pedidos_kpi.csv` (96,144 orders, 18 columns) and `knime/datos/clientes_kpi.csv` (96,096 customers, 8 columns) for Power BI. |

## Repository structure

```text
mo0005-ecommerce-ml/
├── README.md, README.es.md
├── LICENSE
├── docker-compose.yml        # PostgreSQL service (olist-db)
├── cargar.sh                 # Starts the database, loads the CSVs and validates row counts
├── analisis/
│   ├── pruebas_estadisticas.py   # Calculations done in Python (table of k, hypothesis tests)
│   └── requirements.txt
├── datos/                    # schema.sql, views.sql and resultados_kpis.txt
├── diagrama-er/              # Entity-relationship diagram (.drawio and .png)
├── documento/
│   ├── capturas/             # Screenshots used in the report
│   └── latex/                # main.tex, main.pdf and compilar.py
├── knime/
│   ├── datos/                # Olist CSVs and the workflow outputs
│   ├── 01-ETL/
│   ├── 02-Clustering/
│   ├── 03-Prediccion/
│   └── 04-KPIs/
├── kpis/                     # kpis.sql (the 11 KPI queries)
├── powerbi/                  # dashboard_olist.pbix
└── presentacion/             # presentacion.pptx/.pdf and fuente/ (generation scripts)
```

KNIME does not allow relative paths outside its workspace (`knime/`), so the CSV files live in `knime/datos/`; `cargar.sh` reads them from the same folder.

## Dataset (Olist E-Commerce)

The project uses the public **Brazilian E-Commerce Public Dataset by Olist**, available on [Kaggle](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce): about 100,000 real orders placed in Brazil between 2016 and 2018. The files are versioned in `knime/datos/`, so no Kaggle download is needed.

- `olist_customers_dataset.csv`: customers and locations.
- `olist_orders_dataset.csv`: order history and shipping status.
- `olist_order_items_dataset.csv`: items per order, prices and freight.
- `olist_order_payments_dataset.csv`: payment methods and installments.
- `olist_order_reviews_dataset.csv`: customer reviews and ratings.
- `olist_products_dataset.csv`: product dimensions, weights and categories.
- `olist_sellers_dataset.csv`: sellers and regions.
- `olist_geolocation_dataset.csv`: coordinates by zip code.
- `product_category_name_translation.csv`: category names, Portuguese to English.

## Run the database

Requirements: Docker with Docker Compose.

```bash
git clone https://github.com/FerretoDev/mo0005-ecommerce-ml.git
cd mo0005-ecommerce-ml
./cargar.sh            # starts PostgreSQL, creates the schema, loads the 9 CSVs and validates row counts
./cargar.sh --kpis     # same, then runs kpis/kpis.sql and saves datos/resultados_kpis.txt
```

`cargar.sh` is idempotent: each run recreates the `olist` schema from scratch without duplicating rows, and fails if any row count does not match the expected value.

Connection settings (local use only):

| Parameter | Value |
| :--- | :--- |
| Host | `localhost` |
| Port | `5432` |
| User | `postgres` |
| Password | `postgres` |
| Database | `postgres` |
| Schema | `olist` |

The analytical tables are the views `olist.v_pedidos_base` and `olist.v_clientes`.

## Open the KNIME workflows

1. Open KNIME Analytics Platform and use the `knime/` folder as the workspace.
2. Open `01-ETL`, `02-Clustering`, `03-Prediccion` or `04-KPIs`.
3. Run all nodes (Shift+F7). The workflows read the CSV files in `knime/datos/` and write their outputs there.

`ordenes_etl.csv` is already in the repository (about 33 MB), so the ETL does not need to run before the other workflows. The workflows can also read from the PostgreSQL database using the *PostgreSQL Connector* node.

## Open the Power BI dashboard

Open `powerbi/dashboard_olist.pbix` in Power BI Desktop. It reads the CSV files that KNIME generates in `knime/datos/`. If the repository is in a different folder, update the `RutaDatos` parameter (Home, Transform data, Manage parameters). See [`powerbi/LEER.md`](powerbi/LEER.md) for the model tables and pages.

## Compile the report

Requires a LaTeX distribution with XeLaTeX and latexmk (TeX Live, MiKTeX or TinyTeX):

```bash
python documento/latex/compilar.py             # compiles main.tex and leaves main.pdf next to it
python documento/latex/compilar.py --limpiar   # removes auxiliary files first
```

## Calculations in Python

`analisis/pruebas_estadisticas.py` reproduces the calculations in the report that were done outside KNIME (table of k, stability between seeds, hypothesis tests):

```bash
pip install -r analisis/requirements.txt
python analisis/pruebas_estadisticas.py
```

# MO-0005 Project: E-commerce Customer Analytics

[![KNIME](https://img.shields.io/badge/KNIME-Analytics%20Platform-orange?logo=knime&logoColor=white)](https://www.knime.com/)
[![Power BI](https://img.shields.io/badge/Power%20BI-Dashboard-F2C811?logo=powerbi&logoColor=black)](https://powerbi.microsoft.com/)
[![Storage](https://img.shields.io/badge/Storage-PostgreSQL%20(Docker)-blue?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Dataset](https://img.shields.io/badge/Dataset-Olist%20Kaggle-20BEFF?logo=kaggle&logoColor=white)](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce)

> Spanish version: [README.es.md](README.es.md)

## Description

Course project (University of Costa Rica, MO-0005) on data analysis and machine learning for e-commerce customers, using the public Olist dataset with KNIME, PostgreSQL (Docker) and Power BI.

The goal is to practice the full data lifecycle: extracting, cleaning and joining several sources, applying segmentation and predictive models, and presenting indicators in an interactive dashboard.

**Status:** work in progress. See the table below for what is done.

## Tools

- **KNIME Analytics Platform:** main tool for ETL workflows and machine learning models. Visual nodes make each transformation of the pipeline easy to inspect.
- **PostgreSQL (Docker):** relational storage for the business tables. A local PostgreSQL was chosen over Snowflake for reproducibility: every team member starts the same database with one command.
- **Power BI:** planned visualization layer for model results and KPIs.
- **Git / GitHub:** version control for data files and visual workflows.

## Project status

| Workflow | Status |
| :--- | :--- |
| `01-ETL` | Done. Reads the 9 CSV files, joins orders with customers, items, payments, reviews and seller/product data, keeps `delivered` orders within the delivery window (2017-01 to 2018-08), computes derived variables (`es_tardio`, `dias_entrega`, `dias_retraso`, `mismo_estado`, …) and exports `knime/datos/ordenes_etl.csv` (96,144 orders, 29 columns; late deliveries = 8.07%). |
| `02-Clustering` | Done. k-means with k = 4 in KNIME (groups of 7,357 / 16,767 / 30,509 / 41,511 orders), segment profiles, overall silhouette 0.297, one-way ANOVA test of hypothesis H4 (F = 4,477.7; p < 0.001) and output `knime/datos/segmentos_modelo1.csv` (`order_id` + `Cluster`). Pending: the k = 2…8 loop in KNIME (the k table was computed in Python). |
| `03-Prediccion` | Pending. Model 2: predict late delivery (`es_tardio`) at purchase time with logistic regression and Random Forest against two baselines; temporal split (cutoff 2018-04-01). |
| `04-KPIs` | Pending. |

KNIME can read the CSV files directly (as `01-ETL` does today) or connect to the PostgreSQL database started with Docker (next section).

## Repository structure

```text
mo0005-ecommerce-ml/
├── docker-compose.yml    # PostgreSQL service (olist-db)
├── cargar.sh             # Starts the database, loads the CSVs and validates row counts
├── datos/                # SQL scripts (schema.sql, views.sql) and KPI results
├── documento/            # Notes and guides for the academic report
├── knime/                # KNIME workflows by module
│   ├── datos/            # Raw Olist CSVs and the ETL output (ordenes_etl.csv)
│   ├── 01-ETL/           # Cleaning, joins and data preparation
│   ├── 02-Clustering/    # Segmentation (unsupervised learning)
│   ├── 03-Prediccion/    # Supervised models (prediction and scoring)
│   └── 04-KPIs/          # KPI calculation and aggregation for Power BI
├── kpis/                 # kpis.sql and the definition of the 11 KPIs
└── diagrama-er/          # Entity-relationship diagram of the relational model
```

KNIME does not allow relative paths outside its workspace (`knime/`), so the CSV files live there; `cargar.sh` reads them from the same folder.

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

In KNIME use the *PostgreSQL Connector* node; in Power BI use the *PostgreSQL database* connector. The analytical tables are the views `olist.v_pedidos_base` and `olist.v_clientes`.

## Working with KNIME and Git

KNIME workflows are folders of XML and configuration files, not plain code, so Git cannot merge simultaneous edits. Rules for the team:

1. Run `git pull origin main` before opening a workflow.
2. Tell the team which workflow you are editing; **only one person edits a workflow at a time**.
3. Reset nodes holding very large tables before saving, to keep the repository small.
4. When done: save, close the workflow, make a clear commit (e.g. `feat(knime): add null filter to ETL`) and `git push origin main`.
5. Do not force-add lock files, `.metadata/` or `.docx` files; `.gitignore` already excludes them.

## Team (group MO-0005)

- Marcos Ferreto Estrada: project proposal and coordination, database, ETL and clustering
- Teammates: names to be added

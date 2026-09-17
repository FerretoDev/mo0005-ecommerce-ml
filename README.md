# Proyecto MO-0005 — Análisis de Clientes E-commerce

[![KNIME](https://img.shields.io/badge/KNIME-Analytics%20Platform-orange?logo=knime&logoColor=white)](https://www.knime.com/)
[![Power BI](https://img.shields.io/badge/Power%20BI-Dashboard-F2C811?logo=powerbi&logoColor=black)](https://powerbi.microsoft.com/)
[![Storage](https://img.shields.io/badge/Storage-Snowflake%20%2F%20PostgreSQL-blue)](https://www.snowflake.com/)
[![Dataset](https://img.shields.io/badge/Dataset-Olist%20Kaggle-20BEFF?logo=kaggle&logoColor=white)](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce)

## Descripción
Este proyecto corresponde al análisis de datos y machine learning enfocado en el comportamiento de clientes de comercio electrónico, utilizando el dataset público de Olist. Integra el procesamiento y modelado mediante flujos en KNIME Analytics Platform, almacenamiento y consultas en bases de datos (Snowflake / PostgreSQL), y visualización analítica a través de tableros interactivos en Power BI.

---

## Tecnologías y Herramientas
- **KNIME Analytics Platform:** Extracción, transformación y carga (ETL), ingeniería de características y modelado de Machine Learning (clustering y predicción).
- **Bases de Datos (Snowflake / PostgreSQL):** Repositorio relacional y consultas analíticas del modelo de datos de comercio electrónico.
- **Power BI:** Tableros gerenciales para seguimiento de KPIs de clientes, ventas y logística.
- **Git / GitHub:** Control de versiones distribuido para el código, configuraciones y flujos.

---

## Estructura del repositorio

```text
mo0005-ecommerce-ml/
├── datos/                # Datasets de Olist en CSV y fuentes de datos
├── documento/            # Documentación formal, informes técnicos y entregables
├── knime/                # Workflows y configuraciones de KNIME Analytics Platform
│   ├── 01-ETL/           # Ingesta, limpieza y preparación del dataset Olist
│   ├── 02-Clustering/    # Segmentación y agrupamiento de clientes
│   ├── 03-Prediccion/    # Modelos predictivos de comportamiento y scoring
│   └── 04-KPIs/          # Automatización del cálculo de métricas de negocio
├── kpis/                 # Métricas clave de rendimiento (KPIs), fórmulas y documentación
└── diagrama-er/          # Diagramas entidad-relación (ER) y modelo de datos relacional
```

- `/datos`: Almacenamiento de archivos de datos crudos, procesados o muestras necesarias para el proyecto.
- `/knime`: Workflows, componentes y configuraciones de análisis y modelado de KNIME Analytics Platform.
- `/documento`: Documentación formal, informes técnicos y entregables académicos del proyecto.
- `/kpis`: Métricas clave de rendimiento (KPIs), fórmulas de cálculo y documentación de negocio.
- `/diagrama-er`: Diagramas entidad-relación (ER) y especificación del modelo de datos relacional.

---

## Dataset
El proyecto utiliza el **Brazilian E-Commerce Public Dataset by Olist**, disponible en [Kaggle](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce). Contiene información de aproximadamente 100 000 órdenes (periodo 2016-2018) en múltiples marketplaces brasileños.

Los archivos base se ubican en `/datos`:
- `olist_customers_dataset.csv`: Identificadores únicos y ubicación de clientes.
- `olist_orders_dataset.csv`: Ciclo de vida de órdenes, marcas de tiempo y estados de entrega.
- `olist_order_items_dataset.csv`: Detalle de productos por orden, precios y fletes.
- `olist_order_payments_dataset.csv`: Métodos de pago, parcialidades y montos cobrados.
- `olist_order_reviews_dataset.csv`: Puntuaciones de satisfacción y reseñas de clientes.
- `olist_products_dataset.csv`: Atributos físicos y categorías de productos.
- `olist_sellers_dataset.csv`: Identificadores y ciudades de vendedores.
- `olist_geolocation_dataset.csv`: Coordenadas geográficas por código postal.
- `product_category_name_translation.csv`: Mapeo de categorías del portugués al inglés.

---

## Documentación del Proyecto
La redacción y avances del informe académico se gestionan de forma centralizada:
- [Documento del Proyecto en Microsoft Word (OneDrive)](https://6f33fa7f78ea46e2aaca-my.sharepoint.com/:w:/g/personal/marcos_ferreto_ucr_ac_cr/IQABJCkrsGImR5wmLFiIGFeeAfE5l5Db-igcNxQiegwNxAw?e=gEcaFn)

---

## Cómo trabajar con KNIME y Git

> **Cada workflow de KNIME lo edita una sola persona a la vez. Antes de abrir un workflow, correr `git pull`. No editar el mismo workflow simultáneamente entre dos personas — KNIME no resuelve conflictos de merge como el código normal.**

### Recordar
KNIME no mergea bien como el código normal: si dos personas editan el mismo workflow al mismo tiempo, Git no puede resolver el conflicto automáticamente. La regla práctica: cada modelo (clustering, predicción, limpieza) va en un workflow separado y una sola persona lo edita a la vez; antes de tocar un workflow, hacer `git pull` primero.

### Buenas prácticas de colaboración
1. **Sincronización previa:** Ejecutar siempre `git pull origin main` antes de iniciar cualquier sesión de trabajo en KNIME.
2. **Exclusividad en workflows:** Avisar al equipo antes de comenzar a editar uno de los flujos (`01-ETL`, `02-Clustering`, `03-Prediccion`, `04-KPIs`).
3. **Reset de nodos antes de guardar (Recomendado):** Restablecer nodos con tablas intermedias voluminosas para mantener el repositorio ligero y libre de caché de ejecución innecesaria.
4. **Commits atómicos y convencionales:** Utilizar mensajes descriptivos siguiendo Conventional Commits (`feat:`, `fix:`, `docs:`, `data:`, `chore:`).
5. **Respetar archivos ignorados:** No forzar la subida de temporales (`.knimeLock`), metadatos de entorno (`.metadata/`) ni documentos Word locales (`.docx`).

---

## Equipo de Trabajo (Grupo MO-0005)
- Marcos Ferreto Estrada
- *(Colaborador 2)*
- *(Colaborador 3)*
- *(Colaborador 4)*

---
name: mo0005-ecommerce-ml
description: >-
  Contexto operativo integral y guía técnica del proyecto MO-0005 (Análisis de Clientes E-commerce con Olist).
  Activar esta skill cuando se trabaje en el repositorio mo0005-ecommerce-ml, incluyendo el diseño y ejecución
  de flujos en KNIME Analytics Platform (ETL, Clustering, Predicción, KPIs), exploración y transformación
  del dataset Olist, formulación de métricas de negocio, integración con PostgreSQL/Snowflake,
  preparación de datos para Power BI o gestión de commits y colaboración con Git/GitHub.
---

# Proyecto MO-0005 — Análisis de Clientes E-commerce

Esta skill encapsula el contexto completo, la arquitectura técnica, las restricciones de colaboración y las mejores prácticas para el desarrollo del proyecto semestral del curso **MO-0005: Análisis de Algoritmos** (Universidad de Costa Rica).

---

## 🧭 Resumen y Objetivos del Proyecto

- **Tema:** Análisis de clientes y comportamiento de compra en comercio electrónico utilizando el dataset público de Olist (Brasil).
- **Equipo:** 4 estudiantes universitarios (Marcos Ferreto Estrada y compañeros).
- **Objetivos de Análisis y ML:**
  1. **ETL y Calidad de Datos (`01-ETL`):** Consolidación de tablas relacionales, manejo de valores nulos, estandarización de categorías y feature engineering.
  2. **Segmentación de Clientes (`02-Clustering`):** Aplicación de algoritmos no supervisados (ej. K-Means, modelo RFM: Recencia, Frecuencia, Valor Monetario) para agrupar clientes por patrones de consumo.
  3. **Modelado Predictivo (`03-Prediccion`):** Modelos de clasificación/regresión supervisada (predicción de probabilidad de recompra, churn o calificación de satisfacción de reseñas).
  4. **Métricas y KPIs (`04-KPIs`):** Cálculo automatizado de indicadores clave de negocio (LTV, ticket promedio, tiempos de entrega) para su consumo en Power BI.

---

## 🛠️ Stack Tecnológico

| Herramienta | Rol en el Proyecto |
| :--- | :--- |
| **KNIME Analytics Platform** | Pipeline visual de ETL, ingeniería de características, entrenamiento y evaluación de modelos ML. |
| **Snowflake / PostgreSQL** | Almacenamiento relacional, consultas SQL analíticas y persistencia del modelo ER. |
| **Power BI** | Dashboards ejecutivos e interactivos para visualización de KPIs y clústeres. |
| **Git / GitHub** | Control de versiones distribuido del repositorio `mo0005-ecommerce-ml`. |
| **OneDrive (Word)** | Documento formal escrito para evaluación académica (ignorado en Git). |

---

## 📂 Estructura del Repositorio

```text
mo0005-ecommerce-ml/
├── .agent/skills/mo0005-ecommerce-ml/  # Contexto y skill del proyecto para el asistente de IA
├── datos/                             # Datasets crudos de Olist en CSV (Kaggle)
├── documento/                         # Enlace oficial al documento en OneDrive (Word)
├── knime/                             # Workflows abiertos de KNIME Analytics Platform
│   ├── 01-ETL/                        # Ingesta, limpieza y preparación de datos
│   ├── 02-Clustering/                 # Segmentación algorítmica de clientes
│   ├── 03-Prediccion/                 # Modelos predictivos y scoring
│   └── 04-KPIs/                       # Cálculo de métricas de negocio para Power BI
├── kpis/                              # Definiciones matemáticas y lógica de KPIs
├── diagrama-er/                       # Diagrama entidad-relación y scripts de base de datos
├── .gitignore                         # Exclusiones de caché de KNIME, locks y Word
├── CLAUDE.md                          # Manual de trabajo en equipo y guía de Git
└── README.md                          # Presentación general y documentación del repositorio
```

---

## 📊 Dataset Olist y Estructura Relacional

El dataset base consta de 9 archivos CSV en `/datos`:
- `olist_customers_dataset.csv`
- `olist_orders_dataset.csv`
- `olist_order_items_dataset.csv`
- `olist_order_payments_dataset.csv`
- `olist_order_reviews_dataset.csv`
- `olist_products_dataset.csv`
- `olist_sellers_dataset.csv`
- `olist_geolocation_dataset.csv`
- `product_category_name_translation.csv`

> 📖 **Para consultar el diccionario completo de columnas, tipos y claves relacionales:**  
> Revisa la guía detallada en [dataset_schema.md](./references/dataset_schema.md).

---

## ⚠️ Reglas Críticas de Concurrencia (KNIME & Git)

1. **Exclusividad estricta:** Cada workflow de KNIME lo edita una sola persona a la vez.
2. **Sincronización:** Ejecutar `git pull origin main` antes de abrir cualquier workflow en KNIME.
3. **Reset de nodos:** Restablecer nodos ejecutados con datos pesados antes de guardar para evitar que la caché infle el historial de Git.
4. **Archivos protegidos:** El `.gitignore` bloquea `.knimeLock`, `knime/.metadata/`, `**/data/**`, `**/internal/**`, `*.knwf` y `*.docx`.

> 📖 **Para consultar el protocolo completo de prevención y resolución de conflictos:**  
> Revisa la guía detallada en [knime_git_workflow.md](./references/knime_git_workflow.md).

---

## ✍️ Estándares de Commits (Conventional Commits)

Cada commit debe ser atómico (un solo objetivo lógico) usando la convención:
- `feat(knime): ...` para nuevos modelos o flujos en KNIME.
- `fix(knime): ...` para corrección de transformaciones o joins.
- `data: ...` para adición o actualización de datasets/metadatos.
- `docs: ...` para documentación en README, guías o informes.
- `chore: ...` para mantenimiento de `.gitignore` o configuraciones.

---

## 🤖 Directrices para el Asistente de IA

Cuando ayudes en este repositorio:
1. **Respeta los flujos modulares:** No sugieras unificar los 4 workflows de KNIME en uno solo; deben mantenerse separados para permitir trabajo en equipo.
2. **Cuida el tamaño de los datos:** Evita proponer scripts o acciones que carguen archivos intermedios pesados en Git.
3. **Usa lenguaje pedagógico y riguroso:** Adapta las explicaciones a estudiantes universitarios de ciencias de la computación que dominan algoritmos pero están aprendiendo ingeniería de datos y ML.
4. **Mantén los commits atómicos:** Al generar commits, separa configuración, documentación, datos y flujos en commits independientes.

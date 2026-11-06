---
name: mo0005-ecommerce-ml
description: >-
  Contexto operativo integral y guía técnica del proyecto MO-0005 (Análisis de Clientes E-commerce con Olist).
  Activar esta skill cuando se trabaje en el repositorio mo0005-ecommerce-ml, incluyendo el diseño y ejecución
  de flujos en KNIME Analytics Platform (ETL, Clustering, Predicción, KPIs), exploración y transformación
  del dataset Olist, formulación de métricas de negocio, integración con PostgreSQL (Docker),
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
  2. **Modelo 1, segmentación (`02-Clustering`):** k-means sobre pedidos con precio, flete, cuotas, días de entrega, retraso y mismo estado (logaritmo en precio y flete, z-score); k = 4. La calificación no entra, para que H4 no sea circular. Guía: `documento/guia-modelo1-knime.md`.
  3. **Modelo 2, predicción (`03-Prediccion`):** clasificación de `es_tardio` con variables conocidas al comprar (sin fechas posteriores, sin calificación y sin mes de compra), regresión logística y Random Forest frente a dos líneas base, partición temporal con corte 2018-04-01. Guía: `documento/guia-modelo2-knime.md`.
  4. **Métricas y KPIs (`04-KPIs`):** Cálculo automatizado de indicadores clave de negocio (LTV, ticket promedio, tiempos de entrega) para su consumo en Power BI.

---

## 🛠️ Stack Tecnológico

| Herramienta | Rol en el Proyecto |
| :--- | :--- |
| **KNIME Analytics Platform** | Pipeline visual de ETL, ingeniería de características, entrenamiento y evaluación de modelos ML. |
| **PostgreSQL (Docker)** | Almacenamiento relacional, consultas SQL analíticas y persistencia del modelo ER. |
| **Power BI** | Dashboards ejecutivos e interactivos para visualización de KPIs y clústeres. |
| **Git / GitHub** | Control de versiones distribuido del repositorio `mo0005-ecommerce-ml`. |
| **OneDrive (Word)** | Documento formal escrito para evaluación académica (ignorado en Git). |

---

## 📂 Estructura del Repositorio

```text
mo0005-ecommerce-ml/
├── .agent/skills/mo0005-ecommerce-ml/  # Contexto y skill del proyecto para el asistente de IA
├── datos/                             # Scripts SQL (schema, views, kpis) y resultados de KPIs
├── documento/                         # Enlace oficial al documento en OneDrive (Word)
├── knime/                             # Workflows abiertos de KNIME Analytics Platform
│   ├── datos/                         # CSV crudos de Olist (versionados) + ordenes_etl.csv (salida del ETL, versionada)
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

El dataset base consta de 9 archivos CSV en `knime/datos/` (KNIME no permite rutas relativas fuera de `knime/`; los nodos usan `../datos/<archivo>.csv`):
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

## 🚦 Estado Actual

- **`01-ETL` (hecho, 39 nodos):** 9 CSV Reader → GroupBy por `order_id` (items, pagos, reseñas) → Joiners → Row Filter `delivered` → rama del primer ítem (sellers, products, traducción) → `mismo_estado` → fechas Date&Time → ventana de entrega 2017-01 a 2018-08 → Date&Time Difference en segundos + Math Formula `/86400` → `es_tardio` → `relacion_precio_flete`, `volumen_cm3` → Column Filter → Missing Value → CSV Writer `knime/datos/ordenes_etl.csv` (**96 144 filas, 29 columnas, `es_tardio` = 0,0807**, igual que `datos/views.sql`).
- **02-Clustering en curso:** k-means k = 4 hecho (grupos 7 357 / 16 767 / 30 509 / 41 511; salida `segmentos_modelo1.csv`); faltan la silueta y el ANOVA de H4. **Aún no hay:** `03-Prediccion`, `04-KPIs` (guías con números de referencia en `documento/guia-modelo1-knime.md` y `documento/guia-modelo2-knime.md`). La salida del ETL, `knime/datos/ordenes_etl.csv`, está versionada (~33 MB): 02 y 03 la leen directamente. Si cambia el ETL, regenerarla y subirla con `core.autocrlf=false`.
- **Trampas conocidas:** los códigos postales deben ser String; los Date&Time Difference con granularidad Day no dan decimales (medir en segundos y dividir entre 86 400); mover CSV con `core.autocrlf=false`; resetear nodos antes de guardar (el `.gitignore` ya ignora `port_*/` e `internal/`).

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

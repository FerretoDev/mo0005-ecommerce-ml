# Proyecto MO-0005 — Análisis de Clientes E-commerce

[![KNIME](https://img.shields.io/badge/KNIME-Analytics%20Platform-orange?logo=knime&logoColor=white)](https://www.knime.com/)
[![Power BI](https://img.shields.io/badge/Power%20BI-Dashboard-F2C811?logo=powerbi&logoColor=black)](https://powerbi.microsoft.com/)
[![Storage](https://img.shields.io/badge/Storage-PostgreSQL%20(Docker)-blue?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Dataset](https://img.shields.io/badge/Dataset-Olist%20Kaggle-20BEFF?logo=kaggle&logoColor=white)](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce)


## Descripción
Este proyecto corresponde al análisis de datos y machine learning sobre clientes de e-commerce (utilizando el dataset público de Olist), integrando KNIME, PostgreSQL (Docker) y Power BI. 

A través de este flujo aprendemos a abordar el ciclo completo de vida de los datos: desde la extracción, limpieza e integración de múltiples fuentes, hasta la aplicación de modelos predictivos y de segmentación algorítmica, culminando en la visualización interactiva de indicadores de negocio.

---

## Tecnologías y Herramientas

- **KNIME Analytics Platform:** Plataforma principal para diseñar flujos de ETL y entrenar modelos de Machine Learning. Al trabajar con nodos visuales en lugar de scripts desde cero, facilita ver cómo se transforman los datos paso a paso en cada etapa del pipeline.

- **Base de datos (PostgreSQL en Docker):** Permite aplicar conceptos de bases de datos relacionales para almacenar, conectar y consultar de manera eficiente las tablas del negocio. Se eligió PostgreSQL local en lugar de Snowflake por reproducibilidad: cualquier integrante levanta la misma base con un solo comando.
- **Power BI:** La herramienta para la capa final de visualización, donde se convierte los resultados de los modelos y cálculos en tableros y gráficas comprensibles para cualquier persona de negocio.
- **Git / GitHub:** Control de versiones, para colaborar de forma ordenada sobre archivos de datos y flujos visuales.

---

## Estructura del Repositorio

```text
mo0005-ecommerce-ml/
├── docker-compose.yml    # Servicio PostgreSQL (olist-db)
├── cargar.sh             # Levanta la base, carga los CSV y valida conteos
├── datos/                # Scripts SQL (schema.sql, views.sql) y resultados_kpis.txt
├── documento/            # Enlaces del informe académico (el .docx vive en OneDrive)
├── knime/                # Workflows de KNIME organizados por módulos
│   ├── datos/            # CSV crudos de Olist (los lee KNIME) y salida del ETL (ordenes_etl.csv, versionada)
│   ├── 01-ETL/           # Limpieza inicial, cruces (joins) y preparación de datos
│   ├── 02-Clustering/    # Segmentación (aprendizaje no supervisado)
│   ├── 03-Prediccion/    # Modelos supervisados (predicción y scoring)
│   └── 04-KPIs/          # Cálculo y agregación de métricas para Power BI
├── kpis/                 # kpis.sql y definición de los 11 KPI
└── diagrama-er/          # Diagrama entidad-relación del modelo relacional
```

- `/datos`: Scripts SQL del esquema y las vistas (`schema.sql`, `views.sql`) y resultados de los KPI (`resultados_kpis.txt`).
- `/knime`: Workflows, componentes y configuraciones de KNIME Analytics Platform. Incluye `knime/datos/` con los CSV crudos de Olist.
  KNIME no permite rutas relativas fuera de su workspace (`knime/`), por eso los CSV viven ahí; `cargar.sh` los lee desde esa misma carpeta.
- `/documento`: Documentación formal, informes técnicos y entregables académicos del proyecto.
- `/kpis`: Consultas SQL (`kpis.sql`), fórmulas de cálculo y documentación de los KPI.
- `/diagrama-er`: Diagramas entidad-relación (ER) y especificación del modelo de datos relacional.

---

## 📊 Dataset (Olist E-Commerce)
El proyecto utiliza el dataset público **Brazilian E-Commerce Public Dataset by Olist**, disponible en [Kaggle](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce). Contiene información real de aproximadamente 100 000 pedidos realizados entre 2016 y 2018 en Brasil.

Los archivos que componen el dataset están en `knime/datos/` (versionados en Git; no hace falta descargarlos de Kaggle):
- `olist_customers_dataset.csv`: Clientes y sus ubicaciones (ciudades/estados).
- `olist_orders_dataset.csv`: Historial de pedidos y sus estados de envío.
- `olist_order_items_dataset.csv`: Artículos dentro de cada pedido, precios y costos de flete.
- `olist_order_payments_dataset.csv`: Métodos de pago elegidos y número de cuotas.
- `olist_order_reviews_dataset.csv`: Reseñas, comentarios y calificaciones otorgadas por los clientes.
- `olist_products_dataset.csv`: Dimensiones, pesos y categorías de productos.
- `olist_sellers_dataset.csv`: Vendedores y sus regiones geográficas.
- `olist_geolocation_dataset.csv`: Coordenadas de latitud y longitud por código postal.
- `product_category_name_translation.csv`: Tabla de apoyo para traducir categorías de portugués a inglés.

---

## 🚦 Estado del Proyecto

| Workflow | Estado |
| :--- | :--- |
| `01-ETL` | Hecho: lee los 9 CSV, une pedido + cliente + items + pagos + reseñas + vendedor/producto, filtra `delivered` y la ventana de entrega (2017-01 a 2018-08), calcula las variables derivadas (`es_tardio`, `dias_entrega`, `dias_retraso`, `mismo_estado`, etc.) y exporta `knime/datos/ordenes_etl.csv` (96 144 pedidos, 29 columnas; `es_tardio` = 8,07 %). Guía en [documento/knime-carga-csv.md](documento/knime-carga-csv.md). |
| `02-Clustering` | Hecho (Marcos): k-means con k = 4 en KNIME (grupos de 7 357 / 16 767 / 30 509 / 41 511 pedidos), perfil de segmentos, silueta global 0,297, prueba de H4 con One-way ANOVA (F = 4 477,7; p < 0,001) y salida `knime/datos/segmentos_modelo1.csv` (`order_id` + `Cluster`). Falta el ciclo de k = 2 a 8 en KNIME (la tabla de k es de Python). Guía en [documento/guia-modelo1-knime.md](documento/guia-modelo1-knime.md). |
| `03-Prediccion` | Pendiente. Modelo 2: predicción de `es_tardio` al comprar, con regresión logística y Random Forest frente a dos líneas base; partición temporal (corte 2018-04-01). Guía y números de referencia en [documento/guia-modelo2-knime.md](documento/guia-modelo2-knime.md). |
| `04-KPIs` | Pendiente. |

KNIME puede leer los CSV directamente (como hace hoy el `01-ETL`) o conectarse a la base PostgreSQL que se levanta con Docker (sección siguiente).

**Para replicar el ETL:** `git pull origin main`, abrir `knime/01-ETL` en KNIME (workspace = carpeta `knime/`), ejecutar todo (Shift+F7) y se regenera `knime/datos/ordenes_etl.csv`. Para trabajar en 02 y 03 no hace falta correr el ETL: `ordenes_etl.csv` ya viene en el repo (unos 33 MB).

## 🗄️ Cómo levantar la base de datos

Requisitos: Docker con Docker Compose.

```bash
git clone https://github.com/FerretoDev/mo0005-ecommerce-ml.git
cd mo0005-ecommerce-ml
./cargar.sh            # levanta PostgreSQL, crea el esquema, carga los 9 CSV (de knime/datos/) y valida conteos
./cargar.sh --kpis     # lo anterior + ejecuta kpis/kpis.sql y guarda datos/resultados_kpis.txt
```

`cargar.sh` es idempotente: cada ejecución recrea el esquema `olist` desde cero, sin duplicar filas, y termina con error si algún conteo no coincide con lo esperado.

**Datos de conexión (KNIME y Power BI):**

| Parámetro | Valor |
| :--- | :--- |
| Host | `localhost` |
| Puerto | `5432` |
| Usuario | `postgres` |
| Contraseña | `postgres` (solo uso local) |
| Base de datos | `postgres` |
| Esquema | `olist` |

En KNIME se usa el nodo *PostgreSQL Connector* con estos datos; en Power BI, el conector *PostgreSQL database*. Las tablas analíticas están en las vistas `olist.v_pedidos_base` y `olist.v_clientes`.

---

## 📝 Documento del Proyecto
El informe formal escrito del curso se trabaja colaborativamente en OneDrive:
- [Ver Documento del Proyecto en OneDrive (Word)](https://6f33fa7f78ea46e2aaca-my.sharepoint.com/:w:/g/personal/marcos_ferreto_ucr_ac_cr/IQABJCkrsGImR5wmLFiIGFeeAfE5l5Db-igcNxQiegwNxAw?e=gEcaFn)

---

## 🤝 Cómo trabajar con KNIME y Git (¡Muy Importante!)

> **Cada workflow de KNIME lo edita una sola persona a la vez. Antes de abrir un workflow, correr `git pull`. No editar el mismo workflow simultáneamente entre dos personas — KNIME no resuelve conflictos de merge como el código normal.**

### Recordar
KNIME no mergea bien como el código normal: si dos personas editan el mismo workflow al mismo tiempo, Git no puede resolver el conflicto automáticamente. La regla práctica: cada modelo (clustering, predicción, limpieza) va en un workflow separado y una sola persona lo edita a la vez; antes de tocar un workflow, hacer `git pull` primero.

### 💡 ¿Por qué ocurre esto?
Como estamos acostumbrados a programar en lenguajes como Python, C++ o Java, Git suele resolver diferencias combinando líneas de texto. Pero **los workflows de KNIME no son código plano**: por debajo son carpetas con múltiples archivos XML y configuraciones gráficas. Si dos personas mueven nodos al mismo tiempo, Git no sabe cómo reconciliar ese XML y el workflow se puede corromper fácilmente.

### Guía rápida para no tener problemas en el equipo:
1. **Antes de empezar a trabajar:** Abre la terminal en esta carpeta y haz `git pull origin main` para tener lo último que subieron los compañeros.
2. **Avisar por el chat del grupo:** Escribe al grupo diciendo cuál workflow vas a abrir (por ejemplo: *"Voy a trabajar en `01-ETL`"*), para que nadie más lo toque al mismo tiempo.
3. **Resetear nodos antes de guardar:** En KNIME, haz clic derecho y selecciona *Reset* en los nodos con tablas muy grandes si no es indispensable guardarlos ejecutados. Esto evita que el repositorio se vuelva pesado e infle el historial de Git.
4. **Al terminar tu parte:** Guarda en KNIME, cierra el workflow, haz tu commit con un mensaje claro (por ejemplo `feat(knime): agregar filtro de valores nulos en ETL`) y corre `git push origin main`.
5. **No forzar archivos temporales:** El `.gitignore` ya está configurado para excluir archivos de bloqueo (`.knimeLock`), memorias temporales (`.metadata/`) y documentos de Word (`.docx`). No uses `git add -f` para forzarlos.
6. **Guía de commits y comandos:** Consulta [CLAUDE.md](CLAUDE.md) para ver la guía completa de commits atómicos, tipos de cambios y comandos frecuentes de Git.

---

## Equipo de Trabajo (Grupo MO-0005)
- Marcos Ferreto Estrada
- *(Compañero 2)*
- *(Compañero 3)*
- *(Compañero 4)*



# Recordar usar 

git pull   Es para traer los cambios (esto es lo primero que deben hacer antes de inicial)

git push  Esto es para enviar los cambios (esto es lo ultimo que deben de hacer al terminal)
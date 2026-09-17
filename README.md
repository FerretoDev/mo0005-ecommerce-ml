# Proyecto MO-0005 — Análisis de Clientes E-commerce

[![KNIME](https://img.shields.io/badge/KNIME-Analytics%20Platform-orange?logo=knime&logoColor=white)](https://www.knime.com/)
[![Power BI](https://img.shields.io/badge/Power%20BI-Dashboard-F2C811?logo=powerbi&logoColor=black)](https://powerbi.microsoft.com/)
[![Storage](https://img.shields.io/badge/Storage-Snowflake%20%2F%20PostgreSQL-blue)](https://www.snowflake.com/)
[![Dataset](https://img.shields.io/badge/Dataset-Olist%20Kaggle-20BEFF?logo=kaggle&logoColor=white)](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce)


## Descripción
Este proyecto corresponde al análisis de datos y machine learning sobre clientes de e-commerce (utilizando el dataset público de Olist), integrando KNIME, Snowflake / PostgreSQL y Power BI. 

A través de este flujo aprendemos a abordar el ciclo completo de vida de los datos: desde la extracción, limpieza e integración de múltiples fuentes, hasta la aplicación de modelos predictivos y de segmentación algorítmica, culminando en la visualización interactiva de indicadores de negocio.

---

## Tecnologías y Herramientas

- **KNIME Analytics Platform:** Plataforma principal para diseñar flujos de ETL y entrenar modelos de Machine Learning. Al trabajar con nodos visuales en lugar de scripts desde cero, facilita ver cómo se transforman los datos paso a paso en cada etapa del pipeline.

- **Bases de Datos (Snowflake / PostgreSQL):** Permite aplicar conceptos de bases de datos relacionales para almacenar, conectar y consultar de manera eficiente las tablas del negocio.
- **Power BI:** La herramienta para la capa final de visualización, donde se convierte los resultados de los modelos y cálculos en tableros y gráficas comprensibles para cualquier persona de negocio.
- **Git / GitHub:** Control de versiones, para colaborar de forma ordenada sobre archivos de datos y flujos visuales.

---

## Estructura del Repositorio

```text
mo0005-ecommerce-ml/
├── datos/                # Archivos CSV crudos de Olist y documentación del origen
├── documento/            # Enlaces y entregables del informe académico escrito
├── knime/                # Workflows de KNIME organizados por módulos
│   ├── 01-ETL/           # Limpieza inicial, cruces (joins) y preparación de datos
│   ├── 02-Clustering/    # Modelos de segmentación de clientes (aprendizaje no supervisado)
│   ├── 03-Prediccion/    # Modelos supervisados (predicción de comportamiento y scoring)
│   └── 04-KPIs/          # Cálculo y agregación de métricas para Power BI
├── kpis/                 # Definición de fórmulas, lógica y documentación de los KPIs
└── diagrama-er/          # Diagramas entidad-relación del modelo relacional
```

- `/datos`: Almacenamiento de archivos de datos crudos, procesados o muestras necesarias para el proyecto.
- `/knime`: Workflows, componentes y configuraciones de análisis y modelado de KNIME Analytics Platform.
- `/documento`: Documentación formal, informes técnicos y entregables académicos del proyecto.
- `/kpis`: Métricas clave de rendimiento (KPIs), fórmulas de cálculo y documentación de negocio.
- `/diagrama-er`: Diagramas entidad-relación (ER) y especificación del modelo de datos relacional.

---

## 📊 Dataset (Olist E-Commerce)
El proyecto utiliza el dataset público **Brazilian E-Commerce Public Dataset by Olist**, disponible en [Kaggle](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce). Contiene información real de aproximadamente 100 000 pedidos realizados entre 2016 y 2018 en Brasil.

Los archivos que componen el dataset están en `/datos`:
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

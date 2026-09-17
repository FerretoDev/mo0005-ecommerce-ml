# Proyecto MO-0005 — Análisis de Clientes E-commerce

## Descripción
Este proyecto corresponde al análisis de datos y machine learning enfocado en el comportamiento de clientes de comercio electrónico, utilizando el dataset público de Olist. Integra el procesamiento y modelado mediante flujos en KNIME Analytics Platform, almacenamiento y consultas en bases de datos (Snowflake / PostgreSQL), y visualización analítica a través de tableros en Power BI.

## Estructura del repositorio
- `/datos`: Almacenamiento de archivos de datos crudos, procesados o muestras necesarias para el proyecto.
- `/knime`: Workflows, componentes y configuraciones de análisis y modelado de KNIME Analytics Platform.
- `/documento`: Documentación formal, informes técnicos y entregables académicos del proyecto.
- `/kpis`: Métricas clave de rendimiento (KPIs), fórmulas de cálculo y documentación de negocio.
- `/diagrama-er`: Diagramas entidad-relación (ER) y especificación del modelo de datos relacional.

## Cómo trabajar con KNIME y Git
**Cada workflow de KNIME lo edita una sola persona a la vez. Antes de abrir un workflow, correr `git pull`. No editar el mismo workflow simultáneamente entre dos personas — KNIME no resuelve conflictos de merge como el código normal.**

## Recordar
KNIME no mergea bien como el código normal: si dos personas editan el mismo workflow al mismo tiempo, Git no puede resolver el conflicto automáticamente. La regla práctica: cada modelo (clustering, predicción, limpieza) va en un workflow separado y una sola persona lo edita a la vez; antes de tocar un workflow, hacer `git pull` primero.
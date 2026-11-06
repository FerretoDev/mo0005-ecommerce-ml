# Carpeta /datos

Aquí viven los **scripts SQL** y sus resultados (para cuando se monte PostgreSQL):

- `schema.sql`: estructura de tablas del esquema `olist`.
- `views.sql`: vistas analíticas (`v_pedidos_base` a nivel de pedido y una vista por cliente).
- `resultados_kpis.txt`: salida de ejecutar `views.sql` y `kpis/kpis.sql` (las consultas de los KPI están en `/kpis`).

## Dónde están los CSV
Los CSV de Olist están en **`knime/datos/`** (KNIME no permite rutas relativas fuera de `knime/`).
El origen es el Brazilian E-Commerce Public Dataset by Olist en Kaggle:

https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce

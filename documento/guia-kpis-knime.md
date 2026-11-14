# Guía de los KPI en KNIME: workflow `04-KPIs`

Workflow: `knime/04-KPIs` (30 nodos, generado a mano; falta probarlo en KNIME). Entradas: `knime/datos/ordenes_etl.csv` (96 144 pedidos entregados), `olist_orders_dataset.csv` y `olist_customers_dataset.csv`. No usa PostgreSQL: reproduce en KNIME los 11 KPI de `kpis/kpis.sql` y deja dos tablas para Power BI.

Salidas versionadas: `knime/datos/pedidos_kpi.csv` (una fila por pedido, equivale a `v_pedidos_base`) y `knime/datos/clientes_kpi.csv` (una fila por cliente, equivale a `v_clientes`).

## 1. Rama de pedidos (KPI 1 a 4, 6 a 8)

| # | Nodo | Qué hace |
| --- | --- | --- |
| 1 | CSV Reader | Lee `ordenes_etl.csv`. |
| 2 | Rule Engine | `resena_negativa`: 1 si `review_promedio` ≤ 2, 0 si es mayor; vacío si no hay reseña. |
| 3 | Rule Engine | `banda_retraso`: a tiempo, 1 a 3, 4 a 7 y más de 7 días. |
| 4, 5 | Column Filter + CSV Writer | Dejan 14 columnas y escriben `pedidos_kpi.csv`. |
| 6 | GroupBy (global) | Conteo, promedio de `es_tardio` (KPI 1), `dias_entrega` (KPI 2), `review_promedio` (KPI 6) y `resena_negativa` (KPI 7). |
| 7 | GroupBy por `es_tardio` | Conteo, retraso promedio (KPI 3: fila `es_tardio` = 1), calificación y % negativas (KPI 8). |
| 8 | GroupBy por `mismo_estado` | Conteo y días de entrega (KPI 4). |
| 9 | GroupBy por `customer_state` | % de tardías por estado (exploración). |
| 10 | GroupBy por `banda_retraso` | % de reseñas negativas por retraso (exploración). |

## 2. Rama de clientes (KPI 5, 9, 10 y 11)

| # | Nodo | Qué hace |
| --- | --- | --- |
| 11, 12 | CSV Reader | Pedidos (todos los estados, 99 441) y clientes. |
| 13 | Joiner | Une pedidos con clientes por `customer_id` y trae `customer_unique_id`. |
| 14, 15 | Column Filter + Joiner | Trae `es_tardio` y `review_promedio` de `ordenes_etl` por `order_id` (unión izquierda). |
| 16 | Sorter | Ordena por cliente, fecha de compra y pedido, para que el primer pedido quede primero. |
| 17 | GroupBy por `customer_unique_id` | Cuenta pedidos y toma el **primer** valor de `es_tardio`, `review_promedio` y fecha, **incluyendo vacíos** (si el primer pedido no se entregó, queda vacío, igual que en `v_clientes`). |
| 18 | Column Renamer | `total_pedidos`, `primer_pedido_tardio`, `primer_review`, `primer_fecha`. |
| 19 a 21 | Rule Engine (3) | `recompra` (más de un pedido), `primer_en_2017` y `primer_pedido_negativo`. |
| 22, 23 | Column Filter + CSV Writer | Escriben `clientes_kpi.csv`. |
| 24 | GroupBy | KPI 9: clientes y tasa de recompra. |
| 25, 26 | Row Filter + GroupBy | KPI 10: primer pedido en 2017 con puntualidad conocida, agrupado por `primer_pedido_tardio`. |
| 27, 28 | Row Filter + GroupBy | KPI 11: igual, agrupado por `primer_pedido_negativo`. |
| 29, 30 | Rule Engine + GroupBy | KPI 5: `no_concretado` (canceled o unavailable) sobre todos los pedidos. |

## 3. Valores que deben salir

Son los de `datos/resultados_kpis.txt` (PostgreSQL). Los promedios de KNIME salen como proporción (0.0807 = 8.07 %).

| KPI | Nodo | Valor esperado |
| --- | --- | --- |
| 1 % de tardías | 6 | 0.0807 (8.07 %) |
| 2 Días de entrega | 6 | 12.5 |
| 3 Retraso de las tardías | 7, fila 1 | 9.4 |
| 4 Entrega por estados | 8 | 15.1 (distintos, 61 541 pedidos) y 7.9 (mismo, 34 603) |
| 5 No concretados | 30 | 0.0124 (1.24 %) sobre 99 441 pedidos |
| 6 Calificación | 6 | 4.16 |
| 7 % negativas | 6 | 0.1273 (12.73 %) |
| 8 Brecha de calificación | 7 | 4.30 (87 902 a tiempo) y 2.57 (7 600 tardíos); negativas 9.2 % y 53.9 % |
| 9 Recompra | 24 | 96 096 clientes; 0.0312 (3.12 %) |
| 10 Recompra por puntualidad | 26 | 39 283 clientes a tiempo: 0.0434; 2 793 tardíos: 0.0294 |
| 11 Recompra por reseña | 28 | 36 716 no negativa: 0.0432; 5 045 negativa: 0.0371 |

## 4. Si algún nodo sale en rojo

- **GroupBy sin columna de grupo** (6, 24 y 30): si KNIME se queja, ábrelo, deja la lista de grupo vacía y revisa las agregaciones.
- **GroupBy 17:** los nombres de salida deben ser `Count(order_id)`, `First(es_tardio)`, `First(review_promedio)` y `First(order_purchase_timestamp)`; el Column Renamer (18) depende de ellos.
- **Sorter (16):** tres columnas en orden ascendente.
- **Rule Engine y Row Filter:** el mensaje está en `knime/.metadata/knime/knime.log`.
- Las CSV de `knime/datos/` se versionan con `git -c core.autocrlf=false add`, y antes de guardar se hace *Reset* (F8).

## 5. Cómo quedó en KNIME

El workflow se ejecutó completo y escribió `knime/datos/pedidos_kpi.csv` (96 144 filas, 14 columnas, unos 16 MB) y `knime/datos/clientes_kpi.csv` (96 096 filas, 8 columnas, unos 7 MB).

**Resultados frente a PostgreSQL**

| KPI | KNIME | PostgreSQL |
| --- | --- | --- |
| 1, 2, 6, 7 | 0.081 / 12.519 / 4.158 / 0.127 | 8.07 % / 12.5 / 4.16 / 12.73 % |
| 3 y 8 | retraso 9.422; calificación 4.295 y 2.57; negativas 0.092 y 0.539 | 9.4; 4.30 y 2.57; 9.2 % y 53.9 % |
| 4 | 15.108 (61 541) y 7.915 (34 603) | 15.1 y 7.9 |
| 9 | 96 096 clientes; 3.12 % | 96 096; 3.12 % |
| 10 | 4.34 % (39 283) y 2.97 % (2 794) | 4.34 % y 2.94 % (2 793) |
| 11 | 4.32 % (36 716) y 3.73 % (5 046) | 4.32 % y 3.71 % (5 045) |

En los KPI 10 y 11, KNIME cuenta **un cliente más** en el grupo tardío o negativo (2 794 frente a 2 793, y 5 046 frente a 5 045), lo que mueve el porcentaje unas centésimas. Es una diferencia de un solo cliente, probablemente por el desempate del primer pedido (dos pedidos del mismo cliente en el mismo instante) o por el orden de las cadenas; no cambia ninguna conclusión. Los conteos de pedidos por grupo de los KPI 3 y 8 también salen mayores en KNIME (88 381 y 7 763) porque cuentan los pedidos sin reseña; los promedios sí coinciden.

**Problemas que aparecieron al armarlo**
- **Segundo Joiner:** la configuración de columnas copiada del Modelo 1 solo dejaba pasar `order_id` y `Cluster`. Hay que incluir en la tabla derecha `es_tardio` y `review_promedio`; sin eso el GroupBy por cliente salía con tres columnas.
- **Nombre del conteo:** el GroupBy lo llama `Count*(order_id)` (con asterisco), y el Column Renamer debe usar ese nombre exacto.
- **GroupBy sin columna de grupo:** el diálogo pide guardar la configuración la primera vez que se abre; la configuración está bien.

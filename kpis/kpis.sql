-- kpis.sql: valores de los 11 KPI (poblacion indicada en cada caso)

SET search_path TO olist;

-- KPI 1. % de entregas tardias (v_pedidos_base)
SELECT ROUND(100.0 * AVG(es_tardio), 2) AS pct_tardias FROM v_pedidos_base;

-- KPI 2. Tiempo promedio de entrega (dias)
SELECT ROUND(AVG(dias_entrega), 1) AS dias_entrega_prom FROM v_pedidos_base;

-- KPI 3. Retraso promedio de las entregas tardias (dias)
SELECT ROUND(AVG(dias_retraso), 1) AS retraso_prom
FROM v_pedidos_base WHERE es_tardio = 1;

-- KPI 4. Brecha de entrega entre estados
SELECT mismo_estado,
       COUNT(*) AS pedidos,
       ROUND(AVG(dias_entrega), 1) AS dias_entrega_prom
FROM v_pedidos_base GROUP BY mismo_estado ORDER BY mismo_estado;

-- KPI 5. Tasa de pedidos no concretados (todos los pedidos)
SELECT ROUND(100.0 * AVG(CASE WHEN order_status IN ('canceled', 'unavailable')
                              THEN 1 ELSE 0 END), 2) AS pct_no_concretados
FROM orders;

-- KPI 6. Calificacion promedio
SELECT ROUND(AVG(review_score_pedido), 2) AS calificacion_prom
FROM v_pedidos_base WHERE review_score_pedido IS NOT NULL;

-- KPI 7. % de resenas negativas (1 o 2)
SELECT ROUND(100.0 * AVG(CASE WHEN review_score_pedido <= 2 THEN 1 ELSE 0 END), 2) AS pct_negativas
FROM v_pedidos_base WHERE review_score_pedido IS NOT NULL;

-- KPI 8. Brecha de calificacion por puntualidad
SELECT es_tardio,
       COUNT(*) AS pedidos,
       ROUND(AVG(review_score_pedido), 2) AS calificacion_prom,
       ROUND(100.0 * AVG(CASE WHEN review_score_pedido <= 2 THEN 1 ELSE 0 END), 1) AS pct_negativas
FROM v_pedidos_base WHERE review_score_pedido IS NOT NULL
GROUP BY es_tardio ORDER BY es_tardio;

-- KPI 9. Tasa de nueva compra (todos los clientes unicos)
SELECT COUNT(*) AS clientes,
       ROUND(100.0 * AVG(CASE WHEN total_pedidos > 1 THEN 1 ELSE 0 END), 2) AS pct_recompra
FROM v_clientes;

-- KPI 10. Recompra segun puntualidad del primer pedido (primer pedido en 2017)
SELECT primer_pedido_tardio,
       COUNT(*) AS clientes,
       ROUND(100.0 * AVG(CASE WHEN total_pedidos > 1 THEN 1 ELSE 0 END), 2) AS pct_recompra
FROM v_clientes
WHERE anio_primer_pedido = 2017 AND primer_pedido_tardio IS NOT NULL
GROUP BY primer_pedido_tardio ORDER BY primer_pedido_tardio;

-- KPI 11. Recompra segun la calificacion del primer pedido (primer pedido en 2017)
SELECT primer_pedido_negativo,
       COUNT(*) AS clientes,
       ROUND(100.0 * AVG(CASE WHEN total_pedidos > 1 THEN 1 ELSE 0 END), 2) AS pct_recompra
FROM v_clientes
WHERE anio_primer_pedido = 2017 AND primer_pedido_negativo IS NOT NULL
GROUP BY primer_pedido_negativo ORDER BY primer_pedido_negativo;

-- Exploracion: % de tardias por estado del cliente
SELECT customer_state, COUNT(*) AS pedidos,
       ROUND(100.0 * AVG(es_tardio), 1) AS pct_tardias
FROM v_pedidos_base GROUP BY customer_state ORDER BY pct_tardias DESC;

-- Exploracion: % de resenas negativas segun dias de retraso
SELECT CASE WHEN es_tardio = 0 THEN 'a tiempo'
            WHEN CEIL(dias_retraso) <= 3 THEN '1 a 3 dias'
            WHEN CEIL(dias_retraso) <= 7 THEN '4 a 7 dias'
            ELSE 'mas de 7 dias' END AS retraso,
       COUNT(*) AS pedidos,
       ROUND(100.0 * AVG(CASE WHEN review_score_pedido <= 2 THEN 1 ELSE 0 END), 1) AS pct_negativas
FROM v_pedidos_base WHERE review_score_pedido IS NOT NULL
GROUP BY 1 ORDER BY 1;

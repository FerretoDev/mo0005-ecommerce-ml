-- views.sql: dataset analitico a nivel de pedido y de cliente

-- Poblacion base: pedidos entregados con fecha de entrega
-- entre enero de 2017 y agosto de 2018.
-- dias_retraso es negativo si el pedido llego antes de lo estimado.
CREATE OR REPLACE VIEW v_pedidos_base AS
WITH items AS (
  SELECT order_id,
         COUNT(*)           AS num_items,
         SUM(price)         AS valor_items,
         SUM(freight_value) AS flete_total
  FROM order_items GROUP BY order_id
), primer_item AS (   -- vendedor y producto de referencia: primer item
  SELECT order_id, product_id, seller_id
  FROM order_items WHERE order_item_id = 1
), pago AS (
  SELECT order_id,
         MAX(payment_installments) AS cuotas,
         SUM(payment_value)        AS valor_pagado
  FROM order_payments GROUP BY order_id
), resena AS (        -- una calificacion por pedido (promedio)
  SELECT order_id, ROUND(AVG(review_score), 2) AS review_score_pedido
  FROM order_reviews GROUP BY order_id
)
SELECT o.order_id,
       c.customer_unique_id,
       c.customer_state,
       s.seller_state,
       o.order_purchase_timestamp,
       o.order_delivered_customer_date,
       o.order_estimated_delivery_date,
       EXTRACT(EPOCH FROM (o.order_delivered_customer_date - o.order_purchase_timestamp)) / 86400.0 AS dias_entrega,
       EXTRACT(EPOCH FROM (o.order_estimated_delivery_date - o.order_purchase_timestamp)) / 86400.0 AS plazo_estimado_dias,
       EXTRACT(EPOCH FROM (o.order_delivered_customer_date - o.order_estimated_delivery_date)) / 86400.0 AS dias_retraso,
       CAST(o.order_delivered_customer_date > o.order_estimated_delivery_date AS INTEGER) AS es_tardio,
       CAST(c.customer_state = s.seller_state AS INTEGER) AS mismo_estado,
       i.num_items,
       i.valor_items,
       i.flete_total,
       i.flete_total / NULLIF(i.valor_items, 0) AS relacion_precio_flete,
       pg.cuotas,
       pg.valor_pagado,
       p.product_weight_g AS peso_g,
       p.product_length_cm * p.product_height_cm * p.product_width_cm AS volumen_cm3,
       COALESCE(t.product_category_name_english, 'desconocida') AS categoria,
       r.review_score_pedido
FROM orders o
JOIN customers c        ON c.customer_id = o.customer_id
LEFT JOIN items i       ON i.order_id = o.order_id
LEFT JOIN primer_item f ON f.order_id = o.order_id
LEFT JOIN sellers s     ON s.seller_id = f.seller_id
LEFT JOIN products p    ON p.product_id = f.product_id
LEFT JOIN product_category_name_translation t ON t.product_category_name = p.product_category_name
LEFT JOIN pago pg       ON pg.order_id = o.order_id
LEFT JOIN resena r      ON r.order_id = o.order_id
WHERE o.order_status = 'delivered'
  AND o.order_delivered_customer_date >= '2017-01-01'
  AND o.order_delivered_customer_date <  '2018-09-01';

-- Un registro por cliente: caracteristicas de su PRIMER pedido y
-- cantidad total de pedidos (todos los estados).
CREATE OR REPLACE VIEW v_clientes AS
WITH pedidos AS (
  SELECT c.customer_unique_id,
         o.order_id,
         o.order_purchase_timestamp,
         b.es_tardio,
         b.review_score_pedido,
         ROW_NUMBER() OVER (PARTITION BY c.customer_unique_id
                            ORDER BY o.order_purchase_timestamp, o.order_id) AS n_pedido,
         COUNT(*) OVER (PARTITION BY c.customer_unique_id) AS total_pedidos
  FROM orders o
  JOIN customers c ON c.customer_id = o.customer_id
  LEFT JOIN v_pedidos_base b ON b.order_id = o.order_id
)
SELECT customer_unique_id,
       total_pedidos,
       EXTRACT(YEAR FROM order_purchase_timestamp) AS anio_primer_pedido,
       es_tardio AS primer_pedido_tardio,
       CASE WHEN review_score_pedido IS NULL THEN NULL
            WHEN review_score_pedido <= 2 THEN 1 ELSE 0 END AS primer_pedido_negativo
FROM pedidos
WHERE n_pedido = 1;

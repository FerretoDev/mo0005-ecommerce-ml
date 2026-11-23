# Carpeta /powerbi

`dashboard_olist.pbix` es el dashboard del proyecto (sección 4.3 de la plantilla). Lee los CSV que genera KNIME en `knime/datos/`; no usa PostgreSQL.

## Antes de abrirlo en otra computadora

La ruta de los CSV está en el parámetro `RutaDatos`. Si el repositorio está en otra carpeta:

1. Inicio → Transformar datos → Administrar parámetros → `RutaDatos`.
2. Escribir la ruta de `knime/datos/` en esa computadora, terminada en `\`.
3. Cerrar y aplicar, y luego Inicio → Actualizar.

## Tablas del modelo

| Tabla | Archivo | Uso |
| --- | --- | --- |
| Pedidos | `pedidos_kpi.csv` (96 144 filas) | KPI 1 a 4 y 6 a 8, segmento del Modelo 1 y probabilidades del Modelo 2. En Power Query se agregan `mes_compra` y `nivel_riesgo` (percentiles 75 y 90 de `prob_tardio_logistica` sobre los pedidos con `en_prueba` = 1). |
| Clientes | `clientes_kpi.csv` (96 096 filas) | KPI 9 a 11. |
| PedidosTodos | `olist_orders_dataset.csv` (99 441 filas) | KPI 5 (pedidos cancelados o no disponibles). |
| Segmentos | `segmentos_modelo1.csv` | Quedó de la primera versión, relacionada con Pedidos por `order_id`. La página 5 ya usa la columna `segmento` de Pedidos. |

En Pedidos hay además tres columnas calculadas para la página 3: `Puntualidad` ("A tiempo" o "Tardío" según `es_tardio`), `Retraso` (los tramos de `banda_retraso` con tildes) y `OrdenRetraso` (0 a 3), que fija el orden de `Retraso` de "A tiempo" a "Más de 7 días".

Las medidas DAX son las del Anexo C de la plantilla. Se verificaron con una consulta DAX contra los valores de KNIME (sección 4.2) y coinciden.

## Páginas

1. Resumen: KPI 1, 2, 6 y 9, línea mensual de tardías y calificación, filtro por estado.
2. Entregas: KPI 1 a 5, tardías por estado, tiempo de entrega por mismo estado y pedidos por tramo de retraso.
3. Satisfacción: KPI 6 a 8, calificación de puntuales y tardíos, reseñas negativas por tramo de retraso.
4. Fidelización: KPI 9 a 11.
5. Perfiles y riesgo: tabla de segmentos y % de tardías por nivel de riesgo (solo pedidos de prueba).

El archivo pesa unos 17 MB porque guarda los datos importados.

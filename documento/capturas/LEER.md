# Capturas de la ejecución en KNIME

Evidencia de que los workflows corrieron y de que los resultados coinciden con la referencia. Cada archivo indica el valor que muestra.

## Modelo 2 (`modelo2/`, workflow 03-Prediccion)
| Archivo | Muestra |
| --- | --- |
| `workflow-03-prediccion-completo` | Workflow `03-Prediccion` completo y ejecutado: lectura, partición temporal, preparación, Random Forest y regresión logística, líneas base, Scorer, ROC Curve, validación cruzada del Random Forest y exportación de predicciones. El triángulo de la regresión logística es el aviso de convergencia. |
| `scorer-*-matriz` y `scorer-*-estadisticas` | Matriz de confusión y estadísticas por clase (precisión, sensibilidad, F1) de la Base 1, la Base 2, el Random Forest y la regresión logística, sobre la prueba (32 092 pedidos). |
| `roc-random-forest-auc-0590` | Curva ROC del Random Forest, AUC 0.590. |
| `roc-regresion-logistica-auc-0719` | Curva ROC de la regresión logística, AUC 0.719. |
| `roc-base2-auc-0472` | Curva ROC de la línea base 2, AUC 0.472. |
| `random-forest-estadisticas-de-atributos` | Salida *Attribute Statistics* del Random Forest Learner del modelo final (13 variables; las 13 filas suman 200 divisiones en la raíz, una por árbol). Los nombres salen cortados en la imagen: ver la tabla de abajo. |
| `cv-nodo-10/20/40/80-*` | AUC de la validación cruzada de 5 particiones del Random Forest con tamaño mínimo de nodo 10, 20, 40 y 80. |

### Variables más usadas por el Random Forest (primera división, 200 árboles)

Los nombres completos se dedujeron del orden de las columnas del modelo (la imagen los muestra cortados); coinciden con los prefijos visibles. Conviene volver a capturar la tabla con la columna *RowID* ensanchada.

| Variable | Divisiones en la raíz | Divisiones en el nivel 1 |
| --- | ---: | ---: |
| customer_state | 47 | 225 |
| total_flete | 46 | 234 |
| mismo_estado | 28 | 67 |
| product_category_name_english | 24 | 306 |
| plazo_estimado_dias | 19 | 272 |
| seller_state | 12 | 293 |
| total_precio | 7 | 147 |
| product_weight_g | 7 | 153 |
| volumen_cm3 | 7 | 132 |
| relacion_precio_flete | 3 | 123 |
| num_items | 0 | 15 |
| max_cuotas | 0 | 77 |
| dia_semana | 0 | 69 |

Es una aproximación a la importancia (frecuencia con que cada variable se usa en las primeras divisiones), no un valor de importancia como el de scikit-learn. Las variables con muchas categorías (estado, categoría de producto) tienden a salir arriba con el criterio Gini.

## KPI (`kpis/`, workflow 04-KPIs)
| Archivo | Muestra |
| --- | --- |
| `workflow-04-kpis-completo` | Workflow `04-KPIs` completo y ejecutado: rama de pedidos (KPI 1 a 4 y 6 a 8, con la unión de segmentos y predicciones que genera `pedidos_kpi.csv`) y rama de clientes (KPI 5, 9, 10 y 11, que genera `clientes_kpi.csv`). |
| `kpi-1-2-6-7-global` | % de tardías, días de entrega, calificación y % de reseñas negativas (96 144 pedidos). |
| `kpi-3-8-por-es-tardio` | Retraso promedio de las tardías y brecha de calificación por puntualidad. |
| `kpi-4-por-mismo-estado` | Días de entrega con el mismo estado y con estados distintos. |
| `tardias-por-estado` | % de entregas tardías por estado del cliente. |
| `resena-negativa-por-banda-de-retraso` | % de reseñas negativas según los días de retraso. |
| `kpi-9-recompra` | Tasa de nueva compra: 96 096 clientes únicos; recompra 0.031 (3.12 %). |
| `kpi-10-recompra-por-puntualidad` | Recompra según la puntualidad del primer pedido (clientes con primer pedido en 2017): 39 283 a tiempo, recompra 0.043; 2 794 tardíos, 0.030 (2.97 % con más decimales). |
| `kpi-11-recompra-por-resena` | Recompra según la reseña del primer pedido (clientes con primer pedido en 2017 y reseña): 36 716 sin reseña negativa, recompra 0.043; 5 046 con reseña negativa, 0.037 (3.73 % con más decimales). |
| `kpi-5-no-concretados` | Pedidos no concretados sobre los 99 441 pedidos. |
| `pedidos-kpi-tabla-de-salida` | Tabla que se escribe en `pedidos_kpi.csv` (96 144 filas, 14 columnas). |

## Dashboard (`dashboard/`, Power BI)
| Archivo | Muestra |
| --- | --- |
| `pagina-1-resumen` | Página 1: KPI 1, 2, 6 y 9 (8.07 %, 4.16, 12.5 días y 3.12 %), línea mensual de tardías y calificación, y filtro por estado. |
| `pagina-1-filtro-estado` | La misma página filtrada por Alagoas (AL): 23.80 % de tardías, calificación 3.86 y 24.4 días de entrega. La recompra no cambia porque la tabla de clientes no tiene el estado. |
| `pagina-2-entregas` | Página 2: KPI 1 a 5, tardías por estado, tiempo de entrega por mismo estado y pedidos por tramo de retraso. |
| `pagina-3-satisfaccion` | Página 3: KPI 6 a 8 (4.16, 4.30, 2.57, brecha 1.72, 12.73 %), calificación de puntuales y tardíos, reseñas negativas por tramo de retraso. |
| `pagina-4-fidelizacion` | Página 4: clientes únicos, recompra 3.12 % y KPI 10 y 11 (4.34 %, 2.97 %, 4.32 % y 3.73 %). |
| `pagina-5-perfiles-riesgo` | Página 5: tabla de segmentos y % de tardías por nivel de riesgo (13.33 %, 11.30 % y 3.76 %), con la leyenda. |
| `modelo-de-datos` | Vista de modelo: tablas Pedidos, Clientes, PedidosTodos y Segmentos. |
| `verificacion-dax-riesgo` | Consulta DAX de control: pedidos, % de tardías y probabilidad promedio por nivel de riesgo (3 210, 4 813 y 24 069 pedidos de prueba). |
| `verificacion-dax-segmentos` | Consulta DAX de control por segmento: coincide con la tabla 3.4.2 (7 357 pedidos y 77.42 % de tardías en entregas problemáticas). |

## 01-ETL (`etl/`)
| Archivo | Muestra |
| --- | --- |
| `workflow-01-etl-completo` | Workflow `01-ETL` completo y ejecutado, con sus 40 nodos en verde: nueve CSV Reader, agregaciones y uniones, rama del primer ítem, variables derivadas, filtros, Missing Value, Date&Time to String, Statistics y CSV Writer. |
| `tabla-final-96144-filas` | Salida del Missing Value: **96 144 filas y 29 columnas**, con los códigos postales como texto (`28013`) y la configuración del nodo (`product_category_name_english` → `desconocida`). |
| `statistics-tabla-de-estadisticas` | Salida del nodo Statistics: mínimo, máximo, media y valores ausentes de las variables numéricas (642 sin reseña, 16 en peso y medidas). |

## Modelo 1 (`modelo1/`, workflow 02-Clustering)
| Archivo | Muestra |
| --- | --- |
| `workflow-02-clustering-completo` | Workflow `02-Clustering` completo y ejecutado, con sus 14 nodos en verde. El CSV Writer tiene el icono rojo propio de los nodos de escritura; no es un error. |
| `groupby-perfil-por-grupo` | Salida del GroupBy: los cuatro grupos con **41 511 / 7 357 / 30 509 / 16 767** pedidos y su mediana de precio, días de entrega, % de entregas tardías y calificación. |
| `anova-h4-f-4477` | One-way ANOVA de `review_promedio` por grupo (H4): F = 4 477.682, 3 y 95 498 grados de libertad, p ≈ 0. |
| `silueta-k4-0297` | Silhouette Coefficient de k = 4 sobre las primeras 10 000 filas: global 0.297 (por grupo 0.355, 0.358, 0.106 y 0.155). |

## Falta tomar
- **Importancia de variables:** volver a capturar con la columna *RowID* ensanchada, para que se lean los nombres.

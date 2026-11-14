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
| `kpi-5-no-concretados` | Pedidos no concretados sobre los 99 441 pedidos. |
| `pedidos-kpi-tabla-de-salida` | Tabla que se escribe en `pedidos_kpi.csv` (96 144 filas, 14 columnas). |

## Falta tomar
- Los workflows completos en verde de `01-ETL` y `02-Clustering` (los de `03-Prediccion` y `04-KPIs` ya están).
- **KPI 11** (recompra según la reseña del primer pedido): la tabla del GroupBy.
- **Importancia de variables:** volver a capturar con la columna *RowID* ensanchada, para que se lean los nombres.
- **Modelo 1:** perfiles de los segmentos, silueta (0.297) y ANOVA (H4).
- **ETL:** la tabla final (96 144 filas) y la verificación de conteos.
- **Dashboard de Power BI**, cuando exista.

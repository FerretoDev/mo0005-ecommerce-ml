# Capturas de la ejecución en KNIME

Evidencia de que los workflows corrieron y de que los resultados coinciden con la referencia. Cada archivo indica el valor que muestra.

## Modelo 2 (`modelo2/`, workflow 03-Prediccion)
| Archivo | Muestra |
| --- | --- |
| `scorer-*-matriz` y `scorer-*-estadisticas` | Matriz de confusión y estadísticas por clase (precisión, sensibilidad, F1) de la Base 1, la Base 2, el Random Forest y la regresión logística, sobre la prueba (32 092 pedidos). |
| `roc-random-forest-auc-0590` | Curva ROC del Random Forest, AUC 0.590. |
| `roc-regresion-logistica-auc-0719` | Curva ROC de la regresión logística, AUC 0.719. |
| `roc-base2-auc-0472` | Curva ROC de la línea base 2, AUC 0.472. |
| `cv-nodo-10/20/40/80-*` | AUC de la validación cruzada de 5 particiones del Random Forest con tamaño mínimo de nodo 10, 20, 40 y 80. **Confirmar que la de 20 se hizo con ese valor.** |

## KPI (`kpis/`, workflow 04-KPIs)
| Archivo | Muestra |
| --- | --- |
| `kpi-1-2-6-7-global` | % de tardías, días de entrega, calificación y % de reseñas negativas (96 144 pedidos). |
| `kpi-3-8-por-es-tardio` | Retraso promedio de las tardías y brecha de calificación por puntualidad. |
| `kpi-4-por-mismo-estado` | Días de entrega con el mismo estado y con estados distintos. |
| `tardias-por-estado` | % de entregas tardías por estado del cliente. |
| `resena-negativa-por-banda-de-retraso` | % de reseñas negativas según los días de retraso. |
| `kpi-5-no-concretados` | Pedidos no concretados sobre los 99 441 pedidos. |
| `pedidos-kpi-tabla-de-salida` | Tabla que se escribe en `pedidos_kpi.csv` (96 144 filas, 14 columnas). |

## Falta tomar
- Los **cuatro workflows completos en verde** (`01-ETL`, `02-Clustering`, `03-Prediccion` con la validación cruzada y la exportación, y `04-KPIs`).
- **KPI 9, 10 y 11** (recompra): las tablas de los GroupBy.
- **Importancia de variables** del Random Forest (segunda salida del Learner del modelo final).
- **Modelo 1:** perfiles de los segmentos, silueta (0.297) y ANOVA (H4).
- **ETL:** la tabla final (96 144 filas) y la verificación de conteos.
- **Dashboard de Power BI**, cuando exista.

# Guía del Modelo 1 en KNIME: segmentación con k-means

Workflow: `knime/02-Clustering`. Responsable: Marcos. Entrada: `knime/datos/ordenes_etl.csv` (96 144 pedidos).

Objetivo: agrupar los pedidos según su **experiencia de compra y entrega**, y comprobar si los grupos tienen niveles distintos de satisfacción (hipótesis H4).

> Los números de referencia de esta guía se calcularon en Python (scikit-learn) con los mismos datos, las mismas variables y la misma preparación. KNIME no da exactamente lo mismo (otra inicialización de k-means, otro orden de los grupos), pero las proporciones y los perfiles deben parecerse mucho. Si salen muy distintos, algo quedó mal configurado.

---

## 1. Variables

**Entradas (6):** `total_precio`, `total_flete`, `max_cuotas`, `dias_entrega`, `dias_retraso` y `mismo_estado`.

**Se conservan para describir los grupos, pero no entran al k-means:** `order_id`, `review_promedio`, `es_tardio`, `customer_state`.

`review_promedio` **no** entra: si entrara, los grupos se formarían con la satisfacción y H4 sería circular.

Ninguna de las 6 entradas tiene nulos en `ordenes_etl.csv`, así que no hace falta imputar.

## 2. Nodos

| # | Nodo | Configuración |
| --- | --- | --- |
| 1 | CSV Reader | Ruta relativa al workflow: `../datos/ordenes_etl.csv`. |
| 2 | Column Filter | Dejar `order_id`, las 6 entradas, `review_promedio`, `es_tardio`, `customer_state`. |
| 3 | Math Formula | `ln($total_precio$ + 1)`, reemplazando `total_precio`. |
| 4 | Math Formula | `ln($total_flete$ + 1)`, reemplazando `total_flete`. |
| 5 | Normalizer | Solo las 6 entradas, método *Z-score*. |

Por qué el logaritmo: precio y flete tienen colas muy largas (hay pedidos de 13 440 reales). Sin el logaritmo, unos pocos pedidos carísimos acaparan un grupo entero.

Por qué normalizar: k-means mide distancias. Sin normalizar, `dias_retraso` (rango de −146 a 182) pesaría mucho más que `mismo_estado` (0 o 1).

## 3. Elegir k (codo y silueta)

Se prueba k de 2 a 8 en un ciclo:

| # | Nodo | Configuración |
| --- | --- | --- |
| 6 | Counting Loop Start | 7 iteraciones. |
| 7 | Math Formula (Variable) | Variable `k` = `$${Icurrentiteration}$$ + 2` (entero). |
| 8 | k-Means | *Number of clusters* controlado por la variable `k` (pestaña *Flow Variables*); inicialización aleatoria con semilla fija; máximo 99 iteraciones; solo las 6 columnas normalizadas. |
| 9 | Row Sampling | 10 000 filas al azar, semilla fija. La silueta compara cada punto con todos los demás; con 96 000 filas tarda demasiado. |
| 10 | Silhouette Coefficient | Columna de grupo: `Cluster`; columnas: las 6 normalizadas. Tomar el coeficiente promedio global. |
| 11 | Loop End | Junta una fila por k con su silueta. |
| 12 | Line Plot | Silueta contra k. |

**Codo (inercia).** KNIME no da la inercia directamente. Se calcula así: unir cada pedido con el centro de su grupo (segundo puerto del k-Means, con un Joiner por `Cluster`), sumar con Math Formula `($x1$ - $c1$)^2 + … + ($x6$ - $c6$)^2` y totalizar con GroupBy (suma). Si se complica, el documento puede quedarse con la silueta, que es el criterio principal.

**Estabilidad.** Repetir el k elegido con 3 semillas distintas y verificar que los tamaños de los grupos casi no cambian.

### Referencia

| k | Inercia | Silueta |
| ---: | ---: | ---: |
| 2 | 444 062 | 0.272 |
| 3 | 368 642 | 0.287 |
| **4** | **301 593** | **0.305** |
| 5 | 273 977 | 0.272 |
| 6 | 253 415 | 0.231 |
| 7 | 240 525 | 0.230 |
| 8 | 222 060 | 0.221 |

**k = 4** tiene la mejor silueta, y el codo también cae ahí: de 4 a 5 la inercia baja mucho menos que de 3 a 4. Con 5 semillas distintas el agrupamiento es prácticamente el mismo (índice de Rand ajustado ≥ 0.999).

Una silueta de 0.3 indica una estructura **moderada**: los grupos existen, pero tienen fronteras difusas. Hay que decirlo así en el documento, sin exagerar.

## 4. Modelo final y perfil

| # | Nodo | Configuración |
| --- | --- | --- |
| 13 | k-Means | k = 4, misma semilla. |
| 14 | Joiner | Unir la salida con la tabla del nodo 2 (sin normalizar) por `order_id`, para describir los grupos en reales y días. |
| 15 | GroupBy | Por `Cluster`: conteo; mediana de precio y flete; promedio de cuotas, días de entrega, días de retraso, `mismo_estado`, `es_tardio` y `review_promedio`. |
| 16 | Color Manager + Scatter Plot | `dias_entrega` contra `total_precio`, coloreado por grupo. |
| 17 | CSV Writer | `order_id` y `Cluster` en `../datos/segmentos_modelo1.csv`, para Power BI. |

### Referencia: perfiles con k = 4

KNIME numera los grupos en otro orden; identifíquenlos por el perfil.

| Grupo (nombre sugerido) | Pedidos | Precio (mediana) | Cuotas | Entrega (días) | Mismo estado | % tardío | Calificación | % reseñas negativas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Compras grandes a plazos | 16 805 (17.5 %) | 219.00 | 7.1 | 12.4 | 22 % | 2.6 % | 4.16 | 12.6 % |
| Estándar entre estados | 41 538 (43.2 %) | 69.90 | 1.9 | 12.4 | 0 % | 0.7 % | 4.31 | 8.6 % |
| Locales rápidas | 30 519 (31.7 %) | 64.99 | 2.1 | 7.3 | 99 % | 4.5 % | 4.32 | 8.9 % |
| Entregas problemáticas | 7 282 (7.6 %) | 98.00 | 2.8 | 35.2 | 9 % | 78.0 % | 2.58 | 53.2 % |

## 5. Prueba de H4

**Pregunta:** ¿la calificación promedio difiere entre los grupos?

| Nodo | Configuración |
| --- | --- |
| Kruskal-Wallis Test (si está instalado) o One-way ANOVA | Variable: `review_promedio`; grupos: `Cluster`. Excluir antes con Row Filter los 642 pedidos sin reseña. |

**Referencia:** Kruskal-Wallis H = 7 789, p < 0.001. Las calificaciones van de 2.58 a 4.32.

## 6. Lo que hay que decir en la defensa

1. **El cuarto grupo coincide casi con los pedidos tardíos**, porque `dias_retraso` es una de las entradas. Entonces "ese grupo está peor calificado" repite en buena parte H1. El modelo segmenta la **experiencia de entrega**, no el comportamiento comercial.
2. **Análisis de sensibilidad** (recomendado, en una rama aparte del mismo workflow): repetir con las 4 variables que se conocen al comprar (precio, flete, cuotas y mismo estado). Ahí el mejor k es 3 (silueta 0.391), y las calificaciones por grupo apenas varían, de 4.00 a 4.29 (Kruskal-Wallis H = 507, p < 0.001: significativo, pero con un efecto pequeño). Conclusión: la segmentación comercial casi no explica la satisfacción; lo que la explica es la experiencia logística.
3. Una silueta de 0.30 es moderada: los grupos sirven para describir y priorizar, no como categorías rígidas.

## 7. Cómo quedó en KNIME (workflow `02-Clustering`)

El workflow tiene 14 nodos y se ejecuta completo con Shift+F7 en menos de un minuto.

| # | Nodo | Qué hace |
| --- | --- | --- |
| 1 | CSV Reader | Lee `../datos/ordenes_etl.csv` (96 144 filas) |
| 2 | Column Filter | Deja 10 columnas (excluye explícitamente las 19 restantes) |
| 3, 4 | Math Formula | `ln(precio + 1)` y `ln(flete + 1)`, reemplazando la columna |
| 5 | Normalizer | Z-score solo en las 6 entradas (excluye `review_promedio` y `es_tardio`) |
| 6 | k-Means | k = 4, inicialización aleatoria, semilla 2 |
| 7 | Joiner | Une la asignación con la tabla antes de los logaritmos, por `order_id` |
| 8 | GroupBy | Por `Cluster`: conteo, mediana de precio y promedio de entrega, tardías y calificación |
| 9, 10 | Column Filter + CSV Writer | Escribe `../datos/segmentos_modelo1.csv` (`order_id` + `Cluster`) |
| 11, 12 | Rule-based Row Filter + One-way ANOVA | Quita los 642 pedidos sin reseña (quedan 95 502) y prueba `review_promedio` por grupo (H4) |
| 13, 14 | Rule-based Row Filter + Silhouette Coefficient | Primeras 10 000 filas y silueta del k = 4 |

**Resultados de KNIME**
- Grupos: **7 357 / 16 767 / 30 509 / 41 511** pedidos (referencia de Python: 7 423 / 16 708 / 30 498 / 41 515).
- Grupo problemático: 35,1 días de entrega, 77,4 % tardías, calificación 2,59.
- H4, One-way ANOVA: **F = 4 477,7** (3 y 95 498 gl), p < 0,001, tamaño de efecto 0,12.
- Silueta global de k = 4: **0,297** (Python: 0,305); por grupo entre 0,11 y 0,36.

**Diferencias con la guía de referencia**
- Se usó **One-way ANOVA** y no Kruskal-Wallis, porque el nodo de Kruskal-Wallis no está instalado en esta versión de KNIME. La calificación es ordinal, así que Kruskal-Wallis (H = 7 789 en Python) es la prueba más adecuada; ambas concluyen lo mismo.
- La silueta se calculó **solo para k = 4**, sobre las primeras 10 000 filas. La tabla de k = 2 a 8 y el codo son de Python; falta el ciclo equivalente en KNIME.
- Con otra semilla el k-Means puede caer en otro óptimo local (con una semilla se obtuvo un reparto distinto de 4 817 / 8 871 / 33 000 / 49 456, cuando el logaritmo no se estaba aplicando). Con el logaritmo bien aplicado el resultado fue estable.

**Errores que aparecieron al armarlo** (por si se repiten): el Math Formula añadía una columna en vez de reemplazarla (ver `CLAUDE.md`), el Column Filter dejaba pasar todas las columnas por tener la lista de excluidas vacía, y el modo del Normalizer es `Z_SCORE`.

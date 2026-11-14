# Guía del Modelo 2 en KNIME: predicción de entrega tardía

Workflow: `knime/03-Prediccion`. Entrada: `knime/datos/ordenes_etl.csv` (96 144 pedidos, 8.07 % tardíos).

Objetivo: predecir `es_tardio` **en el momento de la compra**, con dos algoritmos (Random Forest y regresión logística), y compararlos con dos líneas base sobre una prueba temporal.

> **Sobre los algoritmos.** El enunciado pide al menos dos modelos de ML validados (uno supervisado y uno no supervisado, según los objetivos del curso), pero no nombra algoritmos. Aquí se comparan regresión logística y Random Forest; en las pruebas de referencia ganó la regresión logística. Si el equipo prefiere, el Random Forest se puede cambiar por un Decision Tree (más fácil de explicar) o por Gradient Boosted Trees; los pasos de preparación y evaluación son los mismos.

---

## 1. Lectura

| Nodo | Configuración |
| --- | --- |
| CSV Reader | Ruta relativa al workflow: `../datos/ordenes_etl.csv`. |
| String to Date&Time | Solo `order_purchase_timestamp`, tipo **Date&time**, formato `yyyy-MM-dd HH:mm:ss`. |

## 2. Variables

Solo entran variables que se conocen **al momento de la compra**. Si se usa algo que solo se sabe después de la entrega, el modelo "hace trampa" (fuga de información) y su AUC no vale nada.

**Entradas (13):** `total_precio`, `total_flete`, `num_items`, `max_cuotas`, `relacion_precio_flete`, `product_weight_g`, `volumen_cm3`, `plazo_estimado_dias`, `mismo_estado`, `customer_state`, `seller_state`, `product_category_name_english` y `dia_semana` (se crea abajo). La fecha de compra se conserva solo para partir los datos; no es una entrada.

**Excluir siempre:** `dias_entrega`, `dias_retraso`, `order_delivered_carrier_date`, `order_delivered_customer_date`, `order_approved_at`, `review_promedio`, `order_estimated_delivery_date` (ya está resumida en `plazo_estimado_dias`), identificadores (`order_id`, `customer_unique_id`), ciudad y código postal.

**No usar el mes de compra.** Con solo 20 meses de datos, el mes aprende picos de un solo año (noviembre de 2017, febrero y marzo de 2018) y no un patrón que se repita. En la prueba de referencia, el Random Forest le daba al mes la mayor importancia. Si el equipo decide incluirlo, hay que justificarlo en el documento.

| Nodo | Configuración |
| --- | --- |
| Extract Date&Time Fields | De `order_purchase_timestamp`, extraer *Day of week (number)* → renombrar a `dia_semana`. |
| Column Filter | Dejar las entradas de arriba, `es_tardio` y `order_purchase_timestamp`. |
| Number to String | `es_tardio` → texto. Los nodos de clasificación de KNIME necesitan el objetivo como texto. |

## 3. Partición temporal

| Nodo | Configuración |
| --- | --- |
| Row Splitter | Condición: `order_purchase_timestamp` **menor que** `2018-04-01T00:00:00`. Salida de arriba = **entrenamiento**, salida de abajo = **prueba**. |

Verificación: entrenamiento **64 052** filas (9.19 % tardíos) y prueba **32 092** (5.85 % tardíos). Si no da eso, el corte está mal.

Después del Row Splitter ya se puede quitar `order_purchase_timestamp` con otro Column Filter en cada rama.

## 4. Preparación (se aprende en entrenamiento y se aplica a prueba)

Regla de oro: todo lo que "aprende" algo de los datos (medianas, medias, muestreo) se calcula **solo con entrenamiento**. Así la prueba no contamina el modelo.

| Nodo | Rama | Configuración |
| --- | --- | --- |
| Missing Value | entrenamiento | Números (`product_weight_g`, `volumen_cm3`): **Median**. Texto: dejar igual (la categoría ya viene sin nulos). |
| Missing Value (Apply) | prueba | Conectar el puerto de modelo (PMML) del Missing Value de arriba. |
| Equal Size Sampling | solo entrenamiento | Objetivo `es_tardio`, *Use exact sampling*, semilla fija (p. ej. 42). Iguala tardíos y a tiempo para que el modelo no aprenda a decir siempre "a tiempo". **Nunca en prueba.** |

Para la regresión logística, además:

| Nodo | Rama | Configuración |
| --- | --- | --- |
| Normalizer | entrenamiento | Columnas numéricas, *Z-score*. |
| Normalizer (Apply) | prueba | Conectar el modelo del Normalizer. |

## 5. Modelos

**Random Forest**

| Nodo | Configuración |
| --- | --- |
| Random Forest Learner | Objetivo `es_tardio`; *Number of models* 200; *Minimum child node size* 20; semilla fija. |
| Random Forest Predictor | Sobre prueba; marcar *Append individual class probabilities*. |

**Regresión logística**

| Nodo | Configuración |
| --- | --- |
| Logistic Regression Learner | Objetivo `es_tardio`, categoría de referencia `0`. Las columnas de texto (estados, categoría) las convierte en indicadoras solo. |
| Logistic Regression Predictor | Sobre prueba normalizada; marcar *Append columns with predicted probabilities*. |

**Validación cruzada (para elegir hiperparámetros, dentro del entrenamiento):** envolver cada Learner + Predictor en **X-Partitioner** (5 particiones, *Stratified sampling* por `es_tardio`, semilla fija) → **X-Aggregator**. Probar 2 o 3 valores de *Minimum child node size* (10, 20, 50) y quedarse con el mejor AUC promedio. La prueba temporal se usa **una sola vez**, al final.

## 6. Líneas base

Sobre la rama de prueba, con **Rule Engine**:

- **Base 1, siempre a tiempo:** `TRUE => "0"`.
- **Base 2, estados distintos:** `$mismo_estado$ = 0 => "1"` y `TRUE => "0"`. Para su AUC, crear también una columna numérica con el mismo valor (1 o 0).

## 7. Evaluación

| Nodo | Qué da |
| --- | --- |
| Scorer (uno por modelo y por línea base) | Matriz de confusión; en el segundo puerto, precisión, sensibilidad (*recall*) y F1 por clase. Reportar los de la clase `1` (tardío). |
| Binary Classification Inspector (o ROC Curve) | Curva ROC y AUC; cargar las probabilidades de la clase `1` de ambos modelos y la columna numérica de la Base 2. |

Criterio de H3 (propuesto): el modelo supera a las dos líneas base **y** tiene AUC mayor que 0.60.

**Umbral.** Con clases desbalanceadas, el umbral de 0.5 casi nunca es el mejor. Si lo cambian, elijan el umbral con la validación cruzada del entrenamiento, nunca mirando la prueba, y reporten los dos (0.5 y el elegido).

## 8. Números de referencia

Se calcularon en Python (scikit-learn) con las mismas variables y el mismo corte. Para el desbalance se usó ponderación de clases en vez de Equal Size Sampling, así que en KNIME la precisión y la exhaustividad pueden moverse un poco más que el AUC. KNIME no va a dar exactamente lo mismo; una diferencia de ±0.03 en AUC es normal. Si sale muy distinto, algo está mal.

| Modelo (prueba, umbral 0.5) | AUC | Precisión | Sensibilidad | F1 |
| --- | ---: | ---: | ---: | ---: |
| Base 1: siempre a tiempo | 0.500 | 0 | 0 | 0 |
| Base 2: estados distintos | 0.472 | 0.053 | 0.545 | 0.097 |
| Random Forest | ≈ 0.63 | 0.078 | 0.444 | 0.132 |
| Regresión logística | ≈ 0.72 | 0.100 | 0.782 | 0.177 |

Variables más importantes del Random Forest: `plazo_estimado_dias`, `total_flete`, estado del cliente (RJ y SP), `mismo_estado` y `total_precio`.

## 9. Hallazgos que hay que contar en el documento

1. **La regresión logística le gana al Random Forest.** Es poco común, pero pasa cuando la señal es débil y casi lineal. No es un error; hay que reportarlo así.
2. **La Base 2 sale peor que el azar en la prueba (AUC 0.47).** En el entrenamiento, los pedidos entre estados distintos llegaban tarde mucho más (11.0 % frente a 5.7 %). En la prueba se invierte: 5.3 % frente a 6.6 %. La relación geografía–retraso **no es estable en el tiempo**, y eso afecta a H2: con todo el periodo la diferencia existe, pero en abril–agosto de 2018 no se sostiene.
3. **La prueba tiene menos tardíos que el entrenamiento** (5.85 % frente a 9.19 %), como ya dice la sección 3.5.1.
4. **La precisión es baja en todos los modelos** (de cada 10 pedidos marcados como tardíos, 1 lo es). Sirve para priorizar seguimiento, no para tomar decisiones automáticas sobre un pedido.

---

## 10. Cómo quedó en KNIME (workflow `03-Prediccion`)

El workflow tiene **39 nodos** (28 del modelo y 11 de la validación cruzada y la exportación) y se ejecuta completo. Se generó el esqueleto escribiendo XML y se terminó de configurar en la interfaz de KNIME.

**Cadena:** CSV Reader → String to Date&Time → Date&Time Part Extractor (`dia_semana`) → Column Filter → Number To String (`es_tardio`) → **Domain Calculator** → Row Splitter (corte 2018-04-01). Rama de entrenamiento: Column Filter → Missing Value (mediana) → Equal Size Sampling (`es_tardio`, exacto, semilla 42) → Random Forest Learner y Normalizer → Logistic Regression Learner. Rama de prueba: Column Filter → Missing Value (Apply) → Random Forest Predictor, Normalizer (Apply) → Logistic Regression Predictor y tres Rule Engine (líneas base). Cuatro Scorer y tres ROC Curve.

**Resultados de KNIME (prueba, abril a agosto de 2018; 32 092 pedidos, 1 878 tardíos; umbral 0.5):**

| Modelo | AUC | Precisión | Sensibilidad | F1 |
| --- | ---: | ---: | ---: | ---: |
| Base 1: siempre a tiempo | 0.50 | no definida | 0 | no definido |
| Base 2: estados distintos | 0.472 | 0.053 | 0.545 | 0.097 |
| Random Forest | 0.590 | 0.078 | 0.460 | 0.134 |
| Regresión logística | **0.719** | **0.100** | **0.787** | **0.177** |

Matrices de confusión (filas = real, columnas = predicho; `0`/`1`): Base 1 = [30 214, 0 / 1 878, 0]; Base 2 = [12 048, 18 166 / 854, 1 024]; Random Forest = [20 042, 10 172 / 1 015, 863]; regresión logística = [16 877, 13 337 / 400, 1 478]. Filas del Row Splitter: 64 052 y 32 092, como en la sección 3.

**Diferencias con la referencia de Python (sección 8):** AUC de la regresión logística 0.719 (referencia 0.721) y de las líneas base idénticos. El Random Forest da 0.590 frente a 0.625, algo fuera del ±0.03: queda por debajo de 0.60. Se atribuye a que en KNIME se balanceó con Equal Size Sampling (Python usó ponderación de clases) y a que el tamaño mínimo de nodo no se ajustó con validación cruzada. La regresión logística supera a ambas líneas base y cumple H3.

**Problemas que aparecieron al armarlo (por si se repiten):**
- **Row Splitter sin `outputMode`:** al cargar decía `String for key "outputMode" not found` y caía a valores por defecto. Se corrige poniendo la condición a mano (`order_purchase_timestamp` antes de `2018-04-01`).
- **Random Forest Learner con 3 salidas:** el modelo es la **tercera**; el cable al Predictor debe salir de ahí (`Unable to insert connection`).
- **Random Forest rechazaba valores faltantes:** los 16 vacíos de `product_weight_g` y `volumen_cm3` son enteros; el Missing Value debe imputar también enteros con la mediana.
- **Columna ignorada por falta de dominio:** `product_category_name_english` (más de 60 categorías) perdía su dominio al leer el CSV; se recalcula con un **Domain Calculator** (máximo 1 000 valores) antes del Row Splitter.
- **ROC Curve:** *Class column* debe ser `es_tardio` (no la de "(prediction)") y *Positive class value* `1`. Con el valor equivocado el AUC sale como 1 − AUC (0.28 en vez de 0.72). Las columnas de probabilidad: `1` en el Random Forest, `P (es_tardio=1)` en la logística y `puntaje_base2` en la Base 2.
- **Scorer:** la columna de predicción se llama `Prediction ()` en el Random Forest y `es_tardio (prediction)` en la logística.
- **Aviso de la regresión logística:** no converge en el número de épocas y no calcula la covarianza (matriz singular); no afecta a las predicciones.


## 11. Validación cruzada, importancia de variables y exportación de predicciones

**Validación cruzada del Random Forest (nodos 35 a 39).** X-Partitioner de 5 particiones, estratificada por `es_tardio`, semilla 42, sobre el entrenamiento ya balanceado; Random Forest Learner y Predictor, X-Aggregator y ROC Curve (el AUC es el de las 5 particiones juntas). Se varió el campo *Minimum node size* del Learner de la validación cruzada (guarda `minChildSize` = ese valor y `minNodeSize` = el doble):

| Tamaño mínimo | AUC de validación |
| ---: | ---: |
| 10 | 0.6858 |
| 20 | 0.6871 |
| 40 | 0.6876 |
| 80 | 0.6855 |

**Decisión:** se mantiene 20. La diferencia entre el mejor y el peor (0.002) es del orden del ruido. La prueba temporal se usó una sola vez con esa configuración (AUC 0.590). El AUC de validación (≈ 0.69) es mayor que el de la prueba (0.59) porque la validación cruzada mezcla pedidos del mismo período de entrenamiento; la relación entre variables y retraso cambia con el tiempo. Como se hizo sobre el entrenamiento balanceado, sirve para comparar parámetros, no para estimar precisión ni sensibilidad reales.

**Variables más usadas por el Random Forest** (salida *Attribute Statistics* del Learner del modelo final; divisiones en la raíz de los 200 árboles): `customer_state` 47, `total_flete` 46, `mismo_estado` 28, `product_category_name_english` 24, `plazo_estimado_dias` 19, `seller_state` 12, `total_precio` 7, `product_weight_g` 7, `volumen_cm3` 7, `relacion_precio_flete` 3; `num_items`, `max_cuotas` y `dia_semana`, 0. Es una aproximación a la importancia, no un valor como el de scikit-learn; las variables con muchas categorías tienden a salir arriba con Gini.

**Exportación de predicciones (nodos 29 a 34).** Se escribe `knime/datos/predicciones_modelo2.csv` con `order_id`, `prob_tardio_rf` y `prob_tardio_logistica` para los 32 092 pedidos de la prueba (abril a agosto de 2018). Para esto `order_id` pasa por el primer Column Filter y por el de la rama de prueba, y no entra al de entrenamiento. Los AUC recalculados desde el archivo coinciden con los de las ROC Curve (0.590 y 0.719).

**Las probabilidades no son frecuencias reales.** Los modelos se entrenaron con datos balanceados: el promedio de las probabilidades es 0.43 (Random Forest) y 0.49 (regresión logística), mientras que solo el 5.85 % de esos pedidos llegó tarde. Sirven para ordenar los pedidos por riesgo; en Power BI conviene usar niveles de riesgo por percentiles.

**Errores que aparecieron al armarlo:** el primer Column Filter no dejaba pasar `order_id`, y el Joiner de la exportación fallaba con «join column names [order_id] do not exist in the target table». Al cambiar el tamaño de nodo en la validación cruzada hay que reejecutar la cadena hasta la ROC Curve; si no, la vista sigue mostrando la curva anterior.

# Flujo con KNIME

Este proyecto usa KNIME para conectar la parte de análisis de datos con la parte de negocio. La idea es que cada carpeta representa una etapa del trabajo:

- 01-ETL: preparar y limpiar los datos
- 02-Clustering: segmentar clientes o pedidos
- 03-Prediccion: crear modelos predictivos
- 04-KPIs: calcular indicadores para negocio / Power BI

En otras palabras, KNIME no es un solo “programa grande”, sino un conjunto de flujos visuales: cada flujo hace una tarea concreta y luego los resultados se usan en la siguiente etapa.

---

## ¿Qué es KNIME?

KNIME es una herramienta visual para análisis de datos y machine learning. En lugar de escribir todo en código, se arman flujos con nodos (bloques) conectados entre sí.

Ejemplo simple:

- Leer archivo CSV o consultar PostgreSQL
- Limpiar datos
- Hacer joins
- Transformar columnas
- Crear nuevas variables
- Entrenar un modelo
- Guardar resultados

Eso es exactamente lo que hace este proyecto.

---

## 01-ETL

### ¿Qué significa ETL?

ETL significa:

- Extract (Extraer): leer los datos crudos
- Transform (Transformar): limpiar, convertir, cruzar y crear variables
- Load (Cargar): dejar los datos listos para análisis o modelado

### En este proyecto

El flujo 01-ETL toma los archivos CSV de Olist y / o la base de datos PostgreSQL, y prepara la información que después se usará en clustering y predicción.

### ¿Qué hace normalmente este flujo?

1. Leer las tablas base:
   - customers
   - orders
   - order_items
   - order_payments
   - order_reviews
   - products
   - sellers
   - geolocation
   - product_category_name_translation

2. Limpiar datos:
   - valores nulos
   - fechas inválidas
   - texto inconsistente
   - columnas con formato raro

3. Unir tablas por claves:
   - clientes con pedidos
   - pedidos con items
   - pedidos con pagos
   - pedidos con reseñas

4. Crear variables nuevas:
   - tiempo de entrega
   - retraso en la entrega
   - costo total del pedido
   - número de items por pedido
   - si un pedido fue tardío o no
   - relación entre precio y flete

5. Dejar una vista preparada para los siguientes modelos.

### Importante

Este flujo es la base de todo. Si ETL está mal, luego el clustering y la predicción también salen mal.

---

## 02-Clustering

### ¿Qué es clustering?

Clustering es un tipo de aprendizaje no supervisado. Es decir, no le decimos “este grupo es bueno o malo”, sino que la máquina encuentra patrones por sí sola.

### ¿Qué busca hacer aquí?

En este proyecto, el clustering sirve para agrupar clientes o pedidos según comportamiento. Por ejemplo:

- clientes de alto valor
- clientes frecuentes
- clientes con mala experiencia
- pedidos con comportamiento parecido

### ¿Qué se usa en KNIME?

Normalmente se usan nodos como:

- Joiner para unir datos de negocio
- GroupBy para resumir por cliente o pedido
- Normalizer / Math Formula para escalar variables
- k-means o clustering automático
- Scatter Plot / Table View para interpretar grupos

### ¿Para qué sirve?

Para responder preguntas como:

- ¿Qué tipo de clientes tiene Olist?
- ¿Hay segmentos con más riesgo de retraso?
- ¿Qué clientes compran más y con mejor experiencia?

Es decir, este flujo ayuda a describir patrones y perfiles, no necesariamente a predecir un evento puntual.

### Lo que se decidió (Modelo 1)

k-means sobre pedidos con 6 variables: precio, flete, cuotas, días de entrega, retraso y mismo estado. Precio y flete van en logaritmo y todo se normaliza con z-score. La calificación no entra al modelo; se usa después para comparar los grupos (H4). Con k = 4 salen cuatro segmentos: compras grandes a plazos, estándar entre estados, locales rápidas y entregas problemáticas. Paso a paso y números de referencia en `documento/guia-modelo1-knime.md`.

---

## 03-Prediccion

### ¿Qué es predicción?

La predicción es aprendizaje supervisado: aquí sí tenemos una variable objetivo. Por ejemplo:

- si un pedido llega tarde o no
- si un cliente va a dejar una reseña negativa
- si un cliente vuelve a comprar

### En este proyecto

El flujo 03-Prediccion normalmente toma la base ya preparada por ETL y arma un dataset con variables de entrada y una variable objetivo.

### ¿Qué suele pasar en este flujo?

1. Seleccionar la variable objetivo:
   - retraso de entrega
   - mala calificación
   - churn / no compra

2. Dividir los datos en entrenamiento y prueba.

3. Entrenar modelos:
   - decision tree
   - random forest
   - logistic regression
   - otros modelos de clasificación

4. Evaluar métricas:
   - precisión
   - sensibilidad
   - F1-score
   - matriz de confusión
   - AUC o accuracy

5. Guardar el mejor modelo o la salida con score por pedido / cliente.

### Lo que se decidió (Modelo 2)

Objetivo: `es_tardio`, prediciéndolo con información disponible al momento de la compra. Partición temporal: entrenamiento con compras hasta marzo de 2018 y prueba de abril a agosto de 2018. Se comparan regresión logística y Random Forest contra dos líneas base (siempre a tiempo; estados distintos = tardío). En las pruebas de referencia ganó la regresión logística (AUC 0.72). Paso a paso y números de referencia en `documento/guia-modelo2-knime.md`.

### ¿Qué se busca?

Encontrar patrones para anticipar eventos valiosos para el negocio, como:

- pedidos con alto riesgo de atraso
- clientes con más probabilidad de mala experiencia
- clientes con riesgo de no volver

---

## 04-KPIs

### ¿Qué es KPI?

KPI significa Key Performance Indicator, o indicador clave de desempeño. Son métricas de negocio que muestran si algo está funcionando bien o mal.

### En este proyecto

El flujo 04-KPIs toma los resultados del análisis y calcula indicadores de negocio para la toma de decisiones.

### Ejemplos de KPI que normalmente aparecen

- porcentaje de entregas tardías
- tiempo promedio de entrega
- satisfacción promedio por pedido
- tasa de devoluciones
- porcentaje de clientes con más de un pedido
- indicador de clientes con reseñas negativas

### ¿Qué hace este flujo?

- agrega los datos a nivel de pedido o cliente
- calcula métricas de negocio
- crea tablas resumidas
- prepara salidas para Power BI o dashboards

### ¿Por qué es importante?

Porque la analítica no se trata solo de modelos. También debe responder a preguntas del negocio como:

- ¿Qué tan bien está funcionando la entrega?
- ¿Qué tan contentos están los clientes?
- ¿Dónde está el mayor riesgo?

---

## Cómo se conectan entre sí

El proyecto sigue este orden lógico:

1. 01-ETL
   - limpia y prepara los datos

2. 02-Clustering
   - descubre segmentos y perfiles

3. 03-Prediccion
   - predice eventos de negocio

4. 04-KPIs
   - resume resultados para decisiones de negocio

Es decir:

- ETL = construir la base correcta
- Clustering = describir patrones
- Predicción = anticipar eventos
- KPIs = medir impacto y negocio

---

## En una frase simple

- 01-ETL = “dejar los datos limpios y listos”
- 02-Clustering = “agrupar clientes o pedidos”
- 03-Prediccion = “predecir lo que puede pasar”
- 04-KPIs = “medir si va bien o mal para el negocio”

---

## Recomendación práctica

Cuando abras cada flujo en KNIME, haz esto:

1. Identifica la entrada del flujo.
2. Mira qué tablas o archivos lee.
3. Revisa qué columnas se transforman.
4. Entiende la variable objetivo o la agrupación final.
5. Pregunta: “¿Qué negocio responde este flujo?”

Si haces eso, todo el proyecto te va a empezar a tener sentido.

---

## Resumen rápido

| Flujo | Objetivo | Tipo de resultado |
|---|---|---|
| 01-ETL | Limpiar y unir datos | Base analítica lista |
| 02-Clustering | Agrupar clientes y pedidos | Segmentos y perfiles |
| 03-Prediccion | Predecir eventos | Modelos y scores |
| 04-KPIs | Medir negocio | Indicadores y dashboards |

---

# Plan concreto para el flujo 01-ETL en KNIME

## Objetivo

El flujo 01-ETL tiene una misión clara: convertir los datos crudos de Olist en una tabla analítica lista para clustering y predicción. En otras palabras, el ETL no solo limpia, sino que construye la base del análisis.

## Orden práctico para montar el flujo

### 1. Conexión a PostgreSQL

Usa nodos como:

- DB Connector
- DB Table Selector
- DB Query Reader

Se lee el esquema `olist` y sus tablas principales:

- `customers`
- `orders`
- `order_items`
- `order_payments`
- `order_reviews`
- `products`
- `sellers`
- `geolocation`
- `product_category_name_translation`

### 2. Validación inicial de la base

Antes de transformar, revisa:

- cuántos registros tiene cada tabla,
- si hay IDs vacíos,
- si existen fechas nulas,
- si los estados de pedido son consistentes.

Nodos útiles:

- Table View
- Row Filter
- Missing Value
- GroupBy

### 3. Limpieza y filtros

Aplica filtros básicos:

- mantener solo `order_status = delivered`
- eliminar registros con fechas nulas
- filtrar valores no válidos

Nodos sugeridos:

- Row Filter
- Missing Value
- Column Filter

### 4. Join de tablas transaccionales

La unidad central es el pedido, así que hay que unir:

- `orders` con `customers`
- `orders` con `order_items`
- `order_items` con `products`
- `order_items` con `sellers`
- `orders` con `order_payments`
- `orders` con `order_reviews`

Nodos clave:

- Joiner
- Duplicate Row Filter
- GroupBy

### 5. Crear variables derivadas

Estas columnas son esenciales para la siguiente etapa:

- `dias_entrega`
- `plazo_estimado_dias`
- `dias_retraso`
- `es_tardio`
- `mismo_estado`
- `num_items`
- `valor_items`
- `flete_total`
- `relacion_precio_flete`
- `review_score_pedido`
- `peso_g`
- `volumen_cm3`

Nodos recomendados:

- Date&Time Difference
- Math Formula
- Rule Engine
- String Manipulation

### 6. Agregación por pedido

Se debe dejar una tabla a nivel de `order_id` con una fila por pedido. Eso será la base final del análisis.

### 7. Filtro final del ETL

Define la población base del proyecto, normalmente:

- pedidos entregados
- fechas de entrega en el intervalo analítico
- sin registros corruptos

### 8. Guardar la tabla del ETL

Antes de pasar a clustering, guarda la tabla lista.

Puedes usar:

- Table Writer
- CSV Writer
- DB Writer

## Validación mínima antes de pasar al siguiente flujo

Antes de cerrar el ETL, verifica:

1. que el número de pedidos fue consistente,
2. que `es_tardio` tenga solo 0 y 1,
3. que no existan IDs nulos,
4. que las fechas tengan sentido cronológico,
5. que cada pedido aparezca una sola vez en la tabla final.

## Siguiente paso real

El próximo paso concreto es:

1. conectar con PostgreSQL,
2. leer `orders`, `customers`, `order_items`, `payments`, `reviews`, `products`, `sellers`,
3. crear la tabla analítica de pedido,
4. guardar la salida final en la base o como CSV.

Ese es el flujo 01-ETL que luego alimentará a 02-Clustering.
| 02-Clustering | Agrupar comportamientos | Segmentos / perfiles |
| 03-Prediccion | Predecir eventos | Modelos y scores |
| 04-KPIs | Medir desempeño | Indicadores de negocio |

Si quieres, en el siguiente paso puedo ayudarte a hacer una versión todavía más concreta de este archivo, con una explicación tipo “qué nodo va primero, qué nodo va después” para cada flujo de KNIME del proyecto.

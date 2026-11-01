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
| 02-Clustering | Agrupar comportamientos | Segmentos / perfiles |
| 03-Prediccion | Predecir eventos | Modelos y scores |
| 04-KPIs | Medir desempeño | Indicadores de negocio |

Si quieres, en el siguiente paso puedo ayudarte a hacer una versión todavía más concreta de este archivo, con una explicación tipo “qué nodo va primero, qué nodo va después” para cada flujo de KNIME del proyecto.

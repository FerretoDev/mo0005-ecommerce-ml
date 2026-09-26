# Esquema del Dataset Olist E-Commerce

Este documento describe la estructura relacional, tablas, campos y llaves del dataset público **Brazilian E-Commerce Public Dataset by Olist** alojado en `/datos`.

---

## 🔗 Relación de Tablas (Modelo Entidad-Relación)

```text
       [olist_customers_dataset]
                   │
                   │ (customer_id)
                   ▼
         [olist_orders_dataset] ◄────────────── [olist_order_payments_dataset]
                   │       ▲                     (order_id)
                   │       │
                   │       └─────────────────── [olist_order_reviews_dataset]
                   │                             (order_id)
                   │ (order_id)
                   ▼
       [olist_order_items_dataset]
             │               │
 (product_id)│               │(seller_id)
             ▼               ▼
 [olist_products_dataset]  [olist_sellers_dataset]
             │                       │
             │ (product_category_    │ (seller_zip_code_prefix)
             │  name)                ▼
             ▼             [olist_geolocation_dataset]
 [product_category_name_
   translation]
```

---

## 📋 Diccionario de Datos por Archivo

### 1. `olist_customers_dataset.csv`
Información geográfica y llaves de clientes.
- `customer_id`: Llave primaria en el contexto de una orden específica (cada orden se asocia a un `customer_id` único).
- `customer_unique_id`: Identificador real del cliente individual a lo largo del tiempo (clave para análisis de recurrencia, LTV y segmentación/clustering).
- `customer_zip_code_prefix`: Primeros 5 dígitos del código postal del cliente.
- `customer_city`: Ciudad de residencia.
- `customer_state`: Estado federativo de Brasil (ej. SP, RJ, MG).

### 2. `olist_orders_dataset.csv`
Registro central de cada pedido y su ciclo de vida logístico.
- `order_id`: Identificador único de la orden (Primary Key).
- `customer_id`: Llave foránea hacia `olist_customers_dataset`.
- `order_status`: Estado actual (`delivered`, `shipped`, `canceled`, `invoiced`, `processing`, `created`, `approved`, `unavailable`).
- `order_purchase_timestamp`: Fecha y hora de realización de la compra.
- `order_approved_at`: Fecha y hora de aprobación del pago.
- `order_delivered_carrier_date`: Fecha y hora de entrega al operador logístico.
- `order_delivered_customer_date`: Fecha y hora real de entrega al cliente.
- `order_estimated_delivery_date`: Fecha estimada de entrega informada al cliente.

### 3. `olist_order_items_dataset.csv`
Detalle de productos adquiridos dentro de cada orden.
- `order_id`: Llave foránea hacia `olist_orders_dataset`.
- `order_item_id`: Número secuencial del artículo dentro de la misma orden.
- `product_id`: Llave foránea hacia `olist_products_dataset`.
- `seller_id`: Llave foránea hacia `olist_sellers_dataset`.
- `shipping_limit_date`: Fecha límite del vendedor para entregar el paquete al transportista.
- `price`: Precio unitario del artículo (en reales brasileños, BRL).
- `freight_value`: Costo de envío asignado a este artículo.

### 4. `olist_order_payments_dataset.csv`
Métodos de pago y transacciones asociadas a cada orden.
- `order_id`: Llave foránea hacia `olist_orders_dataset`.
- `payment_sequential`: Secuencia de pago (en caso de usar múltiples métodos para una misma orden).
- `payment_type`: Tipo de pago (`credit_card`, `boleto`, `voucher`, `debit_card`, `not_defined`).
- `payment_installments`: Número de cuotas acordadas por el cliente.
- `payment_value`: Monto abonado en la transacción.

### 5. `olist_order_reviews_dataset.csv`
Retroalimentación, puntuación de satisfacción y comentarios del cliente.
- `review_id`: Identificador único de la reseña.
- `order_id`: Llave foránea hacia `olist_orders_dataset`.
- `review_score`: Calificación del cliente de 1 a 5 estrellas.
- `review_comment_title`: Título breve del comentario (puede ser nulo).
- `review_comment_message`: Texto detallado del comentario del cliente (puede ser nulo).
- `review_creation_date`: Fecha de envío de la encuesta de satisfacción.
- `review_answer_timestamp`: Fecha y hora en que el cliente completó la respuesta.

### 6. `olist_products_dataset.csv`
Catálogo de productos vendidos a través de la plataforma.
- `product_id`: Identificador único del producto (Primary Key).
- `product_category_name`: Nombre de la categoría en portugués.
- `product_name_lenght`: Longitud en caracteres del título del producto.
- `product_description_lenght`: Longitud en caracteres de la descripción del producto.
- `product_photos_qty`: Cantidad de fotos publicadas en el anuncio.
- `product_weight_g`: Peso en gramos.
- `product_length_cm`: Longitud física en centímetros.
- `product_height_cm`: Altura en centímetros.
- `product_width_cm`: Ancho en centímetros.

### 7. `olist_sellers_dataset.csv`
Información de los vendedores asociados al marketplace.
- `seller_id`: Identificador único del vendedor (Primary Key).
- `seller_zip_code_prefix`: Código postal del vendedor (5 dígitos).
- `seller_city`: Ciudad donde opera el vendedor.
- `seller_state`: Estado donde opera el vendedor.

### 8. `olist_geolocation_dataset.csv`
Coordenadas espaciales de Brasil para mapeo logístico y geográfico.
- `geolocation_zip_code_prefix`: Primeros 5 dígitos del código postal.
- `geolocation_lat`: Latitud geográfica.
- `geolocation_lng`: Longitud geográfica.
- `geolocation_city`: Ciudad normalizada.
- `geolocation_state`: Estado normalizado.

### 9. `product_category_name_translation.csv`
Tabla auxiliar para traducción de nombres de categoría.
- `product_category_name`: Nombre en portugués (ej. `cama_mesa_banho`).
- `product_category_name_english`: Traducción al inglés (ej. `bed_bath_table`).

---

## 💡 Claves para el Modelado Algorítmico y Machine Learning

1. **Agregación por Cliente (`customer_unique_id`):**  
   Para clustering o segmentación (ej. modelo RFM: Recencia, Frecuencia, Valor Monetario), es indispensable agrupar por `customer_unique_id` y no por `customer_id`.
2. **Filtrado de Órdenes Válidas:**  
   Para métricas de ventas y LTV, considerar únicamente órdenes con `order_status = 'delivered'`.
3. **Cálculo de Tiempos Logísticos:**  
   Tiempo real de entrega = `order_delivered_customer_date` - `order_purchase_timestamp`.  
   Diferencia frente a lo prometido = `order_delivered_customer_date` - `order_estimated_delivery_date`.

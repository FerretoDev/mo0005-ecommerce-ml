-- schema.sql: estructuras del proyecto MO-0005 (PostgreSQL)
-- Orden de carga: translation, customers, sellers, products, orders,
-- order_items, order_payments, order_reviews, geolocation.

CREATE SCHEMA IF NOT EXISTS olist;
SET search_path TO olist;

CREATE TABLE product_category_name_translation (
  product_category_name         VARCHAR(50) PRIMARY KEY,
  product_category_name_english VARCHAR(50) NOT NULL
);

CREATE TABLE customers (
  customer_id              VARCHAR(32) PRIMARY KEY,
  customer_unique_id       VARCHAR(32) NOT NULL,
  customer_zip_code_prefix VARCHAR(5)  NOT NULL,
  customer_city            VARCHAR(50) NOT NULL,
  customer_state           CHAR(2)     NOT NULL
);

CREATE TABLE sellers (
  seller_id              VARCHAR(32) PRIMARY KEY,
  seller_zip_code_prefix VARCHAR(5)  NOT NULL,
  seller_city            VARCHAR(50) NOT NULL,
  seller_state           CHAR(2)     NOT NULL
);

CREATE TABLE products (
  product_id                 VARCHAR(32) PRIMARY KEY,
  product_category_name      VARCHAR(50),  -- relacion logica (no FK)
  product_name_lenght        INTEGER,      -- se conserva el nombre original
  product_description_lenght INTEGER,      -- se conserva el nombre original
  product_photos_qty         INTEGER,
  product_weight_g           INTEGER,
  product_length_cm          INTEGER,
  product_height_cm          INTEGER,
  product_width_cm           INTEGER
);

CREATE TABLE orders (
  order_id                      VARCHAR(32) PRIMARY KEY,
  customer_id                   VARCHAR(32) NOT NULL REFERENCES customers (customer_id),
  order_status                  VARCHAR(11) NOT NULL,
  order_purchase_timestamp      TIMESTAMP   NOT NULL,
  order_approved_at             TIMESTAMP,
  order_delivered_carrier_date  TIMESTAMP,
  order_delivered_customer_date TIMESTAMP,
  order_estimated_delivery_date TIMESTAMP   NOT NULL
);

CREATE TABLE order_items (
  order_id            VARCHAR(32)   NOT NULL REFERENCES orders (order_id),
  order_item_id       INTEGER       NOT NULL,
  product_id          VARCHAR(32)   NOT NULL REFERENCES products (product_id),
  seller_id           VARCHAR(32)   NOT NULL REFERENCES sellers (seller_id),
  shipping_limit_date TIMESTAMP     NOT NULL,
  price               NUMERIC(10,2) NOT NULL,
  freight_value       NUMERIC(10,2) NOT NULL,
  PRIMARY KEY (order_id, order_item_id)
);

CREATE TABLE order_payments (
  order_id             VARCHAR(32)   NOT NULL REFERENCES orders (order_id),
  payment_sequential   INTEGER       NOT NULL,
  payment_type         VARCHAR(20)   NOT NULL,
  payment_installments INTEGER       NOT NULL,
  payment_value        NUMERIC(10,2) NOT NULL,
  PRIMARY KEY (order_id, payment_sequential)
);

CREATE TABLE order_reviews (
  review_id               VARCHAR(32)  NOT NULL,
  order_id                VARCHAR(32)  NOT NULL REFERENCES orders (order_id),
  review_score            INTEGER      NOT NULL,
  review_comment_title    VARCHAR(50),
  review_comment_message  VARCHAR(300),
  review_creation_date    TIMESTAMP    NOT NULL,
  review_answer_timestamp TIMESTAMP    NOT NULL,
  PRIMARY KEY (review_id, order_id)
);

CREATE TABLE geolocation (
  geolocation_zip_code_prefix VARCHAR(5)       NOT NULL,
  geolocation_lat             DOUBLE PRECISION NOT NULL,
  geolocation_lng             DOUBLE PRECISION NOT NULL,
  geolocation_city            VARCHAR(50)      NOT NULL,
  geolocation_state           CHAR(2)          NOT NULL
);

CREATE INDEX idx_orders_customer   ON orders (customer_id);
CREATE INDEX idx_items_product     ON order_items (product_id);
CREATE INDEX idx_items_seller      ON order_items (seller_id);
CREATE INDEX idx_reviews_order     ON order_reviews (order_id);
CREATE INDEX idx_customers_unique  ON customers (customer_unique_id);
CREATE INDEX idx_geo_zip           ON geolocation (geolocation_zip_code_prefix);

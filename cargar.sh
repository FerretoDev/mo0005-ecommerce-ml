#!/usr/bin/env bash
# Levanta PostgreSQL (Docker), recrea el esquema olist, carga los 9 CSV,
# crea las vistas y valida los conteos de filas.
#
# Uso:
#   ./cargar.sh          # levanta y carga la base
#   ./cargar.sh --kpis   # además ejecuta kpis/kpis.sql y guarda datos/resultados_kpis.txt
set -euo pipefail

cd "$(dirname "$0")"

CONTENEDOR="olist-db"
RUN_KPIS=0
case "${1:-}" in
  "") ;;
  --kpis) RUN_KPIS=1 ;;
  *) echo "Uso: $0 [--kpis]" >&2; exit 2 ;;
esac

psql_db() { docker compose exec -T olist-db psql -U postgres -d postgres -v ON_ERROR_STOP=1 "$@"; }

echo "==> Levantando el contenedor"
docker compose up -d

echo "==> Esperando a que PostgreSQL esté healthy"
for _ in $(seq 1 60); do
  estado=$(docker inspect -f '{{.State.Health.Status}}' "$CONTENEDOR" 2>/dev/null || echo "starting")
  [ "$estado" = "healthy" ] && break
  sleep 2
done
if [ "${estado:-}" != "healthy" ]; then
  echo "ERROR: el contenedor $CONTENEDOR no llegó a estar healthy (estado: ${estado:-desconocido})" >&2
  exit 1
fi

echo "==> Recreando el esquema olist"
psql_db -q -c "DROP SCHEMA IF EXISTS olist CASCADE;"
psql_db -q -f /datos/schema.sql

echo "==> Cargando los CSV"
# tabla:archivo (orden respetando las llaves foráneas)
CARGAS=(
  "product_category_name_translation:product_category_name_translation"
  "customers:olist_customers_dataset"
  "sellers:olist_sellers_dataset"
  "products:olist_products_dataset"
  "orders:olist_orders_dataset"
  "order_items:olist_order_items_dataset"
  "order_payments:olist_order_payments_dataset"
  "order_reviews:olist_order_reviews_dataset"
  "geolocation:olist_geolocation_dataset"
)
for par in "${CARGAS[@]}"; do
  tabla="${par%%:*}"
  archivo="${par##*:}"
  echo "   - olist.${tabla}"
  psql_db -q -c "\copy olist.${tabla} FROM '/datos/${archivo}.csv' CSV HEADER"
done

echo "==> Creando las vistas"
psql_db -q -f /datos/views.sql

echo "==> Actualizando estadísticas (ANALYZE)"
# Sin esto el planificador elige planes malos sobre las vistas y los KPI tardan minutos.
psql_db -q -c "ANALYZE;"

echo "==> Validando conteos de filas"
declare -A ESPERADO=(
  [orders]=99441
  [customers]=99441
  [order_items]=112650
  [order_payments]=103886
  [order_reviews]=99224
  [products]=32951
  [sellers]=3095
  [geolocation]=1000163
  [product_category_name_translation]=71
)
printf "%-36s %12s %12s  %s\n" "tabla" "filas" "esperadas" "estado"
fallos=()
for tabla in orders customers order_items order_payments order_reviews products sellers geolocation product_category_name_translation; do
  filas=$(psql_db -t -A -c "SELECT COUNT(*) FROM olist.${tabla};" | tr -d '[:space:]')
  if [ "$filas" = "${ESPERADO[$tabla]}" ]; then estado="OK"; else estado="NO COINCIDE"; fallos+=("$tabla"); fi
  printf "%-36s %12s %12s  %s\n" "$tabla" "$filas" "${ESPERADO[$tabla]}" "$estado"
done
if [ "${#fallos[@]}" -gt 0 ]; then
  echo "ERROR: conteos que no coinciden: ${fallos[*]}" >&2
  exit 1
fi

if [ "$RUN_KPIS" -eq 1 ]; then
  echo "==> Ejecutando kpis/kpis.sql (salida en datos/resultados_kpis.txt)"
  psql_db < kpis/kpis.sql | tee datos/resultados_kpis.txt
fi

echo "==> Listo. Base disponible en localhost:5432 (usuario postgres, base postgres, esquema olist)"

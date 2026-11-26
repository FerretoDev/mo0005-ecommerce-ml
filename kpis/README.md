# kpis

Consultas de los 11 KPI del proyecto.

- [`kpis.sql`](kpis.sql): consultas SQL de los 11 KPI (usan las vistas de [`datos/views.sql`](../datos/views.sql)).

Las definiciones y fórmulas de cada KPI están en la sección 4.2 del informe (`documento/latex/main.tex`) y las consultas en el Anexo B.

Para ejecutar las consultas y guardar la salida en `datos/resultados_kpis.txt`: `./cargar.sh --kpis` desde la raíz del repositorio.

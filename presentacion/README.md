# Presentación de la defensa

- `presentacion.pptx`: la presentación en PowerPoint (26 diapositivas, 16:9), editable. Trae animaciones de entrada (los elementos aparecen con cada clic), transiciones y notas del orador con el guion de cada diapositiva.
- `presentacion.pdf`: la misma presentación en PDF, para subir a Mediación Virtual (sin animaciones).

## Orden y tiempos (unos 18 minutos)

Cada parte empieza con una diapositiva divisoria y el pie de página dice quién expone.

| Parte | Diapositivas | Expone | Contenido |
| --- | --- | --- | --- |
| Inicio | 1–2 | Marcos | Portada y contenido |
| 1 | 3–9 | Marcos | Olist, problema, objetivos e hipótesis, CRISP-DM, modelo relacional y carga en PostgreSQL, flujo de limpieza de datos |
| 2 | 10–14 | Moya | Modelo 1: planteamiento y flujo de agrupación de pedidos, elección de k, segmentos y prueba de H4 |
| 3 | 15–19 | Sebastián | Modelo 2: planteamiento y flujo de predicción de retrasos, resultados (AUC), uso por niveles de riesgo y cambio geográfico |
| 4 | 20–26 | Kendall | 11 KPI, dashboard, contraste de hipótesis, conclusiones y recomendaciones, referencias y preguntas |

## Cómo usarla

- **Presentar:** F5 en PowerPoint. Cada clic muestra el siguiente bloque; las notas (guion) se ven en la vista del moderador.
- **Editar:** se puede cambiar todo directamente en PowerPoint. Los gráficos son nativos (clic derecho → Editar datos).
- **Animaciones:** se ven y se ajustan en Animaciones → Panel de animación.

## Regenerarla desde cero (opcional)

Los archivos de `fuente/` generan la presentación desde los datos del proyecto. Si se edita a mano en PowerPoint, no hace falta regenerarla.

```bash
cd presentacion/fuente
npm i pptxgenjs          # solo la primera vez
node generar.js          # crea ../presentacion.pptx
python3 animar.py ../presentacion.pptx   # agrega animaciones y transiciones
```

`muestra_segmentos.json` es una muestra aleatoria de 260 pedidos reales (días de entrega, precio y segmento) usada en el gráfico de dispersión de la diapositiva 13.

# Guía de Trabajo y Buenas Prácticas — Proyecto MO-0005

Esta guía contiene los lineamientos elementales de trabajo para el equipo de desarrollo del proyecto **MO-0005: Análisis de Clientes E-commerce**. Sirve tanto como manual de supervivencia para nosotros (los integrantes del equipo) como contexto operativo para asistentes de IA.

---

## 📌 Contexto Rápido del Repositorio
- **Objetivo:** Análisis de datos y Machine Learning sobre clientes de e-commerce usando el dataset de Olist.
- **Herramientas principales:** KNIME Analytics Platform, PostgreSQL (Docker), Power BI, Git / GitHub.
- **Documento formal:** Se trabaja en OneDrive (los archivos `.docx` locales están ignorados en Git).

---

## 🚀 Flujo Diario de Trabajo con Git (Paso a Paso)

Para no perder trabajo ni sobreescribir lo de los compañeros, sigue siempre este orden:

```bash
# 1. SIEMPRE antes de empezar a trabajar o abrir KNIME:
git pull origin main

# 2. Revisa el estado de tus archivos locales:
git status

# 3. Agrega únicamente los archivos que modificaste (evita 'git add .' a ciegas):
git add ruta/al/archivo

# 4. Haz un commit atómico con un mensaje claro:
git commit -m "tipo(alcance): descripción breve y clara"

# 5. Sube tus cambios a GitHub:
git push origin main
```

---

## ✍️ Cómo Hacer un Buen Commit (Commits Atómicos)

Un **commit atómico** significa que cada commit debe contener **un solo cambio lógico bien delimitado**. No mezcles en un solo commit la limpieza de datos, un cambio en la documentación y un nuevo nodo en KNIME.

### Formato recomendado (Conventional Commits):
```text
<tipo>(<alcance opcional>): <descripción concisa en minúsculas y presente>
```

### Tipos permitidos en este proyecto:
- **`feat:`** Una nueva característica, modelo o lógica agregada (ej: `feat(knime): agregar clustering k-means para clientes en 02-Clustering`).
- **`fix:`** Corrección de un error o cálculo incorrecto (ej: `fix(knime): corregir join de pedidos con pagos en 01-ETL`).
- **`data:`** Cambios o adición de datos, muestras o diccionarios (ej: `data: agregar traduccion de categorias faltantes`).
- **`docs:`** Cambios en documentación, `README.md` o guías (ej: `docs: actualizar formulas de ltv y churn en kpis/`).
- **`chore:`** Tareas de mantenimiento, `.gitignore` o configuraciones (ej: `chore(git): ignorar temporales de knime`).

### Ejemplos prácticos:
- ❌ **Malos:** `cambios`, `subiendo cosas`, `arffff`, `knime listo`, `update`, `final definitivo 2`
- ✅ **Buenos:**
  - `feat(knime): estructurar pipeline de normalizacion de variables en 01-ETL`
  - `docs: agregar descripcion de columnas del dataset en datos/LEER.md`
  - `fix(kpis): corregir formula de ticket promedio por cliente`

---

## ⚠️ Reglas Críticas para Trabajar con KNIME y Git

> **REGLA DE ORO:** Cada workflow de KNIME lo edita **una sola persona a la vez**. Antes de abrir un workflow, correr `git pull`. No editar el mismo workflow simultáneamente entre dos personas.

### ¿Por qué?
A diferencia de archivos de código (`.py`, `.java`), un workflow de KNIME es un conjunto de archivos XML y configuraciones gráficas. Si dos personas editan el mismo workflow al mismo tiempo, **Git no puede resolver el conflicto automáticamente** y el archivo `.knime` se corrompe.

### Lista de verificación antes de tocar KNIME:
1. **Avisar en el chat del equipo:** Di qué workflow vas a abrir (ej: *"Compañeros, voy a trabajar en `02-Clustering`"*).
2. **Hacer `git pull origin main`** antes de abrir el flujo en KNIME.
3. **Resetear nodos pesados antes de guardar:**
   - En KNIME, haz clic derecho sobre nodos con tablas intermedias pesadas y selecciona **Reset**.
   - Esto evita que los datos en memoria se guarden en el disco e inflen el repositorio con megabytes innecesarios.
4. **Al terminar:** Guarda el flujo en KNIME, ciérralo, haz tu commit y `git push`. Avisa al equipo que el workflow ya está libre.

---

## 🛡️ Archivos que NUNCA deben subirse a Git

El archivo `.gitignore` ya está configurado para protegerte, pero ten presente no forzarlos:
- **`.knimeLock`:** Archivo temporal que KNIME crea al abrir un flujo. Si lo subes, a tus compañeros les saldrá que el workflow está bloqueado.
- **`knime/.metadata/`:** Configuraciones internas de tu máquina y del IDE.
- **`**/data/**` y `**/internal/**`:** Caché de ejecución interna de KNIME.
- **`*.knwf`:** Archivos comprimidos exportados de KNIME (versionamos los flujos en carpetas abiertas dentro de `/knime`).
- **`*.docx`:** El documento formal del proyecto se edita exclusivamente en línea en OneDrive.

---

## 📂 ¿Dónde colocar cada cosa?

- **/datos:** Scripts SQL de PostgreSQL (`schema.sql`, `views.sql`), `resultados_kpis.txt` y notas del origen de los datos.
- **/knime/datos:** Datasets `.csv` de Olist (versionados). Van dentro de `knime/` porque KNIME no permite rutas relativas fuera de su workspace. La salida `ordenes_etl.csv` (96 144 pedidos, unos 33 MB) también está versionada para que 02-Clustering y 03-Prediccion la lean sin correr el ETL; si cambia el ETL, regenerarla y commitearla con `git -c core.autocrlf=false add` para que Git no reescriba los finales de línea.
- **/knime/01-ETL:** Flujos de limpieza, cruces y preprocesamiento (ver `documento/knime-carga-csv.md`).
- **/knime/02-Clustering:** Modelo 1, no supervisado: k-means sobre pedidos (ver `documento/guia-modelo1-knime.md`).
- **/knime/03-Prediccion:** Modelo 2, supervisado: predicción de entrega tardía (ver `documento/guia-modelo2-knime.md`).
- **/knime/04-KPIs:** Automatización de métricas de negocio para Power BI.
- **/kpis:** Documentos de texto o tablas con las fórmulas matemáticas y lógica de negocio.
- **/diagrama-er:** Diagramas relacionales de las tablas de Olist y scripts SQL.
- **/documento:** Guías o enlaces del documento formal en OneDrive.

---

## 🆘 Comandos Rápidos de Supervivencia

| Situación | Comando |
| :--- | :--- |
| Ver qué archivos cambiaron | `git status` |
| Ver las diferencias exactas en texto | `git diff` |
| Descargar los últimos cambios del equipo | `git pull origin main` |
| Deshacer cambios no guardados en un archivo | `git restore <archivo>` |
| Ver los últimos commits realizados | `git log -n 5 --oneline` |

> ⚠️ **Si al hacer `git push` te sale error de rechazo:**  
> **NO uses `--force`**. Significa que un compañero subió cambios antes que tú. Corre `git pull origin main` primero, revisa que todo esté en orden y vuelve a hacer `git push`.

---

## 💡 Notas Prácticas (aprendidas en el ETL)

- **Rutas de CSV en KNIME:** los nodos *CSV Reader* usan `Relative to → Current workflow` con rutas como `../datos/<archivo>.csv` (apunta a `knime/datos/`). `../../datos` falla porque sale del workspace.
- **Códigos postales siempre como String:** `customer_zip_code_prefix`, `seller_zip_code_prefix` y `geolocation_zip_code_prefix` se leen como **String** para no perder ceros a la izquierda (`01037`). Si KNIME los vuelve a adivinar como Integer, se corrige en la sección *Transformation* del CSV Reader.
- **Mover o renombrar los CSV con Git:** usar `git -c core.autocrlf=false add -A ...` y `git -c core.autocrlf=false commit`. Con `autocrlf=true` Git convierte CRLF a LF y reescribe los 125 MB en vez de registrar un renombrado.
- **Antes de guardar en KNIME:** Reset (F8) a todos los nodos y cerrar KNIME. Si se edita el XML de un workflow desde fuera de KNIME, KNIME debe estar cerrado.

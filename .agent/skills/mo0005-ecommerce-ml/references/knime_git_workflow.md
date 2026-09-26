# Protocolo de Trabajo KNIME & Git

Este documento detalla los procedimientos y solución de problemas para colaborar en equipo sobre workflows de **KNIME Analytics Platform** usando **Git y GitHub**.

---

## 🚫 ¿Por qué los flujos de KNIME causan conflictos en Git?

Un workflow de KNIME guardado en disco no es un archivo único de texto plano, sino una carpeta estructurada con:
- `workflow.knime`: Documento XML con la topología del grafo de nodos y conexiones.
- `settings.xml` por cada nodo: Parámetros serializados en XML.
- Carpetas de datos y caché: Estados en memoria y tablas temporales.

Si dos personas abren y modifican el mismo workflow en paralelo:
1. Las coordenadas visuales y los identificadores internos de nodos (`#1`, `#2`, etc.) cambian de forma incompatible.
2. Git detecta colisiones complejas en múltiples archivos XML dentro de subcarpetas.
3. El auto-merge de Git suele corromper la estructura XML, haciendo que KNIME no pueda volver a abrir el flujo.

---

## 📋 Reglas Obligatorias del Equipo

1. **Exclusividad:** Un solo miembro del equipo edita un workflow determinado a la vez.
2. **Aviso en el canal:** Antes de abrir un flujo en KNIME, notificar al equipo:  
   *«Voy a trabajar en `02-Clustering`»*.
3. **Sincronización:** Ejecutar `git pull origin main` inmediatamente antes de abrir KNIME.
4. **Liberación:** Al concluir, guardar, cerrar KNIME, hacer commit atómico y `git push origin main`. Notificar al equipo que el flujo está disponible.

---

## 🧹 Procedimiento de Limpieza: Resetear Nodos antes de Guardar

Para mantener el repositorio liviano y evitar subir gigabytes de datos en caché:

1. En KNIME, antes de cerrar el workflow, haz clic derecho sobre los nodos ejecutados (en verde) que procesen tablas intermedias voluminosas.
2. Selecciona **Reset** (el nodo pasará a estado amarillo).
3. Guarda el flujo con `Ctrl + S`.
4. Cierra la pestaña del workflow en KNIME.

> **Nota:** Si un nodo requiere mucho tiempo de cómputo para reejecutarse, comunícalo al equipo. Sin embargo, por defecto, el `.gitignore` ya excluye `**/data/**` y `**/internal/**` para no versionar tablas en caché.

---

## 🛡️ Archivos Críticos en `.gitignore`

- `.knimeLock`: Creado automáticamente por KNIME al abrir un workflow. **Nunca** debe commitearse (bloquearía el flujo para otros miembros).
- `.metadata/`: Metadatos del workspace local de Eclipse/KNIME.
- `*.knwf`: Archivos comprimidos exportados (los flujos se versionan en carpetas abiertas dentro de `/knime`).
- `*.docx` y `~$*.docx`: El documento formal se gestiona en OneDrive.

---

## 🆘 Resolución de Problemas Frecuentes

### 1. `git push` rechazado (non-fast-forward)
```bash
# NO uses git push --force bajo ninguna circunstancia.
git pull origin main
# Si no hubo edición simultánea del mismo workflow, Git combinará limpiamente.
git push origin main
```

### 2. Aparece error de que el workflow está bloqueado en KNIME
Verifica que no exista un archivo oculto `.knimeLock` en la carpeta del workflow. Si KNIME se cerró de forma forzada, el archivo puede haber quedado rezagado localmente:
```powershell
Get-ChildItem -Path knime -Filter ".knimeLock" -Recurse -Force
```
Elimina el `.knimeLock` residual local únicamente si KNIME está cerrado.

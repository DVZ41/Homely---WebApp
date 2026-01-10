# 📝 COMANDOS DIARIOS

Todo lo que necesitas saber sobre los comandos que usarás todos los días.

---

## 🎯 COMANDOS PRINCIPALES

### Desarrollo

#### `npm run dev` - Iniciar servidor
**¿Qué hace?**
Abre un servidor local y prepara el código para desarrollo.

**Cuándo usarlo:**
Siempre que quieras trabajar o probar.

**Comando:**
```bash
npm run dev
```

**Output esperado:**
```
VITE v5.4.21  ready in 1234 ms

➜  Local:   http://localhost:5173/
```

**Luego:**
Abre http://localhost:5173 en tu navegador.

**¿Cómo terminar?**
Presiona `Ctrl + C` en la terminal.

---

#### `npm run build` - Compilar para producción
**¿Qué hace?**
Crea una versión optimizada lista para publicar.

**Cuándo usarlo:**
Antes de hacer push para verificar que todo funciona.

**Comando:**
```bash
npm run build
```

**Output esperado:**
```
✓ 2233 modules transformed.
✓ built in 3.29s
```

---

### Código

#### `npm run lint` - Verificar errores
**¿Qué hace?**
Revisa tu código y te dice si hay problemas.

**Cuándo usarlo:**
Antes de hacer commit.

**Comando:**
```bash
npm run lint
```

**Output esperado (sin errores):**
```
✓ No problems found
```

**Output esperado (con errores):**
```
❌ src/components/MyComponent.tsx
  Line 5: 'console.log' found
  Line 12: Variable 'unused' never used
```

---

#### `npm run format` - Formatea código
**¿Qué hace?**
Hace tu código bonito (indentación, espacios, etc).

**Cuándo usarlo:**
Después de escribir mucho código.

**Comando:**
```bash
npm run format
```

**Resultado:**
- ✅ Indentación correcta
- ✅ Espacios uniformes
- ✅ Comillas consistentes
- ✅ Punto y coma donde falta

---

## 🔧 GIT - COMANDOS DE CONTROL DE VERSIÓN

### Estado

#### `git status` - Ver qué cambió
**¿Qué hace?**
Muestra archivos modificados, nuevos, eliminados.

**Comando:**
```bash
git status
```

**Output esperado:**
```
On branch feature/buscar-tareas

Changes not staged for commit:
  modified:   src/components/TaskList.tsx
  modified:   src/App.tsx

Untracked files:
  new file:   src/components/Search.tsx
```

---

#### `git diff` - Ver exactamente qué cambió
**¿Qué hace?**
Muestra línea por línea qué se modificó.

**Comando:**
```bash
git diff src/components/TaskList.tsx
```

**Output:**
```
- console.log('old');
+ console.log('new');
```

---

### Trabajar con Ramas

#### `git branch` - Ver ramas
**¿Qué hace?**
Lista todas tus ramas locales.

**Comando:**
```bash
git branch
```

**Output:**
```
  main
  feature/buscar-tareas
* feature/crear-usuario     ← Tu rama actual
```

---

#### `git checkout -b feature/nombre` - Crear rama nueva
**¿Qué hace?**
Crea una rama nueva y se cambia a ella.

**Comando:**
```bash
git checkout -b feature/buscar-tareas
```

**Output:**
```
Switched to a new branch 'feature/buscar-tareas'
```

---

#### `git checkout main` - Cambiar de rama
**¿Qué hace?**
Cambia a la rama main.

**Comando:**
```bash
git checkout main
```

---

### Guardar Cambios

#### `git add .` - Preparar cambios
**¿Qué hace?**
Prepara todos los cambios para guardar (commit).

**Comando:**
```bash
git add .
```

**Output:** (ninguno si es exitoso)

---

#### `git commit -m "mensaje"` - Guardar cambios
**¿Qué hace?**
Guarda tus cambios localmente con un mensaje.

**Comando:**
```bash
git commit -m "feat: agregar búsqueda de tareas"
```

**Output:**
```
[feature/buscar-tareas 1a2b3c4] feat: agregar búsqueda de tareas
 2 files changed, 50 insertions(+)
```

**Nota:** Se ejecutan automáticamente:
- ✅ ESLint --fix
- ✅ Prettier --write
- ✅ Validación TypeScript

---

### Subir Cambios

#### `git push origin nombre-rama` - Subir a GitHub
**¿Qué hace?**
Sube tus cambios al servidor (GitHub).

**Comando:**
```bash
git push origin feature/buscar-tareas
```

**Output:**
```
Enumerating objects: 5, done.
Writing objects: 100% (5/5), 580 bytes | 580.00 KiB/s, done.
remote: Create a pull request for 'feature/buscar-tareas' on GitHub by visiting:
remote: https://github.com/.../pull/new/feature/buscar-tareas
```

---

#### `git pull origin main` - Descargar cambios
**¿Qué hace?**
Descarga cambios que otros subieron a main.

**Comando:**
```bash
git pull origin main
```

**Output:**
```
Updating 1a2b3c4..5e6f7g8
Fast-forward
 src/App.tsx | 10 ++++++++--
 1 file changed, 8 insertions(+), 5 deletions(-)
```

---

## 📋 FLUJO TÍPICO DEL DÍA

### Mañana (Empezar el trabajo)
```bash
# 1. Cambiar a main
git checkout main

# 2. Descargar cambios de otros
git pull origin main

# 3. Crear tu rama
git checkout -b feature/mi-trabajo

# 4. Iniciar servidor
npm run dev
```

### Durante el día (Hacer cambios)
```bash
# Editas archivos en tu editor
# Pruebas en navegador (http://localhost:5173)
# Todo funciona ✅
```

### Antes de hacer commit (Validar)
```bash
# 1. Verificar sintaxis
npm run lint

# 2. Formatar código
npm run format

# 3. Compilar para producción
npm run build
```

### Hacer commit (Guardar cambios)
```bash
# 1. Preparar cambios
git add .

# 2. Guardar con mensaje
git commit -m "feat: agregar búsqueda de tareas"

# ¡Se ejecutan automáticamente!
# ✅ ESLint --fix
# ✅ Prettier --write
```

### Fin del día (Subir cambios)
```bash
# Subir a GitHub
git push origin feature/mi-trabajo

# Abrir Pull Request en GitHub
# (GitHub te mostrará un botón para esto)
```

---

## 🚨 ERRORES COMUNES

### Error: "npm not found"
**Problema:** Node.js no está instalado.
**Solución:** Descarga Node.js desde nodejs.org

---

### Error: "Port 5173 already in use"
**Problema:** Otro proyecto usa el mismo puerto.
**Solución:**
```bash
# Opción 1: Cerrar otra ventana que tiene npm run dev
# Opción 2: Usar otro puerto
npm run dev -- --port 3000
```

---

### Error: "git not found"
**Problema:** Git no está instalado.
**Solución:** Descarga Git desde git-scm.com

---

### Error: "commit failed"
**Problema:** Hay un error en tu código que ESLint detectó.
**Solución:**
```bash
# Ver qué está mal
npm run lint

# ESLint intenta arreglarlo
npm run lint --fix

# Luego intenta commit de nuevo
git add .
git commit -m "feat: ..."
```

---

### Error: "merge conflict"
**Problema:** Tu código conflictúa con el de otro.
**Solución:** Abre el archivo y busca `<<<<<<` y elige qué versión mantener.

---

## ✅ CHECKLIST DIARIO

```
MAÑANA
□ git checkout main
□ git pull origin main
□ git checkout -b feature/...
□ npm run dev

DESARROLLO
□ Editar código
□ Probar en navegador
□ npm run lint ✅
□ npm run build ✅

FIN DEL DÍA
□ git add .
□ git commit -m "feat: ..."
□ git push origin feature/...
□ Abrir PR en GitHub
```

---

## 🎯 RESUMEN RÁPIDO

| Quiero... | Comando |
|-----------|---------|
| Iniciar servidor | `npm run dev` |
| Compilar código | `npm run build` |
| Verificar errores | `npm run lint` |
| Formater código | `npm run format` |
| Ver cambios | `git status` |
| Crear rama | `git checkout -b feature/xxx` |
| Guardar cambios | `git add . && git commit -m "msg"` |
| Subir cambios | `git push origin feature/xxx` |
| Descargar cambios | `git pull origin main` |

---

**¿Lista para codear? → Lee [ARQUITECTURA.md](../architecture/ARQUITECTURA.md) para entender cómo funciona el código. 🚀**

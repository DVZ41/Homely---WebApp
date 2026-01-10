# 🐛 SOLUCIÓN DE PROBLEMAS

Problemas comunes y cómo resolverlos.

---

## 🔴 ERRORES DE BUILD

### "npm run build falla"

**Error típico:**
```
error TS2322: Type 'number' is not assignable to type 'string'
```

**Soluciones:**
```bash
# 1. Ver el error completo
npm run build

# 2. Encontrar la línea con error
# (el error dice "src/components/MyComponent.tsx(15)")

# 3. Arreglarlo
# Cambiar el tipo o el valor

# 4. Validar
npm run build
```

---

### "Module not found"

**Error típico:**
```
Cannot find module '@/components/TaskList' or its corresponding type declarations.
```

**Soluciones:**
```
1. Verificar que el archivo existe
   ✅ components/TaskList.tsx

2. Verificar que el nombre es exacto
   ❌ components/tasklist.tsx
   ✅ components/TaskList.tsx

3. Verificar el import
   ❌ import TaskList from './TaskList'
   ✅ import { TaskList } from './TaskList'

4. Verificar el path
   ❌ import { TaskList } from 'components/TaskList'
   ✅ import { TaskList } from '@/components/TaskList'
```

---

### "Type error in tsconfig"

**Solución:**
```bash
# Borrar y reinstalar
rm -r node_modules
npm install

# Limpiar build
npm run build
```

---

## 🟡 ERRORES DE EJECUCIÓN

### "Port 5173 already in use"

**Problema:** Otro proceso usa el puerto.

**Soluciones:**

**Opción 1 - Encontrar y matar el proceso:**
```bash
# Ver qué usa el puerto
netstat -ano | findstr :5173

# Matar el proceso (reemplaza PID)
taskkill /PID 1234 /F

# Intentar de nuevo
npm run dev
```

**Opción 2 - Usar otro puerto:**
```bash
npm run dev -- --port 3000
```

---

### "localStorage is not defined"

**Problema:** Intentas acceder a localStorage en código que se ejecuta en servidor.

**Solución:**
```tsx
// ❌ MAL - Se ejecuta en servidor
const data = localStorage.getItem('key')

// ✅ BIEN - Solo en cliente
useEffect(() => {
  const data = localStorage.getItem('key')
  // ...
}, [])
```

---

### "Cannot read property 'map' of undefined"

**Problema:** Intentas usar `.map()` en algo que es `undefined`.

**Solución:**
```tsx
// ❌ MAL
{tasks.map(task => <TaskCard key={task.id} task={task} />)}

// ✅ BIEN
{tasks?.map(task => <TaskCard key={task.id} task={task} />)}

// ✅ MEJOR
{Array.isArray(tasks) && tasks.map(task => <TaskCard key={task.id} task={task} />)}
```

---

## 🟠 ERRORES DE GIT

### "git not found"

**Solución:** Instala Git desde https://git-scm.com/

---

### "merge conflict"

**Problema:** Tu código conflictúa con código de otro.

**Archivo con conflicto:**
```
<<<<<<< HEAD
tu código aquí
=======
código de otro
>>>>>>> rama-del-otro
```

**Solución:**
```bash
# 1. Abre el archivo
# 2. Busca <<<<<<
# 3. Elige qué versión mantener
# 4. Elimina los marcadores

# 5. Guarda el archivo
# 6. Continúa
git add .
git commit -m "fix: resolver conflicto de merge"
```

---

### "Changes not staged for commit"

**Problema:** Hiciste cambios pero no están preparados.

**Solución:**
```bash
# Ver cambios
git status

# Preparar cambios
git add .

# Guardar cambios
git commit -m "feat: descripción"
```

---

### "Your branch is ahead of origin/main"

**Problema:** Hiciste commits pero no los subiste.

**Solución:**
```bash
# Subir cambios
git push origin nombre-rama

# O si es main:
git push origin main
```

---

## 🟢 ERRORES DE LINTING

### "ESLint: no-console"

**Error típico:**
```
warning  unexpected console statement  no-console
```

**Problema:** Hay un `console.log()` en el código.

**Solución:**
```tsx
// ❌ ANTES
console.log('Debug:', data)

// ✅ DESPUÉS - Eliminar el console.log
// (si necesitas debug, usa el navegador)
```

---

### "ESLint: no-unused-vars"

**Error típico:**
```
warning  'myVariable' is defined but never used  no-unused-vars
```

**Problema:** Declaraste una variable pero no la usas.

**Soluciones:**

```tsx
// ❌ PROBLEMA
const myVariable = 'algo'
// nunca la usas

// ✅ SOLUCIÓN 1 - Usar la variable
const myVariable = 'algo'
console.log(myVariable)

// ✅ SOLUCIÓN 2 - Eliminarla
// (si no la necesitas)
```

---

### "Prettier formatting required"

**Error:** El código no está formateado correctamente.

**Solución:**
```bash
# Formatea automáticamente
npm run format

# O ESLint intenta arreglarlo
npm run lint --fix
```

---

## 🔵 ERRORES DE DESARROLLO

### "Componente no aparece en pantalla"

**Checklist:**
```
1. ¿El componente está importado en App.tsx?
   ❌ import { MyComponent } from './components'
   ✅ Check que existe

2. ¿Está renderizado?
   ✅ <MyComponent />

3. ¿El estado se actualiza?
   Abre DevTools (F12) → Components
   ✅ Verifica que el estado cambia

4. ¿Hay condicionales que lo oculten?
   {mostrar && <MyComponent />}
   ✅ Verifica que "mostrar" es true
```

---

### "Cambios no se ven en el navegador"

**Soluciones (en orden):**
```
1. Refrescar el navegador
   F5 o Ctrl+R

2. Limpiar cache
   DevTools → Application → Clear storage → Clear all

3. Reiniciar dev server
   Ctrl+C en terminal
   npm run dev

4. Verificar que el archivo se guardó
   Ver el archivo en el editor
```

---

### "useState no funciona como espero"

**Problema:** El estado no se actualiza inmediatamente.

**Explicación:**
```tsx
// ❌ INTENCIÓN
const [count, setCount] = useState(0)

const handleClick = () => {
  setCount(count + 1)
  console.log(count)  // Aún es 0!
}

// React actualiza el estado DESPUÉS del evento
```

**Solución:**
```tsx
// ✅ CORRECTO
const [count, setCount] = useState(0)

const handleClick = () => {
  setCount(count + 1)
  // Si necesitas el nuevo valor:
  // setCount(prev => {
  //   console.log(prev + 1)
  //   return prev + 1
  // })
}

// Si necesitas reaccionar al cambio:
useEffect(() => {
  console.log('Count cambió a:', count)
}, [count])
```

---

### "Infinite loop en useEffect"

**Problema:** `useEffect` se ejecuta infinitamente.

**Causa:**
```tsx
// ❌ MAL - Sin dependencias
useEffect(() => {
  setData([...data])  // Actualiza data
})  // Se ejecuta siempre → data cambia → useEffect se ejecuta

// ❌ MAL - Objeto/array en dependencias
useEffect(() => {
  // ...
}, [{ id: 1 }])  // Objeto nuevo cada render → loop infinito
```

**Solución:**
```tsx
// ✅ BIEN - Con dependencias correctas
useEffect(() => {
  setData([...data])
}, [])  // Se ejecuta una sola vez

// ✅ BIEN - Dependencias simples
useEffect(() => {
  // ...
}, [userId])  // Se ejecuta cuando userId cambia
```

---

## 🟣 ERRORES DE LÓGICA

### "El filtro no funciona"

**Checklist:**
```
1. ¿El estado se actualiza?
   console.log(filtro) → ver en DevTools

2. ¿El componente re-renderiza?
   Abrir DevTools → React Profiler

3. ¿La lógica es correcta?
   tasks.filter(t => t.status === filtro)
   ✅ Verificar que filtro es igual al status

4. ¿Hay case-sensitivity?
   ❌ filtro: 'Activo' vs status: 'activo'
   ✅ Usar .toLowerCase()
```

---

### "localStorage no guarda"

**Checklist:**
```
1. ¿localStorage está disponible?
   typeof localStorage !== 'undefined'

2. ¿Hay espacio?
   localStorage está lleno (raro)
   Limpiar: DevTools → Application → Clear storage

3. ¿Se está guardando?
   useEffect(() => {
     localStorage.setItem('key', JSON.stringify(data))
   }, [data])
   ✅ Verificar que data cambia

4. ¿Se está cargando?
   useEffect(() => {
     const saved = localStorage.getItem('key')
     if (saved) setData(JSON.parse(saved))
   }, [])
```

---

## 📞 ERRORES GENERALES

### "Algo no funciona pero no hay error"

**Estrategia de debug:**
```
1. Abre DevTools (F12)
   → Console (ver si hay errores)
   → Network (ver si cargan recursos)
   → React DevTools (ver estado)

2. Añade console.log() estratégicamente
   console.log('aquí estamos')
   console.log('valor:', valor)

3. Usa React DevTools
   → Busca el componente
   → Ve sus props y estado

4. Reinicia todo
   npm run dev (nueva terminal)
   Limpia cache del navegador
```

---

### "Mi PR fue rechazado por ESLint"

**Solución rápida:**
```bash
# Dejar que ESLint arregle lo que pueda
npm run lint --fix

# Formatea el código
npm run format

# Verifica de nuevo
npm run lint

# Si aún falla:
# Abre el archivo y lee el error
# Arréglalo manualmente
```

---

## ✅ CHECKLIST GENERAL

Si algo no funciona:

```
□ npm run lint    (ver errores)
□ npm run build   (compilar)
□ npm run dev     (ver en navegador)
□ F12 → Console   (ver errores)
□ Limpiar cache   (Ctrl+Shift+R)
□ Reiniciar npm   (Ctrl+C, npm run dev)
□ git status      (ver cambios)
□ Revertir cambio (git checkout .)
```

---

## 📞 NECESITAS MÁS AYUDA?

1. Busca tu error en Google
2. Busca en StackOverflow
3. Lee la documentación oficial
4. Pregunta a tu equipo
5. Crea un issue en GitHub

**¡No tengas miedo de preguntar!** 🤝

---

**¡Espero haber resuelto tu problema!** 🚀

# 👥 CÓMO CONTRIBUIR

Guía paso a paso para aportar al proyecto HOMELY.

---

## 🎯 ¿CÓMO EMPIEZO?

### Escenario: Quiero agregar una nueva funcionalidad

**Paso 1: Crea una rama**
```bash
git checkout -b feature/buscar-tareas
```

**Paso 2: Haz cambios en tu código**
```
Edita archivos, crea componentes, etc.
```

**Paso 3: Valida tu código**
```bash
npm run lint
npm run format
npm run build
```

**Paso 4: Commit y push**
```bash
git add .
git commit -m "feat: agregar búsqueda de tareas"
git push origin feature/buscar-tareas
```

**Paso 5: Abre Pull Request**
```
GitHub → Botón "Compare & pull request"
Llena la descripción
Pide review
```

**Paso 6: Espera review y aprobación**

---

## 🌿 GIT WORKFLOW

### Tipos de Rama

**`feature/xxx`** - Nueva funcionalidad
```bash
git checkout -b feature/agregar-filtro-categorias
```

**`fix/xxx`** - Corrección de bug
```bash
git checkout -b fix/error-en-validacion
```

**`refactor/xxx`** - Mejora de código existente
```bash
git checkout -b refactor/simplificar-logica-tareas
```

**`docs/xxx`** - Cambios en documentación
```bash
git checkout -b docs/actualizar-readme
```

---

### Flujo Completo de Git

```bash
# 1. Empezar el día
git checkout main
git pull origin main

# 2. Crear rama
git checkout -b feature/mi-trabajo

# 3. HACER CAMBIOS EN EDITOR

# 4. Verificar qué cambió
git status
git diff

# 5. Pequeños commits durante el día
git add .
git commit -m "feat: parte 1 de la feature"
git commit -m "feat: parte 2 de la feature"

# 6. Antes de terminar: validar
npm run lint
npm run format
npm run build

# 7. Subir a GitHub
git push origin feature/mi-trabajo

# 8. Abre PR en GitHub
# (Copia el link que GitHub te muestra)
```

---

## 📝 COMMITS - Cómo Escribir Mensajes

### Formato Recomendado

```
<tipo>: <descripción breve>

<descripción larga opcional>
```

### Tipos de Commit

**`feat`** - Nueva funcionalidad
```bash
git commit -m "feat: agregar búsqueda de tareas"
```

**`fix`** - Corregir bug
```bash
git commit -m "fix: corregir error al borrar tarea"
```

**`refactor`** - Mejorar código sin cambiar funcionalidad
```bash
git commit -m "refactor: simplificar lógica de filtrado"
```

**`style`** - Cambios en formato (Prettier, ESLint)
```bash
git commit -m "style: aplicar prettier"
```

**`docs`** - Cambios en documentación
```bash
git commit -m "docs: actualizar CONTRIBUTING.md"
```

**`test`** - Agregar tests
```bash
git commit -m "test: agregar tests para búsqueda"
```

---

### Ejemplos Buenos vs Malos

✅ **BIEN**
```bash
git commit -m "feat: agregar filtro por categoría"
git commit -m "fix: corregir validación de email"
git commit -m "refactor: mejorar rendimiento de listado"
git commit -m "docs: actualizar guía de contribución"
```

❌ **MAL**
```bash
git commit -m "cambios"
git commit -m "fix bug"
git commit -m "Update App.tsx"
git commit -m "wip"  # Work in progress
```

---

## 🧩 CREAR UN NUEVO COMPONENTE

### Paso 1: Crear el archivo
```bash
# Crear archivo
# components/MiComponente.tsx
```

### Paso 2: Escribir el componente
```tsx
// components/MiComponente.tsx

import { useState } from 'react'
import { Button } from '@/components/ui/button'

// 1. Definir tipos (Props)
interface MiComponenteProps {
  titulo: string
  descripcion?: string
  onGuardar: (data: string) => void
}

// 2. Componente funcional
export function MiComponente({ 
  titulo, 
  descripcion, 
  onGuardar 
}: MiComponenteProps) {
  const [value, setValue] = useState('')
  
  const handleSave = () => {
    if (value.trim()) {
      onGuardar(value)
      setValue('')
    }
  }
  
  return (
    <div className="p-4 bg-card rounded-lg border">
      <h2 className="text-xl font-bold mb-2">{titulo}</h2>
      {descripcion && <p className="text-muted-foreground mb-4">{descripcion}</p>}
      
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Escribe algo..."
        className="w-full px-2 py-1 border rounded mb-2"
      />
      
      <Button onClick={handleSave} disabled={!value.trim()}>
        Guardar
      </Button>
    </div>
  )
}
```

### Paso 3: Usar en App.tsx
```tsx
// App.tsx

import { MiComponente } from './components/MiComponente'

export function App() {
  const [mi Dato, setMiDato] = useState<string[]>([])
  
  return (
    <div>
      <MiComponente 
        titulo="Mi Componente"
        descripcion="Aquí puedes agregar datos"
        onGuardar={(data) => setMiDato([...miDato, data])}
      />
      
      {/* Mostrar datos */}
      <ul>
        {miDato.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
```

---

## 🎨 CONVENCIONES DE CÓDIGO

### Nombres

```tsx
// ✅ Componentes: PascalCase
export function MiComponente() { }

// ✅ Variables: camelCase
const miVariable = 'valor'

// ✅ Constantes: UPPER_SNAKE_CASE
const MAX_ITEMS = 10

// ✅ Funciones: camelCase, verbos
const handleClick = () => { }
const getUserName = () => { }
const onUpdate = () => { }
```

### Tipos

```tsx
// ✅ Interfaces para props
interface MyComponentProps {
  titulo: string
  onClick: () => void
}

// ✅ Types para datos complejos
type Task = {
  id: string
  title: string
  completed: boolean
}

// ✅ Tipos al final del archivo
export function MyComponent(props: MyComponentProps) { }
```

### Organización del Código

```tsx
// ORDEN RECOMENDADO:
// 1. Imports
// 2. Types/Interfaces
// 3. Componente
// 4. Exports

import { useState } from 'react'  // 1. Imports
import { Button } from '@/components/ui/button'

interface MyProps {               // 2. Types
  title: string
}

export function MyComponent(props: MyProps) {  // 3. Componente
  const [count, setCount] = useState(0)
  
  return <Button>{count}</Button>
}
```

---

## ✅ ANTES DE HACER COMMIT

```bash
# 1. Verificar que el código sea correcto
npm run lint

# Si hay errores, ESLint intenta arreglarlo:
npm run lint --fix

# 2. Formatar código
npm run format

# 3. Compilar para validar que funciona
npm run build

# 4. Si todo es OK:
git add .
git commit -m "feat: descripción clara"
```

---

## 📋 PULL REQUEST CHECKLIST

Cuando abras un PR, verifica:

```
CÓDIGO
✅ Código compila sin errores (npm run build)
✅ ESLint pasa (npm run lint)
✅ Prettier formateado (npm run format)
✅ TypeScript strict mode OK
✅ Sin console.log de debug
✅ Sin imports no usados
✅ Sin variables no usadas
✅ Props con tipos (interface)

CAMBIOS
✅ Feature completamente funcional
✅ Sin breaking changes
✅ Commits con mensajes claros
✅ Descripción de PR clara

DOCUMENTACIÓN
✅ README.md actualizado si es necesario
✅ Comentarios en código complejo
✅ CHANGELOG.md actualizado (si existe)
```

---

## 🔄 DURANTE LA REVIEW

### Si piden cambios:
```bash
# 1. Haz los cambios
git add .
git commit -m "fix review: cambios solicitados"

# 2. Push
git push origin feature/mi-trabajo

# 3. El PR se actualiza automáticamente
# 4. Espera siguiente revisión
```

### Cuando se aprueba:
```bash
# 1. GitHub muestra botón "Merge pull request"
# 2. Click en él
# 3. Tu código entra a main ✅

# 4. Limpiar rama (opcional)
git branch -d feature/mi-trabajo
git push origin --delete feature/mi-trabajo
```

---

## 🚨 ERRORES COMUNES AL CONTRIBUIR

### Error 1: "Conflicto en merge"
**Problema:** Tu código conflictúa con cambios de main.

**Solución:**
```bash
# Actualizar con main
git fetch origin
git rebase origin/main

# Abrir archivos con <<<<<<< y resolver conflictos
# Luego:
git add .
git rebase --continue
git push origin feature/mi-trabajo --force
```

---

### Error 2: "npm run build falla"
**Problema:** Hay errores TypeScript o código inválido.

**Solución:**
```bash
# Ver qué está mal
npm run build

# Leer el error
# Arreglarlo en el código

# Intentar de nuevo
npm run build
```

---

### Error 3: "ESLint no pasa"
**Problema:** Tu código tiene warnings.

**Solución:**
```bash
# Ver qué está mal
npm run lint

# ESLint intenta arreglarlo
npm run lint --fix

# Si aún no pasa, arreglarlo manualmente
npm run format

# Luego:
git add .
git commit -m "style: arreglar eslint"
```

---

## 💡 TIPS PROFESIONALES

### Tip 1: Commits pequeños
```
❌ 1 commit con 500 líneas
✅ 5 commits pequeños (cada uno lógico)

Ventaja: Fácil revisar, fácil deshacer si es necesario
```

### Tip 2: Rama actualizada
```bash
# Antes de push, actualizar con main
git rebase origin/main

# Evita conflictos después
```

### Tip 3: Descripción clara en PR
```
MAL:
"Cambios en tareas"

BIEN:
"feat: agregar búsqueda en tareas
- Búsqueda por título
- Búsqueda por categoría
- Búsqueda en tiempo real
Cierra #123"
```

---

## 📚 RECURSOS

- [Git Documentation](https://git-scm.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [React Best Practices](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**¿Listo para tu primer PR? ¡Adelante! 🚀**

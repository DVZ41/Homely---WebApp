# 📐 CONVENCIONES DE CÓDIGO

Estándares que seguimos en HOMELY para mantener el código limpio y consistente.

---

## 🎯 NOMBRES

### Componentes React
```tsx
// ✅ BIEN - PascalCase
export function MiComponente() { }
export function TaskList() { }
export function DashboardPro() { }

// ❌ MAL
export function miComponente() { }
export function taskList() { }
export function dashboard_pro() { }
```

---

### Variables y Funciones
```tsx
// ✅ BIEN - camelCase
const miVariable = 'valor'
const tareaActual = task
const handleClick = () => { }
const getUserName = () => { }

// ❌ MAL
const MiVariable = 'valor'
const tarea_actual = task
const Handle_Click = () => { }
const getusername = () => { }
```

---

### Constantes
```tsx
// ✅ BIEN - UPPER_SNAKE_CASE
const MAX_TAREAS = 100
const COLORES_DISPONIBLES = ['azul', 'verde']
const API_URL = 'https://api.ejemplo.com'

// ❌ MAL
const maxTareas = 100
const max_tareas = 100
const MAX-TAREAS = 100
```

---

### Booleanos
```tsx
// ✅ BIEN - Comienzan con "is", "has", "can"
const esActivo = true
const tienePermiso = false
const puedeEditar = true
const estaAbierto = false

// ❌ MAL
const activo = true
const permiso = false
const editar = true
const abierto = false
```

---

## 📦 TIPOS E INTERFACES

### Orden en el Archivo
```tsx
// 1. IMPORTS
import { useState } from 'react'
import { Button } from '@/components/ui/button'

// 2. TYPES/INTERFACES (al inicio)
interface MiComponenteProps {
  titulo: string
  onClick: () => void
}

type Estado = 'pendiente' | 'en-progreso' | 'completado'

// 3. COMPONENTE
export function MiComponente(props: MiComponenteProps) {
  // ...
}
```

---

### Nombrar Interfaces
```tsx
// ✅ BIEN - Suffix con "Props" para props
interface ButtonProps {
  label: string
  disabled?: boolean
}

// ✅ BIEN - Prefix "I" es OPCIONAL (nosotros no lo usamos)
interface Tarea {
  id: string
  titulo: string
}

// ❌ MAL (no usamos este patrón)
interface IButton {
  // ...
}
```

---

### Tipos Genéricos
```tsx
// ✅ BIEN
interface Response<T> {
  data: T
  error?: string
}

type Handler<T> = (data: T) => void

// ❌ MAL
interface Response<X> {
  // Nombres genéricos poco claros
}
```

---

## 🎨 ESTRUCTURA DE COMPONENTE

```tsx
// ORDEN RECOMENDADO:

// 1. IMPORTS
import { useState } from 'react'
import { Button } from '@/components/ui/button'

// 2. TYPES
interface MiComponenteProps {
  titulo: string
  onClick: () => void
}

// 3. COMPONENTE
export function MiComponente({ titulo, onClick }: MiComponenteProps) {
  // Hooks
  const [count, setCount] = useState(0)
  
  // Funciones locales
  const handleIncrement = () => setCount(count + 1)
  
  // Render
  return (
    <div>
      <h1>{titulo}</h1>
      <p>{count}</p>
      <Button onClick={onClick}>Click</Button>
    </div>
  )
}

// 4. EXPORTS (si necesarios)
export type MiComponenteType = typeof MiComponente
```

---

## 🔤 STRINGS Y COMENTARIOS

### Comentarios
```tsx
// ✅ BIEN - Explicar POR QUÉ, no QUÉ
// Deduplicamos tareas porque pueden haber duplicados al sincronizar
const uniqueTasks = [...new Set(tasks)]

// ❌ MAL - Comentar lo obvio
// Incrementar count
const handleIncrement = () => setCount(count + 1)
```

### Strings
```tsx
// ✅ BIEN - Español en la app, inglés en código
const mensaje = 'Tarea completada exitosamente'
const className = 'p-4 bg-card rounded-lg'

// ✅ BIEN - Template literals para variables
const saludo = `Hola ${nombre}, bienvenido a ${appName}`

// ❌ MAL - Concatenación innecesaria
const saludo = 'Hola ' + nombre + ', bienvenido a ' + appName
```

---

## 🏗️ ORGANIZACIÓN DE IMPORTS

```tsx
// ORDEN RECOMENDADO:

// 1. React y librerías externas
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

// 2. Componentes locales
import { TaskCard } from './TaskCard'

// 3. Tipos/Interfaces
import type { Task, Member } from '../types'

// 4. Utilidades
import { formatDate } from '@/lib/utils'

// ❌ EVITAR - Imports desordenados
import { Task } from '../types'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { formatDate } from '@/lib/utils'
```

---

## 📏 PROPS Y DESTRUCTURING

```tsx
// ✅ BIEN - Destructuring en parámetros
interface UserCardProps {
  nombre: string
  email: string
  activo: boolean
}

export function UserCard({ nombre, email, activo }: UserCardProps) {
  return (
    <div>
      <h3>{nombre}</h3>
      <p>{email}</p>
      {activo && <span>Activo</span>}
    </div>
  )
}

// ❌ MAL - Sin destructuring
export function UserCard(props: UserCardProps) {
  return (
    <div>
      <h3>{props.nombre}</h3>
      <p>{props.email}</p>
    </div>
  )
}
```

---

## 🔧 HOOKS Y STATE

### useState
```tsx
// ✅ BIEN - Nombre claro y tipo explícito
const [tareas, setTareas] = useState<Tarea[]>([])
const [esLoading, setEsLoading] = useState<boolean>(false)
const [filtro, setFiltro] = useState<'activas' | 'completadas'>('activas')

// ❌ MAL
const [t, setT] = useState([])  // Nombre muy corto
const [loading, setLoading] = useState(false)  // Sin tipo
const [filter, setFilter] = useState('active')  // Español/inglés mixto
```

### useEffect
```tsx
// ✅ BIEN - Claro qué hace y dependencias explícitas
useEffect(() => {
  localStorage.setItem('homely_tareas', JSON.stringify(tareas))
}, [tareas])  // Se ejecuta cuando tareas cambia

// ❌ MAL - Sin dependencias (recalcula cada render)
useEffect(() => {
  // código
})

// ❌ MAL - Array vacío pero necesita dependencias
useEffect(() => {
  const fetchTareas = async () => {
    // usa 'usuario'
  }
  fetchTareas()
}, [])  // Debería incluir 'usuario'
```

---

## 🎯 CONDICIONALES

```tsx
// ✅ BIEN - Claro y legible
{isLoading ? <Spinner /> : <Content />}

{isOpen && <Dialog />}

{hasPermission && <AdminPanel />}

// ❌ MAL - Confuso
{loading && <Spinner />}  // ¿Y si no está loading?

{!isError ? <Content /> : <Error />}  // Doble negación confusa
```

---

## 📝 ARCHIVOS Y CARPETAS

### Nombres de Archivos
```
✅ BIEN
TaskCard.tsx
useTaskManager.ts
taskUtils.ts
task-list-page.tsx

❌ MAL
taskCard.tsx (debería ser PascalCase)
UseTaskManager.ts (función, no componente)
TASK_UTILS.ts
TaskListPage.tsx (página, usar kebab-case)
```

### Estructura de Carpeta
```
✅ BIEN
components/
├── Tarea/
│   ├── TareaCard.tsx
│   ├── TareaForm.tsx
│   └── TareaList.tsx
├── ui/
│   ├── Button.tsx
│   └── Card.tsx

❌ MAL
components/
├── tareaCard.tsx
├── tareaForm.tsx
├── Task/
│   └── task.tsx
```

---

## 🎓 RESUMEN RÁPIDO

| Elemento | Patrón | Ejemplo |
|----------|--------|---------|
| **Componentes** | PascalCase | `TaskList` |
| **Variables** | camelCase | `miVariable` |
| **Constantes** | UPPER_SNAKE_CASE | `MAX_TAREAS` |
| **Booleanos** | is/has/can | `esActivo` |
| **Interfaces** | PascalCase | `TaskProps` |
| **Archivos** | Según contenido | `TaskCard.tsx` |
| **Imports** | Ordenados | React → librerías → locales |
| **Props** | Destructured | `{ titulo, onClick }` |

---

## ✅ CHECKLIST

Antes de hacer commit:

```
□ Nombres en camelCase (variables)
□ Componentes en PascalCase
□ Tipos con nombres claros
□ Imports organizados
□ Props destructurados
□ Sin console.log de debug
□ Comentarios útiles (no obvios)
□ Español en strings de usuario
□ Inglés en código técnico
□ Sin eslint warnings
```

---

**¡Mantengamos el código limpio y consistente!** 🎯

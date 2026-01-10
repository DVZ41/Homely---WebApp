# 🏛️ ARQUITECTURA DE HOMELY

## 🎯 ¿Cómo está organizado todo?

HOMELY está construido con estos pilares:

```
┌─────────────────────────────────────────┐
│         APP.TSX (Cerebro)               │
│    - Maneja TODO el estado              │
│    - localStorage (guarda datos)        │
│    - Funciones CRUD                     │
└────────────────┬──────────────────────┘
                 │
      ┌──────────┴──────────┐
      │                     │
      ▼                     ▼
  COMPONENTES         COMPONENTES
  PRINCIPALES         UI/BASE
  - TaskList          - Button
  - Dashboard         - Card
  - Statistics        - Dialog
  - Members           - Input
  - ... 9 más         - ... 40 más

      └──────────┬──────────┘
                 │
                 ▼
          NAVEGACIÓN TABS
      (Router sin librerías)
```

---

## 📚 CAPAS DE LA APP

### Capa 1: Estado Global (App.tsx)

**¿Qué es?**
El "cerebro" de HOMELY. Aquí viven los datos.

**¿Dónde?**
Archivo: `App.tsx` (1,771 líneas)

**¿Qué contiene?**
```typescript
// Datos principales
const [members, setMembers] = useState<Member[]>([])
const [tasks, setTasks] = useState<Task[]>([])
const [rewards, setRewards] = useState<Reward[]>([])
const [notifications, setNotifications] = useState<Notification[]>([])

// Funciones CRUD
const addTask = (task: Task) => { ... }
const updateTask = (id: string, data: Partial<Task>) => { ... }
const deleteTask = (id: string) => { ... }

// Persistencia
useEffect(() => {
  localStorage.setItem('homely_tasks', JSON.stringify(tasks))
}, [tasks])  // Se ejecuta cada vez que tasks cambia
```

**Flujo:**
```
Usuario hace click
       ↓
Componente llama función (onAddTask)
       ↓
App.tsx actualiza state (setTasks)
       ↓
Componente se re-renderiza con datos nuevos
       ↓
Se guarda en localStorage automáticamente
```

---

### Capa 2: Componentes Principales

**¿Qué son?**
Partes grandes de la interfaz. Cada una maneja una funcionalidad.

**Ejemplos:**

#### `TaskList.tsx` (2,493 líneas)
**Para qué sirve:** Gestor de tareas (crear, editar, eliminar)

**Tiene:**
- Formulario para crear tareas
- Vista Kanban (3 columnas)
- Vista tabla con filtros
- Drag & drop
- Búsqueda

**Cómo recibe datos:**
```tsx
<TaskList
  tasks={tasks}              // ← Los datos
  members={members}
  onAddTask={addTask}        // ← Las funciones
  onUpdateTask={updateTask}
  onDeleteTask={deleteTask}
/>
```

---

#### `DashboardPro.tsx` (748 líneas)
**Para qué sirve:** Home/Dashboard principal

**Tiene:**
- Bienvenida personalizada
- Tareas próximas a vencer
- Miembros activos
- Calendario
- Tarjetas resumen

---

#### `Statistics.tsx` (429 líneas)
**Para qué sirve:** Gráficos y análisis

**Tiene:**
- Gráfico de barras (tareas por miembro)
- Gráfico de líneas (tareas por semana)
- Métricas calculadas (promedio, total, etc)

**Nota:** Se carga con "lazy loading" (solo cuando se ve).

---

#### `Members.tsx` (500+ líneas)
**Para qué sirve:** Gestión de miembros

**Tiene:**
- Crear miembro
- Editar perfil
- Ver puntos y nivel
- Eliminar miembro

---

#### `Achievements.tsx` (682 líneas)
**Para qué sirve:** Sistema de badges y logros

**Tiene:**
- 40+ badges diferentes
- Sistema de rareza (Común, Raro, Épico, Legendario)
- Desbloqueo automático por acciones
- Modal para ver detalles

**Nota:** También se carga con lazy loading.

---

#### `Rewards.tsx` (400+ líneas)
**Para qué sirve:** Sistema de recompensas

**Tiene:**
- Crear recompensa
- Canjear con puntos
- Historial de redemptions
- Validación de puntos

---

### Capa 3: Componentes UI Base

**¿Qué son?**
Bloques pequeños y reutilizables (botones, tarjetas, diálogos).

**Ejemplos:**
```
Button      → Botones
Card        → Tarjetas
Dialog      → Diálogos modales
Input       → Campos de texto
Select      → Dropdowns
Tabs        → Pestañas
Table       → Tablas
... + 33 más
```

**¿De dónde vienen?**
De **shadcn/ui** (librería profesional basada en Radix UI).

**¿Cómo se usan?**
```tsx
import { Button } from '@/components/ui/button'

<Button variant="default" size="lg">
  Guardar
</Button>
```

---

## 🔄 FLUJO DE DATOS (Ejemplo Real)

### Escenario: Crear una nueva tarea

```
PASO 1: USUARIO INTERACTÚA
  Usuario hace click en "Nueva Tarea"
  ↓
  
PASO 2: COMPONENTE ABRE FORMULARIO
  TaskList.tsx muestra diálogo con formulario
  Usuario llena:
  - Título: "Lavar platos"
  - Descripción: "Después de cenar"
  - Asignar a: "Juan"
  ↓
  
PASO 3: USUARIO ENVÍA
  Click en "Guardar"
  ↓
  
PASO 4: COMPONENTE LLAMA FUNCIÓN
  TaskList.tsx llama: onAddTask(newTask)
  ↓
  
PASO 5: APP.TSX RECIBE FUNCIÓN
  App.tsx ejecuta addTask()
  ↓
  
PASO 6: ACTUALIZAR STATE
  setTasks([...tasks, newTask])
  ↓
  
PASO 7: RE-RENDER AUTOMÁTICO
  Todos los componentes que usan 'tasks' se actualizan
  ↓
  
PASO 8: PERSISTENCIA AUTOMÁTICA
  useEffect detecta que 'tasks' cambió
  localStorage.setItem('homely_tasks', ...)
  ↓
  
PASO 9: USUARIO VE LA TAREA
  La tarea aparece en el panel
  Estado: "Pendiente"
  Columna Kanban: "Pendiente"
```

**Visualización:**
```
USUARIO
   ↓ (click)
COMPONENTE HIJO (TaskList)
   ↓ (onAddTask(newTask))
COMPONENTE PADRE (App)
   ↓ (setTasks)
STATE ACTUALIZADO
   ↓ (useEffect detecta cambio)
LOCAL STORAGE (guarda datos)
   ↓
RE-RENDER (todo se actualiza)
   ↓
USUARIO VE CAMBIOS
```

---

## 💾 PERSISTENCIA - localStorage

### ¿Cómo guarda HOMELY los datos?

Sin servidor, usa **localStorage del navegador**.

**¿Qué se guarda?**
```
homely_tasks          → Todas las tareas
homely_members        → Miembros del hogar
homely_rewards        → Recompensas
homely_achievements   → Badges desbloqueados
homely_notifications  → Notificaciones
homely_activities     → Historial
homely_custom_routines → Rutinas personalizadas
homely_theme          → Tema (claro/oscuro)
```

**¿Cuándo se guarda?**
```typescript
useEffect(() => {
  localStorage.setItem('homely_tasks', JSON.stringify(tasks))
}, [tasks])  // Se ejecuta cada vez que tasks cambia

// Equivalente en inglés:
// "Cada vez que tasks cambie, guarda en localStorage"
```

**¿Cómo se carga?**
```typescript
useEffect(() => {
  const saved = localStorage.getItem('homely_tasks')
  if (saved) {
    setTasks(JSON.parse(saved))
  }
}, [])  // Se ejecuta una sola vez (al cargar la app)
```

---

## 🎨 COMPONENTES - Cómo se Estructuran

### Patrón de Componente Típico

```tsx
// 1. IMPORTS
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'

// 2. DEFINIR TYPES
interface TaskCardProps {
  taskId: string
  title: string
  onDelete: (id: string) => void
}

// 3. COMPONENTE
export function TaskCard({ taskId, title, onDelete }: TaskCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="p-4 bg-card rounded-lg">
      <h3>{title}</h3>
      <Button onClick={() => setIsOpen(true)}>Más info</Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          ¿Eliminar esta tarea?
          <Button onClick={() => onDelete(taskId)}>Sí, eliminar</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
```

**Partes:**
1. **Imports** - Traer lo que necesitas
2. **Interface/Type** - Definir qué props recibe
3. **Hook useState** - Estado local (si lo necesita)
4. **Return JSX** - Lo que se ve
5. **Callbacks** - Funciones para eventos

---

## 🔌 PATRONES DE CÓDIGO

### Patrón 1: Props Drilling
**Problema:** Pasar props a través de muchos componentes.

**Solución en HOMELY:**
```tsx
// App.tsx es la fuente única de verdad
const [tasks, setTasks] = useState([])

// Pasar a componentes principales
<TaskList 
  tasks={tasks}
  onAddTask={addTask}
/>

// TaskList pasa a sub-componentes
<TaskCard 
  task={task}
  onDelete={deleteTask}
/>
```

---

### Patrón 2: Lazy Loading
**Problema:** Statistics.tsx pesa 375 KB, ralentiza la carga.

**Solución:** Cargar solo cuando se necesita.

```tsx
// LazyComponents.tsx
const StatisticsLazy = lazy(() => 
  import('./Statistics')
)

// App.tsx
{activeTab === 'statistics' && (
  <Suspense fallback={<LoadingSkeleton />}>
    <StatisticsLazy {...props} />
  </Suspense>
)}
```

**Resultado:** Carga rápida, Statistics se descarga cuando se necesita.

---

### Patrón 3: Tipos Centralizados
**En App.tsx:**
```typescript
export type Task = {
  id: string
  title: string
  description?: string
  status: 'pending' | 'in-progress' | 'completed'
  assignee?: string
  dueDate?: Date
  category: string
}

export type Member = {
  id: string
  name: string
  points: number
  level: number
}
```

**En componentes:**
```tsx
import { Task, Member } from '../App'

interface TaskListProps {
  tasks: Task[]
  members: Member[]
}
```

---

## 📊 ESTADO GLOBAL (useState)

**En App.tsx hay:**
```
✅ members          → Array de miembros
✅ tasks            → Array de tareas
✅ rewards          → Array de recompensas
✅ notifications    → Array de notificaciones
✅ activities       → Historial
✅ customRoutines   → Rutinas personalizadas
✅ theme            → 'light' o 'dark'
✅ homeConfig       → Configuración del hogar
```

**Cada uno tiene:**
- `setter` para actualizar (setTasks, setMembers, etc)
- `useEffect` para guardar en localStorage
- Funciones CRUD (crear, leer, actualizar, eliminar)

---

## 🎯 NAVEGACIÓN (Sin React Router)

**¿Cómo navega HOMELY?**
Sin librerías especiales, solo con `useState`.

```tsx
// App.tsx
const [activeTab, setActiveTab] = useState('dashboard')

return (
  <div>
    {/* Botones de navegación */}
    <button onClick={() => setActiveTab('dashboard')}>
      Dashboard
    </button>
    <button onClick={() => setActiveTab('tasks')}>
      Tareas
    </button>
    
    {/* Contenido según tab activo */}
    {activeTab === 'dashboard' && <DashboardPro {...props} />}
    {activeTab === 'tasks' && <TaskList {...props} />}
    {activeTab === 'statistics' && <StatisticsLazy {...props} />}
  </div>
)
```

**Ventaja:**
✅ Simple, sin librerías extras
✅ Fácil de entender

**Desventaja:**
❌ URL no cambia (no puedes compartir link de sección)

---

## 🚀 OPTIMIZACIONES

### 1. Code-Splitting (Lazy Loading)
```
Antes: TodoBundle (838 KB)
Después:
  - Main (425 KB) ← carga al inicio
  - Statistics (375 KB) ← carga cuando se ve
  - Achievements (23 KB) ← carga cuando se ve
  - Rewards (15 KB) ← carga cuando se ve
```

**Resultado:** App carga en 1 segundo en lugar de 3.

---

### 2. useMemo (Evitar cálculos repetidos)
```tsx
const tasksByMember = useMemo(() => {
  return members.map(member => ({
    member,
    count: tasks.filter(t => t.assignee === member.id).length
  }))
}, [tasks, members])  // Solo recalcula si cambian

// Sin useMemo: se calcula CADA VEZ que se renderiza
// Con useMemo: se calcula solo si cambian las dependencias
```

---

### 3. useCallback (Evitar crear funciones nuevas)
```tsx
const handleDelete = useCallback((id: string) => {
  onDelete(id)
}, [onDelete])

// Sin useCallback: cada render crea función nueva
// Con useCallback: usa la misma función siempre
// → Los componentes hijo no se re-renderizante innecesariamente
```

---

## ✅ RESUMEN

**HOMELY está estructurada así:**

```
App.tsx (Estado + CRUD)
   ↓
Componentes Principales (TaskList, Dashboard, etc)
   ↓
Componentes UI (Button, Card, Dialog, etc)
   ↓
localStorage (Guardar datos)
```

**Flujo de datos:**
```
Usuario → Evento → Componente → App.tsx → setState → localStorage → Re-render
```

**Optimizaciones:**
```
✅ Lazy loading (Statistics, Achievements, Rewards)
✅ useMemo (cálculos costosos)
✅ useCallback (funciones estables)
✅ localStorage (persistencia sin servidor)
```

---

**¿Listo para codear? → Lee [CONTRIBUIR.md](../guides/CONTRIBUIR.md) para saber cómo aportar. 🚀**

# 🏠 HOMELY - Gestión de Tareas Familiares

> **Aplicación web para organizar tareas del hogar con gamificación**  
> React + TypeScript + Tailwind CSS

---

## 🚀 EMPIEZA AQUÍ

**¿Nuevo en HOMELY?** → Lee [DOCUMENTACIÓN COMPLETA](./docs/INDEX.md)

**¿Quieres entender cómo funciona?** → Lee [Guía Rápida de Inicio](./docs/getting-started/00-INICIO.md) (10 minutos)

**¿Quieres empezar a codear?** → Lee [Comandos Diarios](./docs/getting-started/02-comandos-diarios.md)

**¿Quieres contribuir?** → Lee [Cómo Contribuir](./docs/guides/CONTRIBUIR.md)

---

## ⚡ QUICK START

```bash
# 1. Instalar
npm install

# 2. Iniciar
npm run dev

# 3. Abrir navegador
# http://localhost:5173
```

---

## 📚 DOCUMENTACIÓN

Toda la documentación está en la carpeta `docs/` organizada por tema:

| Sección | Archivos | Para |
|---------|----------|------|
| **Getting Started** | [0](./docs/getting-started/00-INICIO.md) [1](./docs/getting-started/01-que-es-homely.md) [2](./docs/getting-started/02-comandos-diarios.md) | Nuevo miembro |
| **Guides** | [Contribuir](./docs/guides/CONTRIBUIR.md) | Desarrolladores |
| **Architecture** | [ARQUITECTURA.md](./docs/architecture/ARQUITECTURA.md) | Entender código |
| **Reference** | [Quick Ref](./docs/reference/QUICK_REFERENCE.md) | Búsqueda rápida |
| **Team** | [Criteria](./docs/team/CRITERIOS-REVIEW.md) | Equipo |

📍 **Índice Completo:** [docs/INDEX.md](./docs/INDEX.md)

---

## 📑 Descripción General

**Homely** es una aplicación web para la gestión colaborativa de tareas del hogar, diseñada para familias y compañeros de piso. Incluye:

- ✅ Gestión de tareas (Kanban + tabla)
- 👥 Sistema de miembros
- 🎮 Gamificación (puntos, badges, recompensas)
- 📊 Estadísticas y rankings
- 🔔 Notificaciones
- 🌙 Modo oscuro

### Stack Tecnológico

| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 18.x | Framework UI |
| TypeScript | 5.x | Tipado estático |
| Tailwind CSS | 4.x | Estilos |
| Vite | 5.x | Build tool |
| shadcn/ui | Latest | 40+ Componentes UI |

---

## 📋 Descripción General

**Homely** es una aplicación web para la gestión colaborativa de tareas del hogar, diseñada para familias y compañeros de piso. Incluye:

- ✅ Gestión de tareas con vista Kanban y tabla
- 👥 Sistema de miembros con roles y permisos
- 🎮 Gamificación con puntos, logros y recompensas
- 📊 Estadísticas y rankings
- 🔔 Sistema de notificaciones en tiempo real
- 🌙 Soporte para modo oscuro

### Stack Tecnológico

| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 18.x | Framework UI |
| TypeScript | 5.x | Tipado estático |
| Tailwind CSS | 4.x | Estilos |
| Vite | 5.x | Build tool |
| Lucide React | Latest | Iconos |
| shadcn/ui | Latest | Componentes UI base |

---

## 🏗️ Arquitectura del Proyecto

```
┌─────────────────────────────────────────────────────────────────┐
│                        App.tsx (Root)                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ESTADO GLOBAL                                           │   │
│  │  - members, tasks, rewards, notifications               │   │
│  │  - currentUserId, currentView, theme                    │   │
│  │  - Funciones CRUD para todas las entidades              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│              ┌───────────────┼───────────────┐                 │
│              ▼               ▼               ▼                 │
│  ┌─────────────────┐  ┌─────────────┐  ┌─────────────────┐    │
│  │   Navigation    │  │   Content   │  │   Modals        │    │
│  │   (Sidebar)     │  │   Area      │  │   & Dialogs     │    │
│  └─────────────────┘  └─────────────┘  └─────────────────┘    │
│                              │                                  │
│          ┌───────────────────┼───────────────────┐             │
│          ▼                   ▼                   ▼             │
│  ┌─────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
│  │ DashboardPro│  │    TaskList     │  │    Members      │    │
│  │ (Home)      │  │ (Kanban/Table)  │  │                 │    │
│  └─────────────┘  └─────────────────┘  └─────────────────┘    │
│          │               │                      │              │
│  ┌───────┴───────┐       │               ┌──────┴──────┐      │
│  ▼               ▼       ▼               ▼             ▼      │
│ Profile     Statistics  MyTasks      Achievements   Rewards   │
└─────────────────────────────────────────────────────────────────┘
```

### Flujo de Datos

```
Usuario interactúa → Componente llama función de App.tsx → 
Estado se actualiza → React re-renderiza → localStorage se sincroniza
```

---

## 📁 Estructura de Archivos

```
project/
├── App.tsx                      # Componente raíz (estado global, tipos, navegación)
├── index.html                   # HTML base
├── package.json                 # Dependencias y scripts
├── vite.config.ts               # Configuración de Vite
├── tsconfig.json                # Configuración de TypeScript
│
├── components/                  # Componentes React
│   ├── Achievements.tsx         # Vista de logros y badges
│   ├── DashboardPro.tsx         # Dashboard principal con calendario
│   ├── LazyComponents.tsx        # Componentes con code-splitting (Lazy loading)
│   ├── Logo.tsx                 # Logo de la aplicación
│   ├── Members.tsx              # Gestión de miembros
│   ├── MyTasks.tsx              # Vista de tareas del usuario actual
│   ├── NotificationBell.tsx     # Icono de notificaciones con badge
│   ├── Notifications.tsx        # Panel de notificaciones
│   ├── Profile.tsx              # Perfil de usuario
│   ├── ProgresoGeneralCard.tsx  # Tarjeta de progreso general
│   ├── Rewards.tsx              # Sistema de recompensas
│   ├── Settings.tsx             # Configuración de la app
│   ├── Statistics.tsx           # Estadísticas y gráficos (Lazy loaded)
│   ├── TaskList.tsx             # Vista principal de tareas (Kanban/Tabla)
│   └── UserAvatar.tsx           # Componente de avatar
│   │
│   └── ui/                      # Componentes UI base (shadcn/ui)
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── tabs.tsx
│       └── ... (40+ componentes)
│
├── lib/                         # Utilidades y helpers
│   └── categoryUtils.ts         # Funciones para categorías de tareas
│
├── styles/                      # Estilos globales
│   └── globals.css              # Variables CSS, Tailwind, dark mode
│
├── DESIGN_SYSTEM.md             # Sistema de diseño (hovers, interacciones)
└── README.md                    # Esta documentación
```

---

## 📊 Tipos de Datos

Todos los tipos están definidos en `App.tsx`. Aquí están los principales:

### Member (Miembro)

```typescript
interface Member {
  id: string;              // UUID único
  name: string;            // Nombre del miembro
  email: string;           // Email (único)
  avatar: string;          // URL de avatar (opcional)
  role: 'admin' | 'member'; // Rol en el hogar
  color: string;           // Color HEX asignado (#RRGGBB)
  level: number;           // Nivel actual (gamificación)
  xp: number;              // Experiencia acumulada
  points: number;          // Puntos canjeables por recompensas
  streak: number;          // Racha de días consecutivos
  lastActiveDate: string;  // Última fecha activa (ISO string)
  tasksCompleted: number;  // Total de tareas completadas
  badges: string[];        // IDs de badges obtenidos
  joinedAt: string;        // Fecha de unión (ISO string)
}
```

### Task (Tarea)

```typescript
interface Task {
  id: string;              // UUID único
  title: string;           // Título de la tarea
  description: string;     // Descripción detallada
  category: TaskCategory;  // Categoría (ver abajo)
  priority: 'baja' | 'media' | 'alta'; // Prioridad
  status: 'pendiente' | 'en-progreso' | 'completada'; // Estado
  dueDate: string;         // Fecha límite (ISO string)
  assignedTo: string | null; // ID del miembro asignado (null = sin asignar)
  createdBy: string;       // ID del creador
  createdAt: string;       // Fecha de creación
  completedAt?: string;    // Fecha de completado (opcional)
  points: number;          // Puntos que otorga (1-100)
  isRecurring: boolean;    // ¿Es recurrente?
  recurringDays?: number[]; // Días de recurrencia (0-6, domingo=0)
}

type TaskCategory = 
  | 'Cocina' 
  | 'Limpieza' 
  | 'Baño' 
  | 'Lavandería' 
  | 'Compras' 
  | 'Jardín' 
  | 'Mascotas' 
  | 'General';
```

### Notification (Notificación)

```typescript
interface Notification {
  id: string;              // UUID único
  type: NotificationType;  // Tipo de notificación
  title: string;           // Título
  message: string;         // Mensaje detallado
  createdAt: string;       // Fecha de creación
  read: boolean;           // ¿Ha sido leída?
  relatedId?: string;      // ID de entidad relacionada
  relatedType?: string;    // Tipo de entidad ('task', 'member', etc.)
}

type NotificationType = 
  | 'task_completed'    // Tarea completada
  | 'task_assigned'     // Tarea asignada
  | 'reward_earned'     // Recompensa obtenida
  | 'badge_earned'      // Badge/logro conseguido
  | 'member_joined'     // Nuevo miembro
  | 'deadline_soon'     // Fecha límite próxima
  | 'points_earned'     // Puntos ganados
  | 'streak'            // Racha mantenida
  | 'level_up'          // Subida de nivel
  | 'system'            // Mensaje del sistema
  | 'reminder'          // Recordatorio
  | 'warning';          // Advertencia
```

### Reward (Recompensa)

```typescript
interface Reward {
  id: string;              // UUID único
  name: string;            // Nombre de la recompensa
  description: string;     // Descripción
  pointsCost: number;      // Coste en puntos
  category: string;        // Categoría de recompensa
  icon: string;            // Nombre del icono (Lucide)
  available: boolean;      // ¿Está disponible?
  claimedBy?: string;      // ID de quien la reclamó
  claimedAt?: string;      // Fecha de reclamación
}
```

### Badge (Logro)

```typescript
interface Badge {
  id: string;              // UUID único
  name: string;            // Nombre del badge
  description: string;     // Descripción de cómo obtenerlo
  icon: string;            // Nombre del icono (Lucide)
  rarity: 'common' | 'rare' | 'epic' | 'legendary'; // Rareza
  requirement: {           // Requisito para obtenerlo
    type: string;          // Tipo de requisito
    count: number;         // Cantidad necesaria
  };
  earnedBy?: string[];     // IDs de miembros que lo tienen
}
```

---

## 🔄 Gestión de Estado

### Estado en App.tsx

Todo el estado global se gestiona en `App.tsx` usando hooks de React:

```typescript
// Estado de datos principales
const [members, setMembers] = useState<Member[]>(initialMembers);
const [tasks, setTasks] = useState<Task[]>(initialTasks);
const [rewards, setRewards] = useState<Reward[]>(initialRewards);
const [notifications, setNotifications] = useState<Notification[]>([]);

// Estado de UI
const [currentView, setCurrentView] = useState<string>('home');
const [currentUserId, setCurrentUserId] = useState<string | null>(null);
const [isDarkMode, setIsDarkMode] = useState(false);
const [isSidebarOpen, setIsSidebarOpen] = useState(true);
```

### Funciones CRUD

| Función | Descripción |
|---------|-------------|
| `handleAddTask(task)` | Crea una nueva tarea |
| `handleUpdateTask(taskId, updates)` | Actualiza una tarea existente |
| `handleDeleteTask(taskId)` | Elimina una tarea |
| `handleCompleteTask(taskId)` | Marca tarea como completada, suma puntos |
| `handleAddMember(member)` | Añade un nuevo miembro |
| `handleUpdateMember(memberId, updates)` | Actualiza datos de miembro |
| `handleDeleteMember(memberId)` | Elimina un miembro |
| `handleClaimReward(rewardId, memberId)` | Canjea una recompensa |
| `addNotification(notification)` | Añade nueva notificación |
| `markNotificationAsRead(id)` | Marca notificación como leída |
| `markAllNotificationsAsRead()` | Marca todas como leídas |

### Props Drilling

Los componentes reciben datos y funciones via props:

```tsx
<TaskList 
  tasks={tasks}                    // Datos
  members={members}                // Datos
  onAddTask={handleAddTask}        // Función
  onUpdateTask={handleUpdateTask}  // Función
  onCompleteTask={handleCompleteTask} // Función
  onDeleteTask={handleDeleteTask}  // Función
  currentUser={currentUser}        // Usuario actual
/>
```

---

## 🧩 Componentes Principales

### App.tsx (1773 líneas)

**Responsabilidades:**
- Definición de todos los tipos TypeScript
- Gestión del estado global
- Lógica de navegación entre vistas
- Persistencia en localStorage
- Sistema de notificaciones
- Registro de actividad
- Renderizado condicional de vistas

**Estructura interna:**
```typescript
// 1. Tipos e interfaces (líneas 1-150)
interface Member { ... }
interface Task { ... }
// ...

// 2. Datos iniciales (líneas 150-300)
const initialMembers: Member[] = [...]
const initialTasks: Task[] = [...]

// 3. Componente App (líneas 300-final)
function App() {
  // 3.1 Estados
  const [members, setMembers] = useState(...)
  
  // 3.2 Efectos (localStorage)
  useEffect(() => { ... }, [])
  
  // 3.3 Funciones CRUD
  const handleAddTask = (task) => { ... }
  
  // 3.4 Renderizado
  return (...)
}
```

### TaskList.tsx (2574 líneas)

**Responsabilidades:**
- Vista de tareas en modo Kanban (columnas por estado)
- Vista de tareas en modo Tabla
- Filtros por categoría, prioridad, miembro
- Creación y edición de tareas (modales)
- Arrastrar y soltar (drag & drop)
- Validación de tareas sin asignar

**Características destacadas:**
- Validación para evitar cambios de estado en tareas sin asignar
- Avatares circulares con colores de miembro
- Indicadores ChevronDown en botones de asignación
- Búsqueda en tiempo real

### DashboardPro.tsx (748 líneas)

**Responsabilidades:**
- Vista principal del dashboard
- Calendario con tareas del mes
- Estadísticas rápidas
- Tareas próximas del usuario
- Ranking simplificado

### Members.tsx

**Responsabilidades:**
- Lista de miembros del hogar
- Añadir/editar/eliminar miembros
- Asignación de colores
- Visualización de estadísticas por miembro

### Achievements.tsx (682 líneas)

**Responsabilidades:**
- Galería de badges disponibles
- Progreso hacia logros
- Badges obtenidos por el usuario
- Logros del equipo

---

## 💾 Sistema de Persistencia

### localStorage Schema

Todos los datos se guardan en localStorage con las siguientes claves:

| Clave | Tipo | Descripción |
|-------|------|-------------|
| `homely_members` | `Member[]` | Array de miembros |
| `homely_tasks` | `Task[]` | Array de tareas |
| `homely_rewards` | `Reward[]` | Array de recompensas |
| `homely_notifications` | `Notification[]` | Array de notificaciones |
| `homely_current_user` | `string` | ID del usuario actual |
| `homely_theme` | `'light' \| 'dark'` | Tema actual |
| `homely_activity_log` | `ActivityEntry[]` | Registro de actividad |

### Sincronización

```typescript
// Cargar datos al iniciar
useEffect(() => {
  const savedMembers = localStorage.getItem('homely_members');
  if (savedMembers) {
    setMembers(JSON.parse(savedMembers));
  }
}, []);

// Guardar cambios automáticamente
useEffect(() => {
  localStorage.setItem('homely_members', JSON.stringify(members));
}, [members]);
```

### Deduplicación

El sistema incluye lógica para evitar notificaciones duplicadas:

```typescript
const isDuplicate = notifications.some(
  n => n.type === newNotification.type && 
       n.relatedId === newNotification.relatedId &&
       n.createdAt.slice(0, 10) === today
);
```

---

## 🔔 Sistema de Notificaciones

### Tipos de Notificación

```typescript
const NOTIFICATION_TYPES = {
  task_completed: { icon: 'CheckCircle', color: 'green' },
  task_assigned: { icon: 'ClipboardList', color: 'blue' },
  reward_earned: { icon: 'Gift', color: 'amber' },
  badge_earned: { icon: 'Trophy', color: 'purple' },
  member_joined: { icon: 'UserPlus', color: 'cyan' },
  deadline_soon: { icon: 'Clock', color: 'orange' },
  points_earned: { icon: 'Star', color: 'yellow' },
  streak: { icon: 'Flame', color: 'red' },
  level_up: { icon: 'TrendingUp', color: 'pink' },
  system: { icon: 'Settings', color: 'gray' },
  reminder: { icon: 'Bell', color: 'blue' },
  warning: { icon: 'AlertTriangle', color: 'orange' }
};
```

### Auto-generación

Las notificaciones se generan automáticamente cuando:

- Se completa una tarea → `task_completed`
- Se asigna una tarea → `task_assigned`
- Se ganan puntos → `points_earned`
- Se obtiene un badge → `badge_earned`
- Un miembro sube de nivel → `level_up`
- Se canjea una recompensa → `reward_earned`

### Componentes

- **NotificationBell.tsx**: Icono con badge de no leídas
- **Notifications.tsx**: Panel desplegable con lista completa

---

## 🎮 Sistema de Gamificación

### Puntos (Points)

- Se ganan al completar tareas
- Cada tarea define sus puntos (1-100)
- Se pueden canjear por recompensas

### Experiencia (XP)

- Se gana al completar tareas (igual que puntos)
- Acumula para subir de nivel
- No se gasta, solo crece

### Niveles

```typescript
const calculateLevel = (xp: number): number => {
  // 100 XP por nivel, exponencial suave
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};
```

### Rachas (Streaks)

- Días consecutivos completando al menos una tarea
- Se reinicia si pasa un día sin completar tareas
- Bonificación de XP por racha larga

### Badges

Categorías de logros:
- **Tareas**: Completar X tareas
- **Rachas**: Mantener racha de X días
- **Categorías**: Completar X tareas de una categoría
- **Sociales**: Ayudar a otros miembros
- **Especiales**: Eventos únicos

---

## 🛠️ Guía de Desarrollo

### Requisitos Previos

- Node.js 18+
- npm o yarn

### Instalación

```bash
# Clonar repositorio
git clone <url>

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build
```

### Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run preview` | Vista previa del build |
| `npm run lint` | Ejecuta ESLint |

### Añadir un Nuevo Componente

1. Crear archivo en `components/`:
```tsx
// components/MiComponente.tsx
import React from 'react';

interface MiComponenteProps {
  titulo: string;
  onAccion: () => void;
}

export function MiComponente({ titulo, onAccion }: MiComponenteProps) {
  return (
    <div className="bg-card p-4 rounded-lg">
      <h2 className="text-lg font-semibold">{titulo}</h2>
      <button 
        onClick={onAccion}
        className="mt-4 bg-primary text-white px-4 py-2 rounded-md"
      >
        Acción
      </button>
    </div>
  );
}
```

2. Importar en `App.tsx` y añadir a la navegación si es necesario.

### Añadir un Nuevo Tipo de Notificación

1. Añadir al type `NotificationType` en `App.tsx`
2. Añadir configuración de icono/color en `Notifications.tsx`
3. Añadir lógica de generación donde corresponda

### Convenciones de Código

- **Nombres de componentes**: PascalCase (`TaskList`, `UserAvatar`)
- **Nombres de funciones**: camelCase (`handleAddTask`, `formatDate`)
- **Nombres de tipos**: PascalCase con sufijo descriptivo (`TaskCategory`, `MemberRole`)
- **Archivos CSS**: Variables CSS para colores, Tailwind para layout
- **Comentarios**: Documentar funciones complejas y decisiones de diseño

### Estilos Inline Intencionados

⚠️ **Nota importante**: El proyecto tiene advertencias de CSS inline que son **intencionadas**:

```tsx
// ✅ CORRECTO - Color dinámico de miembro
style={{ backgroundColor: member.color }}

// ✅ CORRECTO - Color dinámico de categoría
style={{ borderColor: getCategoryColor(task.category) }}
```

Estos estilos inline son necesarios porque los colores vienen de datos dinámicos (base de datos de miembros, categorías de tareas) y no pueden ser clases Tailwind predefinidas.

---

## 🐛 Troubleshooting

### Error: "setCurrentUserId is not defined"

**Causa**: Falta el estado `currentUserId` en App.tsx.

**Solución**: Asegurarse de tener:
```typescript
const [currentUserId, setCurrentUserId] = useState<string | null>(null);
```

### Las notificaciones no persisten

**Causa**: localStorage no se está guardando.

**Verificar**: 
1. Que existe el useEffect de guardado
2. Que no hay errores en la consola
3. Que las DevTools muestran los datos en Application > localStorage

### Los colores de categoría no aparecen

**Causa**: Falta importar `getCategoryColor` de categoryUtils.

**Solución**:
```typescript
import { getCategoryColor, getCategoryEmoji } from '@/lib/categoryUtils';
```

---

## 📚 Referencias

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)

---

## 📝 Changelog

### v1.0.0 (Enero 2025)
- Sistema de tareas completo (Kanban + Tabla)
- 12 tipos de notificaciones
- Sistema de gamificación con badges
- Persistencia en localStorage
- Modo oscuro
- 8 categorías de tareas con colores

---

> **Mantenido por**: Equipo de desarrollo Homely  
> **Última actualización**: Enero 2025

# Homely---WebApp
Repositorio con los archivos de la web de Homely

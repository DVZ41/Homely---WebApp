# ¿QUÉ ES HOMELY?

## 🎯 En 30 Segundos

**HOMELY** es una app web para **gestionar tareas familiares** donde cada miembro del hogar puede:
- ✅ Crear y completar tareas
- 🏆 Ganar badges y recompensas
- 📊 Ver estadísticas del hogar
- 👥 Colaborar con familia/roommates

---

## 🏠 El Problema Que Resuelve

**Sin HOMELY:**
```
"¿Quién lava los platos hoy?"
"¿Tomó alguien la basura?"
"¿Cuándo fue la última vez que limpiamos?"
→ Confusión, conflictos
```

**Con HOMELY:**
```
✅ Tareas claras (panel de control)
✅ Gamificación (badges, puntos, recompensas)
✅ Responsabilidad (quién hizo qué)
✅ Diversión (competencia amigable)
```

---

## ✨ Características Principales

### 1. **Tareas** 📋
- Crear tareas
- Asignar a miembros
- Marcar como completadas
- Filtrar por categoría/estado
- Vista Kanban (Pendiente → En Progreso → Completado)

### 2. **Miembros** 👥
- Perfiles de cada persona
- Puntos y nivel
- Historial de actividades
- Avatar personalizado

### 3. **Badges & Logros** 🏆
- 40+ badges diferentes
- Rareza: Común, Raro, Épico, Legendario
- Se desbloquean por acciones
- Leaderboard de miembros

### 4. **Recompensas** 🎁
- Canjear puntos por premios
- Crear recompensas personalizadas
- Sistema de redemption tracking
- Puntos ganan con cada tarea

### 5. **Estadísticas** 📊
- Gráficos de tareas completadas
- Progreso del hogar
- Ranking de miembros
- Datos históricos

### 6. **Notificaciones** 🔔
- Tareas próximas a vencer
- Logros desbloqueados
- Recordatorios
- Panel de notificaciones

---

## 🔧 Tecnología Detrás

### Frontend (Lo que ves)
```
React 18        → Framework para la interfaz
TypeScript      → JavaScript con tipos (menos errores)
Tailwind CSS    → Estilos bonitos rápidamente
shadcn/ui       → Componentes profesionales pre-hechos
```

### Build & Deploy
```
Vite            → Compilador rápido
ESLint          → Detector de errores
Prettier        → Formateador de código
localStorage    → Guardar datos en navegador
```

---

## 📁 Estructura del Código

```
homely/
├── App.tsx              ← Componente principal (estado global)
├── components/          ← Componentes React
│   ├── TaskList.tsx     ← Gestor de tareas
│   ├── DashboardPro.tsx ← Home/Dashboard
│   ├── Statistics.tsx   ← Gráficos
│   ├── Achievements.tsx ← Logros
│   ├── Members.tsx      ← Miembros
│   ├── Rewards.tsx      ← Recompensas
│   └── ui/              ← Componentes base
├── styles/              ← CSS global
├── lib/                 ← Utilidades
└── docs/                ← DOCUMENTACIÓN (aquí estás)
```

---

## 🚀 Primeros Pasos

### 1. Instalar (Primera vez)
```bash
npm install
```
Descarga todas las librerías necesarias. Solo una vez.

### 2. Iniciar servidor
```bash
npm run dev
```
Abre http://localhost:5173 automáticamente.

### 3. Ver la app
El navegador mostrará HOMELY. ¡Ya está!

---

## 🎮 Cómo Funciona (Ejemplo)

### Escenario: Crear una nueva tarea

**1. Usuario hace click en "Nueva Tarea"**
   ↓
**2. Se abre un formulario**
   - Título: "Lavar platos"
   - Descripción: "Después de cenar"
   - Asignar a: "Juan"
   - Categoría: "Cocina"
   ↓
**3. Usuario hace click en "Guardar"**
   ↓
**4. App guarda la tarea en localStorage**
   - Se almacena en el navegador
   - No necesita servidor
   ↓
**5. La tarea aparece en el panel**
   - Estado: "Pendiente"
   - Asignada a Juan
   - En columna "Pendiente"
   ↓
**6. Juan completa la tarea**
   - Arrastra a "Completado"
   - Gana +10 puntos
   - Desbloquea badge "Ayudante"
   ↓
**7. Estadísticas se actualizan**
   - Gráfico de tareas completadas sube
   - Ranking de Juan cambia
```

---

## 💾 Dónde Se Guardan Los Datos

**Sin servidor (localStorage del navegador):**
```
homely_tasks          → Todas las tareas
homely_members        → Perfil de miembros
homely_rewards        → Recompensas disponibles
homely_notifications  → Notificaciones
homely_achievements   → Logros desbloqueados
homely_activities     → Historial
```

**Ventajas:**
- ✅ No necesita backend
- ✅ Funciona sin internet (con datos guardados)
- ✅ Privacidad (datos en tu navegador)
- ✅ Rápido

**Desventaja:**
- ❌ Se pierden datos si borras caché del navegador

---

## 🌙 Light/Dark Mode

HOMELY detecta tu preferencia de sistema operativo y cambia automáticamente entre tema claro y oscuro.

---

## 🎨 Colores y Estilo

```
Colores principales:
🔵 Azul      → Primario (botones, headers)
🟢 Verde     → Éxito (completado, activo)
🟡 Amarillo  → Advertencia (próximo a vencer)
🔴 Rojo      → Peligro (vencido)
⚪ Gris      → Neutral (fondos, bordes)

Tipografía:
📝 Sans-serif moderna
🎯 Fácil de leer
📱 Responsive (se adapta a móvil)
```

---

## 📱 ¿Funciona en Móvil?

✅ **Sí.** El código está hecho para adaptarse a cualquier pantalla.

```
Escritorio  → Ancho completo
Tablet      → 2-3 columnas
Móvil       → 1 columna (responsive)
```

---

## ⚙️ Configuración

En **Settings**, puedes:
- Cambiar nombre del hogar
- Personalizar mensaje de bienvenida
- Dark/Light mode
- Otros ajustes

---

## 🔐 Seguridad

```
🔒 No hay login (datos locales)
🔒 No hay servidor (sin ataques remotos)
🔒 Datos en tu navegador (privacidad total)
⚠️ Si alguien accede a tu PC, ve tus datos
   (Normal para una app familiar)
```

---

## 🎯 Para Quién Es

✅ Familias compartiendo casa
✅ Roommates
✅ Equipos pequeños de trabajo
✅ Proyectos colaborativos

❌ No es para:
- Empresas grandes (necesitan backend)
- Datos sensibles (sin encriptación)
- Múltiples dispositivos sincronizados (sin servidor)

---

## 📊 Números del Proyecto

```
Código:              ~4,500 líneas
Componentes:         13 principales
UI Components:       40+ (reutilizables)
Build time:          3.3 segundos
Bundle size:         425 KB
TypeScript errors:   0 ❌
```

---

## 🚀 Próximo Paso

Ahora que sabes **QUÉ ES**, es hora de aprender **CÓMO USARLO**:

→ Lee [02-comandos-diarios.md](./02-comandos-diarios.md)

O si quieres meterte al código:
→ Ve a [ARQUITECTURA.md](../architecture/ARQUITECTURA.md)

---

**¿Listo? ¡Empecemos! 💪**

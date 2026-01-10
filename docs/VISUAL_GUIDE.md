# 🎨 GUÍA VISUAL - HOMELY

**Cómo se ve y funciona la aplicación web**

---

## 🚀 CÓMO VERLO EN VIVO

```bash
# En terminal:
npm run dev

# Abre en navegador:
http://localhost:5173
```

---

## 📱 ESTRUCTURA GENERAL

```
┌─────────────────────────────────────┐
│         HEADER (Superior)           │
│  Logo  |  Búsqueda  | Notificación  │  Usuario
├──────────┬──────────────────────────┤
│          │                          │
│ SIDEBAR  │    CONTENIDO PRINCIPAL   │
│          │                          │
│  Menú    │   (Cambia según click)   │
│          │                          │
└──────────┴──────────────────────────┘
```

---

## 🏠 1. DASHBOARD (Pantalla Principal)

**Lo que ves al entrar:**

### ZONA SUPERIOR
```
┌─────────────────────────────────────┐
│ 🏠 DASHBOARD - Bienvenida           │
│                                     │
│ "Hola [Nombre], Enero 10, 2026"    │
│ Resumen general de la familia       │
└─────────────────────────────────────┘
```

### ZONAS DE CONTENIDO

#### 📅 CALENDARIO MINI
```
┌─────────────────┐
│  Enero 2026     │
│ Lu Ma Mi Ju Vi  │
│  1  2  3  4  5  │
│  6  7  8  9 10  │  ← HOY (marca azul/verde)
│ ...            │
└─────────────────┘
```

#### ⚠️ ALERTAS/URGENTES
```
┌──────────────────────────────────┐
│ ⚠️ TAREAS URGENTES HOYY          │
│                                  │
│ 🔴 Limpiar cocina (asignado a)  │
│ 🟡 Comprar comida (vence hoy)   │
│ 🟠 Tarea X (vence mañana)       │
└──────────────────────────────────┘
```

#### 📊 RESUMEN RÁPIDO
```
┌──────────────────────────────────┐
│ 📊 RESUMEN GENERAL               │
│                                  │
│ 👥 Miembros:  5 personas         │
│ 📝 Tareas:    12 pendientes      │
│ ✅ Completadas: 25 este mes      │
│ 🏆 Logros:    18 desbloqueados   │
│ 💰 Puntos:    1,250 en total     │
└──────────────────────────────────┘
```

---

## 📋 2. TAREAS (TaskList)

**Menú: Tareas → Todas las Tareas**

### VISTA KANBAN (Drag & Drop)

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│   PENDIENTE  │ EN PROGRESO  │  COMPLETADAS │   VENCIDAS   │
├──────────────┼──────────────┼──────────────┼──────────────┤
│ ┌──────────┐ │ ┌──────────┐ │ ┌──────────┐ │ ┌──────────┐ │
│ │🧹 Limpiar│ │ │🛒 Comprar│ │ │✅Cocinar │ │ │❌Llamar  │ │
│ │cocina    │ │ │comida    │ │ │cena     │ │ │dentista │ │
│ │@María   │ │ │@Juan     │ │ │@Ana    │ │ │@Carlos   │ │
│ │3 pts    │ │ │5 pts     │ │ │10 pts  │ │ │7 pts     │ │
│ └──────────┘ │ └──────────┘ │ └──────────┘ │ └──────────┘ │
│              │              │              │              │
│ ┌──────────┐ │              │              │              │
│ │📚 Tarea 2│ │              │              │              │
│ │@Pedro    │ │              │              │              │
│ └──────────┘ │              │              │              │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**Puedes:**
- 🖱️ Arrastar tareas entre columnas (cambiar estado)
- ➕ Crear nueva tarea (botón "Nueva Tarea")
- ✏️ Editar tarea (click en tarjeta)
- 🎯 Filtrar por categoría/persona
- 🔍 Buscar por título

---

### VISTA TABLA

```
┌──────┬─────────────┬──────────┬──────────┬────────┬──────────┐
│ ID   │ Título      │ Asignado │ Fecha    │ Estado │ Puntos   │
├──────┼─────────────┼──────────┼──────────┼────────┼──────────┤
│ 001  │ Limpiar     │ María    │ 10/01    │ ✅Done │ 3 pts    │
│ 002  │ Comprar     │ Juan     │ 11/01    │ ⏳Prog │ 5 pts    │
│ 003  │ Cocinar     │ Ana      │ 12/01    │ ⏳Prog │ 10 pts   │
│ 004  │ Llamar vet  │ Carlos   │ 09/01    │ ❌Late │ 7 pts    │
└──────┴─────────────┴──────────┴──────────┴────────┴──────────┘
```

---

## 👤 3. MIS TAREAS

**Menú: Mis Tareas**

```
┌─────────────────────────────────────┐
│ MIS TAREAS PERSONALES               │
│ (Solo las que me asignaron)         │
│                                     │
│ Filtros:                            │
│ [ ] Pendientes  [x] En Progreso [ ] │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🧹 Limpiar cocina               │ │
│ │ Vence: Mañana                   │ │
│ │ Asignado por: Papá              │ │
│ │ [En Progreso ▼]  3 pts           │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🛒 Comprar leche                 │ │
│ │ Vence: Hoy                      │ │
│ │ Asignado por: Mamá              │ │
│ │ [Pendiente ▼]  2 pts             │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 👥 4. MIEMBROS

**Menú: Equipo → Miembros**

```
┌─────────────────────────────────────┐
│ 👥 MIEMBROS DE LA FAMILIA           │
│                                     │
│ ┌────────────┐  ┌────────────┐     │
│ │ 👨 PAPÁ    │  │ 👩 MAMÁ    │     │
│ │ 1,250 pts  │  │ 980 pts    │     │
│ │ Nivel 5    │  │ Nivel 4    │     │
│ │ ⭐⭐⭐⭐⭐  │  │ ⭐⭐⭐⭐☆  │     │
│ │ 12 logros  │  │ 8 logros   │     │
│ └────────────┘  └────────────┘     │
│                                     │
│ ┌────────────┐  ┌────────────┐     │
│ │ 👨 HIJO    │  │ 👧 HIJA    │     │
│ │ 750 pts    │  │ 620 pts    │     │
│ │ Nivel 3    │  │ Nivel 3    │     │
│ │ ⭐⭐⭐☆☆   │  │ ⭐⭐⭐☆☆   │     │
│ │ 6 logros   │  │ 5 logros   │     │
│ └────────────┘  └────────────┘     │
└─────────────────────────────────────┘
```

**Información de cada miembro:**
- Avatar + Nombre
- Puntos totales
- Nivel actual
- Número de logros
- Ranking en familia

---

## 🏆 5. LOGROS (Achievements)

**Menú: Logros**

```
┌─────────────────────────────────────┐
│ 🏆 LOGROS DESBLOQUEADOS             │
│                                     │
│ ┌──────────────────────────────┐   │
│ │ 🥇 INICIADOR                 │   │
│ │ "Completa tu primera tarea"  │   │
│ │ Desbloqueado por: Papá       │   │
│ │ Rarity: Común                │   │
│ └──────────────────────────────┘   │
│                                     │
│ ┌──────────────────────────────┐   │
│ │ 🥈 PERSISTENTE                │   │
│ │ "Completa 10 tareas"         │   │
│ │ Desbloqueado por: Mamá       │   │
│ │ Rarity: Rara                 │   │
│ └──────────────────────────────┘   │
│                                     │
│ ┌──────────────────────────────┐   │
│ │ 🥉 LEYENDA                    │   │
│ │ "Completa 50 tareas"         │   │
│ │ Desbloqueado por: Hijo       │   │
│ │ Rarity: Épica                │   │
│ └──────────────────────────────┘   │
│                                     │
│ ┌──────────────────────────────┐   │
│ │ ❓ MISTERIO BLOQUEADO         │   │
│ │ "Completa 100 tareas"        │   │
│ │ No desbloqueado aún          │   │
│ │ Rarity: Legendaria           │   │
│ └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Rareza de logros:**
- ⚪ Común (fáciles)
- 🔵 Rara (moderadas)
- 🟣 Épica (difíciles)
- 🟡 Legendaria (muy difíciles)

---

## 🎁 6. RECOMPENSAS

**Menú: Tienda → Recompensas**

```
┌─────────────────────────────────────┐
│ 🎁 TIENDA DE RECOMPENSAS            │
│                                     │
│ Tus puntos: 1,250                   │
│                                     │
│ ┌──────────────────────────────┐   │
│ │ 🍿 VER PELÍCULA              │   │
│ │ Costo: 200 puntos            │   │
│ │ "Mirar película a elegir"    │   │
│ │ [CANJEAR]                    │   │
│ └──────────────────────────────┘   │
│                                     │
│ ┌──────────────────────────────┐   │
│ │ 🍕 PIZZA NIGHT               │   │
│ │ Costo: 500 puntos            │   │
│ │ "Pedimos pizza este viernes" │   │
│ │ [CANJEAR]                    │   │
│ └──────────────────────────────┘   │
│                                     │
│ ┌──────────────────────────────┐   │
│ │ 🎮 VIDEOJUEGO NUEVO          │   │
│ │ Costo: 1,000 puntos          │   │
│ │ "Comprar juego que elijas"   │   │
│ │ [CANJEAR]                    │   │
│ └──────────────────────────────┘   │
│                                     │
│ ┌──────────────────────────────┐   │
│ │ 🏖️ VACACIONES ESPECIALES      │   │
│ │ Costo: 2,000 puntos          │   │
│ │ "Trip a lugar especial"      │   │
│ │ [PRÓXIMAMENTE - Insuf. pts]  │   │
│ └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 📊 7. ESTADÍSTICAS

**Menú: Estadísticas**

```
┌─────────────────────────────────────┐
│ 📊 ESTADÍSTICAS MENSUALES           │
│                                     │
│ GRÁFICO 1: TAREAS COMPLETADAS      │
│ ▂▄▆█▆▄▂  (Línea de progreso)      │
│ Papá: 25, Mamá: 18, Hijo: 12       │
│                                     │
│ GRÁFICO 2: DISTRIBUCIÓN DE PUNTOS  │
│    🟢 Papá (35%)                    │
│    🟡 Mamá (28%)                    │
│    🟠 Hijo (20%)                    │
│    🔵 Hija (17%)                    │
│                                     │
│ TABLA: TOP PERFORMERS              │
│ 1. 🥇 Papá - 1,250 puntos          │
│ 2. 🥈 Mamá - 980 puntos            │
│ 3. 🥉 Hijo - 750 puntos            │
│ 4.    Hija - 620 puntos            │
└─────────────────────────────────────┘
```

---

## 🔔 8. NOTIFICACIONES

**Icono 🔔 en header (arriba a la derecha)**

```
┌──────────────────────────────┐
│ 🔔 NOTIFICACIONES (3 nuevas) │
├──────────────────────────────┤
│                              │
│ ✅ Tareas completadas hoy    │
│ "Papá completó Limpiar..."  │
│ hace 5 minutos               │
│                              │
│ ⚠️ Tarea vence hoy           │
│ "Comprar leche vence hoy"   │
│ hace 2 horas                 │
│                              │
│ 🏆 Logro desbloqueado        │
│ "Mamá obtuvo: Persistente"  │
│ hace 1 hora                  │
│                              │
│ 🎁 Recompensa disponible     │
│ "Pizza night está disponible"│
│ ayer                         │
│                              │
└──────────────────────────────┘
```

---

## 👤 9. PERFIL DE USUARIO

**Menú: Perfil**

```
┌─────────────────────────────────────┐
│ 👤 MI PERFIL                        │
│                                     │
│ ┌────────┐                          │
│ │  👨    │  PAPÁ                    │
│ │ Avatar │  Email: papa@email.com   │
│ └────────┘  Miembro desde: Ene 2025 │
│                                     │
│ ESTADÍSTICAS:                       │
│ • Puntos totales: 1,250             │
│ • Nivel: 5 ⭐⭐⭐⭐⭐              │
│ • Tareas completadas: 45            │
│ • Logros desbloqueados: 12          │
│ • Racha actual: 7 días              │
│                                     │
│ MIS LOGROS:                         │
│ 🥇 🥈 🥉 🎖️ 🏆 ⭐ 🎯 🚀 ...        │
│                                     │
│ [Editar Perfil]  [Cerrar Sesión]   │
└─────────────────────────────────────┘
```

---

## ⚙️ 10. CONFIGURACIÓN

**Menú: Configuración**

```
┌─────────────────────────────────────┐
│ ⚙️ CONFIGURACIÓN                    │
│                                     │
│ APARIENCIA:                         │
│ [ ] Tema claro                      │
│ [x] Tema oscuro                     │
│ [ ] Automático                      │
│                                     │
│ NOTIFICACIONES:                     │
│ [x] Activar notificaciones          │
│ [x] Sonido                          │
│ [ ] Email                           │
│                                     │
│ PRIVACIDAD:                         │
│ [x] Perfil visible para familia     │
│ [ ] Mostrar puntos públicamente     │
│                                     │
│ DATOS:                              │
│ [Exportar datos] [Limpiar cache]   │
│                                     │
│ [Guardar cambios]                   │
└─────────────────────────────────────┘
```

---

## 🎯 SIDEBAR (Menú Lateral)

**Lo que ves siempre a la izquierda:**

```
┌───────────────────────┐
│ 🏠 Dashboard          │  ← Pantalla principal
├───────────────────────┤
│ 📋 MIS TAREAS         │
├───────────────────────┤
│ 📝 TAREAS (todas)     │  ← Vista Kanban/Tabla
├───────────────────────┤
│ 👥 EQUIPO             │
│   ├─ Miembros        │  ← Ver gente
│   ├─ Actividades     │  ← Log de eventos
│   └─ Rutinas         │  ← Tareas recurrentes
├───────────────────────┤
│ 🏆 LOGROS             │  ← Achievements
├───────────────────────┤
│ 🎁 TIENDA             │  ← Rewards
│   ├─ Recompensas     │
│   └─ Canjeadas       │
├───────────────────────┤
│ 📊 ESTADÍSTICAS       │  ← Gráficos
├───────────────────────┤
│ ⚙️ CONFIGURACIÓN      │  ← Settings
└───────────────────────┘
```

---

## 🎨 COLORES PRINCIPALES

```
🟢 Verde Primario:  #28AC71  (Botones, acciones, "ir")
🟠 Naranja Accent:  #E76F51  (Urgente, importante)
⚫ Gris Secundario:  #605669  (Texto secundario)
🟤 Foreground:      #322B38  (Texto principal)

En tema oscuro: Colores invertidos (fondo oscuro)
En tema claro:  Colores claros (fondo blanco)
```

---

## 🎮 INTERACCIONES COMUNES

### CREAR TAREA
```
1. Click en "Nueva Tarea" (botón verde)
2. Rellena:
   - Título (obligatorio)
   - Descripción
   - Asignado a (persona)
   - Fecha de vencimiento
   - Puntos
   - Categoría
3. Click "Crear"
✅ Tarea aparece en Kanban
```

### CAMBIAR ESTADO TAREA
```
1. En Kanban: Arrastra tarea entre columnas
2. En Tabla: Click en botón Estado, elige nueva opción
✅ Cambios se guardan automáticamente
```

### GANAR PUNTOS
```
1. Tarea asignada a ti
2. Cambias estado a "Completada"
3. Automáticamente:
   - ✅ Ganas los puntos
   - 🔔 Notificación
   - 📊 Estadísticas se actualizan
```

### CANJEAR RECOMPENSA
```
1. Menú: Tienda → Recompensas
2. Busca recompensa
3. Click "Canjear"
4. Automáticamente:
   - Puntos se restan
   - Aparece en "Canjeadas"
   - Notificación para toda la familia
```

---

## 💡 TIPS

```
✨ Tema oscuro: Mejor para ojos (click icon 🌙)
🔔 Notificaciones: Click campana para ver últimas
📱 Responsive: Funciona en móvil (responsive design)
⌨️ Buscar: Ctrl+F en cualquier sección
🖱️ Drag & Drop: Arrastra tareas en Kanban
🎯 Filtros: Cada sección tiene filtros personalizados
```

---

## 🚀 RESUMEN RÁPIDO

| Sección | Para Qué | Dónde |
|---------|----------|-------|
| **Dashboard** | Ver resumen general | Home |
| **Tareas** | Gestionar todas | Menú → Tareas |
| **Mis Tareas** | Ver solo mis asignadas | Menú → Mis Tareas |
| **Miembros** | Ver familia | Menú → Equipo |
| **Logros** | Ver badges ganados | Menú → Logros |
| **Recompensas** | Canjear puntos | Menú → Tienda |
| **Estadísticas** | Ver gráficos | Menú → Estadísticas |
| **Perfil** | Mis datos | Usuario icon |
| **Configuración** | Ajustes | Menú → Configuración |

---

## 📚 PRÓXIMO PASO

1. Ejecuta: `npm run dev`
2. Abre: `http://localhost:5173`
3. **Explora cada sección**
4. Prueba drag-drop, crear tareas, ganar puntos
5. ¡Muestra a tu equipo!

---

**¡Bienvenido a HOMELY! 🏠✨**

Preguntas? Revisa **docs/INDEX.md** para más información.

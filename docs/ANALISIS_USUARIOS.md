# 🚨 ANÁLISIS CRÍTICO: GESTIÓN DE USUARIOS

**Conclusión:** ❌ **NO está bien implementado. Hay inconsistencias graves.**

---

## 🔴 PROBLEMAS IDENTIFICADOS

### PROBLEMA 1: "Usuario Actual" NO está consistente

**Ubicaciones donde se usa:**

| Componente | Implementación | Estado |
|-----------|-----------------|--------|
| `App.tsx` | `const currentUser = members.find(...) \|\| members[0]` | ✅ Dinámica |
| `Rewards.tsx` | `const currentUser = members[0]` | ❌ Hardcodeada |
| `MyTasks.tsx` | `const [selectedMemberId] = useState(members[0]?.id)` | ⚠️ Parcial |
| `TaskList.tsx` | `const currentUser = members[0]` | ❌ Hardcodeada |
| `Profile.tsx` | Recibe `currentUser` prop | ✅ Correcta |
| `Achievements.tsx` | Recibe `currentUser` prop | ✅ Correcta |

**Impacto:** 
- Rewards SIEMPRE muestra datos de Ana (members[0])
- MyTasks usa members[0] como fallback
- TaskList usa members[0] como usuario actual
- Cambiar de usuario NO afecta a Rewards, MyTasks, TaskList

---

### PROBLEMA 2: currentUserId Existe pero NO se Usa Correctamente

**En App.tsx:**
```tsx
// ✅ Existe
const [currentUserId, setCurrentUserId] = useState<string | null>(null);

// ✅ Se calcula correctamente
const currentUser = members.find(m => m.id === currentUserId) || members[0];

// ✅ Se pasa a Profile
<Profile currentUser={currentUser} onChangeUser={(userId) => setCurrentUserId(userId)} />

// ❌ NO se pasa a Rewards
<LazyRewards
  rewards={rewards}
  members={members}
  // Falta: currentUserId, onChangeUser
/>

// ❌ NO se pasa a MyTasks
<MyTasks
  members={members}
  tasks={tasks}
  // Falta: currentUserId, onChangeUser
/>
```

---

### PROBLEMA 3: NO Hay UI para Cambiar Usuario (Excepto Profile)

**Situación actual:**
- Solo en Profile puedes hacer click en otro usuario
- Ese click llama: `onChangeUser((userId) => setCurrentUserId(userId))`
- Cambias a ese usuario
- ✅ Profile se actualiza
- ❌ Rewards NO se actualiza
- ❌ MyTasks NO se actualiza

**Usuario no sabe que cambió de usuario**

---

### PROBLEMA 4: UserAvatar en Header NO es Clickeable (probablemente)

```tsx
// En UserAvatar.tsx
export function UserAvatar({ member, size = 'md', onClick }: UserAvatarProps) {
  return (
    <button
      onClick={onClick}
      // ...
    >
      {member.avatar}
    </button>
  );
}
```

**Tiene onClick prop, pero ¿quién la llama?**

En Header (app.tsx), probablemente:
```tsx
<UserAvatar member={currentUser} />
// ❌ NO pasa onClick
```

---

### PROBLEMA 5: DefaultUser = members[0]

Todos los fallbacks apuntan a `members[0]` (Ana):

```tsx
// App.tsx
const currentUser = members.find(...) || members[0]  // ← Ana es fallback

// Rewards.tsx
const currentUser = members[0]  // ← Siempre Ana

// MyTasks.tsx
const [selectedMemberId] = useState(members[0]?.id)  // ← Siempre Ana

// TaskList.tsx
const currentUser = members[0]  // ← Siempre Ana
```

**Problema:** Si Ana se elimina, TODO se rompe

---

### PROBLEMA 6: NO Hay Forma de "Cerrar Sesión"

**Preguntas sin respuesta:**
- ¿Cómo se loguea un usuario?
- ¿Hay contraseña?
- ¿Hay sesión guardada en localStorage?
- ¿currentUserId se restaura al recargar?

**Actual:** Al recargar, `currentUserId = null` → fallback a members[0]

---

### PROBLEMA 7: Data NO está Segregada por Usuario

**Ejemplo - Notificaciones:**
```tsx
const [notifications, setNotifications] = useState<Notification[]>([]);
// ↑ GLOBAL para todos, no por usuario
```

**Debería ser:**
```tsx
// Opción 1: Array con userId
const [notifications, setNotifications] = useState<Notification[]>([]);
// Cada notificación tiene: { ..., userId, ... }

// Opción 2: Map de notificaciones por usuario
const [notificationsByUser, setNotificationsByUser] = useState<
  Map<string, Notification[]>
>();
```

---

### PROBLEMA 8: Estado NO se Persiste Correctamente

**currentUserId NO se guarda en localStorage:**

```tsx
// App.tsx
const [currentUserId, setCurrentUserId] = useState<string | null>(null);

// useEffect que persiste
useEffect(() => {
  localStorage.setItem('homely_members', JSON.stringify(members));
}, [members]);

// ❌ NO HAY PARA currentUserId
```

**Al recargar:**
1. currentUserId es null
2. Fallback a members[0]
3. Usuario vuelve a Ana, aunque estaba en otro antes

---

### PROBLEMA 9: Inconsistencia en Cómo Se Obtiene "Usuario Actual"

```tsx
// FORMA 1 - App.tsx (correcta)
const currentUser = members.find(m => m.id === currentUserId) || members[0];

// FORMA 2 - Rewards.tsx (incorrecta)
const currentUser = members[0];

// FORMA 3 - MyTasks.tsx (parcial)
const [selectedMemberId] = useState<string>(members[0]?.id || '');

// FORMA 4 - Profile.tsx (recibe como prop)
export function Profile({ currentUser, ... }) { ... }
```

---

## 📊 IMPACTO DE ESTOS PROBLEMAS

### Caso de Uso Real:

```
Usuario: Papá (ID: padre123)

1. Abre app
   └─ currentUserId = null → Se muestra Ana
   └─ Todas las secciones muestran datos de Ana

2. Va a Profile
   └─ Click en "Papá"
   └─ currentUserId = padre123
   └─ Profile se actualiza ✅

3. Va a Rewards
   └─ Sigue viendo recompensas de Ana ❌
   └─ No es consciente de que "cambió de usuario"

4. Canjea recompensa como si fuera Ana ❌
   └─ Sus puntos se restan a Ana (no a Papá)
   └─ Datos incorrectos

5. Recarga página
   └─ currentUserId = null → Vuelve a Ana
   └─ Nadie sabe dónde estaban
```

---

## 🔧 SOLUCIONES REQUERIDAS

### SOLUCIÓN 1: Consistencia en Todos los Componentes
```tsx
// TODOS los componentes deben recibir:
// - currentUserId (string | null)
// - onChangeUser ((userId: string) => void)

// Y calcular:
// const currentUser = members.find(m => m.id === currentUserId) || members[0];
```

### SOLUCIÓN 2: Persistencia de Usuario
```tsx
useEffect(() => {
  localStorage.setItem('homely_currentUserId', currentUserId || '');
}, [currentUserId]);

useEffect(() => {
  const saved = localStorage.getItem('homely_currentUserId');
  if (saved && saved !== '' && members.some(m => m.id === saved)) {
    setCurrentUserId(saved);
  } else {
    setCurrentUserId(members[0]?.id || null);
  }
}, [members]);
```

### SOLUCIÓN 3: UI para Cambiar Usuario
```tsx
// En Header o Sidebar:
// Mostrar avatares de todos los usuarios
// Click en avatar = setCurrentUserId(usuarioID)
// Highlight en usuario actual
```

### SOLUCIÓN 4: Validación de Usuario
```tsx
// Después de eliminar usuario:
if (currentUserId === deletedUserId) {
  setCurrentUserId(members[0]?.id || null);
}
```

---

## 📋 CHECKLIST DE CORRECCIONES NECESARIAS

- [ ] Pasar `currentUserId` y `onChangeUser` a Rewards.tsx
- [ ] Pasar `currentUserId` y `onChangeUser` a MyTasks.tsx
- [ ] Pasar `currentUserId` y `onChangeUser` a TaskList.tsx
- [ ] Actualizar Rewards.tsx para usar prop en lugar de members[0]
- [ ] Actualizar MyTasks.tsx para usar prop en lugar de members[0]
- [ ] Actualizar TaskList.tsx para usar prop en lugar de members[0]
- [ ] Implementar persistencia de currentUserId en localStorage
- [ ] Agregar UI selectora de usuario en Header/Sidebar
- [ ] Validar usuario al cargar (localStorage)
- [ ] Validar usuario cuando se elimina un miembro
- [ ] Hacer UserAvatar clickeable en Header

---

## 🎯 PRIORIDADES

### CRÍTICA (Causa bugs reales):
1. Rewards no muestra datos correctos del usuario actual
2. MyTasks no filtra por usuario actual
3. No hay forma visual de cambiar de usuario

### ALTA (Experiencia):
4. Usuario no persiste al recargar
5. No hay validación cuando se elimina usuario actual

### MEDIA (Mejora):
6. Inconsistencia en cómo se obtiene usuario actual

---

## ✅ RECOMENDACIÓN FINAL

**Estado: REQUIERE REFACTORIZACIÓN**

La arquitectura de "usuario actual" está a medio implementar. Funciona en Profile pero no en otros lugares.

**Solución propuesta:**
- 30 minutos: Corregir inconsistencias de usuario actual
- 15 minutos: Persistencia en localStorage
- 15 minutos: UI selectora de usuario

**Total: 1 hora para que funcione correctamente**

¿Quieres que lo corrija? 🔧

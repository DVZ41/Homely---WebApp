# 🎨 Homely Design System

> **Versión:** 1.0.0 | **Stack:** React + TypeScript + Tailwind CSS v4

Sistema de diseño corporativo completo para la aplicación Homely.

---

## 📑 Índice

1. [Paleta de Colores](#-paleta-de-colores)
2. [Tipografía](#-tipografía)
3. [Clases de Hover](#-clases-de-hover-estándar)
4. [Componentes](#-componentes)
5. [Gamificación](#-gamificación)

---

## 🎨 Paleta de Colores

### Colores Principales

| Color | HEX | Variable CSS | Uso |
|-------|-----|--------------|-----|
| 🟢 Primary | `#28AC71` | `--primary` | Botones principales, enlaces, acciones |
| 🟢 Primary Light | `#3DD98C` | `--primary-light` | Estados activos |
| 🟢 Primary Hover | `#229960` | `--primary-hover` | Hover en primarios |
| 🟠 Accent | `#E76F51` | `--accent` | Destacados, urgencias |
| ⚫ Secondary | `#605669` | `--secondary` | Texto secundario |
| ⚫ Foreground | `#322B38` | `--foreground` | Texto principal |

### Colores de Categorías

| Categoría | Emoji | HEX | Variable |
|-----------|-------|-----|----------|
| Cocina | 🍳 | `#F97316` | `--category-kitchen` |
| Limpieza | 🧹 | `#FBBF24` | `--category-cleaning` |
| Baño | 🚿 | `#06B6D4` | `--category-bathroom` |
| Lavandería | 👕 | `#2563EB` | `--category-laundry` |
| Compras | 🛒 | `#EC4899` | `--category-shopping` |
| Jardín | 🌱 | `#22C55E` | `--category-garden` |
| Mascotas | 🐾 | `#A16207` | `--category-pets` |
| General | 📋 | `#64748B` | `--category-general` |

### Colores Semánticos

| Estado | HEX | Variable | Uso |
|--------|-----|----------|-----|
| ✅ Éxito | `#22C55E` | `--success` | Completado, confirmación |
| ⚠️ Advertencia | `#F59E0B` | `--warning` | Alertas |
| ℹ️ Info | `#0EA5E9` | `--info` | Información |
| 🚨 Peligro | `#EF4444` | `--danger` | Errores, eliminar |

### Rarezas de Badges

| Rareza | HEX | Variable |
|--------|-----|----------|
| ⚪ Common | `#9CA3AF` | `--rarity-common` |
| 🔵 Rare | `#3B82F6` | `--rarity-rare` |
| 💜 Epic | `#A855F7` | `--rarity-epic` |
| 🟡 Legendary | `#F59E0B` | `--rarity-legendary` |

---

## ✍️ Tipografía

### Fuentes
- **Work Sans**: Texto general (400, 500, 600, 700)
- **Lora**: Títulos elegantes (400, 500, 600, 700)

### Escala
| Clase | Tamaño | Uso |
|-------|--------|-----|
| `text-xs` | 12px | Etiquetas, badges |
| `text-sm` | 14px | Texto secundario |
| `text-base` | 16px | Texto principal |
| `text-lg` | 18px | Subtítulos |
| `text-xl` | 20px | Títulos de sección |
| `text-2xl` | 24px | Títulos de página |

---

## 🖱️ Clases de Hover Estándar

### Navegación
```tsx
className="hover-nav"
```
**Uso**: Elementos del menú de navegación lateral
- Fondo verde suave (10% opacity)
- Escala ligera (102%)
- Transición: 200ms

**Ejemplo**:
```tsx
<button className="px-4 py-3 rounded-xl hover-nav">
  Inicio
</button>
```

---

### Botones Primarios
```tsx
className="hover-button-primary"
```
**Uso**: Botones de acción principal (Guardar, Crear, Enviar)
- Fondo más oscuro
- Sombra elevada
- Escala 102% / Active 98%

**Ejemplo**:
```tsx
<button className="bg-primary text-white px-6 py-3 rounded-lg hover-button-primary">
  Crear Tarea
</button>
```

---

### Botones Secundarios
```tsx
className="hover-button-secondary"
```
**Uso**: Botones secundarios (Cancelar, Ver más)
- Fondo secundario suave
- Sombra media
- Escala 102% / Active 98%

---

### Cards Informativas
```tsx
className="hover-card"
```
**Uso**: Tarjetas que muestran información (estadísticas, resúmenes)
- Sombra elevada
- Escala sutil (102%)
- Borde primario suave
- Transición: 300ms

**Ejemplo**:
```tsx
<div className="bg-card p-6 rounded-xl border hover-card">
  <h3>Total de Tareas</h3>
  <p>25</p>
</div>
```

---

### Cards Interactivas
```tsx
className="hover-card-interactive"
```
**Uso**: Tarjetas clicables (tareas, recompensas, miembros)
- Sombra elevada
- Escala más notable (103%)
- Cursor pointer
- Active state (101%)

**Ejemplo**:
```tsx
<div className="bg-card p-4 rounded-xl border hover-card-interactive" onClick={handleClick}>
  <h3>Tarea Pendiente</h3>
</div>
```

---

### Items de Lista
```tsx
className="hover-list-item"
```
**Uso**: Elementos en listas (notificaciones, historial)
- Fondo muted suave
- Padding left animado
- Borde izquierdo primario
- Transición: 200ms

---

### Botones de Icono
```tsx
className="hover-icon-button"
```
**Uso**: Botones solo con iconos (modo oscuro, notificaciones, acciones rápidas)
- Fondo primario suave
- Color primario
- Escala 110% / Active 95%

**Ejemplo**:
```tsx
<button className="p-2 rounded-xl hover-icon-button">
  <Bell className="w-5 h-5" />
</button>
```

---

### Acciones Destructivas
```tsx
className="hover-destructive"
```
**Uso**: Botones de eliminar, cancelar, rechazar
- Fondo destructive suave
- Color destructive
- Escala 102% / Active 98%

**Ejemplo**:
```tsx
<button className="px-4 py-2 rounded-lg hover-destructive">
  Eliminar
</button>
```

---

### Enlaces
```tsx
className="hover-link"
```
**Uso**: Enlaces de texto
- Color primario
- Subrayado con offset
- Transición: 150ms

**Ejemplo**:
```tsx
<a href="#" className="hover-link">
  Ver más detalles
</a>
```

---

### Badges/Tags
```tsx
className="hover-badge"
```
**Uso**: Etiquetas clicables (categorías, filtros)
- Sombra media
- Escala 105%

---

### Inputs
```tsx
className="focus-input"
```
**Uso**: Campos de formulario (inputs, textareas, selects)
- Ring primario al hacer focus
- Borde primario
- Transición: 200ms

**Ejemplo**:
```tsx
<input 
  type="text" 
  className="w-full px-4 py-2 border rounded-lg focus-input"
  placeholder="Nombre de la tarea"
/>
```

---

## 📋 Guía de Uso

### ✅ Hacer:
- Usar estas clases en todos los elementos interactivos nuevos
- Mantener consistencia en toda la aplicación
- Combinar con clases de estado (active, disabled, etc.)

### ❌ Evitar:
- Crear efectos hover personalizados sin documentar
- Usar transiciones más lentas de 300ms (excepto animaciones especiales)
- Mezclar múltiples clases de hover en el mismo elemento

---

## 🎯 Ejemplos Completos

### Tarjeta de Tarea
```tsx
<div className="bg-card p-4 rounded-xl border hover-card-interactive">
  <div className="flex items-center justify-between">
    <h3 className="font-semibold">Lavar los platos</h3>
    <button className="p-2 rounded-lg hover-icon-button">
      <MoreVertical className="w-4 h-4" />
    </button>
  </div>
  <p className="text-muted-foreground mt-2">Lavar todos los platos del desayuno</p>
  <div className="flex gap-2 mt-4">
    <button className="px-4 py-2 bg-primary text-white rounded-lg hover-button-primary">
      Completar
    </button>
    <button className="px-4 py-2 border rounded-lg hover-destructive">
      Eliminar
    </button>
  </div>
</div>
```

### Formulario de Configuración
```tsx
<form className="space-y-4">
  <div>
    <label className="block mb-2">Nombre del hogar</label>
    <input 
      type="text" 
      className="w-full px-4 py-2 border rounded-lg focus-input"
      placeholder="Mi Hogar"
    />
  </div>
  <div>
    <label className="block mb-2">Mensaje de bienvenida</label>
    <textarea 
      className="w-full px-4 py-2 border rounded-lg focus-input"
      rows={3}
      placeholder="Bienvenido a casa..."
    />
  </div>
  <div className="flex gap-3">
    <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover-button-primary">
      Guardar
    </button>
    <button type="button" className="px-6 py-2 border rounded-lg hover-button-secondary">
      Cancelar
    </button>
  </div>
</form>
```

---

## 🔄 Actualización

**Última actualización**: Enero 2025  
**Versión**: 1.0.0

---

## 🧩 Componentes Clave

### Avatares de Usuario
```tsx
<div 
  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium"
  style={{ backgroundColor: member.color }}
>
  {member.name.charAt(0).toUpperCase()}
</div>
```

### Botones de Asignación
- Incluyen `ChevronDown` para indicar dropdown
- Color del avatar del miembro asignado

### Badges de Categoría
```tsx
<span style={{ backgroundColor: getCategoryColor(category) }}>
  {getCategoryEmoji(category)} {category}
</span>
```

---

## 🎮 Gamificación

### Podium
| Posición | Color | HEX |
|----------|-------|-----|
| 🥇 Oro | Dorado | `#FFD700` |
| 🥈 Plata | Plateado | `#C0C0C0` |
| 🥉 Bronce | Bronce | `#CD7F32` |

### XP
- Color: `#A855F7` (púrpura)
- Icono: Sparkles

---

## ⚠️ Notas Importantes

### Estilos Inline Permitidos
Los siguientes usos de `style={{}}` son **intencionados** y necesarios:

```tsx
// ✅ Colores dinámicos de miembros
style={{ backgroundColor: member.color }}

// ✅ Colores dinámicos de categorías  
style={{ borderColor: getCategoryColor(task.category) }}

// ✅ Colores de rarezas
style={{ background: getRarityGradient(badge.rarity) }}
```

Estos generan advertencias de CSS pero son correctos porque los colores vienen de datos dinámicos.

---

> Para más detalles técnicos, ver [README.md](README.md)

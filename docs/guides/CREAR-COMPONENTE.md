# 🧩 CÓMO CREAR UN COMPONENTE

Guía paso a paso para crear un nuevo componente React en HOMELY.

---

## 🎯 ESCENARIO

Quiero crear un componente nuevo llamado `TagInput` que permita agregar tags a las tareas.

---

## 📋 PASO 1: PLANIFICAR

Antes de escribir código, piensa:

```
1. ¿Qué hace el componente?
   → Permite agregar y remover tags

2. ¿Qué props necesita?
   → tags: string[]
   → onAdd: (tag: string) => void
   → onRemove: (tag: string) => void

3. ¿Qué estado interno necesita?
   → input: string (campo de texto)

4. ¿Usa componentes de shadcn/ui?
   → Button, Input, Badge
```

---

## 🎨 PASO 2: CREAR EL ARCHIVO

**Ubicación:** `components/TagInput.tsx`

```bash
# Crear archivo (en tu editor, no en terminal)
components/TagInput.tsx
```

---

## 📝 PASO 3: ESCRIBIR EL COMPONENTE

### Estructura Base

```tsx
// components/TagInput.tsx

// 1. IMPORTS
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

// 2. TIPOS
interface TagInputProps {
  tags: string[]
  onAdd: (tag: string) => void
  onRemove: (tag: string) => void
  placeholder?: string
  maxTags?: number
}

// 3. COMPONENTE
export function TagInput({
  tags,
  onAdd,
  onRemove,
  placeholder = 'Agregar tag...',
  maxTags = 10,
}: TagInputProps) {
  // Estado local
  const [input, setInput] = useState('')

  // Funciones
  const handleAdd = () => {
    const trimmedInput = input.trim()
    
    // Validar
    if (!trimmedInput) {
      alert('El tag no puede estar vacío')
      return
    }
    
    if (tags.includes(trimmedInput)) {
      alert('Este tag ya existe')
      return
    }
    
    if (tags.length >= maxTags) {
      alert(`Máximo ${maxTags} tags permitidos`)
      return
    }
    
    // Agregar
    onAdd(trimmedInput)
    setInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  // Render
  return (
    <div className="space-y-2">
      {/* Input y botón */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button onClick={handleAdd} variant="default">
          Agregar
        </Button>
      </div>

      {/* Lista de tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {tag}
              <button
                onClick={() => onRemove(tag)}
                className="ml-1 hover:opacity-70"
              >
                <X size={14} />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Contador */}
      <p className="text-sm text-muted-foreground">
        {tags.length}/{maxTags} tags
      </p>
    </div>
  )
}
```

---

## 🔗 PASO 4: USAR EN APP.TSX

Ahora integra tu componente en `App.tsx`:

```tsx
// App.tsx

import { TagInput } from './components/TagInput'

export function App() {
  // En tu estado global
  const [taskTags, setTaskTags] = useState<string[]>(['urgente'])

  const handleAddTag = (tag: string) => {
    setTaskTags([...taskTags, tag])
  }

  const handleRemoveTag = (tag: string) => {
    setTaskTags(taskTags.filter((t) => t !== tag))
  }

  return (
    <div>
      {/* Usar componente */}
      <TagInput
        tags={taskTags}
        onAdd={handleAddTag}
        onRemove={handleRemoveTag}
        maxTags={5}
      />
    </div>
  )
}
```

---

## ✅ PASO 5: VALIDAR

```bash
# Verificar que compile
npm run build

# Verificar que no haya errores
npm run lint

# Si ESLint encuentra problemas, arregla:
npm run lint --fix

# Formatea código
npm run format
```

---

## 🧪 PASO 6: PROBAR

```bash
# Inicia dev server
npm run dev

# Abre http://localhost:5173
# Prueba tu componente
# - Agrega tags
# - Remueve tags
# - Intenta duplicados
# - Intenta llenar máximo
```

---

## 📋 CHECKLIST DEL COMPONENTE

```
Funcionalidad
✅ Componente hace lo que debe
✅ Props documentadas en interface
✅ Validaciones correctas
✅ Maneja errores

Código
✅ Nombres claros (camelCase, PascalCase)
✅ Sin console.log
✅ Sin variables no usadas
✅ Tipos correctos (TypeScript)

Estilo
✅ Usa Tailwind CSS
✅ Responsive
✅ Accesible (labels, ARIA)

Integración
✅ Compila sin errores
✅ ESLint pasa
✅ Prettier formateado
✅ Se ve bien en navegador
```

---

## 🎓 EJEMPLO REAL: CREAR COMPONENTE MÁS COMPLEJO

### Componente: `FilterBar`

```tsx
// components/FilterBar.tsx

import { useState, useMemo } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface FilterBarProps {
  onFilter: (filtros: Filtros) => void
  categorias: string[]
}

interface Filtros {
  busqueda: string
  categoria: string
  ordenar: 'fecha' | 'nombre'
}

export function FilterBar({ onFilter, categorias }: FilterBarProps) {
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('todas')
  const [ordenar, setOrdenar] = useState<'fecha' | 'nombre'>('fecha')

  // Actualizar filtros cuando cambien
  const filtrosActuales = useMemo(
    () => ({
      busqueda,
      categoria,
      ordenar,
    }),
    [busqueda, categoria, ordenar]
  )

  // Llamar callback cuando cambien filtros
  const handleFilterChange = () => {
    onFilter(filtrosActuales)
  }

  return (
    <div className="flex gap-4 p-4 bg-card rounded-lg">
      {/* Búsqueda */}
      <Input
        placeholder="Buscar..."
        value={busqueda}
        onChange={(e) => {
          setBusqueda(e.target.value)
          handleFilterChange()
        }}
        className="flex-1"
      />

      {/* Categoría */}
      <Select value={categoria} onValueChange={setCategoria}>
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas</SelectItem>
          {categorias.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Ordenar */}
      <Select value={ordenar} onValueChange={(v) => setOrdenar(v as any)}>
        <SelectTrigger className="w-[150px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fecha">Fecha</SelectItem>
          <SelectItem value="nombre">Nombre</SelectItem>
        </SelectContent>
      </Select>

      {/* Limpiar filtros */}
      <Button
        variant="outline"
        onClick={() => {
          setBusqueda('')
          setCategoria('todas')
          setOrdenar('fecha')
        }}
      >
        Limpiar
      </Button>
    </div>
  )
}
```

---

## 🚀 PASOS RESUMIDOS

```
1. PLANIFICAR
   - ¿Qué hace?
   - ¿Qué props?
   - ¿Qué estado?

2. CREAR ARCHIVO
   - components/MiComponente.tsx

3. ESCRIBIR CÓDIGO
   - Imports
   - Types/Interfaces
   - Componente (función)

4. USAR EN APP.TSX
   - Importar componente
   - Pasar props

5. VALIDAR
   - npm run build
   - npm run lint
   - npm run format

6. PROBAR
   - npm run dev
   - Abrir navegador
   - Probar funcionalidad

7. COMMIT
   - git add .
   - git commit -m "feat: crear componente X"
   - git push
```

---

## 💡 TIPS

### Usar Componentes UI
```tsx
// ✅ Siempre usa componentes de shadcn/ui
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'

// ❌ No hagas HTML crudo
<button>Mi botón</button>  // Usa Button
<div>Mi tarjeta</div>      // Usa Card
```

### Tipado Correcto
```tsx
// ✅ BIEN
interface MyProps {
  title: string
  count: number
  onClick: (id: string) => void
}

// ❌ MAL
interface MyProps {
  title: any
  count?: unknown
  onClick: any
}
```

### Evitar Props Drilling
```tsx
// Si pasas más de 3-4 niveles de props, considera:
// 1. Usar Context API
// 2. Reorganizar componentes
// 3. Crear componentes más grandes
```

---

**¡Ahora estás listo para crear componentes profesionales!** 🚀

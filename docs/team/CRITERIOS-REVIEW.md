# ✅ CRITERIOS DE REVISIÓN

Checklist que todo revisor debe seguir antes de aprobar un PR.

---

## 👀 REVISIÓN TÉCNICA

### Compilación y Build
- [ ] `npm run build` compila sin errores
- [ ] `npm run lint` no tiene warnings
- [ ] `npm run format` está aplicado
- [ ] No hay TypeScript errors

```bash
# Verificar localmente
npm run build
npm run lint
npm run format
```

---

### Código TypeScript
- [ ] Tipos correctos (no `any`)
- [ ] Interfaces/types bien definidas
- [ ] Nombres claros (camelCase, PascalCase)
- [ ] Sin variables no usadas
- [ ] Sin imports no usados

**Ejemplo a rechazar:**
```tsx
// ❌ any
const data: any = response

// ✅ Correcto
const data: Task[] = response
```

---

### Nombres y Convenciones
- [ ] Componentes en PascalCase
- [ ] Variables en camelCase
- [ ] Constantes en UPPER_SNAKE_CASE
- [ ] Funciones descriptivas
- [ ] Props en interface con sufijo "Props"

---

### Estructura de Código
- [ ] Imports organizados (React, librerías, locales)
- [ ] Props destructurados
- [ ] No hay repetición de código (DRY)
- [ ] Funciones pequeñas y enfocadas

---

## 🎨 FUNCIONALIDAD

### Lógica
- [ ] La funcionalidad hace lo que debe
- [ ] Casos edge manejados
- [ ] Sin bugs obvios
- [ ] Validaciones correctas

**Preguntas:**
- ¿Qué pasa si el array está vacío?
- ¿Qué pasa si la respuesta es null?
- ¿Qué pasa si el usuario pone caracteres especiales?

---

### Testing Manual
- [ ] Funcionamiento verificado en navegador
- [ ] Responsive en móvil/tablet/desktop
- [ ] Validaciones funcionan
- [ ] localStorage persiste datos
- [ ] Flujo completo funciona

---

### Performance
- [ ] No re-renderiza innecesariamente
- [ ] useEffect tiene dependencias correctas
- [ ] No hay memory leaks
- [ ] Componentes lazy-loaded donde necesario

---

## 🔒 SEGURIDAD Y ACCESIBILIDAD

### Seguridad
- [ ] Sin XSS (input sanitizado)
- [ ] Sin credentials en el código
- [ ] Sin secrets en los archivos
- [ ] URLs validadas

---

### Accesibilidad
- [ ] Labels en inputs
- [ ] ARIA labels donde necesario
- [ ] Keyboard navigation funciona
- [ ] Contraste suficiente

---

## 📝 DOCUMENTACIÓN

### Código Comentado
- [ ] Comentarios explican el POR QUÉ, no el QUÉ
- [ ] Sin comentarios obvios
- [ ] README actualizado (si necesario)

---

### Mensajes de Commit
- [ ] Seguir convención: `feat:`, `fix:`, `refactor:`
- [ ] Mensaje claro y descriptivo
- [ ] Referencia a issue (si aplica)

**Ejemplos:**
```
✅ feat: agregar filtro por categoría
✅ fix: resolver error de localStorage en Firefox
✅ refactor: optimizar TaskList component

❌ fix: arreglar cosa
❌ update
❌ cambios varios
```

---

### Cambios en Package.json
- [ ] Nuevas dependencias justificadas
- [ ] Versiones locked (no ^, ni ~)
- [ ] Sin dependencias duplicadas

---

## 🚀 CHECKLIST COMPLETO

Antes de aprobar, verifica:

### Compila y Linting
```bash
npm run build
npm run lint
npm run format
```
- [ ] ✅ Todo pasa

### Probado Localmente
- [ ] ✅ Dev server funciona
- [ ] ✅ Feature implementado
- [ ] ✅ Sin bugs obvios
- [ ] ✅ UI se ve correcta

### Revisión de Código
- [ ] ✅ Tipos correctos
- [ ] ✅ Nombres claros
- [ ] ✅ Sin código muerto
- [ ] ✅ Bien estructurado

### Documentación
- [ ] ✅ Commits bien descritos
- [ ] ✅ Si es feature, documentación actualizada
- [ ] ✅ README correcto (si aplica)

### Cambios
- [ ] ✅ Líneas modificadas tienen sentido
- [ ] ✅ No hay cambios innecesarios
- [ ] ✅ Archivos son relevantes

---

## 🔴 RAZONES PARA RECHAZAR

**Rechazo inmediato si:**
- ❌ No compila (`npm run build` falla)
- ❌ ESLint/Prettier no pasan
- ❌ TypeScript errors
- ❌ Código sospechoso o malicioso
- ❌ Secrets en el código

**Rechazo si:**
- ❌ No está probado
- ❌ Bugs obvios
- ❌ No sigue convenciones
- ❌ Mal nombrado
- ❌ Sin documentación necesaria

---

## 💬 COMENTARIOS ÚTILES

### Sugiere, no ordenes
```
❌ "Esto está mal"
✅ "¿Podríamos usar un type en lugar de any?"

❌ "Cambia esto"
✅ "Sugiero que uses useMemo aquí para evitar re-renders"
```

### Explica por qué
```
❌ "Rinde mal"
✅ "Este useEffect se ejecuta 500 veces porque le faltan dependencias"
```

### Ofrece soluciones
```
❌ "Esto no funciona"
✅ "Esto no funciona porque X. Sugerencia: usa Y en lugar de Z"
```

---

## ✨ APROBACIÓN

Aprueba (APPROVE) cuando:
- ✅ Compila sin errores
- ✅ Código está limpio y bien estructurado
- ✅ Feature funciona correctamente
- ✅ Tests pasan (si existen)
- ✅ Sigue convenciones del proyecto
- ✅ Documentación está actualizada

```
APROBADO ✅
```

---

## 📊 ESTADÍSTICAS

**Por cada PR, intenta:**
- Tiempo de revisión: 5-15 minutos
- Máximo 3-5 comentarios
- Ser respetuoso y constructivo
- Ayudar, no juzgar

---

**¡Revisa código de calidad! ✨**

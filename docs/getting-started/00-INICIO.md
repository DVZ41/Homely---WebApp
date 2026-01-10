# 📚 GUÍA COMPLETA - HOMELY PROJECT

**Bienvenido al proyecto HOMELY.** Esta guía te explica **todo lo que necesitas saber** para empezar a trabajar, entender el código y colaborar con el equipo.

---

## 🎯 ¿POR DÓNDE EMPIEZO?

### **Opción 1: Quiero empezar ahora mismo (15 minutos)**
```
1. Lee esta sección: "Setup Rápido" ↓
2. Ejecuta: npm install && npm run dev
3. ¡Listo! Abre http://localhost:5173
```

### **Opción 2: Quiero aprender todo (2 horas)**
```
Sigue la ruta de aprendizaje: Inicio → Desarrollo → Equipo
(Ver abajo "📋 RUTAS RECOMENDADAS")
```

### **Opción 3: Quiero una referencia rápida (5 minutos)**
→ Ve a [QUICK_REFERENCE.md](../reference/QUICK_REFERENCE.md)

---

## ⚡ SETUP RÁPIDO (5 MINUTOS)

### Paso 1: Instalar
```bash
npm install
```
Esto descarga todas las librerías necesarias (~500 MB, ocurre una sola vez)

### Paso 2: Iniciar servidor
```bash
npm run dev
```
Verás algo como:
```
VITE v5.4.21  ready in 1234 ms

➜  Local:   http://localhost:5173/
```

### Paso 3: Abrir en navegador
Abre **http://localhost:5173** en tu navegador y ¡voilà! ✨

---

## 📋 RUTAS RECOMENDADAS

### 🟢 **RUTA DESARROLLADOR** (1 hora)
*Si quieres empezar a programar hoy*

```
1. ⏱️ 10 min    → ¿QUÉ ES HOMELY?
2. ⏱️ 10 min    → COMANDOS DIARIOS
3. ⏱️ 20 min    → CÓMO FUNCIONA (Arquitectura)
4. ⏱️ 15 min    → CÓMO APORTAR (Contribución)
5. ⏱️ 5 min     → EMPEZAR A TRABAJAR
```

**Documentos:**
1. [01-que-es-homely.md](./01-que-es-homely.md)
2. [02-comandos-diarios.md](./02-comandos-diarios.md)
3. [ARQUITECTURA.md](../architecture/ARQUITECTURA.md)
4. [CONTRIBUIR.md](../guides/CONTRIBUIR.md)
5. ¡Abre VS Code y empieza!

---

### 🔵 **RUTA REVIEW** (45 minutos)
*Si vas a revisar código de otros*

```
1. ⏱️ 15 min    → CÓMO FUNCIONA (Arquitectura)
2. ⏱️ 15 min    → CONVENCIONES DE CÓDIGO
3. ⏱️ 15 min    → CRITERIOS DE REVIEW
```

**Documentos:**
1. [ARQUITECTURA.md](../architecture/ARQUITECTURA.md)
2. [CONVENCIONES.md](../guides/CONVENCIONES.md)
3. [CRITERIOS-REVIEW.md](../team/CRITERIOS-REVIEW.md)

---

### 🟣 **RUTA TECH LEAD** (30 minutos)
*Si lideras el equipo*

```
1. ⏱️ 10 min    → ESTADO DEL PROYECTO
2. ⏱️ 10 min    → CÓMO ESTÁ ORGANIZADO
3. ⏱️ 10 min    → PRÓXIMOS PASOS
```

**Documentos:**
1. [ESTADO.md](../team/ESTADO.md)
2. [ESTRUCTURA.md](../team/ESTRUCTURA.md)
3. [ROADMAP.md](../team/ROADMAP.md)

---

## 📁 ESTRUCTURA DE CARPETAS

```
homely/
├── 📂 docs/                    ← TODA LA DOCUMENTACIÓN
│   ├── 📂 getting-started/     ← COMIENZA AQUÍ
│   │   ├── 01-que-es-homely.md
│   │   └── 02-comandos-diarios.md
│   │
│   ├── 📂 guides/              ← GUÍAS DETALLADAS
│   │   ├── CONTRIBUIR.md
│   │   ├── CONVENCIONES.md
│   │   └── CREAR-COMPONENTE.md
│   │
│   ├── 📂 architecture/        ← ENTENDER EL CÓDIGO
│   │   └── ARQUITECTURA.md
│   │
│   ├── 📂 reference/           ← REFERENCIA RÁPIDA
│   │   ├── QUICK_REFERENCE.md
│   │   └── TROUBLESHOOTING.md
│   │
│   ├── 📂 team/                ← TRABAJO EN EQUIPO
│   │   ├── CRITERIOS-REVIEW.md
│   │   ├── ESTADO.md
│   │   ├── ESTRUCTURA.md
│   │   └── ROADMAP.md
│   │
│   └── 📄 INDEX.md             ← ÍNDICE PRINCIPAL (léelo)
│
├── 📂 components/              ← CÓDIGO REACT
│   ├── App.tsx
│   ├── TaskList.tsx
│   └── ...
│
├── 📂 styles/                  ← ESTILOS CSS
├── 📄 package.json             ← Dependencias
├── 📄 README.md                ← Inicio rápido (antes de docs)
└── ... otros archivos
```

---

## 🎨 CONCEPTOS CLAVE (EXPLICADOS SIMPLE)

### 1️⃣ **¿QUÉ ES REACT?**
Es un framework que permite crear interfaces web interactivas.

**Ejemplo:** Cuando haces click en un botón, React actualiza la pantalla sin recargar.

**En HOMELY:** TaskList es un componente React que muestra las tareas.

---

### 2️⃣ **¿QUÉ ES TYPESCRIPT?**
Es JavaScript con "tipos" que previenen errores.

**Ejemplo sin tipos:**
```javascript
function saludar(nombre) {
  return "Hola " + nombre;  // Si nombre es un número, ¡error!
}
```

**Ejemplo con tipos (TypeScript):**
```typescript
function saludar(nombre: string): string {
  return "Hola " + nombre;  // Solo acepta texto
}
```

**En HOMELY:** Evitamos errores como pasar números donde pide texto.

---

### 3️⃣ **¿QUÉ ES VITE?**
Es una herramienta que prepara tu código para que el navegador lo entienda.

**Sin Vite:** Código React → No funciona en navegador
**Con Vite:** Código React → Vite lo procesa → Funciona en navegador ✅

**En HOMELY:** Cuando haces `npm run dev`, Vite convierte tu código.

---

### 4️⃣ **¿QUÉ ES TAILWIND CSS?**
Es una forma fácil de hacer que se vea bonito sin escribir CSS complicado.

**Ejemplo:**
```tsx
// Sin Tailwind (CSS complicado)
<div style={{ padding: '16px', backgroundColor: '#blue', borderRadius: '8px' }}>

// Con Tailwind (simple)
<div className="p-4 bg-blue rounded-lg">
```

**En HOMELY:** Usamos clases Tailwind como `p-4` para espacios, `bg-blue` para color, etc.

---

### 5️⃣ **¿QUÉ ES GIT?**
Es un sistema para guardar cambios de código y trabajar con otros.

**Flujo básico:**
```
1. Hago cambios en mi archivo
2. git add .           (preparo cambios)
3. git commit -m "..."  (guardo cambios)
4. git push            (subo cambios al servidor)
5. Otros descargan: git pull
```

**En HOMELY:** Todos compartimos código a través de GitHub.

---

### 6️⃣ **¿QUÉ ES ESLint Y PRETTIER?**
Son robots que verifican tu código y lo hacen bonito.

**ESLint:**
- Revisa que no haya errores
- Se ejecuta: `npm run lint`

**Prettier:**
- Formatea código (indentación, espacios, etc)
- Se ejecuta: `npm run format`

**En HOMELY:** Se ejecutan automáticamente en cada commit.

---

## 🔄 FLUJO DE TRABAJO TÍPICO

### Escenario: Voy a crear una nueva feature

```
📍 INICIO DEL DÍA
├─ git checkout main
├─ git pull origin main
└─ ✅ Tengo código actualizado

📍 CREO MI RAMA
├─ git checkout -b feature/buscar-tareas
└─ ✅ Trabajo aislado de otros

📍 DESARROLLO (1-4 horas)
├─ npm run dev
├─ Edito archivos
├─ Pruebo en navegador
├─ Código funciona ✅
└─ npm run lint + npm run build ✅

📍 COMMIT (Cada 30 min aprox)
├─ git add .
├─ git commit -m "feat: agregar búsqueda de tareas"
└─ ✅ Cambios guardados localmente

📍 PUSH (Fin del día)
├─ git push origin feature/buscar-tareas
└─ ✅ Mi trabajo está en GitHub

📍 PULL REQUEST
├─ Abro PR en GitHub
├─ Lleno descripción
├─ Pido review a compañero
└─ ⏳ Espero feedback

📍 REVIEW
├─ Compañero revisa mi código
├─ Sugiere cambios (si los hay)
├─ Yo realizo cambios
└─ ✅ Aprobado

📍 MERGE
├─ Mi código se une a main
├─ Borro mi rama
└─ ✅ Feature en producción!
```

---

## 📚 CATEGORÍAS DE DOCUMENTACIÓN

### 🟢 **GETTING STARTED** (Comienza aquí)
Documentos en: `docs/getting-started/`

Para: Nuevo miembro del equipo
Contiene: Instalación, primer comando, cómo ver el proyecto

**Archivos:**
- `01-que-es-homely.md` - ¿Qué hace HOMELY?
- `02-comandos-diarios.md` - Comandos que usas todos los días

---

### 📘 **GUIDES** (Cómo hacer cosas)
Documentos en: `docs/guides/`

Para: Desarrolladores que quieren aprender
Contiene: Paso a paso, ejemplos, buenas prácticas

**Archivos:**
- `CONTRIBUIR.md` - Cómo aportar (workflow, branches, commits)
- `CONVENCIONES.md` - Estándares de código (nombres, formato)
- `CREAR-COMPONENTE.md` - Paso a paso para crear componente nuevo

---

### 🏛️ **ARCHITECTURE** (Entender el código)
Documentos en: `docs/architecture/`

Para: Quienes quieren entender cómo funciona todo
Contiene: Diagramas, flujos de datos, patrones

**Archivos:**
- `ARQUITECTURA.md` - Cómo está estructurado HOMELY

---

### 🔍 **REFERENCE** (Busca algo rápido)
Documentos en: `docs/reference/`

Para: Búsqueda rápida durante desarrollo
Contiene: Comandos, errores comunes, soluciones

**Archivos:**
- `QUICK_REFERENCE.md` - Comandos, shortcuts, errores
- `TROUBLESHOOTING.md` - Problemas y soluciones

---

### 👥 **TEAM** (Trabajo en equipo)
Documentos en: `docs/team/`

Para: Tech leads, managers, todo el equipo
Contiene: Procesos, criterios, estado del proyecto

**Archivos:**
- `CRITERIOS-REVIEW.md` - Qué revisar en un PR
- `ESTADO.md` - Estado actual del proyecto
- `ESTRUCTURA.md` - Cómo está organizado el equipo
- `ROADMAP.md` - Próximos pasos

---

## 🎓 VOCABULARIO IMPORTANTE

| Término | Significa | Ejemplo |
|---------|-----------|---------|
| **Component** | Bloque de código React reutilizable | `TaskList`, `Button`, `Card` |
| **Props** | Datos que pasas a un componente | `<Button label="Guardar" />` |
| **State** | Dato que cambia (se guarda en React) | `const [tareas, setTareas] = useState([])` |
| **Hook** | Función especial de React | `useState`, `useEffect`, `useMemo` |
| **Branch** | Tu propia rama de código (aislada) | `feature/buscar-tareas` |
| **Commit** | Guardar cambios con mensaje | `git commit -m "feat: nuevo"` |
| **PR / Pull Request** | Pedir que revisen tu código | Abriendo en GitHub |
| **Merge** | Unir tu código con main | Cuando se aprueba el PR |
| **ESLint** | Robot que verifica errores | `npm run lint` |
| **Prettier** | Robot que formatea código | `npm run format` |

---

## 🚨 AYUDA RÁPIDA

### "Mi código no funciona"
→ Ve a [TROUBLESHOOTING.md](../reference/TROUBLESHOOTING.md)

### "¿Cómo creo un componente nuevo?"
→ Lee [CREAR-COMPONENTE.md](../guides/CREAR-COMPONENTE.md)

### "¿Cuál es el estándar de código?"
→ Lee [CONVENCIONES.md](../guides/CONVENCIONES.md)

### "¿Cómo hago un commit?"
→ Lee [CONTRIBUIR.md](../guides/CONTRIBUIR.md)

### "¿Cómo funciona la arquitectura?"
→ Lee [ARQUITECTURA.md](../architecture/ARQUITECTURA.md)

### "¿Qué reviso en un PR?"
→ Lee [CRITERIOS-REVIEW.md](../team/CRITERIOS-REVIEW.md)

---

## ✅ PRÓXIMOS PASOS

**Ahora que entiendes la estructura:**

1. **Elige una ruta** (Desarrollador, Review, Tech Lead)
2. **Lee los documentos recomendados** (10-60 min)
3. **Abre tu editor**
4. **Crea una rama** (`git checkout -b feature/...`)
5. **¡Empieza a trabajar!**

---

## 📞 TABLA RÁPIDA DE REFERENCIA

| Necesito... | Dónde está | Tiempo |
|-------------|-----------|--------|
| Instalar proyecto | [01-que-es-homely.md](./01-que-es-homely.md) | 5 min |
| Comandos frecuentes | [02-comandos-diarios.md](./02-comandos-diarios.md) | 10 min |
| Crear componente | [CREAR-COMPONENTE.md](../guides/CREAR-COMPONENTE.md) | 15 min |
| Hacer un commit | [CONTRIBUIR.md](../guides/CONTRIBUIR.md) | 10 min |
| Entender arquitectura | [ARQUITECTURA.md](../architecture/ARQUITECTURA.md) | 20 min |
| Revisar código | [CRITERIOS-REVIEW.md](../team/CRITERIOS-REVIEW.md) | 15 min |
| Buscar solución | [TROUBLESHOOTING.md](../reference/TROUBLESHOOTING.md) | 5 min |
| Ver estado proyecto | [ESTADO.md](../team/ESTADO.md) | 5 min |

---

## 🎉 ¡YA ESTÁS LISTO!

Escoge tu ruta y comienza a leer. Todos los documentos son claros y con ejemplos.

**¿Preguntas?** Están todas contestadas en la documentación. 

**¿Algo no está claro?** Pregunta a tu equipo (todo está documentado, así que pueden ayudarte).

---

**¡Bienvenido a HOMELY! Let's build something great! 🚀**

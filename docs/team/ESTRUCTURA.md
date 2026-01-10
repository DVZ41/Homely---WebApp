# 👥 ESTRUCTURA DEL EQUIPO

Cómo está organizado el equipo HOMELY y las responsabilidades.

---

## 🎯 MISIÓN

Crear una herramienta familiar de gestión de tareas que sea:
- **Fácil de usar** para toda la familia
- **Colaborativa** para trabajar juntos
- **Motivadora** con logros y recompensas
- **Profesional** con código limpio

---

## 👨‍💼 ROLES

### 🧑‍💻 DESARROLLADOR

**Responsabilidades:**
- Escribir código limpio y funcional
- Seguir las convenciones del proyecto
- Crear features y arreglar bugs
- Hacer code review de PRs
- Mantener TypeScript strict

**Habilidades necesarias:**
- React y TypeScript
- Git y GitHub
- Tailwind CSS
- Resolver problemas

**Tareas típicas:**
- `npm run dev` (iniciar servidor)
- Crear componentes
- Hacer commits descriptivos
- Enviar PRs bien documentados

**Tiempo en proyecto:**
- Onboarding: 1.5 horas
- Crear feature: 2-4 horas
- Fix bug: 1-2 horas

---

### 🔍 REVISOR (Code Reviewer)

**Responsabilidades:**
- Revisar código antes de merging
- Verificar calidad
- Sugerir mejoras
- Validar convenciones
- Aprobar o rechazar PRs

**Habilidades necesarias:**
- Experiencia en React
- Conocimiento de patrones
- Comunicación clara
- Criterio técnico

**Qué revisar:**
- ✅ ESLint pasa
- ✅ TypeScript correcto
- ✅ Feature funciona
- ✅ Código limpio
- ✅ Convenciones seguidas

**Tiempo por PR:**
- Revisión: 5-15 minutos
- 3-5 comentarios en promedio

---

### 👔 TECH LEAD (Líder Técnico)

**Responsabilidades:**
- Decisiones arquitectónicas
- Planificación de features
- Mentoring del equipo
- Resolver problemas complejos
- Mantener documentación
- Comunicar con stakeholders

**Habilidades necesarias:**
- Experiencia en React avanzada
- Arquitectura de software
- Leadership
- Comunicación
- Visión del proyecto

**Tareas típicas:**
- Diseñar nuevas features
- Revisar PRs complejas
- Mentorear a desarrolladores
- Planificar sprints
- Actualizar documentación

**Reuniones típicas:**
- Daily standup (15 min)
- Code review meeting (30 min)
- Planning (1 hora)

---

## 📊 ESTRUCTURA ACTUAL

```
Equipo HOMELY
│
├── 🧑‍💻 Desarrollador(es)
│   ├── Escribir código
│   ├── Hacer PRs
│   └── Reviews básicas
│
├── 🔍 Revisor
│   ├── Code review
│   ├── Validar calidad
│   └── Aprobar PRs
│
└── 👔 Tech Lead
    ├── Arquitectura
    ├── Decisiones
    ├── Mentoring
    └── Documentación
```

---

## 🎯 RESPONSABILIDADES DIARIAS

### Desarrollador

```
MAÑANA (15 min)
□ npm run dev (iniciar servidor)
□ Ver issues asignados
□ Planificar tareas del día

MEDIO DÍA (2-4 horas)
□ Escribir código
□ Pruebas manuales
□ Tests (si aplica)

TARDE (30 min)
□ Commit de cambios
□ Enviar PR
□ Code review a otros

FIN DE DÍA
□ npm run build (validar)
□ git status (ver cambios)
□ Resolver problemas
```

### Revisor

```
CADA PR
□ npm run build (valida compilación)
□ npm run lint (valida código)
□ Ver cambios en GitHub
□ 3-5 comentarios constructivos
□ Aprobar o rechazar
□ Dar feedback

POR SEMANA
□ Revisar ~5-10 PRs
□ Mentorear desarrolladores
□ Actualizar checklist
```

### Tech Lead

```
DIARIO
□ Daily standup (15 min)
□ Resolver problemas bloqueantes
□ Revisar PRs críticas

SEMANAL
□ Planning meeting (1 hora)
□ Code review deep dive (30 min)
□ Arquitectura decisions
□ Documentación updates

MENSUAL
□ Retrospectiva
□ Planificación del siguiente mes
□ Evaluación del equipo
```

---

## 📝 COMUNICACIÓN

### Canales

| Canal | Propósito | Frecuencia |
|-------|-----------|-----------|
| **Daily Standup** | Sincronización | Cada mañana (15 min) |
| **GitHub Issues** | Tareas y bugs | Según sea necesario |
| **GitHub PRs** | Code review | Continuo |
| **Slack/Discord** | Chat general | Continuo |
| **Weekly Sync** | Reunión importante | 1x por semana (30 min) |

---

### Formato Daily

```
Hola equipo, reporto el estado:

🎯 Hoy trabajé en:
- Crear componente X
- Arreglar bug de localStorage

✅ Completado:
- PR #23 mergeada
- Feature Y documentada

🚧 Bloqueantes:
- Necesito claridad en requisito Z

📅 Hoy continuaré:
- Implementar feature A
- Hacer PR de componente B
```

---

### Criterios de Comunicación

**Escríbelo si:**
- Es importante para el equipo
- Otros dependen de tu información
- Hay un bloqueante
- Necesitas ayuda

**No lo escribas si:**
- Ya está documentado
- Es muy técnico y solo te afecta
- Se puede resolver con una búsqueda

---

## 🎓 ONBOARDING

### Día 1 (2 horas)

```
□ Clonar repositorio
□ npm install
□ npm run dev (verificar que funciona)
□ Leer docs/INDEX.md
□ Ver estructura del proyecto
□ Hacer 1 cambio pequeño
□ Crear primer PR
□ Recibir feedback
```

### Semana 1 (5-10 horas)

```
□ Entender arquitectura (2 horas)
□ Crear 2-3 PRs pequeñas (4 horas)
□ Recibir code reviews (2 horas)
□ Revisar PR de otro (1 hora)
```

### Mes 1 (20-40 horas)

```
□ Implementar feature mediana (8-16 horas)
□ Hacer ~5 PRs (8 horas)
□ Revisar ~5 PRs (8 horas)
□ Ayuda y mentoring según sea necesario
```

---

## 🏆 EXPERTOS POR ÁREA

Alguien que sabe más sobre cada tema:

| Área | Experto | Puedo preguntar sobre |
|------|---------|----------------------|
| **Components** | Developer A | Cómo estructurar un componente |
| **State Management** | Developer B | Cómo manejar datos globales |
| **Performance** | Tech Lead | Optimización de renders |
| **Styling** | Developer A | Tailwind CSS patterns |
| **Git/GitHub** | Tech Lead | Merge conflicts, workflows |
| **Testing** | (TBD) | Cómo escribir tests |
| **Documentación** | Tech Lead | Actualizar docs |

---

## 📈 CRECIMIENTO EN EL EQUIPO

### De Desarrollador a Senior Developer

```
Nivel 1 (0-3 meses)
├── Crear PRs simples
├── Seguir convenciones
└── Aprender del equipo

Nivel 2 (3-6 meses)
├── Features independientes
├── Code reviews de otros
├── Mentoría básica

Nivel 3 (6-12 meses)
├── Features complejas
├── Decisiones arquitectónicas
├── Mentoring activo

Senior (12+ meses)
├── Líder técnico potencial
├── Mentor de nuevos
└── Innovación
```

---

## ⚙️ PROCESOS

### Crear una Feature

```
1. Issue en GitHub
   └─ Describe qué y por qué

2. Assign a developer
   └─ Alguien se asigna

3. Crear rama
   └─ git checkout -b feature/nombre

4. Implementar
   └─ Escribir código, tests

5. PR
   └─ Crear pull request con descripción

6. Code Review
   └─ Tech Lead + otros revisan

7. Cambios si necesario
   └─ Implementar feedback

8. Aprobar y Merge
   └─ Tech Lead aprueba

9. Deploy
   └─ Publicar en producción
```

---

### Bug Fix

```
1. Reportar bug (issue)
   └─ Descripción, pasos para reproducir

2. Investigar (15-30 min)
   └─ Entender la causa

3. Implementar fix (30-60 min)
   └─ Arreglar el problema

4. PR pequeña
   └─ Solo el fix, sin cambios extra

5. Review rápido (5 min)
   └─ Validar que arregla el problema

6. Merge
   └─ Ir a producción
```

---

## 🎯 VALORES DEL EQUIPO

```
🤝 COLABORACIÓN
   └─ Ayudarse mutuamente
   └─ Compartir conocimiento
   └─ Comunicación clara

📚 APRENDIZAJE
   └─ Curiosidad constante
   └─ Experimentar
   └─ Mejorar cada día

⭐ CALIDAD
   └─ Código limpio
   └─ Testing
   └─ Documentación

🚀 VELOCIDAD
   └─ Iterar rápido
   └─ Entregas frecuentes
   └─ Eliminar bloqueos

😊 RESPETO
   └─ Feedback constructivo
   └─ Escuchar ideas
   └─ Celebrar logros
```

---

## 📞 PREGUNTAS FRECUENTES

**P: ¿Quién decide si una feature entra?**
A: Tech Lead junto con el equipo

**P: ¿Cuántas reviews necesita un PR?**
A: Mínimo 1 (preferiblemente 2)

**P: ¿Qué pasa si no estoy seguro?**
A: Pregunta, no hay preguntas tontas

**P: ¿Cuándo mergeamos?**
A: Cuando la feature está lista y aprobada

**P: ¿Quién refactoriza código viejo?**
A: El Tech Lead prioriza esto

---

## 🎉 CELEBRACIONES

```
🎊 PR mergeada        → "¡Felicitaciones! 🎉"
🎯 Feature completada → Celebrar en daily
🚀 Deploy a prod      → Felicitar al equipo
📈 Milestone logrado  → Reconocer el esfuerzo
```

---

**¡Juntos hacemos HOMELY increíble!** 💪

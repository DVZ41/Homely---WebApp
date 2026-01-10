# ⚡ REFERENCIA RÁPIDA

Todo lo que necesitas en 2 minutos.

---

## 🎯 COMANDOS ESENCIALES

```bash
npm run dev          # Iniciar servidor
npm run build        # Compilar código
npm run lint         # Verificar errores
npm run format       # Formatea código
```

---

## 🌿 GIT ESENCIALES

```bash
git checkout -b feature/mi-trabajo    # Nueva rama
git add .                             # Preparar cambios
git commit -m "feat: descripción"     # Guardar
git push origin feature/mi-trabajo    # Subir
git pull origin main                  # Descargar
```

---

## 📋 FLUJO DEL DÍA

```
1. git checkout main && git pull origin main
2. git checkout -b feature/mi-trabajo
3. npm run dev
4. [Editar código]
5. npm run lint && npm run format
6. git add . && git commit -m "feat: ..."
7. git push origin feature/mi-trabajo
8. Abre PR en GitHub
```

---

## 🚨 SI ALGO FALLA

| Error | Solución |
|-------|----------|
| `Port already in use` | npm run dev -- --port 3000 |
| `npm not found` | Instala Node.js |
| `git not found` | Instala Git |
| `ESLint errors` | npm run lint --fix |
| `Build fails` | npm run build (ver error) |

---

## 📁 ESTRUCTURA

```
docs/
├── getting-started/    ← COMIENZA AQUÍ
│   ├── 00-INICIO.md    ← Léeme primero
│   ├── 01-que-es-homely.md
│   └── 02-comandos-diarios.md
├── guides/
│   └── CONTRIBUIR.md
├── architecture/
│   └── ARQUITECTURA.md
└── reference/
    └── QUICK_REFERENCE.md
```

---

## 🎓 RUTAS DE APRENDIZAJE

**Desarrollador** → INICIO → Comandos → Arquitectura → Contribuir

**Revisor** → Arquitectura → Contribuir → Criterios Review

**Tech Lead** → Estado → Estructura → Roadmap

---

**¿Necesitas más detalles?** → Lee [00-INICIO.md](../getting-started/00-INICIO.md)

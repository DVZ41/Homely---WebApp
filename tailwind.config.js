/**
 * ═══════════════════════════════════════════════════════════════════════
 * HOMELY - TAILWIND CONFIGURATION
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Este archivo configura Tailwind CSS para el proyecto Homely.
 * Los colores y estilos reales están definidos en styles/globals.css
 * 
 * Colores Principales del Proyecto:
 * - Primary (Verde):  #28AC71 - Acciones principales, botones
 * - Accent (Coral):   #E76F51 - Elementos destacados, alertas
 * - Secondary (Gris): #605669 - Texto secundario, elementos sutiles
 */

/** @type {import('tailwindcss').Config} */
export default {
  // ═══════════════════════════════════════════════════════════════════════
  // MODO OSCURO
  // ═══════════════════════════════════════════════════════════════════════
  // Usa la clase .dark en el elemento HTML para activar modo oscuro
  darkMode: ["class"],

  // ═══════════════════════════════════════════════════════════════════════
  // ARCHIVOS A ESCANEAR
  // ═══════════════════════════════════════════════════════════════════════
  // Tailwind buscará clases CSS en estos archivos
  content: [
    "./index.html",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      // ═══════════════════════════════════════════════════════════════════
      // SISTEMA DE COLORES
      // ═══════════════════════════════════════════════════════════════════
      // Los valores reales están en globals.css como CSS variables
      // Esto permite cambio dinámico de tema (light/dark)
      colors: {
        // ─────────────────────────────────────────────────────────────────
        // COLORES BASE
        // ─────────────────────────────────────────────────────────────────
        background: "hsl(var(--color-background) / <alpha-value>)",        // Fondo principal de la app
        foreground: "hsl(var(--color-foreground) / <alpha-value>)",        // Texto principal
        
        // ─────────────────────────────────────────────────────────────────
        // TARJETAS Y POPOVERS
        // ─────────────────────────────────────────────────────────────────
        card: {
          DEFAULT: "hsl(var(--color-card) / <alpha-value>)",               // Fondo de tarjetas
          foreground: "hsl(var(--color-card-foreground) / <alpha-value>)", // Texto en tarjetas
        },
        popover: {
          DEFAULT: "hsl(var(--color-popover) / <alpha-value>)",            // Fondo de menús emergentes
          foreground: "hsl(var(--color-popover-foreground) / <alpha-value>)", // Texto en popovers
        },

        // ─────────────────────────────────────────────────────────────────
        // COLORES PRINCIPALES
        // ─────────────────────────────────────────────────────────────────
        primary: {
          DEFAULT: "hsl(var(--color-primary) / <alpha-value>)",            // Verde #28AC71 - Botones, enlaces
          light: "hsl(var(--color-primary-light) / <alpha-value>)",        // Verde #3DD98C - Estados activos
          hover: "hsl(var(--color-primary-hover) / <alpha-value>)",        // Verde #229960 - Hover
          dark: "hsl(var(--color-primary-dark) / <alpha-value>)",          // Verde #1A7A4A - Énfasis
          foreground: "hsl(var(--color-primary-foreground) / <alpha-value>)", // Texto sobre primary
        },
        accent: {
          DEFAULT: "hsl(var(--color-accent) / <alpha-value>)",             // Coral #E76F51 - Destacados
          light: "hsl(var(--color-accent-light) / <alpha-value>)",         // Coral #FF8B6F - Estados activos
          hover: "hsl(var(--color-accent-hover) / <alpha-value>)",         // Coral #D95840 - Hover
          dark: "hsl(var(--color-accent-dark) / <alpha-value>)",           // Coral #C24332 - Énfasis
          foreground: "hsl(var(--color-accent-foreground) / <alpha-value>)", // Texto sobre accent
        },
        secondary: {
          DEFAULT: "hsl(var(--color-secondary) / <alpha-value>)",          // Gris #605669 - Elementos secundarios
          foreground: "hsl(var(--color-secondary-foreground) / <alpha-value>)", // Texto sobre secondary
        },

        // ─────────────────────────────────────────────────────────────────
        // ESTADOS Y UTILIDADES
        // ─────────────────────────────────────────────────────────────────
        muted: {
          DEFAULT: "hsl(var(--color-muted) / <alpha-value>)",              // Fondos apagados
          foreground: "hsl(var(--color-muted-foreground) / <alpha-value>)", // Texto deshabilitado/secundario
        },
        destructive: {
          DEFAULT: "hsl(var(--color-destructive) / <alpha-value>)",        // Errores, eliminar
          foreground: "hsl(var(--color-destructive-foreground) / <alpha-value>)", // Texto sobre destructive
        },

        // ─────────────────────────────────────────────────────────────────
        // BORDES Y FORMULARIOS
        // ─────────────────────────────────────────────────────────────────
        border: "hsl(var(--color-border) / <alpha-value>)",                // Bordes de elementos
        input: "hsl(var(--color-input) / <alpha-value>)",                  // Fondo de inputs
        ring: "hsl(var(--color-ring) / <alpha-value>)",                    // Anillo de focus

        // ─────────────────────────────────────────────────────────────────
        // GRÁFICOS (Recharts)
        // ─────────────────────────────────────────────────────────────────
        chart: {
          1: "hsl(var(--color-chart-1) / <alpha-value>)",                  // Verde primary
          2: "hsl(var(--color-chart-2) / <alpha-value>)",                  // Verde oscuro
          3: "hsl(var(--color-chart-3) / <alpha-value>)",                  // Coral accent
          4: "hsl(var(--color-chart-4) / <alpha-value>)",                  // Gris secondary
          5: "hsl(var(--color-chart-5) / <alpha-value>)",                  // Texto foreground
        },

        // ─────────────────────────────────────────────────────────────────
        // SIDEBAR (Menú lateral)
        // ─────────────────────────────────────────────────────────────────
        sidebar: {
          DEFAULT: "hsl(var(--color-sidebar) / <alpha-value>)",            // Fondo del sidebar
          foreground: "hsl(var(--color-sidebar-foreground) / <alpha-value>)", // Texto del sidebar
          primary: "hsl(var(--color-sidebar-primary) / <alpha-value>)",    // Items activos
          "primary-foreground": "hsl(var(--color-sidebar-primary-foreground) / <alpha-value>)",
          accent: "hsl(var(--color-sidebar-accent) / <alpha-value>)",      // Hover items
          "accent-foreground": "hsl(var(--color-sidebar-accent-foreground) / <alpha-value>)",
          border: "hsl(var(--color-sidebar-border) / <alpha-value>)",      // Bordes internos
          ring: "hsl(var(--color-sidebar-ring) / <alpha-value>)",          // Focus
        },
      },

      // ═══════════════════════════════════════════════════════════════════
      // BORDER RADIUS (Redondeo de esquinas)
      // ═══════════════════════════════════════════════════════════════════
      borderRadius: {
        lg: "var(--radius-lg)",  // 12px - Tarjetas grandes
        md: "var(--radius-md)",  // 10px - Botones, inputs
        sm: "var(--radius-sm)",  //  8px - Badges, pequeños elementos
      },

      // ═══════════════════════════════════════════════════════════════════
      // TIPOGRAFÍA
      // ═══════════════════════════════════════════════════════════════════
      fontFamily: {
        sans: ['"Work Sans"', 'ui-sans-serif', 'system-ui'],  // Fuente principal (cuerpo)
        serif: ['"Lora"', 'ui-serif', 'Georgia'],             // Fuente para títulos
      },
    },
  },
  
  plugins: [],
}

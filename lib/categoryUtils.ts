/**
 * ═══════════════════════════════════════════════════════════════════════════
 * HOMELY - Utilidades de Categorías
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Este archivo centraliza toda la configuración de categorías de tareas:
 * - Colores
 * - Iconos (Lucide)
 * - Emojis
 * - Clases CSS
 * 
 * Uso: import { getCategoryConfig, CATEGORIES } from '@/lib/categoryUtils';
 */

import { 
  ChefHat, 
  Sparkles, 
  Droplets, 
  Shirt, 
  ShoppingCart, 
  Leaf, 
  PawPrint, 
  ClipboardList,
  LucideIcon
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════════════════

export type CategoryName = 
  | 'Cocina' 
  | 'Limpieza' 
  | 'Baño' 
  | 'Lavandería' 
  | 'Compras' 
  | 'Jardín' 
  | 'Mascotas' 
  | 'General';

export interface CategoryConfig {
  name: CategoryName;
  icon: LucideIcon;
  emoji: string;
  /** Clase para color de texto: text-category-kitchen */
  colorClass: string;
  /** Clase para fondo sólido: bg-category-kitchen */
  bgClass: string;
  /** Clase para fondo suave: bg-category-kitchen/10 */
  bgLightClass: string;
  /** Clase para borde: border-category-kitchen/30 */
  borderClass: string;
  /** Variable CSS: --category-kitchen */
  cssVar: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN DE CATEGORÍAS
// ═══════════════════════════════════════════════════════════════════════════

export const CATEGORIES: Record<CategoryName, CategoryConfig> = {
  'Cocina': {
    name: 'Cocina',
    icon: ChefHat,
    emoji: '🍳',
    colorClass: 'text-category-kitchen',
    bgClass: 'bg-category-kitchen',
    bgLightClass: 'bg-category-kitchen/10',
    borderClass: 'border-category-kitchen/30',
    cssVar: '--category-kitchen',
  },
  'Limpieza': {
    name: 'Limpieza',
    icon: Sparkles,
    emoji: '🧹',
    colorClass: 'text-category-cleaning',
    bgClass: 'bg-category-cleaning',
    bgLightClass: 'bg-category-cleaning/10',
    borderClass: 'border-category-cleaning/30',
    cssVar: '--category-cleaning',
  },
  'Baño': {
    name: 'Baño',
    icon: Droplets,
    emoji: '🚿',
    colorClass: 'text-category-bathroom',
    bgClass: 'bg-category-bathroom',
    bgLightClass: 'bg-category-bathroom/10',
    borderClass: 'border-category-bathroom/30',
    cssVar: '--category-bathroom',
  },
  'Lavandería': {
    name: 'Lavandería',
    icon: Shirt,
    emoji: '👕',
    colorClass: 'text-category-laundry',
    bgClass: 'bg-category-laundry',
    bgLightClass: 'bg-category-laundry/10',
    borderClass: 'border-category-laundry/30',
    cssVar: '--category-laundry',
  },
  'Compras': {
    name: 'Compras',
    icon: ShoppingCart,
    emoji: '🛒',
    colorClass: 'text-category-shopping',
    bgClass: 'bg-category-shopping',
    bgLightClass: 'bg-category-shopping/10',
    borderClass: 'border-category-shopping/30',
    cssVar: '--category-shopping',
  },
  'Jardín': {
    name: 'Jardín',
    icon: Leaf,
    emoji: '🌱',
    colorClass: 'text-category-garden',
    bgClass: 'bg-category-garden',
    bgLightClass: 'bg-category-garden/10',
    borderClass: 'border-category-garden/30',
    cssVar: '--category-garden',
  },
  'Mascotas': {
    name: 'Mascotas',
    icon: PawPrint,
    emoji: '🐾',
    colorClass: 'text-category-pets',
    bgClass: 'bg-category-pets',
    bgLightClass: 'bg-category-pets/10',
    borderClass: 'border-category-pets/30',
    cssVar: '--category-pets',
  },
  'General': {
    name: 'General',
    icon: ClipboardList,
    emoji: '📋',
    colorClass: 'text-category-general',
    bgClass: 'bg-category-general',
    bgLightClass: 'bg-category-general/10',
    borderClass: 'border-category-general/30',
    cssVar: '--category-general',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIONES HELPER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Obtiene la configuración completa de una categoría por nombre
 * @param categoryName - Nombre de la categoría (ej: 'Cocina')
 * @returns Configuración de la categoría o 'General' si no existe
 */
export function getCategoryConfig(categoryName: string): CategoryConfig {
  return CATEGORIES[categoryName as CategoryName] || CATEGORIES['General'];
}

/**
 * Obtiene el icono Lucide para una categoría
 * @param categoryName - Nombre de la categoría
 * @returns Componente de icono Lucide
 */
export function getCategoryIcon(categoryName: string): LucideIcon {
  return getCategoryConfig(categoryName).icon;
}

/**
 * Obtiene el emoji para una categoría
 * @param categoryName - Nombre de la categoría
 * @returns Emoji de la categoría
 */
export function getCategoryEmoji(categoryName: string): string {
  return getCategoryConfig(categoryName).emoji;
}

/**
 * Obtiene todas las clases CSS para una categoría
 * @param categoryName - Nombre de la categoría
 * @returns Objeto con todas las clases CSS
 */
export function getCategoryClasses(categoryName: string) {
  const config = getCategoryConfig(categoryName);
  return {
    text: config.colorClass,
    bg: config.bgClass,
    bgLight: config.bgLightClass,
    border: config.borderClass,
    /** Combinación útil para badges: fondo suave + texto + borde */
    badge: `${config.bgLightClass} ${config.colorClass} ${config.borderClass} border`,
    /** Combinación para iconos: fondo suave + texto */
    iconContainer: `${config.bgLightClass} ${config.colorClass}`,
  };
}

/**
 * Obtiene la lista de todas las categorías disponibles
 * @returns Array con los nombres de todas las categorías
 */
export function getAllCategoryNames(): CategoryName[] {
  return Object.keys(CATEGORIES) as CategoryName[];
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILIDADES DE RAREZAS (para logros/badges)
// ═══════════════════════════════════════════════════════════════════════════

export type RarityLevel = 'common' | 'rare' | 'epic' | 'legendary';

export interface RarityConfig {
  name: string;
  nameEs: string;
  colorClass: string;
  bgClass: string;
  bgLightClass: string;
  borderClass: string;
  glowClass: string;
}

export const RARITIES: Record<RarityLevel, RarityConfig> = {
  'common': {
    name: 'Common',
    nameEs: 'Común',
    colorClass: 'text-rarity-common',
    bgClass: 'bg-rarity-common',
    bgLightClass: 'bg-rarity-common/20',
    borderClass: 'border-rarity-common/30',
    glowClass: '',
  },
  'rare': {
    name: 'Rare',
    nameEs: 'Raro',
    colorClass: 'text-rarity-rare',
    bgClass: 'bg-rarity-rare',
    bgLightClass: 'bg-rarity-rare/20',
    borderClass: 'border-rarity-rare/30',
    glowClass: 'shadow-sm shadow-rarity-rare/20',
  },
  'epic': {
    name: 'Epic',
    nameEs: 'Épico',
    colorClass: 'text-rarity-epic',
    bgClass: 'bg-rarity-epic',
    bgLightClass: 'bg-rarity-epic/20',
    borderClass: 'border-rarity-epic/30',
    glowClass: 'shadow-md shadow-rarity-epic/30',
  },
  'legendary': {
    name: 'Legendary',
    nameEs: 'Legendario',
    colorClass: 'text-rarity-legendary',
    bgClass: 'bg-rarity-legendary',
    bgLightClass: 'bg-rarity-legendary/20',
    borderClass: 'border-rarity-legendary/30',
    glowClass: 'shadow-lg shadow-rarity-legendary/40 animate-pulse',
  },
};

/**
 * Obtiene la configuración de una rareza
 * @param rarity - Nivel de rareza
 * @returns Configuración de la rareza
 */
export function getRarityConfig(rarity: string): RarityConfig {
  return RARITIES[rarity as RarityLevel] || RARITIES['common'];
}

/**
 * Obtiene las clases CSS para un badge de rareza
 * @param rarity - Nivel de rareza
 * @returns Clases CSS combinadas para el badge
 */
export function getRarityBadgeClasses(rarity: string): string {
  const config = getRarityConfig(rarity);
  return `${config.bgLightClass} ${config.colorClass} ${config.borderClass} border ${config.glowClass}`.trim();
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILIDADES DE PODIO (para rankings)
// ═══════════════════════════════════════════════════════════════════════════

export interface PodiumConfig {
  medal: string;
  colorClass: string;
  bgGradient: string;
  borderClass: string;
}

export const PODIUM_POSITIONS: Record<number, PodiumConfig> = {
  0: { // 1º lugar
    medal: '🥇',
    colorClass: 'text-podium-gold',
    bgGradient: 'bg-gradient-to-r from-podium-gold/20 to-podium-gold-light/10',
    borderClass: 'border-podium-gold/30',
  },
  1: { // 2º lugar
    medal: '🥈',
    colorClass: 'text-podium-silver',
    bgGradient: 'bg-gradient-to-r from-podium-silver/20 to-podium-silver-light/10',
    borderClass: 'border-podium-silver/30',
  },
  2: { // 3º lugar
    medal: '🥉',
    colorClass: 'text-podium-bronze',
    bgGradient: 'bg-gradient-to-r from-podium-bronze/20 to-podium-bronze-light/10',
    borderClass: 'border-podium-bronze/30',
  },
};

/**
 * Obtiene la configuración de podio para una posición (0-indexed)
 * @param position - Posición en el ranking (0 = 1º lugar)
 * @returns Configuración de podio o null si no está en el podio
 */
export function getPodiumConfig(position: number): PodiumConfig | null {
  return PODIUM_POSITIONS[position] || null;
}

/**
 * Obtiene las clases CSS para un item del podio
 * @param position - Posición en el ranking (0-indexed)
 * @returns Clases CSS o clases por defecto si no está en el podio
 */
export function getPodiumClasses(position: number): string {
  const config = getPodiumConfig(position);
  if (config) {
    return `${config.bgGradient} ${config.borderClass} border`;
  }
  return 'bg-muted/50 border-border/50 border';
}

/**
 * Obtiene la medalla para una posición
 * @param position - Posición en el ranking (0-indexed)
 * @returns Emoji de medalla o número de posición
 */
export function getPodiumMedal(position: number): string {
  const config = getPodiumConfig(position);
  return config ? config.medal : `${position + 1}º`;
}

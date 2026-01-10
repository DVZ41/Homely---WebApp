import { Badge, Member, Task } from '../App';
import { Trophy, Zap, Lock, Award, Star } from 'lucide-react';
import { getRarityConfig } from '../lib/categoryUtils';
import { useState, useRef } from 'react';

type AchievementsProps = {
  members: Member[];
  tasks: Task[];
  currentUser: Member;
};

// Lista de todos los badges disponibles
const ALL_BADGES: Badge[] = [
  // Badges por niveles (cada 10 niveles)
  { id: 'level_10', name: 'Aprendiz del Hogar', description: 'Alcanza el nivel 10', icon: '🌱', condition: 'Nivel 10', rarity: 'common' },
  { id: 'level_20', name: 'Colaborador Dedicado', description: 'Alcanza el nivel 20', icon: '🏠', condition: 'Nivel 20', rarity: 'rare' },
  { id: 'level_30', name: 'Experto Doméstico', description: 'Alcanza el nivel 30', icon: '⭐', condition: 'Nivel 30', rarity: 'rare' },
  { id: 'level_40', name: 'Maestro de Casa', description: 'Alcanza el nivel 40', icon: '🏆', condition: 'Nivel 40', rarity: 'epic' },
  { id: 'level_50', name: 'Leyenda del Hogar', description: 'Alcanza el nivel 50', icon: '👑', condition: 'Nivel 50', rarity: 'epic' },
  { id: 'level_60', name: 'Diamante Familiar', description: 'Alcanza el nivel 60', icon: '💎', condition: 'Nivel 60', rarity: 'legendary' },
  { id: 'level_70', name: 'Titán Doméstico', description: 'Alcanza el nivel 70', icon: '🔥', condition: 'Nivel 70', rarity: 'legendary' },
  { id: 'level_80', name: 'Héroe Incansable', description: 'Alcanza el nivel 80', icon: '⚡', condition: 'Nivel 80', rarity: 'legendary' },
  { id: 'level_90', name: 'Superestrella Familiar', description: 'Alcanza el nivel 90', icon: '🌟', condition: 'Nivel 90', rarity: 'legendary' },
  { id: 'level_100', name: 'Perfección Absoluta', description: 'Alcanza el nivel 100', icon: '🎯', condition: 'Nivel 100', rarity: 'legendary' },
  
  // Logros por cantidad de tareas
  { id: 'first_task', name: 'Primer Paso', description: 'Completa tu primera tarea', icon: '✅', condition: 'Completar 1 tarea', rarity: 'common' },
  { id: 'tasks_10', name: 'Buen Comienzo', description: 'Completa 10 tareas', icon: '🎯', condition: '10 tareas completadas', rarity: 'common' },
  { id: 'tasks_50', name: 'Trabajador Constante', description: 'Completa 50 tareas', icon: '🔵', condition: '50 tareas completadas', rarity: 'rare' },
  { id: 'tasks_200', name: 'Máquina Imparable', description: 'Completa 200 tareas', icon: '💜', condition: '200 tareas completadas', rarity: 'epic' },
  { id: 'tasks_500', name: 'Centurión Doméstico', description: 'Completa 500 tareas', icon: '🟡', condition: '500 tareas completadas', rarity: 'legendary' },
  
  // Logros por categorías
  { id: 'kitchen_master', name: 'Chef en Casa', description: 'Completa 20 tareas de cocina', icon: '👨‍🍳', condition: '20 tareas de cocina', rarity: 'rare' },
  { id: 'cleaning_pro', name: 'Maestro de la Limpieza', description: 'Completa 30 tareas de limpieza', icon: '🧹', condition: '30 tareas de limpieza', rarity: 'rare' },
  
  // Logros por puntos
  { id: 'points_100', name: 'Centenario', description: 'Acumula 100 puntos totales', icon: '💯', condition: '100 puntos acumulados', rarity: 'common' },
  { id: 'points_500', name: 'Millonario en Puntos', description: 'Acumula 500 puntos totales', icon: '💎', condition: '500 puntos acumulados', rarity: 'rare' },
  { id: 'points_1000', name: 'Rey de los Puntos', description: 'Acumula 1000 puntos totales', icon: '👑', condition: '1000 puntos acumulados', rarity: 'epic' },
  
  // Logros por racha
  { id: 'streak_3', name: 'Racha de 3', description: '3 días consecutivos completando tareas', icon: '🔥', condition: 'Racha de 3 días', rarity: 'common' },
  { id: 'streak_7', name: 'Semana Perfecta', description: '7 días consecutivos completando tareas', icon: '🔥', condition: 'Racha de 7 días', rarity: 'rare' },
  { id: 'streak_30', name: 'Mes Imparable', description: '30 días consecutivos completando tareas', icon: '🔥', condition: 'Racha de 30 días', rarity: 'epic' },
  
  // Logros por velocidad
  { id: 'speed_demon', name: 'Rápido y Furioso', description: 'Completa 5 tareas en un día', icon: '⚡', condition: '5 tareas en un día', rarity: 'rare' },
  { id: 'speed_pro', name: 'Día Productivo', description: 'Completa 10 tareas en un día', icon: '⚡⚡', condition: '10 tareas en un día', rarity: 'epic' },
  
  // Logros por urgencia
  { id: 'urgent_hunter', name: 'Cazador de Urgentes', description: 'Completa 10 tareas urgentes', icon: '🎯', condition: '10 tareas urgentes', rarity: 'rare' },
  { id: 'perfectionist', name: 'Maestro del Tiempo', description: 'Completa 25 tareas urgentes a tiempo', icon: '🎖️', condition: '25 tareas urgentes a tiempo', rarity: 'epic' },
  
  // Logros especiales
  { id: 'early_bird', name: 'Madrugador', description: 'Completa 10 tareas antes de las 7am', icon: '🌅', condition: '10 tareas antes de las 7am', rarity: 'rare' },
  { id: 'night_owl', name: 'Búho Nocturno', description: 'Completa 10 tareas después de las 11pm', icon: '🌙', condition: '10 tareas después de las 11pm', rarity: 'rare' },
  { id: 'all_rounder', name: 'Todoterreno', description: 'Completa tareas de todas las categorías', icon: '🎭', condition: 'Todas las categorías', rarity: 'epic' },
];

export function Achievements({ members, tasks, currentUser }: AchievementsProps) {
  // Calcular progreso de badges para el usuario actual
  const calculateBadgeProgress = (badge: Badge): { unlocked: boolean; progress: number; total: number } => {
    const userTasks = tasks.filter(t => t.assignedTo === currentUser.id && t.status === 'completed');
    const currentLevel = Math.floor((currentUser.experience || 0) / 100) + 1;

    // Badges por nivel
    if (badge.id.startsWith('level_')) {
      const requiredLevel = parseInt(badge.id.split('_')[1]);
      return {
        unlocked: currentLevel >= requiredLevel,
        progress: currentLevel,
        total: requiredLevel
      };
    }

    // Badges por cantidad de tareas
    if (badge.id === 'first_task') {
      return { unlocked: userTasks.length >= 1, progress: Math.min(userTasks.length, 1), total: 1 };
    }
    if (badge.id === 'tasks_10') {
      return { unlocked: userTasks.length >= 10, progress: userTasks.length, total: 10 };
    }
    if (badge.id === 'tasks_50') {
      return { unlocked: userTasks.length >= 50, progress: userTasks.length, total: 50 };
    }
    if (badge.id === 'tasks_200') {
      return { unlocked: userTasks.length >= 200, progress: userTasks.length, total: 200 };
    }
    if (badge.id === 'tasks_500') {
      return { unlocked: userTasks.length >= 500, progress: userTasks.length, total: 500 };
    }

    // Badges por puntos
    if (badge.id === 'points_100') {
      return { unlocked: currentUser.points >= 100, progress: currentUser.points, total: 100 };
    }
    if (badge.id === 'points_500') {
      return { unlocked: currentUser.points >= 500, progress: currentUser.points, total: 500 };
    }
    if (badge.id === 'points_1000') {
      return { unlocked: currentUser.points >= 1000, progress: currentUser.points, total: 1000 };
    }

    // Badges por racha
    if (badge.id === 'streak_3') {
      const uniqueDates = [...new Set(userTasks.map(t => t.completedAt?.split('T')[0] || ''))].length;
      return { unlocked: uniqueDates >= 3, progress: uniqueDates, total: 3 };
    }
    if (badge.id === 'streak_7') {
      const uniqueDates = [...new Set(userTasks.map(t => t.completedAt?.split('T')[0] || ''))].length;
      return { unlocked: uniqueDates >= 7, progress: uniqueDates, total: 7 };
    }
    if (badge.id === 'streak_30') {
      const uniqueDates = [...new Set(userTasks.map(t => t.completedAt?.split('T')[0] || ''))].length;
      return { unlocked: uniqueDates >= 30, progress: uniqueDates, total: 30 };
    }

    // Badges por categoría
    if (badge.id === 'kitchen_master') {
      const kitchenTasks = userTasks.filter(t => t.category === 'Cocina').length;
      return { unlocked: kitchenTasks >= 20, progress: kitchenTasks, total: 20 };
    }
    if (badge.id === 'cleaning_pro') {
      const cleaningTasks = userTasks.filter(t => t.category === 'Limpieza').length;
      return { unlocked: cleaningTasks >= 30, progress: cleaningTasks, total: 30 };
    }

    // Badges por velocidad (simplificado)
    if (badge.id === 'speed_demon') {
      const tasksInDay = Math.min(userTasks.length, 5);
      return { unlocked: tasksInDay >= 5, progress: tasksInDay, total: 5 };
    }
    if (badge.id === 'speed_pro') {
      const tasksInDay = Math.min(userTasks.length, 10);
      return { unlocked: tasksInDay >= 10, progress: tasksInDay, total: 10 };
    }

    // Badges por urgencia
    if (badge.id === 'urgent_hunter') {
      const urgentTasks = userTasks.filter(t => t.urgency === 'high').length;
      return { unlocked: urgentTasks >= 10, progress: urgentTasks, total: 10 };
    }
    if (badge.id === 'perfectionist') {
      const urgentTasks = userTasks.filter(t => t.urgency === 'high').length;
      return { unlocked: urgentTasks >= 25, progress: urgentTasks, total: 25 };
    }

    // Badges especiales
    if (badge.id === 'early_bird') {
      // Por implementar: tareas completadas antes de las 7am
      return { unlocked: false, progress: 0, total: 10 };
    }
    if (badge.id === 'night_owl') {
      // Por implementar: tareas completadas después de las 11pm
      return { unlocked: false, progress: 0, total: 10 };
    }
    if (badge.id === 'all_rounder') {
      const categories = [...new Set(userTasks.map(t => t.category))];
      return { unlocked: categories.length >= 8, progress: categories.length, total: 8 };
    }

    // Default
    return { unlocked: false, progress: 0, total: 100 };
  };

  // Estados para filtros
  const [unlockedFilter, setUnlockedFilter] = useState<'all' | 'common' | 'rare' | 'epic' | 'legendary'>('all');
  const [lockedFilter, setLockedFilter] = useState<'all' | 'common' | 'rare' | 'epic' | 'legendary'>('all');
  
  // Refs para scroll
  const unlockedSectionRef = useRef<HTMLDivElement>(null);
  
  // Función para filtrar por rareza y hacer scroll
  const handleRarityClick = (rarity: 'common' | 'rare' | 'epic' | 'legendary') => {
    setUnlockedFilter(rarity);
    setLockedFilter(rarity);
    // Scroll suave a la sección de logros desbloqueados
    setTimeout(() => {
      unlockedSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const badgesWithProgress = ALL_BADGES.map(badge => ({
    ...badge,
    ...calculateBadgeProgress(badge),
  }));

  // Ordenamiento fijo: común → legendario
  const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 };
  const sortByRarity = (a: typeof badgesWithProgress[0], b: typeof badgesWithProgress[0]) => {
    return rarityOrder[a.rarity] - rarityOrder[b.rarity];
  };

  // Filtrar y ordenar logros desbloqueados
  let unlockedBadges = badgesWithProgress.filter(b => b.unlocked);
  if (unlockedFilter !== 'all') {
    unlockedBadges = unlockedBadges.filter(b => b.rarity === unlockedFilter);
  }
  unlockedBadges = unlockedBadges.sort(sortByRarity);

  // Filtrar y ordenar logros bloqueados
  let lockedBadges = badgesWithProgress.filter(b => !b.unlocked);
  if (lockedFilter !== 'all') {
    lockedBadges = lockedBadges.filter(b => b.rarity === lockedFilter);
  }
  lockedBadges = lockedBadges.sort(sortByRarity);

  // Contadores por rareza
  const rarityStats = {
    common: {
      total: ALL_BADGES.filter(b => b.rarity === 'common').length,
      unlocked: unlockedBadges.filter(b => b.rarity === 'common').length
    },
    rare: {
      total: ALL_BADGES.filter(b => b.rarity === 'rare').length,
      unlocked: unlockedBadges.filter(b => b.rarity === 'rare').length
    },
    epic: {
      total: ALL_BADGES.filter(b => b.rarity === 'epic').length,
      unlocked: unlockedBadges.filter(b => b.rarity === 'epic').length
    },
    legendary: {
      total: ALL_BADGES.filter(b => b.rarity === 'legendary').length,
      unlocked: unlockedBadges.filter(b => b.rarity === 'legendary').length
    }
  };

  const getRarityColor = (rarity: Badge['rarity']) => {
    // Usa getRarityConfig internamente para consistencia
    getRarityConfig(rarity);
    return `from-${rarity === 'common' ? 'muted' : `rarity-${rarity}`}/20 to-${rarity === 'common' ? 'muted' : `rarity-${rarity}`}/10`;
  };

  const getRarityBorder = (rarity: Badge['rarity']) => {
    if (rarity === 'common') return 'border-border';
    return `border-rarity-${rarity}/30`;
  };

  const getRarityText = (rarity: Badge['rarity']) => {
    const config = getRarityConfig(rarity);
    return config.nameEs;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Logros y Badges</h2>
          <p className="text-sm text-muted-foreground">Desbloquea logros completando desafíos y tareas especiales</p>
        </div>
      </div>

      {/* Mis Estadísticas */}
      <div className="bg-linear-to-br from-yellow-500/10 via-primary/5 to-yellow-500/10 rounded-2xl p-4 md:p-5 border border-yellow-500/20 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-500/20 shadow-sm">
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Progreso de Logros</h3>
        </div>
        
        {/* Progreso Global */}
        <div className="mb-4 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-base font-medium text-foreground">Progreso Global</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{unlockedBadges.length}/{ALL_BADGES.length}</p>
              <p className="text-xs text-muted-foreground">{Math.round((unlockedBadges.length / ALL_BADGES.length) * 100)}% completado</p>
            </div>
          </div>
          <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
              style={{ width: `${(unlockedBadges.length / ALL_BADGES.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Contadores por Rareza */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Común */}
          <button
            type="button"
            onClick={() => handleRarityClick('common')}
            className="flex flex-col items-center text-center p-2 rounded-lg hover:scale-105 hover:shadow-md transition-all duration-200 cursor-pointer"
            style={{ backgroundColor: 'rgba(156, 163, 175, 0.1)' }}
            title="Click para filtrar logros comunes"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg mb-1.5" style={{ backgroundColor: 'rgba(156, 163, 175, 0.2)' }}>
              <span className="text-sm">⚪</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{rarityStats.common.unlocked}/{rarityStats.common.total}</p>
            <p className="text-xs text-muted-foreground">Común</p>
          </button>

          {/* Raro */}
          <button
            type="button"
            onClick={() => handleRarityClick('rare')}
            className="flex flex-col items-center text-center p-2 rounded-lg hover:scale-105 hover:shadow-md transition-all duration-200 cursor-pointer"
            style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
            title="Click para filtrar logros raros"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg mb-1.5" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}>
              <span className="text-sm">🔵</span>
            </div>
            <p className="text-lg font-semibold" style={{ color: 'rgb(59, 130, 246)' }}>{rarityStats.rare.unlocked}/{rarityStats.rare.total}</p>
            <p className="text-xs text-muted-foreground">Raro</p>
          </button>

          {/* Épico */}
          <button
            type="button"
            onClick={() => handleRarityClick('epic')}
            className="flex flex-col items-center text-center p-2 rounded-lg hover:scale-105 hover:shadow-md transition-all duration-200 cursor-pointer"
            style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)' }}
            title="Click para filtrar logros épicos"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg mb-1.5" style={{ backgroundColor: 'rgba(168, 85, 247, 0.2)' }}>
              <span className="text-sm">🟣</span>
            </div>
            <p className="text-lg font-semibold" style={{ color: 'rgb(168, 85, 247)' }}>{rarityStats.epic.unlocked}/{rarityStats.epic.total}</p>
            <p className="text-xs text-muted-foreground">Épico</p>
          </button>

          {/* Legendario */}
          <button
            type="button"
            onClick={() => handleRarityClick('legendary')}
            className="flex flex-col items-center text-center p-2 rounded-lg hover:scale-105 hover:shadow-md transition-all duration-200 cursor-pointer"
            style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)' }}
            title="Click para filtrar logros legendarios"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg mb-1.5" style={{ backgroundColor: 'rgba(234, 179, 8, 0.2)' }}>
              <span className="text-sm">🟡</span>
            </div>
            <p className="text-lg font-semibold text-yellow-500">{rarityStats.legendary.unlocked}/{rarityStats.legendary.total}</p>
            <p className="text-xs text-muted-foreground">Legendario</p>
          </button>
        </div>
      </div>

      {/* Logros del Equipo */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          Logros del Equipo
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {members.map((member) => {
              const memberBadges = member.badges || [];
              const lastThreeBadges = memberBadges.slice(-3).reverse();
              const totalBadges = ALL_BADGES.length;
              const percentage = Math.round((memberBadges.length / totalBadges) * 100);
              
              // Calcular contadores por rareza para este miembro
              const memberBadgeObjects = memberBadges.map(badgeId => ALL_BADGES.find(b => b.id === badgeId)).filter(Boolean);
              const memberRarityStats = {
                common: {
                  total: ALL_BADGES.filter(b => b.rarity === 'common').length,
                  unlocked: memberBadgeObjects.filter(b => b && b.rarity === 'common').length
                },
                rare: {
                  total: ALL_BADGES.filter(b => b.rarity === 'rare').length,
                  unlocked: memberBadgeObjects.filter(b => b && b.rarity === 'rare').length
                },
                epic: {
                  total: ALL_BADGES.filter(b => b.rarity === 'epic').length,
                  unlocked: memberBadgeObjects.filter(b => b && b.rarity === 'epic').length
                },
                legendary: {
                  total: ALL_BADGES.filter(b => b.rarity === 'legendary').length,
                  unlocked: memberBadgeObjects.filter(b => b && b.rarity === 'legendary').length
                }
              };
              
              return (
                <div
                  key={member.id}
                  className={`rounded-xl p-4 border transition-all hover:shadow-lg ${
                    member.id === currentUser.id 
                      ? 'border-primary/50 shadow-sm ring-2 ring-primary/20' 
                      : 'border-border/50'
                  }`}
                  style={{ 
                    backgroundColor: `${member.color}08`,
                    borderColor: member.id === currentUser.id ? undefined : `${member.color}30`
                  }}
                >
                  {/* Avatar y nombre */}
                  <div className="flex flex-col items-center text-center mb-3">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl mb-2 shadow-md"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.avatar}
                    </div>
                    <h4 className="text-foreground font-semibold text-base mb-1">{member.name}</h4>
                    {member.id === currentUser.id && (
                      <span className="text-xs text-primary font-medium mb-1">Tú</span>
                    )}
                    {/* Puntos y nivel (secundarios) */}
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-xp" />
                        <span className="text-sm font-semibold text-xp">{member.points}</span>
                      </div>
                      <div className="w-px h-3 bg-border"></div>
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-accent" />
                        <span className="text-sm font-semibold text-accent">Nv. {member.level}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progreso global */}
                  <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-2.5 mb-3 border border-primary/20">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-muted-foreground font-medium">Progreso Global</span>
                      <span className="text-base font-bold text-primary">{memberBadges.length}/{totalBadges}</span>
                    </div>
                    <div className="w-full bg-muted/50 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Contadores por rareza */}
                  <div className="grid grid-cols-2 gap-1.5 mb-3">
                    <div className="flex items-center gap-1.5 p-1.5 rounded-md" style={{ backgroundColor: 'rgba(156, 163, 175, 0.08)' }}>
                      <span className="text-xs">⚪</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{memberRarityStats.common.unlocked}/{memberRarityStats.common.total}</p>
                        <p className="text-[10px] text-muted-foreground truncate">Común</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 p-1.5 rounded-md" style={{ backgroundColor: 'rgba(59, 130, 246, 0.08)' }}>
                      <span className="text-xs">🔵</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold" style={{ color: 'rgb(59, 130, 246)' }}>{memberRarityStats.rare.unlocked}/{memberRarityStats.rare.total}</p>
                        <p className="text-[10px] text-muted-foreground truncate">Raro</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 p-1.5 rounded-md" style={{ backgroundColor: 'rgba(168, 85, 247, 0.08)' }}>
                      <span className="text-xs">🟣</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold" style={{ color: 'rgb(168, 85, 247)' }}>{memberRarityStats.epic.unlocked}/{memberRarityStats.epic.total}</p>
                        <p className="text-[10px] text-muted-foreground truncate">Épico</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 p-1.5 rounded-md" style={{ backgroundColor: 'rgba(234, 179, 8, 0.08)' }}>
                      <span className="text-xs">🟡</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-yellow-500">{memberRarityStats.legendary.unlocked}/{memberRarityStats.legendary.total}</p>
                        <p className="text-[10px] text-muted-foreground truncate">Legendario</p>
                      </div>
                    </div>
                  </div>

                  {/* Últimos 3 logros */}
                  {lastThreeBadges.length > 0 && (
                    <div className="pt-2.5 border-t" style={{ borderColor: `${member.color}20` }}>
                      <p className="text-[10px] text-muted-foreground mb-1.5 text-center">Últimos logros</p>
                      <div className="flex justify-center gap-1.5">
                        {lastThreeBadges.map(badgeId => {
                          const badge = ALL_BADGES.find(b => b.id === badgeId);
                          return badge ? (
                            <span
                              key={badgeId}
                              className="text-lg"
                              title={badge.name}
                            >
                              {badge.icon}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Unlocked Badges */}
      {badgesWithProgress.filter(b => b.unlocked).length > 0 && (
        <div ref={unlockedSectionRef}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-foreground font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Logros Desbloqueados ({unlockedBadges.length})
            </h3>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setUnlockedFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  unlockedFilter === 'all' 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setUnlockedFilter('common')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  unlockedFilter === 'common' 
                    ? 'bg-gray-400 text-white shadow-sm' 
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
              >
                ⚪ Común
              </button>
              <button
                type="button"
                onClick={() => setUnlockedFilter('rare')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  unlockedFilter === 'rare' 
                    ? 'text-white shadow-sm' 
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
                style={unlockedFilter === 'rare' ? { backgroundColor: 'rgb(59, 130, 246)' } : {}}
              >
                🔵 Raro
              </button>
              <button
                type="button"
                onClick={() => setUnlockedFilter('epic')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  unlockedFilter === 'epic' 
                    ? 'text-white shadow-sm' 
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
                style={unlockedFilter === 'epic' ? { backgroundColor: 'rgb(168, 85, 247)' } : {}}
              >
                🟣 Épico
              </button>
              <button
                type="button"
                onClick={() => setUnlockedFilter('legendary')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  unlockedFilter === 'legendary' 
                    ? 'bg-yellow-500 text-white shadow-sm' 
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
              >
                🟡 Legendario
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedBadges.map((badge) => (
              <div
                key={badge.id}
                className={`bg-linear-to-br ${getRarityColor(badge.rarity)} rounded-2xl p-5 border-2 ${getRarityBorder(badge.rarity)} shadow-sm hover:shadow-md transition-all`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-4xl">{badge.icon}</div>
                  <div className="flex-1">
                    <h4 className="text-foreground font-semibold mb-1">{badge.name}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>
                    <span className="inline-block px-2 py-0.5 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                      {getRarityText(badge.rarity)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '100%' }} />
                  </div>
                  <span className="text-xs font-semibold text-primary">✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {badgesWithProgress.filter(b => !b.unlocked).length > 0 && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-foreground font-semibold flex items-center gap-2">
              <Lock className="w-5 h-5 text-muted-foreground" />
              Por Desbloquear ({lockedBadges.length})
            </h3>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setLockedFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  lockedFilter === 'all' 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setLockedFilter('common')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  lockedFilter === 'common' 
                    ? 'bg-gray-400 text-white shadow-sm' 
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
              >
                ⚪ Común
              </button>
              <button
                type="button"
                onClick={() => setLockedFilter('rare')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  lockedFilter === 'rare' 
                    ? 'text-white shadow-sm' 
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
                style={lockedFilter === 'rare' ? { backgroundColor: 'rgb(59, 130, 246)' } : {}}
              >
                🔵 Raro
              </button>
              <button
                type="button"
                onClick={() => setLockedFilter('epic')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  lockedFilter === 'epic' 
                    ? 'text-white shadow-sm' 
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
                style={lockedFilter === 'epic' ? { backgroundColor: 'rgb(168, 85, 247)' } : {}}
              >
                🟣 Épico
              </button>
              <button
                type="button"
                onClick={() => setLockedFilter('legendary')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  lockedFilter === 'legendary' 
                    ? 'bg-yellow-500 text-white shadow-sm' 
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
              >
                🟡 Legendario
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="bg-card rounded-2xl p-5 border border-border opacity-60 hover:opacity-100 transition-opacity"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-4xl grayscale">{badge.icon}</div>
                  <div className="flex-1">
                    <h4 className="text-foreground font-semibold mb-1">{badge.name}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>
                    <span className="inline-block px-2 py-0.5 bg-muted text-muted-foreground text-xs font-semibold rounded-full">
                      {getRarityText(badge.rarity)}
                    </span>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Progreso</span>
                    <span>{badge.progress} / {badge.total}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-muted-foreground rounded-full transition-all"
                      style={{ width: `${(badge.progress / badge.total) * 100}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  <Lock className="w-3 h-3 inline mr-1" />
                  {badge.condition}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * ============================================================================
 * DASHBOARDPRO.TSX - PANEL PRINCIPAL PROFESIONAL Y OPTIMIZADO
 * ============================================================================
 * 
 * Dashboard rediseñado con enfoque en:
 * - Prioridad: Lo más importante primero
 * - Eficiencia: Sin información redundante
 * - Visual: Diseño limpio y profesional
 * - Accionable: Acceso rápido a tareas principales
 * 
 * ESTRUCTURA:
 * - FILA 1: Header compacto (Bienvenida + Acciones + Stats clave)
 * - FILA 2: Panel Principal (Calendario + Mis Tareas del día)
 * - FILA 3: Progreso + Ranking
 * - FILA 4: Próximas Tareas + Actividad Reciente
 */

import { Member, Task, HomeConfig, Activity } from '../App';
import { CheckCircle, AlertCircle, Clock, Target, ChevronLeft, ChevronRight, Calendar, CheckCircle2, Plus, RotateCcw, Users, Star, TrendingUp, Zap } from 'lucide-react';
import { useState } from 'react';
import { getPodiumClasses } from '../lib/categoryUtils';
import { ProgresoGeneralCard } from './ProgresoGeneralCard';

type DashboardProps = {
  members: Member[];
  tasks: Task[];
  homeConfig?: HomeConfig;
  currentUser?: Member;
  activities?: Activity[];
  onNewTaskClick?: () => void;
  onManageRoutinesClick?: () => void;
  onNavigateToTasks?: (highlightType?: 'overdue' | 'overdue-unassigned' | 'unassigned' | 'pending' | 'in-progress' | 'completed') => void;
  onTaskClick?: (taskId: string) => void;
  onNavigateToProfile?: () => void;
  onNavigateToMyTasks?: () => void;
  onNavigateToMyOverdue?: () => void;
  onNavigateToMyToday?: () => void;
  onNavigateToMyInProgress?: () => void;
  onNavigateToMyCompleted?: () => void;
};

export function DashboardPro({ members, tasks, homeConfig: _homeConfig, currentUser, activities = [], onNewTaskClick, onManageRoutinesClick, onNavigateToTasks, onTaskClick, onNavigateToProfile, onNavigateToMyTasks: _onNavigateToMyTasks, onNavigateToMyOverdue, onNavigateToMyToday, onNavigateToMyInProgress, onNavigateToMyCompleted }: DashboardProps) {
  const todayDay = new Date().getDate();
  const [selectedDate, setSelectedDate] = useState<number | null>(todayDay);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const today = new Date().toISOString().split('T')[0];

  // ==================== CÁLCULOS PRINCIPALES ====================
  const userTodayTasks = currentUser
    ? tasks.filter(t => t.assignedTo === currentUser.id && t.dueDate === today && t.status !== 'completed')
    : [];
  const userOverdueTasks = currentUser
    ? tasks.filter(t => t.assignedTo === currentUser.id && t.dueDate < today && t.status !== 'completed')
    : [];

  // Estadísticas globales
  const globalStats = {
    totalTasks: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status !== 'completed').length,
    overdue: tasks.filter(t => t.dueDate < today && t.status !== 'completed').length,
    unassigned: tasks.filter(t => (!t.assignedTo || t.assignedTo === '') && t.status !== 'completed').length,
  };
  const completionRate = globalStats.totalTasks > 0 
    ? Math.round((globalStats.completed / globalStats.totalTasks) * 100) 
    : 0;

  // Nivel del usuario
  const userLevel = Math.floor((currentUser?.experience || 0) / 100) + 1;
  const levelProgress = (currentUser?.experience || 0) % 100;

  // Saludo contextual
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'Buenos días';
    if (hour >= 12 && hour < 20) return 'Buenas tardes';
    return 'Buenas noches';
  };

  // Función para calcular tiempo transcurrido
  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return 'ahora';
    if (diffMins < 60) return `hace ${diffMins} min`;
    if (diffHours < 24) return `hace ${diffHours}h`;
    return `hace ${Math.floor(diffHours / 24)}d`;
  };

  // ==================== CALENDARIO ====================
  
  const getCurrentMonthDays = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days: (number | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return { 
      days, 
      monthShort: calendarDate.toLocaleDateString('es-ES', { month: 'long' }),
      year 
    };
  };

  const { days: calendarDays, monthShort, year } = getCurrentMonthDays();

  const goToPreviousMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const goToToday = () => {
    const now = new Date();
    setCalendarDate(now);
    setSelectedDate(now.getDate());
  };

  const getTasksForDate = (day: number) => {
    const year = calendarDate.getFullYear();
    const month = String(calendarDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;
    return tasks.filter(t => t.dueDate === dateStr);
  };

  const getOrderedTasksForSelectedDate = () => {
    if (!selectedDate) return { userTasks: [], otherTasks: [], completedTasks: [] };
    const year = calendarDate.getFullYear();
    const month = String(calendarDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(selectedDate).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;
    const dayTasks = tasks.filter(t => t.dueDate === dateStr);
    const pending = dayTasks.filter(t => t.status !== 'completed');
    const completed = dayTasks.filter(t => t.status === 'completed');
    const userTasks = currentUser ? pending.filter(t => t.assignedTo === currentUser.id) : [];
    const otherTasks = currentUser ? pending.filter(t => t.assignedTo !== currentUser.id) : pending;
    return { userTasks, otherTasks, completedTasks: completed };
  };

  // ==================== ACTIVIDAD RECIENTE ====================
  
  // Ya no necesitamos esta variable aquí, se pasa directamente a ProgresoGeneralCard

  // Función para obtener el icono según el tipo de actividad
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'task_completed':
        return <CheckCircle className="w-4 h-4" style={{ color: 'var(--success)' }} />;
      case 'task_created':
        return <Plus className="w-4 h-4" style={{ color: 'var(--warning)' }} />;
      case 'task_assigned':
        return <Users className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />;
      case 'task_overdue':
        return <AlertCircle className="w-4 h-4" style={{ color: 'var(--danger)' }} />;
      case 'level_up':
        return <Zap className="w-4 h-4" style={{ color: 'var(--xp)' }} />;
      case 'badge_earned':
        return <Zap className="w-4 h-4" style={{ color: 'var(--xp)' }} />;
      case 'reward_redeemed':
        return <Star className="w-4 h-4" style={{ color: 'var(--xp)' }} />;
      case 'streak_milestone':
        return <Zap className="w-4 h-4" style={{ color: 'var(--xp)' }} />;
      case 'routine_executed':
        return <RotateCcw className="w-4 h-4" style={{ color: 'var(--info)' }} />;
      default:
        return <Clock className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />;
    }
  };

  // Función para obtener el color de fondo según el tipo
  const getActivityBgColor = (type: Activity['type']) => {
    switch (type) {
      case 'task_completed': // Verde
        return 'rgba(34, 197, 94, 0.12)';
      case 'task_created': // Anaranjado
        return 'rgba(251, 191, 36, 0.13)';
      case 'task_assigned': // Gris
        return 'rgba(120, 120, 120, 0.10)';
      case 'task_overdue': // Rojo
        return 'rgba(239, 68, 68, 0.13)';
      case 'level_up': // Morado
        return 'rgba(168, 85, 247, 0.13)';
      case 'badge_earned': // Morado
        return 'rgba(168, 85, 247, 0.13)';
      case 'reward_redeemed': // Morado
        return 'rgba(168, 85, 247, 0.13)';
      case 'routine_executed': // Azul
        return 'rgba(59, 130, 246, 0.13)';
      case 'streak_milestone': // Morado
        return 'rgba(168, 85, 247, 0.13)';
      default:
        return 'rgba(0, 0, 0, 0.05)';
    }
  };

  // ==================== RENDER ====================

  // Estadísticas para ProgresoGeneralCard (mismo formato que TaskList)
  const progresoStats = {
    overdue: globalStats.overdue,
    unassigned: globalStats.unassigned,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completedTasks: globalStats.completed,
    totalPoints: tasks.filter(t => t.status !== 'completed').reduce((sum, t) => sum + t.points, 0),
    totalTasks: globalStats.totalTasks,
  };

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      
      {/* ========== FILA 1: HEADER SIMPLIFICADO ========== */}
      <div className="bg-card rounded-2xl p-4 md:p-5 border border-border shadow-sm">
        <div className="flex flex-col gap-4">
          
          {/* Fila superior: Bienvenida + Nivel + Botones */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Bienvenida + Avatar + Nivel */}
            <div className="flex items-center gap-3">
              <button
                onClick={onNavigateToProfile}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-2xl md:text-3xl shadow-md border-2 border-white/50 shrink-0 hover:scale-110 transition-transform duration-200 cursor-pointer"
                style={{ backgroundColor: currentUser?.color || 'var(--primary)' }}
                title="Ver mi perfil"
              >
                {currentUser?.avatar || '👤'}
              </button>
              <div className="min-w-0">
                <h1 className="text-lg md:text-xl font-bold text-foreground truncate">
                  {getGreeting()}, {currentUser?.name || 'Usuario'}
                </h1>
                {/* Nivel con barra de progreso degradado */}
                <div className="flex items-center gap-2 mt-1">
                  <Zap className="w-3 h-3 md:w-3.5 md:h-3.5" style={{ color: 'var(--accent)' }} />
                  <span className="text-xs md:text-sm font-semibold" style={{ color: 'var(--accent)' }}>Nivel {userLevel}</span>
                  <div className="w-20 md:w-28 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${levelProgress}%`, 
                        background: 'linear-gradient(90deg, var(--accent) 0%, var(--primary) 100%)' 
                      }} 
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{levelProgress}%</span>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center gap-2">
              <button
                onClick={onNewTaskClick}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm transition-all duration-200 hover:bg-primary-hover hover:scale-105 hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Tarea</span>
              </button>
              <button
                onClick={onManageRoutinesClick}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 border hover:scale-105 hover:shadow-md"
                style={{ backgroundColor: 'rgba(14, 165, 233, 0.15)', color: 'var(--info)', borderColor: 'rgba(14, 165, 233, 0.3)' }}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Rutinas</span>
              </button>
            </div>
          </div>

          {/* Stats Cards - Estilo ProgresoGeneral */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 md:gap-3">
            {/* Atrasadas */}
            <button
              onClick={onNavigateToMyOverdue}
              className="flex flex-col items-center text-center p-2 rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
            >
              <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg mb-2" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}>
                <AlertCircle className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--danger)' }} />
              </div>
              <p className="text-xl md:text-2xl font-semibold mb-1" style={{ color: 'var(--danger)' }}>{userOverdueTasks.length}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">Atrasadas</p>
            </button>

            {/* Hoy */}
            <button
              onClick={onNavigateToMyToday}
              className="flex flex-col items-center text-center p-2 rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer"
              style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}
            >
              <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg mb-2" style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)' }}>
                <Clock className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--warning)' }} />
              </div>
              <p className="text-xl md:text-2xl font-semibold mb-1" style={{ color: 'var(--warning)' }}>{userTodayTasks.length}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">Hoy</p>
            </button>

            {/* En Progreso */}
            <button
              onClick={onNavigateToMyInProgress}
              className="flex flex-col items-center text-center p-2 rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer"
              style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
            >
              <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg mb-2" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}>
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--info)' }} />
              </div>
              <p className="text-xl md:text-2xl font-semibold mb-1" style={{ color: 'var(--info)' }}>
                {currentUser ? tasks.filter(t => t.assignedTo === currentUser.id && t.status === 'in-progress').length : 0}
              </p>
              <p className="text-[10px] md:text-xs text-muted-foreground">En Progreso</p>
            </button>

            {/* Completadas */}
            <button
              onClick={onNavigateToMyCompleted}
              className="flex flex-col items-center text-center p-2 rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer"
              style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
            >
              <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg mb-2" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)' }}>
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--success)' }} />
              </div>
              <p className="text-xl md:text-2xl font-semibold mb-1" style={{ color: 'var(--success)' }}>
                {currentUser ? tasks.filter(t => t.assignedTo === currentUser.id && t.status === 'completed').length : 0}
              </p>
              <p className="text-[10px] md:text-xs text-muted-foreground">Completadas</p>
            </button>

            {/* Puntos del Mes */}
            <div className="flex flex-col items-center text-center p-2 rounded-lg" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)' }}>
              <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg mb-2" style={{ backgroundColor: 'rgba(168, 85, 247, 0.2)' }}>
                <Star className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--xp)' }} />
              </div>
              <p className="text-xl md:text-2xl font-semibold mb-1" style={{ color: 'var(--xp)' }}>
                {currentUser?.monthlyPoints || 0}
              </p>
              <p className="text-[10px] md:text-xs text-muted-foreground">Puntos del Mes</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========== FILA 2: PROGRESO GENERAL + CALENDARIO ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
        {/* Progreso General - 2 cols en lg */}
        <div className="lg:col-span-2">
          <ProgresoGeneralCard
            stats={progresoStats}
            completionPercentage={completionRate}
            activities={activities}
            members={members}
            getActivityIcon={getActivityIcon}
            getActivityBgColor={getActivityBgColor}
            getTimeAgo={getTimeAgo}
            onClickOverdue={() => onNavigateToTasks?.('overdue')}
            onClickUnassigned={() => onNavigateToTasks?.('unassigned')}
            onClickPending={() => onNavigateToTasks?.('pending')}
            onClickInProgress={() => onNavigateToTasks?.('in-progress')}
            onClickCompleted={() => onNavigateToTasks?.('completed')}
            className="h-full"
          />
        </div>

        {/* Calendario - 1 col en lg */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl p-3 md:p-4 border border-border shadow-sm h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <h3 className="text-xs md:text-sm font-bold text-foreground capitalize flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" style={{ color: 'var(--primary)' }} />
                {monthShort} {year}
              </h3>
              <div className="flex items-center gap-1">
                <button onClick={goToPreviousMonth} className="p-1 hover:bg-muted rounded transition-colors" title="Mes anterior">
                  <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
                <button 
                  onClick={goToToday} 
                  className="px-1.5 md:px-2 py-0.5 md:py-1 text-[9px] md:text-[10px] font-medium rounded transition-colors" 
                  style={{ backgroundColor: 'rgba(40, 172, 113, 0.1)', color: 'var(--primary)' }}
                  title="Ir a hoy"
                >
                  Hoy
                </button>
                <button onClick={goToNextMonth} className="p-1 hover:bg-muted rounded transition-colors" title="Mes siguiente">
                  <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
              </div>
            </div>

            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'].map((day, i) => (
                <div key={i} className="text-center text-[11px] font-semibold text-muted-foreground py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Grid de días */}
            <div className="grid grid-cols-7 gap-0.5 md:gap-1">
              {calendarDays.map((day, index) => {
                if (day === null) return <div key={`empty-${index}`} className="aspect-square" />;
                
                const dayTasks = getTasksForDate(day);
                const currentDate = new Date();
                const isToday = day === currentDate.getDate() && 
                               calendarDate.getMonth() === currentDate.getMonth() &&
                               calendarDate.getFullYear() === currentDate.getFullYear();
                
                // Construir fecha del día para comparar
                const year = calendarDate.getFullYear();
                const month = String(calendarDate.getMonth() + 1).padStart(2, '0');
                const dayStr = String(day).padStart(2, '0');
                const dateStr = `${year}-${month}-${dayStr}`;
                const isPastDate = dateStr < today;
                
                // Clasificar tareas por estado
                const hasOverdue = isPastDate && dayTasks.some(t => t.status !== 'completed');
                const hasPending = dayTasks.some(t => t.status === 'pending' || t.status === 'in-progress'); // Engloba pending e in-progress
                const hasCompleted = dayTasks.some(t => t.status === 'completed');

                // Determinar estilos del día (prioridad: HOY > SELECCIONADO > ATRASADA > PENDIENTE > COMPLETADA)
                let dayStyle: React.CSSProperties = {};
                let dayClass = 'hover:bg-muted hover:shadow-md hover:scale-105 dark:hover:bg-muted/90 dark:hover:shadow-lg';
                
                if (isToday) {
                  // HOY: Color primario con ring
                  dayStyle = { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' };
                  dayClass = 'ring-2 ring-primary/50 font-bold hover:bg-primary/90 hover:shadow-md hover:scale-105 dark:hover:shadow-lg';
                } else if (selectedDate === day) {
                  // DÍA SELECCIONADO: Color acento
                  dayStyle = { backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' };
                  dayClass = 'font-bold hover:bg-accent/90 hover:shadow-md hover:scale-105 dark:hover:shadow-lg';
                } else if (hasOverdue) {
                  // ATRASADAS: Rojo
                  dayStyle = { backgroundColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)' };
                  dayClass = 'hover:bg-[rgba(239,68,68,0.3)] hover:shadow-md hover:scale-105 dark:hover:bg-[rgba(239,68,68,0.4)] dark:hover:shadow-lg font-semibold border border-danger/30';
                } else if (hasPending) {
                  // PENDIENTE: Naranja (engloba pending e in-progress)
                  dayStyle = { backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)' };
                  dayClass = 'hover:bg-[rgba(245,158,11,0.25)] hover:shadow-md hover:scale-105 dark:hover:bg-[rgba(245,158,11,0.35)] dark:hover:shadow-lg font-medium';
                } else if (hasCompleted) {
                  // COMPLETADA: Verde
                  dayStyle = { backgroundColor: 'rgba(34, 197, 94, 0.12)', color: 'var(--success)' };
                  dayClass = 'hover:bg-[rgba(34,197,94,0.2)] hover:shadow-md hover:scale-105 dark:hover:bg-[rgba(34,197,94,0.3)] dark:hover:shadow-lg';
                }

                // Color del indicador (punto)
                let indicatorColor = 'var(--muted)';
                if (hasOverdue) indicatorColor = 'var(--danger)';
                else if (hasPending) indicatorColor = 'var(--warning)';
                else if (hasCompleted) indicatorColor = 'var(--success)';

                return (
                  <button
                    key={day}
                    onClick={() => { setSelectedDate(day); setShowCompletedTasks(false); }}
                    className={`aspect-square rounded-md text-[11px] md:text-xs transition-all relative flex items-center justify-center ${dayClass}`}
                    style={dayStyle}
                  >
                    {day}
                    {dayTasks.length > 0 && (
                      <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2">
                        <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full" style={{ backgroundColor: indicatorColor }} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Leyenda */}
            <div className="flex items-center justify-center gap-2 md:gap-3 text-[9px] md:text-[10px] text-muted-foreground pt-2 border-t border-border mt-2">
              <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full" style={{ backgroundColor: 'var(--danger)' }} />Atrasada</span>
              <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full" style={{ backgroundColor: 'var(--warning)' }} />Pendiente</span>
              <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full" style={{ backgroundColor: 'var(--success)' }} />Completada</span>
            </div>

            {/* Tareas del Día Seleccionado */}
            {selectedDate ? (
              (() => {
                const { userTasks, otherTasks, completedTasks } = getOrderedTasksForSelectedDate();
                // Construir fecha seleccionada directamente en formato YYYY-MM-DD sin usar Date object para evitar problemas de zona horaria
                const year = calendarDate.getFullYear();
                const month = String(calendarDate.getMonth() + 1).padStart(2, '0');
                const day = String(selectedDate).padStart(2, '0');
                const selectedDateStr = `${year}-${month}-${day}`;
                const selectedDateObj = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), selectedDate);
                const isSelectedToday = selectedDateStr === today;
                const isPastDate = selectedDateStr < today;
                const totalTasks = userTasks.length + otherTasks.length + completedTasks.length;
                const totalPts = [...userTasks, ...otherTasks, ...completedTasks].reduce((sum, t) => sum + t.points, 0);

                return (
                  <div className="mt-3 pt-3 border-t border-border">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-accent" />
                        {isSelectedToday ? 'Tareas de Hoy' : selectedDateObj.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })}
                      </h4>
                      {totalTasks > 0 && (
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className="px-1.5 py-0.5 bg-muted rounded-full">{totalTasks}</span>
                          <span className="px-1.5 py-0.5 bg-xp/20 text-xp rounded-full font-medium">{totalPts}★</span>
                        </div>
                      )}
                    </div>

                    {/* Lista de tareas */}
                    <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                      {totalTasks === 0 ? (
                        <div className="text-center py-4">
                          <div className="text-xl mb-1">📭</div>
                          <p className="text-[10px] text-muted-foreground">Sin tareas</p>
                        </div>
                      ) : (
                        <>
                          {/* Mis Tareas */}
                          {userTasks.length > 0 && (
                            <div className="space-y-1">
                              <p className="text-[9px] font-bold flex items-center gap-1" style={{ color: isPastDate ? 'var(--danger)' : 'var(--primary)' }}>
                                {isPastDate ? <AlertCircle className="w-2.5 h-2.5" /> : <Target className="w-2.5 h-2.5" />}
                                {isPastDate ? `Mis Tareas Atrasadas (${userTasks.length})` : `Mis Tareas (${userTasks.length})`}
                              </p>
                              {userTasks.map((task) => {
                                const member = members.find(m => m.id === task.assignedTo);
                                return (
                                  <TaskRow key={task.id} task={task} member={member} variant={isPastDate ? "danger" : "primary"} compact onTaskClick={onTaskClick} />
                                );
                              })}
                            </div>
                          )}

                          {/* Otras */}
                          {otherTasks.length > 0 && (
                            <div className="space-y-1">
                              <p className="text-[9px] font-bold flex items-center gap-1" style={{ color: isPastDate ? 'var(--danger)' : 'var(--muted-foreground)' }}>
                                {isPastDate ? <AlertCircle className="w-2.5 h-2.5" /> : <Users className="w-2.5 h-2.5" />}
                                {isPastDate ? `Otras Tareas Atrasadas (${otherTasks.length})` : `Otras (${otherTasks.length})`}
                              </p>
                              {otherTasks.map((task) => {
                                const member = members.find(m => m.id === task.assignedTo);
                                return (
                                  <TaskRow key={task.id} task={task} member={member} variant={isPastDate ? "danger" : "muted"} compact onTaskClick={onTaskClick} />
                                );
                              })}
                            </div>
                          )}

                          {/* Completadas */}
                          {completedTasks.length > 0 && (
                            <div className="space-y-1">
                              <button
                                onClick={() => setShowCompletedTasks(!showCompletedTasks)}
                                className="text-[9px] font-bold text-success flex items-center gap-1 hover:underline"
                              >
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                Completadas ({completedTasks.length})
                                <ChevronRight className={`w-2.5 h-2.5 transition-transform ${showCompletedTasks ? 'rotate-90' : ''}`} />
                              </button>
                              {showCompletedTasks && completedTasks.map((task) => {
                                const member = members.find(m => m.id === task.assignedTo);
                                return (
                                  <TaskRow key={task.id} task={task} member={member} variant="success" completed compact onTaskClick={onTaskClick} />
                                );
                              })}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="mt-3 pt-3 border-t border-border text-center py-4">
                <p className="text-[10px] text-muted-foreground">Selecciona un día para ver tareas</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========== FILA 3: MIEMBROS Y RANKING ========== */}
      <div className="grid grid-cols-1 gap-3 md:gap-4">
        {/* Miembros del Hogar con Ranking */}
        <div>
          <div className="bg-card rounded-2xl p-3 border border-border shadow-sm h-full flex flex-col" style={{ maxHeight: '20rem' }}>
            <div className="mb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Users className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                Miembros
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2">
              {[...members]
                .map(member => ({
                  ...member,
                  tasksCompleted: tasks.filter(t => t.assignedTo === member.id && t.status === 'completed').length,
                }))
                .sort((a, b) => b.monthlyPoints - a.monthlyPoints)
                .map((member, index) => {
                  const memberPendingTasks = tasks.filter(t => t.assignedTo === member.id && t.status !== 'completed').length;
                  const memberCompletedToday = tasks.filter(t => t.assignedTo === member.id && t.status === 'completed' && t.dueDate === today).length;
                  const isTopThree = index < 3;
                  const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : null;
                  
                  return (
                    <div 
                      key={member.id} 
                      className={`flex items-center gap-2 p-2 rounded-xl transition-colors ${
                        isTopThree ? getPodiumClasses(index) : 'bg-muted/30 hover:bg-muted/50'
                      }`}
                    >
                      {/* Ranking position */}
                      <div className="w-5 flex items-center justify-center shrink-0">
                        {medal ? (
                          <span className="text-base">{medal}</span>
                        ) : (
                          <span className="text-[10px] font-bold text-muted-foreground">#{index + 1}</span>
                        )}
                      </div>
                      
                      {/* Avatar */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                        style={{ backgroundColor: member.color }}
                      >
                        {member.avatar}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{member.name}</p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" />{memberPendingTasks}
                          </span>
                          <span className="flex items-center gap-0.5" style={{ color: 'var(--success)' }}>
                            <CheckCircle2 className="w-2.5 h-2.5" />{memberCompletedToday}
                          </span>
                          <span className="flex items-center gap-0.5" style={{ color: 'var(--xp)' }}>
                            <Star className="w-2.5 h-2.5" />{member.monthlyPoints}
                          </span>
                        </div>
                      </div>
                      
                      {/* Level badge */}
                      <div className="text-right">
                        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(231, 111, 81, 0.2)', color: 'var(--accent)' }}>Nv.{member.level}</span>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Resumen rápido */}
            <div className="pt-2 mt-2 border-t border-border">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>{members.length} miembros</span>
                <span className="font-medium" style={{ color: 'var(--xp)' }}>{members.reduce((sum, m) => sum + m.points, 0)}★ total</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== COMPONENTES AUXILIARES ====================

function TaskRow({ task, member, variant, completed, compact, onTaskClick }: { 
  task: Task; 
  member?: Member; 
  variant: 'danger' | 'primary' | 'muted' | 'success';
  completed?: boolean;
  compact?: boolean;
  onTaskClick?: (taskId: string) => void;
}) {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'danger':
        return { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'var(--danger)' };
      case 'primary':
        return { backgroundColor: 'rgba(40, 172, 113, 0.1)', borderColor: 'var(--primary)' };
      case 'success':
        return { backgroundColor: 'rgba(34, 197, 94, 0.05)', borderColor: 'rgba(34, 197, 94, 0.3)' };
      default:
        return { backgroundColor: 'rgba(96, 86, 105, 0.1)', borderColor: 'rgba(96, 86, 105, 0.3)' };
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'danger': return 'var(--danger)';
      case 'primary': return 'var(--primary)';
      case 'success': return 'var(--success)';
      default: return 'var(--muted-foreground)';
    }
  };

  return (
    <div 
      onClick={() => onTaskClick?.(task.id)}
      className={`flex items-center gap-2 ${compact ? 'p-1.5' : 'p-2'} rounded-lg border-l-2 ${compact ? 'text-[10px]' : 'text-xs'} cursor-pointer transition-colors hover:opacity-80 ${completed ? 'opacity-60' : ''}`}
      style={getVariantStyles()}
    >
      {member && (
        <div
          className={`${compact ? 'w-4 h-4 text-[9px]' : 'w-5 h-5 text-[10px]'} rounded-full flex items-center justify-center shrink-0`}
          style={{ backgroundColor: member.color }}
        >
          {member.avatar}
        </div>
      )}
      {!member && (
        <div className={`${compact ? 'w-4 h-4 text-[9px]' : 'w-5 h-5 text-[10px]'} rounded-full bg-muted flex items-center justify-center shrink-0`}>?</div>
      )}
      <span className={`flex-1 truncate ${completed ? 'line-through' : ''}`}>{task.title}</span>
      <span className={`${compact ? 'text-[9px]' : 'text-[10px]'} font-medium`} style={{ color: getTextColor() }}>
        {completed ? '✓' : `${task.points}★`}
      </span>
    </div>
  );
}

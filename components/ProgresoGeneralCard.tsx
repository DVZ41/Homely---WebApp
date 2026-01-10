import React from 'react';
import { AlertCircle, User, Clock, TrendingUp, CheckCircle2, Zap, Star, CheckCircle, Plus, Users as UsersIcon, RotateCcw } from 'lucide-react';
import { Activity, Member } from '../App';

export type ProgresoGeneralStats = {
  overdue: number;
  unassigned: number;
  pending: number;
  inProgress: number;
  completedTasks: number;
  totalPoints: number;
  totalTasks: number;
};

interface ProgresoGeneralCardProps {
  stats: ProgresoGeneralStats;
  completionPercentage: number;
  className?: string;
  activities?: Activity[];
  members?: Member[];
  getActivityIcon?: (type: Activity['type']) => React.ReactNode;
  getActivityBgColor?: (type: Activity['type']) => string;
  getTimeAgo?: (date: Date) => string;
  onClickOverdue?: () => void;
  onClickUnassigned?: () => void;
  onClickPending?: () => void;
  onClickInProgress?: () => void;
  onClickCompleted?: () => void;
}

export const ProgresoGeneralCard: React.FC<ProgresoGeneralCardProps> = ({
  stats,
  completionPercentage,
  className = '',
  activities = [],
  members = [],
  getActivityIcon,
  getActivityBgColor,
  getTimeAgo,
  onClickOverdue,
  onClickUnassigned,
  onClickPending,
  onClickInProgress,
  onClickCompleted,
}) => {
  // Funciones por defecto si no se pasan como props
  const defaultGetActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'task_completed':
        return <CheckCircle className="w-4 h-4" style={{ color: 'var(--success)' }} />;
      case 'task_created':
        return <Plus className="w-4 h-4" style={{ color: 'var(--warning)' }} />;
      case 'task_assigned':
        return <UsersIcon className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />;
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

  const defaultGetActivityBgColor = (type: Activity['type']) => {
    switch (type) {
      case 'task_completed':
        return 'rgba(34, 197, 94, 0.12)';
      case 'task_created':
        return 'rgba(245, 158, 11, 0.12)';
      case 'task_assigned':
        return 'rgba(156, 163, 175, 0.12)';
      case 'task_overdue':
        return 'rgba(239, 68, 68, 0.12)';
      case 'level_up':
      case 'badge_earned':
      case 'reward_redeemed':
      case 'streak_milestone':
        return 'rgba(240, 51, 224, 0.12)';
      case 'routine_executed':
        return 'rgba(14, 165, 233, 0.12)';
      default:
        return 'rgba(156, 163, 175, 0.08)';
    }
  };

  const defaultGetTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Hace ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Hace ${diffDays}d`;
  };

  const iconFn = getActivityIcon || defaultGetActivityIcon;
  const bgColorFn = getActivityBgColor || defaultGetActivityBgColor;
  const timeAgoFn = getTimeAgo || defaultGetTimeAgo;

  const recentActivities = [...activities]
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 6);

  return (
    <div
      className={`bg-card rounded-2xl p-4 md:p-6 border border-border shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h3 className="text-xs md:text-sm font-semibold text-foreground">Progreso General</h3>
        <span className="text-lg md:text-xl font-bold" style={{ color: 'var(--primary)' }}>{completionPercentage}%</span>
      </div>
      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2 md:h-2.5 overflow-hidden mb-3 md:mb-4">
        <div
          className="h-full bg-linear-to-r from-primary to-success transition-all duration-500 rounded-full"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
      {/* Statistics Grid - Responsive */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 md:gap-3 mb-4">
      {/* Atrasadas */}
      <button onClick={onClickOverdue} className="flex flex-col items-center text-center p-2 rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center mb-1" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}>
          <AlertCircle className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--danger)' }} />
        </div>
        <p className="text-lg md:text-xl font-bold" style={{ color: 'var(--danger)' }}>{stats.overdue}</p>
        <p className="text-[9px] md:text-[10px] text-muted-foreground leading-tight">Atrasadas</p>
      </button>
      {/* Sin asignar */}
      <button onClick={onClickUnassigned} className="flex flex-col items-center text-center p-2 rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer" style={{ backgroundColor: 'rgba(156, 163, 175, 0.1)' }}>
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center mb-1" style={{ backgroundColor: 'rgba(156, 163, 175, 0.2)' }}>
          <User className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
        </div>
        <p className="text-lg md:text-xl font-bold text-muted-foreground">{stats.unassigned}</p>
        <p className="text-[9px] md:text-[10px] text-muted-foreground leading-tight">Sin Asignar</p>
      </button>
      {/* Pendientes */}
      <button onClick={onClickPending} className="flex flex-col items-center text-center p-2 rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center mb-1" style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)' }}>
          <Clock className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--warning)' }} />
        </div>
        <p className="text-lg md:text-xl font-bold" style={{ color: 'var(--warning)' }}>{stats.pending}</p>
        <p className="text-[9px] md:text-[10px] text-muted-foreground leading-tight">Pendientes</p>
      </button>
      {/* En progreso */}
      <button onClick={onClickInProgress} className="flex flex-col items-center text-center p-2 rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer" style={{ backgroundColor: 'rgba(14, 165, 233, 0.1)' }}>
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center mb-1" style={{ backgroundColor: 'rgba(14, 165, 233, 0.2)' }}>
          <TrendingUp className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--info)' }} />
        </div>
        <p className="text-lg md:text-xl font-bold" style={{ color: 'var(--info)' }}>{stats.inProgress}</p>
        <p className="text-[9px] md:text-[10px] text-muted-foreground leading-tight">En Progreso</p>
      </button>
      {/* Completadas */}
      <button onClick={onClickCompleted} className="flex flex-col items-center text-center p-2 rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center mb-1" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)' }}>
          <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--success)' }} />
        </div>
        <p className="text-lg md:text-xl font-bold" style={{ color: 'var(--success)' }}>{stats.completedTasks}</p>
        <p className="text-[9px] md:text-[10px] text-muted-foreground leading-tight">Completadas</p>
      </button>
      {/* Puntos restantes */}
      <div className="flex flex-col items-center text-center p-2 rounded-lg" style={{ backgroundColor: 'rgba(240, 51, 224, 0.1)' }}>
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center mb-1" style={{ backgroundColor: 'rgba(240, 51, 224, 0.2)' }}>
          <Star className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--xp)' }} />
        </div>
        <p className="text-lg md:text-xl font-bold" style={{ color: 'var(--xp)' }}>{stats.totalPoints}</p>
        <p className="text-[9px] md:text-[10px] text-muted-foreground leading-tight">Puntos</p>
      </div>
    </div>
    
    {/* Actividad Reciente */}
    {activities.length > 0 && (
      <div className="mt-4 pt-4 border-t border-border">
        <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" style={{ color: 'var(--primary)' }} />
          Actividad Reciente
        </h4>
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {recentActivities.map((activity) => {
            const member = members.find(m => m.id === activity.memberId);
            const activityDate = new Date(activity.timestamp);
            const timeAgo = timeAgoFn(activityDate);
            const data = activity.data as Record<string, unknown> | undefined;
            return (
              <div 
                key={activity.id} 
                className="flex items-start gap-2 p-2 rounded-lg hover:opacity-90 transition-all"
                style={{ backgroundColor: bgColorFn(activity.type) }}
              >
                {member && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.avatar}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-medium text-foreground line-clamp-2">{activity.message}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] text-muted-foreground">{member?.name || 'Sistema'}</span>
                    <span className="text-[9px] text-muted-foreground">•</span>
                    <span className="text-[9px] text-muted-foreground">{timeAgo}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {typeof data?.points === 'number' && (
                    <span className="text-[9px] font-medium" style={{ color: 'var(--xp)' }}>+{data.points}★</span>
                  )}
                  {typeof data?.pointsCost === 'number' && (
                    <span className="text-[9px] font-medium" style={{ color: 'var(--accent)' }}>-{data.pointsCost}★</span>
                  )}
                  {iconFn(activity.type)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )}
  </div>
);
};

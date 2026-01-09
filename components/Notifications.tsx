import { Notification, Task, Member } from '../App';
import { AlertCircle, Bell, CheckCircle, Trophy, Zap, Gift, Calendar, ClipboardCheck, Star, Trash2, Clock } from 'lucide-react';

type NotificationsProps = {
  notifications: Notification[];
  tasks: Task[];
  members: Member[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onNotificationClick: (notification: Notification) => void;
  onClearOldNotifications: () => void;
};

export function Notifications({ 
  notifications, 
  tasks: _tasks,
  members, 
  onMarkAsRead, 
  onMarkAllAsRead,
  onDeleteNotification,
  onNotificationClick,
  onClearOldNotifications
}: NotificationsProps) {
  const unreadCount = notifications.filter(n => !n.read).length;
  const readCount = notifications.filter(n => n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-danger" />;
      case 'due_today':
        return <Calendar className="w-5 h-5 text-warning" />;
      case 'due_tomorrow':
        return <Clock className="w-5 h-5 text-info" />;
      case 'task_assigned':
        return <ClipboardCheck className="w-5 h-5 text-primary" />;
      case 'task_completed':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'badge_earned':
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'level_up':
        return <Zap className="w-5 h-5 text-xp" />;
      case 'streak':
        return <Star className="w-5 h-5 text-accent" />;
      case 'leader':
        return <Trophy className="w-5 h-5 text-primary" />;
      case 'reward_available':
        return <Gift className="w-5 h-5 text-primary" />;
      case 'reward_redeemed':
        return <Gift className="w-5 h-5 text-success" />;
      case 'system':
        return <Bell className="w-5 h-5 text-info" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getNotificationBg = (type: Notification['type']) => {
    switch (type) {
      case 'overdue':
        return 'bg-danger/10';
      case 'due_today':
        return 'bg-warning/10';
      case 'due_tomorrow':
        return 'bg-info/10';
      case 'task_assigned':
        return 'bg-primary/10';
      case 'task_completed':
        return 'bg-success/10';
      case 'badge_earned':
        return 'bg-yellow-500/10';
      case 'level_up':
        return 'bg-xp/10';
      case 'streak':
        return 'bg-accent/10';
      case 'leader':
        return 'bg-primary/10';
      case 'reward_available':
        return 'bg-primary/10';
      case 'reward_redeemed':
        return 'bg-success/10';
      case 'system':
        return 'bg-info/10';
      default:
        return 'bg-muted';
    }
  };

  const getNotificationLabel = (type: Notification['type']) => {
    switch (type) {
      case 'overdue':
        return { text: 'Urgente', color: 'bg-danger/10 text-danger' };
      case 'due_today':
        return { text: 'Vence Hoy', color: 'bg-warning/10 text-warning' };
      case 'due_tomorrow':
        return { text: 'Mañana', color: 'bg-info/10 text-info' };
      case 'task_assigned':
        return { text: 'Nueva Tarea', color: 'bg-primary/10 text-primary' };
      case 'task_completed':
        return { text: 'Completada', color: 'bg-success/10 text-success' };
      case 'badge_earned':
        return { text: 'Logro', color: 'bg-yellow-500/10 text-yellow-600' };
      case 'level_up':
        return { text: 'Nivel', color: 'bg-xp/10 text-xp' };
      case 'streak':
        return { text: 'Racha', color: 'bg-accent/10 text-accent' };
      case 'leader':
        return { text: 'Líder', color: 'bg-primary/10 text-primary' };
      case 'reward_available':
        return { text: 'Recompensa', color: 'bg-primary/10 text-primary' };
      case 'reward_redeemed':
        return { text: 'Canjeado', color: 'bg-success/10 text-success' };
      case 'system':
        return { text: 'Sistema', color: 'bg-info/10 text-info' };
      default:
        return { text: 'Info', color: 'bg-muted text-muted-foreground' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Ahora mismo';
    if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  // Ordenar: no leídas primero, luego por fecha
  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Alertas y Notificaciones</h2>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 
                ? `Tienes ${unreadCount} notificación${unreadCount !== 1 ? 'es' : ''} sin leer`
                : 'No tienes notificaciones sin leer'
              }
            </p>
          </div>
          <div className="flex items-center gap-2">
            {readCount > 0 && (
              <button
                onClick={onClearOldNotifications}
                className="px-3 py-2 rounded-xl border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 text-sm font-medium"
                title="Limpiar notificaciones antiguas"
              >
                Limpiar leídas
              </button>
            )}
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover hover:scale-105 hover:shadow-lg transition-all duration-200 text-sm font-medium"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-info">{notifications.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">{unreadCount}</p>
              <p className="text-xs text-muted-foreground">Sin leer</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-danger/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-danger" />
            </div>
            <div>
              <p className="text-2xl font-bold text-danger">
                {notifications.filter(n => n.type === 'overdue' && !n.read).length}
              </p>
              <p className="text-xs text-muted-foreground">Urgentes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {sortedNotifications.length === 0 ? (
          <div className="bg-card rounded-2xl p-12 text-center border border-border">
            <div className="text-6xl mb-4">🔔</div>
            <p className="text-lg font-medium text-foreground mb-1">No hay notificaciones</p>
            <p className="text-sm text-muted-foreground">Las notificaciones aparecerán aquí cuando haya actividad</p>
          </div>
        ) : (
          sortedNotifications.map((notification) => {
            const label = getNotificationLabel(notification.type);
            return (
              <div
                key={notification.id}
                onClick={() => notification.actionUrl && onNotificationClick(notification)}
                className={`bg-card rounded-2xl p-4 border transition-all hover:shadow-md ${
                  notification.read
                    ? 'border-border opacity-70'
                    : 'border-primary/30 shadow-sm'
                } ${notification.actionUrl ? 'cursor-pointer hover:border-primary/50' : ''}`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${getNotificationBg(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <p className={`text-sm ${
                        notification.read ? 'text-muted-foreground line-through' : 'text-foreground font-medium'
                      }`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-1 shrink-0">
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onMarkAsRead(notification.id);
                            }}
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                            title="Marcar como leída"
                          >
                            <CheckCircle className="w-4 h-4 text-primary" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteNotification(notification.id);
                          }}
                          className="p-1.5 rounded-lg hover:bg-danger/10 transition-colors"
                          title="Eliminar notificación"
                        >
                          <Trash2 className="w-4 h-4 text-muted-foreground hover:text-danger" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(notification.date)}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${label.color}`}>
                        {label.text}
                      </span>
                      {notification.memberId && members.find(m => m.id === notification.memberId) && (
                        <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                          {members.find(m => m.id === notification.memberId)?.name}
                        </span>
                      )}
                      {notification.actionUrl && (
                        <span className="text-xs text-primary">
                          Click para ver →
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

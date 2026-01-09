import { Member, Task, Reward } from '../App';
import { Trophy, TrendingUp, CheckCircle, Calendar, Award as AwardIcon, Target, Flame, Star } from 'lucide-react';

type ProfileProps = {
  currentUser: Member | undefined;
  members: Member[];
  tasks: Task[];
  rewards: Reward[];
  onUpdateUser: (id: string, updates: Partial<Member>) => void;
  onChangeUser?: (userId: string) => void;
};

export function Profile({ currentUser, members, tasks, onUpdateUser: _onUpdateUser, onChangeUser }: ProfileProps) {
  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">👤</div>
        <p className="text-muted-foreground">No se encontró información del usuario</p>
        <p className="text-sm text-muted-foreground mt-2">Por favor, añade un miembro en la sección de Miembros</p>
      </div>
    );
  }

  // Calcular estadísticas del usuario
  const myTasks = tasks.filter(t => t.assignedTo === currentUser.id);
  const completedTasks = myTasks.filter(t => t.status === 'completed');
  const pendingTasks = myTasks.filter(t => t.status === 'pending');
  const inProgressTasks = myTasks.filter(t => t.status === 'in-progress');
  
  const completionRate = myTasks.length > 0 
    ? Math.round((completedTasks.length / myTasks.length) * 100) 
    : 0;

  // Tareas por categoría
  const tasksByCategory = myTasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Racha de días completados (simulado)
  const currentStreak = 5;

  // Estadísticas del mes actual
  const currentMonth = new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  
  return (
    <div className="space-y-6">
      {/* Header del Perfil */}
      <div className="bg-linear-to-r from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold text-foreground">Mi Perfil</h2>
          {onChangeUser && members && members.length > 1 && (
            <div className="flex items-center gap-3">
              <label className="text-sm text-muted-foreground">Cambiar de usuario:</label>
              <select
                value={currentUser.id}
                onChange={(e) => onChangeUser(e.target.value)}
                title="Cambiar usuario"
                className="px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              >
                {members.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.avatar} {member.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="flex items-center gap-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl shadow-lg"
            style={{ backgroundColor: currentUser.color }}
          >
            {currentUser.avatar}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-foreground mb-2">{currentUser.name}</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-card rounded-lg">
                <Star className="w-4 h-4 text-primary" />
                <span className="text-foreground font-semibold">{currentUser.points} puntos totales</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-card rounded-lg">
                <Flame className="w-4 h-4 text-accent" />
                <span className="text-foreground font-semibold">{currentStreak} días de racha</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Tareas */}
        <div className="bg-card rounded-2xl p-5 border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mb-1">{myTasks.length}</p>
          <p className="text-sm text-muted-foreground">Tareas totales</p>
        </div>

        {/* Tareas Completadas */}
        <div className="bg-card rounded-2xl p-5 border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mb-1">{completedTasks.length}</p>
          <p className="text-sm text-muted-foreground">Completadas</p>
        </div>

        {/* Tasa de Completitud */}
        <div className="bg-card rounded-2xl p-5 border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mb-1">{completionRate}%</p>
          <p className="text-sm text-muted-foreground">Tasa de completitud</p>
        </div>

        {/* Puntos del Mes */}
        <div className="bg-card rounded-2xl p-5 border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Star className="w-5 h-5 text-accent" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mb-1">{currentUser.monthlyPoints}</p>
          <p className="text-sm text-muted-foreground">Puntos este mes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estado de Tareas */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Estado de Tareas
          </h3>
          
          <div className="space-y-4">
            {/* Completadas */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground">Completadas</span>
                <span className="text-sm font-semibold text-primary">{completedTasks.length}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${myTasks.length > 0 ? (completedTasks.length / myTasks.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* En Progreso */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground">En progreso</span>
                <span className="text-sm font-semibold text-accent">{inProgressTasks.length}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent rounded-full transition-all"
                  style={{ width: `${myTasks.length > 0 ? (inProgressTasks.length / myTasks.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Pendientes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground">Pendientes</span>
                <span className="text-sm font-semibold text-muted-foreground">{pendingTasks.length}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-muted-foreground rounded-full transition-all"
                  style={{ width: `${myTasks.length > 0 ? (pendingTasks.length / myTasks.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tareas por Categoría */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h3 className="text-foreground font-semibold mb-5">Tareas por Categoría</h3>
          
          {Object.keys(tasksByCategory).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(tasksByCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {category === 'Cocina' ? '🍳' : 
                         category === 'Limpieza' ? '🧹' :
                         category === 'Baño' ? '🚿' : '📋'}
                      </span>
                      <span className="text-sm text-foreground font-medium">{category}</span>
                    </div>
                    <span className="text-sm font-semibold text-primary">{count}</span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8 text-sm">
              No hay tareas asignadas aún
            </p>
          )}
        </div>
      </div>

      {/* Resumen del Mes */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h3 className="text-foreground font-semibold mb-5">Resumen de {currentMonth}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
              <Star className="w-8 h-8 text-primary" />
            </div>
            <p className="text-2xl font-semibold text-foreground mb-1">{currentUser.monthlyPoints}</p>
            <p className="text-sm text-muted-foreground">Puntos ganados</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <p className="text-2xl font-semibold text-foreground mb-1">{completedTasks.length}</p>
            <p className="text-sm text-muted-foreground">Tareas completadas</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-accent/10 flex items-center justify-center">
              <Flame className="w-8 h-8 text-accent" />
            </div>
            <p className="text-2xl font-semibold text-foreground mb-1">{currentStreak}</p>
            <p className="text-sm text-muted-foreground">Días de racha</p>
          </div>
        </div>
      </div>

      {/* Editar Perfil */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h3 className="text-foreground font-semibold mb-5">Configuración de Perfil</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Para editar tu nombre, avatar o color, dirígete a la sección de <strong>Miembros</strong> y selecciona tu perfil.
        </p>
        <button
          onClick={() => {/* Función para cambiar a la sección de miembros */}}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary-hover hover:scale-105 hover:shadow-lg transition-all duration-200 text-sm font-medium"
        >
          Ir a Miembros
        </button>
      </div>
    </div>
  );
}

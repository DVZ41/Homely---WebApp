import { useState, useEffect } from 'react';
import { Member, Task } from '../App';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Star,
  TrendingUp,
  Search,
  ArrowUpDown,
  X,
  User,
  Edit2,
  Trash2,
  Columns3,
  List,
  Info,
  Plus,
} from 'lucide-react';
import { getCategoryConfig, getCategoryClasses, CATEGORIES } from '../lib/categoryUtils';

type MyTasksProps = {
  tasks: Task[];
  members: Member[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask?: (id: string) => void;
  onEditTask?: (task: Task) => void;
  highlightedTaskId?: string[];
  onClearHighlight?: () => void;
  onNavigateToTasks?: (highlightType?: 'overdue-unassigned' | 'unassigned') => void;
  onScrollToMyOverdue?: () => void;
  currentUserId: string | null;
  onChangeUser: (userId: string) => void;
};

export function MyTasks({
  tasks,
  members,
  onUpdateTask,
  onDeleteTask,
  onEditTask,
  highlightedTaskId,
  onClearHighlight,
  onNavigateToTasks,
  onScrollToMyOverdue,
  currentUserId,
  onChangeUser: _onChangeUser,
}: MyTasksProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'points' | 'category'>('date');
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');

  // Usuario actual (dinámico desde prop, fallback a primer miembro)
  const currentUser = members.find((m) => m.id === currentUserId) || members[0];
  const selectedMemberId = currentUser?.id || '';
  // const taskRefs = useRef<{ [key: string]: HTMLDivElement | null }>({}); // Eliminado: no se usa
  const [unassignedTaskDialog, setUnassignedTaskDialog] = useState<{
    open: boolean;
    task: Task | null;
    intendedAction: string;
  }>({
    open: false,
    task: null,
    intendedAction: '',
  });

  const selectedMember = members.find((m) => m.id === selectedMemberId);

  if (!selectedMember) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hay miembros disponibles</p>
      </div>
    );
  }

  // Filter tasks for selected member
  const myTasks = tasks.filter((t) => t.assignedTo === selectedMemberId);

  // Filter by category
  let filteredTasks =
    categoryFilter === 'all' ? myTasks : myTasks.filter((t) => t.category === categoryFilter);

  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredTasks = filteredTasks.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query)) ||
        t.category.toLowerCase().includes(query)
    );
  }

  // Sort tasks based on selected sort option
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const today = new Date().toISOString().split('T')[0];
    // Always show overdue first if not completed
    const aOverdue = a.dueDate < today && a.status !== 'completed';
    const bOverdue = b.dueDate < today && b.status !== 'completed';
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;

    // Then apply selected sorting
    switch (sortBy) {
      case 'date':
        return a.dueDate.localeCompare(b.dueDate);
      case 'priority':
        const urgencyOrder = { high: 0, medium: 1, low: 2 };
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      case 'points':
        return b.points - a.points;
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  const today = new Date().toISOString().split('T')[0];
  const pendingTasks = sortedTasks.filter((t) => t.status === 'pending');
  const inProgressTasks = sortedTasks.filter((t) => t.status === 'in-progress');
  const completedTasks = sortedTasks.filter((t) => t.status === 'completed');
  const overdueTasks = myTasks.filter((t) => t.dueDate < today && t.status !== 'completed');
  const dueTodayTasks = myTasks.filter((t) => t.dueDate === today && t.status !== 'completed');

  // Tareas sin asignar disponibles
  const unassignedTasks = tasks.filter((t) => !t.assignedTo || t.assignedTo === '');
  const unassignedOverdueTasks = unassignedTasks.filter(
    (t) => t.dueDate < today && t.status !== 'completed'
  );
  // Tareas sin asignar NO atrasadas y NO completadas
  const unassignedPendingTasks = unassignedTasks.filter(
    (t) => t.status !== 'completed' && t.dueDate >= today
  );

  // Task statistics by category
  const categories = Object.values(CATEGORIES).map((c) => c.name);
  // const categoryStats = ... // Eliminado: no se usa

  // Drag and Drop handlers
  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (newStatus: Task['status']) => {
    if (draggedTask) {
      const task = tasks.find((t) => t.id === draggedTask);
      if (task && !task.assignedTo) {
        setUnassignedTaskDialog({
          open: true,
          task: task,
          intendedAction:
            newStatus === 'in-progress'
              ? 'iniciar'
              : newStatus === 'completed'
              ? 'completar'
              : 'mover',
        });
        setDraggedTask(null);
        return;
      }
      onUpdateTask(draggedTask, { status: newStatus });
      setDraggedTask(null);
    }
  };

  // Stats for mini cards
  const stats = {
    overdueTasks: overdueTasks.length,
    dueTodayTasks: dueTodayTasks.length,
    inProgressTasks: inProgressTasks.length,
    completedTasks: completedTasks.length,
    totalPoints: myTasks
      .filter((t) => t.status !== 'completed')
      .reduce((sum, task) => sum + task.points, 0),
  };

  // Hacer scroll a la tarea resaltada cuando se recibe highlightedTaskId
  useEffect(() => {
    if (highlightedTaskId && highlightedTaskId.length > 0) {
      const timer = setTimeout(() => {
        const taskElement = document.querySelector(`[data-task-id="${highlightedTaskId[0]}"]`);
        if (taskElement) {
          taskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        // Limpiar el resaltado después de 3 segundos
        const clearTimer = setTimeout(() => {
          onClearHighlight?.();
        }, 3000);
        return () => clearTimeout(clearTimer);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [highlightedTaskId, onClearHighlight]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Mis Tareas Asignadas</h2>
            <p className="text-sm text-muted-foreground">Gestiona tus tareas personales</p>
          </div>
          <button
            onClick={() => {
              // Navegar a la sección de Tareas con el formulario abierto
              if (onEditTask) {
                // Crear una tarea vacía para abrir el formulario
                const emptyTask: Task = {
                  id: '',
                  title: '',
                  description: '',
                  assignedTo: selectedMemberId,
                  dueDate: '',
                  points: 10,
                  urgency: 'medium',
                  status: 'pending',
                  category: 'otros',
                  createdAt: new Date().toISOString(),
                  // isRecurring: false, // Eliminado: no existe en Task
                  // recurringDays: [], // Eliminado: no existe en Task
                  type: '',
                  recurrence: 'puntual',
                  comments: [],
                };
                onEditTask(emptyTask);
              }
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover hover:scale-105 hover:shadow-lg transition-all duration-200 shadow-md"
          >
            <Plus className="w-4 h-4" />
            Nueva Tarea
          </button>
        </div>
      </div>

      {/* Stats Mini Cards */}
      <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {/* Atrasadas */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-danger/10 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-danger" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Atrasadas</p>
              <p className="text-lg font-bold text-danger">{stats.overdueTasks}</p>
            </div>
          </div>
          {/* Hoy */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Hoy</p>
              <p className="text-lg font-bold text-warning">{stats.dueTodayTasks}</p>
            </div>
          </div>
          {/* En Progreso */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">En Progreso</p>
              <p className="text-lg font-bold text-info">{stats.inProgressTasks}</p>
            </div>
          </div>
          {/* Completadas */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Completadas</p>
              <p className="text-lg font-bold text-success">{stats.completedTasks}</p>
            </div>
          </div>
          {/* Puntos restantes */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-xp/10 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-xp" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Puntos Restantes</p>
              <p className="text-lg font-bold text-xp">{stats.totalPoints}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section - Compact Badges */}
      {(overdueTasks.length > 0 ||
        unassignedOverdueTasks.length > 0 ||
        unassignedPendingTasks.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {/* User's Overdue Tasks */}
          {overdueTasks.length > 0 && (
            <button
              onClick={() => onScrollToMyOverdue?.()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-danger/10 border border-danger/30 text-danger hover:bg-danger/20 hover:scale-105 transition-all cursor-pointer"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="text-sm font-semibold whitespace-nowrap">
                Tus tareas atrasadas: {overdueTasks.length}
              </span>
            </button>
          )}

          {/* Overdue Unassigned Tasks */}
          {unassignedOverdueTasks.length > 0 && (
            <button
              onClick={() => onNavigateToTasks?.('overdue-unassigned')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-danger/10 border border-danger/30 text-danger hover:bg-danger/20 hover:scale-105 transition-all cursor-pointer"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="text-sm font-semibold whitespace-nowrap">
                Atrasadas sin asignar: {unassignedOverdueTasks.length}
              </span>
            </button>
          )}

          {/* Available Unassigned Tasks */}
          {unassignedPendingTasks.length > 0 && (
            <button
              onClick={() => onNavigateToTasks?.('unassigned')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-warning/10 border border-warning/30 text-warning hover:bg-warning/20 hover:scale-105 transition-all cursor-pointer"
            >
              <Info className="w-4 h-4 shrink-0" />
              <span className="text-sm font-semibold whitespace-nowrap">
                Tareas sin asignar: {unassignedPendingTasks.length}
              </span>
            </button>
          )}
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-card rounded-xl p-4 shadow-sm border border-border space-y-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar tareas por título o descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Filters and Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Categoría</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              title="Filtrar por categoría"
              className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Todas</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <ArrowUpDown className="w-3 h-3" />
              Ordenar por
            </label>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'date' | 'priority' | 'points' | 'category')
              }
              title="Ordenar tareas"
              className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="date">Fecha</option>
              <option value="priority">Prioridad</option>
              <option value="points">Puntos</option>
              <option value="category">Categoría</option>
            </select>
          </div>
        </div>

        {/* Results Counter and Clear Filters */}
        <div className="flex items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span>
              {sortedTasks.length}{' '}
              {sortedTasks.length === 1 ? 'tarea encontrada' : 'tareas encontradas'}
            </span>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
              setSortBy('date');
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg hover:bg-destructive/20 hover:border-destructive/50 transition-colors text-sm"
          >
            <X className="w-4 h-4" />
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* View Toggle - Subtle */}
      <div className="px-2 py-2 flex items-center justify-between gap-1">
        <h3 className="text-lg font-semibold text-foreground">Mis Tareas</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setViewMode('kanban')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'kanban'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Vista Kanban"
          >
            <Columns3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'list'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Vista de lista"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Task Views */}
      <div className="space-y-3">
        {sortedTasks.length === 0 ? (
          <div className="bg-card rounded-xl p-12 shadow-sm border border-border text-center">
            <p className="text-muted-foreground">No hay tareas que coincidan con los filtros</p>
          </div>
        ) : viewMode === 'kanban' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Pending Column */}
            <div
              className="bg-card rounded-xl p-4 border border-border min-h-100"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop('pending')}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-warning"></div>
                <h3 className="font-semibold text-foreground">Pendientes</h3>
                <span className="ml-auto text-sm text-muted-foreground">{pendingTasks.length}</span>
                {(() => {
                  const overdueInPending = pendingTasks.filter((t) => t.dueDate < today).length;
                  if (overdueInPending > 0) {
                    return (
                      <span className="ml-1 px-1.5 py-0.5 bg-danger/20 text-danger text-xs font-semibold rounded">
                        {overdueInPending} ⚠️
                      </span>
                    );
                  }
                  return null;
                })()}
              </div>
              <div className="space-y-3">
                {pendingTasks.map((task) => {
                  const isOverdue = task.dueDate < today;
                  const daysOverdue = isOverdue
                    ? Math.abs(
                        Math.floor(
                          (new Date(task.dueDate).getTime() - new Date(today).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )
                      )
                    : 0;
                  const isHighlighted = highlightedTaskId?.includes(task.id);

                  return (
                    <div
                      key={task.id}
                      data-task-id={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task.id)}
                      className={`rounded-lg p-3 shadow-sm hover:shadow-md transition-all cursor-move ${
                        isHighlighted
                          ? 'ring-4 ring-primary border-2 border-primary bg-primary/20 shadow-lg shadow-primary/50 animate-pulse'
                          : isOverdue
                          ? 'bg-danger/10 border-2 border-danger/50'
                          : 'bg-warning/5 border-2 border-warning/30'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-foreground font-medium flex-1">{task.title}</h4>
                        <div className="flex gap-1 ml-2">
                          {isOverdue && (
                            <span className="text-xs bg-danger/20 text-danger px-1.5 py-0.5 rounded whitespace-nowrap font-semibold">
                              ⚠️ ATRASADA
                            </span>
                          )}
                          {task.recurrence && task.recurrence !== 'puntual' ? (
                            <span className="text-xs bg-success/20 text-success px-1.5 py-0.5 rounded whitespace-nowrap">
                              🔄 {task.recurrence}
                            </span>
                          ) : (
                            !isOverdue && (
                              <span className="text-xs bg-muted/50 text-muted-foreground px-1.5 py-0.5 rounded whitespace-nowrap">
                                ⏺ puntual
                              </span>
                            )
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {task.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {(() => {
                          const catConfig = getCategoryConfig(task.category);
                          const catClasses = getCategoryClasses(task.category);
                          const CatIcon = catConfig.icon;
                          return (
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${catClasses.badge}`}
                            >
                              <CatIcon className="w-3 h-3" />
                              {task.category}
                            </span>
                          );
                        })()}
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-xp/10 text-xp rounded text-xs">
                          <Star className="w-3 h-3" />
                          {task.points} pts
                        </span>
                        {(() => {
                          const urgencyConfig = {
                            high: { color: 'bg-danger/20 text-danger', label: 'Alta' },
                            medium: { color: 'bg-warning/20 text-warning', label: 'Media' },
                            low: { color: 'bg-success/20 text-success', label: 'Baja' },
                          };
                          const config = urgencyConfig[task.urgency];
                          return (
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${config.color}`}
                            >
                              <AlertCircle className="w-3 h-3" />
                              {config.label}
                            </span>
                          );
                        })()}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 pb-3 border-t border-border pt-3">
                        <span
                          className={`flex items-center gap-1 ${
                            isOverdue ? 'text-danger font-semibold' : ''
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          {isOverdue
                            ? daysOverdue === 0
                              ? 'Vencida hoy'
                              : daysOverdue === 1
                              ? 'Hace 1 día'
                              : `Hace ${daysOverdue} días`
                            : `Vence: ${new Date(task.dueDate).toLocaleDateString('es-ES')}`}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {selectedMember.name}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (!task.assignedTo) {
                              setUnassignedTaskDialog({
                                open: true,
                                task: task,
                                intendedAction: 'iniciar',
                              });
                              return;
                            }
                            onUpdateTask(task.id, { status: 'in-progress' });
                          }}
                          className="flex-1 text-xs px-2 py-1 bg-info/10 text-info border border-info/30 rounded hover:bg-info/20 transition-colors"
                        >
                          Iniciar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* In Progress Column */}
            <div
              className="bg-card rounded-xl p-4 border border-border min-h-100"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop('in-progress')}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-info"></div>
                <h3 className="font-semibold text-foreground">En Progreso</h3>
                <span className="ml-auto text-sm text-muted-foreground">
                  {inProgressTasks.length}
                </span>
                {(() => {
                  const overdueInProgress = inProgressTasks.filter((t) => t.dueDate < today).length;
                  if (overdueInProgress > 0) {
                    return (
                      <span className="ml-1 px-1.5 py-0.5 bg-danger/20 text-danger text-xs font-semibold rounded">
                        {overdueInProgress} ⚠️
                      </span>
                    );
                  }
                  return null;
                })()}
              </div>
              <div className="space-y-3">
                {inProgressTasks.map((task) => {
                  const isOverdue = task.dueDate < today;
                  const daysOverdue = isOverdue
                    ? Math.abs(
                        Math.floor(
                          (new Date(task.dueDate).getTime() - new Date(today).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )
                      )
                    : 0;
                  const isHighlighted = highlightedTaskId?.includes(task.id);

                  return (
                    <div
                      key={task.id}
                      data-task-id={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task.id)}
                      className={`rounded-lg p-3 shadow-sm hover:shadow-md transition-all cursor-move ${
                        isHighlighted
                          ? 'ring-4 ring-primary border-2 border-primary bg-primary/20 shadow-lg shadow-primary/50 animate-pulse'
                          : isOverdue
                          ? 'bg-danger/10 border-2 border-danger/50'
                          : 'bg-info/5 border-2 border-info/30'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-foreground font-medium flex-1">{task.title}</h4>
                        <div className="flex gap-1 ml-2">
                          {isOverdue && (
                            <span className="text-xs bg-danger/20 text-danger px-1.5 py-0.5 rounded whitespace-nowrap font-semibold">
                              ⚠️ ATRASADA
                            </span>
                          )}
                          {task.recurrence && task.recurrence !== 'puntual' ? (
                            <span className="text-xs bg-success/20 text-success px-1.5 py-0.5 rounded whitespace-nowrap">
                              🔄 {task.recurrence}
                            </span>
                          ) : (
                            !isOverdue && (
                              <span className="text-xs bg-muted/50 text-muted-foreground px-1.5 py-0.5 rounded whitespace-nowrap">
                                ⏺ puntual
                              </span>
                            )
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {task.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {(() => {
                          const catConfig = getCategoryConfig(task.category);
                          const catClasses = getCategoryClasses(task.category);
                          const CatIcon = catConfig.icon;
                          return (
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${catClasses.badge}`}
                            >
                              <CatIcon className="w-3 h-3" />
                              {task.category}
                            </span>
                          );
                        })()}
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-xp/10 text-xp rounded text-xs">
                          <Star className="w-3 h-3" />
                          {task.points} pts
                        </span>
                        {(() => {
                          const urgencyConfig = {
                            high: { color: 'bg-danger/20 text-danger', label: 'Alta' },
                            medium: { color: 'bg-warning/20 text-warning', label: 'Media' },
                            low: { color: 'bg-success/20 text-success', label: 'Baja' },
                          };
                          const config = urgencyConfig[task.urgency];
                          return (
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${config.color}`}
                            >
                              <AlertCircle className="w-3 h-3" />
                              {config.label}
                            </span>
                          );
                        })()}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 pb-3 border-t border-border pt-3">
                        <span
                          className={`flex items-center gap-1 ${
                            isOverdue ? 'text-danger font-semibold' : ''
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          {isOverdue
                            ? daysOverdue === 0
                              ? 'Vencida hoy'
                              : daysOverdue === 1
                              ? 'Hace 1 día'
                              : `Hace ${daysOverdue} días`
                            : `Vence: ${new Date(task.dueDate).toLocaleDateString('es-ES')}`}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {selectedMember.name}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (!task.assignedTo) {
                              setUnassignedTaskDialog({
                                open: true,
                                task: task,
                                intendedAction: 'completar',
                              });
                              return;
                            }
                            onUpdateTask(task.id, { status: 'completed' });
                          }}
                          className="flex-1 text-xs px-2 py-1 bg-success/10 text-success border border-success/30 rounded hover:bg-success/20 transition-colors font-semibold"
                        >
                          ✓ Completar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Completed Column */}
            <div
              className="bg-card rounded-xl p-4 border border-border min-h-100"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop('completed')}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                <h3 className="font-semibold text-foreground">Completadas</h3>
                <span className="ml-auto text-sm text-muted-foreground">
                  {completedTasks.length}
                </span>
              </div>
              <div className="space-y-3">
                {completedTasks.map((task) => {
                  const isHighlighted = highlightedTaskId?.includes(task.id);
                  return (
                    <div
                      key={task.id}
                      data-task-id={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task.id)}
                      className={`rounded-lg p-3 shadow-sm hover:shadow-md transition-all cursor-move ${
                        isHighlighted
                          ? 'ring-4 ring-primary border-2 border-primary bg-primary/20 shadow-lg shadow-primary/50 animate-pulse'
                          : 'bg-success/5 border-2 border-success/30'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-foreground font-medium flex-1">{task.title}</h4>
                        <div className="flex gap-1 ml-2">
                          {task.recurrence && task.recurrence !== 'puntual' ? (
                            <span className="text-xs bg-success/20 text-success px-1.5 py-0.5 rounded whitespace-nowrap">
                              🔄 {task.recurrence}
                            </span>
                          ) : (
                            <span className="text-xs bg-muted/50 text-muted-foreground px-1.5 py-0.5 rounded whitespace-nowrap">
                              ⏺ puntual
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {task.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {(() => {
                          const catConfig = getCategoryConfig(task.category);
                          const catClasses = getCategoryClasses(task.category);
                          const CatIcon = catConfig.icon;
                          return (
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${catClasses.badge}`}
                            >
                              <CatIcon className="w-3 h-3" />
                              {task.category}
                            </span>
                          );
                        })()}
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-xp/10 text-xp rounded text-xs">
                          <Star className="w-3 h-3" />
                          {task.points} pts
                        </span>
                        {(() => {
                          const urgencyConfig = {
                            high: { color: 'bg-danger/20 text-danger', label: 'Alta' },
                            medium: { color: 'bg-warning/20 text-warning', label: 'Media' },
                            low: { color: 'bg-success/20 text-success', label: 'Baja' },
                          };
                          const config = urgencyConfig[task.urgency];
                          return (
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${config.color}`}
                            >
                              <AlertCircle className="w-3 h-3" />
                              {config.label}
                            </span>
                          );
                        })()}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 pb-3 border-t border-border pt-3">
                        <span className="flex items-center gap-1 text-success">
                          <CheckCircle2 className="w-3 h-3" />
                          Completada
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {selectedMember.name}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onUpdateTask(task.id, { status: 'pending' })}
                          className="flex-1 text-xs px-2 py-1 bg-warning/10 text-warning border border-warning/30 rounded hover:bg-warning/20 transition-colors"
                        >
                          Reabrir
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* List/Table View */
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="text-left p-3 text-sm font-semibold text-foreground">Tarea</th>
                    <th className="text-left p-3 text-sm font-semibold text-foreground">
                      Categoría
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-foreground">
                      Recurrencia
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-foreground">Estado</th>
                    <th className="text-left p-3 text-sm font-semibold text-foreground">Fecha</th>
                    <th className="text-left p-3 text-sm font-semibold text-foreground">Puntos</th>
                    <th className="text-center p-3 text-sm font-semibold text-foreground">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sortedTasks.map((task) => {
                    const isOverdue = task.dueDate < today && task.status !== 'completed';
                    const isHighlighted = highlightedTaskId?.includes(task.id);

                    return (
                      <tr
                        key={task.id}
                        data-task-id={task.id}
                        className={`hover:bg-muted/50 transition-colors ${
                          isHighlighted
                            ? 'ring-4 ring-primary border-2 border-primary bg-primary/20 shadow-lg shadow-primary/50 animate-pulse'
                            : isOverdue
                            ? 'bg-danger/5'
                            : task.status === 'completed'
                            ? 'bg-success/5'
                            : task.status === 'in-progress'
                            ? 'bg-info/5'
                            : ''
                        }`}
                      >
                        <td className="p-3">
                          <div className="font-medium text-foreground">{task.title}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {task.description}
                          </div>
                        </td>
                        <td className="p-3">
                          {(() => {
                            const catConfig = getCategoryConfig(task.category);
                            const catClasses = getCategoryClasses(task.category);
                            const CatIcon = catConfig.icon;
                            return (
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${catClasses.badge}`}
                              >
                                <CatIcon className="w-3 h-3" />
                                {task.category}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="p-3">
                          {task.recurrence && task.recurrence !== 'puntual' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-success/10 text-success rounded text-xs font-medium">
                              🔄 {task.recurrence}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted/50 text-muted-foreground rounded text-xs">
                              ⏺ puntual
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                              task.status === 'pending'
                                ? 'bg-warning/10 text-warning border border-warning/20'
                                : task.status === 'in-progress'
                                ? 'bg-info/10 text-info border border-info/20'
                                : 'bg-success/10 text-success border border-success/20'
                            }`}
                          >
                            {task.status === 'pending'
                              ? 'Pendiente'
                              : task.status === 'in-progress'
                              ? 'En progreso'
                              : 'Completada'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`text-xs ${
                              isOverdue ? 'text-danger font-semibold' : 'text-muted-foreground'
                            }`}
                          >
                            {new Date(task.dueDate).toLocaleDateString('es-ES')}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-xp/10 text-xp rounded text-xs">
                            <Star className="w-3 h-3" />
                            {task.points}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-2">
                            {task.status !== 'completed' && (
                              <button
                                onClick={() => {
                                  if (!task.assignedTo) {
                                    setUnassignedTaskDialog({
                                      open: true,
                                      task: task,
                                      intendedAction: 'completar',
                                    });
                                    return;
                                  }
                                  onUpdateTask(task.id, { status: 'completed' });
                                }}
                                className="p-1.5 text-success hover:bg-success/10 rounded transition-colors"
                                title="Completar tarea"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}
                            {onEditTask && (
                              <button
                                onClick={() => onEditTask(task)}
                                className="p-1.5 text-foreground hover:bg-muted rounded transition-colors"
                                title="Editar"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                            {onDeleteTask && (
                              <button
                                onClick={() => onDeleteTask(task.id)}
                                className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Dialog para tareas sin asignar */}
      {unassignedTaskDialog.open && unassignedTaskDialog.task && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-warning" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">Tarea sin asignar</h3>
                <p className="text-sm text-muted-foreground">
                  Esta tarea no tiene ningún miembro asignado
                </p>
              </div>
              <button
                onClick={() =>
                  setUnassignedTaskDialog({ open: false, task: null, intendedAction: '' })
                }
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Cerrar diálogo"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Task info */}
            <div className="bg-muted/50 rounded-lg p-3 mb-4">
              <p className="font-medium text-foreground mb-1">{unassignedTaskDialog.task.title}</p>
              {unassignedTaskDialog.task.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {unassignedTaskDialog.task.description}
                </p>
              )}
            </div>

            {/* Message */}
            <p className="text-sm text-muted-foreground mb-4">
              Para poder {unassignedTaskDialog.intendedAction} esta tarea, primero debes asignarla a
              un miembro del equipo.
            </p>

            {/* Actions */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground mb-2">Asignar a:</p>
              <div className="grid grid-cols-2 gap-2">
                {members.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => {
                      onUpdateTask(unassignedTaskDialog.task!.id, { assignedTo: member.id });
                      setUnassignedTaskDialog({ open: false, task: null, intendedAction: '' });
                    }}
                    className="px-3 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-sm flex items-center gap-2"
                  >
                    <span>{member.avatar}</span>
                    <span className="text-foreground font-medium">{member.name}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() =>
                  setUnassignedTaskDialog({ open: false, task: null, intendedAction: '' })
                }
                className="w-full mt-4 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

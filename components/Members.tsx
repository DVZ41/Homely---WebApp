/**
 * ============================================================================
 * MEMBERS.TSX - GESTIÓN DE MIEMBROS DEL HOGAR
 * ============================================================================
 * 
 * Componente para añadir, editar y eliminar miembros de la familia.
 * 
 * FUNCIONALIDADES:
 * - Formulario de creación/edición con avatar y color
 * - Selección de avatar mediante emojis
 * - Selección de color personalizado
 * - Vista de tarjetas con puntos y nivel
 * 
 * PERSONALIZACIÓN DE COLORES DE MIEMBRO:
 * Cada miembro tiene un color único que se usa para:
 * - Indicador en tarjetas de tareas
 * - Avatar con fondo de color
 * - Diferenciación visual en gráficos
 * 
 * colorOptions define los colores disponibles:
 * - Colores corporativos: #28AC71 (primary), #E76F51 (accent), #605669 (secondary)
 * - Colores adicionales para diferenciación
 * 
 * PARA AÑADIR MÁS COLORES:
 * Añade nuevos valores hexadecimales al array colorOptions
 * 
 * @param members - Lista de miembros actuales
 * @param onAddMember - Callback para crear miembro
 * @param onUpdateMember - Callback para actualizar miembro
 * @param onDeleteMember - Callback para eliminar miembro
 */

import { useState, useMemo } from 'react';
import { Member, Task, Badge } from '../App';
import { Plus, Edit2, Trash2, Award, Star, Zap, CheckCircle2, Clock } from 'lucide-react';

// Lista de badges para mostrar iconos (sincronizada con Achievements.tsx)
const ALL_BADGES: Badge[] = [
  { id: 'level_10', name: 'Aprendiz del Hogar', icon: '🌱', description: 'Alcanza el nivel 10', condition: 'Nivel 10', rarity: 'common' },
  { id: 'level_20', name: 'Colaborador Dedicado', icon: '🏠', description: 'Alcanza el nivel 20', condition: 'Nivel 20', rarity: 'rare' },
  { id: 'level_30', name: 'Experto Doméstico', icon: '⭐', description: 'Alcanza el nivel 30', condition: 'Nivel 30', rarity: 'rare' },
  { id: 'level_40', name: 'Maestro de Casa', icon: '🏆', description: 'Alcanza el nivel 40', condition: 'Nivel 40', rarity: 'epic' },
  { id: 'level_50', name: 'Leyenda del Hogar', icon: '👑', description: 'Alcanza el nivel 50', condition: 'Nivel 50', rarity: 'epic' },
  { id: 'first_task', name: 'Primer Paso', icon: '✅', description: 'Completa tu primera tarea', condition: 'Completar 1 tarea', rarity: 'common' },
  { id: 'tasks_10', name: 'Buen Comienzo', icon: '🎯', description: 'Completa 10 tareas', condition: '10 tareas completadas', rarity: 'common' },
  { id: 'tasks_50', name: 'Trabajador Constante', icon: '🔵', description: 'Completa 50 tareas', condition: '50 tareas completadas', rarity: 'rare' },
  { id: 'tasks_200', name: 'Máquina Imparable', icon: '💜', description: 'Completa 200 tareas', condition: '200 tareas completadas', rarity: 'epic' },
  { id: 'points_100', name: 'Centenario', icon: '💯', description: 'Acumula 100 puntos', condition: '100 puntos', rarity: 'common' },
  { id: 'points_500', name: 'Millonario en Puntos', icon: '💎', description: 'Acumula 500 puntos', condition: '500 puntos', rarity: 'rare' },
  { id: 'streak_3', name: 'Racha de 3', icon: '🔥', description: '3 días consecutivos', condition: 'Racha de 3 días', rarity: 'common' },
  { id: 'streak_7', name: 'Semana Perfecta', icon: '🔥', description: '7 días consecutivos', condition: 'Racha de 7 días', rarity: 'rare' },
];
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

type MembersProps = {
  members: Member[];
  tasks: Task[];
  onAddMember: (member: Pick<Member, 'name' | 'avatar' | 'color'>) => void;
  onUpdateMember: (id: string, updates: Partial<Member>) => void;
  onDeleteMember: (id: string) => void;
};

const avatarOptions = ['👨', '👩', '👦', '👧', '👴', '👵', '🧑', '👨‍💼', '👩‍💼', '👨‍🎓', '👩‍🎓', '🧔', '👱‍♀️', '👱‍♂️'];
const colorOptions = [
  '#28AC71', '#29541F', '#E76F51', '#605669', 
  '#322B38', '#50E3C2', '#FF5733', '#C70039',
  '#900C3F', '#581845', '#FFC300', '#DAF7A6'
];

export function Members({ members, tasks, onAddMember, onUpdateMember, onDeleteMember }: MembersProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    avatar: '👨',
    color: '#28AC71',
  });

  // Memoizar lista ordenada de miembros
  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => b.points - a.points);
  }, [members]);

  // Calcular insights automáticos
  const insights = useMemo(() => {
    if (members.length === 0) return null;

    const topPerformer = sortedMembers[0];
    const totalPoints = members.reduce((sum, m) => sum + m.points, 0);
    const avgPoints = Math.round(totalPoints / members.length);
    const highestLevel = Math.max(...members.map(m => m.level));
    const topLevelMembers = members.filter(m => m.level === highestLevel);
    
    // Calcular tareas completadas del líder
    const topPerformerCompletedTasks = tasks.filter(
      t => t.assignedTo === topPerformer.id && t.status === 'completed'
    ).length;

    return {
      topPerformer,
      topPerformerCompletedTasks,
      avgPoints,
      totalPoints,
      highestLevel,
      topLevelMembers: topLevelMembers.length,
    };
  }, [members, sortedMembers, tasks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar nombre duplicado
    const nameTrimmed = formData.name.trim();
    if (!nameTrimmed) {
      alert('El nombre no puede estar vacío');
      return;
    }

    const isDuplicate = members.some(
      m => m.name.toLowerCase() === nameTrimmed.toLowerCase() && m.id !== editingId
    );

    if (isDuplicate) {
      alert('Ya existe un miembro con ese nombre');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingId) {
        onUpdateMember(editingId, { ...formData, name: nameTrimmed });
        setEditingId(null);
      } else {
        onAddMember({ ...formData, name: nameTrimmed });
        setIsAdding(false);
      }

      setFormData({
        name: '',
        avatar: '👨',
        color: '#28AC71',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (member: Member) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      avatar: member.avatar,
      color: member.color,
    });
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      name: '',
      avatar: '👨',
      color: '#28AC71',
    });
  };

  const handleDeleteClick = (id: string) => {
    setMemberToDelete(id);
    setIsDeleting(true);
  };

  const confirmDelete = () => {
    if (memberToDelete) {
      onDeleteMember(memberToDelete);
      setMemberToDelete(null);
    }
    setIsDeleting(false);
  };

  const cancelDelete = () => {
    setMemberToDelete(null);
    setIsDeleting(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Miembros del Hogar</h2>
            <p className="text-sm text-muted-foreground">Gestiona quién participa en las tareas</p>
          </div>
          <button
          onClick={() => setIsAdding(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover hover:scale-105 hover:shadow-lg transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Añadir Miembro
        </button>
        </div>
      </div>

      {/* Líder Destacado */}
      {members.length > 0 && insights && (
        <div className="bg-linear-to-br from-accent/10 via-primary/5 to-accent/10 rounded-2xl p-5 border border-accent/20 shadow-sm">
          <div className="flex items-center justify-between">
            {/* Avatar y nombre */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-3xl shadow-md" 
                  style={{ backgroundColor: insights.topPerformer.color }}
                >
                  {insights.topPerformer.avatar}
                </div>
                <div className="absolute -top-1 -right-1 text-2xl">🥇</div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{insights.topPerformer.name}</h3>
                <p className="text-sm text-muted-foreground">Liderando el hogar</p>
              </div>
            </div>

            {/* Métricas */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-1.5 mb-1">
                  <Star className="w-4 h-4" style={{ color: 'var(--xp)' }} />
                  <span className="text-2xl font-bold text-foreground">{insights.topPerformer.points}</span>
                </div>
                <p className="text-xs text-muted-foreground">Puntos</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-2xl font-bold text-foreground">{insights.topPerformerCompletedTasks}</span>
                </div>
                <p className="text-xs text-muted-foreground">Tareas</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap className="w-4 h-4" style={{ color: 'var(--xp)' }} />
                  <span className="text-2xl font-bold text-foreground">{insights.topPerformer.level}</span>
                </div>
                <p className="text-xs text-muted-foreground">Nivel</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                  <span className="text-2xl font-bold text-foreground">{insights.topPerformer.experience}</span>
                </div>
                <p className="text-xs text-muted-foreground">XP</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form - Centered Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-background/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="border-b border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {editingId ? 'Editar Miembro' : 'Nuevo Miembro'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {editingId ? 'Modifica los datos del miembro' : 'Añade un nuevo miembro al hogar'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    setFormData({ name: '', avatar: '👤', color: '#28AC71' });
                  }}
                  className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                  title="Cerrar"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Nombre *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ej: Ana"
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">Avatar</label>
              <div className="grid grid-cols-6 sm:grid-cols-7 gap-2">
                {avatarOptions.map(avatar => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar })}
                    className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl border-2 transition-all ${
                      formData.avatar === avatar
                        ? 'border-primary bg-primary/10 scale-110'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">Color</label>
              <div className="grid grid-cols-6 gap-2">
                {colorOptions.map(color => (
                  <button
                    key={color}
                    type="button"
                    title={`Seleccionar color ${color}`}
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-12 h-12 rounded-lg border-2 transition-all ${
                      formData.color === color
                        ? 'border-foreground scale-110'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover hover:scale-105 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                {isSubmitting ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Añadir miembro'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
            </div>
          </div>
        </div>
      )}

      {/* Members Grid */}
      {members.length === 0 ? (
        <div className="bg-card rounded-xl p-12 shadow-sm border border-border text-center">
          <p className="text-muted-foreground">No hay miembros aún. ¡Añade el primero!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedMembers.map((member, index) => (
            <div
              key={member.id}
              className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              {/* Ranking Badge */}
              {index < 3 && (
                <div className="flex justify-end mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    index === 0 ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20' :
                    index === 1 ? 'bg-gray-400/10 text-gray-600 dark:text-gray-400 border border-gray-400/20' :
                    'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20'
                  }`}>
                    {index === 0 ? '🥇 1er lugar' : index === 1 ? '🥈 2do lugar' : '🥉 3er lugar'}
                  </span>
                </div>
              )}

              <div className="flex flex-col items-center text-center mb-4">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl mb-3"
                  style={{ backgroundColor: member.color }}
                >
                  <span>{member.avatar}</span>
                </div>
                <h3 className="text-foreground mb-1">{member.name}</h3>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-center gap-1 text-xp">
                    <Star className="w-4 h-4" />
                    <span className="font-medium">{member.points} puntos</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-xp" />
                      <span>Nivel {member.level}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-accent" />
                      <span>{member.experience} XP</span>
                    </div>
                  </div>
                  {/* Logros - estilo sutil debajo de nivel/XP */}
                  {member.badges && member.badges.length > 0 && (
                    <div className="flex items-center justify-center gap-1.5 text-xs pt-1">
                      <Award className="w-3 h-3 text-yellow-500" />
                      <span className="text-yellow-500">{member.badges.length} logros</span>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex gap-0.5">
                        {member.badges.slice(-3).reverse().map(badgeId => {
                          const badge = ALL_BADGES.find(b => b.id === badgeId);
                          return badge ? (
                            <span key={badgeId} title={badge.name} className="text-xs">
                              {badge.icon}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Estadísticas de tareas */}
              {(() => {
                const memberTasks = tasks.filter(t => t.assignedTo === member.id);
                const completedTasks = memberTasks.filter(t => t.status === 'completed').length;
                const pendingTasks = memberTasks.filter(t => t.status !== 'completed').length;
                
                return (
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-primary/10">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      <span className="text-sm font-medium text-primary">{completedTasks}</span>
                      <span className="text-[10px] text-muted-foreground">completadas</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-warning/10">
                      <Clock className="w-3.5 h-3.5 text-warning" />
                      <span className="text-sm font-medium text-warning">{pendingTasks}</span>
                      <span className="text-[10px] text-muted-foreground">pendientes</span>
                    </div>
                  </div>
                );
              })()}

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(member)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors text-sm"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteClick(member.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-destructive/30 text-destructive rounded-lg hover:bg-destructive/10 transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar miembro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Las tareas asignadas a este miembro quedarán sin asignar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
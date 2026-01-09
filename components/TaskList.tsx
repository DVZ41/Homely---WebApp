/**
 * ============================================================================
 * TASKLIST.TSX - GESTIÓN DE TAREAS
 * ============================================================================
 * 
 * Componente para crear, editar, filtrar y eliminar tareas.
 * 
 * FUNCIONALIDADES:
 * - Formulario de creación/edición de tareas
 * - Filtros por estado (pendiente, en progreso, completada)
 * - Filtros por miembro asignado
 * - Vista de tarjetas con indicadores de urgencia
 * 
 * INDICADORES DE URGENCIA (colores):
 * - Alta: border-l-4 border-red-500, bg-red-50
 * - Media: border-l-4 border-yellow-500, bg-yellow-50  
 * - Baja: border-l-4 border-green-500, bg-green-50
 * 
 * COLORES DE ESTADO:
 * - Pendiente: bg-amber-100 text-amber-700
 * - En progreso: bg-blue-100 text-blue-700
 * - Completada: bg-green-100 text-green-700
 * 
 * PARA PERSONALIZAR:
 * Los colores de los miembros se muestran con style={{ backgroundColor: member.color }}
 * Estos son dinámicos y se configuran en Members.tsx
 * 
 * @param tasks - Lista de tareas a mostrar
 * @param members - Lista de miembros para asignar
 * @param onAddTask - Callback para crear nueva tarea
 * @param onUpdateTask - Callback para actualizar tarea
 * @param onDeleteTask - Callback para eliminar tarea
 */

import React, { useState, useEffect } from 'react';
import { Member, Task, TaskTemplate } from '../App';
import { Plus, Calendar, User, Star, Trash2, Edit2, CheckCircle2, AlertCircle, Repeat, Search, List, Columns3, ArrowUpDown, TrendingUp, Clock, Zap, X, ChevronDown } from 'lucide-react';
import { getCategoryConfig, getCategoryClasses } from '../lib/categoryUtils';

type TaskListProps = {
  tasks: Task[];
  members: Member[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  openCreateForm?: boolean;
  openManageRoutines?: boolean;
  taskToEdit?: Task | null;
  highlightedTaskId?: string[];
  onClearHighlight?: () => void;
  customRoutines: TaskTemplate[];
  onAddCustomRoutine: (routine: Omit<TaskTemplate, 'id'>) => void;
  onUpdateCustomRoutine: (id: string, updates: Partial<TaskTemplate>) => void;
  onDeleteCustomRoutine: (id: string) => void;
};

export function TaskList({ 
  tasks, 
  members, 
  onAddTask, 
  onUpdateTask, 
  onDeleteTask, 
  openCreateForm = false,
  openManageRoutines = false,
  taskToEdit = null,
  highlightedTaskId = [],
  onClearHighlight,
  customRoutines,
  onAddCustomRoutine,
  onUpdateCustomRoutine,
  onDeleteCustomRoutine
}: TaskListProps) {
  const [isAddingTask, setIsAddingTask] = useState(openCreateForm);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in-progress' | 'completed' | 'overdue'>('all');
  const [filterMember, setFilterMember] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'points' | 'category'>('date');
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [showRoutines, setShowRoutines] = useState(false);
  const [showManageRoutines, setShowManageRoutines] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [assigningTask, setAssigningTask] = useState<string | null>(null);
  const [editingRoutine, setEditingRoutine] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [routineFormData, setRoutineFormData] = useState({
    name: '',
    description: '',
    icon: '⚡',
    tasks: [] as Omit<Task, 'id' | 'createdAt' | 'assignedTo' | 'comments' | 'completedAt'>[],
  });
  const [unassignedTaskDialog, setUnassignedTaskDialog] = useState<{
    open: boolean;
    task: Task | null;
    intendedAction: string;
  }>({
    open: false,
    task: null,
    intendedAction: ''
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    points: 10,
    category: 'General',
    recurrence: 'puntual' as 'puntual' | 'diaria' | 'semanal' | 'mensual',
    urgency: 'medium' as 'low' | 'medium' | 'high',
    type: 'Diaria',
  });

  // Sincronizar modal con prop openCreateForm
  useEffect(() => {
    setIsAddingTask(openCreateForm ?? false);
  }, [openCreateForm]);

  // Sincronizar modal de gestionar rutinas con prop openManageRoutines
  useEffect(() => {
    if (openManageRoutines) {
      setShowManageRoutines(true);
    }
  }, [openManageRoutines]);

  // Abrir formulario de edición cuando se recibe taskToEdit
  useEffect(() => {
    if (taskToEdit) {
      setEditingTask(taskToEdit.id);
      setFormData({
        title: taskToEdit.title,
        description: taskToEdit.description,
        assignedTo: taskToEdit.assignedTo,
        dueDate: taskToEdit.dueDate,
        points: taskToEdit.points,
        category: taskToEdit.category,
        recurrence: taskToEdit.recurrence || 'puntual',
        urgency: taskToEdit.urgency || 'medium',
        type: taskToEdit.type || 'Diaria',
      });
      setIsAddingTask(true);
    }
  }, [taskToEdit]);

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

  /**
   * ============================================================================
   * NOTA: LÓGICA DE RECURRENCIA MOVIDA A App.tsx
   * ============================================================================
   * 
   * La lógica para crear tareas recurrentes automáticamente ahora se encuentra
   * en App.tsx dentro de la función updateTask(). Esto asegura que funcione
   * desde cualquier componente (TaskList, MyTasks, Dashboard, etc.).
   * 
   * El código anterior estaba aquí pero causaba problemas:
   * - Solo funcionaba cuando se completaba una tarea desde TaskList
   * - No funcionaba desde MyTasks u otros componentes
   * - Podía causar duplicados si múltiples componentes tenían la lógica
   * 
   * COMPORTAMIENTO ACTUAL:
   * - Al completar una tarea recurrente, App.tsx detecta el cambio
   * - Automáticamente crea la siguiente instancia de la tarea
   * - La nueva tarea se crea SIN ASIGNAR para rotación equitativa
   * - Funciona desde cualquier lugar de la aplicación
   */

  const categories = ['Cocina', 'Limpieza', 'Baño', 'Lavandería', 'Compras', 'Jardín', 'Mascotas', 'General'];
  const taskTypes = ['Diaria', 'Semanal', 'Mensual', 'Puntual'];

  // Plantillas predefinidas
  const templates = [
    {
      id: 'breakfast',
      name: 'Preparar desayuno',
      category: 'Cocina',
      description: 'Preparar café, tostadas o cereales. Limpiar después.',
      points: 10,
      urgency: 'low' as const,
      type: 'Diaria',
    },
    {
      id: 'dishes',
      name: 'Lavar los platos',
      category: 'Limpieza',
      description: 'Lavar platos, vasos y cubiertos. Secar y guardar.',
      points: 15,
      urgency: 'medium' as const,
      type: 'Diaria',
    },
    {
      id: 'trash',
      name: 'Sacar la basura',
      category: 'Limpieza',
      description: 'Vaciar papeleras, atar bolsas y llevar al contenedor.',
      points: 10,
      urgency: 'medium' as const,
      type: 'Diaria',
    },
    {
      id: 'bathroom',
      name: 'Limpiar el baño',
      category: 'Baño',
      description: 'Limpiar lavabo, espejo, inodoro y ducha. Reponer toallas.',
      points: 30,
      urgency: 'medium' as const,
      type: 'Semanal',
    },
    {
      id: 'laundry',
      name: 'Hacer la colada',
      category: 'Lavandería',
      description: 'Separar ropa, poner lavadora, tender o secar.',
      points: 20,
      urgency: 'medium' as const,
      type: 'Semanal',
    },
    {
      id: 'shopping',
      name: 'Hacer la compra',
      category: 'Compras',
      description: 'Revisar lista, comprar alimentos y productos necesarios.',
      points: 25,
      urgency: 'medium' as const,
      type: 'Semanal',
    },
    {
      id: 'plants',
      name: 'Regar plantas',
      category: 'Jardín',
      description: 'Regar plantas de interior y exterior según necesidades.',
      points: 10,
      urgency: 'high' as const,
      type: 'Diaria',
    },
    {
      id: 'pets',
      name: 'Pasear mascota',
      category: 'Mascotas',
      description: 'Paseo de 20-30 minutos. Llevar bolsas y agua.',
      points: 15,
      urgency: 'high' as const,
      type: 'Diaria',
    },
  ];

  // Rutinas predefinidas (múltiples tareas)
  const routines = [
    {
      id: 'morning',
      name: 'Rutina matutina',
      description: 'Tareas básicas para empezar el día',
      icon: '🌅',
      tasks: [
        { title: 'Hacer la cama', category: 'Limpieza', description: 'Estirar sábanas y colocar almohadas', points: 5, urgency: 'low' as const, type: 'Diaria' },
        { title: 'Preparar desayuno', category: 'Cocina', description: 'Preparar café, tostadas o cereales', points: 10, urgency: 'low' as const, type: 'Diaria' },
        { title: 'Dar de comer mascotas', category: 'Mascotas', description: 'Llenar cuencos de comida y agua', points: 10, urgency: 'high' as const, type: 'Diaria' },
        { title: 'Regar plantas', category: 'Jardín', description: 'Regar plantas de interior', points: 5, urgency: 'medium' as const, type: 'Diaria' },
      ],
    },
    {
      id: 'deep-clean',
      name: 'Limpieza profunda',
      description: 'Limpieza completa de la casa',
      icon: '🧹',
      tasks: [
        { title: 'Aspirar toda la casa', category: 'Limpieza', description: 'Aspirar suelos de todas las habitaciones', points: 25, urgency: 'medium' as const, type: 'Semanal' },
        { title: 'Fregar suelos', category: 'Limpieza', description: 'Fregar cocina, baños y pasillos', points: 30, urgency: 'medium' as const, type: 'Semanal' },
        { title: 'Limpiar cristales', category: 'Limpieza', description: 'Limpiar ventanas y espejos', points: 20, urgency: 'low' as const, type: 'Semanal' },
        { title: 'Limpiar el baño', category: 'Baño', description: 'Limpieza completa del baño', points: 30, urgency: 'medium' as const, type: 'Semanal' },
        { title: 'Quitar polvo', category: 'Limpieza', description: 'Quitar polvo de muebles y superficies', points: 15, urgency: 'low' as const, type: 'Semanal' },
      ],
    },
    {
      id: 'laundry-day',
      name: 'Día de colada',
      description: 'Todas las tareas de lavandería',
      icon: '👕',
      tasks: [
        { title: 'Separar ropa', category: 'Lavandería', description: 'Clasificar ropa por colores y tipos', points: 5, urgency: 'low' as const, type: 'Semanal' },
        { title: 'Poner lavadora', category: 'Lavandería', description: 'Cargar y poner lavadora', points: 10, urgency: 'medium' as const, type: 'Semanal' },
        { title: 'Tender ropa', category: 'Lavandería', description: 'Tender o meter en secadora', points: 10, urgency: 'medium' as const, type: 'Semanal' },
        { title: 'Planchar', category: 'Lavandería', description: 'Planchar ropa que lo necesite', points: 20, urgency: 'low' as const, type: 'Semanal' },
        { title: 'Doblar y guardar', category: 'Lavandería', description: 'Doblar y guardar ropa en armarios', points: 15, urgency: 'low' as const, type: 'Semanal' },
      ],
    },
    {
      id: 'weekly-prep',
      name: 'Preparación semanal',
      description: 'Organización para la semana',
      icon: '📋',
      tasks: [
        { title: 'Planificar menú semanal', category: 'Cocina', description: 'Decidir comidas de la semana', points: 15, urgency: 'medium' as const, type: 'Semanal' },
        { title: 'Hacer lista de la compra', category: 'Compras', description: 'Anotar todo lo necesario', points: 10, urgency: 'medium' as const, type: 'Semanal' },
        { title: 'Hacer la compra', category: 'Compras', description: 'Comprar alimentos y productos', points: 25, urgency: 'medium' as const, type: 'Semanal' },
        { title: 'Meal prep', category: 'Cocina', description: 'Preparar comidas para varios días', points: 35, urgency: 'low' as const, type: 'Semanal' },
      ],
    },
  ];

  // ⚠️ ELIMINADO: calculateNextRecurrenceDate duplicado - ya está definido arriba (línea ~110)
  // Ya existe un sistema de tareas recurrentes más arriba que usa esta función

  // ⚠️ ELIMINADO: Este useEffect estaba duplicado con el anterior (línea 117)
  // Ya existe un sistema de tareas recurrentes más arriba que hace lo mismo

  const handleTaskCompletion = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Validar que la tarea esté asignada
    if (!task.assignedTo || task.assignedTo === '') {
      setUnassignedTaskDialog({ 
        open: true, 
        task, 
        intendedAction: 'complete' 
      });
      return;
    }
    
    onUpdateTask(taskId, { status: 'completed', completedAt: new Date().toISOString() });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTask) {
      onUpdateTask(editingTask, {
        ...formData,
        status: tasks.find(t => t.id === editingTask)?.status || 'pending',
      });
      setEditingTask(null);
      setIsAddingTask(false);
    } else {
      onAddTask({
        ...formData,
        status: 'pending',
        comments: [],
      });
      setIsAddingTask(false);
    }

    setFormData({
      title: '',
      description: '',
      assignedTo: '',
      dueDate: '',
      points: 10,
      category: 'General',
      recurrence: 'puntual',
      urgency: 'medium',
      type: 'Diaria',
    });
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task.id);
    setFormData({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo,
      dueDate: task.dueDate,
      points: task.points,
      category: task.category,
      recurrence: task.recurrence || 'puntual',
      urgency: task.urgency || 'medium',
      type: task.type || 'Diaria',
    });
    setIsAddingTask(true);
  };

  const handleCancel = () => {
    setIsAddingTask(false);
    setEditingTask(null);
    setSelectedTemplate('');
    setFormData({
      title: '',
      description: '',
      assignedTo: '',
      dueDate: '',
      points: 10,
      category: 'General',
      recurrence: 'puntual',
      urgency: 'medium',
      type: 'Diaria',
    });
  };

  // Cargar plantilla seleccionada
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (templateId === '') {
      setFormData({
        title: '',
        description: '',
        assignedTo: '',
        dueDate: '',
        points: 10,
        category: 'General',
        recurrence: 'puntual',
        urgency: 'medium',
        type: 'Diaria',
      });
      return;
    }

    const template = templates.find(t => t.id === templateId);
    if (template) {
      setFormData({
        title: template.name,
        description: template.description,
        assignedTo: '',
        dueDate: new Date().toISOString().split('T')[0],
        points: template.points,
        category: template.category,
        recurrence: 'puntual',
        urgency: template.urgency,
        type: template.type,
      });
    }
  };

  // Crear rutina completa
  const handleCreateRoutine = (routineId: string) => {
    // Buscar primero en rutinas predefinidas
    let routine = routines.find(r => r.id === routineId);
    
    // Si no se encuentra, buscar en rutinas personalizadas
    if (!routine) {
      routine = customRoutines.find(r => r.id === routineId);
    }
    
    if (!routine) return;

    const today = new Date().toISOString().split('T')[0];

    // Registrar actividad de rutina ejecutada
    if (typeof window !== 'undefined') {
      // Intentar obtener el miembro actual desde localStorage
      const members = JSON.parse(localStorage.getItem('homely_members') || '[]');
      const currentUser = members[0];
      if (window.dispatchEvent) {
        // Disparar un evento personalizado para que App.tsx pueda escuchar y registrar la actividad
        window.dispatchEvent(new CustomEvent('routine_executed', {
          detail: {
            memberId: currentUser?.id || '',
            message: `${currentUser?.name || 'Usuario'} ha establecido la rutina "${routine.name}"`,
            data: { routineId: routine.id, action: 'executed' }
          }
        }));
      }
    }

    console.log(`Creating routine: ${routine.name} with ${routine.tasks.length} tasks`);
    
    routine.tasks.forEach((task, index) => {
      console.log(`Creating task ${index + 1}/${routine.tasks.length}: ${task.title}`);
      onAddTask({
        title: task.title,
        description: task.description,
        category: task.category,
        assignedTo: '',
        dueDate: today,
        points: task.points,
        recurrence: 'puntual',
        urgency: task.urgency,
        type: task.type,
        status: 'pending',
        comments: [],
      });
    });

    console.log(`Routine ${routine.name} creation completed`);
    setShowRoutines(false);
  };

  // Asignar tarea a un miembro
  const handleAssignTask = (taskId: string, memberId: string) => {
    onUpdateTask(taskId, { assignedTo: memberId });
    setAssigningTask(null);
  };

  // Handlers para rutinas personalizadas
  const handleSaveCustomRoutine = () => {
    if (!routineFormData.name || routineFormData.tasks.length === 0) return;

    if (editingRoutine) {
      onUpdateCustomRoutine(editingRoutine, {
        name: routineFormData.name,
        description: routineFormData.description,
        icon: routineFormData.icon,
        tasks: routineFormData.tasks,
      });
    } else {
      onAddCustomRoutine({
        name: routineFormData.name,
        description: routineFormData.description,
        icon: routineFormData.icon,
        tasks: routineFormData.tasks,
      });
    }

    setRoutineFormData({ name: '', description: '', icon: '⚡', tasks: [] });
    setEditingRoutine(null);
  };

  const handleEditCustomRoutine = (routine: TaskTemplate) => {
    setEditingRoutine(routine.id);
    setRoutineFormData({
      name: routine.name,
      description: routine.description,
      icon: routine.icon,
      tasks: routine.tasks,
    });
  };

  const handleDeleteCustomRoutine = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta rutina?')) {
      onDeleteCustomRoutine(id);
    }
  };

  const handleAddTaskToRoutine = () => {
    const today = new Date().toISOString().split('T')[0];
    const newTask = {
      title: '',
      description: '',
      category: 'General',
      points: 10,
      recurrence: 'puntual' as const,
      urgency: 'medium' as const,
      type: 'Diaria',
      dueDate: today,
      status: 'pending' as const,
    };
    setRoutineFormData(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));
  };

  const handleUpdateRoutineTask = (index: number, updates: Partial<typeof routineFormData.tasks[0]>) => {
    setRoutineFormData(prev => ({
      ...prev,
      tasks: prev.tasks.map((task, i) => i === index ? { ...task, ...updates } : task),
    }));
  };

  const handleRemoveRoutineTask = (index: number) => {
    setRoutineFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index),
    }));
  };

  const handleCancelRoutineForm = () => {
    setRoutineFormData({ name: '', description: '', icon: '⚡', tasks: [] });
    setEditingRoutine(null);
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning border-warning/20';
      case 'in-progress': return 'bg-info/10 text-info border-info/20';
      case 'completed': return 'bg-success/10 text-success border-success/20';
    }
  };

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'in-progress': return 'En progreso';
      case 'completed': return 'Completada';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const today = new Date().toISOString().split('T')[0];
    const isOverdue = task.dueDate < today && task.status !== 'completed';
    
    const statusMatch = filterStatus === 'all' 
      || (filterStatus === 'overdue' && isOverdue)
      || (filterStatus !== 'overdue' && task.status === filterStatus);
    const memberMatch = filterMember === 'all' || task.assignedTo === filterMember;
    const categoryMatch = filterCategory === 'all' || task.category === filterCategory;
    const searchMatch = searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && memberMatch && categoryMatch && searchMatch;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'date') {
      const today = new Date().toISOString().split('T')[0];
      const aOverdue = a.dueDate < today ? -2 : a.dueDate === today ? -1 : 0;
      const bOverdue = b.dueDate < today ? -2 : b.dueDate === today ? -1 : 0;
      if (aOverdue !== bOverdue) return aOverdue - bOverdue;
      return a.dueDate.localeCompare(b.dueDate);
    } else if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.urgency] - priorityOrder[b.urgency];
    } else if (sortBy === 'points') {
      return b.points - a.points;
    } else if (sortBy === 'category') {
      return a.category.localeCompare(b.category);
    }
    return 0;
  });

  // Statistics
  const today = new Date().toISOString().split('T')[0];
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const startOfWeekStr = startOfWeek.toISOString().split('T')[0];

  const stats = {
    total: tasks.filter(t => t.status !== 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    overdue: tasks.filter(t => t.dueDate < today && t.status !== 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    unassigned: tasks.filter(t => !t.assignedTo || t.assignedTo === '').length,
    completedThisWeek: tasks.filter(t => t.status === 'completed' && t.createdAt >= startOfWeekStr).length,
    totalPoints: tasks.filter(t => t.status !== 'completed').reduce((sum, t) => sum + t.points, 0),
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    totalTasks: tasks.length,
  };

  const completionPercentage = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  // Drag and Drop handlers
  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: Task['status']) => {
    if (draggedTask) {
      const task = tasks.find(t => t.id === draggedTask);
      if (task && !task.assignedTo) {
        setUnassignedTaskDialog({
          open: true,
          task: task,
          intendedAction: status === 'in-progress' ? 'iniciar' : status === 'completed' ? 'completar' : 'mover'
        });
        setDraggedTask(null);
        return;
      }
      onUpdateTask(draggedTask, { status });
      setDraggedTask(null);
    }
  };

  const handleCompleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.assignedTo) {
      setUnassignedTaskDialog({
        open: true,
        task: task,
        intendedAction: 'completar'
      });
      return;
    }
    onUpdateTask(taskId, { status: 'completed' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Gestión de Tareas</h2>
            <p className="text-sm text-muted-foreground">Organiza y asigna tareas del hogar</p>
          </div>
          <button
            onClick={() => setIsAddingTask(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover hover:scale-105 hover:shadow-lg transition-all duration-200 shadow-md"
          >
            <Plus className="w-4 h-4" />
            Nueva Tarea
          </button>
        </div>
      </div>

      {/* Row 1: Deadline Reminder + Routines Suggestions (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deadline Reminder Card */}
        {(() => {
          const upcomingTasksSorted = filteredTasks
            .filter(t => t.status !== 'completed' && t.dueDate >= today)
            .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
          
          const nextTask = upcomingTasksSorted[0];
          const overdueCount = stats.overdue;
          const dueTodayCount = filteredTasks.filter(t => t.dueDate === today && t.status !== 'completed').length;
          
          if (!nextTask && overdueCount === 0 && dueTodayCount === 0) {
            return (
              <div className="bg-linear-to-br from-success/10 via-primary/10 to-success/5 rounded-xl p-5 border border-success/30 shadow-sm">
                <h3 className="text-foreground font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  Recordatorio de Tareas
                </h3>
                <div className="p-4 bg-card/50 rounded-xl border border-border/50">
                  <p className="text-sm text-success font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    ¡Todo al día! 🎉 No hay tareas pendientes urgentes
                  </p>
                </div>
              </div>
            );
          }
          
          return (
            <div className="bg-linear-to-br from-blue-500/10 via-primary/10 to-blue-600/5 rounded-xl p-5 border border-blue-500/30 shadow-sm">
              <h3 className="text-foreground font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                Recordatorio de Tareas
              </h3>
              <div className="p-4 bg-card/50 rounded-xl border border-border/50 space-y-2">
                {overdueCount > 0 && (
                  <p className="text-sm text-danger font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {overdueCount} {overdueCount === 1 ? 'tarea atrasada' : 'tareas atrasadas'} ⚠️
                  </p>
                )}
                {dueTodayCount > 0 && (
                  <p className="text-sm text-warning font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {dueTodayCount} {dueTodayCount === 1 ? 'tarea vence' : 'tareas vencen'} hoy 📅
                  </p>
                )}
                {nextTask && (
                  <p className="text-sm text-foreground leading-relaxed flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-info" />
                    Próxima: <span className="font-medium">{nextTask.title}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(nextTask.dueDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                    </span>
                  </p>
                )}
              </div>
            </div>
          );
        })()}

        {/* Routines Suggestions Card */}
        <div className="bg-card rounded-xl p-5 border border-border shadow-sm flex flex-col h-full">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
              <Repeat className="w-5 h-5 text-success" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-1">
                {(() => {
                  const now = new Date();
                  const hour = now.getHours();
                  const day = now.getDay();
                  
                  if (hour >= 7 && hour < 10) {
                    return "☀️ Rutina sugerida: Matutina";
                  } else if (day === 1) {
                    return "📅 Rutina sugerida: Inicio de Semana";
                  } else if (day === 0 || day === 6) {
                    return "🧹 Rutina sugerida: Limpieza Profunda";
                  } else if (hour >= 18 && hour < 22) {
                    return "🍽️ Rutina sugerida: Preparar Cena";
                  } else {
                    return "⚡ Usa rutinas para ahorrar tiempo";
                  }
                })()}
              </p>
              <p className="text-xs text-muted-foreground">
                {(() => {
                  const now = new Date();
                  const hour = now.getHours();
                  const day = now.getDay();
                  
                  if (hour >= 7 && hour < 10) {
                    return "Crea 4 tareas de desayuno y limpieza en 1 clic";
                  } else if (day === 1) {
                    return "Organiza toda la semana con tareas de preparación";
                  } else if (day === 0 || day === 6) {
                    return "Crea 5 tareas de limpieza profunda automáticamente";
                  } else if (hour >= 18 && hour < 22) {
                    return "Genera tareas de cocina y limpieza para la cena";
                  } else {
                    return "Crea múltiples tareas relacionadas de una vez";
                  }
                })()}
              </p>
            </div>
          </div>

          {/* Quick Info */}
          <div className="text-xs text-muted-foreground mb-4 flex items-center gap-3">
            <span>📊 {customRoutines.length} rutinas personalizadas</span>
            <span>•</span>
            <span>✓ 4 rutinas predefinidas</span>
          </div>

          {/* Action Buttons - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-auto">
            <button
              onClick={() => setShowRoutines(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-success/10 text-success border border-success/30 rounded-lg hover:bg-success/20 transition-colors shadow-sm text-sm font-medium"
            >
              <Repeat className="w-4 h-4" />
              Rutinas Predefinidas
            </button>
            <button
              onClick={() => setShowManageRoutines(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-info/10 text-info border border-info/30 rounded-lg hover:bg-info/20 transition-colors shadow-sm text-sm font-medium"
            >
              <Zap className="w-4 h-4" />
              Gestionar Rutinas
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Consolidated Statistics Card (Full width) */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Progreso General</h3>
          <span className="text-xl font-bold text-primary">{completionPercentage}%</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden mb-4">
          <div 
            className="h-full bg-linear-to-r from-primary to-success transition-all duration-500 rounded-full"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">


          {/* Atrasadas */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-danger/10 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-danger" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Atrasadas</p>
              <p className="text-lg font-bold text-danger">{stats.overdue}</p>
            </div>
          </div>
          {/* Sin asignar */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Sin Asignar</p>
              <p className="text-lg font-bold text-muted-foreground">{stats.unassigned}</p>
            </div>
          </div>
          {/* Pendientes */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pendientes</p>
              <p className="text-lg font-bold text-warning">{stats.pending}</p>
            </div>
          </div>
          {/* En progreso */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">En Progreso</p>
              <p className="text-lg font-bold text-info">{stats.inProgress}</p>
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
              <Zap className="w-5 h-5 text-xp" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Puntos Restantes</p>
              <p className="text-lg font-bold text-xp">{stats.totalPoints}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Search and Filters */}
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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Estado</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              aria-label="Filtrar por estado"
              className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Todas</option>
              <option value="pending">Pendientes</option>
              <option value="in-progress">En progreso</option>
              <option value="completed">Completadas</option>
              <option value="overdue">Atrasadas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Categoría</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              aria-label="Filtrar por categoría"
              className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Todas</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Miembro</label>
            <select
              value={filterMember}
              onChange={(e) => setFilterMember(e.target.value)}
              aria-label="Filtrar por miembro"
              className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Todos</option>
              {members.map(member => (
                <option key={member.id} value={member.id}>
                  {member.avatar} {member.name}
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
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Ordenar tareas"
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
              {sortedTasks.length} {sortedTasks.length === 1 ? 'tarea encontrada' : 'tareas encontradas'}
            </span>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterStatus('all');
              setFilterCategory('all');
              setFilterMember('all');
              setSortBy('date');
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg hover:bg-destructive/20 hover:border-destructive/50 transition-colors text-sm"
            title="Limpiar todos los filtros y búsqueda"
          >
            <X className="w-4 h-4" />
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Task Form Modal */}
      {isAddingTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl shadow-2xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">
                {editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
              </h3>
              <button
                onClick={handleCancel}
                title="Cerrar"
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
            {/* Selector de Plantillas */}
            {!editingTask && (
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  💡 Usar plantilla predefinida (opcional)
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  aria-label="Seleccionar plantilla"
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">-- Selecciona una plantilla o crea desde cero --</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name} ({template.category}) - {template.points} pts
                    </option>
                  ))}
                </select>
                {selectedTemplate && (
                  <p className="text-xs text-muted-foreground mt-2">
                    ✓ Plantilla cargada. Puedes modificar los campos antes de crear la tarea.
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm text-muted-foreground mb-2">Título *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ej: Lavar los platos"
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Descripción detallada de la tarea"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Asignar a</label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Asignar tarea a un miembro"
                >
                  <option value="">Sin asignar</option>
                  {members.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.avatar} {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Fecha límite *</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                  title="Selecciona la fecha límite para completar la tarea"
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Categoría</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Seleccionar categoría de la tarea"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Tipo</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Seleccionar tipo de tarea"
                >
                  {taskTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Urgencia</label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value as 'low' | 'medium' | 'high' })}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Seleccionar urgencia de la tarea"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Puntos</label>
                <input
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                  min="1"
                  max="100"
                  title="Puntos que otorga completar esta tarea (1-100)"
                  placeholder="10"
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">Recurrencia</label>
              <select
                value={formData.recurrence}
                onChange={(e) => setFormData({ ...formData, recurrence: e.target.value as 'puntual' | 'diaria' | 'semanal' | 'mensual' })}
                className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Seleccionar recurrencia de la tarea"
              >
                <option value="puntual">Puntual (sin repetir)</option>
                <option value="diaria">Diaria</option>
                <option value="semanal">Semanal</option>
                <option value="mensual">Mensual</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                {formData.recurrence === 'puntual' && 'Esta tarea se realiza una sola vez'}
                {formData.recurrence === 'diaria' && 'Se repetirá automáticamente cada día'}
                {formData.recurrence === 'semanal' && 'Se repetirá automáticamente cada semana'}
                {formData.recurrence === 'mensual' && 'Se repetirá automáticamente cada mes'}
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover hover:scale-105 hover:shadow-lg transition-all duration-200 font-medium"
              >
                {editingTask ? 'Guardar cambios' : 'Crear tarea'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg hover:bg-destructive/20 hover:border-destructive/50 transition-colors font-medium"
              >
                Cancelar
              </button>
            </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Toggle - Subtle */}
      <div className="px-2 py-2 flex items-center justify-between gap-1">
        <h3 className="text-lg font-semibold text-foreground">Listado de Tareas</h3>
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

      {/* Task List */}
      <div className="space-y-3">
        {sortedTasks.length === 0 ? (
          <div className="bg-card rounded-xl p-12 shadow-sm border border-border text-center">
            <p className="text-muted-foreground">No hay tareas que coincidan con los filtros</p>
          </div>
        ) : viewMode === 'kanban' ? (
          /* Kanban View */
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
                <span className="ml-auto text-sm text-muted-foreground">
                  {sortedTasks.filter(t => t.status === 'pending').length}
                </span>
                {(() => {
                  const today = new Date().toISOString().split('T')[0];
                  const overdueCount = sortedTasks.filter(t => t.status === 'pending' && t.dueDate < today).length;
                  if (overdueCount > 0) {
                    return (
                      <span className="ml-1 px-1.5 py-0.5 bg-danger/20 text-danger text-xs font-semibold rounded">
                        {overdueCount} ⚠️
                      </span>
                    );
                  }
                  return null;
                })()}
              </div>
              <div className="space-y-3">
                {sortedTasks
                  .filter(task => task.status === 'pending')
                  .sort((a, b) => {
                    // Ordenar: atrasadas primero
                    const today = new Date().toISOString().split('T')[0];
                    const aOverdue = a.dueDate < today;
                    const bOverdue = b.dueDate < today;
                    if (aOverdue && !bOverdue) return -1;
                    if (!aOverdue && bOverdue) return 1;
                    return a.dueDate.localeCompare(b.dueDate);
                  })
                  .map(task => {
                    const today = new Date().toISOString().split('T')[0];
                    const isOverdue = task.dueDate < today;
                    const daysOverdue = isOverdue ? Math.abs(Math.floor((new Date(task.dueDate).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24))) : 0;
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
                            ) : !isOverdue && (
                              <span className="text-xs bg-muted/50 text-muted-foreground px-1.5 py-0.5 rounded whitespace-nowrap">
                                ⏺ puntual
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {(() => {
                            const catConfig = getCategoryConfig(task.category);
                            const catClasses = getCategoryClasses(task.category);
                            const CatIcon = catConfig.icon;
                            return (
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${catClasses.badge}`}>
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
                              low: { color: 'bg-success/20 text-success', label: 'Baja' }
                            };
                            const config = urgencyConfig[task.urgency];
                            return (
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${config.color}`}>
                                <AlertCircle className="w-3 h-3" />
                                {config.label}
                              </span>
                            );
                          })()}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 pb-3 border-t border-border pt-3">
                          <span className={`flex items-center gap-1 ${isOverdue ? 'text-danger font-semibold' : ''}`}>
                            <Clock className="w-3 h-3" />
                            {isOverdue 
                              ? (daysOverdue === 0 ? 'Vencida hoy' : daysOverdue === 1 ? 'Hace 1 día' : `Hace ${daysOverdue} días`)
                              : `Vence: ${new Date(task.dueDate).toLocaleDateString('es-ES')}`
                            }
                          </span>
                          {(() => {
                            const assignedMember = members.find(m => m.id === task.assignedTo);
                            return (
                              <button
                                onClick={() => setAssigningTask(assigningTask === task.id ? null : task.id)}
                                className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer hover:bg-muted/50 px-2 py-1 rounded"
                              >
                                {assignedMember ? (
                                  <>
                                    <span 
                                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                                      style={{ backgroundColor: assignedMember.color }}
                                    >
                                      {assignedMember.avatar}
                                    </span>
                                    <span>{assignedMember.name}</span>
                                  </>
                                ) : (
                                  <span className="text-warning font-medium">Sin asignar</span>
                                )}
                                <ChevronDown className="w-3 h-3 ml-auto" />
                              </button>
                            );
                          })()}
                        </div>
                        {assigningTask === task.id && (
                          <div className="mb-3 p-2 bg-muted rounded-lg border border-border">
                            <p className="text-xs font-medium mb-2">Asignar a:</p>
                            <div className="grid grid-cols-2 gap-1">
                              {members.map(member => (
                                <button
                                  key={member.id}
                                  onClick={() => {
                                    onUpdateTask(task.id, { assignedTo: member.id });
                                    setAssigningTask(null);
                                  }}
                                  className="text-xs px-2 py-1 rounded hover:bg-background transition-colors text-left"
                                >
                                  {member.avatar} {member.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              if (!task.assignedTo || task.assignedTo === '') {
                                setUnassignedTaskDialog({ 
                                  open: true, 
                                  task, 
                                  intendedAction: 'start' 
                                });
                              } else {
                                onUpdateTask(task.id, { status: 'in-progress' });
                              }
                            }}
                            className="flex-1 text-xs px-2 py-1 bg-info/10 text-info border border-info/30 rounded hover:bg-info/20 transition-colors"
                          >
                            Iniciar
                          </button>
                          <button
                            onClick={() => handleEdit(task)}
                            className="text-xs px-2 py-1 bg-warning/10 text-warning border border-warning/30 rounded hover:bg-warning/20 transition-colors"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="text-xs px-2 py-1 bg-danger/10 text-danger border border-danger/30 rounded hover:bg-danger/20 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                }
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
                  {sortedTasks.filter(t => t.status === 'in-progress').length}
                </span>
                {(() => {
                  const today = new Date().toISOString().split('T')[0];
                  const overdueCount = sortedTasks.filter(t => t.status === 'in-progress' && t.dueDate < today).length;
                  if (overdueCount > 0) {
                    return (
                      <span className="ml-1 px-1.5 py-0.5 bg-danger/20 text-danger text-xs font-semibold rounded">
                        {overdueCount} ⚠️
                      </span>
                    );
                  }
                  return null;
                })()}
              </div>
              <div className="space-y-3">
                {sortedTasks
                  .filter(task => task.status === 'in-progress')
                  .sort((a, b) => {
                    // Ordenar: atrasadas primero
                    const today = new Date().toISOString().split('T')[0];
                    const aOverdue = a.dueDate < today;
                    const bOverdue = b.dueDate < today;
                    if (aOverdue && !bOverdue) return -1;
                    if (!aOverdue && bOverdue) return 1;
                    return a.dueDate.localeCompare(b.dueDate);
                  })
                  .map(task => {
                    const today = new Date().toISOString().split('T')[0];
                    const isOverdue = task.dueDate < today;
                    const daysOverdue = isOverdue ? Math.abs(Math.floor((new Date(task.dueDate).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24))) : 0;
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
                            ) : !isOverdue && (
                              <span className="text-xs bg-muted/50 text-muted-foreground px-1.5 py-0.5 rounded whitespace-nowrap">
                                ⏺ puntual
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {(() => {
                            const catConfig = getCategoryConfig(task.category);
                            const catClasses = getCategoryClasses(task.category);
                            const CatIcon = catConfig.icon;
                            return (
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${catClasses.badge}`}>
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
                              low: { color: 'bg-success/20 text-success', label: 'Baja' }
                            };
                            const config = urgencyConfig[task.urgency];
                            return (
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${config.color}`}>
                                <AlertCircle className="w-3 h-3" />
                                {config.label}
                              </span>
                            );
                          })()}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 pb-3 border-t border-border pt-3">
                          <span className={`flex items-center gap-1 ${isOverdue ? 'text-danger font-semibold' : ''}`}>
                            <Clock className="w-3 h-3" />
                            {isOverdue 
                              ? (daysOverdue === 0 ? 'Vencida hoy' : daysOverdue === 1 ? 'Hace 1 día' : `Hace ${daysOverdue} días`)
                              : `Vence: ${new Date(task.dueDate).toLocaleDateString('es-ES')}`
                            }
                          </span>
                          {(() => {
                            const assignedMember = members.find(m => m.id === task.assignedTo);
                            return (
                              <button
                                onClick={() => setAssigningTask(assigningTask === task.id ? null : task.id)}
                                className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer hover:bg-muted/50 px-2 py-1 rounded"
                              >
                                {assignedMember ? (
                                  <>
                                    <span 
                                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                                      style={{ backgroundColor: assignedMember.color }}
                                    >
                                      {assignedMember.avatar}
                                    </span>
                                    <span>{assignedMember.name}</span>
                                  </>
                                ) : (
                                  <span className="text-warning font-medium">Sin asignar</span>
                                )}
                                <ChevronDown className="w-3 h-3 ml-auto" />
                              </button>
                            );
                          })()}
                        </div>
                        {assigningTask === task.id && (
                          <div className="mb-3 p-2 bg-muted rounded-lg border border-border">
                            <p className="text-xs font-medium mb-2">Asignar a:</p>
                            <div className="grid grid-cols-2 gap-1">
                              {members.map(member => (
                                <button
                                  key={member.id}
                                  onClick={() => {
                                    onUpdateTask(task.id, { assignedTo: member.id });
                                    setAssigningTask(null);
                                  }}
                                  className="text-xs px-2 py-1 rounded hover:bg-background transition-colors text-left"
                                >
                                  {member.avatar} {member.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCompleteTask(task.id)}
                            className="flex-1 text-xs px-2 py-1 bg-success/10 text-success border border-success/30 rounded hover:bg-success/20 transition-colors font-semibold"
                          >
                            ✓ Completar
                          </button>
                          <button
                            onClick={() => handleEdit(task)}
                            className="text-xs px-2 py-1 bg-warning/10 text-warning border border-warning/30 rounded hover:bg-warning/20 transition-colors"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="text-xs px-2 py-1 bg-danger/10 text-danger border border-danger/30 rounded hover:bg-danger/20 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                }
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
                  {sortedTasks.filter(t => t.status === 'completed').length}
                </span>
              </div>
              <div className="space-y-3">
                {sortedTasks.filter(task => task.status === 'completed').map(task => {
                  const isHighlighted = highlightedTaskId?.includes(task.id);
                  return (
                  <div
                    key={task.id}
                    data-task-id={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                    className={`rounded-lg p-3 shadow-sm hover:shadow-md transition-all cursor-move opacity-75 ${
                      isHighlighted
                        ? 'ring-4 ring-primary border-2 border-primary bg-primary/20 shadow-lg shadow-primary/50 animate-pulse'
                        : 'bg-success/5 border-2 border-success/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-foreground font-medium flex-1 line-through">{task.title}</h4>
                      {task.recurrence && task.recurrence !== 'puntual' ? (
                        <span className="text-xs bg-success/20 text-success px-1.5 py-0.5 rounded whitespace-nowrap ml-2">
                          🔄 {task.recurrence}
                        </span>
                      ) : (
                        <span className="text-xs bg-muted/50 text-muted-foreground px-1.5 py-0.5 rounded whitespace-nowrap ml-2">
                          ⏺ puntual
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        const catConfig = getCategoryConfig(task.category);
                        const catClasses = getCategoryClasses(task.category);
                        const CatIcon = catConfig.icon;
                        return (
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${catClasses.badge}`}>
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
                          low: { color: 'bg-success/20 text-success', label: 'Baja' }
                        };
                        const config = urgencyConfig[task.urgency];
                        return (
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${config.color}`}>
                            <AlertCircle className="w-3 h-3" />
                            {config.label}
                          </span>
                        );
                      })()}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2 pb-2 border-t border-border pt-2 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Vencía: {new Date(task.dueDate).toLocaleDateString('es-ES')}
                      </span>
                      {(() => {
                        const assignedMember = members.find(m => m.id === task.assignedTo);
                        return (
                          <button
                            onClick={() => setAssigningTask(assigningTask === task.id ? null : task.id)}
                            className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer hover:bg-muted/50 px-2 py-1 rounded"
                          >
                            {assignedMember ? (
                              <>
                                <span 
                                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                                  style={{ backgroundColor: assignedMember.color }}
                                >
                                  {assignedMember.avatar}
                                </span>
                                <span>{assignedMember.name}</span>
                              </>
                            ) : (
                              'Sin asignar'
                            )}
                            <ChevronDown className="w-3 h-3 ml-auto" />
                          </button>
                        );
                      })()}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-success" />
                        <span className="flex items-center gap-1.5">
                          Completada por {(() => {
                            const completedByMember = members.find(m => m.id === task.assignedTo);
                            return completedByMember ? (
                              <>
                                <span 
                                  className="w-4 h-4 rounded-full flex items-center justify-center text-xs ml-1"
                                  style={{ backgroundColor: completedByMember.color }}
                                >
                                  {completedByMember.avatar}
                                </span>
                                <span>{completedByMember.name}</span>
                              </>
                            ) : 'Desconocido';
                          })()} el
                          {task.completedAt
                            ? ` ${new Date(task.completedAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })} a las ${new Date(task.completedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`
                            : ' N/A'}
                        </span>
                      </span>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        title="Eliminar tarea"
                        className="text-xs px-2 py-1 bg-danger/10 text-danger border border-danger/30 rounded hover:bg-danger/20 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
                })}
              </div>
            </div>
          </div>
        ) : viewMode === 'list' ? (
          /* List/Table View */
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="text-left p-3 text-sm font-semibold text-foreground">Tarea</th>
                    <th className="text-left p-3 text-sm font-semibold text-foreground">Categoría</th>
                    <th className="text-left p-3 text-sm font-semibold text-foreground">Recurrencia</th>
                    <th className="text-left p-3 text-sm font-semibold text-foreground">Estado</th>
                    <th className="text-left p-3 text-sm font-semibold text-foreground">Asignado</th>
                    <th className="text-left p-3 text-sm font-semibold text-foreground">Fecha</th>
                    <th className="text-left p-3 text-sm font-semibold text-foreground">Puntos</th>
                    <th className="text-center p-3 text-sm font-semibold text-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sortedTasks.map(task => {
                    const assignedMember = members.find(m => m.id === task.assignedTo);
                    const today = new Date().toISOString().split('T')[0];
                    const isOverdue = task.dueDate < today && task.status !== 'completed';
                    const isHighlighted = highlightedTaskId?.includes(task.id);
                    const isUnassigned = !task.assignedTo || task.assignedTo === '';
                    const isOverdueUnassigned = isOverdue && isUnassigned;
                    
                    return (
                      <tr 
                        key={task.id}
                        data-task-id={task.id}
                        data-section={isOverdueUnassigned ? "overdue-unassigned" : (isUnassigned ? "unassigned" : undefined)}
                        className={`hover:bg-muted/50 transition-colors ${
                          isHighlighted ? 'ring-4 ring-primary border-2 border-primary bg-primary/20 shadow-lg shadow-primary/50 animate-pulse' :
                          isOverdue ? 'bg-danger/5' : 
                          task.status === 'completed' ? 'bg-success/5' : 
                          task.status === 'in-progress' ? 'bg-info/5' : ''
                        }`}
                      >
                        <td className="p-3">
                          <div className="font-medium text-foreground">{task.title}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{task.description}</div>
                        </td>
                        <td className="p-3">
                          {(() => {
                            const catConfig = getCategoryConfig(task.category);
                            const catClasses = getCategoryClasses(task.category);
                            const CatIcon = catConfig.icon;
                            return (
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${catClasses.badge}`}>
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
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
                            {getStatusText(task.status)}
                          </span>
                        </td>
                        <td className="p-3">
                          {assignedMember ? (
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                                  style={{ backgroundColor: assignedMember.color }}
                                >
                                  {assignedMember.avatar}
                                </div>
                                <span className="text-sm text-foreground">{assignedMember.name}</span>
                              </div>
                              {task.status === 'completed' && task.completedAt && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-success" />
                                  {new Date(task.completedAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })} a las {new Date(task.completedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="relative">
                              <button
                                onClick={() => setAssigningTask(assigningTask === task.id ? null : task.id)}
                                className="text-xs px-2 py-1 bg-warning/10 border border-warning/20 text-warning rounded hover:bg-warning/20 transition-colors"
                              >
                                Sin asignar - Asignar
                              </button>
                              {assigningTask === task.id && (
                                <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-xl z-10 min-w-40">
                                  <div className="p-2 space-y-1">
                                    {members.map(member => (
                                      <button
                                        key={member.id}
                                        onClick={() => handleAssignTask(task.id, member.id)}
                                        className="w-full text-left px-3 py-2 text-sm rounded hover:bg-muted transition-colors flex items-center gap-2"
                                      >
                                        <div
                                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                                          style={{ backgroundColor: member.color }}
                                        >
                                          {member.avatar}
                                        </div>
                                        <span>{member.name}</span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="p-3">
                          <span className={`text-xs ${isOverdue ? 'text-danger font-semibold' : 'text-muted-foreground'}`}>
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
                                onClick={() => handleTaskCompletion(task.id)}
                                className="p-1.5 text-success hover:bg-success/10 rounded transition-colors"
                                title="Completar"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleEdit(task)}
                              className="p-1.5 text-foreground hover:bg-muted rounded transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteTask(task.id)}
                              className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>

      {/* Routines Modal */}
      {showRoutines && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl shadow-2xl border border-border max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">Crear Rutina Completa</h3>
              <button
                onClick={() => setShowRoutines(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <span className="text-2xl text-muted-foreground">×</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <p className="text-muted-foreground mb-4">
                  Selecciona una rutina para crear automáticamente todas sus tareas:
                </p>

                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Repeat className="w-4 h-4 text-success" />
                  Rutinas Predefinidas
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {routines.map((routine) => (
                    <div
                      key={routine.id}
                      className="bg-background rounded-xl p-6 border-2 border-border hover:border-primary transition-all cursor-pointer group"
                      onClick={() => handleCreateRoutine(routine.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{routine.icon}</div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {routine.name}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            {routine.description}
                          </p>
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-foreground">
                              Incluye {routine.tasks.length} tareas:
                            </p>
                            <ul className="space-y-1">
                              {routine.tasks.map((task, index) => (
                                <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                                  <span className="text-success mt-0.5">✓</span>
                                  <span>{task.title} ({task.points} pts)</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="mt-4 pt-4 border-t border-border">
                            <p className="text-xs font-semibold text-primary">
                              Total: {routine.tasks.reduce((sum, t) => sum + t.points, 0)} puntos
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {customRoutines.length > 0 && (
                  <>
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-info" />
                      Tus Rutinas Personalizadas
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {customRoutines.map((routine) => (
                        <div
                          key={routine.id}
                          className="bg-background rounded-xl p-6 border-2 border-border hover:border-info transition-all cursor-pointer group"
                          onClick={() => handleCreateRoutine(routine.id)}
                        >
                          <div className="flex items-start gap-4">
                            <div className="text-4xl">{routine.icon}</div>
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-info transition-colors">
                                {routine.name}
                              </h4>
                              <p className="text-sm text-muted-foreground mb-4">
                                {routine.description}
                              </p>
                              <div className="space-y-2">
                                <p className="text-xs font-medium text-foreground">
                                  Incluye {routine.tasks.length} tareas:
                                </p>
                                <ul className="space-y-1">
                                  {routine.tasks.map((task, index) => (
                                    <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                                      <span className="text-info mt-0.5">✓</span>
                                      <span>{task.title} ({task.points} pts)</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="mt-4 pt-4 border-t border-border">
                                <p className="text-xs font-semibold text-info">
                                  Total: {routine.tasks.reduce((sum, t) => sum + t.points, 0)} puntos
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-card border-t border-border p-6">
              <button
                onClick={() => setShowRoutines(false)}
                className="w-full px-4 py-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg hover:bg-destructive/20 hover:border-destructive/50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gestionar Rutinas Modal */}
      {showManageRoutines && (
        <div className="fixed inset-0 bg-background/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="border-b border-border p-6">
              <h3 className="text-xl font-semibold text-foreground">Gestionar Rutinas Personalizadas</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Crea y edita tus propias rutinas de tareas
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lista de rutinas personalizadas */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">Tus Rutinas</h4>
                    {editingRoutine && (
                      <button
                        onClick={() => {
                          handleCancelRoutineForm();
                          setEditingRoutine(null);
                        }}
                        className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors text-sm"
                      >
                        + Nueva Rutina
                      </button>
                    )}
                  </div>

                  {customRoutines.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground border border-border rounded-lg bg-muted/20">
                      <Zap className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No tienes rutinas personalizadas</p>
                      <p className="text-xs mt-1">Crea tu primera rutina →</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {customRoutines.map(routine => (
                        <div
                          key={routine.id}
                          className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors bg-card"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1">
                              <span className="text-2xl">{routine.icon}</span>
                              <div className="flex-1">
                                <h5 className="font-medium text-foreground">{routine.name}</h5>
                                <p className="text-xs text-muted-foreground mt-1">{routine.description}</p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  {routine.tasks.length} tareas · {routine.tasks.reduce((sum, t) => sum + t.points, 0)} pts
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditCustomRoutine(routine)}
                                className="p-2 text-info hover:bg-info/10 rounded transition-colors"
                                title="Editar"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCustomRoutine(routine.id)}
                                className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Formulario de creación/edición */}
                <div className="border border-border rounded-lg p-4 bg-muted/20 space-y-4">
                  <h4 className="font-medium text-foreground">
                    {editingRoutine ? 'Editar Rutina' : 'Nueva Rutina'}
                  </h4>

                  {/* Plantillas predefinidas - Solo en modo crear */}
                  {!editingRoutine && (
                    <div className="bg-info/5 border border-info/20 rounded-lg p-3">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        💡 Empezar desde una plantilla
                      </label>
                      <select
                        onChange={(e) => {
                          const selected = e.target.value;
                          if (selected) {
                            const routine = routines.find(r => r.id === selected);
                            if (routine) {
                              setRoutineFormData({
                                name: routine.name,
                                description: routine.description,
                                icon: routine.icon,
                                tasks: routine.tasks.map(t => ({
                                  title: t.title,
                                  description: t.description,
                                  category: t.category,
                                  points: t.points,
                                  urgency: t.urgency,
                                  type: t.type,
                                  recurrence: 'puntual' as const,
                                  dueDate: new Date().toISOString().split('T')[0],
                                  status: 'pending' as const,
                                })),
                              });
                            }
                          }
                        }}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm"
                        defaultValue=""
                      >
                        <option value="">Selecciona una plantilla (opcional)</option>
                        {routines.map(routine => (
                          <option key={routine.id} value={routine.id}>
                            {routine.icon} {routine.name} - {routine.tasks.length} tareas
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Puedes modificar cualquier campo después de seleccionar
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Nombre de la rutina
                      </label>
                      <input
                        type="text"
                        value={routineFormData.name}
                        onChange={(e) => setRoutineFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                        placeholder="Ej: Rutina de noche"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Descripción
                      </label>
                      <textarea
                        value={routineFormData.description}
                        onChange={(e) => setRoutineFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                        rows={2}
                        placeholder="Describe brevemente esta rutina"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Icono de la rutina
                      </label>
                      <div className="relative">
                        {/* Botón para mostrar emoji seleccionado */}
                        <button
                          type="button"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground hover:border-primary/50 transition-colors flex items-center justify-between"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-2xl">{routineFormData.icon}</span>
                            <span className="text-sm text-muted-foreground">Cambiar icono</span>
                          </span>
                          <span className="text-xs text-muted-foreground">{showEmojiPicker ? '▲' : '▼'}</span>
                        </button>

                        {/* Desplegable con emojis */}
                        {showEmojiPicker && (
                          <div className="absolute z-10 w-full mt-2 p-3 bg-card border border-border rounded-lg shadow-xl">
                            <div className="grid grid-cols-8 gap-2 mb-2">
                              {['⚡', '🌙', '☀️', '🔥', '💪', '🧹', '🍳', '🛁', 
                                '👕', '🛒', '🌱', '🐾', '📋', '⏰', '🎯', '✨',
                                '🏠', '💧', '🧼', '🗓️', '📝', '🔔', '⭐', '🎨'].map((emoji) => (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => {
                                    setRoutineFormData(prev => ({ ...prev, icon: emoji }));
                                    setShowEmojiPicker(false);
                                  }}
                                  className={`text-2xl p-2 rounded-lg border transition-all hover:scale-110 ${
                                    routineFormData.icon === emoji 
                                      ? 'border-primary bg-primary/10' 
                                      : 'border-border bg-background hover:border-primary/50'
                                  }`}
                                  title={emoji}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={() => setShowEmojiPicker(false)}
                              className="w-full text-xs px-3 py-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg hover:bg-destructive/20 hover:border-destructive/50 transition-colors"
                            >
                              Cerrar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-foreground">
                          Tareas ({routineFormData.tasks.length})
                        </label>
                        <button
                          onClick={handleAddTaskToRoutine}
                          className="text-xs px-2 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
                        >
                          + Añadir tarea
                        </button>
                      </div>

                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {routineFormData.tasks.map((task, index) => (
                          <div key={index} className="border border-border rounded-lg p-3 bg-background space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <input
                                type="text"
                                value={task.title}
                                onChange={(e) => handleUpdateRoutineTask(index, { title: e.target.value })}
                                className="flex-1 px-2 py-1 text-sm bg-background border border-border rounded text-foreground"
                                placeholder="Nombre de la tarea"
                              />
                              <button
                                onClick={() => handleRemoveRoutineTask(index)}
                                title="Eliminar tarea de rutina"
                                className="p-1 text-destructive hover:bg-destructive/10 rounded"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <select
                                value={task.category}
                                onChange={(e) => handleUpdateRoutineTask(index, { category: e.target.value })}
                                aria-label="Categoría de la tarea"
                                className="text-xs px-2 py-1 bg-background border border-border rounded text-foreground"
                              >
                                <option>Cocina</option>
                                <option>Limpieza</option>
                                <option>Baño</option>
                                <option>Lavandería</option>
                                <option>Compras</option>
                                <option>Jardín</option>
                                <option>Mascotas</option>
                                <option>General</option>
                              </select>
                              <input
                                type="number"
                                value={task.points}
                                onChange={(e) => handleUpdateRoutineTask(index, { points: parseInt(e.target.value) || 0 })}
                                className="text-xs px-2 py-1 bg-background border border-border rounded text-foreground"
                                placeholder="Puntos"
                                min="0"
                              />
                              <select
                                value={task.urgency}
                                onChange={(e) => handleUpdateRoutineTask(index, { urgency: e.target.value as 'low' | 'medium' | 'high' })}
                                aria-label="Urgencia de la tarea"
                                className="text-xs px-2 py-1 bg-background border border-border rounded text-foreground"
                              >
                                <option value="low">Baja</option>
                                <option value="medium">Media</option>
                                <option value="high">Alta</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleSaveCustomRoutine}
                        disabled={!routineFormData.name || routineFormData.tasks.length === 0}
                        className="flex-1 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {editingRoutine ? 'Actualizar' : 'Guardar'} Rutina
                      </button>
                      {(editingRoutine || routineFormData.name || routineFormData.tasks.length > 0) && (
                        <button
                          onClick={handleCancelRoutineForm}
                          className="px-4 py-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-card border-t border-border p-6">
              <button
                onClick={() => {
                  setShowManageRoutines(false);
                  handleCancelRoutineForm();
                }}
                className="w-full px-4 py-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg hover:bg-destructive/20 hover:border-destructive/50 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

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
                onClick={() => setUnassignedTaskDialog({ open: false, task: null, intendedAction: '' })}
                title="Cerrar"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Task info */}
            <div className="bg-muted/50 rounded-lg p-3 mb-4">
              <p className="font-medium text-foreground mb-1">{unassignedTaskDialog.task.title}</p>
              {unassignedTaskDialog.task.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">{unassignedTaskDialog.task.description}</p>
              )}
            </div>

            {/* Message */}
            <p className="text-sm text-muted-foreground mb-4">
              Para poder {unassignedTaskDialog.intendedAction} esta tarea, primero debes asignarla a un miembro del equipo.
            </p>

            {/* Actions */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground mb-2">Asignar a:</p>
              <div className="grid grid-cols-2 gap-2">
                {members.map(member => (
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
                onClick={() => setUnassignedTaskDialog({ open: false, task: null, intendedAction: '' })}
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


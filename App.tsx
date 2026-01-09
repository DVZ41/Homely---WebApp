/**
 * ============================================================================
 * APP.TSX - COMPONENTE PRINCIPAL DE LA APLICACIÓN HOMELY
 * ============================================================================
 * 
 * Este es el componente raíz que gestiona:
 * - Estado global (miembros, tareas, recompensas, notificaciones)
 * - Navegación entre secciones (sidebar)
 * - Tema claro/oscuro
 * - Persistencia en localStorage
 * 
 * ESTRUCTURA DE COLORES:
 * Los colores se definen en globals.css usando variables CSS.
 * Para cambiar un color, busca la variable correspondiente:
 * - --primary: Verde principal (#28AC71)
 * - --accent: Coral de acento (#E76F51)  
 * - --secondary: Gris secundario (#605669)
 * 
 * CÓMO AÑADIR NUEVAS SECCIONES:
 * 1. Importa el nuevo componente
 * 2. Añade entrada en menuItems con icono de lucide-react
 * 3. Añade case en el switch de renderContent()
 * 
 * @author Equipo Homely
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { DashboardPro as Dashboard } from './components/DashboardPro';
import { TaskList } from './components/TaskList';
import { Statistics } from './components/Statistics';
import { Members } from './components/Members';
import { Rewards } from './components/Rewards';
import { MyTasks } from './components/MyTasks';
import { Notifications } from './components/Notifications';
import { Profile } from './components/Profile';
import { Settings } from './components/Settings';
import { Achievements } from './components/Achievements';
import { NotificationBell } from './components/NotificationBell';
import { UserAvatar } from './components/UserAvatar';
import { Logo } from './components/Logo';
import { Home, ListTodo, BarChart3, Users, Moon, Sun, User, Menu, X, Bell, Settings as SettingsIcon, ClipboardCheck, Gift, Award } from 'lucide-react';

export type Member = {
  id: string;
  name: string;
  avatar: string;
  points: number;
  color: string;
  monthlyPoints: number; // Puntos del mes actual (temporales)
  lastMonthReset: string; // Fecha del último reseteo mensual
  level: number; // Nivel del usuario
  experience: number; // Experiencia acumulada
  badges: string[]; // IDs de badges obtenidos
};

export type Task = {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  points: number;
  category: string;
  createdAt: string;
  urgency: 'low' | 'medium' | 'high';
  type: string;
  recurrence: 'puntual' | 'diaria' | 'semanal' | 'mensual';
  nextRecurrenceDate?: string;
  emoji?: string;
  comments: TaskComment[];
  completedAt?: string;
};

export type TaskComment = {
  id: string;
  taskId: string;
  memberId: string;
  message: string;
  timestamp: string;
  attachments?: string[]; // URLs de imágenes
};

export type TaskTemplate = {
  id: string;
  name: string;
  description: string;
  tasks: Omit<Task, 'id' | 'createdAt' | 'assignedTo' | 'comments' | 'completedAt'>[];
  icon: string;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string; // Descripción de cómo obtenerlo
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
};

export type Activity = {
  id: string;
  type:
    | 'task_completed'
    | 'task_created'
    | 'task_assigned'
    | 'task_overdue'
    | 'badge_earned'
    | 'level_up'
    | 'reward_redeemed'
    | 'streak_milestone'
    | 'routine_executed';
  memberId: string;
  message: string;
  timestamp: string;
  data?: Record<string, unknown>; // Datos adicionales específicos del tipo de actividad
};

export type Reward = {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  icon: string;
};

export type RewardRedemption = {
  id: string;
  rewardId: string;
  rewardTitle: string;
  rewardIcon: string;
  memberId: string;
  memberName: string;
  memberAvatar: string;
  memberColor: string;
  pointsSpent: number;
  redeemedAt: string;
  status: 'pending' | 'used';
};

export type Notification = {
  id: string;
  type: 'overdue' | 'due_today' | 'due_tomorrow' | 'task_assigned' | 'task_completed' | 'badge_earned' | 'level_up' | 'streak' | 'leader' | 'reward_available' | 'reward_redeemed' | 'system';
  message: string;
  date: string;
  read: boolean;
  taskId?: string;
  memberId?: string;
  badgeId?: string;
  rewardId?: string;
  actionUrl?: string; // Para navegación al hacer click
};

export type HomeConfig = {
  name: string;
  welcomeMessage: string;
};

function App() {
    // Registrar actividad cuando se ejecuta una rutina desde TaskList
    useEffect(() => {
      const handleRoutineExecuted = (e: CustomEvent) => {
        const { memberId, message, data } = e.detail;
        addActivity('routine_executed', memberId, message, data);
      };
      window.addEventListener('routine_executed', handleRoutineExecuted as EventListener);
      return () => {
        window.removeEventListener('routine_executed', handleRoutineExecuted as EventListener);
      };
    }, []);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'mytasks' | 'tasks' | 'stats' | 'members' | 'rewards' | 'achievements' | 'notifications' | 'profile' | 'settings'>('dashboard');
  const [members, setMembers] = useState<Member[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptions, setRedemptions] = useState<RewardRedemption[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [customRoutines, setCustomRoutines] = useState<TaskTemplate[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [homeConfig, setHomeConfig] = useState<HomeConfig>({ name: 'Mi Hogar', welcomeMessage: 'Bienvenido a Casa García 👋' });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openTaskCreateForm, setOpenTaskCreateForm] = useState(false);
  const [openManageRoutines, setOpenManageRoutines] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [highlightedTaskIds, setHighlightedTaskIds] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const storedDarkMode = localStorage.getItem('homely_dark_mode');
    if (storedDarkMode) {
      const darkMode = JSON.parse(storedDarkMode);
      setIsDarkMode(darkMode);
      if (darkMode) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  // Reset form cuando cambias de tab
  useEffect(() => {
    if (activeTab !== 'tasks') {
      setOpenTaskCreateForm(false);
      setOpenManageRoutines(false);
      setTaskToEdit(null);
    }
    if (activeTab !== 'tasks' && activeTab !== 'mytasks') {
      setHighlightedTaskIds([]);
    }
  }, [activeTab]);

  // useEffect para procesar tareas recurrentes cuando se completan
  useEffect(() => {
    const processedTasksKey = 'homely_processed_recurrent_tasks';
    const storedProcessed = localStorage.getItem(processedTasksKey);
    const permanentProcessedTasks = new Set<string>(storedProcessed ? JSON.parse(storedProcessed) : []);

    tasks.forEach(task => {
      // Condiciones para crear la siguiente tarea recurrente:
      const shouldCreateNext =
        task.status === 'completed' &&           // Tarea completada
        task.recurrence &&                        // Tiene recurrencia definida
        task.recurrence !== 'puntual' &&          // No es puntual (una vez)
        !permanentProcessedTasks.has(task.id);    // No la hemos procesado nunca

      if (!shouldCreateNext) {
        // Debug: mostrar por qué no se crea
        if (task.status === 'completed' && task.recurrence && task.recurrence !== 'puntual' && permanentProcessedTasks.has(task.id)) {
          console.log(`ℹ️ Tarea "${task.title}" ya fue procesada anteriormente (ID: ${task.id})`);
        }
        return;
      }

      // Marcar como procesada permanentemente
      permanentProcessedTasks.add(task.id);
      localStorage.setItem(processedTasksKey, JSON.stringify(Array.from(permanentProcessedTasks)));

      // Calcular la próxima fecha de vencimiento
      // Si la tarea está atrasada, calcular desde HOY, no desde su fecha original
      const today = new Date().toISOString().split('T')[0];
      const baseDate = task.dueDate < today ? today : task.dueDate;
      const nextDueDate = calculateNextRecurrenceDate(baseDate, task.recurrence);

      if (!nextDueDate) {
        console.warn(`⚠️ No se pudo calcular próxima fecha para tarea: ${task.title}`);
        return;
      }

      // Verificar que no exista ya una tarea futura idéntica
      const duplicateExists = tasks.some(t =>
        t.title === task.title &&
        t.dueDate === nextDueDate &&
        t.status !== 'completed' &&
        t.recurrence === task.recurrence &&
        t.id !== task.id  // No contar la tarea actual
      );

      if (duplicateExists) {
        console.log(`ℹ️ Tarea recurrente ya existe para ${task.title} en ${nextDueDate}`);
        return;
      }

      // Log para debugging
      console.log('🔄 TAREA RECURRENTE CREADA AUTOMÁTICAMENTE');
      console.log(`   📝 Título: ${task.title}`);
      console.log(`   🔁 Tipo: ${task.recurrence}`);
      console.log(`   📅 Vencía: ${task.dueDate}`);
      console.log(`   📅 Nueva fecha: ${nextDueDate}`);
      console.log(`   👥 Sin asignar (rotación)`);

      // Crear la nueva tarea recurrente
      addTask({
        title: task.title,
        description: task.description,
        assignedTo: '',  // Sin asignar para rotación equitativa
        dueDate: nextDueDate,
        status: 'pending',
        points: task.points,
        category: task.category,
        recurrence: task.recurrence,
        nextRecurrenceDate: calculateNextRecurrenceDate(nextDueDate, task.recurrence),
        urgency: task.urgency,
        type: task.type,
        comments: [],
      });
    });
  }, [tasks]); // Se ejecuta cada vez que cambia el array de tareas

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('homely_dark_mode', JSON.stringify(newDarkMode));
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Initialize data from localStorage
  useEffect(() => {
    const storedMembers = localStorage.getItem('homely_members');
    const storedTasks = localStorage.getItem('homely_tasks');
    const storedRewards = localStorage.getItem('homely_rewards');
    const storedRedemptions = localStorage.getItem('homely_redemptions');
    const storedNotifications = localStorage.getItem('homely_notifications');
    const storedCustomRoutines = localStorage.getItem('homely_custom_routines');
    const storedHomeConfig = localStorage.getItem('homely_home_config');

    if (storedMembers) {
      // Migrar miembros existentes para asignar badges según sus puntos/tareas
      const parsedMembers = JSON.parse(storedMembers);
      const migratedMembers = parsedMembers.map((member: Member) => {
        const badges = member.badges || [];
        
        // Asignar badges por puntos si no los tiene
        if (member.points >= 100 && !badges.includes('points_100')) {
          badges.push('points_100');
        }
        if (member.points >= 500 && !badges.includes('points_500')) {
          badges.push('points_500');
        }
        if (member.points >= 1000 && !badges.includes('points_1000')) {
          badges.push('points_1000');
        }
        
        // Asignar first_task si tiene puntos (significa que completó tareas)
        if (member.points > 0 && !badges.includes('first_task')) {
          badges.push('first_task');
        }
        
        return { ...member, badges };
      });
      setMembers(migratedMembers);
      localStorage.setItem('homely_members', JSON.stringify(migratedMembers));
    } else {
      // Default members
      const defaultMembers: Member[] = [
        { id: '1', name: 'Ana', avatar: '👩', points: 120, color: '#28AC71', monthlyPoints: 0, lastMonthReset: new Date().toISOString().split('T')[0], level: 1, experience: 120, badges: ['first_task', 'points_100'] },
        { id: '2', name: 'Carlos', avatar: '👨', points: 95, color: '#29541F', monthlyPoints: 0, lastMonthReset: new Date().toISOString().split('T')[0], level: 1, experience: 95, badges: ['first_task'] },
        { id: '3', name: 'María', avatar: '👧', points: 80, color: '#E76F51', monthlyPoints: 0, lastMonthReset: new Date().toISOString().split('T')[0], level: 1, experience: 80, badges: ['first_task'] },
        { id: '4', name: 'Pedro', avatar: '👦', points: 65, color: '#605669', monthlyPoints: 0, lastMonthReset: new Date().toISOString().split('T')[0], level: 1, experience: 65, badges: ['first_task'] },
      ];
      setMembers(defaultMembers);
      localStorage.setItem('homely_members', JSON.stringify(defaultMembers));
    }

    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks);
      // Migrar tareas antiguas que no tienen el campo recurrence
      const migratedTasks = parsedTasks.map((task: Task) => ({
        ...task,
        recurrence: task.recurrence || 'puntual' // Si no tiene recurrence, asignar 'puntual'
      }));
      setTasks(migratedTasks);
      localStorage.setItem('homely_tasks', JSON.stringify(migratedTasks));
    } else {
      // Default tasks
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      const defaultTasks: Task[] = [
        {
          id: '1',
          title: 'Lavar los platos',
          description: 'Lavar todos los platos del desayuno y almuerzo',
          assignedTo: '1',
          dueDate: today,
          status: 'in-progress',
          points: 10,
          category: 'Cocina',
          createdAt: new Date().toISOString(),
          recurrence: 'diaria',
          nextRecurrenceDate: tomorrow,
          urgency: 'medium',
          type: 'Diaria',
          emoji: '🍽️',
          comments: [],
        },
        {
          id: '2',
          title: 'Aspirar la sala',
          description: 'Pasar la aspiradora por toda la sala y el comedor',
          assignedTo: '2',
          dueDate: tomorrow,
          status: 'pending',
          points: 15,
          category: 'Limpieza',
          createdAt: new Date().toISOString(),
          recurrence: 'puntual',
          urgency: 'low',
          type: 'Semanal',
          emoji: '🧹',
          comments: [],
        },
        {
          id: '3',
          title: 'Sacar la basura',
          description: 'Sacar todas las bolsas de basura',
          assignedTo: '3',
          dueDate: today,
          status: 'pending',
          points: 5,
          category: 'General',
          createdAt: new Date().toISOString(),
          recurrence: 'diaria',
          nextRecurrenceDate: tomorrow,
          urgency: 'high',
          type: 'Diaria',
          emoji: '🗑️',
          comments: [],
        },
      ];
      setTasks(defaultTasks);
      localStorage.setItem('homely_tasks', JSON.stringify(defaultTasks));
    }

    if (storedRewards) {
      setRewards(JSON.parse(storedRewards));
    } else {
      // Default rewards
      const defaultRewards: Reward[] = [
        {
          id: '1',
          title: 'Elegir película',
          description: 'Elige la película de la noche de cine familiar',
          pointsCost: 50,
          icon: '🎬',
        },
        {
          id: '2',
          title: 'Día sin tareas',
          description: 'Un día libre sin tareas asignadas',
          pointsCost: 100,
          icon: '🏖️',
        },
        {
          id: '3',
          title: 'Postre favorito',
          description: 'Elige el postre para el fin de semana',
          pointsCost: 30,
          icon: '🍰',
        },
        {
          id: '4',
          title: 'Cena especial',
          description: 'Elige qué cenar el viernes',
          pointsCost: 75,
          icon: '🍕',
        },
      ];
      setRewards(defaultRewards);
      localStorage.setItem('homely_rewards', JSON.stringify(defaultRewards));
    }

    if (storedRedemptions) {
      setRedemptions(JSON.parse(storedRedemptions));
    }

    if (storedCustomRoutines) {
      setCustomRoutines(JSON.parse(storedCustomRoutines));
    }

    // Cargar actividades
    const storedActivities = localStorage.getItem('homely_activities');
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities));
    }

    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    } else {
      // Default notifications
      const defaultNotifications: Notification[] = [
        {
          id: '1',
          type: 'overdue',
          message: 'La tarea "Lavar los platos" está atrasada',
          date: new Date().toISOString(),
          read: false,
          taskId: '1',
        },
        {
          id: '2',
          type: 'system',
          message: 'Se han añadido nuevas tareas para este mes',
          date: new Date().toISOString(),
          read: false,
        },
        {
          id: '3',
          type: 'task_completed',
          message: 'Carlos ha completado la tarea "Aspirar la sala"',
          date: new Date().toISOString(),
          read: false,
          memberId: '2',
          taskId: '2',
        },
      ];
      setNotifications(defaultNotifications);
      localStorage.setItem('homely_notifications', JSON.stringify(defaultNotifications));
    }

    if (storedHomeConfig) {
      setHomeConfig(JSON.parse(storedHomeConfig));
    } else {
      // Default home config
      const defaultHomeConfig: HomeConfig = {
        name: 'Mi Hogar',
        welcomeMessage: 'Bienvenido a Casa García 👋',
      };
      setHomeConfig(defaultHomeConfig);
      localStorage.setItem('homely_home_config', JSON.stringify(defaultHomeConfig));
    }
    
    // Marcar que los datos han sido cargados
    setIsDataLoaded(true);
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (members.length > 0) {
      localStorage.setItem('homely_members', JSON.stringify(members));
    }
  }, [members]);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('homely_tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  useEffect(() => {
    if (rewards.length > 0) {
      localStorage.setItem('homely_rewards', JSON.stringify(rewards));
    }
  }, [rewards]);

  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem('homely_redemptions', JSON.stringify(redemptions));
    }
  }, [redemptions, isDataLoaded]);

  useEffect(() => {
    localStorage.setItem('homely_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('homely_custom_routines', JSON.stringify(customRoutines));
  }, [customRoutines]);

  useEffect(() => {
    if (activities.length > 0) {
      // Mantener solo las últimas 100 actividades para no sobrecargar localStorage
      const recentActivities = activities.slice(-100);
      localStorage.setItem('homely_activities', JSON.stringify(recentActivities));
    }
  }, [activities]);

  useEffect(() => {
    if (homeConfig.name && homeConfig.welcomeMessage) {
      localStorage.setItem('homely_home_config', JSON.stringify(homeConfig));
    }
  }, [homeConfig]);

  // ==================== FUNCIÓN PARA REGISTRAR ACTIVIDADES ====================
  const addActivity = (type: Activity['type'], memberId: string, message: string, data?: Record<string, unknown>) => {
    const newActivity: Activity = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      memberId,
      message,
      timestamp: new Date().toISOString(),
      data,
    };
    setActivities(prev => [...prev, newActivity]);
  };

  // ==================== FUNCIÓN PARA CREAR NOTIFICACIONES ====================
  const addNotification = (
    type: Notification['type'],
    message: string,
    options?: {
      taskId?: string;
      memberId?: string;
      badgeId?: string;
      rewardId?: string;
      actionUrl?: string;
    }
  ) => {
    const newNotification: Notification = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
      date: new Date().toISOString(),
      read: false,
      ...options,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  // ==================== DETECTOR DE NOTIFICACIONES AUTOMÁTICAS ====================
  useEffect(() => {
    if (!isDataLoaded || tasks.length === 0) return;

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // IDs de notificaciones ya enviadas (persistente en localStorage para evitar duplicados)
    const storedSentIds = localStorage.getItem('sentNotificationIds');
    const allSentIds = storedSentIds ? JSON.parse(storedSentIds) : [];

    // Limpiar IDs de días anteriores (mantener solo de hoy)
    const todaySentIds = allSentIds.filter((id: string) => id.startsWith(today));
    
    // Si encontramos IDs de días anteriores, actualizar localStorage
    if (allSentIds.length !== todaySentIds.length) {
      localStorage.setItem('sentNotificationIds', JSON.stringify(todaySentIds));
    }
    
    const saveSentNotificationId = (id: string) => {
      const fullId = `${today}-${id}`;
      if (!todaySentIds.includes(fullId)) {
        todaySentIds.push(fullId);
        localStorage.setItem('sentNotificationIds', JSON.stringify(todaySentIds));
      }
    };

    // 1. Tareas atrasadas
    const overdueTasks = tasks.filter(t => 
      t.dueDate < today && 
      t.status !== 'completed' &&
      t.assignedTo === currentUser?.id
    );
    
    overdueTasks.forEach(task => {
      const notifId = `overdue-${task.id}-${currentUser?.id}`;
      if (!todaySentIds.includes(`${today}-${notifId}`)) {
        addNotification('overdue', `⚠️ La tarea "${task.title}" está atrasada`, {
          taskId: task.id,
          memberId: currentUser?.id,
          actionUrl: 'mytasks'
        });
        saveSentNotificationId(notifId);
      }
    });

    // 2. Tareas que vencen hoy
    const dueTodayTasks = tasks.filter(t => 
      t.dueDate === today && 
      t.status !== 'completed' &&
      t.assignedTo === currentUser?.id
    );
    
    dueTodayTasks.forEach(task => {
      const notifId = `due_today-${task.id}-${currentUser?.id}`;
      if (!todaySentIds.includes(`${today}-${notifId}`)) {
        addNotification('due_today', `📅 La tarea "${task.title}" vence hoy`, {
          taskId: task.id,
          memberId: currentUser?.id,
          actionUrl: 'mytasks'
        });
        saveSentNotificationId(notifId);
      }
    });

    // 3. Tareas que vencen mañana
    const dueTomorrowTasks = tasks.filter(t => 
      t.dueDate === tomorrow && 
      t.status !== 'completed' &&
      t.assignedTo === currentUser?.id
    );
    
    dueTomorrowTasks.forEach(task => {
      const notifId = `due_tomorrow-${task.id}-${currentUser?.id}`;
      if (!todaySentIds.includes(`${today}-${notifId}`)) {
        addNotification('due_tomorrow', `🔔 La tarea "${task.title}" vence mañana`, {
          taskId: task.id,
          memberId: currentUser?.id,
          actionUrl: 'mytasks'
        });
        saveSentNotificationId(notifId);
      }
    });

    // 4. Resumen diario (si hay tareas pendientes para hoy)
    const pendingTodayCount = tasks.filter(t => 
      t.dueDate <= today && 
      t.status !== 'completed' &&
      t.assignedTo === currentUser?.id
    ).length;
    
    const dailySummaryId = `system-daily`;
    if (pendingTodayCount > 0 && !todaySentIds.includes(`${today}-${dailySummaryId}`)) {
      addNotification('system', `📋 Tienes ${pendingTodayCount} tarea${pendingTodayCount > 1 ? 's' : ''} pendiente${pendingTodayCount > 1 ? 's' : ''} para hoy`, {
        memberId: currentUser?.id,
        actionUrl: 'mytasks'
      });
      saveSentNotificationId(dailySummaryId);
    }
  }, [isDataLoaded, tasks, members]); // Re-evaluar cuando cambian las tareas o los miembros

  const addMember = (member: Pick<Member, 'name' | 'avatar' | 'color'>) => {
    const newMember: Member = {
      ...member,
      id: Date.now().toString(),
      points: 0,
      monthlyPoints: 0,
      lastMonthReset: new Date().toISOString().split('T')[0],
      level: 1,
      experience: 0,
      badges: [],
    };
    setMembers([...members, newMember]);
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers(prevMembers => prevMembers.map((m: Member) => m.id === id ? { ...m, ...updates } : m));
  };

  const deleteMember = (id: string) => {
    setMembers(prevMembers => prevMembers.filter((m: Member) => m.id !== id));
    // Unassign tasks from deleted member
    setTasks(prevTasks => prevTasks.map((t: Task) => t.assignedTo === id ? { ...t, assignedTo: '' } : t));
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      comments: [],
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
    // Registrar actividad de tarea creada (siempre, aunque no esté asignada)
    const creator = currentUser ? currentUser.name : 'Usuario';
    const assignedMember = task.assignedTo ? members.find(m => m.id === task.assignedTo) : null;
    const asignacion = assignedMember ? `Asignada a ${assignedMember.name}` : 'Sin asignar';
    const fechaFin = task.dueDate ? `Fecha límite: ${task.dueDate}` : '';
    const recurrencia = task.recurrence ? `Recurrencia: ${task.recurrence}` : '';
    const puntos = typeof task.points === 'number' ? `Puntos: ${task.points}` : '';
    const detalles = [asignacion, fechaFin, recurrencia, puntos].filter(Boolean).join(' | ');
    addActivity(
      'task_created',
      currentUser?.id || '',
      `${creator} ha creado la tarea: "${task.title}". ${detalles}`,
      {
        taskId: newTask.id,
        taskTitle: task.title,
        action: 'created',
        createdBy: creator,
        assignedTo: assignedMember ? assignedMember.name : null,
        dueDate: task.dueDate,
        recurrence: task.recurrence,
        points: task.points
      }
    );

    // Notificación de nueva tarea asignada (solo si está asignada a otra persona)
    if (assignedMember && assignedMember.id !== currentUser?.id) {
      addNotification('task_assigned', `📝 Se te asignó la tarea "${task.title}"`, {
        memberId: assignedMember.id,
        taskId: newTask.id,
        actionUrl: 'mytasks'
      });
    }
  };

  /**
   * Calcula la próxima fecha de vencimiento para tareas recurrentes.
   * IMPORTANTE: La nueva fecha se calcula desde la fecha original de vencimiento,
   * NO desde la fecha actual. Esto asegura que las tareas mantengan su programación
   * incluso si se completan antes de tiempo.
   * 
   * Ejemplos:
   * - DIARIA: Tarea del día 8 → Siguiente día 9 (no importa si se completó el día 7)
   * - SEMANAL: Tarea del lunes 8 → Siguiente lunes 15 (7 días después)
   * - MENSUAL: Tarea del día 8 → Siguiente día 8 del próximo mes
   */
  const calculateNextRecurrenceDate = (
    originalDueDate: string,
    recurrence: 'puntual' | 'diaria' | 'semanal' | 'mensual'
  ): string | undefined => {
    if (recurrence === 'puntual') return undefined;

    const formatDateToLocal = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Usar la fecha original como base, NO la fecha actual
    const baseDate = new Date(originalDueDate + 'T00:00:00');

    switch (recurrence) {
      case 'diaria': {
        // Sumar 1 día a la fecha original
        const nextDate = new Date(baseDate);
        nextDate.setDate(nextDate.getDate() + 1);
        return formatDateToLocal(nextDate);
      }

      case 'semanal': {
        // Sumar 7 días a la fecha original
        const nextDate = new Date(baseDate);
        nextDate.setDate(nextDate.getDate() + 7);
        return formatDateToLocal(nextDate);
      }

      case 'mensual': {
        // Sumar 1 mes a la fecha original
        const nextDate = new Date(baseDate);
        const targetDayOfMonth = baseDate.getDate();
        nextDate.setMonth(nextDate.getMonth() + 1);
        
        // Ajustar el día por si el mes tiene menos días (ej: 31 en febrero)
        const daysInMonth = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate();
        nextDate.setDate(Math.min(targetDayOfMonth, daysInMonth));
        
        return formatDateToLocal(nextDate);
      }

      default:
        return undefined;
    }
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    // Buscar la tarea original
    const taskToUpdate = tasks.find(t => t.id === id);

    // Si la tarea pasa a 'completed' y no tenía completedAt, añadir la fecha
    let updatesWithCompletedAt = { ...updates };
    if (
      taskToUpdate &&
      updates.status === 'completed' &&
      taskToUpdate.status !== 'completed' &&
      !updates.completedAt
    ) {
      updatesWithCompletedAt.completedAt = new Date().toISOString();
    }

    // Detectar si la tarea pasa a atrasada (overdue)
    if (
      taskToUpdate &&
      updates.dueDate &&
      updates.dueDate < new Date().toISOString().split('T')[0] &&
      taskToUpdate.status !== 'completed' &&
      taskToUpdate.status !== 'overdue'
    ) {
      // Registrar actividad de tarea atrasada
      const assignedMember = taskToUpdate.assignedTo ? members.find(m => m.id === taskToUpdate.assignedTo) : null;
      const description = assignedMember
        ? `${assignedMember.name} tiene una tarea atrasada: "${taskToUpdate.title}"`
        : `Una tarea sin asignar está atrasada: "${taskToUpdate.title}"`;
      
      addActivity('task_overdue', taskToUpdate.assignedTo,
        description,
        { taskId: id, taskTitle: taskToUpdate.title, action: 'overdue' }
      );
    }

    // Actualizar la tarea
    setTasks(prevTasks => prevTasks.map((t: Task) => {
      if (t.id === id) {
        return { ...t, ...updatesWithCompletedAt };
      }
      return t;
    }));

    // Luego, si se completó la tarea, actualizar el miembro (fuera del setState para evitar closures)
    if (taskToUpdate && taskToUpdate.status !== 'completed' && updates.status === 'completed' && taskToUpdate.assignedTo) {
      const member = members.find((m: Member) => m.id === taskToUpdate.assignedTo);
      
      // Registrar actividad de tarea completada
      addActivity('task_completed', taskToUpdate.assignedTo,
        `${member?.name || 'Usuario'} completó la tarea "${taskToUpdate.title}"`,
        { taskId: id, taskTitle: taskToUpdate.title, points: taskToUpdate.points, action: 'completed' }
      );
      
      setMembers(prevMembers => {
        const memberToUpdate = prevMembers.find((m: Member) => m.id === taskToUpdate.assignedTo);
        if (memberToUpdate) {
          // Sistema de XP: 1 tarea = 10 XP
          const xpGained = 10;
          const newExperience = memberToUpdate.experience + xpGained;
          const newLevel = Math.floor(newExperience / 100) + 1;

          // Verificar si subió de nivel
          const leveledUp = newLevel > memberToUpdate.level;

          // Contar tareas completadas por este miembro
          const completedTasksCount = tasks.filter(t => t.assignedTo === memberToUpdate.id && t.status === 'completed').length + 1;
          const newPoints = memberToUpdate.points + taskToUpdate.points;

          // Verificar badges ganados
          const newBadges = [...memberToUpdate.badges];
          
          // Badge por nivel (cada 10 niveles)
          if (leveledUp && newLevel % 10 === 0) {
            const levelBadgeId = `level_${newLevel}`;
            if (!newBadges.includes(levelBadgeId)) {
              newBadges.push(levelBadgeId);
            }
          }

          // Badge por primera tarea
          if (completedTasksCount === 1 && !newBadges.includes('first_task')) {
            newBadges.push('first_task');
          }
          
          // Badges por cantidad de tareas (usar >= para no saltar badges)
          if (completedTasksCount >= 10 && !memberToUpdate.badges.includes('tasks_10') && !newBadges.includes('tasks_10')) {
            newBadges.push('tasks_10');
          }
          if (completedTasksCount >= 50 && !memberToUpdate.badges.includes('tasks_50') && !newBadges.includes('tasks_50')) {
            newBadges.push('tasks_50');
          }
          if (completedTasksCount >= 200 && !memberToUpdate.badges.includes('tasks_200') && !newBadges.includes('tasks_200')) {
            newBadges.push('tasks_200');
          }

          // Badges por puntos
          if (newPoints >= 100 && !newBadges.includes('points_100')) {
            newBadges.push('points_100');
          }
          if (newPoints >= 500 && !newBadges.includes('points_500')) {
            newBadges.push('points_500');
          }
          if (newPoints >= 1000 && !newBadges.includes('points_1000')) {
            newBadges.push('points_1000');
          }
          
          // Registrar actividad de subida de nivel
          if (leveledUp) {
            addActivity('level_up', taskToUpdate.assignedTo,
              `${memberToUpdate.name} subió al nivel ${newLevel}! 🎉`,
              { oldLevel: memberToUpdate.level, newLevel }
            );
            // Notificación de subida de nivel
            addNotification('level_up', `🎉 ¡${memberToUpdate.name} subió al nivel ${newLevel}!`, {
              memberId: taskToUpdate.assignedTo,
              actionUrl: 'achievements'
            });
          }
          
          // Registrar actividad de badge ganado
          if (leveledUp && newLevel % 10 === 0) {
            addActivity('badge_earned', taskToUpdate.assignedTo,
              `${memberToUpdate.name} ganó el badge de Nivel ${newLevel}! 🏆`,
              { badgeId: `level_${newLevel}`, badgeName: `Nivel ${newLevel}` }
            );
            // Notificación de badge ganado
            addNotification('badge_earned', `🏆 ¡${memberToUpdate.name} desbloqueó el logro "Nivel ${newLevel}"!`, {
              memberId: taskToUpdate.assignedTo,
              badgeId: `level_${newLevel}`,
              actionUrl: 'achievements'
            });
          }

          // Notificaciones de badges por tareas
          if (completedTasksCount === 1 && !memberToUpdate.badges.includes('first_task')) {
            addNotification('badge_earned', `🏆 ¡${memberToUpdate.name} desbloqueó "Primera Tarea"!`, {
              memberId: taskToUpdate.assignedTo,
              badgeId: 'first_task',
              actionUrl: 'achievements'
            });
          }
          if (completedTasksCount === 10 && !memberToUpdate.badges.includes('tasks_10')) {
            addNotification('badge_earned', `🏆 ¡${memberToUpdate.name} desbloqueó "10 Tareas Completadas"!`, {
              memberId: taskToUpdate.assignedTo,
              badgeId: 'tasks_10',
              actionUrl: 'achievements'
            });
          }
          if (completedTasksCount === 50 && !memberToUpdate.badges.includes('tasks_50')) {
            addNotification('badge_earned', `🏆 ¡${memberToUpdate.name} desbloqueó "50 Tareas Completadas"!`, {
              memberId: taskToUpdate.assignedTo,
              badgeId: 'tasks_50',
              actionUrl: 'achievements'
            });
          }
          if (completedTasksCount === 200 && !memberToUpdate.badges.includes('tasks_200')) {
            addNotification('badge_earned', `🏆 ¡${memberToUpdate.name} desbloqueó "200 Tareas Completadas"!`, {
              memberId: taskToUpdate.assignedTo,
              badgeId: 'tasks_200',
              actionUrl: 'achievements'
            });
          }

          // Notificaciones de badges por puntos
          if (newPoints >= 100 && memberToUpdate.points < 100) {
            addNotification('badge_earned', `⭐ ¡${memberToUpdate.name} alcanzó 100 puntos!`, {
              memberId: taskToUpdate.assignedTo,
              badgeId: 'points_100',
              actionUrl: 'achievements'
            });
          }
          if (newPoints >= 500 && memberToUpdate.points < 500) {
            addNotification('badge_earned', `⭐ ¡${memberToUpdate.name} alcanzó 500 puntos!`, {
              memberId: taskToUpdate.assignedTo,
              badgeId: 'points_500',
              actionUrl: 'achievements'
            });
          }
          if (newPoints >= 1000 && memberToUpdate.points < 1000) {
            addNotification('badge_earned', `⭐ ¡${memberToUpdate.name} alcanzó 1000 puntos!`, {
              memberId: taskToUpdate.assignedTo,
              badgeId: 'points_1000',
              actionUrl: 'achievements'
            });
          }

          // Notificación de tarea completada (para otros miembros)
          if (taskToUpdate.assignedTo !== currentUser?.id) {
            addNotification('task_completed', `✅ ${memberToUpdate.name} completó "${taskToUpdate.title}"`, {
              memberId: taskToUpdate.assignedTo,
              taskId: taskToUpdate.id,
              actionUrl: 'tasks'
            });
          }
          
          return prevMembers.map(m =>
            m.id === memberToUpdate.id
              ? {
                  ...m,
                  points: m.points + taskToUpdate.points,
                  monthlyPoints: m.monthlyPoints + taskToUpdate.points,
                  experience: newExperience,
                  level: newLevel,
                  badges: newBadges
                }
              : m
          );
        }
        return prevMembers;
      });
    }
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter((t: Task) => t.id !== id));
    // Registrar actividad de tarea eliminada
    addActivity('task_created', currentUser?.id || '', `Se ha eliminado una tarea`, { taskId: id, action: 'deleted' });
  };

  // Custom Routines CRUD
  const addCustomRoutine = (routine: Omit<TaskTemplate, 'id'>) => {
    const newRoutine: TaskTemplate = {
      ...routine,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setCustomRoutines(prev => [...prev, newRoutine]);
    // Registrar actividad de rutina creada
    addActivity('routine_executed', currentUser?.id || '', `Se ha creado la rutina "${routine.name}"`, { routineId: newRoutine.id, action: 'created' });
  };

  const updateCustomRoutine = (id: string, updates: Partial<TaskTemplate>) => {
    setCustomRoutines(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    // Registrar actividad de rutina editada
    addActivity('routine_executed', currentUser?.id || '', `Se ha editado la rutina "${updates.name || ''}"`, { routineId: id, action: 'edited' });
  };

  const deleteCustomRoutine = (id: string) => {
    setCustomRoutines(prev => prev.filter(r => r.id !== id));
    // Registrar actividad de rutina eliminada
    addActivity('routine_executed', currentUser?.id || '', `Se ha eliminado una rutina`, { routineId: id, action: 'deleted' });
  };

  const addReward = (reward: Omit<Reward, 'id'>) => {
    const newReward: Reward = {
      ...reward,
      id: Date.now().toString(),
    };
    setRewards([...rewards, newReward]);
    // Registrar actividad de recompensa creada
    addActivity('reward_redeemed', currentUser?.id || '', `Se ha creado la recompensa "${reward.title}"`, { rewardId: newReward.id, action: 'created' });
  };

  const deleteReward = (id: string) => {
    setRewards(rewards.filter((r: Reward) => r.id !== id));
    // Registrar actividad de recompensa eliminada
    addActivity('reward_redeemed', currentUser?.id || '', `Se ha eliminado una recompensa`, { rewardId: id, action: 'deleted' });
  };

  const redeemReward = (rewardId: string, memberId: string) => {
    const reward = rewards.find((r: Reward) => r.id === rewardId);
    const member = members.find((m: Member) => m.id === memberId);
    
    if (reward && member && member.points >= reward.pointsCost) {
      // Actualizar puntos del miembro
      const updatedMembers = members.map(m => 
        m.id === memberId ? { ...m, points: m.points - reward.pointsCost } : m
      );
      setMembers(updatedMembers);
      
      // Crear registro de canje
      const redemption: RewardRedemption = {
        id: Date.now().toString(),
        rewardId: reward.id,
        rewardTitle: reward.title,
        rewardIcon: reward.icon,
        memberId: member.id,
        memberName: member.name,
        memberAvatar: member.avatar,
        memberColor: member.color,
        pointsSpent: reward.pointsCost,
        redeemedAt: new Date().toISOString(),
        status: 'pending',
      };
      
      const updatedRedemptions = [redemption, ...redemptions];
      setRedemptions(updatedRedemptions);
      
      // Guardar inmediatamente en localStorage para evitar pérdida de datos
      localStorage.setItem('homely_members', JSON.stringify(updatedMembers));
      localStorage.setItem('homely_redemptions', JSON.stringify(updatedRedemptions));
      
      // Registrar actividad de canje de recompensa
      addActivity('reward_redeemed', memberId,
        `${member.name} canjeó "${reward.title}" por ${reward.pointsCost} puntos ${reward.icon}`,
        { rewardId, rewardTitle: reward.title, pointsCost: reward.pointsCost, rewardIcon: reward.icon }
      );

      // Notificación de recompensa canjeada (visible para todos los miembros)
      addNotification('reward_redeemed', `🎁 ${member.name} canjeó "${reward.title}" ${reward.icon}`, {
        memberId,
        rewardId,
        actionUrl: 'rewards'
      });
      
      return true;
    }
    return false;
  };

  const updateRedemptionStatus = (redemptionId: string, status: 'pending' | 'used') => {
    setRedemptions(redemptions.map(r => 
      r.id === redemptionId ? { ...r, status } : r
    ));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map((n: Notification) => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map((n: Notification) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n: Notification) => n.id !== id));
  };

  const clearOldNotifications = () => {
    // Eliminar todas las notificaciones leídas
    setNotifications(notifications.filter((n: Notification) => !n.read));
  };

  const handleNotificationClick = (notification: Notification) => {
    markNotificationAsRead(notification.id);
    if (notification.actionUrl) {
      setActiveTab(notification.actionUrl as typeof activeTab);
    }
  };

  const unreadNotifications = notifications.filter((n: Notification) => !n.read).length;
  
  // Usuario actual: usa el ID guardado en estado o el primer miembro por defecto
  const currentUser = members.find(m => m.id === currentUserId) || members[0];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <Logo className="h-8" />
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg hover-icon-button"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Left Sidebar */}
      <aside className={`fixed md:sticky top-0 h-screen w-20 md:w-64 lg:w-72 xl:w-80 bg-card border-r border-border flex flex-col z-40 transition-all duration-300 ease-in-out shadow-2xl md:shadow-none ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Logo - Hidden on mobile, shown on tablet+ */}
        <div className="hidden md:block p-6">
          <Logo className="h-12" />
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-2 md:px-4 pt-20 md:pt-6 pb-6 flex flex-col justify-between overflow-y-auto">
          {/* Sección Superior - Menú Principal */}
          <div className="space-y-2">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-3 rounded-xl ${
                activeTab === 'dashboard'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover-nav'
              }`}
              title="Inicio"
            >
              <Home className="w-5 h-5 shrink-0" />
              <span className="hidden md:inline">Inicio</span>
            </button>
            
            <button
              onClick={() => {
                setActiveTab('mytasks');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-3 rounded-xl ${
                activeTab === 'mytasks'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover-nav'
              }`}
              title="Mis Tareas"
            >
              <ClipboardCheck className="w-5 h-5 shrink-0" />
              <span className="hidden md:inline">Mis Tareas</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('tasks');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-3 rounded-xl ${
                activeTab === 'tasks'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover-nav'
              }`}
              title="Tareas"
            >
              <ListTodo className="w-5 h-5 shrink-0" />
              <span className="hidden md:inline">Tareas</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('stats');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-3 rounded-xl ${
                activeTab === 'stats'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover-nav'
              }`}
              title="Estadísticas"
            >
              <BarChart3 className="w-5 h-5 shrink-0" />
              <span className="hidden md:inline">Estadísticas</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('members');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-3 rounded-xl ${
                activeTab === 'members'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover-nav'
              }`}
              title="Miembros"
            >
              <Users className="w-5 h-5 shrink-0" />
              <span className="hidden md:inline">Miembros</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('rewards');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-3 rounded-xl ${
                activeTab === 'rewards'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover-nav'
              }`}
              title="Recompensas"
            >
              <Gift className="w-5 h-5 shrink-0" />
              <span className="hidden md:inline">Recompensas</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('achievements');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-3 rounded-xl ${
                activeTab === 'achievements'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover-nav'
              }`}
              title="Logros"
            >
              <Award className="w-5 h-5 shrink-0" />
              <span className="hidden md:inline">Logros</span>
            </button>
          </div>

          {/* Sección Inferior - Opciones de Usuario */}
          <div className="space-y-2 mt-4">
            <div className="mb-3 border-t border-border"></div>
            
            <button
              onClick={() => {
                setActiveTab('notifications');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-3 rounded-xl relative ${
                activeTab === 'notifications'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover-nav'
              }`}
              title="Notificaciones"
            >
              <Bell className="w-5 h-5 shrink-0" />
              <span className="hidden md:inline">Notificaciones</span>
              {unreadNotifications > 0 && (
                <span className="absolute top-2 left-8 md:right-3 md:left-auto w-5 h-5 bg-destructive text-primary-foreground rounded-full flex items-center justify-center text-xs font-semibold">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('profile');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-3 rounded-xl ${
                activeTab === 'profile'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover-nav'
              }`}
              title="Mi Perfil"
            >
              <User className="w-5 h-5 shrink-0" />
              <span className="hidden md:inline">Mi Perfil</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('settings');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-3 rounded-xl ${
                activeTab === 'settings'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover-nav'
              }`}
              title="Ajustes"
            >
              <SettingsIcon className="w-5 h-5 shrink-0" />
              <span className="hidden md:inline">Ajustes</span>
            </button>
          </div>
        </nav>

        {/* Bottom Section - Copyright */}
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            Homely © 2024
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto lg:ml-0 pt-16 lg:pt-0">
        {/* Header con información del hogar */}
        <header className="bg-background sticky top-0 z-30">
          <div className="max-w-400 mx-auto px-6 lg:px-8 xl:px-12 pt-6 pb-2">
            <div className="flex items-center justify-between">
              {/* Nombre y mensaje del hogar - Izquierda */}
              <div className="flex flex-col gap-0.5">
                <h1 className="text-xl md:text-2xl font-bold text-foreground">
                  {homeConfig?.name || 'Mi Hogar'}
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  {homeConfig?.welcomeMessage || 'Bienvenido a tu hogar 👋'}
                </p>
              </div>

              {/* Iconos de usuario - Derecha */}
              <div className="flex items-center gap-3">
                <p className="hidden md:block text-sm font-bold text-foreground">
                  {new Date().toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-xl hover-icon-button"
                  title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 text-foreground" />
                  ) : (
                    <Moon className="w-5 h-5 text-foreground" />
                  )}
                </button>
                <NotificationBell 
                  unreadCount={unreadNotifications}
                  onClick={() => {
                    setActiveTab('notifications');
                    setIsSidebarOpen(false);
                  }}
                />
                {currentUser && (
                  <UserAvatar 
                    member={currentUser} 
                    onClick={() => {
                      setActiveTab('profile');
                      setIsSidebarOpen(false);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-400 mx-auto px-6 lg:px-8 xl:px-12 py-8">

          {activeTab === 'dashboard' && (
            <Dashboard 
              members={members} 
              tasks={tasks} 
              homeConfig={homeConfig} 
              currentUser={currentUser}
              activities={activities}
              onNewTaskClick={() => {
                setActiveTab('tasks');
                setOpenTaskCreateForm(true);
              }}
              onManageRoutinesClick={() => {
                setActiveTab('tasks');
                setOpenManageRoutines(true);
              }}
              onNavigateToTasks={(highlightType: 'overdue' | 'overdue-unassigned' | 'unassigned' | 'pending' | 'in-progress' | 'completed' = 'unassigned') => {
                setActiveTab('tasks');
                // Encontrar TODAS las tareas del tipo solicitado
                const today = new Date().toISOString().split('T')[0];
                let targetTasks: Task[] = [];
                
                if (highlightType === 'overdue') {
                  // Todas las tareas atrasadas (con o sin asignar)
                  targetTasks = tasks.filter(t => 
                    t.dueDate < today && 
                    t.status !== 'completed'
                  );
                } else if (highlightType === 'overdue-unassigned') {
                  // Solo tareas atrasadas sin asignar
                  targetTasks = tasks.filter(t => 
                    (!t.assignedTo || t.assignedTo === '') && 
                    t.dueDate < today && 
                    t.status !== 'completed'
                  );
                } else if (highlightType === 'unassigned') {
                  // Tareas sin asignar (incluye atrasadas)
                  targetTasks = tasks.filter(t => 
                    (!t.assignedTo || t.assignedTo === '') && 
                    t.status !== 'completed'
                  );
                } else if (highlightType === 'pending') {
                  // Tareas con status pending
                  targetTasks = tasks.filter(t => t.status === 'pending');
                } else if (highlightType === 'in-progress') {
                  // Tareas con status in-progress
                  targetTasks = tasks.filter(t => t.status === 'in-progress');
                } else if (highlightType === 'completed') {
                  // Tareas completadas
                  targetTasks = tasks.filter(t => t.status === 'completed');
                }
                
                if (targetTasks.length > 0) {
                  setTimeout(() => {
                    // Scroll a la primera tarea
                    const firstTaskElement = document.querySelector(`[data-task-id="${targetTasks[0].id}"]`);
                    if (firstTaskElement) {
                      firstTaskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    // Resaltar TODAS las tareas que cumplen el criterio
                    setHighlightedTaskIds(targetTasks.map(t => t.id));
                    // Limpiar el resaltado después de 3 segundos
                    setTimeout(() => setHighlightedTaskIds([]), 3000);
                  }, 100);
                }
              }}
              onNavigateToProfile={() => {
                setActiveTab('profile');
              }}
              onNavigateToMyTasks={() => {
                setActiveTab('mytasks');
              }}
              onNavigateToMyOverdue={() => {
                setActiveTab('mytasks');
                // Resaltar TODAS las tareas atrasadas del usuario
                setTimeout(() => {
                  const today = new Date().toISOString().split('T')[0];
                  const overdueTasks = tasks.filter(t => 
                    t.assignedTo === currentUser?.id && 
                    t.dueDate < today && 
                    t.status !== 'completed'
                  );
                  
                  if (overdueTasks.length > 0) {
                    const taskElement = document.querySelector(`[data-task-id="${overdueTasks[0].id}"]`);
                    if (taskElement) {
                      taskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    setHighlightedTaskIds(overdueTasks.map(t => t.id));
                    setTimeout(() => setHighlightedTaskIds([]), 3000);
                  }
                }, 100);
              }}
              onNavigateToMyToday={() => {
                setActiveTab('mytasks');
                // Resaltar TODAS las tareas de hoy del usuario
                setTimeout(() => {
                  const today = new Date().toISOString().split('T')[0];
                  const todayTasks = tasks.filter(t => 
                    t.assignedTo === currentUser?.id && 
                    t.dueDate === today && 
                    t.status !== 'completed'
                  );
                  
                  if (todayTasks.length > 0) {
                    const taskElement = document.querySelector(`[data-task-id="${todayTasks[0].id}"]`);
                    if (taskElement) {
                      taskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    setHighlightedTaskIds(todayTasks.map(t => t.id));
                    setTimeout(() => setHighlightedTaskIds([]), 3000);
                  }
                }, 100);
              }}
              onNavigateToMyInProgress={() => {
                setActiveTab('mytasks');
                // Resaltar TODAS las tareas en progreso del usuario
                setTimeout(() => {
                  const inProgressTasks = tasks.filter(t => 
                    t.assignedTo === currentUser?.id && 
                    t.status === 'in-progress'
                  );
                  
                  if (inProgressTasks.length > 0) {
                    const taskElement = document.querySelector(`[data-task-id="${inProgressTasks[0].id}"]`);
                    if (taskElement) {
                      taskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    setHighlightedTaskIds(inProgressTasks.map(t => t.id));
                    setTimeout(() => setHighlightedTaskIds([]), 3000);
                  }
                }, 100);
              }}
              onNavigateToMyCompleted={() => {
                setActiveTab('mytasks');
                // Resaltar TODAS las tareas completadas del usuario
                setTimeout(() => {
                  const completedTasks = tasks.filter(t => 
                    t.assignedTo === currentUser?.id && 
                    t.status === 'completed'
                  );
                  
                  if (completedTasks.length > 0) {
                    const taskElement = document.querySelector(`[data-task-id="${completedTasks[0].id}"]`);
                    if (taskElement) {
                      taskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    setHighlightedTaskIds(completedTasks.map(t => t.id));
                    setTimeout(() => setHighlightedTaskIds([]), 3000);
                  }
                }, 100);
              }}
              onTaskClick={(taskId) => {
                const task = tasks.find(t => t.id === taskId);
                setHighlightedTaskIds([taskId]);
                if (task && currentUser && task.assignedTo === currentUser.id) {
                  setActiveTab('mytasks');
                } else {
                  setActiveTab('tasks');
                }
              }}
            />
          )}
          {activeTab === 'mytasks' && (
            <MyTasks
              tasks={tasks}
              members={members}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              onEditTask={(task) => {
                // Establecer la tarea a editar y cambiar a la pestaña de Tareas
                setTaskToEdit(task);
                setActiveTab('tasks');
              }}
              highlightedTaskId={highlightedTaskIds}
              onClearHighlight={() => setHighlightedTaskIds([])}
              onScrollToMyOverdue={() => {
                // Resaltar TODAS las tareas atrasadas del usuario dentro de la misma sección
                setTimeout(() => {
                  const today = new Date().toISOString().split('T')[0];
                  const overdueTasks = tasks.filter(t => 
                    t.assignedTo === currentUser?.id && 
                    t.dueDate < today && 
                    t.status !== 'completed'
                  );
                  
                  if (overdueTasks.length > 0) {
                    const taskElement = document.querySelector(`[data-task-id="${overdueTasks[0].id}"]`);
                    if (taskElement) {
                      taskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    setHighlightedTaskIds(overdueTasks.map(t => t.id));
                    setTimeout(() => setHighlightedTaskIds([]), 3000);
                  }
                }, 100);
              }}
              onNavigateToTasks={(highlightType: 'overdue' | 'overdue-unassigned' | 'unassigned' | 'pending' | 'in-progress' | 'completed' = 'unassigned') => {
                setActiveTab('tasks');
                // Encontrar TODAS las tareas del tipo solicitado
                const today = new Date().toISOString().split('T')[0];
                let targetTasks: Task[] = [];
                
                if (highlightType === 'overdue') {
                  // Todas las tareas atrasadas (con o sin asignar)
                  targetTasks = tasks.filter(t => 
                    t.dueDate < today && 
                    t.status !== 'completed'
                  );
                } else if (highlightType === 'overdue-unassigned') {
                  // Solo tareas atrasadas sin asignar
                  targetTasks = tasks.filter(t => 
                    (!t.assignedTo || t.assignedTo === '') && 
                    t.dueDate < today && 
                    t.status !== 'completed'
                  );
                } else if (highlightType === 'unassigned') {
                  // Tareas sin asignar (incluye atrasadas)
                  targetTasks = tasks.filter(t => 
                    (!t.assignedTo || t.assignedTo === '') && 
                    t.status !== 'completed'
                  );
                } else if (highlightType === 'pending') {
                  // Tareas con status pending
                  targetTasks = tasks.filter(t => t.status === 'pending');
                } else if (highlightType === 'in-progress') {
                  // Tareas con status in-progress
                  targetTasks = tasks.filter(t => t.status === 'in-progress');
                } else if (highlightType === 'completed') {
                  // Tareas completadas
                  targetTasks = tasks.filter(t => t.status === 'completed');
                }
                
                if (targetTasks.length > 0) {
                  setTimeout(() => {
                    // Scroll a la primera tarea
                    const firstTaskElement = document.querySelector(`[data-task-id="${targetTasks[0].id}"]`);
                    if (firstTaskElement) {
                      firstTaskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    // Resaltar TODAS las tareas que cumplen el criterio
                    setHighlightedTaskIds(targetTasks.map(t => t.id));
                    // Limpiar el resaltado después de 3 segundos
                    setTimeout(() => setHighlightedTaskIds([]), 3000);
                  }, 100);
                }
              }}
            />
          )}
          {activeTab === 'tasks' && (
            <TaskList
              tasks={tasks}
              members={members}
              onAddTask={addTask}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              openCreateForm={openTaskCreateForm}
              openManageRoutines={openManageRoutines}
              taskToEdit={taskToEdit}
              highlightedTaskId={highlightedTaskIds}
              onClearHighlight={() => setHighlightedTaskIds([])}
              customRoutines={customRoutines}
              onAddCustomRoutine={addCustomRoutine}
              onUpdateCustomRoutine={updateCustomRoutine}
              onDeleteCustomRoutine={deleteCustomRoutine}
            />
          )}
          {activeTab === 'stats' && (
            <Statistics tasks={tasks} members={members} />
          )}
          {activeTab === 'members' && (
            <Members
              members={members}
              tasks={tasks}
              onAddMember={addMember}
              onUpdateMember={updateMember}
              onDeleteMember={deleteMember}
            />
          )}
          {activeTab === 'rewards' && (
            <Rewards
              rewards={rewards}
              members={members}
              redemptions={redemptions}
              onAddReward={addReward}
              onDeleteReward={deleteReward}
              onRedeemReward={redeemReward}
              onUpdateRedemptionStatus={updateRedemptionStatus}
            />
          )}
          {activeTab === 'achievements' && (
            <Achievements
              members={members}
              tasks={tasks}
              currentUser={currentUser || members[0]}
            />
          )}
          {activeTab === 'notifications' && (
            <Notifications
              notifications={notifications}
              tasks={tasks}
              members={members}
              onMarkAsRead={markNotificationAsRead}
              onMarkAllAsRead={markAllNotificationsAsRead}
              onDeleteNotification={deleteNotification}
              onNotificationClick={handleNotificationClick}
              onClearOldNotifications={clearOldNotifications}
            />
          )}
          {activeTab === 'profile' && (
            <Profile
              currentUser={currentUser}
              members={members}
              tasks={tasks}
              rewards={rewards}
              onUpdateUser={updateMember}
              onChangeUser={(userId) => setCurrentUserId(userId)}
            />
          )}
          {activeTab === 'settings' && (
            <Settings
              homeConfig={homeConfig}
              onUpdateConfig={setHomeConfig}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
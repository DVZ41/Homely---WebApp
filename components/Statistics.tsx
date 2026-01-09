import { Member, Task } from '../App';
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { TrendingUp, Star, CheckCircle2, Clock } from 'lucide-react';
import { CATEGORIES } from '../lib/categoryUtils';

// Colores usando CSS variables para reactividad al tema
const CHART_COLORS = {
  primary: 'hsl(152, 60%, 42%)',      // Verde principal
  primaryDark: 'hsl(152, 40%, 30%)',  // Verde oscuro
  accent: 'hsl(10, 75%, 60%)',        // Naranja acento
  warning: 'hsl(30, 88%, 64%)',       // Advertencia
  info: 'hsl(193, 37%, 46%)',         // Información
  xp: '#f033e0',                       // XP lila (cambia a #A855F7 en dark mode)
  success: 'hsl(142, 71%, 45%)',     // Verde éxito
};

type StatisticsProps = {
  tasks: Task[];
  members: Member[];
};

export function Statistics({ tasks, members }: StatisticsProps) {
  // Memoizar cálculo de tareas por miembro
  const tasksByMember = useMemo(() => {
    return members.map(member => {
      const memberTasks = tasks.filter(t => t.assignedTo === member.id);
      return {
        name: member.name,
        avatar: member.avatar,
        completed: memberTasks.filter(t => t.status === 'completed').length,
        inProgress: memberTasks.filter(t => t.status === 'in-progress').length,
        pending: memberTasks.filter(t => t.status === 'pending').length,
        total: memberTasks.length,
        points: member.points,
      };
    });
  }, [tasks, members]);

  // Memoizar tareas por categoría
  const tasksByCategory = useMemo(() => {
    return Object.values(CATEGORIES).map(catConfig => {
      const catTasks = tasks.filter(t => t.category === catConfig.name);
      return {
        name: catConfig.name,
        completadas: catTasks.filter(t => t.status === 'completed').length,
        pendientes: catTasks.filter(t => t.status !== 'completed').length,
        total: catTasks.length,
      };
    }).filter(item => item.total > 0);
  }, [tasks]);

  // Memoizar tareas por estado
  const tasksByStatus = useMemo(() => [
    { name: 'Pendientes', value: tasks.filter(t => t.status === 'pending').length, color: CHART_COLORS.warning },
    { name: 'En progreso', value: tasks.filter(t => t.status === 'in-progress').length, color: CHART_COLORS.info },
    { name: 'Completadas', value: tasks.filter(t => t.status === 'completed').length, color: CHART_COLORS.success },
  ], [tasks]);

  // Memoizar progreso semanal - CORREGIDO: usa fecha de completado
  const weeklyData = useMemo(() => {
    const weeks = [];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    for (let i = 3; i >= 0; i--) {
      // Calcular inicio de la semana (lunes)
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (i * 7) - (today.getDay() === 0 ? 6 : today.getDay() - 1));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      // Tareas creadas en esta semana
      const weekTasks = tasks.filter(t => {
        const dueDate = new Date(t.dueDate);
        return dueDate >= weekStart && dueDate <= weekEnd;
      });
      
      // Tareas completadas en esta semana
      const completedTasks = weekTasks.filter(t => {
        if (t.status !== 'completed' || !t.completedAt) return false;
        const completedDate = new Date(t.completedAt);
        return completedDate >= weekStart && completedDate <= weekEnd;
      });
      
      weeks.push({
        name: `Sem ${4 - i}`,
        completadas: completedTasks.length,
        total: weekTasks.length,
        tasa: weekTasks.length > 0 ? Math.round((completedTasks.length / weekTasks.length) * 100) : 0,
      });
    }
    
    return weeks;
  }, [tasks]);

  // Memoizar métricas globales
  const metrics = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const totalPoints = members.reduce((sum, m) => sum + m.points, 0);
    const avgTasksPerMember = members.length > 0 ? Math.round(totalTasks / members.length) : 0;
    
    return { totalTasks, completedTasks, completionRate, totalPoints, avgTasksPerMember };
  }, [tasks, members]);

  // Calcular insights automáticos
  const insights = useMemo(() => {
    const topPerformerData = [...tasksByMember].sort((a, b) => b.points - a.points)[0];
    const topPerformerMember = topPerformerData ? members.find(m => m.name === topPerformerData.name) : null;
    const mostCompletedMember = [...tasksByMember].sort((a, b) => b.completed - a.completed)[0];
    const weekTrend = weeklyData.length >= 2 
      ? weeklyData[weeklyData.length - 1].completadas - weeklyData[weeklyData.length - 2].completadas 
      : 0;
    
    return { 
      topPerformer: topPerformerMember ? { ...topPerformerData, ...topPerformerMember } : null, 
      mostCompletedMember, 
      weekTrend 
    };
  }, [tasksByMember, weeklyData, members]);

  // Colores dinámicos según tema
  const isDarkMode = document.documentElement.classList.contains('dark');
  const gridColor = isDarkMode ? 'rgba(241, 241, 235, 0.1)' : 'rgba(50, 43, 56, 0.1)';
  const textColor = isDarkMode ? '#D8D8D0' : '#605669';
  const tooltipBg = isDarkMode ? '#262A24' : '#FFFFFF';
  const tooltipBorder = isDarkMode ? 'rgba(241, 241, 235, 0.15)' : 'rgba(50, 43, 56, 0.1)';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Estadísticas</h2>
          <p className="text-sm text-muted-foreground">Resumen del rendimiento del hogar</p>
        </div>
      </div>

      {/* Insights automáticos */}
      {metrics.totalTasks > 0 && (
        <div className="bg-linear-to-br from-info/10 via-xp/5 to-info/10 rounded-2xl p-4 border border-info/20 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-info/20 shadow-sm">
              <TrendingUp className="w-5 h-5 text-info" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Resumen del Equipo</h3>
          </div>
          
          <div className="space-y-2">
            {insights.topPerformer && (
              <div className="flex items-center gap-3 p-2.5 bg-card/50 rounded-lg border border-border/50">
                <div 
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg shadow-sm" 
                  style={{ backgroundColor: insights.topPerformer.color || '#28AC71', color: '#ffffff' }}
                >
                  {insights.topPerformer.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Líder del equipo</p>
                  <p className="text-base font-medium text-foreground truncate">
                    {insights.topPerformer.name} · {insights.topPerformer.points} pts
                  </p>
                </div>
                <div className="text-xl">🏆</div>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-2.5 p-2.5 bg-card/50 rounded-lg border border-border/50">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-success/20">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Finalización</p>
                  <p className="text-lg font-semibold text-foreground">{metrics.completionRate}%</p>
                </div>
              </div>
              
              {insights.weekTrend !== 0 && (
                <div className="flex items-center gap-2.5 p-2.5 bg-card/50 rounded-lg border border-border/50">
                  <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${insights.weekTrend > 0 ? 'bg-success/20' : 'bg-warning/20'}`}>
                    <TrendingUp className={`w-4 h-4 ${insights.weekTrend > 0 ? 'text-success' : 'text-warning'}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Esta semana</p>
                    <p className="text-lg font-semibold text-foreground">
                      {insights.weekTrend > 0 ? '+' : ''}{insights.weekTrend}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total de tareas</span>
            <CheckCircle2 className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">{metrics.totalTasks}</p>
          <p className="text-xs text-muted-foreground mt-1">Todas las tareas creadas</p>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Tasa de finalización</span>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">{metrics.completionRate}%</p>
          <p className="text-xs text-muted-foreground mt-1">{metrics.completedTasks} de {metrics.totalTasks} completadas</p>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Puntos totales</span>
            <Star className="w-5 h-5 text-accent" />
          </div>
          <p className="text-3xl font-bold text-foreground">{metrics.totalPoints}</p>
          <p className="text-xs text-muted-foreground mt-1">Entre todos los miembros</p>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Promedio por miembro</span>
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">{metrics.avgTasksPerMember}</p>
          <p className="text-xs text-muted-foreground mt-1">Tareas por persona</p>
        </div>
      </div>

      {/* Main Charts - Solo los 2 más importantes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress - LO MÁS IMPORTANTE */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Progreso Semanal</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-muted-foreground">Completadas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-info" />
                <span className="text-muted-foreground">Total programadas</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: textColor, fontSize: 12 }}
              />
              <YAxis tick={{ fill: textColor, fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: tooltipBg, 
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '8px'
                }}
                formatter={(value: any, name: string, props: any) => {
                  const dataKey = props.dataKey;
                  if (dataKey === 'completadas') return [value, 'Completadas'];
                  if (dataKey === 'total') return [value, 'Total programadas'];
                  return [value, name];
                }}
              />
              <Line 
                type="monotone" 
                dataKey="completadas" 
                stroke={CHART_COLORS.success} 
                strokeWidth={3}
                name="Completadas"
                dot={{ fill: CHART_COLORS.success, r: 6, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8 }}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke={CHART_COLORS.info} 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Total programadas"
                dot={{ fill: CHART_COLORS.info, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Points Leaderboard */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-foreground mb-4">Ranking de Puntos</h3>
          {members.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">Añade miembros para ver estadísticas</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[...tasksByMember].sort((a, b) => b.points - a.points)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis type="number" tick={{ fill: textColor, fontSize: 12 }} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fill: textColor, fontSize: 12 }}
                  width={80}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: tooltipBg, 
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: '8px'
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="points" fill={CHART_COLORS.xp} name="Puntos" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Distribution by Status - Simplificado con mini cards */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-foreground mb-4">Distribución de Tareas</h3>
          <div className="space-y-4">
            {tasksByStatus.map((status) => (
              <div key={status.name} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="text-sm font-medium text-foreground">{status.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">{status.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {metrics.totalTasks > 0 ? Math.round((status.value / metrics.totalTasks) * 100) : 0}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Simplified Performance Table */}
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border overflow-x-auto hover:shadow-md transition-shadow">
        <h3 className="text-lg font-semibold text-foreground mb-4">Rendimiento por Miembro</h3>
        {tasksByMember.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-muted mb-4">
              <Star className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-2">No hay miembros registrados</p>
            <p className="text-sm text-muted-foreground">Añade miembros desde la sección de Miembros para ver sus estadísticas</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Miembro</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Completadas</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Pendientes</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Puntos</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground min-w-[180px]">Progreso</th>
                </tr>
              </thead>
              <tbody>
                {tasksByMember.map(member => {
                  const completionPercent = member.total > 0 
                    ? Math.round((member.completed / member.total) * 100) 
                    : 0;
                  const pendingTotal = member.inProgress + member.pending;
                  
                  return (
                    <tr key={member.name} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{member.avatar}</span>
                          <span className="text-sm font-medium text-foreground">{member.name}</span>
                        </div>
                      </td>
                      <td className="text-center py-4 px-2">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-success/20 text-success text-sm font-semibold">
                          {member.completed}
                        </span>
                      </td>
                      <td className="text-center py-4 px-2">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-warning/20 text-warning text-sm font-semibold">
                          {pendingTotal}
                        </span>
                      </td>
                      <td className="text-center py-4 px-2">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-xp/20 text-xp text-sm font-semibold">
                          <Star className="w-4 h-4" />
                          {member.points}
                        </span>
                      </td>
                      <td className="text-center py-4 px-2">
                        <div className="flex items-center justify-center gap-3">
                          <div className="flex-1 max-w-[120px] bg-muted rounded-full h-2.5 overflow-hidden">
                            <div 
                              className="bg-primary h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${completionPercent}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-foreground min-w-[45px]">{completionPercent}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
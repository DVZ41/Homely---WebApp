import { HomeConfig } from '../App';
import { Home, MessageSquare, Save, Palette, Bell, Shield } from 'lucide-react';
import { useState } from 'react';

type SettingsProps = {
  homeConfig: HomeConfig;
  onUpdateConfig: (config: HomeConfig) => void;
};

export function Settings({ homeConfig, onUpdateConfig }: SettingsProps) {
  const [name, setName] = useState(homeConfig.name);
  const [welcomeMessage, setWelcomeMessage] = useState(homeConfig.welcomeMessage);
  const [hasChanges, setHasChanges] = useState(false);

  const handleNameChange = (value: string) => {
    setName(value);
    setHasChanges(true);
  };

  const handleMessageChange = (value: string) => {
    setWelcomeMessage(value);
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdateConfig({ name, welcomeMessage });
    setHasChanges(false);
  };

  const handleReset = () => {
    setName(homeConfig.name);
    setWelcomeMessage(homeConfig.welcomeMessage);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Configuración</h2>
          <p className="text-sm text-muted-foreground">Personaliza tu experiencia en Homely</p>
        </div>
      </div>

      {/* Configuración del Hogar */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Home className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-foreground font-semibold">Información del Hogar</h3>
            <p className="text-sm text-muted-foreground">Personaliza el nombre y mensaje de tu hogar</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Nombre del Hogar */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nombre del Hogar
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ej: Casa García"
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Este nombre aparecerá en el encabezado de la aplicación
            </p>
          </div>

          {/* Mensaje de Bienvenida */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Mensaje de Bienvenida
            </label>
            <input
              type="text"
              value={welcomeMessage}
              onChange={(e) => handleMessageChange(e.target.value)}
              placeholder="Ej: ¡Bienvenido a Casa García! 👋"
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Este mensaje se mostrará en el dashboard principal
            </p>
          </div>

          {/* Botones de Acción */}
          {hasChanges && (
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary-hover hover:scale-105 hover:shadow-lg transition-all duration-200 font-medium"
              >
                <Save className="w-4 h-4" />
                Guardar Cambios
              </button>
              <button
                onClick={handleReset}
                className="px-5 py-2.5 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors font-medium"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Apariencia */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Palette className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-foreground font-semibold">Apariencia</h3>
            <p className="text-sm text-muted-foreground">Personaliza el aspecto visual de la aplicación</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
            <div>
              <p className="text-sm font-medium text-foreground">Modo Oscuro</p>
              <p className="text-xs text-muted-foreground">Cambia entre modo claro y oscuro</p>
            </div>
            <div className="text-sm text-muted-foreground">
              Usa el botón de luna/sol en el encabezado
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
            <div>
              <p className="text-sm font-medium text-foreground">Paleta de Colores</p>
              <p className="text-xs text-muted-foreground">Verde principal (#28AC71) · Coral acento (#E76F51)</p>
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary border border-border"></div>
              <div className="w-8 h-8 rounded-lg bg-accent border border-border"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Notificaciones */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="text-foreground font-semibold">Preferencias de Notificaciones</h3>
            <p className="text-sm text-muted-foreground">Gestiona cómo recibes las alertas</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
            <div>
              <p className="text-sm font-medium text-foreground">Tareas vencidas</p>
              <p className="text-xs text-muted-foreground">Recibe alertas cuando una tarea esté atrasada</p>
            </div>
            <input type="checkbox" defaultChecked title="Activar notificaciones de tareas vencidas" className="w-5 h-5 accent-primary" />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
            <div>
              <p className="text-sm font-medium text-foreground">Nuevas asignaciones</p>
              <p className="text-xs text-muted-foreground">Notificaciones cuando te asignen una tarea</p>
            </div>
            <input type="checkbox" defaultChecked title="Activar notificaciones de nuevas asignaciones" className="w-5 h-5 accent-primary" />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
            <div>
              <p className="text-sm font-medium text-foreground">Actualizaciones del equipo</p>
              <p className="text-xs text-muted-foreground">Cuando otros miembros completen tareas</p>
            </div>
            <input type="checkbox" defaultChecked title="Activar notificaciones de actualizaciones del equipo" className="w-5 h-5 accent-primary" />
          </div>
        </div>
      </div>

      {/* Privacidad y Datos */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <Shield className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <h3 className="text-foreground font-semibold">Privacidad y Datos</h3>
            <p className="text-sm text-muted-foreground">Gestiona tus datos y preferencias de privacidad</p>
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full text-left p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
            <p className="text-sm font-medium text-foreground mb-1">Exportar mis datos</p>
            <p className="text-xs text-muted-foreground">Descarga una copia de toda tu información</p>
          </button>

          <button className="w-full text-left p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
            <p className="text-sm font-medium text-foreground mb-1">Limpiar historial</p>
            <p className="text-xs text-muted-foreground">Elimina tareas completadas antiguas</p>
          </button>

          <button className="w-full text-left p-4 bg-destructive/10 rounded-xl hover:bg-destructive/20 transition-colors border border-destructive/30">
            <p className="text-sm font-medium text-destructive mb-1">Restablecer aplicación</p>
            <p className="text-xs text-muted-foreground">Elimina todos los datos y vuelve al estado inicial</p>
          </button>
        </div>
      </div>

      {/* Información de la App */}
      <div className="bg-linear-to-br from-primary/5 to-accent/5 rounded-2xl p-6 border border-border">
        <div className="text-center">
          <h3 className="text-foreground font-semibold mb-2">Homely v1.0</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Organiza tu hogar de manera colaborativa
          </p>
          <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
            <span>Hecho con ❤️</span>
            <span>·</span>
            <span>© 2024 Homely</span>
          </div>
        </div>
      </div>
    </div>
  );
}

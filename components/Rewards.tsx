import { useState } from 'react';
import { Member, Reward, RewardRedemption } from '../App';
import { Plus, Trash2, Gift, Star, CheckCircle2, Clock, History } from 'lucide-react';

type RewardsProps = {
  rewards: Reward[];
  members: Member[];
  redemptions: RewardRedemption[];
  onAddReward: (reward: Omit<Reward, 'id'>) => void;
  onDeleteReward: (id: string) => void;
  onRedeemReward: (rewardId: string, memberId: string) => boolean;
  onUpdateRedemptionStatus: (redemptionId: string, status: 'pending' | 'used') => void;
  currentUserId: string | null;
  onChangeUser: (userId: string) => void;
};

const iconOptions = [
  '🎁',
  '🎉',
  '🌟',
  '💎',
  '🏆', // Premios generales
  '🏠',
  '🛋️',
  '🛏️',
  '☕',
  '🍪', // Hogar y descanso
  '🎬',
  '📺',
  '🎮',
  '🎵',
  '📚', // Entretenimiento
  '🍕',
  '🍰',
  '🍔',
  '🍿',
  '🍦', // Comida
  '🏖️',
  '✈️',
  '🚗',
  '🎈',
  '🎊', // Salidas y celebraciones
  '⚽',
  '🏀',
  '🎾',
  '🎸',
  '🎨', // Deportes y hobbies
  '🛒',
  '🪴',
  '🌺',
  '🧺',
  '🛁', // Tareas del hogar y cuidado
  '🎯',
  '🎲',
  '🎪',
  '🎭',
  '🎤', // Actividades especiales
];

export function Rewards({
  rewards,
  members,
  redemptions,
  onAddReward,
  onDeleteReward,
  onRedeemReward,
  onUpdateRedemptionStatus,
  currentUserId,
  onChangeUser: _onChangeUser,
}: RewardsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [showRedeemModal, setShowRedeemModal] = useState(false);

  // Usuario actual (dinámico desde prop, fallback a primer miembro)
  const currentUser = members.find((m) => m.id === currentUserId) || members[0];

  // Filtrar recompensas del usuario actual
  const myRedemptions = currentUser ? redemptions.filter((r) => r.memberId === currentUser.id) : [];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pointsCost: 50,
    icon: '🎁',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddReward(formData);
    setIsAdding(false);
    setFormData({
      title: '',
      description: '',
      pointsCost: 50,
      icon: '🎁',
    });
  };

  const handleRedeem = () => {
    if (selectedReward && selectedMember) {
      const success = onRedeemReward(selectedReward.id, selectedMember);
      if (success) {
        alert('¡Recompensa canjeada exitosamente! 🎉');
        setShowRedeemModal(false);
        setSelectedReward(null);
        setSelectedMember('');
      } else {
        alert('No tienes suficientes puntos para canjear esta recompensa.');
      }
    }
  };

  const openRedeemModal = (reward: Reward) => {
    setSelectedReward(reward);
    setShowRedeemModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Recompensas</h2>
            <p className="text-sm text-muted-foreground">Canjea tus puntos por premios</p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover hover:scale-105 hover:shadow-lg transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Nueva Recompensa
          </button>
        </div>
      </div>

      {/* Member Points Overview */}
      <div className="bg-linear-to-br from-xp/10 via-primary/5 to-xp/10 rounded-2xl p-5 border border-xp/20 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-xp/20 shadow-sm"
            style={{ color: 'var(--xp)' }}
          >
            <Star className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Puntos del Equipo</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {members.length === 0 ? (
            <p className="col-span-full text-muted-foreground text-sm">
              No hay miembros registrados
            </p>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="bg-card/50 rounded-lg p-3 border border-border/50 backdrop-blur-sm hover:border-xp/30 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-lg shadow-sm"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.avatar}
                  </div>
                  <span className="text-foreground text-sm font-medium truncate">
                    {member.name}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-bold text-foreground">{member.points}</span>
                  <span className="text-xs text-muted-foreground">pts</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* My Rewards Section */}
      {currentUser && myRedemptions.length > 0 && (
        <div className="bg-card rounded-2xl p-5 border border-primary/20 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Mis Recompensas</h3>
            <span className="text-xs text-muted-foreground">
              ({myRedemptions.length} canjeadas)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {myRedemptions.map((redemption) => {
              const timeAgo = new Date(redemption.redeemedAt).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={redemption.id}
                  className="flex items-center gap-3 p-4 bg-linear-to-br from-primary/5 to-xp/5 rounded-xl border border-primary/20 hover:shadow-md transition-all"
                >
                  {/* Reward Icon */}
                  <div className="w-14 h-14 bg-linear-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                    {redemption.rewardIcon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate mb-1">
                      {redemption.rewardTitle}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{timeAgo}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-xp">
                        <Star className="w-3 h-3" />
                        {redemption.pointsSpent} pts
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <button
                    onClick={() =>
                      onUpdateRedemptionStatus(
                        redemption.id,
                        redemption.status === 'pending' ? 'used' : 'pending'
                      )
                    }
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0 ${
                      redemption.status === 'used'
                        ? 'bg-success/10 text-success border border-success/20 hover:bg-success/20'
                        : 'bg-info/10 text-info border border-info/20 hover:bg-info/20'
                    }`}
                    title={
                      redemption.status === 'used' ? 'Marcar como pendiente' : 'Marcar como usada'
                    }
                  >
                    {redemption.status === 'used' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Usada
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5" />
                        Pendiente
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Team Redemption History (Informative) */}
      {redemptions.length > 0 && (
        <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-bold text-foreground">Historial del Equipo</h3>
            <span className="text-xs text-muted-foreground">
              ({redemptions.length} Total canjeadas)
            </span>
          </div>

          <div className="space-y-2">
            {redemptions.slice(0, 8).map((redemption) => {
              const timeAgo = new Date(redemption.redeemedAt).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={redemption.id}
                  className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/30 hover:border-muted-foreground/20 transition-colors"
                >
                  {/* Member Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg shadow-sm flex-shrink-0"
                    style={{ backgroundColor: redemption.memberColor }}
                  >
                    {redemption.memberAvatar}
                  </div>

                  {/* Reward Icon */}
                  <div className="w-10 h-10 bg-linear-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                    {redemption.rewardIcon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      <span className="font-semibold">{redemption.memberName}</span> canjeó{' '}
                      <span className="text-primary">{redemption.rewardTitle}</span>
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span>{timeAgo}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-xp">
                        <Star className="w-3 h-3" />
                        {redemption.pointsSpent} pts
                      </span>
                    </div>
                  </div>

                  {/* Status Badge (read-only) */}
                  <div
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                      redemption.status === 'used'
                        ? 'bg-success/10 text-success border border-success/20'
                        : 'bg-info/10 text-info border border-info/20'
                    }`}
                  >
                    {redemption.status === 'used' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        Usada
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" />
                        Pendiente
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {redemptions.length > 8 && (
            <p className="text-center text-xs text-muted-foreground mt-3">
              Mostrando los últimos 8 canjes de {redemptions.length}
            </p>
          )}
        </div>
      )}

      {/* Add Reward Form */}
      {isAdding && (
        <div className="fixed inset-0 bg-background/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="border-b border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Nueva Recompensa</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Crea una recompensa para motivar al equipo
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setFormData({
                      title: '',
                      description: '',
                      pointsCost: 50,
                      icon: '🎁',
                    });
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
                  <label className="block text-sm text-muted-foreground mb-2">Título *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ej: Elegir película"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Descripción *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Descripción de la recompensa"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Costo en puntos *
                  </label>
                  <input
                    type="number"
                    value={formData.pointsCost}
                    onChange={(e) =>
                      setFormData({ ...formData, pointsCost: parseInt(e.target.value) || 0 })
                    }
                    required
                    min="1"
                    title="Introduce el costo en puntos de la recompensa"
                    placeholder="50"
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Icono</label>
                  <div className="grid grid-cols-8 gap-2">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon })}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl border-2 transition-all ${
                          formData.icon === icon
                            ? 'border-primary bg-primary/10 scale-110'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover hover:scale-105 hover:shadow-lg transition-all duration-200"
                  >
                    Crear recompensa
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdding(false);
                      setFormData({
                        title: '',
                        description: '',
                        pointsCost: 50,
                        icon: '🎁',
                      });
                    }}
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

      {/* Rewards Grid */}
      {rewards.length === 0 ? (
        <div className="bg-card rounded-xl p-12 shadow-sm border border-border text-center">
          <Gift className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No hay recompensas disponibles</p>
          <p className="text-sm text-muted-foreground mt-2">
            Crea recompensas para motivar al equipo
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-lg transition-all hover:scale-105"
            >
              <div className="flex flex-col items-center text-center mb-4">
                <div className="w-16 h-16 bg-linear-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center text-3xl mb-3">
                  {reward.icon}
                </div>
                <h3 className="text-foreground mb-1">{reward.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>
                <div className="flex items-center gap-1 text-xp bg-xp/10 px-3 py-1 rounded-full border border-xp/20">
                  <Star className="w-4 h-4" />
                  <span>{reward.pointsCost} puntos</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openRedeemModal(reward)}
                  disabled={members.length === 0}
                  title="Canjear esta recompensa"
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover hover:scale-105 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none text-sm"
                >
                  <Gift className="w-4 h-4" />
                  Canjear
                </button>
                <button
                  onClick={() => {
                    if (confirm('¿Estás seguro de eliminar esta recompensa?')) {
                      onDeleteReward(reward.id);
                    }
                  }}
                  title="Eliminar esta recompensa"
                  className="px-3 py-2 border border-destructive/30 text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Redeem Modal */}
      {showRedeemModal && selectedReward && (
        <div className="fixed inset-0 bg-background/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl p-6 max-w-md w-full shadow-2xl border border-border">
            <h3 className="text-foreground mb-4">Canjear Recompensa</h3>

            <div className="bg-primary/5 rounded-lg p-4 mb-4 border border-primary/10">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{selectedReward.icon}</span>
                <div>
                  <h4 className="text-foreground">{selectedReward.title}</h4>
                  <p className="text-sm text-muted-foreground">{selectedReward.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xp mt-2">
                <Star className="w-4 h-4" />
                <span>Costo: {selectedReward.pointsCost} puntos</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-muted-foreground mb-2">
                ¿Quién canjea esta recompensa?
              </label>
              <select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                title="Selecciona el miembro que canjeará la recompensa"
                className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Selecciona un miembro</option>
                {members.map((member) => {
                  const canAfford = member.points >= selectedReward.pointsCost;
                  return (
                    <option key={member.id} value={member.id} disabled={!canAfford}>
                      {member.avatar} {member.name} ({member.points} pts){' '}
                      {!canAfford && '- No tiene suficientes puntos'}
                    </option>
                  );
                })}
              </select>
            </div>

            {selectedMember && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4 text-sm">
                <p className="text-foreground">
                  {(() => {
                    const member = members.find((m) => m.id === selectedMember);
                    if (member) {
                      const remaining = member.points - selectedReward.pointsCost;
                      return remaining >= 0
                        ? `Después del canje, ${member.name} tendrá ${remaining} puntos.`
                        : `${member.name} no tiene suficientes puntos para esta recompensa.`;
                    }
                    return '';
                  })()}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleRedeem}
                disabled={
                  !selectedMember ||
                  (() => {
                    const member = members.find((m) => m.id === selectedMember);
                    return !member || member.points < selectedReward.pointsCost;
                  })()
                }
                className="flex-1 px-4 py-2 bg-linear-to-r from-primary to-primary-hover text-white rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar canje
              </button>
              <button
                onClick={() => {
                  setShowRedeemModal(false);
                  setSelectedReward(null);
                  setSelectedMember('');
                }}
                className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
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

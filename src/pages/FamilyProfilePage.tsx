// src/pages/FamilyProfilePage.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { FamilyMember } from '../types';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Clock, 
  Trash2, 
  CheckCircle2, 
  Mail, 
  User, 
  ArrowRight,
  Shield,
  Activity,
  UserCheck
} from 'lucide-react';

export const FamilyProfilePage: React.FC = () => {
  const { user, switchUserRole } = useAuth();
  const { 
    familyMembers, 
    inviteMember, 
    updateMemberRole, 
    removeMember, 
    activityLogs,
    child 
  } = useData();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRelationship, setInviteRelationship] = useState<FamilyMember['relationship']>('Папа');
  const [inviteRole, setInviteRole] = useState<FamilyMember['role']>('editor');
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;

    inviteMember(inviteEmail, inviteName, inviteRelationship, inviteRole);
    setInviteSuccess(true);
    setTimeout(() => {
      setInviteEmail('');
      setInviteName('');
      setIsInviteOpen(false);
      setInviteSuccess(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sage-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sage-600 bg-sage-100 px-3 py-1 rounded-full">
              Командная забота
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-sage-900 mt-2">
            Семейный профиль и совместный доступ
          </h1>
          <p className="text-xs sm:text-sm text-sage-600 mt-1">
            Приглашайте второго родителя и близких, управляйте правами и отслеживайте историю действий
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-sage-800 hover:bg-sage-900 text-white font-semibold text-xs shadow-sm transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Пригласить в семью</span>
        </button>
      </div>

      {/* Switch demo active member for testing co-parenting */}
      <div className="p-4 rounded-3xl bg-softblue-50/70 border border-softblue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <UserCheck className="w-5 h-5 text-softblue-700 shrink-0" />
          <div className="text-xs text-softblue-900">
            <strong>Быстрое переключение для теста:</strong> Вы вошли как <strong>{user?.name}</strong> ({user?.role === 'father' ? 'Папа' : 'Мама'}).
          </div>
        </div>
        <div className="flex items-center gap-2">
          {familyMembers.map((member) => (
            <button
              key={member.id}
              onClick={() => switchUserRole(member.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                user?.id === member.id
                  ? 'bg-softblue-700 text-white shadow-xs'
                  : 'bg-white text-softblue-900 border border-softblue-200 hover:bg-softblue-100'
              }`}
            >
              {member.name.split(' ')[0]} ({member.relationship})
            </button>
          ))}
        </div>
      </div>

      {/* Family Members List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200/80 shadow-soft space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-sage-100">
          <div>
            <h3 className="text-lg font-bold font-display text-sage-900">
              Участники семейной карты малыша ({familyMembers.length})
            </h3>
            <p className="text-xs text-sage-500 mt-0.5">
              Все участники имеют защищенный доступ к профилю {child.name}
            </p>
          </div>
        </div>

        <div className="space-y-3.5">
          {familyMembers.map((member) => {
            const isCurrent = user?.id === member.id;
            return (
              <div
                key={member.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCurrent ? 'bg-sage-50/60 border-sage-300 ring-1 ring-sage-300' : 'bg-warmbeige-50/50 border-sage-200'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-sage-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-sage-900">{member.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sage-200/70 text-sage-800">
                        {member.relationship}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Это вы
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-sage-500 mt-0.5 flex items-center gap-2">
                      <span>{member.email}</span>
                      <span>•</span>
                      <span>Активность: {member.lastActive}</span>
                    </div>
                  </div>
                </div>

                {/* Role and Permissions Control */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <select
                    disabled={member.role === 'owner'}
                    value={member.role}
                    onChange={(e) => updateMemberRole(member.id, e.target.value as any)}
                    className="px-3 py-1.5 rounded-xl border border-sage-200 text-xs font-semibold text-sage-800 bg-white disabled:bg-sage-100 disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-sage-500/30"
                  >
                    <option value="owner">Владелец (Мама)</option>
                    <option value="editor">Редактор (Полный доступ)</option>
                    <option value="viewer">Только просмотр</option>
                  </select>

                  {member.role !== 'owner' && (
                    <button
                      onClick={() => {
                        if (confirm(`Удалить доступ для ${member.name}?`)) {
                          removeMember(member.id);
                        }
                      }}
                      className="p-2 rounded-xl text-sage-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Отозвать доступ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit Trail: Activity Log */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200/80 shadow-soft space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-sage-100">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-sage-700" />
            <h3 className="text-lg font-bold font-display text-sage-900">
              История действий семьи (Аудит-лог)
            </h3>
          </div>
          <span className="text-xs text-sage-500 font-medium">Безопасность и синхронизация</span>
        </div>

        <div className="divide-y divide-sage-100">
          {activityLogs.map((log) => (
            <div key={log.id} className="py-3.5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-sage-100 text-sage-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-sage-900">{log.action}</div>
                  <div className="text-[11px] text-sage-500 mt-0.5">Инициатор: <strong>{log.userName}</strong></div>
                </div>
              </div>
              <span className="text-[11px] text-sage-400 shrink-0">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Member Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-soft-xl border border-sage-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-sage-100 flex items-center justify-between bg-warmbeige-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sage-800 text-white flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-sage-900 font-display">Пригласить в семью</h3>
              </div>
              <button
                onClick={() => setIsInviteOpen(false)}
                className="text-sage-400 hover:text-sage-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-sage-700 mb-1">
                  Имя и фамилия <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Например: Михаил Сабитов"
                  className="w-full px-4 py-2.5 rounded-xl border border-sage-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-700 mb-1">
                  Email адрес <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="partner@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-sage-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-sage-700 mb-1">
                    Кем приходится
                  </label>
                  <select
                    value={inviteRelationship}
                    onChange={(e) => setInviteRelationship(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-sage-200 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-sage-500/30"
                  >
                    <option value="Папа">Папа</option>
                    <option value="Мама">Мама</option>
                    <option value="Бабушка">Бабушка</option>
                    <option value="Дедушка">Дедушка</option>
                    <option value="Няня">Няня</option>
                    <option value="Педиатр">Личный педиатр</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-sage-700 mb-1">
                    Уровень доступа
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-sage-200 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-sage-500/30"
                  >
                    <option value="editor">Редактор (Дневник + замеры)</option>
                    <option value="viewer">Только просмотр</option>
                  </select>
                </div>
              </div>

              {inviteSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Приглашение отправлено! Пользователь добавлен в семью.</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-sage-600 hover:text-sage-800"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sage-800 hover:bg-sage-900 text-white font-semibold text-xs shadow-sm"
                >
                  Отправить приглашение
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

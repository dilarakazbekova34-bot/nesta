// src/pages/SettingsPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  Settings,
  Baby,
  Heart,
  Bell,
  Shield,
  Eye,
  Info,
  Moon,
  Sun,
  Monitor,
  ChevronRight,
  Check,
  Download,
  Trash2,
  Lock,
  Fingerprint,
  Globe,
  ChevronDown,
  User,
  Save,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';

// ─── Toggle Switch Component ────────────────────────────────────────────────
const Toggle: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}> = ({ checked, onChange, label, description }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="text-sm font-medium text-sage-800">{label}</p>
      {description && <p className="text-xs text-sage-500 mt-0.5">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2 ${
        checked ? 'bg-sage-600' : 'bg-sage-200'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

// ─── Input Field Component ───────────────────────────────────────────────────
const Field: React.FC<{
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  readOnly?: boolean;
  placeholder?: string;
}> = ({ label, value, onChange, type = 'text', readOnly = false, placeholder }) => (
  <div>
    <label className="block text-xs font-semibold text-sage-700 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      readOnly={readOnly}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 rounded-xl border border-sage-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/30 ${
        readOnly ? 'bg-sage-50 text-sage-500 cursor-not-allowed' : 'bg-white text-sage-900'
      }`}
    />
  </div>
);

// ─── Save Button with Success State ─────────────────────────────────────────
const SaveButton: React.FC<{ onSave: () => void; label?: string }> = ({
  onSave,
  label = 'Сохранить',
}) => {
  const [saved, setSaved] = useState(false);
  const handleClick = () => {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  return (
    <div className="flex items-center justify-end gap-3 pt-3">
      {saved && (
        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Сохранено!
        </span>
      )}
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-sage-800 hover:bg-sage-900 text-white font-semibold text-xs shadow-sm transition-all"
      >
        <Save className="w-3.5 h-3.5" />
        {label}
      </button>
    </div>
  );
};

// ─── Section Card ────────────────────────────────────────────────────────────
const SectionCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200/80 shadow-soft space-y-5 animate-in fade-in duration-200">
    <div className="flex items-center gap-2 pb-4 border-b border-sage-100">
      <span className="text-sage-700">{icon}</span>
      <h3 className="text-lg font-bold font-display text-sage-900">{title}</h3>
    </div>
    {children}
  </div>
);

// ─── Sidebar Nav Item ────────────────────────────────────────────────────────
const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-sm font-medium transition-all ${
      active
        ? 'bg-sage-100 text-sage-900 font-semibold'
        : 'text-sage-600 hover:bg-sage-50 hover:text-sage-800'
    }`}
  >
    <span className={active ? 'text-sage-800' : 'text-sage-500'}>{icon}</span>
    {label}
    {active && <ChevronRight className="w-4 h-4 ml-auto text-sage-400" />}
  </button>
);

// ─── Sections Config ─────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'profile', label: 'Профиль', icon: <User className="w-4 h-4" /> },
  { id: 'child', label: 'Ребёнок', icon: <Baby className="w-4 h-4" /> },
  { id: 'pregnancy', label: 'Беременность', icon: <Heart className="w-4 h-4" /> },
  { id: 'appearance', label: 'Внешний вид', icon: <Eye className="w-4 h-4" /> },
  { id: 'notifications', label: 'Уведомления', icon: <Bell className="w-4 h-4" /> },
  { id: 'privacy', label: 'Конфиденциальность', icon: <Shield className="w-4 h-4" /> },
  { id: 'about', label: 'О приложении', icon: <Info className="w-4 h-4" /> },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function calcPregnancyWeek(lmpDate: string): number {
  if (!lmpDate) return 0;
  const lmp = new Date(lmpDate);
  const diff = Date.now() - lmp.getTime();
  const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
  return Math.max(0, Math.min(42, weeks));
}

function calcDueDate(lmpDate: string): string {
  if (!lmpDate) return '';
  const lmp = new Date(lmpDate);
  lmp.setDate(lmp.getDate() + 280);
  return lmp.toISOString().split('T')[0];
}

const handleExportData = () => {
  const data: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('nesta_')) {
      try {
        data[key] = JSON.parse(localStorage.getItem(key)!);
      } catch {
        data[key] = localStorage.getItem(key);
      }
    }
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `nesta-data-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// ─── Main Component ──────────────────────────────────────────────────────────
export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { child, updateChild, pregnancy, updatePregnancy } = useData();

  // ── Active section
  const [activeSection, setActiveSection] = useState('profile');

  // ── Theme (local state approach — works without ThemeContext)
  const [localTheme, setLocalTheme] = React.useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('nesta_theme') as 'light' | 'dark' | 'system') || 'light';
  });
  const applyTheme = (t: 'light' | 'dark' | 'system') => {
    setLocalTheme(t);
    localStorage.setItem('nesta_theme', t);
    if (t === 'dark') document.documentElement.classList.add('dark');
    else if (t === 'light') document.documentElement.classList.remove('dark');
    else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  };

  // ── Profile state
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [userRole, setUserRole] = useState<'мама' | 'папа' | 'опекун'>('мама');

  // ── Child state
  const [childName, setChildName] = useState(child.name || '');
  const [childBirthdate, setChildBirthdate] = useState(child.birthDate || '');
  const [childGender, setChildGender] = useState<'female' | 'male' | ''>(child.gender || '');
  const [bloodType, setBloodType] = useState(child.bloodType || '');
  const [pediatrician, setPediatrician] = useState(child.pediatricianName || '');
  const [clinic, setClinic] = useState(child.clinic || '');

  // ── Pregnancy state
  const [lmpDate, setLmpDate] = useState(pregnancy?.lmpDate || '');
  const [obgyn, setObgyn] = useState(pregnancy?.doctorName || '');
  const [hospital, setHospital] = useState(pregnancy?.hospital || '');
  const dueDate = calcDueDate(lmpDate);
  const currentWeek = calcPregnancyWeek(lmpDate);

  // ── Font size
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  // ── Notifications
  const getNotif = (key: string, def: boolean) => {
    const v = localStorage.getItem(`nesta_notif_${key}`);
    return v === null ? def : v === 'true';
  };
  const [notifExams, setNotifExams] = useState(() => getNotif('exams', true));
  const [notifPreg, setNotifPreg] = useState(() => getNotif('pregnancy_updates', true));
  const [notifDev, setNotifDev] = useState(() => getNotif('dev_tips', true));
  const [notifVax, setNotifVax] = useState(() => getNotif('vaccinations', true));
  const [notifPush, setNotifPush] = useState(() => getNotif('push', false));

  const saveNotif = (key: string, value: boolean) => {
    localStorage.setItem(`nesta_notif_${key}`, String(value));
  };

  // ── Privacy
  const [pinEnabled, setPinEnabled] = useState(false);
  const [bioEnabled, setBioEnabled] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ─── Section renderers ───────────────────────────────────────────────────

  const renderProfile = () => (
    <SectionCard icon={<User className="w-5 h-5" />} title="Профиль">
      {/* Avatar placeholder */}
      <div className="flex items-center gap-4 pb-4">
        <div className="w-16 h-16 rounded-2xl bg-sage-100 border-2 border-dashed border-sage-300 flex flex-col items-center justify-center cursor-pointer hover:bg-sage-50 transition-colors group">
          <User className="w-6 h-6 text-sage-400 group-hover:text-sage-500" />
          <span className="text-[9px] text-sage-400 mt-0.5 font-medium">Фото</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-sage-800">{displayName || 'Пользователь'}</p>
          <p className="text-xs text-sage-500">{user?.email || ''}</p>
          <button className="mt-1 text-xs text-sage-600 underline underline-offset-2 hover:text-sage-800">
            Загрузить фото
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Отображаемое имя"
          value={displayName}
          onChange={setDisplayName}
          placeholder="Ваше имя"
        />
        <Field
          label="Email"
          value={user?.email || ''}
          readOnly
          type="email"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-sage-700 mb-2">Роль</label>
        <div className="flex gap-2">
          {(['мама', 'папа', 'опекун'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setUserRole(role)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all capitalize ${
                userRole === role
                  ? 'bg-sage-800 text-white border-sage-800 shadow-sm'
                  : 'bg-white text-sage-600 border-sage-200 hover:border-sage-400'
              }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <SaveButton onSave={() => { /* profile save logic */ }} label="Сохранить профиль" />
    </SectionCard>
  );

  const renderChild = () => (
    <SectionCard icon={<Baby className="w-5 h-5" />} title="Ребёнок">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Имя малыша" value={childName} onChange={setChildName} placeholder="Имя" />
        <Field
          label="Дата рождения"
          value={childBirthdate}
          onChange={setChildBirthdate}
          type="date"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-sage-700 mb-1">Пол</label>
          <select
            value={childGender}
            onChange={(e) => setChildGender(e.target.value as 'female' | 'male' | '')}
            className="w-full px-4 py-2.5 rounded-xl border border-sage-200 text-sm bg-white text-sage-900 focus:outline-none focus:ring-2 focus:ring-sage-500/30"
          >
            <option value="">— выберите —</option>
            <option value="male">Мальчик</option>
            <option value="female">Девочка</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-sage-700 mb-1">
            Группа крови и резус
          </label>
          <select
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-sage-200 text-sm bg-white text-sage-900 focus:outline-none focus:ring-2 focus:ring-sage-500/30"
          >
            <option value="">— выберите —</option>
            {['I+', 'I−', 'II+', 'II−', 'III+', 'III−', 'IV+', 'IV−'].map((bt) => (
              <option key={bt} value={bt}>{bt}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-1 border-t border-sage-100">
        <p className="text-xs font-semibold text-sage-500 uppercase tracking-wider mb-3">
          Медицинская информация
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Лечащий педиатр"
            value={pediatrician}
            onChange={setPediatrician}
            placeholder="ФИО врача"
          />
          <Field
            label="Поликлиника / Клиника"
            value={clinic}
            onChange={setClinic}
            placeholder="Название учреждения"
          />
        </div>
      </div>

      <SaveButton
        onSave={() =>
          updateChild({
            name: childName,
            birthDate: childBirthdate,
            gender: childGender as any,
            bloodType,
            pediatricianName: pediatrician,
            clinic,
          })
        }
        label="Сохранить данные ребёнка"
      />
    </SectionCard>
  );

  const renderPregnancy = () => (
    <SectionCard icon={<Heart className="w-5 h-5" />} title="Беременность">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Дата последней менструации (ДПМ)"
          value={lmpDate}
          onChange={setLmpDate}
          type="date"
        />
        <div>
          <label className="block text-xs font-semibold text-sage-700 mb-1">
            Предполагаемая дата родов
          </label>
          <div className="w-full px-4 py-2.5 rounded-xl border border-sage-200 text-sm bg-sage-50 text-sage-600">
            {dueDate || '— укажите ДПМ —'}
          </div>
        </div>
      </div>

      {currentWeek > 0 && (
        <div className="bg-gradient-to-r from-sage-50 to-softblue-50 rounded-2xl p-4 flex items-center gap-4 border border-sage-100">
          <div className="w-12 h-12 rounded-2xl bg-sage-100 flex items-center justify-center">
            <Heart className="w-5 h-5 text-sage-700" />
          </div>
          <div>
            <p className="text-xs text-sage-500 font-medium">Текущая неделя беременности</p>
            <p className="text-2xl font-bold text-sage-900">
              {currentWeek}
              <span className="text-sm font-normal text-sage-600 ml-1">нед.</span>
            </p>
          </div>
        </div>
      )}

      <div className="pt-1 border-t border-sage-100">
        <p className="text-xs font-semibold text-sage-500 uppercase tracking-wider mb-3">
          Акушер-гинеколог
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Врач акушер-гинеколог"
            value={obgyn}
            onChange={setObgyn}
            placeholder="ФИО врача"
          />
          <Field
            label="Роддом / Больница"
            value={hospital}
            onChange={setHospital}
            placeholder="Название учреждения"
          />
        </div>
      </div>

      <SaveButton
        onSave={() =>
          updatePregnancy({
            lmpDate,
            doctorName: obgyn,
            hospital,
          })
        }
        label="Сохранить данные беременности"
      />
    </SectionCard>
  );

  const renderAppearance = () => (
    <SectionCard icon={<Eye className="w-5 h-5" />} title="Внешний вид">
      {/* Theme selection */}
      <div>
        <p className="text-xs font-semibold text-sage-500 uppercase tracking-wider mb-3">Тема</p>
        <div className="grid grid-cols-3 gap-3">
          {(
            [
              { id: 'light', label: 'Светлая', icon: <Sun className="w-6 h-6" /> },
              { id: 'dark', label: 'Тёмная', icon: <Moon className="w-6 h-6" /> },
              { id: 'system', label: 'Системная', icon: <Monitor className="w-6 h-6" /> },
            ] as const
          ).map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => applyTheme(id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                localTheme === id
                  ? 'border-sage-800 bg-sage-100 shadow-sm'
                  : 'border-sage-100 bg-white hover:border-sage-300 hover:bg-sage-50'
              }`}
            >
              <span
                className={`${localTheme === id ? 'text-sage-800' : 'text-sage-400'}`}
              >
                {icon}
              </span>
              <span
                className={`text-xs font-semibold ${
                  localTheme === id ? 'text-sage-900' : 'text-sage-500'
                }`}
              >
                {label}
              </span>
              {localTheme === id && (
                <span className="w-4 h-4 rounded-full bg-sage-800 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="pt-1 border-t border-sage-100">
        <p className="text-xs font-semibold text-sage-500 uppercase tracking-wider mb-3">Язык</p>
        <div className="flex flex-col gap-2">
          {[
            { label: 'Русский', active: true },
            { label: 'Қазақша', active: false },
            { label: 'English', active: false },
          ].map(({ label, active }) => (
            <div
              key={label}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border ${
                active
                  ? 'border-sage-300 bg-sage-50'
                  : 'border-sage-100 bg-white opacity-60'
              }`}
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-sage-500" />
                <span className="text-sm text-sage-800 font-medium">{label}</span>
              </div>
              {active ? (
                <span className="text-xs font-semibold text-sage-700 bg-sage-200 px-2 py-0.5 rounded-full">
                  Выбран
                </span>
              ) : (
                <span className="text-xs font-medium text-warmbeige-600 bg-warmbeige-100 px-2 py-0.5 rounded-full">
                  скоро
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Font size */}
      <div className="pt-1 border-t border-sage-100">
        <p className="text-xs font-semibold text-sage-500 uppercase tracking-wider mb-3">
          Размер шрифта
        </p>
        <div className="flex gap-3">
          {(['normal', 'large'] as const).map((size) => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                fontSize === size
                  ? 'border-sage-800 bg-sage-100 text-sage-900'
                  : 'border-sage-100 bg-white text-sage-500 hover:border-sage-300'
              }`}
            >
              {size === 'normal' ? 'Нормальный' : (
                <span className="text-base">Крупный</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </SectionCard>
  );

  const renderNotifications = () => (
    <SectionCard icon={<Bell className="w-5 h-5" />} title="Уведомления">
      <div className="divide-y divide-sage-100">
        <Toggle
          label="Напоминания об обследованиях"
          description="Уведомления о предстоящих медосмотрах и анализах"
          checked={notifExams}
          onChange={(v) => { setNotifExams(v); saveNotif('exams', v); }}
        />
        <Toggle
          label="Еженедельные обновления беременности"
          description="Информация о развитии малыша по неделям"
          checked={notifPreg}
          onChange={(v) => { setNotifPreg(v); saveNotif('pregnancy_updates', v); }}
        />
        <Toggle
          label="Советы по развитию ребёнка"
          description="Персонализированные рекомендации и активности"
          checked={notifDev}
          onChange={(v) => { setNotifDev(v); saveNotif('dev_tips', v); }}
        />
        <Toggle
          label="Напоминания о вакцинации"
          description="Оповещения о плановых прививках"
          checked={notifVax}
          onChange={(v) => { setNotifVax(v); saveNotif('vaccinations', v); }}
        />
        <Toggle
          label="Пуш-уведомления"
          description="Получать уведомления даже при закрытом приложении"
          checked={notifPush}
          onChange={(v) => { setNotifPush(v); saveNotif('push', v); }}
        />
      </div>
    </SectionCard>
  );

  const renderPrivacy = () => (
    <SectionCard icon={<Shield className="w-5 h-5" />} title="Конфиденциальность и безопасность">
      <div className="divide-y divide-sage-100">
        <Toggle
          label="PIN-код для входа"
          description="Защитить приложение 4-значным PIN-кодом"
          checked={pinEnabled}
          onChange={setPinEnabled}
        />
        <Toggle
          label="Биометрическая аутентификация"
          description="Вход по отпечатку пальца или Face ID"
          checked={bioEnabled}
          onChange={setBioEnabled}
        />
      </div>

      <div className="pt-2 space-y-3">
        <p className="text-xs font-semibold text-sage-500 uppercase tracking-wider">Данные</p>

        <button
          onClick={handleExportData}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-sage-200 bg-white hover:bg-sage-50 transition-all group"
        >
          <Download className="w-4 h-4 text-sage-600 group-hover:text-sage-800" />
          <div className="text-left">
            <p className="text-sm font-medium text-sage-800">Экспортировать мои данные</p>
            <p className="text-xs text-sage-500">Скачать все данные в формате JSON</p>
          </div>
          <ChevronRight className="w-4 h-4 text-sage-300 ml-auto" />
        </button>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-red-100 bg-red-50 hover:bg-red-100 transition-all group"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
          <div className="text-left">
            <p className="text-sm font-medium text-red-700">Удалить аккаунт</p>
            <p className="text-xs text-red-400">Это действие необратимо</p>
          </div>
          <ChevronRight className="w-4 h-4 text-red-300 ml-auto" />
        </button>
      </div>

      <div className="bg-sage-50 rounded-2xl p-4 border border-sage-100 text-xs text-sage-600 space-y-1.5 leading-relaxed">
        <p>• Данные шифруются по стандартам <strong>HIPAA</strong> и <strong>GDPR</strong>.</p>
        <p>• Доступ к карте ребёнка имеют только подтверждённые члены семьи.</p>
        <p>• Экстренные номера: <strong>103, 112</strong> (Республика Казахстан).</p>
      </div>
    </SectionCard>
  );

  const renderAbout = () => (
    <SectionCard icon={<Info className="w-5 h-5" />} title="О приложении">
      <div className="flex items-center gap-4 pb-4 border-b border-sage-100">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sage-700 to-sage-900 flex items-center justify-center shadow-md">
          <Heart className="w-7 h-7 text-white" />
        </div>
        <div>
          <p className="text-lg font-bold text-sage-900 font-display">NESTA Health</p>
          <p className="text-xs text-sage-500">Версия 1.0.0 · Сборка 2024.1</p>
        </div>
      </div>

      <div className="space-y-1">
        {[
          { label: 'Политика конфиденциальности', href: '#' },
          { label: 'Условия использования', href: '#' },
          { label: 'Лицензии', href: '#' },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-sage-50 transition-colors group"
          >
            <span className="text-sm text-sage-700 group-hover:text-sage-900">{label}</span>
            <ChevronRight className="w-4 h-4 text-sage-300 group-hover:text-sage-500" />
          </a>
        ))}
      </div>

      <div className="pt-3 border-t border-sage-100 text-center space-y-1">
        <p className="text-xs text-sage-500">
          Поддержка:{' '}
          <a href="mailto:support@nesta.app" className="text-sage-700 underline underline-offset-2">
            support@nesta.app
          </a>
        </p>
        <p className="text-xs text-sage-400">© 2024 NESTA Health. Все права защищены.</p>
      </div>
    </SectionCard>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'profile': return renderProfile();
      case 'child': return renderChild();
      case 'pregnancy': return renderPregnancy();
      case 'appearance': return renderAppearance();
      case 'notifications': return renderNotifications();
      case 'privacy': return renderPrivacy();
      case 'about': return renderAbout();
      default: return renderProfile();
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="pb-5 border-b border-sage-200/80 mb-6">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-sage-700" />
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-sage-900">Настройки</h1>
        </div>
        <p className="text-xs sm:text-sm text-sage-500 mt-1">
          Управление профилем, безопасностью и внешним видом приложения
        </p>
      </div>

      <div className="flex gap-6 items-start">
        {/* ── Sidebar (desktop) ──────────────────────────────── */}
        <aside className="hidden lg:flex flex-col gap-1 w-56 shrink-0 sticky top-6">
          {SECTIONS.map(({ id, label, icon }) => (
            <NavItem
              key={id}
              icon={icon}
              label={label}
              active={activeSection === id}
              onClick={() => setActiveSection(id)}
            />
          ))}
        </aside>

        {/* ── Mobile tab strip ──────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-5">
          <div className="lg:hidden -mx-1">
            <div className="flex gap-2 overflow-x-auto pb-2 px-1 scrollbar-none">
              {SECTIONS.map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap text-xs font-medium shrink-0 transition-all ${
                    activeSection === id
                      ? 'bg-sage-800 text-white shadow-sm'
                      : 'bg-white text-sage-600 border border-sage-200 hover:border-sage-300'
                  }`}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Active section content */}
          {renderSection()}
        </div>
      </div>

      {/* ── Delete Account Modal ───────────────────────────── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-base font-bold text-sage-900">Удалить аккаунт?</h3>
            </div>
            <p className="text-sm text-sage-600 mb-6 leading-relaxed">
              Это действие необратимо. Все данные профиля, медицинские карты и история будут удалены
              без возможности восстановления.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-sage-200 text-sm font-semibold text-sage-700 hover:bg-sage-50 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors shadow-sm"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

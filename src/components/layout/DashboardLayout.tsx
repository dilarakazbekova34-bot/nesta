// src/components/layout/DashboardLayout.tsx
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ProfileSwitcher } from '../common/ProfileSwitcher';
import { EmergencyCallModal } from '../common/EmergencyCallModal';
import { QuickLogModal } from '../common/QuickLogModal';
import { UploadDocumentModal } from '../common/UploadDocumentModal';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileActionSheet } from './MobileActionSheet';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { DiaryCategory } from '../../types';
import { 
  Menu, 
  X, 
  Plus, 
  PhoneCall, 
  Bell, 
  Search, 
  ShieldAlert, 
  FileUp, 
  Utensils, 
  CheckCircle2,
  Calendar,
  Smartphone,
  Monitor
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [quickLogModalOpen, setQuickLogModalOpen] = useState(false);
  const [quickLogCategory, setQuickLogCategory] = useState<DiaryCategory>('feeding');
  const [uploadDocModalOpen, setUploadDocModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileActionSheetOpen, setMobileActionSheetOpen] = useState(false);
  const [isSimulatorMode, setIsSimulatorMode] = useState(false);

  const { user, profileMode } = useAuth();
  const { child, pregnancy } = useData();
  const location = useLocation();

  const notifications = [
    { id: 1, title: 'Приём витамина D3', text: 'Утренняя доза 1000 МЕ рекомендована во время еды', time: 'Сегодня, 09:00', read: false },
    { id: 2, title: 'Плановый осмотр педиатра', text: 'Запись на консультацию через 4 дня в клинике «Мейірім»', time: 'Вчера', read: true },
    { id: 3, title: 'Анализ крови расшифрован', text: 'AI-ассистент сформировал отчет по последнему ОАК', time: '5 ноября', read: true },
  ];

  const handleOpenQuickLogCategory = (cat: DiaryCategory) => {
    setQuickLogCategory(cat);
    setQuickLogModalOpen(true);
  };

  return (
    <div className={`flex h-screen bg-warmbeige-50/70 overflow-hidden font-sans ${isSimulatorMode ? 'p-4 sm:p-8 bg-slate-900 items-center justify-center' : ''}`}>
      {/* Device Frame Wrapper if Simulator Mode is Active on Desktop */}
      <div className={`flex w-full h-full ${isSimulatorMode ? 'max-w-[420px] max-h-[880px] rounded-[52px] border-[10px] border-slate-800 shadow-2xl overflow-hidden relative bg-warmbeige-50 flex-col ring-1 ring-white/10' : ''}`}>
        
        {/* Simulated Phone Dynamic Island / Notch if in Simulator Mode */}
        {isSimulatorMode && (
          <div className="h-8 bg-white border-b border-sage-100 flex items-center justify-between px-6 shrink-0 z-50">
            <span className="text-[11px] font-bold text-sage-900">09:41</span>
            <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto -mt-1 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-slate-800"></span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-sage-900">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>
        )}

        <div className="flex flex-1 w-full h-full overflow-hidden">
          {/* Desktop Sidebar (hidden if simulator mode or mobile) */}
          {!isSimulatorMode && (
            <div className="hidden lg:block shrink-0">
              <Sidebar />
            </div>
          )}

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div
                className="fixed inset-0 bg-sage-900/60 backdrop-blur-sm transition-opacity"
                onClick={() => setMobileMenuOpen(false)}
              />
              <div className="relative w-72 max-w-[85vw] h-full bg-white shadow-soft-xl z-10 flex flex-col animate-in slide-in-from-left duration-200">
                <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
            {/* Topbar */}
            <header className="h-18 sm:h-20 bg-white/80 backdrop-blur-md border-b border-sage-200/70 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 z-30">
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Mobile toggle */}
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className={`${isSimulatorMode ? 'block' : 'lg:hidden'} p-2 rounded-xl text-sage-600 hover:text-sage-900 hover:bg-sage-100/80 transition-colors`}
                  aria-label="Открыть навигацию"
                >
                  <Menu className="w-5 h-5" />
                </button>

                {/* Profile Switcher */}
                <ProfileSwitcher />

                {/* Quick summary pill (Desktop) */}
                {!isSimulatorMode && (
                  <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage-50 border border-sage-200/60 text-xs text-sage-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>
                      {profileMode === 'child'
                        ? `Вес: 8.55 кг • Рост: 70.2 см • ВОЗ: 53-й перцентиль (Норма)`
                        : `3-й триместр • ${pregnancy.currentWeek || 28}-я неделя • Малыш: ~1100 г`}
                    </span>
                  </div>
                )}
              </div>

              {/* Right Action Tools */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Desktop Simulator Toggle */}
                <button
                  onClick={() => setIsSimulatorMode(!isSimulatorMode)}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-sage-100 hover:bg-sage-200 text-sage-800 text-xs font-semibold transition-colors"
                  title={isSimulatorMode ? 'Выйти из режима мобильного приложения' : 'Переключить в мобильный симулятор'}
                >
                  {isSimulatorMode ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
                  <span>{isSimulatorMode ? 'Десктоп' : 'Мобильный вид'}</span>
                </button>

                {/* Emergency 103 Button */}
                <button
                  onClick={() => setEmergencyModalOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all font-semibold text-xs shadow-xs"
                  title="Экстренная помощь (103 / 112)"
                >
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></div>
                  <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                  <span className="hidden sm:inline">103 / 112</span>
                </button>

                {/* Quick Log Action (Desktop) */}
                {!isSimulatorMode && (
                  <button
                    onClick={() => handleOpenQuickLogCategory('feeding')}
                    className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-sage-100 hover:bg-sage-200 text-sage-800 font-semibold text-xs transition-colors"
                  >
                    <Utensils className="w-4 h-4 text-sage-700" />
                    <span>+ Запись</span>
                  </button>
                )}

                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 sm:p-2.5 rounded-2xl bg-white hover:bg-sage-50 border border-sage-200/80 text-sage-600 hover:text-sage-900 transition-colors relative"
                    aria-label="Уведомления"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-softblue-600"></span>
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-3xl border border-sage-100 shadow-soft-xl p-4 z-50 animate-in fade-in zoom-in-95">
                      <div className="flex items-center justify-between pb-3 border-b border-sage-100">
                        <span className="text-xs font-bold text-sage-900 uppercase tracking-wider">Уведомления</span>
                        <span className="text-[10px] font-semibold text-softblue-700 bg-softblue-50 px-2 py-0.5 rounded-full">1 новое</span>
                      </div>
                      <div className="divide-y divide-sage-50 py-1">
                        {notifications.map((n) => (
                          <div key={n.id} className="py-2.5">
                            <div className="flex items-start justify-between gap-2">
                              <span className={`text-xs font-bold ${n.read ? 'text-sage-800' : 'text-sage-900'}`}>{n.title}</span>
                              <span className="text-[10px] text-sage-400 shrink-0">{n.time}</span>
                            </div>
                            <p className="text-xs text-sage-600 mt-0.5 leading-relaxed">{n.text}</p>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-sage-100 text-center">
                        <button
                          onClick={() => setNotificationsOpen(false)}
                          className="text-xs font-semibold text-sage-600 hover:text-sage-900"
                        >
                          Закрыть
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* Scrollable View Content — pb-24 on mobile ensures bottom navigation never covers content */}
            <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-7xl w-full mx-auto pb-28 lg:pb-8">
              <Outlet />
            </main>

            {/* Mobile Bottom Navigation Bar (Visible on mobile or when simulator is active) */}
            <div className={isSimulatorMode ? 'block' : 'lg:hidden'}>
              <MobileBottomNav
                onOpenActionSheet={() => setMobileActionSheetOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Global Modals & Sheets */}
      <MobileActionSheet
        isOpen={mobileActionSheetOpen}
        onClose={() => setMobileActionSheetOpen(false)}
        onOpenQuickLog={handleOpenQuickLogCategory}
        onOpenEmergency={() => setEmergencyModalOpen(true)}
        onOpenUploadDoc={() => setUploadDocModalOpen(true)}
      />

      <EmergencyCallModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />

      <QuickLogModal
        isOpen={quickLogModalOpen}
        onClose={() => setQuickLogModalOpen(false)}
        defaultCategory={quickLogCategory}
      />

      <UploadDocumentModal
        isOpen={uploadDocModalOpen}
        onClose={() => setUploadDocModalOpen(false)}
      />
    </div>
  );
};

// src/components/layout/MobileBottomNav.tsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sparkles, 
  Heart, 
  Baby, 
  BookOpen, 
  Plus,
  Stethoscope,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface MobileBottomNavProps {
  onOpenActionSheet: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenActionSheet }) => {
  const { profileMode } = useAuth();
  const { pregnancy } = useData();
  const location = useLocation();

  const isPregnancyMode = profileMode === 'pregnancy';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-xl border-t border-sage-200/80 shadow-[0_-4px_20px_rgba(52,68,58,0.06)] pb-[max(0.5rem,env(safe-area-inset-bottom))] select-none">
      <div className="grid grid-cols-5 items-center h-16 px-1">
        {/* 1. Dashboard */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center h-full transition-all duration-200 group ${
              isActive ? 'text-sage-900 font-bold' : 'text-sage-500 hover:text-sage-700'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-sage-100 text-sage-900 scale-105' : ''}`}>
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold text-sage-900' : 'font-medium'}`}>
                Главная
              </span>
            </>
          )}
        </NavLink>

        {/* 2. 3D Baby / Pregnancy or Child Growth */}
        {isPregnancyMode ? (
          <NavLink
            to="/pregnancy/3d-baby"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center h-full transition-all duration-200 group ${
                isActive ? 'text-softblue-900 font-bold' : 'text-sage-500 hover:text-sage-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1 rounded-xl transition-all relative ${isActive ? 'bg-softblue-100 text-softblue-900 scale-105' : ''}`}>
                  <Heart className={`w-5 h-5 ${isActive ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span className="absolute -top-0.5 -right-1 text-[8px] font-bold bg-softblue-600 text-white px-1 rounded-full">
                    3D
                  </span>
                </div>
                <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold text-softblue-900' : 'font-medium'}`}>
                  3D-Малыш
                </span>
              </>
            )}
          </NavLink>
        ) : (
          <NavLink
            to="/health-control"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center h-full transition-all duration-200 group ${
                isActive ? 'text-sage-900 font-bold' : 'text-sage-500 hover:text-sage-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-sage-100 text-sage-900 scale-105' : ''}`}>
                  <Activity className="w-5 h-5" />
                </div>
                <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold text-sage-900' : 'font-medium'}`}>
                  Развитие
                </span>
              </>
            )}
          </NavLink>
        )}

        {/* 3. Center Floating Action Button (FAB) */}
        <div className="flex flex-col items-center justify-center -mt-5">
          <button
            onClick={onOpenActionSheet}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-sage-800 to-sage-900 text-white shadow-soft-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center border-4 border-white ring-2 ring-sage-200"
            aria-label="Быстрое действие"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
          <span className="text-[9px] font-bold text-sage-600 mt-1 uppercase tracking-wider">
            Действие
          </span>
        </div>

        {/* 4. AI Assistant */}
        <NavLink
          to="/ai-assistant"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center h-full transition-all duration-200 group ${
              isActive ? 'text-softblue-900 font-bold' : 'text-sage-500 hover:text-sage-700'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`p-1 rounded-xl transition-all relative ${isActive ? 'bg-softblue-100 text-softblue-900 scale-105' : ''}`}>
                <Sparkles className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-softblue-500"></span>
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold text-softblue-900' : 'font-medium'}`}>
                AI-Чат
              </span>
            </>
          )}
        </NavLink>

        {/* 5. Medical Library */}
        <NavLink
          to="/library"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center h-full transition-all duration-200 group ${
              isActive ? 'text-sage-900 font-bold' : 'text-sage-500 hover:text-sage-700'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-sage-100 text-sage-900 scale-105' : ''}`}>
                <BookOpen className="w-5 h-5" />
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold text-sage-900' : 'font-medium'}`}>
                Библиотека
              </span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
};

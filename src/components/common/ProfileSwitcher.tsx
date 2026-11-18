// src/components/common/ProfileSwitcher.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ChevronDown, Baby, Heart, Plus, Check } from 'lucide-react';

export const ProfileSwitcher: React.FC = () => {
  const { profileMode, setProfileMode } = useAuth();
  const { child, pregnancy } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/80 hover:bg-white border border-sage-200/80 shadow-sm transition-all text-left group"
        title="Переключить профиль"
      >
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105 ${
          profileMode === 'child' ? 'bg-sage-600' : 'bg-softblue-600'
        }`}>
          {profileMode === 'child' ? (
            <Baby className="w-4.5 h-4.5" />
          ) : (
            <Heart className="w-4.5 h-4.5" />
          )}
        </div>
        <div className="hidden sm:block">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-sage-900 leading-tight">
              {profileMode === 'child' ? child.name : 'Беременность'}
            </span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-sage-100 text-sage-700">
              {profileMode === 'child' ? '8 мес' : `${pregnancy.currentWeek} нед`}
            </span>
          </div>
          <p className="text-[11px] text-sage-600 leading-none mt-0.5">
            {profileMode === 'child' ? 'Профиль малыша' : 'Ожидание чуда'}
          </p>
        </div>
        <ChevronDown className={`w-4 h-4 text-sage-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:left-0 top-full mt-2 w-64 bg-white rounded-2xl border border-sage-100 shadow-soft-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-2 text-[11px] font-semibold text-sage-500 uppercase tracking-wider">
            Активный профиль
          </div>

          {/* Child Profile Option */}
          <button
            onClick={() => {
              setProfileMode('child');
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all ${
              profileMode === 'child'
                ? 'bg-sage-50 text-sage-900 font-medium'
                : 'hover:bg-warmbeige-50 text-sage-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sage-200 text-sage-800 flex items-center justify-center">
                <Baby className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold">{child.name}</div>
                <div className="text-xs text-sage-500">Ребёнок (8 месяцев)</div>
              </div>
            </div>
            {profileMode === 'child' && <Check className="w-4 h-4 text-sage-700" />}
          </button>

          {/* Pregnancy Profile Option */}
          <button
            onClick={() => {
              setProfileMode('pregnancy');
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all mt-1 ${
              profileMode === 'pregnancy'
                ? 'bg-softblue-50 text-softblue-900 font-medium'
                : 'hover:bg-warmbeige-50 text-sage-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-softblue-200 text-softblue-800 flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold">Беременность</div>
                <div className="text-xs text-softblue-600">{pregnancy.currentWeek}-я неделя (3 триместр)</div>
              </div>
            </div>
            {profileMode === 'pregnancy' && <Check className="w-4 h-4 text-softblue-700" />}
          </button>

          <div className="border-t border-sage-100 my-1.5 pt-1.5">
            <button 
              onClick={() => {
                alert('Функция добавления второго ребёнка или новой беременности доступна в настройках семьи.');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium text-sage-600 hover:text-sage-900 hover:bg-sage-50 transition-colors"
            >
              <Plus className="w-4 h-4 text-sage-500" />
              <span>Добавить ребенка или беременность</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

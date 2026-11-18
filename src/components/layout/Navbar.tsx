// src/components/layout/Navbar.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Sparkles, Menu, X, ArrowRight, HeartPulse } from 'lucide-react';

export const Navbar: React.FC<{ onOpenAuth?: () => void }> = ({ onOpenAuth }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Главная', path: '/' },
    { label: 'Возможности', path: '/#features' },
    { label: 'Как это работает', path: '/#how-it-works' },
    { label: 'О платформе', path: '/#about' },
    { label: 'FAQ', path: '/#faq' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-warmbeige-50/90 border-b border-sage-200/50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-sage-800 text-sage-100 flex items-center justify-center shadow-soft transition-transform group-hover:scale-105">
            <HeartPulse className="w-6 h-6 text-sage-200" />
          </div>
          <div>
            <span className="text-2xl font-bold font-display tracking-tight text-sage-900 flex items-center gap-1.5">
              NESTA
              <span className="w-2 h-2 rounded-full bg-sage-500"></span>
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-sage-600 block -mt-1">
              Family Health Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.path}
              className="text-sm font-medium text-sage-700 hover:text-sage-900 transition-colors relative py-1 hover:underline underline-offset-8 decoration-sage-400"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA / Auth Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-sage-800 hover:bg-sage-900 text-white text-sm font-semibold shadow-soft hover:shadow-soft-lg transition-all"
              >
                <span>Личный кабинет</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              <button
                onClick={onOpenAuth}
                className="px-4 py-2.5 rounded-2xl text-sm font-semibold text-sage-800 hover:bg-sage-100/70 transition-colors"
              >
                Войти
              </button>
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-sage-800 hover:bg-sage-900 text-white text-sm font-semibold shadow-soft hover:shadow-soft-lg transition-all"
              >
                <span>Начать бесплатно</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-sage-700 hover:bg-sage-100/80 transition-colors"
          aria-label="Открыть меню"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-sage-200/80 bg-warmbeige-50 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-medium text-sage-800 hover:bg-sage-100/70"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-sage-200/60 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-2xl bg-sage-800 text-white text-sm font-semibold"
              >
                Перейти в Личный кабинет
              </Link>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth?.();
                  }}
                  className="w-full text-center py-2.5 rounded-2xl border border-sage-300 text-sage-800 text-sm font-semibold"
                >
                  Войти
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth?.();
                  }}
                  className="w-full text-center py-3 rounded-2xl bg-sage-800 text-white text-sm font-semibold"
                >
                  Начать бесплатно
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

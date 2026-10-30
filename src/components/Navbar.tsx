import React from 'react';
import { TabMode } from '../types';
import { sound } from '../utils/sound';
import {
  Flame,
  Snowflake,
  FlaskConical,
  Zap,
  TrendingUp,
  Link2,
  Award,
  BookOpen,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  currentTab: TabMode;
  onTabChange: (tab: TabMode) => void;
  xp: number;
  streak: number;
  isMuted: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  xp,
  streak,
  isMuted,
  onToggleSound
}) => {
  const handleNav = (tab: TabMode) => {
    sound.playClick();
    onTabChange(tab);
  };

  const navItems: { id: TabMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'lab',
      label: 'Virtual Calorimeter',
      icon: <FlaskConical className="w-4 h-4 text-emerald-500" />
    },
    {
      id: 'dash',
      label: 'ThermoDash Game',
      icon: <Zap className="w-4 h-4 text-amber-500" />,
      badge: 'Arcade'
    },
    {
      id: 'energy-profile',
      label: 'Energy Profile Builder',
      icon: <TrendingUp className="w-4 h-4 text-blue-500" />
    },
    {
      id: 'bond-energy',
      label: 'Bond Workshop',
      icon: <Link2 className="w-4 h-4 text-purple-500" />
    },
    {
      id: 'quiz',
      label: 'Mastery Arena',
      icon: <Award className="w-4 h-4 text-rose-500" />,
      badge: 'Cert'
    },
    {
      id: 'teacher',
      label: 'Teacher Hub',
      icon: <BookOpen className="w-4 h-4 text-indigo-500" />
    }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Concept Identity */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNav('lab')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-rose-500 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center gap-0.5">
                <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
                <Snowflake className="w-4 h-4 text-cyan-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 font-sans">
                  Thermo<span className="text-indigo-600">Quest</span>
                </span>
                <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 font-bold rounded-full uppercase tracking-wider">
                  Grade 11 Chem
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium hidden sm:block">
                Exothermic (ΔH &lt; 0) vs Endothermic (ΔH &gt; 0)
              </p>
            </div>
          </div>

          {/* Gamification Stats & Controls */}
          <div className="flex items-center gap-3">
            {/* Streak Counter */}
            {streak > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-bold shadow-xs animate-bounce">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{streak} Streak!</span>
              </div>
            )}

            {/* XP Points */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-lg text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>{xp} XP</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
              aria-label="Toggle sound"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-slate-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-indigo-600" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 scrollbar-none text-sm font-medium">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm whitespace-nowrap transition-all font-semibold ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                      isActive ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

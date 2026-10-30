import React, { useState, useEffect } from 'react';
import { TabMode } from './types';
import { Navbar } from './components/Navbar';
import { CalorimeterLab } from './components/CalorimeterLab';
import { ThermoDashGame } from './components/ThermoDashGame';
import { EnergyProfileBuilder } from './components/EnergyProfileBuilder';
import { BondEnergyWorkshop } from './components/BondEnergyWorkshop';
import { QuizArena } from './components/QuizArena';
import { TeacherHub } from './components/TeacherHub';
import { sound } from './utils/sound';
import { Flame, Snowflake, Sparkles, BookOpen, FlaskConical, Award } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabMode>('lab');
  const [xp, setXp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('thermoquest_xp');
      return saved ? parseInt(saved, 10) : 100;
    } catch {
      return 100;
    }
  });

  const [streak, setStreak] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('thermoquest_muted') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('thermoquest_xp', xp.toString());
    } catch {
      // ignore
    }
  }, [xp]);

  useEffect(() => {
    sound.setMuted(isMuted);
    try {
      localStorage.setItem('thermoquest_muted', isMuted ? 'true' : 'false');
    } catch {
      // ignore
    }
  }, [isMuted]);

  const handleEarnXP = (amount: number) => {
    setXp((prev) => prev + amount);
  };

  const handleUpdateStreak = (newStreak: number) => {
    setStreak(newStreak);
  };

  const handleToggleSound = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        xp={xp}
        streak={streak}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'lab' && <CalorimeterLab onEarnXP={handleEarnXP} />}

        {currentTab === 'dash' && (
          <ThermoDashGame
            onEarnXP={handleEarnXP}
            onUpdateStreak={handleUpdateStreak}
          />
        )}

        {currentTab === 'energy-profile' && (
          <EnergyProfileBuilder onEarnXP={handleEarnXP} />
        )}

        {currentTab === 'bond-energy' && (
          <BondEnergyWorkshop onEarnXP={handleEarnXP} />
        )}

        {currentTab === 'quiz' && <QuizArena onEarnXP={handleEarnXP} />}

        {currentTab === 'teacher' && <TeacherHub />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">ThermoQuest</span>
            <span>•</span>
            <span>Interactive Grade 11 Thermochemistry Learning Platform</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <span className="inline-flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Exothermic (ΔH &lt; 0)</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Snowflake className="w-3.5 h-3.5 text-cyan-500" />
              <span>Endothermic (ΔH &gt; 0)</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

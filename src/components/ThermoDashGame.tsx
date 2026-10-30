import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { DASH_CARDS } from '../data/thermochemistryData';
import { DashCard, ReactionType } from '../types';
import { sound } from '../utils/sound';
import {
  Flame,
  Snowflake,
  Heart,
  Timer,
  Zap,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Lightbulb
} from 'lucide-react';

interface ThermoDashGameProps {
  onEarnXP: (amount: number) => void;
  onUpdateStreak: (streak: number) => void;
}

export const ThermoDashGame: React.FC<ThermoDashGameProps> = ({
  onEarnXP,
  onUpdateStreak
}) => {
  const [cards, setCards] = useState<DashCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(12);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [lastFeedback, setLastFeedback] = useState<{
    isCorrect: boolean;
    card: DashCard;
    userChoice: ReactionType;
  } | null>(null);

  // Shuffle deck on start
  const startNewGame = useCallback(() => {
    sound.playClick();
    const shuffled = [...DASH_CARDS].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setLives(3);
    setCurrentStreak(0);
    setTimeLeft(12);
    setIsGameOver(false);
    setLastFeedback(null);
    onUpdateStreak(0);
  }, [onUpdateStreak]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // Card timer countdown
  useEffect(() => {
    if (isGameOver || lastFeedback !== null || cards.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time expired = counts as wrong
          handleAnswer(null);
          return 12;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameOver, lastFeedback, cards.length, currentIndex]);

  const handleAnswer = (choice: ReactionType | null) => {
    if (isGameOver || cards.length === 0 || currentIndex >= cards.length) return;

    const currentCard = cards[currentIndex];
    const isCorrect = choice === currentCard.type;

    if (isCorrect) {
      if (currentCard.type === 'exothermic') {
        sound.playExoFire();
      } else {
        sound.playEndoIce();
      }

      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      onUpdateStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);

      const multiplier = Math.min(4, 1 + Math.floor(newStreak / 3));
      const points = 100 * multiplier + timeLeft * 10;
      setScore((s) => s + points);
      onEarnXP(points);

      if (newStreak > 0 && newStreak % 5 === 0) {
        sound.playLevelUp();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    } else {
      sound.playWrong();
      setCurrentStreak(0);
      onUpdateStreak(0);
      const remainingLives = lives - 1;
      setLives(remainingLives);
      if (remainingLives <= 0) {
        setIsGameOver(true);
      }
    }

    setLastFeedback({
      isCorrect,
      card: currentCard,
      userChoice: choice || ('exothermic' as ReactionType)
    });
  };

  const nextCard = () => {
    sound.playClick();
    setLastFeedback(null);
    setTimeLeft(12);

    if (currentIndex + 1 >= cards.length) {
      // Completed all cards in the deck!
      setIsGameOver(true);
      sound.playLevelUp();
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 }
      });
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  // Keyboard controls: Left Arrow / 'A' = Exothermic, Right Arrow / 'D' = Endothermic
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;
      if (lastFeedback !== null) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          nextCard();
        }
        return;
      }

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handleAnswer('exothermic');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        handleAnswer('endothermic');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver, lastFeedback, currentIndex, cards]);

  const currentCard = cards[currentIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Game Header Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Zap className="w-5 h-5 fill-amber-500" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              ThermoDash Arcade
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Sort scenarios at lightning speed: <strong>Exothermic 🔥</strong> or <strong>Endothermic ❄️</strong>
          </p>
        </div>

        {/* Lives, Streak, Score, Timer Status */}
        <div className="flex items-center gap-4">
          {/* Lives Hearts */}
          <div className="flex items-center gap-1 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
            {[1, 2, 3].map((heartIndex) => (
              <Heart
                key={heartIndex}
                className={`w-4 h-4 ${
                  heartIndex <= lives
                    ? 'text-rose-500 fill-rose-500 animate-pulse'
                    : 'text-slate-300'
                }`}
              />
            ))}
          </div>

          {/* Combo Multiplier */}
          <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 text-xs font-bold text-amber-800">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{currentStreak}x Combo</span>
          </div>

          {/* Current Score */}
          <div className="bg-slate-900 text-white px-4 py-1.5 rounded-xl text-sm font-mono font-bold shadow-xs">
            {score.toLocaleString()} PTS
          </div>
        </div>
      </div>

      {/* Main Play Area */}
      {!isGameOver && currentCard ? (
        <div className="relative">
          {/* Card Container */}
          <div className="bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-md min-h-[360px] flex flex-col justify-between relative overflow-hidden">
            {/* Top Info Bar inside card */}
            <div className="flex items-center justify-between text-xs text-slate-600 pb-4 border-b border-slate-100">
              <span className="font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                Card #{currentIndex + 1} of {cards.length}
              </span>

              {/* Timer Progress */}
              <div className="flex items-center gap-2">
                <Timer className={`w-4 h-4 ${timeLeft <= 3 ? 'text-rose-500 animate-ping' : 'text-slate-400'}`} />
                <span
                  className={`font-mono font-bold text-sm ${
                    timeLeft <= 3 ? 'text-rose-600 font-extrabold' : 'text-slate-700'
                  }`}
                >
                  {timeLeft}s
                </span>
                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      timeLeft <= 3 ? 'bg-rose-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${(timeLeft / 12) * 100}%` }}
                  />
                </div>
              </div>

              <span className="uppercase text-[10px] tracking-wider font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {currentCard.category.replace('_', ' ')}
              </span>
            </div>

            {/* Main Scenario Subject */}
            <div className="py-8 text-center space-y-3">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {currentCard.title}
              </h3>
              <p className="text-base text-slate-600 max-w-xl mx-auto font-medium">
                {currentCard.subtitle}
              </p>

              {currentCard.equation && (
                <div className="inline-block mt-2 px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm text-indigo-700 font-semibold shadow-inner">
                  {currentCard.equation}
                </div>
              )}

              {/* Teacher Clue Hint */}
              <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50/80 px-3 py-1.5 rounded-full border border-amber-200">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Hint: {currentCard.clue}</span>
              </div>
            </div>

            {/* Answer Action Buttons (Exo vs Endo) */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              {/* Exothermic Button */}
              <button
                onClick={() => handleAnswer('exothermic')}
                className="group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold text-base sm:text-lg shadow-lg shadow-rose-500/25 hover:shadow-xl hover:from-rose-600 hover:to-orange-600 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white/20 backdrop-blur group-hover:rotate-12 transition-transform">
                    <Flame className="w-6 h-6 text-white fill-white" />
                  </div>
                  <div className="text-left">
                    <span className="block leading-tight">EXOTHERMIC</span>
                    <span className="text-xs font-normal text-rose-100 hidden sm:block">
                      Releases Heat (ΔH &lt; 0)
                    </span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-xs bg-black/20 px-2.5 py-1 rounded-lg">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Key: [A] or [←]</span>
                </div>
              </button>

              {/* Endothermic Button */}
              <button
                onClick={() => handleAnswer('endothermic')}
                className="group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-base sm:text-lg shadow-lg shadow-blue-500/25 hover:shadow-xl hover:from-blue-700 hover:to-cyan-600 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white/20 backdrop-blur group-hover:-rotate-12 transition-transform">
                    <Snowflake className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <span className="block leading-tight">ENDOTHERMIC</span>
                    <span className="text-xs font-normal text-blue-100 hidden sm:block">
                      Absorbs Heat (ΔH &gt; 0)
                    </span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-xs bg-black/20 px-2.5 py-1 rounded-lg">
                  <span>Key: [D] or [→]</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>
          </div>

          {/* Feedback Modal / Overlay after each answer */}
          {lastFeedback && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs rounded-3xl flex items-center justify-center p-4 z-20 animate-fade-in">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-3">
                  {lastFeedback.isCorrect ? (
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                  ) : (
                    <div className="p-2 bg-rose-100 text-rose-600 rounded-full">
                      <XCircle className="w-8 h-8" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">
                      {lastFeedback.isCorrect ? 'Spot On! Brilliant!' : 'Oops! Let’s Review:'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Correct Answer:{' '}
                      <span className="font-bold text-slate-800 uppercase">
                        {lastFeedback.card.type}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  <p className="font-bold text-slate-900 mb-1">Scientific Rationale:</p>
                  <p>{lastFeedback.card.explanation}</p>
                </div>

                <button
                  onClick={nextCard}
                  autoFocus
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Game Over / Victory Summary */
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-inner">
            <Sparkles className="w-8 h-8 text-indigo-600" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-extrabold text-slate-900">
              {lives <= 0 ? 'Run Finished!' : 'All Scenarios Mastered!'}
            </h3>
            <p className="text-sm text-slate-500">
              Here is your performance breakdown in ThermoDash:
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Total Score</span>
              <span className="text-xl font-bold font-mono text-indigo-600">
                {score.toLocaleString()}
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Best Streak</span>
              <span className="text-xl font-bold font-mono text-amber-600">
                {bestStreak}x
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Cards Seen</span>
              <span className="text-xl font-bold font-mono text-emerald-600">
                {currentIndex}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={startNewGame}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again with Fresh Scenarios</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

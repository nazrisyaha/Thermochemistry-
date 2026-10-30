import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS } from '../data/thermochemistryData';
import { StudentCertificate } from '../types';
import { sound } from '../utils/sound';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Printer,
  Sparkles,
  Trophy,
  Flame,
  Snowflake,
  GraduationCap
} from 'lucide-react';

interface QuizArenaProps {
  onEarnXP: (amount: number) => void;
}

export const QuizArena: React.FC<QuizArenaProps> = ({ onEarnXP }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [studentName, setStudentName] = useState<string>('Alex Johnson');

  const questions = QUIZ_QUESTIONS;
  const currentQ = questions[currentIndex];
  const userChoice = selectedAnswers[currentQ.id];

  const handleSelectOption = (idx: number) => {
    if (showExplanation) return;
    sound.playClick();
    setSelectedAnswers({ ...selectedAnswers, [currentQ.id]: idx });
  };

  const handleConfirmAnswer = () => {
    if (userChoice === undefined) return;
    setShowExplanation(true);
    const isCorrect = userChoice === currentQ.correctIndex;
    if (isCorrect) {
      sound.playCorrect();
      onEarnXP(50);
    } else {
      sound.playWrong();
    }
  };

  const handleNext = () => {
    sound.playClick();
    setShowExplanation(false);
    setShowHint(false);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Quiz Finished!
      setIsFinished(true);
      sound.playLevelUp();
      confetti({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.5 }
      });
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setShowHint(false);
    setIsFinished(false);
  };

  // Grade calculation
  const totalCorrect = questions.filter(
    (q) => selectedAnswers[q.id] === q.correctIndex
  ).length;
  const percentage = Math.round((totalCorrect / questions.length) * 100);

  const getRank = (pct: number) => {
    if (pct >= 90) return 'Grand Thermodynamic Master';
    if (pct >= 80) return 'Certified Enthalpy Scholar';
    if (pct >= 70) return 'Calorimetry Specialist';
    return 'Apprentice Thermochemist';
  };

  const certificate: StudentCertificate = {
    studentName: studentName || 'Student Chemist',
    date: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }),
    score: totalCorrect,
    totalQuestions: questions.length,
    gradePercentage: percentage,
    rankTitle: getRank(percentage)
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {!isFinished ? (
        /* Quiz Question Stage */
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                <Award className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Thermochemistry Mastery Arena
                </h2>
                <p className="text-xs text-slate-500">
                  Grade 11 Standards Examination • 10 Curriculum Questions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">
                Category: {currentQ.category.replace('_', ' ')}
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                {currentQ.question}
              </h3>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = userChoice === idx;
                let optStyle = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800';

                if (showExplanation) {
                  if (idx === currentQ.correctIndex) {
                    optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                  } else if (isSelected && idx !== currentQ.correctIndex) {
                    optStyle = 'border-rose-500 bg-rose-50 text-rose-900 line-through';
                  } else {
                    optStyle = 'border-slate-200 opacity-60 text-slate-500';
                  }
                } else if (isSelected) {
                  optStyle = 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold ring-2 ring-indigo-500/20';
                }

                return (
                  <button
                    key={idx}
                    disabled={showExplanation}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-2xl border text-sm transition-all flex items-start gap-3.5 ${optStyle}`}
                  >
                    <span className="w-6 h-6 rounded-full bg-slate-200/80 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-relaxed">{opt}</span>
                    {showExplanation && idx === currentQ.correctIndex && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {showExplanation && isSelected && idx !== currentQ.correctIndex && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Hint & Formula Helper */}
            {currentQ.formulaHint && !showExplanation && (
              <div>
                {!showHint ? (
                  <button
                    onClick={() => setShowHint(true)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Need a formula hint?</span>
                  </button>
                ) : (
                  <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs text-indigo-900 font-mono">
                    💡 Hint: {currentQ.formulaHint}
                  </div>
                )}
              </div>
            )}

            {/* Detailed Explanation on Confirm */}
            {showExplanation && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5 animate-fade-in">
                <span className="font-bold text-slate-900 block">Detailed Explanation:</span>
                <p className="leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-400">
                Selected: {userChoice !== undefined ? `Option ${String.fromCharCode(65 + userChoice)}` : 'None'}
              </span>

              {!showExplanation ? (
                <button
                  onClick={handleConfirmAnswer}
                  disabled={userChoice === undefined}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <span>Submit Answer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <span>
                    {currentIndex + 1 < questions.length ? 'Next Question' : 'View Certificate'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Certificate & Results Screen */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Exam Results</h2>
              <p className="text-sm text-slate-500">
                You answered {totalCorrect} out of {questions.length} questions correctly ({percentage}%).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRestart}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Exam</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
            </div>
          </div>

          {/* Student Name Input for Certificate customization */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
            <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
              Student Name for Certificate:
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Enter your name..."
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-900 w-full sm:w-72 focus:outline-indigo-600"
            />
          </div>

          {/* Official Certificate Card (Print-Optimized) */}
          <div
            id="mastery-certificate"
            className="bg-white border-8 border-indigo-900/80 p-8 sm:p-12 rounded-3xl shadow-xl text-center space-y-6 relative overflow-hidden"
          >
            {/* Top Certificate Badges */}
            <div className="flex items-center justify-center gap-2">
              <Flame className="w-6 h-6 text-rose-500 fill-rose-500" />
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 shadow-inner">
                <Trophy className="w-6 h-6" />
              </div>
              <Snowflake className="w-6 h-6 text-cyan-500" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-indigo-600 font-bold">
                Certificate of Academic Achievement
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-slate-900 tracking-tight">
                Thermochemistry Mastery
              </h1>
              <p className="text-xs text-slate-500 font-sans">
                Google AI Studio • Grade 11 Chemistry Sciences
              </p>
            </div>

            <div className="py-4 border-y border-slate-200 max-w-lg mx-auto space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                This is proudly presented to
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-indigo-900 font-sans underline decoration-indigo-300 decoration-2 underline-offset-4">
                {certificate.studentName}
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed pt-1">
                for demonstrating proficient understanding of Exothermic & Endothermic processes,
                calorimetry ($q = mc\Delta T$), energy coordinate diagrams, and bond enthalpy balance.
              </p>
            </div>

            {/* Score & Rank Grid */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto text-center font-mono">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase font-sans">
                  Score
                </span>
                <span className="text-xl font-bold text-slate-900">
                  {certificate.score} / {certificate.totalQuestions}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase font-sans">
                  Grade
                </span>
                <span className="text-xl font-bold text-indigo-600">
                  {certificate.gradePercentage}%
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase font-sans">
                  Date
                </span>
                <span className="text-xs font-bold text-slate-800 font-sans block mt-1">
                  {certificate.date}
                </span>
              </div>
            </div>

            {/* Title Awarded */}
            <div className="inline-block px-4 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-full text-xs font-extrabold uppercase tracking-wider">
              Title Awarded: {certificate.rankTitle}
            </div>

            {/* Signatures Footer */}
            <div className="pt-6 grid grid-cols-2 gap-8 max-w-md mx-auto text-xs text-slate-500 border-t border-slate-200 font-sans">
              <div>
                <div className="h-8 border-b border-slate-400 mb-1" />
                <span>Chemistry Instructor Signature</span>
              </div>
              <div>
                <div className="h-8 border-b border-slate-400 mb-1 flex items-center justify-center font-serif text-indigo-800 font-bold text-sm">
                  Verified Grade 11
                </div>
                <span>Curriculum Verification</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

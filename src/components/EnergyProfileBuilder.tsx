import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/sound';
import {
  TrendingUp,
  Flame,
  Snowflake,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  RefreshCw,
  Zap,
  Target
} from 'lucide-react';

interface EnergyProfileBuilderProps {
  onEarnXP: (amount: number) => void;
}

interface Challenge {
  id: number;
  title: string;
  targetType: 'exothermic' | 'endothermic';
  targetDeltaH: number; // approximate target
  targetEa: number; // approximate target
  tolerance: number;
  prompt: string;
}

const CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: 'Challenge 1: Design an Exothermic Reaction',
    targetType: 'exothermic',
    targetDeltaH: -50,
    targetEa: 40,
    tolerance: 15,
    prompt: 'Configure a reaction where products have lower potential energy than reactants (ΔH ≈ -50 kJ/mol, Ea ≈ 40 kJ/mol).'
  },
  {
    id: 2,
    title: 'Challenge 2: Construct an Endothermic Reaction',
    targetType: 'endothermic',
    targetDeltaH: +60,
    targetEa: 75,
    tolerance: 15,
    prompt: 'Construct a reaction where the system absorbs energy, ending with higher product enthalpy (ΔH ≈ +60 kJ/mol, Ea ≈ 75 kJ/mol).'
  },
  {
    id: 3,
    title: 'Challenge 3: High Activation Energy Barrier',
    targetType: 'exothermic',
    targetDeltaH: -70,
    targetEa: 90,
    tolerance: 15,
    prompt: 'Model a stable fuel like gasoline: strongly exothermic (ΔH ≈ -70 kJ/mol) but needing a high spark to ignite (Ea ≈ 90 kJ/mol).'
  }
];

export const EnergyProfileBuilder: React.FC<EnergyProfileBuilderProps> = ({ onEarnXP }) => {
  // Energetics (in kJ/mol relative scale)
  const [reactantEnergy, setReactantEnergy] = useState<number>(100);
  const [transitionEnergy, setTransitionEnergy] = useState<number>(160);
  const [productEnergy, setProductEnergy] = useState<number>(50);
  const [hasCatalyst, setHasCatalyst] = useState<boolean>(false);
  const [activeChallengeIndex, setActiveChallengeIndex] = useState<number | null>(null);
  const [challengeCompleted, setChallengeCompleted] = useState<boolean>(false);

  // Derived thermochemical metrics
  const deltaH = productEnergy - reactantEnergy;
  const isExothermic = deltaH < 0;
  const eaForward = transitionEnergy - reactantEnergy;
  const eaCatalyzed = Math.max(10, eaForward - 35);
  const eaReverse = transitionEnergy - productEnergy;

  // Verify challenge
  const handleCheckChallenge = () => {
    if (activeChallengeIndex === null) return;
    const ch = CHALLENGES[activeChallengeIndex];

    const typeMatch = (isExothermic && ch.targetType === 'exothermic') || (!isExothermic && ch.targetType === 'endothermic');
    const deltaHMatch = Math.abs(deltaH - ch.targetDeltaH) <= ch.tolerance;
    const eaMatch = Math.abs(eaForward - ch.targetEa) <= ch.tolerance;

    if (typeMatch && deltaHMatch && eaMatch) {
      sound.playCorrect();
      setChallengeCompleted(true);
      onEarnXP(50);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      sound.playWrong();
    }
  };

  const handleSelectChallenge = (index: number) => {
    sound.playClick();
    setActiveChallengeIndex(index);
    setChallengeCompleted(false);
  };

  // SVG coordinate calculations (Canvas viewBox 0 0 500 320)
  // Energy range 0 kJ to 240 kJ mapped to Y: 280 (0 kJ) to 40 (240 kJ)
  const energyToY = (e: number) => {
    const minE = 0;
    const maxE = 220;
    return 280 - ((e - minE) / (maxE - minE)) * 240;
  };

  const yReactant = energyToY(reactantEnergy);
  const yTransition = energyToY(transitionEnergy);
  const yProduct = energyToY(productEnergy);
  const yCatalyzed = energyToY(transitionEnergy - 35);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Reaction Coordinate Profile Architect
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Manipulate reactant, activated complex, and product enthalpies. Explore activation energy (Ea),
            enthalpy change (ΔH), and the effect of adding a catalyst.
          </p>
        </div>

        {/* Catalyst Toggle Switch */}
        <button
          onClick={() => {
            sound.playClick();
            setHasCatalyst(!hasCatalyst);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            hasCatalyst
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs ring-2 ring-emerald-500/30'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
        >
          <Zap className={`w-4 h-4 ${hasCatalyst ? 'text-amber-300' : 'text-slate-400'}`} />
          <span>{hasCatalyst ? 'Catalyst Added (Ea Lowered)' : 'Add Chemical Catalyst'}</span>
        </button>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Graph (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isExothermic
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-cyan-100 text-cyan-800'
                }`}
              >
                {isExothermic ? (
                  <>
                    <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Exothermic
                  </>
                ) : (
                  <>
                    <Snowflake className="w-3.5 h-3.5 text-cyan-500" /> Endothermic
                  </>
                )}
              </span>
              <span className="font-mono text-xs font-bold text-slate-600">
                ΔH = {deltaH > 0 ? `+${deltaH}` : deltaH} kJ/mol
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-slate-500">
                Ea (fwd): <strong className="text-slate-800">{hasCatalyst ? eaCatalyzed : eaForward} kJ</strong>
              </span>
              <span className="text-slate-500">
                Ea (rev): <strong className="text-slate-800">{eaReverse} kJ</strong>
              </span>
            </div>
          </div>

          {/* SVG Diagram Canvas */}
          <div className="relative w-full h-[340px] bg-slate-50/70 rounded-2xl border border-slate-200 p-2 my-4">
            <svg className="w-full h-full" viewBox="0 0 500 320">
              {/* Grid lines */}
              <line x1="50" y1="280" x2="480" y2="280" stroke="#CBD5E1" strokeWidth="2" />
              <line x1="50" y1="280" x2="50" y2="30" stroke="#CBD5E1" strokeWidth="2" />

              {/* Axis labels */}
              <text x="50" y="22" fill="#64748B" fontSize="11" fontWeight="bold" textAnchor="start">
                Potential Energy H (kJ/mol)
              </text>
              <text x="470" y="300" fill="#64748B" fontSize="11" fontWeight="bold" textAnchor="end">
                Reaction Progress ➔
              </text>

              {/* Reactants plateau */}
              <line
                x1="50"
                y1={yReactant}
                x2="140"
                y2={yReactant}
                stroke={isExothermic ? '#EF4444' : '#0284C7'}
                strokeWidth="4"
              />
              <text
                x="60"
                y={yReactant - 8}
                fill={isExothermic ? '#DC2626' : '#0369A1'}
                fontSize="12"
                fontWeight="bold"
              >
                Reactants ({reactantEnergy} kJ)
              </text>

              {/* Uncatalyzed Reaction Curve (Smooth bezier) */}
              <path
                d={`M 140 ${yReactant} C 200 ${yReactant}, 220 ${yTransition}, 270 ${yTransition} C 320 ${yTransition}, 340 ${yProduct}, 400 ${yProduct}`}
                fill="none"
                stroke={isExothermic ? '#EF4444' : '#0284C7'}
                strokeWidth="3.5"
              />

              {/* Products plateau */}
              <line
                x1="400"
                y1={yProduct}
                x2="480"
                y2={yProduct}
                stroke={isExothermic ? '#EF4444' : '#0284C7'}
                strokeWidth="4"
              />
              <text
                x="410"
                y={yProduct - 8}
                fill={isExothermic ? '#DC2626' : '#0369A1'}
                fontSize="12"
                fontWeight="bold"
              >
                Products ({productEnergy} kJ)
              </text>

              {/* Activated Complex node at peak */}
              <circle
                cx="270"
                cy={yTransition}
                r="6"
                fill={isExothermic ? '#EF4444' : '#0284C7'}
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <text
                x="270"
                y={yTransition - 12}
                fill="#334155"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
              >
                Activated Complex [‡] ({transitionEnergy} kJ)
              </text>

              {/* Catalyzed curve if enabled */}
              {hasCatalyst && (
                <>
                  <path
                    d={`M 140 ${yReactant} C 200 ${yReactant}, 220 ${yCatalyzed}, 270 ${yCatalyzed} C 320 ${yCatalyzed}, 340 ${yProduct}, 400 ${yProduct}`}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeDasharray="5 5"
                  />
                  <circle
                    cx="270"
                    cy={yCatalyzed}
                    r="5"
                    fill="#10B981"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  <text
                    x="270"
                    y={yCatalyzed - 8}
                    fill="#047857"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    Catalyzed Pathway (Lower Ea)
                  </text>
                </>
              )}

              {/* Ea Forward Arrow */}
              <line
                x1="180"
                y1={yReactant}
                x2="180"
                y2={hasCatalyst ? yCatalyzed : yTransition}
                stroke="#6366F1"
                strokeWidth="2"
                strokeDasharray="3 3"
              />
              <text
                x="188"
                y={(yReactant + (hasCatalyst ? yCatalyzed : yTransition)) / 2}
                fill="#4F46E5"
                fontSize="10"
                fontWeight="bold"
              >
                Ea = {hasCatalyst ? eaCatalyzed : eaForward} kJ
              </text>

              {/* Delta H Arrow */}
              <line
                x1="450"
                y1={yReactant}
                x2="450"
                y2={yProduct}
                stroke={isExothermic ? '#DC2626' : '#0284C7'}
                strokeWidth="2.5"
              />
              <polygon
                points={
                  isExothermic
                    ? `446,${yProduct - 6} 450,${yProduct} 454,${yProduct - 6}`
                    : `446,${yProduct + 6} 450,${yProduct} 454,${yProduct + 6}`
                }
                fill={isExothermic ? '#DC2626' : '#0284C7'}
              />
              <text
                x="458"
                y={(yReactant + yProduct) / 2}
                fill={isExothermic ? '#DC2626' : '#0284C7'}
                fontSize="11"
                fontWeight="bold"
              >
                ΔH = {deltaH > 0 ? `+${deltaH}` : deltaH} kJ
              </text>
            </svg>
          </div>

          {/* Quick Teaching takeaway */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
            <span className="font-bold text-slate-900 block mb-0.5">
              Grade 11 Catalyst Rule:
            </span>
            <p>
              Notice that adding a catalyst significantly flattens the activation energy barrier
              (Ea drops from {eaForward} to {eaCatalyzed} kJ), but the vertical gap between Reactants
              and Products (ΔH = {deltaH} kJ/mol) <strong>does not change at all</strong>!
            </p>
          </div>
        </div>

        {/* Right: Sliders & Challenge Puzzles (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Slider Controls */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Enthalpy Parameter Sliders
            </h3>

            {/* Reactant Energy */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-600">Reactant Energy (H_reactants):</span>
                <span className="font-mono font-bold text-slate-800">{reactantEnergy} kJ/mol</span>
              </div>
              <input
                type="range"
                min="40"
                max="160"
                step="5"
                value={reactantEnergy}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setReactantEnergy(val);
                  if (transitionEnergy < val + 20) {
                    setTransitionEnergy(val + 20);
                  }
                }}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Peak / Transition State Energy */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-600">Peak / Activated Complex:</span>
                <span className="font-mono font-bold text-slate-800">{transitionEnergy} kJ/mol</span>
              </div>
              <input
                type="range"
                min={Math.max(reactantEnergy + 10, productEnergy + 10)}
                max="210"
                step="5"
                value={transitionEnergy}
                onChange={(e) => setTransitionEnergy(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Product Energy */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-600">Product Energy (H_products):</span>
                <span className="font-mono font-bold text-slate-800">{productEnergy} kJ/mol</span>
              </div>
              <input
                type="range"
                min="30"
                max="170"
                step="5"
                value={productEnergy}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setProductEnergy(val);
                  if (transitionEnergy < val + 20) {
                    setTransitionEnergy(val + 20);
                  }
                }}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
              <span className="text-slate-500">Quick Presets:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    setReactantEnergy(120);
                    setTransitionEnergy(170);
                    setProductEnergy(50);
                  }}
                  className="px-2.5 py-1 bg-rose-50 text-rose-700 rounded-md font-bold hover:bg-rose-100"
                >
                  Exo Preset
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setReactantEnergy(60);
                    setTransitionEnergy(160);
                    setProductEnergy(130);
                  }}
                  className="px-2.5 py-1 bg-cyan-50 text-cyan-700 rounded-md font-bold hover:bg-cyan-100"
                >
                  Endo Preset
                </button>
              </div>
            </div>
          </div>

          {/* Student Architect Challenges */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Architect Challenges (+50 XP)
              </h3>
            </div>

            <div className="space-y-2">
              {CHALLENGES.map((ch, idx) => {
                const isSelected = activeChallengeIndex === idx;
                return (
                  <button
                    key={ch.id}
                    onClick={() => handleSelectChallenge(idx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{ch.title}</span>
                      <span className="text-[10px] text-indigo-600 font-mono">
                        Target: {ch.targetDeltaH > 0 ? `+${ch.targetDeltaH}` : ch.targetDeltaH} kJ
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1">{ch.prompt}</p>
                  </button>
                );
              })}
            </div>

            {activeChallengeIndex !== null && (
              <div className="pt-2">
                <button
                  onClick={handleCheckChallenge}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify My Energy Diagram</span>
                </button>

                {challengeCompleted && (
                  <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-bounce">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Challenge Completed! +50 XP Awarded!</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { BOND_REACTION_SCENARIOS } from '../data/thermochemistryData';
import { BondReactionScenario } from '../types';
import { sound } from '../utils/sound';
import {
  Link2,
  Scissors,
  Hammer,
  Scale,
  Sparkles,
  Flame,
  Snowflake,
  RotateCcw,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface BondEnergyWorkshopProps {
  onEarnXP: (amount: number) => void;
}

export const BondEnergyWorkshop: React.FC<BondEnergyWorkshopProps> = ({ onEarnXP }) => {
  const [selectedScenario, setSelectedScenario] = useState<BondReactionScenario>(
    BOND_REACTION_SCENARIOS[0]
  );

  // Tracking broken and formed bonds
  const [brokenBonds, setBrokenBonds] = useState<Record<string, number>>({});
  const [formedBonds, setFormedBonds] = useState<Record<string, number>>({});
  const [isCalculated, setIsCalculated] = useState<boolean>(false);

  // Total required bonds
  const totalReactantBondsCount = selectedScenario.reactantBonds.reduce(
    (acc, b) => acc + b.count,
    0
  );
  const totalProductBondsCount = selectedScenario.productBonds.reduce(
    (acc, b) => acc + b.count,
    0
  );

  const currentBrokenCount = Object.values(brokenBonds).reduce((a, b) => a + b, 0);
  const currentFormedCount = Object.values(formedBonds).reduce((a, b) => a + b, 0);

  // Energies
  const energyAbsorbedBroken = selectedScenario.reactantBonds.reduce((acc, b) => {
    const count = brokenBonds[b.bond] || 0;
    return acc + count * b.energy;
  }, 0);

  const energyReleasedFormed = selectedScenario.productBonds.reduce((acc, b) => {
    const count = formedBonds[b.bond] || 0;
    return acc + count * b.energy;
  }, 0);

  const totalPossibleBrokenEnergy = selectedScenario.reactantBonds.reduce(
    (acc, b) => acc + b.count * b.energy,
    0
  );
  const totalPossibleFormedEnergy = selectedScenario.productBonds.reduce(
    (acc, b) => acc + b.count * b.energy,
    0
  );

  const netDeltaH = totalPossibleBrokenEnergy - totalPossibleFormedEnergy;

  const handleScenarioChange = (sc: BondReactionScenario) => {
    sound.playClick();
    setSelectedScenario(sc);
    setBrokenBonds({});
    setFormedBonds({});
    setIsCalculated(false);
  };

  const handleBreakBond = (bondName: string, maxCount: number) => {
    const current = brokenBonds[bondName] || 0;
    if (current < maxCount) {
      sound.playClick();
      setBrokenBonds({ ...brokenBonds, [bondName]: current + 1 });
    }
  };

  const handleFormBond = (bondName: string, maxCount: number) => {
    const current = formedBonds[bondName] || 0;
    if (current < maxCount) {
      sound.playClick();
      setFormedBonds({ ...formedBonds, [bondName]: current + 1 });
    }
  };

  const handleCalculateBalance = () => {
    if (currentBrokenCount === totalReactantBondsCount && currentFormedCount === totalProductBondsCount) {
      setIsCalculated(true);
      if (netDeltaH < 0) {
        sound.playExoFire();
      } else {
        sound.playEndoIce();
      }
      onEarnXP(35);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } else {
      sound.playWrong();
    }
  };

  const handleReset = () => {
    sound.playClick();
    setBrokenBonds({});
    setFormedBonds({});
    setIsCalculated(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Link2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Bond Energy Workshop
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            <strong>BENDO-MEXO Rule:</strong> Breaking bonds always <strong>absorbs energy (Endothermic, +)</strong>;
            Making bonds always <strong>releases energy (Exothermic, -)</strong>.
          </p>
        </div>

        {/* Reaction selector tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {BOND_REACTION_SCENARIOS.map((sc) => {
            const isSelected = selectedScenario.id === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => handleScenarioChange(sc)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-purple-600 text-white border-purple-700 shadow-xs ring-2 ring-purple-500/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {sc.title.split('→')[0]} ➔
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Step 1: Breaking Reactant Bonds (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  <Scissors className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-slate-900 text-sm">
                  Step 1: Break Reactant Bonds
                </h3>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md">
                Absorbs Energy (+)
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-2 mb-4">
              Click each bond to spend activation energy breaking it into isolated free atoms:
            </p>

            {/* Interactive Bond Buttons */}
            <div className="space-y-3">
              {selectedScenario.reactantBonds.map((b) => {
                const broken = brokenBonds[b.bond] || 0;
                const isAllBroken = broken >= b.count;
                return (
                  <div
                    key={b.bond}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-base text-slate-800">
                          {b.count} × {b.bond}
                        </span>
                        <span className="text-xs font-mono text-slate-500">
                          ({b.energy} kJ/mol each)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Broken: {broken} of {b.count} bonds
                      </div>
                    </div>

                    <button
                      onClick={() => handleBreakBond(b.bond, b.count)}
                      disabled={isAllBroken}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-xs ${
                        isAllBroken
                          ? 'bg-emerald-100 text-emerald-800 cursor-default'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isAllBroken ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Broken</span>
                        </>
                      ) : (
                        <>
                          <Scissors className="w-3.5 h-3.5" />
                          <span>Snap Bond (+{b.energy} kJ)</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subtotal Absorbed */}
          <div className="mt-6 p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900">
              Total Energy Absorbed to Break Bonds:
            </span>
            <span className="font-mono text-base font-extrabold text-blue-700">
              +{energyAbsorbedBroken} kJ/mol
            </span>
          </div>
        </div>

        {/* Step 2: Forming Product Bonds (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                  <Hammer className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-slate-900 text-sm">
                  Step 2: Form Product Bonds
                </h3>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-rose-100 text-rose-800 rounded-md">
                Releases Energy (-)
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-2 mb-4">
              Click to forge new, stable product bonds and liberate thermal energy:
            </p>

            {/* Interactive Form Buttons */}
            <div className="space-y-3">
              {selectedScenario.productBonds.map((b) => {
                const formed = formedBonds[b.bond] || 0;
                const isAllFormed = formed >= b.count;
                return (
                  <div
                    key={b.bond}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-base text-slate-800">
                          {b.count} × {b.bond}
                        </span>
                        <span className="text-xs font-mono text-slate-500">
                          ({b.energy} kJ/mol each)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Formed: {formed} of {b.count} bonds
                      </div>
                    </div>

                    <button
                      onClick={() => handleFormBond(b.bond, b.count)}
                      disabled={formed >= b.count}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-xs ${
                        isAllFormed
                          ? 'bg-emerald-100 text-emerald-800 cursor-default'
                          : 'bg-rose-600 hover:bg-rose-700 text-white'
                      }`}
                    >
                      {isAllFormed ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Formed</span>
                        </>
                      ) : (
                        <>
                          <Hammer className="w-3.5 h-3.5" />
                          <span>Forge Bond (-{b.energy} kJ)</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subtotal Released */}
          <div className="mt-6 p-4 rounded-xl bg-rose-50/70 border border-rose-200 flex items-center justify-between">
            <span className="text-xs font-bold text-rose-900">
              Total Energy Released from Forming Bonds:
            </span>
            <span className="font-mono text-base font-extrabold text-rose-700">
              -{energyReleasedFormed} kJ/mol
            </span>
          </div>
        </div>
      </div>

      {/* Enthalpy Net Balance Scale & Computation */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Net Enthalpy Balance: ΔH = Σ(Bonds Broken) - Σ(Bonds Formed)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl"
              title="Reset Bonds"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleCalculateBalance}
              disabled={
                currentBrokenCount !== totalReactantBondsCount ||
                currentFormedCount !== totalProductBondsCount
              }
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Scale className="w-4 h-4" />
              <span>Balance Reaction Enthalpy</span>
            </button>
          </div>
        </div>

        {/* Visual Balance Scale */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
          <div className="max-w-xl mx-auto flex items-center justify-between font-mono text-sm">
            <div className="text-center p-3 bg-blue-100/60 rounded-xl border border-blue-200">
              <span className="block text-[10px] font-sans font-bold text-blue-900 uppercase">
                Bonds Broken (Reactants)
              </span>
              <span className="text-lg font-extrabold text-blue-700">
                +{totalPossibleBrokenEnergy} kJ
              </span>
            </div>

            <div className="text-slate-400 font-extrabold text-xl">-</div>

            <div className="text-center p-3 bg-rose-100/60 rounded-xl border border-rose-200">
              <span className="block text-[10px] font-sans font-bold text-rose-900 uppercase">
                Bonds Formed (Products)
              </span>
              <span className="text-lg font-extrabold text-rose-700">
                {totalPossibleFormedEnergy} kJ
              </span>
            </div>

            <div className="text-slate-400 font-extrabold text-xl">=</div>

            <div
              className={`text-center p-3 rounded-xl border ${
                netDeltaH < 0
                  ? 'bg-rose-50 border-rose-300 text-rose-800'
                  : 'bg-cyan-50 border-cyan-300 text-cyan-800'
              }`}
            >
              <span className="block text-[10px] font-sans font-bold uppercase">
                Overall Reaction ΔH
              </span>
              <span className="text-lg font-extrabold">
                {netDeltaH > 0 ? `+${netDeltaH}` : netDeltaH} kJ/mol
              </span>
            </div>
          </div>

          {/* Outcome Badge */}
          {isCalculated && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-xs animate-bounce bg-white border border-slate-300">
              {netDeltaH < 0 ? (
                <>
                  <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span className="text-rose-700">
                    Reaction is EXOTHERMIC! Forming product bonds released more energy than breaking reactant bonds required.
                  </span>
                </>
              ) : (
                <>
                  <Snowflake className="w-4 h-4 text-cyan-500" />
                  <span className="text-cyan-700">
                    Reaction is ENDOTHERMIC! Breaking reactant bonds absorbed more energy than forming product bonds released.
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { CHEMICAL_REACTIONS } from '../data/thermochemistryData';
import { ChemicalReaction } from '../types';
import { sound } from '../utils/sound';
import {
  Flame,
  Snowflake,
  Play,
  RotateCcw,
  Thermometer,
  Layers,
  ArrowRight,
  Info,
  Beaker,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface CalorimeterLabProps {
  onEarnXP: (amount: number) => void;
}

export const CalorimeterLab: React.FC<CalorimeterLabProps> = ({ onEarnXP }) => {
  const [selectedReaction, setSelectedReaction] = useState<ChemicalReaction>(CHEMICAL_REACTIONS[0]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [currentTemp, setCurrentTemp] = useState<number>(selectedReaction.initialTemp);
  const [progress, setProgress] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'particles' | 'profile' | 'math'>('particles');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Reset when reaction changes
  const handleSelectReaction = (rxn: ChemicalReaction) => {
    sound.playClick();
    setSelectedReaction(rxn);
    setIsRunning(false);
    setIsCompleted(false);
    setCurrentTemp(rxn.initialTemp);
    setProgress(0);
  };

  // Run reaction animation
  const startExperiment = () => {
    if (isRunning) return;
    setIsRunning(true);
    setIsCompleted(false);
    setProgress(0);

    if (selectedReaction.type === 'exothermic') {
      sound.playExoFire();
    } else {
      sound.playEndoIce();
    }

    const duration = 2800; // ms
    const startTime = performance.now();
    const startTemp = selectedReaction.initialTemp;
    const targetTemp = selectedReaction.finalTemp;

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const fraction = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - fraction, 3);

      setProgress(fraction);
      setCurrentTemp(+(startTemp + (targetTemp - startTemp) * eased).toFixed(1));

      if (fraction < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsRunning(false);
        setIsCompleted(true);
        sound.playCorrect();
        onEarnXP(25);
      }
    };

    requestAnimationFrame(animate);
  };

  const resetExperiment = () => {
    sound.playClick();
    setIsRunning(false);
    setIsCompleted(false);
    setCurrentTemp(selectedReaction.initialTemp);
    setProgress(0);
  };

  // Canvas particle simulation (Molecular kinetic energy & heat flow)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = canvas.width;
    const height = canvas.height;

    // Generate simulated solution particles
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      label: string;
    }

    const particles: Particle[] = [];
    const count = 36;
    for (let i = 0; i < count; i++) {
      const isSolute = i < 14;
      particles.push({
        x: 40 + Math.random() * (width - 80),
        y: 40 + Math.random() * (height - 80),
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: isSolute ? 7 : 4,
        color: isSolute
          ? selectedReaction.type === 'exothermic'
            ? '#EF4444'
            : '#3B82F6'
          : '#60A5FA',
        label: isSolute ? (i % 2 === 0 ? 'A+' : 'B-') : 'H₂O'
      });
    }

    // Heat arrows
    interface HeatWave {
      x: number;
      y: number;
      radius: number;
      alpha: number;
    }
    const heatWaves: HeatWave[] = [];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Temperature-driven speed factor
      // Baseline temp = 22°C -> speed multiplier = 1.0
      const speedMultiplier = Math.max(0.2, (currentTemp + 20) / 42);

      // Draw subtle beaker interior fluid background
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      if (selectedReaction.type === 'exothermic' && progress > 0.1) {
        grad.addColorStop(0, `rgba(254, 242, 242, ${0.4 + progress * 0.4})`);
        grad.addColorStop(1, `rgba(254, 202, 202, ${0.4 + progress * 0.5})`);
      } else if (selectedReaction.type === 'endothermic' && progress > 0.1) {
        grad.addColorStop(0, `rgba(240, 249, 255, ${0.5 + progress * 0.4})`);
        grad.addColorStop(1, `rgba(186, 230, 253, ${0.5 + progress * 0.5})`);
      } else {
        grad.addColorStop(0, '#F0F9FF');
        grad.addColorStop(1, '#E0F2FE');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(10, 10, width - 20, height - 20);

      // Draw heat wave pulses
      if (isRunning || isCompleted) {
        if (Math.random() < 0.1) {
          heatWaves.push({
            x: width / 2,
            y: height / 2,
            radius: 10,
            alpha: 0.8
          });
        }
      }

      for (let i = heatWaves.length - 1; i >= 0; i--) {
        const hw = heatWaves[i];
        if (selectedReaction.type === 'exothermic') {
          // Waves radiate OUTWARD
          hw.radius += 1.8;
          hw.alpha -= 0.015;
          ctx.strokeStyle = `rgba(239, 68, 68, ${Math.max(0, hw.alpha)})`;
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(hw.x, hw.y, hw.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        } else {
          // Cold pulses: Frost rings contracting or cooling
          hw.radius += 1.2;
          hw.alpha -= 0.012;
          ctx.strokeStyle = `rgba(14, 165, 233, ${Math.max(0, hw.alpha)})`;
          ctx.lineWidth = 2;
          ctx.setLineDash([2, 4]);
          ctx.beginPath();
          ctx.arc(hw.x, hw.y, hw.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
        if (hw.alpha <= 0 || hw.radius > width) {
          heatWaves.splice(i, 1);
        }
      }

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx * speedMultiplier;
        p.y += p.vy * speedMultiplier;

        // Wall collisions
        if (p.x <= 25 || p.x >= width - 25) p.vx *= -1;
        if (p.y <= 25 || p.y >= height - 25) p.vy *= -1;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Label
        if (p.radius > 5) {
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 8px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.label, p.x, p.y);
        }
      });

      // Overlay text indicators
      ctx.fillStyle = '#64748B';
      ctx.font = '600 11px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(
        `Kinetic Energy Multiplier: ${speedMultiplier.toFixed(2)}x`,
        20,
        height - 24
      );

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [selectedReaction, currentTemp, isRunning, isCompleted, progress]);

  // Thermometer height percentage (Range: -10°C to 90°C)
  const minTemp = -10;
  const maxTemp = 90;
  const tempPercent = Math.min(
    100,
    Math.max(0, ((currentTemp - minTemp) / (maxTemp - minTemp)) * 100)
  );

  // Thermodynamics Math Calculations
  const deltaT = +(currentTemp - selectedReaction.initialTemp).toFixed(1);
  const specificHeatWater = 4.184; // J/(g·°C)
  const qWaterJoules = +(selectedReaction.massWater * specificHeatWater * deltaT).toFixed(1);
  const qWaterKJ = +(qWaterJoules / 1000).toFixed(2);
  const qReactionKJ = +(-qWaterKJ).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Top Banner / Reaction Selector */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <Beaker className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Virtual Coffee-Cup Calorimeter
              </h2>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              Select a reaction, drop reagents into the calorimeter, and measure the heat transfer
              between <strong>System</strong> and <strong>Surroundings</strong>.
            </p>
          </div>

          {/* Quick Reaction Pills */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Presets:</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 text-xs font-semibold rounded-md border border-rose-200">
              <Flame className="w-3.5 h-3.5 text-rose-500" /> Exothermic (Heat Out)
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-cyan-50 text-cyan-700 text-xs font-semibold rounded-md border border-cyan-200">
              <Snowflake className="w-3.5 h-3.5 text-cyan-500" /> Endothermic (Heat In)
            </span>
          </div>
        </div>

        {/* Reaction Selection Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {CHEMICAL_REACTIONS.map((rxn) => {
            const isSelected = selectedReaction.id === rxn.id;
            const isExo = rxn.type === 'exothermic';
            return (
              <button
                key={rxn.id}
                onClick={() => handleSelectReaction(rxn)}
                className={`p-3 rounded-xl text-left border transition-all relative overflow-hidden group ${
                  isSelected
                    ? isExo
                      ? 'bg-rose-50/60 border-rose-500 ring-2 ring-rose-500/20 shadow-xs'
                      : 'bg-cyan-50/60 border-cyan-500 ring-2 ring-cyan-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      isExo ? 'bg-rose-100 text-rose-800' : 'bg-cyan-100 text-cyan-800'
                    }`}
                  >
                    {isExo ? 'Exo 🔥' : 'Endo ❄️'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {rxn.deltaH > 0 ? `+${rxn.deltaH}` : rxn.deltaH} kJ
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {rxn.commonName}
                </h4>
                <p className="text-[11px] font-mono text-slate-600 truncate mt-0.5">{rxn.name}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Experiment Bench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: The Calorimeter Setup & Thermometer (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Current Setup
              </span>
              <h3 className="text-lg font-bold text-slate-900">{selectedReaction.commonName}</h3>
              <p className="font-mono text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 inline-block mt-1">
                {selectedReaction.equation}
              </p>
            </div>

            {/* Run / Reset Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={resetExperiment}
                disabled={isRunning}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 disabled:opacity-50 transition-colors"
                title="Reset Apparatus"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={startExperiment}
                disabled={isRunning || isCompleted}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-md transition-all ${
                  isRunning
                    ? 'bg-slate-400 cursor-not-allowed'
                    : isCompleted
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : selectedReaction.type === 'exothermic'
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                    : 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-600/20'
                }`}
              >
                {isRunning ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Reacting...</span>
                  </>
                ) : isCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Done! Re-run</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Drop Reagents & Stir</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Interactive Beaker & Thermometer Visualizer */}
          <div className="relative py-6 flex items-center justify-center gap-6 sm:gap-10">
            {/* Real-time Thermometer Graphic */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 mb-2">
                <Thermometer className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-600">Surroundings Temp</span>
              </div>

              {/* The Thermometer Tube */}
              <div className="relative w-8 h-64 bg-slate-100 rounded-full border-2 border-slate-300 p-1 flex flex-col justify-end shadow-inner">
                {/* Scale ticks */}
                <div className="absolute left-[-22px] top-4 text-[9px] font-mono text-slate-400">90°</div>
                <div className="absolute left-[-22px] top-1/2 text-[9px] font-mono text-slate-400">40°</div>
                <div className="absolute left-[-24px] bottom-6 text-[9px] font-mono text-slate-400">-10°</div>

                {/* Mercury Liquid Column */}
                <div
                  className={`w-full rounded-full transition-all duration-300 ${
                    selectedReaction.type === 'exothermic'
                      ? 'bg-gradient-to-t from-rose-500 via-orange-500 to-amber-400 shadow-md shadow-rose-500/30'
                      : 'bg-gradient-to-t from-blue-700 via-cyan-500 to-teal-300 shadow-md shadow-cyan-500/30'
                  }`}
                  style={{ height: `${Math.max(8, tempPercent)}%` }}
                />

                {/* Bulb at bottom */}
                <div
                  className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-2 border-slate-300 ${
                    selectedReaction.type === 'exothermic' ? 'bg-rose-500' : 'bg-blue-600'
                  } shadow-md`}
                />
              </div>

              {/* Live Temp Badge */}
              <div
                className={`mt-6 px-3 py-1 rounded-xl text-center border font-mono font-bold text-sm shadow-xs ${
                  currentTemp > selectedReaction.initialTemp
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : currentTemp < selectedReaction.initialTemp
                    ? 'bg-cyan-50 border-cyan-200 text-cyan-800'
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                {currentTemp.toFixed(1)}°C
                <span className="block text-[10px] font-sans font-medium text-slate-600">
                  {deltaT > 0 ? `+${deltaT}°C` : `${deltaT}°C`} ΔT
                </span>
              </div>
            </div>

            {/* Simulated Calorimeter Chamber */}
            <div className="relative w-64 sm:w-80 h-72 rounded-3xl border-4 border-slate-300/80 bg-slate-900/5 p-3 flex flex-col justify-end overflow-hidden shadow-inner">
              {/* Lid with Stirrer hole */}
              <div className="absolute top-2 left-6 right-6 h-4 bg-slate-300 rounded-md border border-slate-400 flex items-center justify-center">
                <span className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-wider">
                  Insulated Lid
                </span>
                {/* Stirrer rod */}
                <div
                  className={`absolute top-0 right-10 w-2 h-44 bg-slate-400 rounded-b-md shadow-xs ${
                    isRunning ? 'animate-bounce' : ''
                  }`}
                />
              </div>

              {/* Particle Canvas */}
              <canvas
                ref={canvasRef}
                width={320}
                height={230}
                className="w-full h-56 rounded-2xl border border-slate-200 shadow-sm bg-white"
              />

              {/* Visual Effect Overlays */}
              {isRunning && selectedReaction.visualPhenomenon === 'frost' && (
                <div className="absolute inset-0 pointer-events-none bg-cyan-100/30 backdrop-blur-[1px] flex items-center justify-center">
                  <div className="px-3 py-1.5 bg-cyan-900/80 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 animate-pulse">
                    <Snowflake className="w-4 h-4 text-cyan-300" />
                    <span>Freezing Frost Forming!</span>
                  </div>
                </div>
              )}

              {isRunning && selectedReaction.visualPhenomenon === 'flame' && (
                <div className="absolute inset-0 pointer-events-none bg-rose-500/10 flex items-center justify-center">
                  <div className="px-3 py-1.5 bg-rose-900/80 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 animate-pulse">
                    <Flame className="w-4 h-4 text-rose-300" />
                    <span>Blazing Exothermic Flame!</span>
                  </div>
                </div>
              )}

              {/* Heat Flow Direction Badge */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap">
                {selectedReaction.type === 'exothermic' ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-600/90 text-white rounded-full text-xs font-bold shadow-md">
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>Heat flows: System ➔ Surroundings</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-cyan-700/90 text-white rounded-full text-xs font-bold shadow-md">
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                    <span>Heat flows: Surroundings ➔ System</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Real-World Feel summary */}
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 ${
              selectedReaction.type === 'exothermic'
                ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                : 'bg-cyan-50/80 border-cyan-200 text-cyan-900'
            }`}
          >
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                Tactile Sensation:{' '}
                {selectedReaction.type === 'exothermic'
                  ? 'Hot to the touch! (Releases Heat)'
                  : 'Freezing cold to the touch! (Absorbs Heat)'}
              </p>
              <p className="text-slate-600 mt-0.5">{selectedReaction.surroundingsEffect}</p>
            </div>
          </div>
        </div>

        {/* Right: Pedagogy, Diagram & Calorimetry Calculation Tabs (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col">
          {/* Subtabs: Conceptual / Energy Profile / Math */}
          <div className="flex border-b border-slate-200 pb-2 mb-4 gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('particles');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'particles'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              System vs Surroundings
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('profile');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Energy Diagram
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('math');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'math'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              q = mcΔT Math
            </button>
          </div>

          {/* Tab 1: System vs Surroundings Pedagogy */}
          {activeTab === 'particles' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="font-bold text-slate-900 block mb-1">
                  1. Who is the SYSTEM?
                </span>
                <p className="text-slate-600 leading-relaxed">
                  The reacting chemical particles, dissolved ions, and chemical bonds participating
                  in the reaction: <code className="text-indigo-600 font-mono font-bold">{selectedReaction.reactants.join(' + ')}</code>.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="font-bold text-slate-900 block mb-1">
                  2. Who are the SURROUNDINGS?
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Everything else in the universe! Specifically, the solvent water molecules, the
                  insulating cup walls, the glass thermometer bulb, and your hand holding the beaker.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="font-bold text-slate-900 block mb-1">
                  3. Sign of Enthalpy (ΔH):
                </span>
                <p className="text-slate-600 leading-relaxed">
                  {selectedReaction.type === 'exothermic' ? (
                    <span className="text-rose-700 font-bold">
                      Negative (ΔH &lt; 0): The system loses energy. Energy leaves the reaction:
                      ΔH = {selectedReaction.deltaH} kJ/mol.
                    </span>
                  ) : (
                    <span className="text-cyan-700 font-bold">
                      Positive (ΔH &gt; 0): The system gains energy. Energy enters the reaction:
                      ΔH = +{selectedReaction.deltaH} kJ/mol.
                    </span>
                  )}
                </p>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                <div className="flex items-center gap-1.5 font-bold text-indigo-900 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Real-World Context:</span>
                </div>
                <p className="text-indigo-800">{selectedReaction.realWorldUse}</p>
              </div>
            </div>
          )}

          {/* Tab 2: Synced Reaction Energy Profile */}
          {activeTab === 'profile' && (
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Reaction Coordinate Profile
                </h4>
                {/* SVG Energy Diagram */}
                <div className="relative w-full h-48 bg-slate-50 rounded-xl border border-slate-200 p-2">
                  <svg className="w-full h-full" viewBox="0 0 300 180">
                    {/* Axes */}
                    <line x1="30" y1="160" x2="280" y2="160" stroke="#94A3B8" strokeWidth="2" />
                    <line x1="30" y1="160" x2="30" y2="20" stroke="#94A3B8" strokeWidth="2" />

                    {/* Axis Labels */}
                    <text x="15" y="20" fill="#64748B" fontSize="9" fontWeight="bold">
                      Energy (H)
                    </text>
                    <text x="200" y="174" fill="#64748B" fontSize="9" fontWeight="bold">
                      Reaction Progress ➔
                    </text>

                    {/* Coordinates */}
                    {selectedReaction.type === 'exothermic' ? (
                      <>
                        {/* Reactants line */}
                        <line x1="30" y1="70" x2="80" y2="70" stroke="#EF4444" strokeWidth="3" />
                        <text x="35" y="62" fill="#B91C1C" fontSize="10" fontWeight="bold">
                          Reactants
                        </text>

                        {/* Peak Ea curve */}
                        <path
                          d="M 80 70 Q 140 25 200 125"
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth="2.5"
                        />

                        {/* Activated Complex Peak */}
                        <circle cx="135" cy="40" r="4" fill="#DC2626" />
                        <text x="145" y="38" fill="#991B1B" fontSize="8" fontWeight="bold">
                          Activated Complex [‡]
                        </text>

                        {/* Products line */}
                        <line x1="200" y1="125" x2="270" y2="125" stroke="#EF4444" strokeWidth="3" />
                        <text x="210" y="140" fill="#B91C1C" fontSize="10" fontWeight="bold">
                          Products
                        </text>

                        {/* Delta H arrow */}
                        <line
                          x1="240"
                          y1="70"
                          x2="240"
                          y2="123"
                          stroke="#DC2626"
                          strokeWidth="2"
                          strokeDasharray="3 3"
                        />
                        <polygon points="237,120 240,126 243,120" fill="#DC2626" />
                        <text x="245" y="100" fill="#DC2626" fontSize="10" fontWeight="bold">
                          ΔH &lt; 0 (-)
                        </text>
                      </>
                    ) : (
                      <>
                        {/* Endothermic curve */}
                        <line x1="30" y1="125" x2="80" y2="125" stroke="#0284C7" strokeWidth="3" />
                        <text x="35" y="140" fill="#0369A1" fontSize="10" fontWeight="bold">
                          Reactants
                        </text>

                        <path
                          d="M 80 125 Q 150 25 210 65"
                          fill="none"
                          stroke="#0284C7"
                          strokeWidth="2.5"
                        />

                        {/* Activated Complex Peak */}
                        <circle cx="145" cy="42" r="4" fill="#0284C7" />
                        <text x="155" y="40" fill="#075985" fontSize="8" fontWeight="bold">
                          Activated Complex [‡]
                        </text>

                        {/* Products line */}
                        <line x1="210" y1="65" x2="270" y2="65" stroke="#0284C7" strokeWidth="3" />
                        <text x="215" y="58" fill="#0369A1" fontSize="10" fontWeight="bold">
                          Products
                        </text>

                        {/* Delta H arrow pointing UP */}
                        <line
                          x1="245"
                          y1="125"
                          x2="245"
                          y2="67"
                          stroke="#0284C7"
                          strokeWidth="2"
                          strokeDasharray="3 3"
                        />
                        <polygon points="242,70 245,64 248,70" fill="#0284C7" />
                        <text x="250" y="98" fill="#0284C7" fontSize="10" fontWeight="bold">
                          ΔH &gt; 0 (+)
                        </text>
                      </>
                    )}
                  </svg>
                </div>
              </div>

              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block mb-0.5">Key Exam Takeaway:</span>
                <p className="text-slate-600">
                  {selectedReaction.type === 'exothermic'
                    ? 'Reactants are higher in potential energy than products. Surplus bond energy is cast off as thermal kinetic energy.'
                    : 'Products are higher in potential energy than reactants. The system had to pull thermal energy from the environment to ascend.'}
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Calorimetry Math q = mcΔT */}
          {activeTab === 'math' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                <span className="font-bold text-indigo-950 block mb-1">
                  Calorimetry Formula:
                </span>
                <p className="font-mono text-sm text-indigo-700 font-bold">
                  q = m · c · ΔT
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2 text-[11px] text-slate-600">
                  <div>• m = {selectedReaction.massWater} g (mass of water)</div>
                  <div>• c = 4.184 J/g·°C (specific heat)</div>
                  <div>• T_initial = {selectedReaction.initialTemp.toFixed(1)}°C</div>
                  <div>• T_final = {currentTemp.toFixed(1)}°C</div>
                </div>
              </div>

              {/* Step by step computation */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">1. ΔT = T_final - T_initial:</span>
                  <span className="font-bold text-slate-800">{deltaT > 0 ? `+${deltaT}` : deltaT}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">2. q_water = m · c · ΔT:</span>
                  <span className="font-bold text-slate-800">{qWaterJoules} J ({qWaterKJ} kJ)</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1.5">
                  <span className="text-slate-500">3. q_reaction = -q_water:</span>
                  <span className={`font-bold ${qReactionKJ < 0 ? 'text-rose-600' : 'text-cyan-600'}`}>
                    {qReactionKJ} kJ
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1.5">
                  <span className="text-slate-500">4. Moles of reactant:</span>
                  <span className="font-bold text-slate-800">{selectedReaction.molesReactant} mol</span>
                </div>
                <div className="flex justify-between bg-white p-2 rounded border border-slate-200">
                  <span className="font-bold text-slate-800 font-sans">Enthalpy ΔH:</span>
                  <span
                    className={`font-bold text-sm ${
                      selectedReaction.type === 'exothermic' ? 'text-rose-600' : 'text-cyan-600'
                    }`}
                  >
                    {selectedReaction.deltaH > 0
                      ? `+${selectedReaction.deltaH}`
                      : selectedReaction.deltaH}{' '}
                    kJ/mol
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

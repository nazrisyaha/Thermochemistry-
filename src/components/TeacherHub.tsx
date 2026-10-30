import React, { useState } from 'react';
import { sound } from '../utils/sound';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Clock,
  FlaskConical,
  Flame,
  Snowflake,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const TeacherHub: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    sound.playClick();
    setExpandedFaq(expandedFaq === idx ? null : idx);
  };

  const misconceptions = [
    {
      myth: '“Breaking chemical bonds releases energy because energy is stored in the bond.”',
      truth: 'Breaking chemical bonds ALWAYS REQUIRES energy input (Endothermic, +).',
      explanation:
        'Atoms form bonds because the bonded state is at a lower potential energy. Pulling them apart requires an energy investment to overcome electrostatic attraction. Energy is ONLY released when new, more stable bonds are formed!'
    },
    {
      myth: '“When a cold pack or endothermic beaker gets frosty, it is releasing cold.”',
      truth: 'There is no such physical entity as “coldness”; heat is leaving your skin.',
      explanation:
        'Thermal energy transfers spontaneously down temperature gradients. In an endothermic process, the system absorbs thermal energy from the water, beaker, and your nerve receptors, producing a drop in temperature.'
    },
    {
      myth: '“A chemical catalyst makes a reaction release more heat (increases ΔH).”',
      truth: 'A catalyst ONLY lowers the activation energy (Ea); ΔH remains unchanged.',
      explanation:
        'Enthalpy is a state function dependent solely on the initial reactant state and final product state. The catalyst only provides a lower-energy transition state pathway.'
    },
    {
      myth: '“Dissolving a salt in water is always physical and cannot be exothermic.”',
      truth: 'Dissolution can be strongly exothermic (like CaCl₂ or NaOH) or endothermic (like NH₄NO₃).',
      explanation:
        'Dissolution enthalpy is the net sum of Lattice Energy (breaking crystal lattice, always endothermic) and Hydration Energy (water solvating ions, always exothermic). Whichever magnitude is larger dictates the net sign of ΔH.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Teacher Lesson Guide & Pedagogy Cheatsheet
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Grade 11 Chemistry Curriculum Standards • Lesson flow, memory mnemonics, and misconception busters.
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Concept Matrix */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span>Core Comparison: Exothermic vs Endothermic</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 uppercase font-mono font-bold">
              <tr>
                <th className="p-3 border-b border-slate-200">Property</th>
                <th className="p-3 border-b border-slate-200 text-rose-700 bg-rose-50/50">
                  Exothermic (Heat Out 🔥)
                </th>
                <th className="p-3 border-b border-slate-200 text-cyan-700 bg-cyan-50/50">
                  Endothermic (Heat In ❄️)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              <tr>
                <td className="p-3 font-bold bg-slate-50">Definition</td>
                <td className="p-3">Reaction that releases heat into surroundings</td>
                <td className="p-3">Reaction that absorbs heat from surroundings</td>
              </tr>
              <tr>
                <td className="p-3 font-bold bg-slate-50">Enthalpy Change (ΔH)</td>
                <td className="p-3 font-mono font-bold text-rose-700">Negative (ΔH &lt; 0)</td>
                <td className="p-3 font-mono font-bold text-cyan-700">Positive (ΔH &gt; 0)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold bg-slate-50">Surroundings Temp (T)</td>
                <td className="p-3 font-bold text-rose-700">Increases (Feels Hot / Warm)</td>
                <td className="p-3 font-bold text-cyan-700">Decreases (Feels Icy / Cool)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold bg-slate-50">Heat Location in Equation</td>
                <td className="p-3 font-mono">Reactants → Products + Heat</td>
                <td className="p-3 font-mono">Reactants + Heat → Products</td>
              </tr>
              <tr>
                <td className="p-3 font-bold bg-slate-50">Potential Energy Profile</td>
                <td className="p-3">H_products &lt; H_reactants (Drops)</td>
                <td className="p-3">H_products &gt; H_reactants (Rises)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold bg-slate-50">Bond Strengths</td>
                <td className="p-3">Product bonds formed are STRONGER</td>
                <td className="p-3">Reactant bonds broken were STRONGER</td>
              </tr>
              <tr>
                <td className="p-3 font-bold bg-slate-50">Everyday Examples</td>
                <td className="p-3">Combustion, hand warmers, freezing water, condensation</td>
                <td className="p-3">Cold packs, photosynthesis, ice melting, evaporation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Classroom Memory Hooks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-sm uppercase tracking-wider">
            <Lightbulb className="w-5 h-5 text-indigo-600" />
            <span>Classroom Mnemonic: BENDO-MEXO</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-indigo-100 font-mono text-xs space-y-1.5 text-slate-800">
            <p>
              <strong className="text-blue-600 font-bold">B-ENDO:</strong> <strong>B</strong>ond{' '}
              <strong>B</strong>reaking is <strong>ENDO</strong>thermic (Requires Energy, +)
            </p>
            <p>
              <strong className="text-rose-600 font-bold">M-EXO:</strong> <strong>M</strong>aking{' '}
              Bonds is <strong>EXO</strong>thermic (Frees Energy, -)
            </p>
          </div>
          <p className="text-xs text-indigo-800 leading-relaxed">
            Have your students recite this whenever calculating bond enthalpies:
            <em> “Breaking is taking (+), making is freeing (-)”</em>.
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm uppercase tracking-wider">
            <Clock className="w-5 h-5 text-amber-600" />
            <span>Recommended 45-Min Lesson Outline</span>
          </div>
          <ul className="text-xs space-y-2 text-amber-950 font-medium">
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-700">00–08m:</span>
              <span>
                <strong>Engage Hook:</strong> Warm up with <strong>ThermoDash Arcade</strong> (who can get the highest streak?).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-700">08–22m:</span>
              <span>
                <strong>Lab Exploration:</strong> Test $CaCl_2$ vs $NH_4NO_3$ in the <strong>Virtual Calorimeter</strong> and calculate $q = mc\Delta T$.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-700">22–32m:</span>
              <span>
                <strong>Deep Dive:</strong> Use <strong>Energy Profile Architect</strong> & <strong>Bond Workshop</strong> to tackle bond energies.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-700">32–45m:</span>
              <span>
                <strong>Formative Evaluation:</strong> Students take the 10-question <strong>Mastery Arena</strong> and print/screenshot their Certificate.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Misconceptions Accordion */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-900">
            Top 4 Grade 11 Student Misconceptions Debunked
          </h3>
        </div>

        <div className="space-y-3">
          {misconceptions.map((item, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 transition-colors"
                >
                  <span className="text-rose-700">{item.myth}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isExpanded && (
                  <div className="p-4 bg-white text-xs space-y-2 border-t border-slate-200">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Scientific Fact: {item.truth}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{item.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

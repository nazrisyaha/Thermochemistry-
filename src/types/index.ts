export type TabMode = 'lab' | 'dash' | 'energy-profile' | 'bond-energy' | 'quiz' | 'teacher';

export type ReactionType = 'exothermic' | 'endothermic';

export interface ChemicalReaction {
  id: string;
  name: string;
  commonName: string;
  equation: string;
  type: ReactionType;
  deltaH: number; // kJ/mol
  initialTemp: number; // °C
  finalTemp: number; // °C
  massWater: number; // g
  molesReactant: number; // mol
  systemDescription: string;
  surroundingsEffect: string;
  realWorldUse: string;
  visualPhenomenon: 'bubbles' | 'flame' | 'frost' | 'steam' | 'glow' | 'dissolve';
  reactants: string[];
  products: string[];
  activationEnergy: number; // kJ/mol
  reactantEnergy: number; // arbitrary relative kJ
  productEnergy: number; // arbitrary relative kJ
  explanation: string;
}

export interface DashCard {
  id: string;
  title: string;
  subtitle: string;
  type: ReactionType;
  category: 'everyday' | 'chemical_equation' | 'phase_change' | 'biology_physics' | 'diagram_concept';
  equation?: string;
  deltaHSign?: string;
  clue: string;
  explanation: string;
  temperatureFeel: 'warmer' | 'cooler';
}

export interface BondData {
  name: string;
  symbol: string;
  energy: number; // kJ/mol
}

export interface BondReactionScenario {
  id: string;
  title: string;
  equation: string;
  reactantBonds: { bond: string; count: number; energy: number }[];
  productBonds: { bond: string; count: number; energy: number }[];
  description: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  context?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: 'definition' | 'diagram' | 'calculation' | 'real_world' | 'misconception';
  formulaHint?: string;
}

export interface StudentCertificate {
  studentName: string;
  date: string;
  score: number;
  totalQuestions: number;
  gradePercentage: number;
  rankTitle: string;
}

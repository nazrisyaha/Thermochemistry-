import { ChemicalReaction, DashCard, BondReactionScenario, QuizQuestion } from '../types';

export const CHEMICAL_REACTIONS: ChemicalReaction[] = [
  {
    id: 'calcium-chloride',
    name: 'Dissolution of Calcium Chloride',
    commonName: 'Instant Heat Pack Reaction',
    equation: 'CaCl₂(s) + H₂O(l) → Ca²⁺(aq) + 2Cl⁻(aq) + Heat',
    type: 'exothermic',
    deltaH: -82.8,
    initialTemp: 22.0,
    finalTemp: 41.8,
    massWater: 100,
    molesReactant: 0.1,
    systemDescription: 'Hydration energy of calcium and chloride ions exceeds the crystal lattice energy, releasing surplus thermal energy.',
    surroundingsEffect: 'Water molecules absorb released heat; temperature of the surroundings increases rapidly (+19.8°C). The beaker feels hot!',
    realWorldUse: 'Emergency winter hand warmers, de-icing roads in subzero weather.',
    visualPhenomenon: 'glow',
    reactants: ['CaCl₂(s) powder', 'H₂O(l) solvent'],
    products: ['Ca²⁺(aq)', '2Cl⁻(aq)'],
    activationEnergy: 15,
    reactantEnergy: 120,
    productEnergy: 37.2,
    explanation: 'Exothermic (ΔH = -82.8 kJ/mol). The system (solute-solvent particles) releases heat into the surroundings (the water and beaker), causing the measured temperature to rise.'
  },
  {
    id: 'ammonium-nitrate',
    name: 'Dissolution of Ammonium Nitrate',
    commonName: 'Instant Cold Pack Reaction',
    equation: 'NH₄NO₃(s) + Heat + H₂O(l) → NH₄⁺(aq) + NO₃⁻(aq)',
    type: 'endothermic',
    deltaH: +25.7,
    initialTemp: 22.0,
    finalTemp: 15.9,
    massWater: 100,
    molesReactant: 0.1,
    systemDescription: 'Crystal lattice energy requires more energy to disrupt than is released by hydration of ions. Heat is pulled from the water.',
    surroundingsEffect: 'Water loses kinetic energy as thermal energy enters the chemical system; temperature drops (-6.1°C). The beaker feels icy cold!',
    realWorldUse: 'First aid instant cold packs for athletic sprains and swelling reduction.',
    visualPhenomenon: 'frost',
    reactants: ['NH₄NO₃(s) white pellets', 'H₂O(l) solvent'],
    products: ['NH₄⁺(aq)', 'NO₃⁻(aq)'],
    activationEnergy: 35,
    reactantEnergy: 60,
    productEnergy: 85.7,
    explanation: 'Endothermic (ΔH = +25.7 kJ/mol). The system absorbs thermal energy from the water. Because surroundings lose heat, the thermometer reading falls.'
  },
  {
    id: 'magnesium-acid',
    name: 'Magnesium Ribbon + Hydrochloric Acid',
    commonName: 'Acid-Metal Hydrogen Generator',
    equation: 'Mg(s) + 2HCl(aq) → MgCl₂(aq) + H₂(g) + Heat',
    type: 'exothermic',
    deltaH: -462.0,
    initialTemp: 22.0,
    finalTemp: 55.0,
    massWater: 100,
    molesReactant: 0.03,
    systemDescription: 'Strong chemical bonds in hydrated Mg²⁺ and H-H are formed while weak metallic and acid bonds are broken, discharging intense heat.',
    surroundingsEffect: 'Vigorous effervescence with steam and hot vapor; the solution warms up dramatically (+33.0°C).',
    realWorldUse: 'Self-heating military meal rations (MRE heater packs) and hydrogen production.',
    visualPhenomenon: 'bubbles',
    reactants: ['Mg(s) shiny ribbon', '2HCl(aq) clear solution'],
    products: ['MgCl₂(aq)', 'H₂(g) bubbles'],
    activationEnergy: 25,
    reactantEnergy: 200,
    productEnergy: 38,
    explanation: 'Exothermic (ΔH = -462 kJ/mol). Energy released forming product bonds far surpasses the activation energy needed to break reactant bonds.'
  },
  {
    id: 'barium-thiocyanate',
    name: 'Barium Hydroxide + Ammonium Thiocyanate',
    commonName: 'The Extreme Frost Freezing Lab',
    equation: 'Ba(OH)₂·8H₂O(s) + 2NH₄SCN(s) + Heat → Ba(SCN)₂(aq) + 2NH₃(g) + 10H₂O(l)',
    type: 'endothermic',
    deltaH: +135.0,
    initialTemp: 22.0,
    finalTemp: -5.0,
    massWater: 80,
    molesReactant: 0.05,
    systemDescription: 'Enormous enthalpy of reaction is absorbed from the surroundings, accompanied by a massive entropy increase that drives the spontaneous freeze.',
    surroundingsEffect: 'Temperature plummets below zero! A wet wooden block placed underneath the flask actually freezes solid to the bottom of the beaker.',
    realWorldUse: 'Classic high school lecture demonstration showing a spontaneous endothermic reaction that freezes water.',
    visualPhenomenon: 'frost',
    reactants: ['Ba(OH)₂·8H₂O(s)', '2NH₄SCN(s)'],
    products: ['Ba(SCN)₂(aq)', '2NH₃(g)', '10H₂O(l)'],
    activationEnergy: 45,
    reactantEnergy: 50,
    productEnergy: 185,
    explanation: 'Deeply Endothermic (ΔH = +135 kJ/mol). So much heat is sucked from the surroundings that condensation on the outer glass turns directly to frost.'
  },
  {
    id: 'methane-combustion',
    name: 'Combustion of Methane (Natural Gas)',
    commonName: 'Bunsen Burner Flame',
    equation: 'CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(g) + Heat',
    type: 'exothermic',
    deltaH: -890.0,
    initialTemp: 22.0,
    finalTemp: 78.5,
    massWater: 150,
    molesReactant: 0.04,
    systemDescription: 'Extremely strong C=O double bonds (804 kJ/mol) and O-H bonds (463 kJ/mol) are formed, liberating tremendous thermal and radiant energy.',
    surroundingsEffect: 'Bright blue flame, radiant heat warming up surrounding air and water inside a calorimeter vessel.',
    realWorldUse: 'Home heating, cooking on gas stoves, natural gas power turbines.',
    visualPhenomenon: 'flame',
    reactants: ['CH₄(g)', '2O₂(g)'],
    products: ['CO₂(g)', '2H₂O(g)'],
    activationEnergy: 60,
    reactantEnergy: 250,
    productEnergy: 40,
    explanation: 'Exothermic (ΔH = -890 kJ/mol). Combustion is the archetype of exothermic reactions: energy stored in fuel molecules is transformed into kinetic and radiant energy.'
  },
  {
    id: 'baking-soda-vinegar',
    name: 'Sodium Bicarbonate + Acetic Acid',
    commonName: 'Fizzy Volcano Reaction',
    equation: 'NaHCO₃(s) + CH₃COOH(aq) + Heat → NaCH₃COO(aq) + H₂O(l) + CO₂(g)',
    type: 'endothermic',
    deltaH: +28.0,
    initialTemp: 22.0,
    finalTemp: 17.5,
    massWater: 100,
    molesReactant: 0.05,
    systemDescription: 'Two-step acid-base and decomposition reaction absorbs heat as carbonic acid decomposes into carbon dioxide and water.',
    surroundingsEffect: 'Effervescent fizzing with foaming carbon dioxide bubbles; the liquid cools down noticeably to the touch (-4.5°C).',
    realWorldUse: 'Baking rise reactions in cakes, bath bombs, fire extinguishers.',
    visualPhenomenon: 'bubbles',
    reactants: ['NaHCO₃(s)', 'CH₃COOH(aq)'],
    products: ['NaCH₃COO(aq)', 'CO₂(g)', 'H₂O(l)'],
    activationEnergy: 30,
    reactantEnergy: 75,
    productEnergy: 103,
    explanation: 'Endothermic (ΔH = +28 kJ/mol). Despite looking vigorous like a boiling liquid, the reaction actually absorbs thermal energy and drops in temperature.'
  }
];

export const DASH_CARDS: DashCard[] = [
  // Level 1: Everyday & Intuitive
  {
    id: 'd1',
    title: 'Campfire Burning Wood',
    subtitle: 'Wood logs reacting with oxygen in air',
    type: 'exothermic',
    category: 'everyday',
    clue: 'Notice how you can warm your hands standing 5 feet away from it.',
    explanation: 'Combustion of cellulose releases huge amounts of heat and light to the surroundings (ΔH < 0).',
    temperatureFeel: 'warmer'
  },
  {
    id: 'd2',
    title: 'Sweat Evaporating from Skin',
    subtitle: 'Liquid water turning to water vapor on your body',
    type: 'endothermic',
    category: 'everyday',
    clue: 'Why do you feel a chill when a breeze blows over your sweaty forehead?',
    explanation: 'Liquid water absorbs thermal energy from your skin to break hydrogen bonds and vaporize (ΔH_vap > 0), cooling your body.',
    temperatureFeel: 'cooler'
  },
  {
    id: 'd3',
    title: 'Instant Chemical Cold Pack',
    subtitle: 'Puncturing inner water pouch to dissolve ammonium nitrate',
    type: 'endothermic',
    category: 'everyday',
    clue: 'Placed on an athlete’s swollen ankle to numb the pain and absorb swelling heat.',
    explanation: 'The dissolving process absorbs heat from the injured ankle, lowering the temperature of the surroundings.',
    temperatureFeel: 'cooler'
  },
  {
    id: 'd4',
    title: 'Iron Hand Warmer Oxidation',
    subtitle: 'Iron powder reacting with atmospheric oxygen in packet',
    type: 'exothermic',
    category: 'everyday',
    clue: 'Shake the pouch to start rusting and slide into your winter gloves.',
    explanation: 'Rusting is an exothermic oxidation reaction: 4Fe + 3O₂ → 2Fe₂O₃ (ΔH = -1648 kJ), delivering comforting warmth for 8 hours.',
    temperatureFeel: 'warmer'
  },
  {
    id: 'd5',
    title: 'Ice Melting on Kitchen Counter',
    subtitle: 'Solid H₂O transitioning to liquid H₂O',
    type: 'endothermic',
    category: 'phase_change',
    clue: 'Does ice need to absorb room heat to melt, or does it pump heat out?',
    explanation: 'Melting requires heat input from the room to overcome intermolecular forces between ice crystal molecules (ΔH_fus = +6.01 kJ/mol).',
    temperatureFeel: 'cooler'
  },
  {
    id: 'd6',
    title: 'Water Freezing in the Freezer',
    subtitle: 'Liquid H₂O arranging into solid crystal lattice',
    type: 'exothermic',
    category: 'phase_change',
    clue: 'Think about bond formation: hydrogen bonds freeze into rigid crystals.',
    explanation: 'Forming stable intermolecular bonds releases latent heat into the surrounding freezer air (ΔH = -6.01 kJ/mol).',
    temperatureFeel: 'warmer'
  },
  {
    id: 'd7',
    title: 'Baking a Loaf of Bread',
    subtitle: 'Thermal energy continually supplied by a 375°F oven',
    type: 'endothermic',
    category: 'everyday',
    clue: 'If you turn off the oven heating elements, does the raw dough finish baking on its own?',
    explanation: 'Starch gelatinization and protein denaturation require continuous heat absorption to undergo chemical transformation.',
    temperatureFeel: 'cooler'
  },
  {
    id: 'd8',
    title: 'Fireworks Exploding in the Night Sky',
    subtitle: 'Gunpowder & metal salts reacting violently',
    type: 'exothermic',
    category: 'everyday',
    clue: 'Tremendous blast of light, loud boom, and scorching hot air shockwaves.',
    explanation: 'Rapid oxidation produces heated expanding gases, radiating heat and light outward into the surroundings.',
    temperatureFeel: 'warmer'
  },

  // Level 2: Thermochemical Equations & Values
  {
    id: 'd9',
    title: 'N₂(g) + 3H₂(g) → 2NH₃(g)',
    subtitle: 'ΔH = -92.2 kJ/mol (Haber-Bosch Process)',
    type: 'exothermic',
    category: 'chemical_equation',
    equation: 'N₂(g) + 3H₂(g) → 2NH₃(g)   ΔH = -92.2 kJ',
    deltaHSign: 'Negative (-)',
    clue: 'Look closely at the sign of ΔH! Negative always signals one direction.',
    explanation: 'A negative ΔH value means enthalpy decreases; heat is released to the surroundings.',
    temperatureFeel: 'warmer'
  },
  {
    id: 'd10',
    title: '2H₂O(l) → 2H₂(g) + O₂(g)',
    subtitle: 'ΔH = +572 kJ (Electrolysis of Water)',
    type: 'endothermic',
    category: 'chemical_equation',
    equation: '2H₂O(l) + Energy → 2H₂(g) + O₂(g)',
    deltaHSign: 'Positive (+)',
    clue: 'Requires continuous electric current to crack water into its elements.',
    explanation: 'Positive ΔH means the system absorbs electrical/thermal energy to break stable O-H bonds.',
    temperatureFeel: 'cooler'
  },
  {
    id: 'd11',
    title: '2SO₂(g) + O₂(g) ⇌ 2SO₃(g) + 198 kJ',
    subtitle: 'Heat written as a PRODUCT on the right',
    type: 'exothermic',
    category: 'chemical_equation',
    equation: '2SO₂(g) + O₂(g) → 2SO₃(g) + Heat',
    clue: 'When "Heat" is on the right side of an equation, it has been released like a product.',
    explanation: 'Heat produced as an exit product denotes an exothermic reaction.',
    temperatureFeel: 'warmer'
  },
  {
    id: 'd12',
    title: 'CaCO₃(s) + 178 kJ → CaO(s) + CO₂(g)',
    subtitle: 'Heat written as a REACTANT on the left',
    type: 'endothermic',
    category: 'chemical_equation',
    equation: 'CaCO₃(s) + Heat → CaO(s) + CO₂(g)',
    clue: 'Heat is required as an input ingredient on the left side of the arrow.',
    explanation: 'Thermal decomposition of limestone requires heat absorption; heat is a reactant (endothermic).',
    temperatureFeel: 'cooler'
  },
  {
    id: 'd13',
    title: 'Photosynthesis in Green Leaves',
    subtitle: '6CO₂ + 6H₂O + Solar Energy → C₆H₁₂O₆ + 6O₂',
    type: 'endothermic',
    category: 'biology_physics',
    clue: 'Plants absorb sunlight photons to synthesize high-energy glucose molecules.',
    explanation: 'Solar photons are absorbed and stored in chemical bonds of glucose (ΔH = +2803 kJ/mol).',
    temperatureFeel: 'cooler'
  },
  {
    id: 'd14',
    title: 'Cellular Respiration in Living Cells',
    subtitle: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + 38 ATP + Heat',
    type: 'exothermic',
    category: 'biology_physics',
    clue: 'Our core body stays at 37°C (98.6°F) thanks to this continuous combustion.',
    explanation: 'Metabolic oxidation of glucose releases energy to generate ATP and maintain homeostatic body heat.',
    temperatureFeel: 'warmer'
  },

  // Level 3: Conceptual & Bond Enthalpy Curiosities
  {
    id: 'd15',
    title: 'Steam Condensing into Water Drops',
    subtitle: 'H₂O(g) → H₂O(l) on bathroom mirror',
    type: 'exothermic',
    category: 'phase_change',
    clue: 'High-energy steam gas molecules slow down and form intermolecular hydrogen bonds.',
    explanation: 'Condensation is exothermic! Steam burns are so severe because steam releases its massive latent heat of vaporization (44 kJ/mol) directly onto skin.',
    temperatureFeel: 'warmer'
  },
  {
    id: 'd16',
    title: 'Breaking the Triple Bond in N₂ Gas',
    subtitle: 'N≡N(g) → 2N(g)',
    type: 'endothermic',
    category: 'diagram_concept',
    clue: 'Does breaking a strong chemical bond require an energy investment, or release it?',
    explanation: 'BREAKING bonds ALWAYS requires energy input (+945 kJ/mol for N≡N). It is strictly endothermic!',
    temperatureFeel: 'cooler'
  },
  {
    id: 'd17',
    title: 'Forming H-Cl Bonds from Atoms',
    subtitle: 'H(g) + Cl(g) → HCl(g)',
    type: 'exothermic',
    category: 'diagram_concept',
    clue: 'Two isolated high-energy atoms drop into a lower, stable bonded energy state.',
    explanation: 'FORMING bonds ALWAYS releases energy (-431 kJ/mol). Making is freeing!',
    temperatureFeel: 'warmer'
  },
  {
    id: 'd18',
    title: 'Sublimation of Dry Ice (Solid CO₂)',
    subtitle: 'CO₂(s) → CO₂(g) at room temperature',
    type: 'endothermic',
    category: 'phase_change',
    clue: 'Dry ice creates dramatic fog because it absorbs heat from surrounding air, chilling water vapor.',
    explanation: 'Transitioning directly from solid to gas requires thermal energy to break lattice interactions (ΔH_sub = +25.2 kJ/mol).',
    temperatureFeel: 'cooler'
  },
  {
    id: 'd19',
    title: 'Nuclear Fission / Fusion',
    subtitle: 'Mass defect converted into binding energy',
    type: 'exothermic',
    category: 'biology_physics',
    clue: 'Powers the Sun and nuclear power stations.',
    explanation: 'Mass loss transforms into enormous heat and radiation output (exothermic).',
    temperatureFeel: 'warmer'
  },
  {
    id: 'd20',
    title: 'Dissolving Sodium Hydroxide (NaOH)',
    subtitle: 'NaOH(s) pellets dropped into water',
    type: 'exothermic',
    category: 'everyday',
    clue: 'The beaker becomes too hot to safely touch without heat gloves!',
    explanation: 'Dissolving NaOH is strongly exothermic (ΔH = -44.5 kJ/mol); hydration of Na⁺ and OH⁻ ions releases substantial heat.',
    temperatureFeel: 'warmer'
  }
];

export const BOND_REACTION_SCENARIOS: BondReactionScenario[] = [
  {
    id: 'h2-cl2-hcl',
    title: 'Hydrogen + Chlorine → Hydrogen Chloride',
    equation: 'H₂(g) + Cl₂(g) → 2HCl(g)',
    reactantBonds: [
      { bond: 'H—H', count: 1, energy: 436 },
      { bond: 'Cl—Cl', count: 1, energy: 242 }
    ],
    productBonds: [
      { bond: 'H—Cl', count: 2, energy: 431 }
    ],
    description: 'A classic Grade 11 introductory bond enthalpy problem. Breaking 1 H-H and 1 Cl-Cl bond requires energy; making 2 H-Cl bonds releases energy.'
  },
  {
    id: 'ch4-combustion',
    title: 'Combustion of Methane',
    equation: 'CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(g)',
    reactantBonds: [
      { bond: 'C—H', count: 4, energy: 413 },
      { bond: 'O=O', count: 2, energy: 498 }
    ],
    productBonds: [
      { bond: 'C=O', count: 2, energy: 804 },
      { bond: 'O—H', count: 4, energy: 463 }
    ],
    description: 'The foundation of natural gas energy. Strong C=O double bonds in carbon dioxide release exceptional amounts of energy when formed!'
  },
  {
    id: 'habers-ammonia',
    title: 'Synthesis of Ammonia (Haber Process)',
    equation: 'N₂(g) + 3H₂(g) → 2NH₃(g)',
    reactantBonds: [
      { bond: 'N≡N', count: 1, energy: 945 },
      { bond: 'H—H', count: 3, energy: 436 }
    ],
    productBonds: [
      { bond: 'N—H', count: 6, energy: 391 }
    ],
    description: 'Notice the massive 945 kJ/mol needed to break the nitrogen triple bond! Yet forming six N-H bonds releases enough to make the overall process exothermic.'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: 'definition',
    question: 'In a chemistry lab, a student dissolves a salt in a beaker of water. The temperature of the water rises from 21.0°C to 34.5°C. What can be concluded?',
    options: [
      'The reaction is endothermic because water gained heat.',
      'The reaction is exothermic because the system released heat to the surroundings (water).',
      'The enthalpy change ΔH of the reaction is positive.',
      'Heat was absorbed from the thermometer into the system.'
    ],
    correctIndex: 1,
    explanation: 'The reaction mixture (solute/ions) is the SYSTEM. The water, beaker, and thermometer are the SURROUNDINGS. When the surroundings get warmer, the system has released heat: Exothermic (ΔH < 0).',
    formulaHint: 'System loses heat → Surroundings gain heat → Measured temperature increases.'
  },
  {
    id: 2,
    category: 'misconception',
    question: 'Which of the following statements about chemical bond energetics is ALWAYS scientifically true?',
    options: [
      'Breaking chemical bonds releases energy because energy is stored in the bond.',
      'Forming chemical bonds requires energy input to force atoms together.',
      'Breaking chemical bonds ALWAYS requires an input of energy (endothermic).',
      'Bond breaking and bond making both absorb energy.'
    ],
    correctIndex: 2,
    explanation: 'The #1 misconception in high school chemistry is that breaking bonds releases energy. In reality: Breaking bonds ALWAYS takes energy (input, endothermic); Forming bonds ALWAYS frees energy (output, exothermic). Remember "BENDO-MEXO"!',
    formulaHint: 'Remember: Breaking = Endo (+), Making = Exo (-)'
  },
  {
    id: 3,
    category: 'diagram',
    question: 'On a reaction coordinate energy profile, the energy of the products is higher than the energy of the reactants (H_products > H_reactants). What is this reaction?',
    options: [
      'Exothermic with a negative ΔH',
      'Endothermic with a positive ΔH',
      'Spontaneous without any activation energy',
      'At thermodynamic equilibrium with ΔH = 0'
    ],
    correctIndex: 1,
    explanation: 'ΔH = H_products - H_reactants. If H_products > H_reactants, then ΔH is positive (+), meaning the system absorbed net energy from the surroundings: Endothermic.',
    formulaHint: 'ΔH = H_products - H_reactants'
  },
  {
    id: 4,
    category: 'calculation',
    question: 'Calculate ΔH for the reaction: H₂ + Cl₂ → 2HCl, given Bond Energies: H-H = 436 kJ/mol, Cl-Cl = 242 kJ/mol, H-Cl = 431 kJ/mol.',
    options: [
      '+184 kJ/mol',
      '-184 kJ/mol',
      '-247 kJ/mol',
      '+247 kJ/mol'
    ],
    correctIndex: 1,
    explanation: 'ΔH = Σ(Bonds Broken) - Σ(Bonds Formed) = [(1 × 436) + (1 × 242)] - [2 × 431] = 678 - 862 = -184 kJ/mol. Since ΔH is negative, heat is released (exothermic).',
    formulaHint: 'ΔH = Σ(BE reactants broken) - Σ(BE products formed)'
  },
  {
    id: 5,
    category: 'calculation',
    question: 'Using q = m·c·ΔT, how much heat (q) is absorbed by 100.0 g of water (c = 4.184 J/g·°C) when its temperature increases from 20.0°C to 28.0°C?',
    options: [
      '3,347.2 J (3.35 kJ)',
      '836.8 J (0.84 kJ)',
      '11,715 J (11.72 kJ)',
      '418.4 J (0.42 kJ)'
    ],
    correctIndex: 0,
    explanation: 'q = m · c · ΔT = 100.0 g × 4.184 J/g·°C × (28.0 - 20.0°C) = 100.0 × 4.184 × 8.0 = 3347.2 J = 3.35 kJ.',
    formulaHint: 'q = m · c · (T_final - T_initial)'
  },
  {
    id: 6,
    category: 'diagram',
    question: 'When a chemical catalyst is added to a reaction, how does it affect the reaction coordinate diagram and ΔH?',
    options: [
      'It lowers the activation energy (E_a), but leaves the overall enthalpy change (ΔH) unchanged.',
      'It shifts ΔH from endothermic to exothermic.',
      'It raises the product energy level to accelerate the reaction.',
      'It increases both the activation energy and ΔH.'
    ],
    correctIndex: 0,
    explanation: 'A catalyst provides an alternative reaction pathway with a lower activation energy barrier (E_a). Because the energy of reactants and products does not change, ΔH remains exactly the same!',
    formulaHint: 'Catalyst lowers E_a peak only; ΔH is state function and unchanged.'
  },
  {
    id: 7,
    category: 'real_world',
    question: 'Why does liquid water evaporating from your skin produce a cooling sensation when you step out of a swimming pool?',
    options: [
      'Evaporation is exothermic, creating cool air molecules around the skin.',
      'Evaporation is endothermic, absorbing heat from your skin to break intermolecular hydrogen bonds.',
      'Liquid water chemically reacts with air oxygen in an exothermic neutralization.',
      'Water transfers coldness from the air onto the skin cells.'
    ],
    correctIndex: 1,
    explanation: 'Phase transitions from condensed to dispersed states (melting, vaporizing, subliming) require absorbing heat to overcome intermolecular forces. The skin is the surroundings that loses thermal energy, causing you to feel cold.',
    formulaHint: 'H₂O(l) + Heat → H₂O(g) [Endothermic phase change]'
  },
  {
    id: 8,
    category: 'real_world',
    question: 'Orange growers in Florida spray their citrus trees with water before a subzero freeze. How does thermochemistry protect the fruit?',
    options: [
      'Water acts as a chemical blanket with no phase change involved.',
      'As liquid water freezes into ice on the fruit, it undergoes an exothermic phase change, releasing latent heat of fusion into the fruit.',
      'Freezing absorbs cold from the oranges so the interior stays hot.',
      'The ice lowers the activation energy of the orange cells.'
    ],
    correctIndex: 1,
    explanation: 'Freezing is exothermic! H₂O(l) → H₂O(s) releases 334 J of heat per gram of water frozen (latent heat of fusion). This released heat keeps the fruit at or near 0°C, preventing the juice inside from freezing at lower temps.',
    formulaHint: 'Freezing = bond formation = Exothermic heat release!'
  },
  {
    id: 9,
    category: 'definition',
    question: 'Consider the thermochemical equation: 2CO(g) + O₂(g) → 2CO₂(g) + 566 kJ. If 1 mole of CO reacts completely, how much heat is transferred?',
    options: [
      '566 kJ is absorbed',
      '566 kJ is released',
      '283 kJ is released',
      '283 kJ is absorbed'
    ],
    correctIndex: 2,
    explanation: 'The equation shows 566 kJ is released when 2 moles of CO react. For 1 mole of CO, the heat released is 566 / 2 = 283 kJ. Since heat is on the product side, it is released (exothermic).',
    formulaHint: 'Stoichiometry of ΔH: divide by molar coefficient.'
  },
  {
    id: 10,
    category: 'misconception',
    question: 'A student says: "If a reaction feels cold when I touch the test tube, that means the reaction is releasing coldness." What is the scientifically accurate correction?',
    options: [
      'There is no such physical quantity as "coldness"; the reaction system absorbed thermal energy from your hand, decreasing your skin’s temperature.',
      'The test tube is exothermic because your fingers feel an energetic sensation.',
      'Coldness is a negative form of heat that travels into the hand through conduction.',
      'The system has higher temperature than the surroundings.'
    ],
    correctIndex: 0,
    explanation: 'Heat is the transfer of thermal energy from higher to lower temperature. "Cold" is simply the perception of lower thermal energy. In an endothermic process, thermal energy flows from your hand (surroundings) into the chemical system, leaving your hand cooler.',
    formulaHint: 'Heat flows from warm to cold. Systems absorb heat in endothermic reactions.'
  }
];

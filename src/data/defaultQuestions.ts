import { MCQQuestion } from '../types';

export const DEFAULT_QUESTIONS: MCQQuestion[] = [
  // ==================== SECTION 1: MATHEMATICS (Q1 - Q20) ====================
  {
    id: 1,
    subject: 'Math',
    questionText: 'Evaluate the value of: $\\frac{3}{4} + \\frac{5}{6} - \\frac{1}{2}$',
    options: ['$\\frac{13}{12}$', '$\\frac{11}{12}$', '$\\frac{7}{12}$', '$\\frac{5}{4}$'],
    correctOptionIndex: 0,
    explanation: 'LCM of 4, 6, and 2 is 12. $\\frac{9 + 10 - 6}{12} = \\frac{13}{12}$.'
  },
  {
    id: 2,
    subject: 'Math',
    questionText: 'Solve for $x$ in the equation: $3x + 15 = 45$',
    options: ['$x = 8$', '$x = 10$', '$x = 12$', '$x = 15$'],
    correctOptionIndex: 1,
    explanation: '$3x = 45 - 15 \\implies 3x = 30 \\implies x = 10$.'
  },
  {
    id: 3,
    subject: 'Math',
    questionText: 'What is the square root of $625$? (i.e. $\\sqrt{625}$)',
    options: ['15', '25', '35', '45'],
    correctOptionIndex: 1,
    explanation: '$25 \\times 25 = 625$, so $\\sqrt{625} = 25$.'
  },
  {
    id: 4,
    subject: 'Math',
    questionText: 'Find the perimeter of a rectangle with length $12\\text{ cm}$ and breadth $8\\text{ cm}$.',
    options: ['$20\\text{ cm}$', '$40\\text{ cm}$', '$96\\text{ cm}$', '$48\\text{ cm}$'],
    correctOptionIndex: 1,
    explanation: 'Perimeter $= 2(l + b) = 2(12 + 8) = 2(20) = 40\\text{ cm}$.'
  },
  {
    id: 5,
    subject: 'Math',
    questionText: 'If $20\\%$ of a number is $50$, what is the original number?',
    options: ['200', '250', '300', '150'],
    correctOptionIndex: 1,
    explanation: '$\\frac{20}{100} \\times N = 50 \\implies N = 50 \\times 5 = 250$.'
  },
  {
    id: 6,
    subject: 'Math',
    questionText: 'Find the area of a right-angled triangle with base $14\\text{ cm}$ and height $10\\text{ cm}$.',
    options: ['$140\\text{ cm}^2$', '$70\\text{ cm}^2$', '$35\\text{ cm}^2$', '$280\\text{ cm}^2$'],
    correctOptionIndex: 1,
    explanation: 'Area $= \\frac{1}{2} \\times \\text{base} \\times \\text{height} = \\frac{1}{2} \\times 14 \\times 10 = 70\\text{ cm}^2$.'
  },
  {
    id: 7,
    subject: 'Math',
    questionText: 'Simplify using exponent rules: $(2^3)^2 \\times 2^{-2}$',
    options: ['$2^4 = 16$', '$2^3 = 8$', '$2^6 = 64$', '$2^2 = 4$'],
    correctOptionIndex: 0,
    explanation: '$(2^3)^2 = 2^6$. Then $2^6 \\times 2^{-2} = 2^{6-2} = 2^4 = 16$.'
  },
  {
    id: 8,
    subject: 'Math',
    questionText: 'Find the mean of the first 5 prime numbers.',
    options: ['5.2', '5.6', '6.0', '4.8'],
    correctOptionIndex: 1,
    explanation: 'First 5 primes: 2, 3, 5, 7, 11. Sum $= 28$. Mean $= \\frac{28}{5} = 5.6$.'
  },
  {
    id: 9,
    subject: 'Math',
    questionText: 'If two complementary angles are in the ratio $2:3$, find the larger angle.',
    options: ['$36^\\circ$', '$54^\\circ$', '$72^\\circ$', '$108^\\circ$'],
    correctOptionIndex: 1,
    explanation: 'Complementary angles add to $90^\\circ$. $2x + 3x = 90 \\implies 5x = 90 \\implies x = 18$. Larger angle $= 3 \\times 18 = 54^\\circ$.'
  },
  {
    id: 10,
    subject: 'Math',
    questionText: 'Find the simple interest on ₹$5,000$ at $8\\%$ per annum for $3$ years.',
    options: ['₹ 1,200', '₹ 1,500', '₹ 1,000', '₹ 800'],
    correctOptionIndex: 0,
    explanation: '$SI = \\frac{P \\times R \\times T}{100} = \\frac{5000 \\times 8 \\times 3}{100} = 1200$.'
  },
  {
    id: 11,
    subject: 'Math',
    questionText: 'What is the sum of interior angles of a convex hexagon?',
    options: ['$540^\\circ$', '$720^\\circ$', '$900^\\circ$', '$360^\\circ$'],
    correctOptionIndex: 1,
    explanation: 'Sum $= (n - 2) \\times 180^\\circ = (6 - 2) \\times 180^\\circ = 4 \\times 180^\\circ = 720^\\circ$.'
  },
  {
    id: 12,
    subject: 'Math',
    questionText: 'Solve the algebraic expansion: $(a + b)^2 - (a - b)^2$',
    options: ['$2a^2 + 2b^2$', '$4ab$', '$2ab$', '$a^2 - b^2$'],
    correctOptionIndex: 1,
    explanation: '$(a^2 + 2ab + b^2) - (a^2 - 2ab + b^2) = 4ab$.'
  },
  {
    id: 13,
    subject: 'Math',
    questionText: 'A car covers $180\\text{ km}$ in $3\\text{ hours}$. What is its speed in $\\text{m/s}$?',
    options: ['$60\\text{ m/s}$', '$16.67\\text{ m/s}$', '$25\\text{ m/s}$', '$50\\text{ m/s}$'],
    correctOptionIndex: 1,
    explanation: 'Speed in km/h $= \\frac{180}{3} = 60\\text{ km/h}$. In m/s $= 60 \\times \\frac{5}{18} = \\frac{50}{3} \\approx 16.67\\text{ m/s}$.'
  },
  {
    id: 14,
    subject: 'Math',
    questionText: 'A die is thrown once. What is the probability of getting a prime number?',
    options: ['$\\frac{1}{6}$', '$\\frac{1}{2}$', '$\\frac{1}{3}$', '$\\frac{2}{3}$'],
    correctOptionIndex: 1,
    explanation: 'Outcomes $= \\{1, 2, 3, 4, 5, 6\\}$. Prime outcomes $= \\{2, 3, 5\\}$ (3 favorable). $P = \\frac{3}{6} = \\frac{1}{2}$.'
  },
  {
    id: 15,
    subject: 'Math',
    questionText: 'Find the volume of a cylinder with radius $7\\text{ cm}$ and height $10\\text{ cm}$. (Use $\\pi = \\frac{22}{7}$)',
    options: ['$1,540\\text{ cm}^3$', '$1,440\\text{ cm}^3$', '$1,620\\text{ cm}^3$', '$770\\text{ cm}^3$'],
    correctOptionIndex: 0,
    explanation: 'Volume $= \\pi r^2 h = \\frac{22}{7} \\times 7 \\times 7 \\times 10 = 1540\\text{ cm}^3$.'
  },
  {
    id: 16,
    subject: 'Math',
    questionText: 'Find the HCF of $36$, $54$, and $90$.',
    options: ['6', '9', '18', '27'],
    correctOptionIndex: 2,
    explanation: '$36 = 18 \\times 2$, $54 = 18 \\times 3$, $90 = 18 \\times 5$. Highest Common Factor is 18.'
  },
  {
    id: 17,
    subject: 'Math',
    questionText: 'If $x + \\frac{1}{x} = 5$, find the value of $x^2 + \\frac{1}{x^2}$.',
    options: ['23', '25', '27', '21'],
    correctOptionIndex: 0,
    explanation: 'Squaring both sides: $(x + \\frac{1}{x})^2 = 25 \\implies x^2 + 2 + \\frac{1}{x^2} = 25 \\implies x^2 + \\frac{1}{x^2} = 23$.'
  },
  {
    id: 18,
    subject: 'Math',
    questionText: 'The ratio of ages of A and B is $4:5$. If sum of their ages is $36$ years, find A\'s age.',
    options: ['16 years', '20 years', '18 years', '12 years'],
    correctOptionIndex: 0,
    explanation: '$4x + 5x = 36 \\implies 9x = 36 \\implies x = 4$. A\'s age $= 4 \\times 4 = 16$ years.'
  },
  {
    id: 19,
    subject: 'Math',
    questionText: 'Find the Pythagorean triplet whose smallest member is $6$.',
    options: ['(6, 8, 10)', '(6, 9, 12)', '(6, 10, 14)', '(6, 7, 8)'],
    correctOptionIndex: 0,
    explanation: '$6^2 + 8^2 = 36 + 64 = 100 = 10^2$. Thus, (6, 8, 10) is a Pythagorean triplet.'
  },
  {
    id: 20,
    subject: 'Math',
    questionText: 'Find the value of $k$ if $x = 2$ is a solution of $2x^2 + kx - 6 = 0$.',
    options: ['-1', '1', '-2', '2'],
    correctOptionIndex: 0,
    explanation: 'Substitute $x=2$: $2(2)^2 + k(2) - 6 = 0 \\implies 8 + 2k - 6 = 0 \\implies 2k = -2 \\implies k = -1$.'
  },

  // ==================== SECTION 2: SCIENCE (Q21 - Q40) ====================
  {
    id: 21,
    subject: 'Science',
    questionText: 'Which organelle is known as the "Powerhouse of the Cell"?',
    options: ['Ribosome', 'Mitochondria', 'Golgi apparatus', 'Lysosome'],
    correctOptionIndex: 1,
    explanation: 'Mitochondria produce ATP through cellular respiration, earning the name Powerhouse of the Cell.'
  },
  {
    id: 22,
    subject: 'Science',
    questionText: 'What is the chemical formula for Rusting of Iron?',
    options: ['Fe2O3 · xH2O', 'FeSO4', 'FeCl3', 'FeO'],
    correctOptionIndex: 0,
    explanation: 'Rust is hydrated iron(III) oxide with chemical formula Fe2O3 · xH2O.'
  },
  {
    id: 23,
    subject: 'Science',
    questionText: 'Which law states that "To every action, there is an equal and opposite reaction"?',
    options: ['Newton\'s First Law', 'Newton\'s Second Law', 'Newton\'s Third Law', 'Law of Gravitation'],
    correctOptionIndex: 2,
    explanation: 'Newton\'s Third Law of Motion states that for every action, there is an equal and opposite reaction.'
  },
  {
    id: 24,
    subject: 'Science',
    questionText: 'What type of mirror is used as a rear-view mirror in vehicles?',
    options: ['Concave Mirror', 'Convex Mirror', 'Plane Mirror', 'Cylindrical Mirror'],
    correctOptionIndex: 1,
    explanation: 'Convex mirrors provide an erect, diminished image with a wider field of view for rear observation.'
  },
  {
    id: 25,
    subject: 'Science',
    questionText: 'Which gas is evolved when zinc metal reacts with dilute hydrochloric acid?',
    options: ['Oxygen (O2)', 'Carbon Dioxide (CO2)', 'Hydrogen (H2)', 'Nitrogen (N2)'],
    correctOptionIndex: 2,
    explanation: 'Zn + 2HCl → ZnCl2 + H2 ↑. Hydrogen gas burns with a pop sound.'
  },
  {
    id: 26,
    subject: 'Science',
    questionText: 'Which hormone regulates glucose levels in human blood?',
    options: ['Thyroxine', 'Insulin', 'Adrenaline', 'Growth Hormone'],
    correctOptionIndex: 1,
    explanation: 'Insulin secreted by pancreatic beta cells lowers blood glucose levels.'
  },
  {
    id: 27,
    subject: 'Science',
    questionText: 'What is the SI unit of Electric Current?',
    options: ['Volt (V)', 'Watt (W)', 'Ampere (A)', 'Ohm (Ω)'],
    correctOptionIndex: 2,
    explanation: 'Electric current is measured in Amperes (A).'
  },
  {
    id: 28,
    subject: 'Science',
    questionText: 'Which layer of the atmosphere protects Earth from harmful ultraviolet (UV) radiation?',
    options: ['Troposphere', 'Ozone Layer (Stratosphere)', 'Mesosphere', 'Exosphere'],
    correctOptionIndex: 1,
    explanation: 'The Ozone layer (O3) in the stratosphere absorbs harmful solar UV rays.'
  },
  {
    id: 29,
    subject: 'Science',
    questionText: 'What is the pH value of pure distilled water at 25°C?',
    options: ['0', '7 (Neutral)', '14', '5.5'],
    correctOptionIndex: 1,
    explanation: 'Distilled pure water has a neutral pH of 7.0.'
  },
  {
    id: 30,
    subject: 'Science',
    questionText: 'In plant cells, photosynthesis primarily occurs in which organelle?',
    options: ['Chloroplast', 'Chromoplast', 'Leucoplast', 'Vacuole'],
    correctOptionIndex: 0,
    explanation: 'Chloroplasts contain chlorophyll pigments that trap light energy for photosynthesis.'
  },
  {
    id: 31,
    subject: 'Science',
    questionText: 'Sound waves cannot travel through which of the following media?',
    options: ['Water', 'Steel', 'Air', 'Vacuum'],
    correctOptionIndex: 3,
    explanation: 'Sound is a mechanical wave requiring a material medium to propagate; it cannot travel in a vacuum.'
  },
  {
    id: 32,
    subject: 'Science',
    questionText: 'Which non-metal is a good conductor of electricity?',
    options: ['Diamond', 'Graphite', 'Sulfur', 'Phosphorus'],
    correctOptionIndex: 1,
    explanation: 'Graphite (an allotrope of carbon) has free delocalized electrons allowing electrical conductivity.'
  },
  {
    id: 33,
    subject: 'Science',
    questionText: 'What is the normal blood pressure of a healthy adult human?',
    options: ['80/120 mm Hg', '120/80 mm Hg', '140/90 mm Hg', '100/60 mm Hg'],
    correctOptionIndex: 1,
    explanation: 'Normal blood pressure is 120/80 mm Hg (Systolic/Diastolic).'
  },
  {
    id: 34,
    subject: 'Science',
    questionText: 'Which disease is caused by the deficiency of Vitamin C?',
    options: ['Rickets', 'Beriberi', 'Scurvy', 'Night Blindness'],
    correctOptionIndex: 2,
    explanation: 'Vitamin C (Ascorbic acid) deficiency causes Scurvy, characterized by bleeding gums.'
  },
  {
    id: 35,
    subject: 'Science',
    questionText: 'Calculate the frequency of a wave with speed $340\\text{ m/s}$ and wavelength $2\\text{ m}$.',
    options: ['$170\\text{ Hz}$', '$680\\text{ Hz}$', '$342\\text{ Hz}$', '$85\\text{ Hz}$'],
    correctOptionIndex: 0,
    explanation: '$v = f \\cdot \\lambda \\implies f = \\frac{v}{\\lambda} = \\frac{340}{2} = 170\\text{ Hz}$.'
  },
  {
    id: 36,
    subject: 'Science',
    questionText: 'Which gland is known as the "Master Gland" of the human endocrine system?',
    options: ['Thyroid Gland', 'Pituitary Gland', 'Adrenal Gland', 'Pancreas'],
    correctOptionIndex: 1,
    explanation: 'The Pituitary gland controls the functioning of most other endocrine glands.'
  },
  {
    id: 37,
    subject: 'Science',
    questionText: 'Which gas is responsible for Global Warming as a major Greenhouse Gas?',
    options: ['Nitrogen', 'Argon', 'Carbon Dioxide (CO2)', 'Helium'],
    correctOptionIndex: 2,
    explanation: 'CO2 traps infrared radiation re-radiated by Earth, causing global warming.'
  },
  {
    id: 38,
    subject: 'Science',
    questionText: 'Which acid is naturally present in stomach juice to aid food digestion?',
    options: ['Sufuric Acid (H2SO4)', 'Hydrochloric Acid (HCl)', 'Nitric Acid (HNO3)', 'Acetic Acid'],
    correctOptionIndex: 1,
    explanation: 'Stomach gastric glands secrete Hydrochloric Acid (HCl) to activate pepsinogen.'
  },
  {
    id: 39,
    subject: 'Science',
    questionText: 'What is the chemical name of Baking Soda?',
    options: ['Sodium Carbonate', 'Sodium Bicarbonate (NaHCO3)', 'Calcium Carbonate', 'Sodium Hydroxide'],
    correctOptionIndex: 1,
    explanation: 'Baking soda is Sodium Hydrogen Carbonate / Sodium Bicarbonate (NaHCO3).'
  },
  {
    id: 40,
    subject: 'Science',
    questionText: 'An object is placed at $2F$ in front of a convex lens. Where is the image formed?',
    options: ['At infinity', 'At $F$', 'At $2F$ on the other side', 'Between $F$ and $2F$'],
    correctOptionIndex: 2,
    explanation: 'When an object is at $2F_1$, a real, inverted, same-sized image is formed at $2F_2$.'
  },

  // ==================== SECTION 3: ENGLISH (Q41 - Q60) ====================
  {
    id: 41,
    subject: 'English',
    questionText: 'Choose the correct synonym for the word "METICULOUS":',
    options: ['Careless', 'Thorough & Careful', 'Hasty', 'Lazy'],
    correctOptionIndex: 1,
    explanation: '"Meticulous" means showing great attention to detail; extremely careful and thorough.'
  },
  {
    id: 42,
    subject: 'English',
    questionText: 'Choose the correct antonym for the word "ABUNDANT":',
    options: ['Plentiful', 'Scarce', 'Generous', 'Ample'],
    correctOptionIndex: 1,
    explanation: '"Abundant" means existing in large quantities. Its opposite is "Scarce".'
  },
  {
    id: 43,
    subject: 'English',
    questionText: 'Identify the correct passive voice: "The students solved the difficult math problem."',
    options: [
      'The difficult math problem is solved by the students.',
      'The difficult math problem was solved by the students.',
      'The difficult math problem had been solved by the students.',
      'The students were solving the difficult math problem.'
    ],
    correctOptionIndex: 1,
    explanation: 'Simple past "solved" becomes "was solved" in passive voice.'
  },
  {
    id: 44,
    subject: 'English',
    questionText: 'Fill in the blank with the correct preposition: "She has been studying in JNV Junagadh _____ 2021."',
    options: ['for', 'since', 'from', 'by'],
    correctOptionIndex: 1,
    explanation: 'We use "since" with a specific point in time (2021) in perfect tenses.'
  },
  {
    id: 45,
    subject: 'English',
    questionText: 'Identify the error in the sentence: "Neither the teacher nor the students was present in the hall."',
    options: ['Neither', 'nor the students', 'was present', 'in the hall'],
    correctOptionIndex: 2,
    explanation: 'With "neither...nor", the verb agrees with the closer subject ("students" - plural), so it should be "were present".'
  },
  {
    id: 46,
    subject: 'English',
    questionText: 'Select the correctly spelled word:',
    options: ['Accommodate', 'Acommodate', 'Accomodate', 'Acomodate'],
    correctOptionIndex: 0,
    explanation: '"Accommodate" has double \'c\' and double \'m\'.'
  },
  {
    id: 47,
    subject: 'English',
    questionText: 'Choose the correct meaning of the idiom: "To burn the midnight oil"',
    options: ['To waste electricity', 'To work or study late into the night', 'To cause an accidental fire', 'To wake up early in the morning'],
    correctOptionIndex: 1,
    explanation: '"To burn the midnight oil" means to study or work hard late into the night.'
  },
  {
    id: 48,
    subject: 'English',
    questionText: 'Choose the appropriate conjunction: "He worked very hard, _____ he failed to secure first rank."',
    options: ['so', 'because', 'yet', 'unless'],
    correctOptionIndex: 2,
    explanation: '"Yet" expresses contrast between hard work and failure.'
  },
  {
    id: 49,
    subject: 'English',
    questionText: 'Convert into indirect speech: The teacher said, "Water boils at 100°C."',
    options: [
      'The teacher said that water boiled at 100°C.',
      'The teacher said that water boils at 100°C.',
      'The teacher told that water will boil at 100°C.',
      'The teacher says water is boiling at 100°C.'
    ],
    correctOptionIndex: 1,
    explanation: 'Universal scientific facts do not change tense in reported speech.'
  },
  {
    id: 50,
    subject: 'English',
    questionText: 'Which figure of speech is used in: "The stars danced playfully in the moonlit sky"?',
    options: ['Metaphor', 'Simile', 'Personification', 'Hyperbole'],
    correctOptionIndex: 2,
    explanation: 'Attributing human traits (dancing playfully) to non-human things (stars) is Personification.'
  },
  {
    id: 51,
    subject: 'English',
    questionText: 'Fill in the blank with appropriate article: "Copper is _____ useful metal."',
    options: ['a', 'an', 'the', 'no article'],
    correctOptionIndex: 0,
    explanation: '"Useful" starts with a consonant sound /juː/, so we use "a" instead of "an".'
  },
  {
    id: 52,
    subject: 'English',
    questionText: 'What is the one-word substitution for "A person who loves books"?',
    options: ['Bibliophile', 'Philanthropist', 'Polyglot', 'Optimist'],
    correctOptionIndex: 0,
    explanation: 'A "Bibliophile" is an avid reader or lover of books.'
  },
  {
    id: 53,
    subject: 'English',
    questionText: 'Choose the word that best completes the sentence: "The principal praised the student for his _____ conduct."',
    options: ['exemplary', 'notorious', 'hostile', 'negligent'],
    correctOptionIndex: 0,
    explanation: '"Exemplary" means commendable, worthy of imitation.'
  },
  {
    id: 54,
    subject: 'English',
    questionText: 'Find the plural form of the word "PHENOMENON":',
    options: ['Phenomenons', 'Phenomena', 'Phenomenas', 'Phenomenes'],
    correctOptionIndex: 1,
    explanation: 'The Greek-origin word "phenomenon" has the plural form "phenomena".'
  },
  {
    id: 55,
    subject: 'English',
    questionText: 'Identify the sentence in Present Perfect Continuous Tense:',
    options: [
      'She had been reading for two hours.',
      'She has been reading for two hours.',
      'She is reading for two hours.',
      'She will have been reading for two hours.'
    ],
    correctOptionIndex: 1,
    explanation: '"has/have + been + verb-ing" is the structure of Present Perfect Continuous Tense.'
  },
  {
    id: 56,
    subject: 'English',
    questionText: 'Choose the correct word: "The climate of Junagadh is preferable _____ that of Ahmedabad."',
    options: ['than', 'to', 'from', 'with'],
    correctOptionIndex: 1,
    explanation: 'Adjectives ending in "-ior" or words like "preferable" take "to", not "than".'
  },
  {
    id: 57,
    subject: 'English',
    questionText: 'What is the feminine gender of "COLT"?',
    options: ['Mare', 'Filly', 'Ewe', 'Vixen'],
    correctOptionIndex: 1,
    explanation: 'A young male horse is a "colt"; a young female horse is a "filly".'
  },
  {
    id: 58,
    subject: 'English',
    questionText: 'Fill in the blank: "Each of the boys _____ given a medal."',
    options: ['were', 'was', 'are', 'have'],
    correctOptionIndex: 1,
    explanation: '"Each" is a singular indefinite pronoun and takes a singular verb "was".'
  },
  {
    id: 59,
    subject: 'English',
    questionText: 'Select the option that means "To make matters worse":',
    options: ['Add fuel to the fire', 'Break the ice', 'Hit the nail on the head', 'Bite the bullet'],
    correctOptionIndex: 0,
    explanation: '"Add fuel to the fire" means to aggravate or worsen an already bad situation.'
  },
  {
    id: 60,
    subject: 'English',
    questionText: 'Choose the sentence with correct punctuation:',
    options: [
      'Hurrah! We won the JNV Best Day championship.',
      'Hurrah, we won the JNV Best Day championship?',
      'Hurrah we won the JNV Best Day championship.',
      'Hurrah; we won the JNV Best Day championship!'
    ],
    correctOptionIndex: 0,
    explanation: 'Interjections like "Hurrah!" are followed by an exclamation mark, and the sentence ends with a period.'
  }
];

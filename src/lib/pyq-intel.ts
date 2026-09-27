// ─────────────────────────────────────────────────────────────────────────────
// PYQ Pattern Intelligence — derived from an audit of the real GATE DA papers
// (2024 IISc, 2024 Sample, 2025 IIT Roorkee, 2026 IIT Guwahati) and the
// official UGC NET Paper-1 / Paper-2 (CS) structures.
// ─────────────────────────────────────────────────────────────────────────────

export interface GateSegment {
  label: string
  questions: string
  marks: number
  tone: string // tailwind bg token
}

export const GATE_ANATOMY: GateSegment[] = [
  { label: 'General Aptitude', questions: 'Q1–10', marks: 15, tone: 'bg-stone-400' },
  { label: 'Technical · 1 mark', questions: 'Q11–35', marks: 25, tone: 'bg-teal-500' },
  { label: 'Technical · 2 marks', questions: 'Q36–65', marks: 60, tone: 'bg-amber-500' },
]

export const GATE_META = {
  duration: '180 min',
  total: 100,
  types: 'MCQ · MSQ · NAT — NAT & MSQ carry NO negative marking (attempt all); MCQ: −0.33 / −0.66',
  papers: '2024 · 2024-Sample (IISc) · 2025 (IIT Roorkee) · 2026 (IIT Guwahati)',
}

export interface SectionWeight {
  id: string
  name: string
  questions: string
  share: number // % of the 85 technical marks
  color: string // tailwind token
  note: string
}

export const GATE_SECTION_WEIGHTS: SectionWeight[] = [
  { id: 'ps', name: 'Probability & Statistics', questions: '13–15 Q', share: 28, color: 'bg-red-500', note: 'Heaviest every year — Bayes, memoryless, CLT, χ², test selection' },
  { id: 'ml', name: 'Machine Learning', questions: '8–10 Q', share: 16, color: 'bg-purple-500', note: 'Computes: ridge loss, SGD step, LOOCV, MLP params, PCA, clustering' },
  { id: 'dbms', name: 'DBMS & Warehousing', questions: '8–9 Q', share: 14, color: 'bg-emerald-500', note: 'Candidate keys, SQL nesting, B+ trees, OLAP cuboids/CUBE' },
  { id: 'dsa', name: 'DSA & Algorithms', questions: '7–8 Q', share: 12, color: 'bg-teal-500', note: 'Sort comparison counts, binary-search bounds, DFS/BFS traces, stacks' },
  { id: 'la', name: 'Linear Algebra', questions: '7–8 Q', share: 12, color: 'bg-amber-500', note: 'Projection family, In+xxᵀ, SVD, eigen periodicity, definiteness' },
  { id: 'ai', name: 'Artificial Intelligence', questions: '5–6 Q', share: 9, color: 'bg-cyan-500', note: 'A* traces, admissibility, minimax/α-β, FOL models, Bayes-net inference' },
  { id: 'py', name: 'Python / PDSA', questions: '4–5 Q', share: 7, color: 'bg-lime-500', note: 'Closures, mutable defaults, call-counting, set/list semantics' },
  { id: 'calc', name: 'Calculus & Optimization', questions: '3–4 Q', share: 6, color: 'bg-yellow-500', note: 'Limits, extrema on intervals, piecewise differentiability, Taylor' },
]

export interface Archetype {
  section: string
  items: string[]
}

export const GATE_ARCHETYPES: Archetype[] = [
  {
    section: 'Probability & Statistics',
    items: [
      'Memoryless property: P(X>s+t | X>s) = P(X>t) — 2024 Q57, 2025 Q21, 2026 Q34',
      'CLT approximation of a binomial → Φ(z) — 2025 Q40; χ² identities — 2026 Q53',
      'Variance of transformations Var((2X−1)Y) — 2026 Q44; sample-mean updates — 2024 Q34',
      'Bayes disease-test numerical — 2026 Q57; multi-box partition — 2025 Q31',
    ],
  },
  {
    section: 'Machine Learning',
    items: [
      'Ridge: L2, bias↑ variance↓ — 2026 Q37; total regularized MAE loss — 2026 Q55',
      'LOOCV split count — 2026 Q12; parameter counting in MLPs — 2026 Q56, 2024-Sample Q43',
      'SVM hard margin: support vectors, 2/‖w‖ — 2025 Q53; PCA variance projection — 2025 Q60',
      'Clustering: one k-means iteration — 2024-Sample Q42; first merge in linkage — 2026 Q36',
    ],
  },
  {
    section: 'DBMS & Warehousing',
    items: [
      'Candidate keys from FD sets — 2026 Q17, 2025 Q57; superkey count — 2024-Sample Q41',
      'SQL nested/correlated row counts — 2026 Q60, 2025 Q33; NOT EXISTS all-pattern — Sample Q55',
      'B+ tree order/height/insertion — 2026 Q32 & Q41, Sample Q40; linear probing — 2025 Q18',
      'OLAP: CUBE row count — 2025 Q46; cuboids from hierarchies — 2026 Q43; drill-down — 2026 Q18',
    ],
  },
  {
    section: 'Linear Algebra',
    items: [
      'M = In − (1/n)11ᵀ: symmetric, idempotent, trace n−1 — 2026 Q52, Sample Q49',
      'Rayleigh quotient max = λmax — 2026 Q65, Sample Q65; rotation M^2026 — 2026 Q21',
      '|Ax|=|x| ⇒ eigenvalues ±1 — 2025 Q52; Gram matrix PD — 2025 Q38',
      'Consistency via rank: Bx=0 solution counts — 2025 Q13, 2024 Q48',
    ],
  },
  {
    section: 'DSA & Algorithms',
    items: [
      'Bubble vs insertion comparison counts — 2026 Q49; swaps = inversions — 2025 Q29',
      'Binary search max comparisons — 2026 Q31; recurrence F(n)=F(⌊n/2⌋)+1 — 2024 Q40',
      'Tree rebuild from pre+in — 2026 Q25; full-binary pre+post — 2024 Q28',
      'DFS discovery with ordered adjacency — 2025 Q65; topological orders — 2024 Q51',
    ],
  },
  {
    section: 'Artificial Intelligence',
    items: [
      'A* expansion sequence with priority queue — 2025 Q44; IDDFS/IDA* — Sample Q1',
      'Admissible heuristics: max(h1,h2) — 2024 Q23; obstacle bounds — Sample Q46',
      'Alpha-beta pruning ranges — 2025 Q43; minimax best strategy — 2026 Q30',
      'Bayes-net joint from CPTs — 2024 Q64; likelihood weighting — Sample Q32',
    ],
  },
  {
    section: 'Python / Calculus',
    items: [
      'Mutable default arg — 2026 Q16; closures share state — 2026 Q50; extend vs append — 2025 Q23',
      'Recursion call counting — 2026 Q39; set-op loop — 2025 Q47',
      'ln((x²+1)cosx)/x² limit — 2024 Q60; √(t²+t)−t — 2025 Q32',
      'Piecewise continuity+differentiability — 2024 Q37; cubic extrema — 2025 Q49',
    ],
  },
]

export const NET_META = {
  p2: 'Paper 2 (CS): 100 Q × 2 marks = 200 · ~10 questions per unit, all 10 units compulsory',
  p1: 'Paper 1 (General): 50 Q × 2 marks = 100 · 10 units × 5 questions',
  papers: 'Previous papers: ugcnetonline.in → Previous Question Papers',
  units: [
    'U1 Discrete Structures & Optimization',
    'U2 Computer System Architecture',
    'U3 Programming Languages & Graphics',
    'U4 DBMS (incl. DW/Mining/BigData/NoSQL)',
    'U5 System Software & OS',
    'U6 Software Engineering',
    'U7 Data Structures & Algorithms',
    'U8 TOC & Compilers',
    'U9 Data Communication & Networks',
    'U10 Artificial Intelligence',
  ],
  p1Units: [
    'Teaching Aptitude', 'Research Aptitude', 'Comprehension', 'Communication',
    'Math Reasoning', 'Logical Reasoning (incl. Indian Logic)', 'Data Interpretation',
    'ICT', 'People, Development & Environment', 'Higher Education System',
  ],
  p1Hotspots: [
    'Indian Logic / Pramanas returns in Logical Reasoning every cycle',
    'Environment: EP Act 1986, NAPCC, Montreal/Kyoto/Paris, ISA — one question most years',
    'DI is formula-light but trap-heavy: read units and totals first',
  ],
}

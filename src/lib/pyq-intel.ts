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

// ── UGC NET — calibrated from the real Dec 2025 cycle (exam: 2 Jan 2026,
//    shift 1) unit-wise analysis, June 2025 shift feedback, and the official
//    paper archive (ugcnetonline.in, Subject 87 — Computer Science & Applic.)

export const NET_META = {
  p2: 'Paper 2 (CS, code 87): 100 Q × 2 = 200 marks · all 10 units compulsory · +2 per correct, NO negative marking',
  p1: 'Paper 1 (General): 50 Q × 2 = 100 marks · 10 units × ~5 questions · no negative marking',
  mode: 'CBT · both papers in ONE 3-hour session (180 min, no breaks) · shifts 9 AM–12 PM / 3–6 PM',
  attempts: 'Good attempts (Dec 2025 real): Paper 1 → 40–45 of 50 · Paper 2 → 55–65 of 100 · zero-blank doctrine is mathematically optimal (no negative marking)',
  difficulty: 'Dec 2025: Paper 1 easy–moderate · Paper 2 moderate–difficult, a few lengthy multi-concept questions',
  papers: 'Dec 2025 cycle (exam 2 Jan 2026) + June 2025 shifts + official archive: ugcnetonline.in → Previous Question Papers (Subject 87)',
  window: 'Scheduling watch: the “Dec 2025” cycle actually ran 31 Dec 2025 – 7 Jan 2026 (CS on 2 Jan). The Dec 2026 NET can plausibly land mid-Dec 2026 to early Jan 2027 — the plan anchors 13 Dec 2026 and the taper can stretch if NTA announces a later date.',
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
}

export interface NetUnitWeight {
  id: string
  unit: string
  tier: 'High' | 'Medium' | 'Low'
  questions: string // Dec 2025 observed range (units grouped by shifts)
  difficulty: string
  color: string
  note: string
}

// Dec 2025 real exam unit distribution + NTA weightage commentary
export const NET_UNIT_WEIGHTS: NetUnitWeight[] = [
  { id: 'u7', unit: 'U7 DSA & Algorithms', tier: 'High', questions: '6–7 Q', difficulty: 'Easy–Mod', color: 'bg-teal-500', note: 'Sorting (Quick/Merge), searching, graphs, trees, DP, greedy — core problem-solving theme' },
  { id: 'u4', unit: 'U4 DBMS', tier: 'High', questions: '6–7 Q', difficulty: 'Moderate', color: 'bg-emerald-500', note: 'SQL queries, normalisation, transactions/serializability, indexing — repeated & scoring' },
  { id: 'u5', unit: 'U5 OS & System SW', tier: 'High', questions: '5–6 Q', difficulty: 'Easy–Mod', color: 'bg-green-500', note: 'CPU/disk scheduling, deadlocks, memory mgmt, processes & threads — heavy recently' },
  { id: 'u9', unit: 'U9 Networks', tier: 'High', questions: '~8–10 Q', difficulty: 'Moderate', color: 'bg-fuchsia-500', note: 'OSI/TCP-IP, routing, congestion control, IP addressing, security — consistent' },
  { id: 'u1', unit: 'U1 Discrete & Opt.', tier: 'Medium', questions: '6–7 Q', difficulty: 'Moderate', color: 'bg-lime-500', note: 'Recurrence relations, logic formula matching, sets/combinatorics/graph theory' },
  { id: 'u2', unit: 'U2 Comp. Architecture', tier: 'Medium', questions: '7–8 Q', difficulty: 'Moderate', color: 'bg-orange-500', note: 'Digital logic (Grey code seen!), pipelining, memory hierarchy, I/O' },
  { id: 'u3', unit: 'U3 Prog. Lang & Graphics', tier: 'Medium', questions: '7–8 Q', difficulty: 'Easy–Mod', color: 'bg-pink-500', note: 'Projections, programming paradigms, AI-agent basics — easy marks, don\u2019t skip' },
  { id: 'u8', unit: 'U8 TOC & Compilers', tier: 'Medium', questions: '4–5 Q', difficulty: 'Moderate', color: 'bg-violet-500', note: 'DFA↔NFA conversion, grammars, bottom-up parsing, Turing machines, decidability' },
  { id: 'u6', unit: 'U6 Software Engg', tier: 'Low', questions: '5–6 Q', difficulty: 'Moderate', color: 'bg-rose-500', note: 'SDLC models, COCOMO, testing strategies/chronology, quality metrics — direct questions' },
  { id: 'u10', unit: 'U10 AI (NET scope)', tier: 'Low', questions: '~8–10 Q', difficulty: 'Easy–Mod', color: 'bg-cyan-500', note: 'Search, KR, neural-net fundamentals — limited but scoring when asked' },
]

// Question archetypes actually observed in Dec 2025 / June 2025 NET shifts
export const NET_ARCHETYPES: Archetype[] = [
  {
    section: 'U4 DBMS (Dec 2025)',
    items: [
      'Candidate-key identification from FDs + normal-form classification',
      'Serializability: conflict-equivalent schedule ordering',
      'SQL: nested queries on aggregate/GROUP BY results',
    ],
  },
  {
    section: 'U2 COA (Dec 2025)',
    items: [
      'Pipelining: stage-hazard throughput/speedup computations',
      'Grey-code ↔ binary conversion (asked verbatim Dec 2025)',
    ],
  },
  {
    section: 'U5 OS (Dec 2025)',
    items: [
      'Disk scheduling (SCAN/C-SCAN/SSTF): total head movement',
      'CPU scheduling: avg waiting/turnaround for FCFS/SJF/RR',
      'Security-technique matching (network security pairing)',
    ],
  },
  {
    section: 'U8 TOC & Compilers (Dec 2025)',
    items: [
      'DFA → NFA conversion & language acceptance',
      'Bottom-up parsing: handle reduction sequence',
    ],
  },
  {
    section: 'U6 SE / U3 PL&G (Dec 2025)',
    items: [
      'COCOMO effort/EAF computation (organic vs embedded)',
      'Testing-phase chronology (V&V ordering)',
      '3D projections + programming-paradigm matching',
    ],
  },
  {
    section: 'U7 DSA (Dec 2025)',
    items: [
      'Greedy-method applicability + trace (fractional knapsack family)',
      'Recurrence solving by substitution/master method',
    ],
  },
  {
    section: 'Paper 1 (June 2025 shifts, real)',
    items: [
      'Indian Logic: Pramana matching, hetvābhāsa fallacies, square of opposition, syllogism — 2+ Q per shift',
      'ICT: malware/phishing, cybercrime types, RAM/ROM, MODEM/router/DNS, MOOC/SWAYAM, http/html full-forms — 4–5 Q',
      'Environment: SDG goals (7,6,3,5…), pollutants, water treatment, Richter scale, noise pollution — 3–4 Q',
      'Higher-Ed: NEP provisions, UGC/AICTE/ICSSR chronology, institutes — 3 Q',
      'Research: sampling, pure vs exploratory, plagiarism, Bloom\u2019s taxonomy, AI-in-research — ~5 Q',
      'Communication: Shannon model, PACE, types of communication',
      'DI: percentage/ratio based — easy but lengthy; read units first',
    ],
  },
]

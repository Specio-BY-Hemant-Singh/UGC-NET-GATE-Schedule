// ─────────────────────────────────────────────────────────────────────────────
// Weeks 12–19 · Phase 3 (GATE Foundation) + Phase 4 (GATE Mock Sprint & Exam)
// NET is done — full 4.75–5 h budget goes to GATE 2027 DA
// CALIBRATED against the official GATE DA syllabus and the 2024/2025/2026 PYQ
// papers: P&S ≈ 28% · ML ≈ 16% · DBMS+DW ≈ 14% · DSA ≈ 12% · LA ≈ 12% ·
// AI ≈ 9% · Python/PDSA ≈ 7% · Calc ≈ 6% · GA = 15/100 marks.
// ─────────────────────────────────────────────────────────────────────────────
import { BlockSpec, DaySpec, WeekSpec } from './plan-types'

const S1 = '06:30 – 08:30' // 120 min · GATE theory
const S2 = '19:00 – 20:10' // 70 min · practice on morning topic
const S3 = '20:15 – 21:15' // 60 min · second area
const S4 = '21:20 – 22:00' // 40 min · night cap

const SA1 = '09:00 – 10:30'
const SA2 = '10:45 – 11:45'
const SA3 = '12:00 – 13:15'
const SA4 = '15:00 – 16:00'
const SU1 = '09:00 – 10:00'
const SU2 = '10:00 – 10:45'
const SU3 = '10:45 – 11:30'

const b = (
  s: string, m: number, k: BlockSpec['k'], e: BlockSpec['e'], sub: BlockSpec['sub'],
  t: string, st: string[], task?: string
): BlockSpec => ({ s, m, k, e, sub, t, st, task })

const nightCap = (extra?: string[]): BlockSpec =>
  b(S4, 40, 'admin', 'GATE', 'mixed', 'Night Cap: Flashcards + Error Log + GA + Plan', [
    'Flashcards (D1/D3 reps) + formula-sheet update',
    'Error log: every miss tagged concept / process / judgement',
    ...(extra ?? ['GA one-liners: 5 minutes']),
    'Tomorrow\u2019s 3 priorities in 3 lines',
  ])

const satTest = (testLabel: string, testSubs: string[], deepTopic: string): DaySpec => ({
  kind: 'saturday',
  blocks: [
    b(SA1, 90, 'test', 'GATE', 'mixed', testLabel, testSubs),
    b(SA2, 60, 'review', 'GATE', 'mixed', 'Test Review + Error Log', ['Re-solve every mistake from scratch', 'Tag root cause; star repeats']),
    b(SA3, 75, 'practice', 'GATE', 'mixed', `Deep Dive: ${deepTopic}`, ['Re-derive theory from your notes', '5 fresh problems + 5 mixed problems with the topic hidden among neighbours']),
    b(SA4, 60, 'revision', 'GATE', 'mixed', 'Formula Sheets + Flashcard Consolidation', ['Formula-sheet v2 for the week\u2019s topics', 'Missed D1/D3 reps rolled into this slot']),
  ],
})

const sunday = (planFor: string): DaySpec => ({
  kind: 'sunday',
  blocks: [
    b(SU1, 60, 'admin', 'GATE', 'mixed', 'Error-Log Triage & Re-solve', ['Every entry from the past 7 days re-attempted cold', 'Largest error pile names next week\u2019s repair work']),
    b(SU2, 45, 'revision', 'GATE', 'mixed', 'Flashcard Sweep (D7) + Formula-Sheet Rewrite', ['Week\u2019s formula sheet rewritten from memory', 'Full card sweep, oldest first']),
    b(SU3, 45, 'admin', 'GATE', 'mixed', 'Plan Next Week + One Honest Risk Note', [planFor, 'What is the single biggest risk, and the counter-move?']),
  ],
})

// mock-day template (5.0 h — exam setup + full mock + review + patch)
const mockDay = (label: string, purpose: string, reviewFocus: string): DaySpec => ({
  kind: 'mock' as const,
  blocks: [
    b('09:15 – 09:30', 15, 'admin', 'GATE', 'mixed', 'Exam Setup Ritual', ['Sit down as if at the centre: admit card, rough sheets, no phone']),
    b('09:30 – 12:30', 180, 'test', 'GATE', 'mixed', label, [purpose, 'Full length under strict exam conditions, fixed breaks']),
    b('14:00 – 15:15', 75, 'review', 'GATE', 'mixed', 'Mock Review: Score + Categorise Every Error', [reviewFocus, 'Categorise: concept / silly / guess; time per section noted']),
    b('20:45 – 21:15', 30, 'drill', 'GATE', 'mixed', 'Patch the Weakest Concept Exposed', ['Update error log with mock lessons', 'One rule to your future self — max 5 rules per mock']),
  ],
})

// ── Week 12 ──────────────────────────────────────────────────────────────────
const W12: WeekSpec = {
  week: 12, phase: 3,
  title: 'GATE Pivot: P&S Inference Deep + Calculus + Python Code-Tracing',
  focus: 'GATE 100%',
  notes: [
    'PYQ audit: P&S + Calculus together ≈ 34% of technical marks, and Python tracing appears 4–5 times per paper (closures, mutable defaults, call-counting).',
    'The daily coding touch (20:15 slot) never stops: GATE asks code output with subtle semantics.',
  ],
  milestone: 'P&S + Calculus checkpoint at 80%+ · Python refresher set complete',
  days: [
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'ps', 'P&S: Hypothesis-Testing Toolkit', ['z-test & t-test: sample-size conditions', 'Chi-squared: goodness of fit & independence', 'Confidence intervals: construction & interpretation']),
      b(S2, 70, 'practice', 'GATE', 'ps', 'Drill: 25 Hypothesis-Test Problems', ['Test selection first, computation second', 'Timed second pass']),
      b(S3, 60, 'practice', 'GATE', 'dsa', 'Python: Scoping, Closures & Mutable Defaults', ['def f(val, lst=[]) trap (26-Q16); closures sharing state (26-Q50)', 'LEGB, late binding in loops; global/nonlocal', '15 tracing questions — predict, then run']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'ps', 'P&S: CLT & Sampling Distributions', ['CLT statement; when exact binomial instead', 'Sampling distribution of the mean; standardisation drills', 'Chi-square identities: ΣXi² ~ χ²(n), Σ(Xi−X̄)² ~ χ²(n−1) (26-Q53)']),
      b(S2, 70, 'practice', 'GATE', 'ps', 'Drill: 25 CLT Problems', ['Mixed approximations & exact cases', 'Flag anything over 4 minutes']),
      b(S3, 60, 'practice', 'GATE', 'dsa', 'Python: Recursion & Call Counting', ['Total calls/stack activations of mystery(n) (26-Q39)', 'Recursion trees on paper; memoisation insight', '10 counting problems']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'calc', 'Calculus: Limits, Continuity, Differentiability', ['Standard limit forms; ln((x²+1)cos x)/x² type (24-Q60)', '√(t²+t)−t rationalisation limits (25-Q32)', 'Piecewise a,b,c for continuity+differentiability (24-Q37)', 'Differentiable ⇒ continuous, not conversely']),
      b(S2, 70, 'practice', 'GATE', 'calc', 'Drill: 20 Limit/Continuity Problems', ['Endpoint & piecewise cases included', 'Lipschitz-type: |f(x)−f(y)|≤(x−y)² ⇒ constant (25-Q59)']),
      b(S3, 60, 'drill', 'GATE', 'dsa', 'Code Tracing: GATE DA 2024–26 Python PYQs', ['Re-solve all code PYQs — twice', 'Output before checking, always']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'calc', 'Calculus: Taylor Series + Maxima/Minima', ['Maclaurin expansions: sinh\u2032\u2032(0), f⁽¹⁰⁾(0) tricks (25-Q14)', 'Critical points, boundary evaluation, second-derivative check', 'Cubic extrema on closed intervals (25-Q49, 24-Q50); xᵉe⁻ˣ max (24-Sample-Q54)']),
      b(S2, 70, 'practice', 'GATE', 'calc', 'Drill: Taylor + 15 Optimization Problems', ['Word problems included (cost/profit minimisation, 24-Sample-Q44)', 'Derive on paper, never from memory under pressure']),
      b(S3, 60, 'practice', 'GATE', 'dsa', 'Python: Lists, Sets, Dicts & Built-ins', ['extend vs append (25-Q23); set-op loop (25-Q47)', 'Slicing, aliasing, comprehensions; NumPy basics ×10']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'revision', 'GATE', 'mixed', 'P&S + Calculus: Formula-Sheet Cold-Write', ['Write both sheets from memory, 45 min', 'Correct in second colour; gaps = weekend work']),
      b(S2, 70, 'practice', 'GATE', 'mixed', 'Mixed Practice Set (30)', ['P&S + Calc interleaved', 'Simulates the paper\u2019s topic-blind format']),
      b(S3, 60, 'practice', 'GATE', 'ga', 'GA Timed Set (15 min) + Review', ['Weekly GA set — 80%+ accuracy target', 'GA pattern note: analogies/grammar 1-mark, puzzles/DI 2-mark (24–26 papers)', 'Review every miss; log traps']),
      nightCap(),
    ]},
    satTest('Checkpoint: P&S + Calculus (20 Q)', ['Closed book, 40 minutes', 'Exit bar: 16/20'], 'weakest of P&S / Calculus'),
    sunday('Stage Week 13: regression derivations template, ML short-numericals set'),
  ],
}

// ── Week 13 ──────────────────────────────────────────────────────────────────
const W13: WeekSpec = {
  week: 13, phase: 3,
  title: 'ML-I: Regression Family + Supervised Baseline (PYQ-Weighted)',
  focus: 'GATE 100%',
  notes: [
    'ML ≈ 16% of GATE DA marks and the questions compute: a ridge loss (26-Q55), an SGD step (26-Q29), a least-squares w (25-Q34) — train hands, not eyes.',
    'Re-derive every regression cost function by hand; the exam rewards knowing why and computing fast.',
  ],
  milestone: 'All regression cost functions re-derived by hand · ML-I quiz at 75%+',
  days: [
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'ml', 'ML: Simple & Multiple Linear Regression', ['Least squares; normal equations; geometry of projection', 'Fit y=wx on 3 points: compute w to 3 decimals (25-Q34)', 'R², residuals, assumptions']),
      b(S2, 70, 'practice', 'GATE', 'ml', 'Derive Every Regression Cost Function by Hand', ['Normal equations from scratch', 'Projection interpretation on 2 small datasets']),
      b(S3, 60, 'practice', 'GATE', 'dsa', 'DSA: Stacks & Queues in Python', ['Implement + trace; 10 questions', 'Priority-queue behaviour; deque traces (24-Q32)']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'ml', 'ML: Ridge Regression & Regularisation', ['Ridge: L2, bias↑ variance↓, shrinks but does not select (26-Q37)', 'MAE + λ‖w‖² total-loss computation (26-Q55)', 'Lambda effects; penalised normal equations']),
      b(S2, 70, 'practice', 'GATE', 'ml', 'Drill: 30 ML Short-Numericals', ['Ridge updates, SGD steps: w ← w − η·x·(wx−y) (26-Q29)', 'Timed: 90 seconds each']),
      b(S3, 60, 'practice', 'GATE', 'dsa', 'DSA: Linear & Binary Search + Boundary Variants', ['Max comparisons on 1000 sorted elements (26-Q31)', 'Off-by-one outputs traced; 15 questions']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'ml', 'ML: Logistic Regression & Distance Classifiers', ['Sigmoid, log-loss, threshold effects; sigmoid derivative at f(x)=0.4 (24-Q33)', 'Nearest-class-mean classifier is linear in x (25-Q55)', 'Outputs as probabilities vs class decisions']),
      b(S2, 70, 'practice', 'GATE', 'ml', 'Drill: 15 Logistic Problems', ['Boundary sketches + threshold computations']),
      b(S3, 60, 'practice', 'GATE', 'ga', 'GA Timed Set + Error Review', ['15-minute set', 'Trap list updated']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'ml', 'ML: kNN & Naive Bayes', ['kNN: minimum odd k from a scatter (24-Q63); distance metrics', 'Naive Bayes: parameter counting 2K+1 (24-Q20), VDK+K (24-Sample-Q28)', 'Misclassification probability from posteriors (25-Q35); Laplace smoothing']),
      b(S2, 70, 'practice', 'GATE', 'ml', 'Compute Both by Hand on Small Datasets', ['Full kNN vote + NB table', 'Laplace-smoothing variant']),
      b(S3, 60, 'practice', 'GATE', 'dsa', 'DSA: Selection/Bubble/Insertion Sort in Python', ['Comparison counts on P=[1,2,3,5,4] (26-Q49)', 'Insertion swaps = inversions (25-Q29); implement all three']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'drill', 'GATE', 'ml', 'PYQ Drill: Regression Family — GATE DA 2024–2026', ['Every regression PYQ, solved twice', 'Fresh once, then cold after 48 h']),
      b(S2, 70, 'review', 'GATE', 'ml', 'Cold Re-Solve: Yesterday\u2019s Misses', ['No notes', 'Concept gaps → repair queue']),
      b(S3, 60, 'practice', 'GATE', 'dsa', 'DSA: Mergesort & Quicksort Mechanics in Python', ['First-pivot quicksort expected recurrence (26-Q15)', 'Partition traced by hand ×3']),
      nightCap(),
    ]},
    satTest('ML-I + DSA Quiz (20 Q)', ['Regression family + sorting/searching', 'Exit bar: 15/20'], 'weakest ML sub-topic'),
    sunday('Stage Week 14: SVM/LDA notes, MLP forward-pass template, A* trace sheet'),
  ],
}

// ── Week 14 ──────────────────────────────────────────────────────────────────
const W14: WeekSpec = {
  week: 14, phase: 3,
  title: 'ML-II (Classifiers, CV, Clustering, PCA) + AI Search (Hand-Simulation)',
  focus: 'GATE 100%',
  notes: [
    'The two favourite exam patterns: hand-compute an MLP forward pass (26-Q56 params, 25-Q42 gradients) and one k-means/linkage iteration (24-Sample-Q42, 26-Q36, 25-Q30).',
    'AI search is hand-simulation: run the algorithm, count expansions, report paths/pruned nodes.',
  ],
  milestone: 'MLP forward pass + k-means iteration computed by hand · ML-II quiz 75%+',
  days: [
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'ml', 'ML: LDA & SVM', ['Fisher criterion → generalised eigenproblem (24-Q22)', 'Hard-margin SVM: support vectors, margin 2/‖w‖ (25-Q53, 24-Q17)', 'Removing a non-support vector changes nothing (24-Sample-Q29); kernels at concept level']),
      b(S2, 70, 'practice', 'GATE', 'ml', 'Derivations + 15 Problems', ['LDA on a 2-class toy dataset', 'SVM margin computation on a 4-point set']),
      b(S3, 60, 'practice', 'GATE', 'ai', 'AI: Uninformed Search — BFS, DFS, UCS, IDDFS', ['IDDFS/IDA* root-expansion counts (24-Sample-Q1)', 'Expansion counts on a small state space (24-Q44)', 'Compare completeness & optimality']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'ml', 'ML: Decision Trees + Bias-Variance', ['Impurity: Gini & entropy; InformationGain(D, Pitch) computation (24-Q62)', 'Split evaluation by hand on a 10-row table', 'Bias-variance: what regularisation does to each (26-Q37 link)']),
      b(S2, 70, 'practice', 'GATE', 'ml', 'Compute Gini / Info-Gain by Hand ×5', ['Full split evaluation on small tables']),
      b(S3, 60, 'practice', 'GATE', 'ai', 'AI: Informed Search — A* & Heuristics', ['A* expansion sequence with priority queue (25-Q44)', 'Admissible heuristics: max(h1,h2) is admissible (24-Q23)', 'Obstacle-circumscribing heuristics admissibility (24-Sample-Q46)']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'ml', 'ML: Cross-Validation + MLP / Feed-Forward Nets', ['LOOCV split count on 900 training rows (26-Q12); LOO vs k-fold variance claims', 'Parameter counting: 30-4-3-1 without bias (26-Q56), with bias (24-Sample-Q43)', 'ReLU: continuous, non-differentiable at 0 (25-Q48); ReLU-network equivalence (24-Q43)']),
      b(S2, 70, 'practice', 'GATE', 'ml', 'Hand-Compute One Full MLP Forward Pass', ['Activations, outputs, layer by layer (25-Q42 gradient case)', 'Repeat once cold']),
      b(S3, 60, 'practice', 'GATE', 'ga', 'GA Timed Set + Review', ['15-minute set + review', 'Error-log updates']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'ml', 'ML: k-means, Hierarchical Clustering + PCA', ['k-means centroid update for one EM iteration (24-Sample-Q42)', 'Agglomerative: which pair merges first (26-Q36); single vs complete linkage (25-Q30); dendrogram (24-Q42)', 'PCA: PCs are orthogonal ⇒ 90° (26-Q11); variance along u = λmax (25-Q60); explained-variance ratio']),
      b(S2, 70, 'practice', 'GATE', 'ml', 'Hand-Compute One k-Means Iteration + PCA Ratio', ['Centroids, reassignment, one full loop', 'Explained-variance ratio from eigenvalues']),
      b(S3, 60, 'practice', 'GATE', 'ai', 'AI: Adversarial Search — Minimax + Alpha-Beta', ['Best root strategy in integer form (26-Q30)', 'Pruning ranges: x∈(−∞,2] style (25-Q43); which subtrees get pruned (24-Sample-Q31)', 'Move-ordering effects']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'drill', 'GATE', 'ml', 'PYQ Drill: Clustering / PCA / CV / Classifiers — GATE DA PYQs', ['Solved twice; second pass cold']),
      b(S2, 70, 'review', 'GATE', 'ml', 'Cold Re-Solve + Error Tagging', ['Concept gaps to Saturday']),
      b(S3, 60, 'practice', 'GATE', 'ai', 'AI: DFS/BFS Traversal Nuances', ['DFS discovery count with ordered adjacency (25-Q65)', 'Cross/back edge classification (24-Q14); topological orders (24-Q51); unique BFS orders (24-Sample-Q52)']),
      nightCap(),
    ]},
    satTest('ML-II + AI Quiz (20 Q)', ['Classifiers, clustering, PCA, search', 'Exit bar: 15/20'], 'weakest of ML-II / AI'),
    sunday('Stage Week 15: variable-elimination sheet, warehousing one-pager'),
  ],
}

// ── Week 15 ──────────────────────────────────────────────────────────────────
const W15: WeekSpec = {
  week: 15, phase: 3,
  title: 'AI Inference & Logic + DBMS/Warehousing Full Sweep + Consolidation',
  focus: 'GATE 100%',
  notes: [
    'AI ≈ 9% and DBMS+DW ≈ 14%: 2024–26 papers hammered candidate keys, B+ trees, OLAP cuboids and Bayes-net inference — this week closes both.',
    'Phase 3 exit gate: the 50-question consolidation test on Saturday covers the full syllabus.',
  ],
  milestone: 'Consolidation test (50 Q, full syllabus) done · formula sheets v1 frozen',
  days: [
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'ai', 'AI: Propositional & First-Order Logic', ['Counting models of A∨¬B∨C (24-Sample-Q2); ∀∃ translations (24-Sample-Q3)', 'Quantifier validity: ∀xP⇒∃xP vs ∃xP⇒∀xP (26-Q48); entailment X⇒Y facts (26-Q24)', 'Tautology tables; assertions as s1∧s3 (24-Q54)']),
      b(S2, 70, 'practice', 'GATE', 'ai', '25 Logic Hand-Simulations', ['Truth tables + translations under 90 seconds each']),
      b(S3, 60, 'theory', 'GATE', 'ai', 'AI: Bayes Nets — Joint, Independence, Exact Inference', ['P(U,V,W,Z) from CPTs (24-Q64)', 'Conditional independence from factorisation (24-Q24)', 'Variable elimination is exact; Gibbs/rejection are approximate (25-Q26)']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'ai', 'AI: Approximate Inference — Sampling', ['Rejection sampling & likelihood weighting: estimate P(b|¬a,¬c) (24-Sample-Q32)', 'Normalisation-constant mistakes (trap)', 'Estimates from samples step by step']),
      b(S2, 70, 'practice', 'GATE', 'ai', '20 Sampling Problems', ['Trace estimates step by step']),
      b(S3, 60, 'theory', 'GATE', 'dbms', 'DBMS: Keys, FDs & Normal Forms (GATE angle)', ['Candidate keys from FD sets — the every-paper question (26-Q17, 25-Q57)', 'BCNF↔3NF implications; dependency preservation ⇒ more joins (25-Q16)', 'Superkey counting (24-Sample-Q41); ER→3NF minimum relations (26-Q61)']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'dbms', 'DBMS: SQL, Algebra, Calculus & Indexing', ['Nested/correlated SQL: team-size GROUP BY (26-Q51), count-compare (26-Q60)', 'RA natural join with σ/π (26-Q42, 25-Q17); division (25-Q62); tuple calculus count (26-Q59)', 'B+ tree: order, min height for 100k records (24-Sample-Q40), insertion splits (26-Q41)', 'Index choice for a query: hash vs B+ (24-Q55)']),
      b(S2, 70, 'practice', 'GATE', 'dbms', '40 SQL / Relational-Algebra Queries', ['Translate-and-compare under a minute each']),
      b(S3, 60, 'practice', 'GATE', 'dsa', 'DSA: Graph Algorithms by Hand', ['BFS/DFS/Dijkstra on paper', 'Shortest-path non-edge reasoning (25-Q58)', 'Complexity table from memory']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'dbms', 'DBMS: Warehousing, Mining & Big Data (GATE S5)', ['OLAP: CUBE row counts (25-Q46), drill-down vs roll-up (26-Q18)', 'Cuboids = product of hierarchy levels (26-Q43); concept hierarchies', 'Data transformation: normalisation, discretisation, sampling, compression', 'Classifier task↔algorithm matching: clustering/k-medoid, LDA, NB, MCMC (26-Q23)']),
      b(S2, 70, 'practice', 'GATE', 'dbms', '30 Warehouse & Mining MCQs', ['Mixed: OLAP ops, cuboids, association rules, clustering vs classification']),
      b(S3, 60, 'drill', 'GATE', 'mixed', 'Error-Log Top-10 Patching', ['Recurring offenders re-solved ×5 each type']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'revision', 'GATE', 'mixed', 'Formula-Sheet Cold-Writes: P&S, LA, Calculus, ML, AI, DBMS', ['From memory, 45 minutes', 'Correct; star gaps for Sunday — the 12-page set completes today']),
      b(S2, 70, 'revision', 'GATE', 'mixed', 'Fix Sheets + Consolidation Prep', ['Second-colour corrections', 'Flashcard sweep']),
      b(S3, 60, 'practice', 'GATE', 'mixed', 'PDSA + Mixed GATE-Style Set (2024–2026)', ['Output tracing + complexity + algorithms', 'Timed, exam pacing']),
      nightCap(),
    ]},
    { kind: 'saturday', blocks: [
      b('09:00 – 11:30', 150, 'test', 'GATE', 'mixed', 'CONSOLIDATION TEST — 50 Q, Full Syllabus (150 min)', ['Self-made from the week\u2019s material + older topics', 'Phase 3 exit gate — target 38/50']),
      b('11:45 – 13:00', 75, 'review', 'GATE', 'mixed', 'Review + Gap List for Phase 4', ['Every error categorised', 'Top 3 gaps get W16 sectional priority']),
      b('15:00 – 15:45', 45, 'practice', 'GATE', 'mixed', 'Patch the Largest Gap', ['Re-derive + 5 fresh problems']),
      b('15:50 – 16:20', 30, 'admin', 'GATE', 'mixed', 'Phase-4 Planning + Sheets Freeze', ['Mock calendar staged (M1–M6)', 'Formula sheets frozen at v1']),
    ]},
    sunday('Plan Phase 4: sectional order, mock-day template, marks-budget targets'),
  ],
}

// ── Week 16 ──────────────────────────────────────────────────────────────────
const W16: WeekSpec = {
  week: 16, phase: 4,
  title: 'PYQ Block 1 + Sectionals S1–S4 (P&S, LA, Calc+GA, PDSA, DBMS)',
  focus: 'GATE 100%',
  notes: [
    'Metric that matters: error categories closed, not questions solved.',
    'Work the real papers section-wise: 2026 (IIT Guwahati), 2025 (IIT Roorkee), 2024 + 2024-Sample (IISc) — every DA PYQ seen at least once this week and next.',
    'Concept errors → morning theory patch; process errors → re-solve the type ×5; judgement errors → Phase-4 mocks.',
  ],
  milestone: 'S1–S4 done · every DA PYQ seen at least once · 85+ sectional average',
  days: [
    { kind: 'weekday', blocks: [
      b(S1, 120, 'drill', 'GATE', 'ps', 'P&S Topic-Wise PYQ: Counting, Bayes, Distributions, CLT, Tests', ['Every PYQ under a realistic time cap (2024/25/26 papers)', 'Log anything slow, guessed, or wrong']),
      b(S2, 70, 'test', 'GATE', 'ps', 'Sectional S1: Probability & Statistics (timed)', ['Sectional from test series or self-built PYQ compilation', 'Target: 19+/23 scaled']),
      b(S3, 60, 'review', 'GATE', 'ps', 'S1 Review + Error Log', ['Categorise every error', 'Re-solve wrong ones tonight']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'drill', 'GATE', 'la', 'LA Topic-Wise PYQ: Eigen, SVD, Projections, Quadratic Forms', ['Property-implication questions: what must ALWAYS be true (25-Q37/52)', 'M^k periodicity, trace conditions, Rayleigh quotient']),
      b(S2, 70, 'test', 'GATE', 'la', 'Sectional S2: Linear Algebra (timed)', ['Target: 6/7']),
      b(S3, 60, 'review', 'GATE', 'la', 'S2 Review + Error Log', ['Matrix-property traps starred']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'drill', 'GATE', 'calc', 'Calculus + GA Topic-Wise PYQ', ['Limits/extrema/Taylor end-to-end blends (24–26 papers)', 'GA: analogies, grammar, DI, 2-mark puzzles (26-Q3/Q8/Q10 style)']),
      b(S2, 70, 'test', 'GATE', 'ga', 'Sectional S7: Calculus + GA (timed)', ['GA full 15-mark set practice', 'Target: Calc 4/5 · GA 13/15']),
      b(S3, 60, 'review', 'GATE', 'ga', 'S7 Review + GA Trap List', ['Two-elimination rule for MCQs']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'drill', 'GATE', 'dsa', 'PDSA Topic-Wise PYQ: Python Tracing, Sorting, Searching, Graphs', ['Output semantics: closures, defaults, call counts', 'Sort comparison/swap counts; binary-search max comparisons', 'DFS discovery counts; stack pseudocode traces (25-Q64)']),
      b(S2, 70, 'test', 'GATE', 'dsa', 'Sectional S3: Programming & DSA (timed)', ['Target: 10/12']),
      b(S3, 60, 'review', 'GATE', 'dsa', 'S3 Review + Error Log', ['Code-tracing misses re-solved']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'drill', 'GATE', 'dbms', 'DBMS Topic-Wise PYQ: Keys, SQL, Indexing, Warehousing', ['Candidate keys, superkeys, min-relations (26-Q61)', 'NULL behaviour; bag vs set semantics', 'B+ tree fan-out computations; OLAP cuboids/drill-down']),
      b(S2, 70, 'test', 'GATE', 'dbms', 'Sectional S4: DBMS & Warehousing (timed)', ['Target: 8.5/10']),
      b(S3, 60, 'review', 'GATE', 'dbms', 'S4 Review + Error Log', ['Lossless-decomposition checks starred']),
      nightCap(),
    ]},
    { kind: 'saturday', blocks: [
      b(SA1, 90, 'drill', 'GATE', 'mixed', 'Error-Log Top-10 Re-Solve (cold)', ['The ten most recurring mistakes, from scratch']),
      b(SA2, 60, 'review', 'GATE', 'mixed', 'Concept-Error Patch: Re-Derive Theory', ['Each concept error sends you back to the derivation']),
      b(SA3, 75, 'drill', 'GATE', 'mixed', 'Process-Error Re-Drill: Same Type ×5', ['Process errors trigger re-solve of the type five times']),
      b(SA4, 60, 'admin', 'GATE', 'mixed', 'Week Audit: Error Categories Closed?', ['Tally by category: concept / process / judgement', 'Judgement errors are fixed in mock phase — queue them']),
    ]},
    sunday('Plan Week 17: ML/AI sectionals + Mocks 1–2 cadence'),
  ],
}

// ── Week 17 ──────────────────────────────────────────────────────────────────
const W17: WeekSpec = {
  week: 17, phase: 4,
  title: 'PYQ Block 2 (ML, AI) + MOCKS 1–2',
  focus: 'GATE 100%',
  notes: [
    'Expect Mocks 1–2 to be your lowest — the mock learning curve is steep and fast.',
    'Judge yourself only on the Mock 5→6 trend, never on Mocks 1 and 2.',
  ],
  milestone: 'S5–S6 done · Mocks 1–2 completed & reviewed same day',
  days: [
    { kind: 'weekday', blocks: [
      b(S1, 120, 'drill', 'GATE', 'ml', 'ML Topic-Wise PYQ: Regression, Classifiers, CV, Clustering, PCA', ['Compute-style questions prioritised: ridge loss, SGD step, LOOCV, MLP params', 'Derivations where they pay']),
      b(S2, 70, 'test', 'GATE', 'ml', 'Sectional S5: Machine Learning (timed)', ['Target: 12.5/15']),
      b(S3, 60, 'review', 'GATE', 'ml', 'S5 Review + Error Log', ['Trap ledger: ridge vs subset, LOO variance, kNN odd-k']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'drill', 'GATE', 'ai', 'AI Topic-Wise PYQ: Search, Adversarial, Logic, Inference', ['A* sequences, expansion counts, pruning ranges', 'Model counting, entailment, Bayes-net joints, sampling estimates']),
      b(S2, 70, 'test', 'GATE', 'ai', 'Sectional S6: AI (timed)', ['Target: 7.5/9']),
      b(S3, 60, 'review', 'GATE', 'ai', 'S6 Review + Error Log', ['Pruning-count & CNF slips starred']),
      nightCap(),
    ]},
    mockDay('MOCK 1 — Full Length (9:30 AM)', 'Baseline: full syllabus, exam conditions', 'Time-sink map: which sections ran over; per-section time budget'),
    { kind: 'weekday', blocks: [
      b(S1, 120, 'drill', 'GATE', 'mixed', 'Mock 1 Re-Solve: Every Wrong & Guessed Question', ['From scratch, on paper, clock visible']),
      b(S2, 70, 'drill', 'GATE', 'mixed', 'Judgement-Error Drills', ['Two-elimination rule practice ×20', 'NAT/MSQ harvest habits: no negative marking on NAT/MSQ — attempt all']),
      b(S3, 60, 'practice', 'GATE', 'ga', 'GA Full Set (15 min) + Formula Re-Derivations', ['Weak GA areas patched']),
      nightCap(['Mock-lesson rules page: 5 rules max']),
    ]},
    mockDay('MOCK 2 — Full Length (9:30 AM)', 'Stabilise order of attempt (GA first strategy)', 'Accuracy by question type: MCQ vs MSQ vs NAT'),
    { kind: 'saturday', blocks: [
      b(SA1, 90, 'admin', 'GATE', 'mixed', 'Mock 1–2 Trend Audit vs Marks Budget', ['Section-wise marks vs contract: GA 14, P&S 23, ML 15, DSA 12, DBMS 10, AI 9, LA 7, Calc 5', 'Trend line drawn — single scores ignored']),
      b(SA2, 60, 'drill', 'GATE', 'mixed', 'Error Patching: Mock 1–2 Concept Gaps', ['Repair-cycle day 1']),
      b(SA3, 75, 'practice', 'GATE', 'mixed', 'Weakest-Section Deep Dive', ['Re-derive + mixed problems']),
      b(SA4, 60, 'revision', 'GATE', 'mixed', 'Formula Sheets v2 + Flashcards', ['Sheets updated from mock errors']),
    ]},
    sunday('Plan Week 18: Mocks 3–5 cadence + marks-budget audit schedule'),
  ],
}

// ── Week 18 ──────────────────────────────────────────────────────────────────
const W18: WeekSpec = {
  week: 18, phase: 4,
  title: 'MOCKS 3–6 + Patching + Marks-Budget Audit',
  focus: 'GATE 100%',
  notes: [
    'Never take two full mocks in a row without the review in between — an unreviewed mock teaches almost nothing.',
    'By M6 the attempt sequence should feel mechanical, not tactical. Final strategy freeze after Mock 6.',
  ],
  milestone: 'Mock trend stable in the 85–95 band · strategy frozen',
  days: [
    mockDay('MOCK 3 — Full Length (9:30 AM)', 'Push attempt rate without accuracy loss', 'Judgement errors: guesses and negative marks'),
    { kind: 'weekday', blocks: [
      b(S1, 120, 'drill', 'GATE', 'mixed', 'Mock 3 Re-Solve + Time-Sink Audit', ['Where did 180 minutes actually go?', 'Flag-and-return discipline rehearsed']),
      b(S2, 70, 'drill', 'GATE', 'mixed', 'Two-Elimination Rule + Guess Discipline', ['Blank 2-mark MCQ costs 2; blind guess costs 2.67', 'Drill: decide/leave ×30']),
      b(S3, 60, 'revision', 'GATE', 'mixed', 'Formula Re-Derivations (weakest 3 sheets)', ['Active recall: cover, recall, check']),
      nightCap(),
    ]},
    mockDay('MOCK 4 — Full Length, HARD MOCK (9:30 AM)', 'Simulate a bad paper deliberately', 'Recovery behaviour after a difficult section'),
    { kind: 'weekday', blocks: [
      b(S1, 120, 'admin', 'GATE', 'mixed', 'Marks-Budget Audit vs Table 1', ['Line-by-line: GA 14 · P&S 23 · ML 15 · DSA 12 · DBMS 10 · AI 9 · LA 7 · Calc 5', 'Deficit ledger updated; revision targets choose themselves']),
      b(S2, 70, 'drill', 'GATE', 'mixed', 'Error Patching: Mock 4 Concept Gaps', ['Hard-mock fallout cleared']),
      b(S3, 60, 'revision', 'GATE', 'ga', 'GA One-Liners Sweep', ['Weekly GA set + one-liner cards']),
      nightCap(),
    ]},
    mockDay('MOCK 5 — Full Length (9:30 AM)', 'Lock the marks budget: audit vs Table 1', 'Section-wise marks vs your 95+ contract'),
    { kind: 'saturday', blocks: [
      b('09:15 – 09:30', 15, 'admin', 'GATE', 'mixed', 'Exam Setup Ritual', ['As if at the centre']),
      b('09:30 – 12:30', 180, 'test', 'GATE', 'mixed', 'MOCK 6 — FULL DRESS REHEARSAL AT PEAK (9:30 AM)', ['Full exam-identical conditions', 'Final strategy freeze after this — no new tactics']),
      b('14:00 – 15:15', 75, 'review', 'GATE', 'mixed', 'Mock 6 Review + Strategy Freeze', ['Five final rules to your future self', 'Attempt sequence locked']),
      b('20:45 – 21:15', 30, 'admin', 'GATE', 'mixed', 'Physical Revision Pack Prep', ['12-page formula set + error log (starred) + 6 score cards + 1-page attempt-strategy rules']),
    ]},
    sunday('Plan Week 19: revision grid + exam-day playbook'),
  ],
}

// ── Week 19 ──────────────────────────────────────────────────────────────────
const W19: WeekSpec = {
  week: 19, phase: 4,
  title: 'Final Revision + GATE EXAM WEEK',
  focus: 'GATE 100%',
  notes: [
    'Nothing new enters the system. The only job: make 19 weeks maximally retrievable at 9:30 AM.',
    'Fresh brain is worth more marks than one extra topic — keep the last three evenings light.',
  ],
  milestone: 'GATE EXAM — walk in with the 12-page pack and a calm plan',
  days: [
    { kind: 'weekday', blocks: [
      b(S1, 120, 'revision', 'GATE', 'mixed', 'Formula Sheets 1–6: Active Recall', ['Cover, recall, check — sheet by sheet', 'Star anything that hesitated']),
      b(S2, 70, 'review', 'GATE', 'mixed', 'Error Log Full Pass: Flagged Questions', ['Re-solve every flagged entry']),
      b(S3, 60, 'revision', 'GATE', 'mixed', 'Syllabus Sweep: Official Topic List (part 1)', ['Tick every topic; patch gaps as found']),
      nightCap(['GA set: light']),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'revision', 'GATE', 'mixed', 'Formula Sheets 7–12 + GA One-Liners', ['Same active-recall protocol']),
      b(S2, 70, 'review', 'GATE', 'mixed', 'Error Log: Starred Questions Only', ['The three-time offenders — exam-morning reading']),
      b(S3, 60, 'revision', 'GATE', 'mixed', 'Syllabus Sweep (part 2) — Complete', ['Every topic ticked or patched']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'revision', 'GATE', 'mixed', 'Mock-Lesson Rules Page + Weak-Area Sectional (45 min)', ['One page: 5 instructions to your future self', 'Optional final sectional on the weakest area only']),
      b(S2, 70, 'review', 'GATE', 'mixed', 'Trap List Read-Through', ['Absolute statements, unit slips, boundary cases']),
      b(S3, 60, 'admin', 'GATE', 'mixed', 'Logistics: Admit Card + Route Check', ['Print the day it released; visit the route if unfamiliar']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'revision', 'GATE', 'mixed', 'Final Formula Recall Round', ['All 12 sheets, cover-recall-check', 'GA one-liners']),
      b(S2, 70, 'revision', 'GATE', 'mixed', 'Flashcard Sweep (final)', ['Full deck, oldest first']),
      b(S3, 60, 'admin', 'GATE', 'mixed', 'Pack the Exam Folder', ['Admit card, ID, water, strategy sheet', 'Sleep on schedule tonight']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'revision', 'GATE', 'mixed', 'Light: Strategy Sheet + 2 Weakest Fact Sheets', ['Read only — no problem solving']),
      b(S2, 70, 'revision', 'GATE', 'ga', 'GA Cards (30 min)', ['One-liners only']),
      b(S3, 60, 'admin', 'GATE', 'mixed', 'Rest Protocol', ['No study after dinner', 'Sleep by 22:30 — seven-plus hours is a performance aid']),
      b('21:30 – 21:45', 15, 'admin', 'GATE', 'mixed', 'Evening Wind-Down Check', ['Alarm, clothes, folder — staged']),
    ]},
    { kind: 'saturday', blocks: [
      b('09:00 – 09:30', 30, 'revision', 'GATE', 'mixed', 'Morning Flashcards Only (30 min)', ['Strategy sheet read once', 'Water, walk, calm']),
      b('10:00 – 10:30', 30, 'admin', 'GATE', 'mixed', 'Final Logistics + Rest', ['Centre route & timing final check', 'Take the rest fully — it is part of the plan']),
      b('20:00 – 20:30', 30, 'admin', 'GATE', 'mixed', 'Early Night Protocol', ['Everything staged', 'Sleep by 22:00']),
    ]},
    { kind: 'exam', blocks: [
      b('06:30 – 06:50', 20, 'admin', 'GATE', 'mixed', 'Wake · Flashcards + Water Only', ['No syllabus reading']),
      b('07:45 – 09:15', 90, 'admin', 'GATE', 'mixed', 'Travel & Reporting', ['Reach the centre 90 minutes early', 'Restroom before entry; only flashcards and water']),
      b('09:30 – 12:30', 180, 'exam', 'GATE', 'mixed', 'GATE 2027 DA EXAM', ['First 25 min: GA in one pass — bank 14–15 marks', 'Next 2 h: strongest DA section; harvest NAT/MSQ (no negative marking)', 'MCQ two-elimination rule: answer only if two options are dead', 'Flag-and-return: >3 min without progress gets flagged (return at min 130)', 'Last 15 min: flagged answers + sanity pass on bubbled NATs']),
      b('13:00 – 13:30', 30, 'admin', 'BOTH', 'mixed', 'Mission Complete — Acknowledge & Recover', ['Nineteen weeks, six hundred hours, one syllabus, executed daily', 'Whatever the score: the discipline you built is the real asset']),
    ]},
  ],
}

export const WEEKS_B: WeekSpec[] = [W12, W13, W14, W15, W16, W17, W18, W19]

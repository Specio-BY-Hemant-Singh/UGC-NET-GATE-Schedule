// ─────────────────────────────────────────────────────────────────────────────
// Weeks 12–19 · Phase 3 (GATE Foundation) + Phase 4 (GATE Mock Sprint & Exam)
// NET is done — full 4.75–5 h budget goes to GATE 2027 DA
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

// mock-day template (5.0 h)
const mockDay = (label: string, purpose: string, reviewFocus: string): DaySpec => ({
  kind: 'saturday' as const,
  blocks: [
    b('09:15 – 09:30', 15, 'admin', 'GATE', 'mixed', 'Exam Setup Ritual', ['Sit down as if at the centre: admit card, rough sheets, no phone']),
    b('09:30 – 12:30', 180, 'test', 'GATE', 'mixed', label, [purpose, 'Full length under strict exam conditions, fixed breaks']),
    b('14:00 – 15:30', 90, 'review', 'GATE', 'mixed', 'Mock Review: Score + Categorise Every Error', [reviewFocus, 'Categorise: concept / silly / guess; time per section noted']),
    b('20:45 – 21:15', 30, 'drill', 'GATE', 'mixed', 'Patch the Weakest Concept Exposed', ['Update error log with mock lessons', 'One rule to your future self — max 5 rules per mock']),
  ],
})

// ── Week 12 ──────────────────────────────────────────────────────────────────
const W12: WeekSpec = {
  week: 12, phase: 3,
  title: 'GATE Pivot: P&S Inference Deep + Calculus + Python Refresh',
  focus: 'GATE 100%',
  notes: [
    'NET is done — every hour now serves February. Complete distributions and inference per the GATE plan\u2019s Week 4–5 blocks.',
    'The daily coding touch (20:15 slot) never stops: GATE asks code-tracing with subtle output semantics.',
  ],
  milestone: 'P&S + Calculus checkpoint at 80%+ · Python refresher set complete',
  days: [
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'ps', 'P&S: Hypothesis-Testing Toolkit', ['z-test & t-test: sample-size conditions', 'Chi-squared: goodness of fit & independence', 'Confidence intervals: construction & interpretation']),
      b(S2, 70, 'practice', 'GATE', 'ps', 'Drill: 25 Hypothesis-Test Problems', ['Test selection first, computation second', 'Timed second pass']),
      b(S3, 60, 'practice', 'GATE', 'dsa', 'Python Refresh: Types, Control Flow, Functions', ['HackerRank-style: 10 problems', 'Code-tracing semantics: scoping, mutability']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'ps', 'P&S: CLT & Sampling Distributions', ['CLT statement; when exact binomial instead', 'Sampling distribution of the mean', 'Standardisation drills']),
      b(S2, 70, 'practice', 'GATE', 'ps', 'Drill: 25 CLT Problems', ['Mixed approximations & exact cases', 'Flag anything over 4 minutes']),
      b(S3, 60, 'practice', 'GATE', 'dsa', 'Python: Strings, Lists, Dicts, Comprehensions', ['10 tracing questions', 'Gotchas: aliasing, mutable defaults, slicing']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'calc', 'Calculus: Limits, Continuity, Differentiability', ['Standard limit forms', 'Continuity vs differentiability at a point', 'Trap: differentiable ⇒ continuous, not conversely']),
      b(S2, 70, 'practice', 'GATE', 'calc', 'Drill: 20 Limit/Continuity Problems', ['Endpoint & piecewise cases included']),
      b(S3, 60, 'drill', 'GATE', 'dsa', 'Code Tracing: GATE DA 2024–26 Python PYQs', ['Re-solve all code PYQs — twice', 'Output before checking, always']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'calc', 'Calculus: Taylor Series + Maxima/Minima', ['Maclaurin expansions from memory', 'Critical points, boundary evaluation, second-derivative check', 'Endpoints count as extrema candidates (trap)']),
      b(S2, 70, 'practice', 'GATE', 'calc', 'Drill: Taylor + 15 Optimization Problems', ['Word problems included', 'Derive on paper, never from memory under pressure']),
      b(S3, 60, 'practice', 'GATE', 'dsa', 'NumPy Basics + Counting Recap Quiz', ['NumPy drills: 10 items', 'Counting quiz (20 Q) re-solve']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'revision', 'GATE', 'mixed', 'P&S + Calculus: Formula-Sheet Cold-Write', ['Write both sheets from memory, 45 min', 'Correct in second colour; gaps = weekend work']),
      b(S2, 70, 'practice', 'GATE', 'mixed', 'Mixed Practice Set (30)', ['P&S + Calc interleaved', 'Simulates the paper\u2019s topic-blind format']),
      b(S3, 60, 'practice', 'GATE', 'ga', 'GA Timed Set (15 min) + Review', ['Weekly GA set — 80%+ accuracy target', 'Review every miss; log traps']),
      nightCap(),
    ]},
    satTest('Checkpoint: P&S + Calculus (20 Q)', ['Closed book, 40 minutes', 'Exit bar: 16/20'], 'weakest of P&S / Calculus'),
    sunday('Stage Week 13: regression derivations template, ML short-numericals set'),
  ],
}

// ── Week 13 ──────────────────────────────────────────────────────────────────
const W13: WeekSpec = {
  week: 13, phase: 3,
  title: 'ML-I: Regression Family + Daily Code Touch',
  focus: 'GATE 100%',
  notes: [
    'DA\u2019s signature section: questions make you compute — a ridge update, a kNN vote, not just define.',
    'Re-derive every regression cost function by hand; the exam rewards knowing why and computing fast.',
  ],
  milestone: 'All regression cost functions re-derived by hand · ML-I quiz at 75%+',
  days: [
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'ml', 'ML: Simple & Multiple Linear Regression', ['Least squares; normal equations; geometry of projection', 'R\u00B2, residuals, assumptions']),
      b(S2, 70, 'practice', 'GATE', 'ml', 'Derive Every Regression Cost Function by Hand', ['Normal equations from scratch', 'Projection interpretation on 2 small datasets']),
      b(S3, 60, 'practice', 'GATE', 'dsa', 'DSA: Stacks & Queues in Python', ['Implement + trace; 10 questions', 'Priority-queue behaviour']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'ml', 'ML: Ridge Regression & Regularisation', ['Ridge shrinks but does not select (trap)', 'Lambda effects; penalised normal equations']),
      b(S2, 70, 'practice', 'GATE', 'ml', 'Drill: 30 ML Short-Numericals', ['Ridge updates, projections, small computations', 'Timed: 90 seconds each']),
      b(S3, 60, 'practice', 'GATE', 'dsa', 'DSA: Linear & Binary Search + Boundary Variants', ['Off-by-one outputs traced', '15 questions']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'ml', 'ML: Logistic Regression & Decision Boundaries', ['Sigmoid, log-loss, threshold effects', 'Outputs as probabilities vs class decisions (trap)']),
      b(S2, 70, 'practice', 'GATE', 'ml', 'Drill: 15 Logistic Problems', ['Boundary sketches + threshold computations']),
      b(S3, 60, 'practice', 'GATE', 'ga', 'GA Timed Set + Error Review', ['15-minute set', 'Trap list updated']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'ml', 'ML: kNN & Naive Bayes', ['kNN behaviour as k varies; distance choices', 'Naive Bayes with Laplace smoothing', 'Conditional-independence assumption']),
      b(S2, 70, 'practice', 'GATE', 'ml', 'Compute Both by Hand on Small Datasets', ['Full kNN vote + NB table', 'Laplace-smoothing variant']),
      b(S3, 60, 'practice', 'GATE', 'dsa', 'DSA: Selection/Bubble/Insertion Sort in Python', ['Implement all three; trace on 7 elements', 'Stability & complexity table from memory']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'drill', 'GATE', 'ml', 'PYQ Drill: Regression Family — GATE DA 2024–2026', ['Every regression PYQ, solved twice', 'Fresh once, then cold after 48 h']),
      b(S2, 70, 'review', 'GATE', 'ml', 'Cold Re-Solve: Yesterday\u2019s Misses', ['No notes', 'Concept gaps → repair queue']),
      b(S3, 60, 'practice', 'GATE', 'dsa', 'DSA: Mergesort & Quicksort Mechanics in Python', ['Partition traced by hand ×3', 'Recurrence intuition']),
      nightCap(),
    ]},
    satTest('ML-I + DSA Quiz (20 Q)', ['Regression family + sorting/searching', 'Exit bar: 15/20'], 'weakest ML sub-topic'),
    sunday('Stage Week 14: SVM/LDA notes, MLP forward-pass template, A* trace sheet'),
  ],
}

// ── Week 14 ──────────────────────────────────────────────────────────────────
const W14: WeekSpec = {
  week: 14, phase: 3,
  title: 'ML-II (Classifiers, CV, Clustering, PCA) + AI Search',
  focus: 'GATE 100%',
  notes: [
    'The two favourite exam patterns this week: hand-compute a full MLP forward pass and one k-means iteration.',
    'AI search is hand-simulation: run the algorithm, count expansions, report the path.',
  ],
  milestone: 'MLP forward pass + k-means iteration computed by hand · ML-II quiz 75%+',
  days: [
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'ml', 'ML: LDA & SVM', ['LDA projection; Fisher criterion', 'SVM margins; kernels at concept level']),
      b(S2, 70, 'practice', 'GATE', 'ml', 'Derivations + 15 Problems', ['LDA on a 2-class toy dataset', 'Margin sketches']),
      b(S3, 60, 'practice', 'GATE', 'ai', 'AI: Uninformed Search — BFS, DFS, UCS', ['Hand-simulate: expansion counts, paths', 'Compare completeness & optimality']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'ml', 'ML: Decision Trees + Bias-Variance', ['Impurity: Gini & entropy; splitting rules', 'Bias-variance trade-off reasoning']),
      b(S2, 70, 'practice', 'GATE', 'ml', 'Compute Gini / Info-Gain by Hand ×5', ['Full split evaluation on small tables']),
      b(S3, 60, 'practice', 'GATE', 'ai', 'AI: Best-First & A* — Admissibility & Consistency', ['Trace A* on a weighted graph', 'Admissible vs consistent heuristics (trap)']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'ml', 'ML: Cross-Validation + MLP / Feed-Forward Nets', ['LOO vs k-fold variance claims (trap)', 'Forward-pass computation step by step']),
      b(S2, 70, 'practice', 'GATE', 'ml', 'Hand-Compute One Full MLP Forward Pass', ['Activations, outputs, layer by layer', 'Repeat once cold']),
      b(S3, 60, 'practice', 'GATE', 'ga', 'GA Timed Set + Review', ['15-minute set + review', 'Error-log updates']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'ml', 'ML: k-means, Hierarchical Clustering + PCA', ['k-means iteration; initialisation sensitivity', 'Single vs complete-linkage chain effects', 'PCA: loadings, explained variance, sign conventions']),
      b(S2, 70, 'practice', 'GATE', 'ml', 'Hand-Compute One k-Means Iteration + PCA Ratio', ['Centroids, reassignment, one full loop', 'Explained-variance ratio from eigenvalues']),
      b(S3, 60, 'practice', 'GATE', 'ai', 'AI: Adversarial Search — Minimax + Alpha-Beta', ['Trace with pruning counts; move-ordering effects']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'drill', 'GATE', 'ml', 'PYQ Drill: Clustering / PCA / CV — GATE DA PYQs', ['Solved twice; second pass cold']),
      b(S2, 70, 'review', 'GATE', 'ml', 'Cold Re-Solve + Error Tagging', ['Concept gaps to Saturday']),
      b(S3, 60, 'practice', 'GATE', 'ai', 'AI: Propositional Logic — CNF + Resolution', ['Order-of-operations slips (trap)', '10 conversions']),
      nightCap(),
    ]},
    satTest('ML-II + AI Quiz (20 Q)', ['Classifiers, clustering, PCA, search', 'Exit bar: 15/20'], 'weakest of ML-II / AI'),
    sunday('Stage Week 15: variable-elimination sheet, warehousing one-pager'),
  ],
}

// ── Week 15 ──────────────────────────────────────────────────────────────────
const W15: WeekSpec = {
  week: 15, phase: 3,
  title: 'AI Inference + DBMS Warehousing + Consolidation Test',
  focus: 'GATE 100%',
  notes: [
    'Phase 3 exit gate: the 50-question consolidation test on Saturday covers the full syllabus.',
    'Formula sheets are being frozen this week — 12 pages, handwritten, dated.',
  ],
  milestone: 'Consolidation test (50 Q, full syllabus) done · formula sheets v1 frozen',
  days: [
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'ai', 'AI: Predicate Logic & Unification', ['Most-general-unifier subtleties', 'Conversion discipline']),
      b(S2, 70, 'practice', 'GATE', 'ai', '25 Logic Hand-Simulations', ['Unification + resolution chains']),
      b(S3, 60, 'theory', 'GATE', 'ai', 'AI: Conditional Independence + Variable Elimination', ['Elimination-order effects (trap)', 'Mechanics on a 4-node network']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'ai', 'AI: Sampling — Rejection & Likelihood Weighting', ['Normalisation-constant mistakes (trap)', 'Estimates from samples']),
      b(S2, 70, 'practice', 'GATE', 'ai', '20 Sampling Problems', ['Trace estimates step by step']),
      b(S3, 60, 'theory', 'GATE', 'dbms', 'DBMS: Data Transformation', ['Normalisation, discretisation, sampling, compression', 'GATE-only angle vs NET overlap — your edge']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'GATE', 'dbms', 'DBMS: Warehousing + SQL Refresh', ['Multidimensional schemas, hierarchies, measures', 'Roll-up correctness; SQL aggregates & nesting']),
      b(S2, 70, 'practice', 'GATE', 'dbms', '40 SQL / Relational-Algebra Queries', ['Translate-and-compare under a minute each']),
      b(S3, 60, 'practice', 'GATE', 'dsa', 'DSA: Graph Algorithms by Hand', ['BFS/DFS/Dijkstra on paper', 'Complexity table from memory']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'drill', 'GATE', 'mixed', 'PDSA: GATE-Style Mixed PYQ Set (2024–2026)', ['Output tracing + complexity + algorithms', 'Timed, exam pacing']),
      b(S2, 70, 'review', 'GATE', 'mixed', 'Cold Re-Solve + Error Log', ['Tag every miss']),
      b(S3, 60, 'drill', 'GATE', 'mixed', 'Error-Log Top-10 Patching', ['Recurring offenders re-solved ×5 each type']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'revision', 'GATE', 'mixed', 'Formula-Sheet Cold-Writes: P&S, LA, Calculus', ['From memory, 45 minutes', 'Correct; star gaps for Sunday']),
      b(S2, 70, 'revision', 'GATE', 'mixed', 'Fix Sheets + Consolidation Prep', ['Second-colour corrections', 'Flashcard sweep']),
      b(S3, 60, 'revision', 'GATE', 'mixed', 'Formula Sheets: ML, AI, DBMS', ['Complete the 12-page set', 'Date each page']),
      nightCap(),
    ]},
    { kind: 'saturday', blocks: [
      b('09:00 – 11:30', 150, 'test', 'GATE', 'mixed', 'CONSOLIDATION TEST — 50 Q, Full Syllabus (150 min)', ['Self-made from the week\u2019s material + older topics', 'Phase 3 exit gate — target 38/50']),
      b('11:45 – 13:00', 75, 'review', 'GATE', 'mixed', 'Review + Gap List for Phase 4', ['Every error categorised', 'Top 3 gaps get W16 sectional priority']),
      b(SA3, 75, 'practice', 'GATE', 'mixed', 'Patch the Largest Gap', ['Re-derive + 5 fresh problems']),
      b(SA4, 60, 'admin', 'GATE', 'mixed', 'Phase-4 Planning + Sheets Freeze', ['Mock calendar staged (M1–M6)', 'Formula sheets frozen at v1']),
    ]},
    sunday('Plan Phase 4: sectional order, mock-day template, marks-budget targets'),
  ],
}

// ── Week 16 ──────────────────────────────────────────────────────────────────
const W16: WeekSpec = {
  week: 16, phase: 4,
  title: 'PYQ Block 1 + Sectional Tests S1–S4 (P&S, LA, Calc+GA, PDSA, DBMS)',
  focus: 'GATE 100%',
  notes: [
    'Metric that matters: error categories closed, not questions solved.',
    'Concept errors → morning theory patch; process errors → re-solve the type ×5; judgement errors → Phase-4 mocks.',
  ],
  milestone: 'S1–S4 done · every DA PYQ seen at least once · 85+ sectional average',
  days: [
    { kind: 'weekday', blocks: [
      b(S1, 120, 'drill', 'GATE', 'ps', 'P&S Topic-Wise PYQ: Counting, Bayes, Distributions, CLT, Tests', ['Every PYQ under a realistic time cap', 'Log anything slow, guessed, or wrong']),
      b(S2, 70, 'test', 'GATE', 'ps', 'Sectional S1: Probability & Statistics (timed)', ['Sectional from test series or self-built PYQ compilation', 'Target: 19+/23 scaled']),
      b(S3, 60, 'review', 'GATE', 'ps', 'S1 Review + Error Log', ['Categorise every error', 'Re-solve wrong ones tonight']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'drill', 'GATE', 'la', 'LA Topic-Wise PYQ: SVD, Projections, Quadratic Forms', ['Proof-adjacent questions: what must be true', 'Property implications drilled']),
      b(S2, 70, 'test', 'GATE', 'la', 'Sectional S2: Linear Algebra (timed)', ['Target: 6/7']),
      b(S3, 60, 'review', 'GATE', 'la', 'S2 Review + Error Log', ['Matrix-property traps starred']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'drill', 'GATE', 'calc', 'Calculus + GA Topic-Wise PYQ', ['Maxima/minima end-to-end blends', 'GA mixed sets']),
      b(S2, 70, 'test', 'GATE', 'ga', 'Sectional S7: Calculus + GA (timed)', ['GA full 15-mark set practice', 'Target: Calc 4/5 · GA 13/15']),
      b(S3, 60, 'review', 'GATE', 'ga', 'S7 Review + GA Trap List', ['Two-elimination rule for MCQs']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'drill', 'GATE', 'dsa', 'PDSA Topic-Wise PYQ: Python Tracing, Sorting, Graphs', ['Output semantics: subtle cases', 'Algorithm-by-hand practice']),
      b(S2, 70, 'test', 'GATE', 'dsa', 'Sectional S3: Programming & DSA (timed)', ['Target: 10/12']),
      b(S3, 60, 'review', 'GATE', 'dsa', 'S3 Review + Error Log', ['Code-tracing misses re-solved']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'drill', 'GATE', 'dbms', 'DBMS Topic-Wise PYQ: SQL, Normalisation, Indexing, Warehousing', ['NULL behaviour; bag vs set semantics', 'Indexing fan-out computations']),
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
      b(S1, 120, 'drill', 'GATE', 'ml', 'ML Topic-Wise PYQ: Regression, Classifiers, Bias-Variance, PCA', ['Compute-style questions prioritised', 'Derivations where they pay']),
      b(S2, 70, 'test', 'GATE', 'ml', 'Sectional S5: Machine Learning (timed)', ['Target: 12.5/15']),
      b(S3, 60, 'review', 'GATE', 'ml', 'S5 Review + Error Log', ['Trap ledger: ridge vs subset, LOO variance']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'drill', 'GATE', 'ai', 'AI Topic-Wise PYQ: Search, Logic, Inference', ['Hand-simulations under time cap']),
      b(S2, 70, 'test', 'GATE', 'ai', 'Sectional S6: AI (timed)', ['Target: 7.5/9']),
      b(S3, 60, 'review', 'GATE', 'ai', 'S6 Review + Error Log', ['Pruning-count & CNF slips starred']),
      nightCap(),
    ]},
    mockDay('MOCK 1 — Full Length (9:30 AM)', 'Baseline: full syllabus, exam conditions', 'Time-sink map: which sections ran over; per-section time budget'),
    { kind: 'weekday', blocks: [
      b(S1, 120, 'drill', 'GATE', 'mixed', 'Mock 1 Re-Solve: Every Wrong & Guessed Question', ['From scratch, on paper, clock visible']),
      b(S2, 70, 'drill', 'GATE', 'mixed', 'Judgement-Error Drills', ['Two-elimination rule practice ×20', 'NAT/MSQ harvest habits']),
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
      b('14:00 – 15:30', 90, 'review', 'GATE', 'mixed', 'Mock 6 Review + Strategy Freeze', ['Five final rules to your future self', 'Attempt sequence locked']),
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

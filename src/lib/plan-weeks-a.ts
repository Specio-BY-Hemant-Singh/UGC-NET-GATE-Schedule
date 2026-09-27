// ─────────────────────────────────────────────────────────────────────────────
// Weeks 1–11 · Phase 1 (Coverage Sprint) + Phase 2 (NET PYQ Marathon & Exam)
// Primary track: UGC NET Dec 2026 · GATE math rides the evening parallel slot
// CALIBRATED against: official GATE 2027 DA syllabus (7 sections), official
// UGC NET CS Paper-2 syllabus (10 units), UGC NET Paper-1 syllabus (10 units),
// and GATE DA PYQ papers 2024, 2024-Sample, 2025, 2026 (question-pattern audit).
// ─────────────────────────────────────────────────────────────────────────────
import { BlockSpec, DaySpec, WeekSpec } from './plan-types'

// Phase-1 weekday slots (Mon–Fri, 4.75 h)
const S1 = '06:30 – 08:30' // 120 min · NET theory
const S2 = '19:00 – 20:10' // 70 min · NET drill
const S3 = '20:15 – 20:40' // 25 min · Paper 1 mini-set
const S4 = '20:45 – 21:35' // 50 min · GATE math track
const S5 = '21:40 – 22:00' // 20 min · night cap

// Phase-2 weekday slots (PYQ days, 4.5 h)
const P1 = '06:30 – 08:30' // 120 min · PYQ set
const P2 = '08:45 – 09:45' // 60 min · same-day review
const P4 = '20:45 – 21:20' // 35 min · GATE maintenance
const P5 = '21:25 – 21:55' // 30 min · error-log patching

// Saturday (4.75 h) / Sunday (2.5 h)
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

const nightCap = (): BlockSpec =>
  b(S5, 20, 'admin', 'BOTH', 'mixed', 'Night Cap: Flashcards + Error Log + Plan', [
    'Make flashcards from today\u2019s material (D1 loop)',
    'Log every miss from the drill block with root cause',
    'Write tomorrow\u2019s 3 priorities in 3 lines',
  ])

const satTest = (topic: string, extra: string[]): DaySpec => ({
  kind: 'saturday',
  blocks: [
    b(SA1, 90, 'test', 'BOTH', 'mixed', `Weekly Mixed Test — 40 Q, timed (75 min)`, [topic, 'Closed book, fixed morning time', ...extra]),
    b(SA2, 60, 'review', 'BOTH', 'mixed', 'Test Review + Error Log', ['Re-solve every mistake from scratch', 'Tag: concept / process / judgement', 'Star repeat offenders']),
    b(SA3, 75, 'practice', 'BOTH', 'mixed', 'Deep Dive: Weakest Topic of the Week', ['Re-derive the theory from your own notes', '5 fresh problems on the same sub-topic', 'Exam questions never announce their topic — practise mixed']),
    b(SA4, 60, 'revision', 'BOTH', 'mixed', 'Backlog Patch + Fact-Sheet Expansion', ['Clear whatever slipped during the week', 'Expand unit fact sheets from night-cap material', 'Missed D1/D3 reps roll into this slot']),
  ],
})

const sunday = (planFor: string, swapBlock?: BlockSpec): DaySpec => ({
  kind: 'sunday',
  blocks: [
    b(SU1, 60, 'admin', 'BOTH', 'mixed', 'Error-Log Triage & Re-solve', ['Re-attempt every entry from the past 7 days', 'Only a correct cold re-solve closes an entry']),
    swapBlock ?? b(SU2, 45, 'revision', 'BOTH', 'mixed', 'Flashcard Sweep (D7)', ['Formula-sheet rewrite of the week', 'Full flashcard sweep, oldest material first']),
    b(SU3, 45, 'admin', 'BOTH', 'mixed', 'Plan Next Week', ['Assign topics, PYQ sets and test slots', 'Write one honest risk note + its counter-move', planFor]),
  ],
})

// ── Week 1 ───────────────────────────────────────────────────────────────────
const W1: WeekSpec = {
  week: 1, phase: 1,
  title: 'Launch: DBMS-1 + DSA-1 · GATE Counting (PYQ-Weighted)',
  focus: 'NET 62% · GATE 38%',
  notes: [
    'PYQ audit (GATE DA 2024/25/26): DBMS ≈ 14% and DSA ≈ 12% of technical marks — both are dual-credit with NET U4/U7. Counting ≈ 4–6 marks in every GATE DA paper.',
    'NET is the primary track until mid-December; GATE math rides the 20:45 slot daily.',
    'Start the error log today — one row per mistake, filled the same day it happened.',
  ],
  milestone: 'Mixed 40-Q test at 70%+ · SQL drill set solved under 25 min',
  days: [
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'dbms', 'DBMS: ER Model & Relational Model (U4)', ['ER modelling: entities, attributes, keys, multivalued attributes', 'Integrity constraints: entity, referential (FK-safe operations), domain', 'Three-schema architecture & data independence; Codd rules']),
      b(S2, 70, 'drill', 'NET', 'dbms', 'Drill: ER → Relational Mapping', ['Min-relations counting: 1:1 / 1:N / M:N + multivalued (GATE DA 26-Q61 archetype)', '15 unit-mapped MCQs under a time cap']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Data Interpretation (U-VII)', ['10 timed questions (25-min cap)', 'Bar/pie/table charts, ratios & percentages', 'Read stems before the data']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Counting — Permutations & Combinations', ['Linear/circular arrangements, repetition cases', 'Digits-with-constraints problems (GATE 24-Q3 archetype)', 'Case-analysis method for GATE-style problems']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'dbms', 'Relational Algebra, Calculus & SQL Joins (U4)', ['RA: σ, π, ⋈, ÷ (division = "for-all" queries)', 'Tuple calculus ∃/∀ forms; bag vs set semantics', 'SQL: joins, GROUP BY, HAVING, correlated subqueries']),
      b(S2, 70, 'drill', 'NET', 'dbms', 'Drill: RA → SQL Translation', ['10 translation queries incl. one division query', 'Time each under 3 minutes']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Logical Reasoning (U-VI)', ['10 timed questions', 'Series, syllogisms, Venn-diagram validity']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Stars & Bars + Integer Solutions', ['Non-negative vs positive solutions (GATE 26-Q20 archetype)', 'Counting subsets with parity/product constraints (26-Q19 style)', 'Bijections & involutions f(f(n))=n (26-Q33 style)']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'dbms', 'SQL Deep: Nesting, Views, NULLs', ['Nested + correlated subqueries (GATE DA 26-Q60 / 25-Q33 archetypes)', 'NOT EXISTS "all-employees" pattern (24-Sample-Q55)', 'NULL behaviour in comparisons, aggregates, FK columns']),
      b(S2, 70, 'drill', 'NET', 'dbms', 'SQL Output Drill (Exit Milestone)', ['15 output-prediction questions, full set < 25 min', 'Row-count questions: predict before executing']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Reading Comprehension (U-III)', ['2 timed passages', 'Answers live in the text, not in inference']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Inclusion–Exclusion & Pigeonhole', ['Inclusion-exclusion for 2–3 sets; derangements', 'Pigeonhole with worst-case reasoning', 'Divisibility counting (4-digit multiples of 3, 24-Q3 style)']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'dsa', 'Complexity, Recurrences + Arrays & Linked Lists (U7)', ['Asymptotics O/Ω/Θ; master method; recursion-tree', 'Arrays, sparse matrices, singly/doubly linked lists', 'Counting function calls in recursion (26-Q39 archetype)']),
      b(S2, 70, 'drill', 'NET', 'dsa', 'Drill: Complexity + Recursion Tracing', ['15 questions: complexity + output tracing', 'Count total calls/stack activations for small recursions']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: ICT (U-VIII)', ['10 timed questions', 'Abbreviations, internet basics, digital initiatives']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Probability Axioms, Conditional & Independence', ['Sample space, axioms; B⊂A conditional bounds (24-Sample-Q9)', 'Independent vs mutually exclusive (24-Q12 coins)', 'Tree diagrams before formulas — always']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'dsa', 'Stacks, Queues + Sorting & Searching (U7)', ['Stacks, queues, deques, priority queues (24-Q32 deque trace)', 'Selection/bubble/insertion sort: comparison & swap counts (26-Q49)', 'Binary search: max comparisons, F(n)=F(⌊n/2⌋)+1 (26-Q31/24-Q40)']),
      b(S2, 70, 'drill', 'NET', 'dsa', 'Drill: Hand-Simulate Every Sort', ['Trace each sort on a 7-element array; count swaps = inversions', '15 MCQs on outputs, stability, pass counts']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Teaching Aptitude (U-I)', ['10 timed questions', 'Learner characteristics, teaching methods, evaluation systems']),
      b(S4, 50, 'practice', 'GATE', 'ps', 'P&S: Counting Problem Set', ['25 counting problems, notes closed', 'Include 2 stars-and-bars + 1 inclusion-exclusion per set', 'Mark the slow ones for Saturday']),
      nightCap(),
    ]},
    satTest('Everything so far: DBMS, DSA, counting & probability basics', ['Target 70%+ (exit milestone)']),
    sunday('Stage Week 2 materials: DBMS-2 + DSA-2 notes, Bayes problem set',
      b(SU2, 45, 'admin', 'NET', 'p1', 'Full Exam Map Walkthrough (30 min)', ['Read the 10-unit NET P2 syllabus top to bottom + all 10 P1 units', 'Mark comfort level per unit: known / shaky / unknown', 'Keep this map — it feeds Sunday audits all campaign'])),
  ],
}

// ── Week 2 ───────────────────────────────────────────────────────────────────
const W2: WeekSpec = {
  week: 2, phase: 1,
  title: 'DBMS-2 (FDs, Normalisation, Indexing) + DSA-2 (Trees, Hashing, Graphs) · GATE Bayes',
  focus: 'NET 62% · GATE 38%',
  notes: [
    'PYQ audit: candidate-keys-from-FDs, B+ tree order/insertion and hashing placements appear in ALL three GATE DA papers — this week is pure mark-farming for both exams.',
    'Every theory hour carries a same-day MCQ tax; the 19:00 block exists for exactly that.',
  ],
  milestone: 'Normalisation speed drill: 3 problems in 20 min · 40-Q test at 70%+',
  days: [
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'dbms', 'Functional Dependencies & Normalisation (U4)', ['FDs, attribute closure, minimal cover', '1NF→2NF→3NF→BCNF; lossless join & dependency preservation', 'Candidate keys from FD sets (26-Q17 / 25-Q57 archetype); superkey counting (24-Sample-Q41)']),
      b(S2, 70, 'drill', 'NET', 'dbms', 'Normalisation Speed Drill', ['3 full normalisation problems in 20 min (exit milestone)', '10 MCQs on normal forms incl. BCNF↔3NF implications']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Data Interpretation (U-VII)', ['10 timed questions', 'Growth rates, averages, ratio traps']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Joint, Marginal & Conditional', ['Joint distributions from tables; marginalisation', 'E[E[X|Y]]=E[X] tower rule (25-Q11)', 'Conditional pdf E[Y|X=x] with bounded support (24-Q59)']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'dbms', 'Transactions, Concurrency & Recovery (U4)', ['ACID; schedules; 2PL; conflict serializability + precedence graphs', 'Deadlock: prevention/avoidance/detection; logs & recovery', 'Indexing: B/B+ tree order = ⌊block/(ptr+key)⌋, min height (26-Q32, 24-Sample-Q40)']),
      b(S2, 70, 'drill', 'NET', 'dbms', 'Drill: Serializability + B+ Tree Order', ['Draw precedence graphs for 3 schedules', '3 B+ tree order/height computations + 1 insertion split (26-Q41)']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Mathematical Reasoning (U-V)', ['10 timed questions', 'Fractions, time-distance, ratio, interest, averages']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Bayes Theorem Mastery', ['Disease-test numericals with priors (26-Q57)', 'Multi-box partition problems (25-Q31)', 'Prior vs likelihood discipline — the classic trap']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'dsa', 'Trees: Binary, BST, Heaps (U7)', ['Traversals; unique reconstruction from pre+in (26-Q25); full-binary pre+post (24-Q28)', 'BST operations; heap insert/extract; threaded trees', 'Node-count bounds: H,I,L,N inequalities (24-Q52)']),
      b(S2, 70, 'drill', 'NET', 'dsa', 'Drill: Build the Tree, Then Count', ['5 trees built from traversal pairs; write post-order each time', '10 heap-operation MCQs']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Communication (U-IV)', ['10 timed questions', 'Barriers, mass-media, classroom communication']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Random Variables — pmf/pdf Discipline', ['CDF properties: non-decreasing, right-continuous, jumps (26-Q54)', 'Finding t from a median/piecewise CDF (25-Q19)', 'P(g(X)≤c) via CDF regions (25-Q39)']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'dsa', 'Hashing + Graphs I: Traversals & Topology (U7)', ['Hash functions, linear probing placements (25-Q18), open-addressing probes 1/(1−α) (24-Q21)', 'BFS/DFS edge types: tree/back/cross (24-Q14); discovery ordering with adjacency order (25-Q65)', 'Topological sort valid orders (24-Q51); BFS unique orderings (24-Sample-Q52)']),
      b(S2, 70, 'drill', 'NET', 'dsa', 'Drill: Hash-Insert + Graph Traces', ['Insert 6 keys into a size-10 table, record final indices', 'DFS on a directed graph with given adjacency order — count discoveries']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Logical Reasoning (U-VI)', ['10 timed questions', 'Analogies, fallacies, square of opposition']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Expectation & Variance Mechanics', ['Linearity; E[ab] only with independence', 'Variance of transformations: Var((2X−1)Y) (26-Q44)', 'Sample-mean updates on new data points (24-Q34)']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'dsa', 'Graphs II: Shortest Paths, MST + Stacks/Queues Reprise (U7)', ['Dijkstra/Bellman-Ford intuition; MST: Prim/Kruskal', 'Shortest-path non-edge reasoning (25-Q58 style)', 'Queue/stack pseudocode traces (25-Q64 flag-and-pop pattern)']),
      b(S2, 70, 'drill', 'NET', 'dsa', 'Drill: Graph Algorithm Hand-Runs', ['Run Dijkstra + Prim on one 6-node graph', 'Which edges CANNOT exist given shortest paths? ×5']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Research Aptitude (U-II)', ['10 timed questions', 'Research types, steps, ethics, ICT in research']),
      b(S4, 50, 'practice', 'GATE', 'ps', 'P&S: Bayes + RV Mixed Set (25 problems)', ['Closed book, timed', 'Mark the slow ones for Saturday']),
      nightCap(),
    ]},
    satTest('DBMS-2 (normalisation, indexing, transactions) + DSA-2 (trees, hashing, graphs) + Bayes/RVs', ['Target 70%+']),
    sunday('Stage Week 3: OS complete notes + DP/graph-algo problem bank',
      b(SU2, 45, 'revision', 'NET', 'p1', 'Paper 1 Deep Dive: Indian Logic — Pramanas', ['Pratyaksha, Anumana, Upamana, Shabda, Arthapatti, Anupalabddhi', 'Hetvabhasas (fallacies of inference); Vyapti', 'One-page Pramana card — NET P1 asks this every cycle'])),
  ],
}

// ── Week 3 ───────────────────────────────────────────────────────────────────
const W3: WeekSpec = {
  week: 3, phase: 1,
  title: 'OS Complete + DSA-3 (DP & Design Techniques) · GATE Discrete Random Variables',
  focus: 'NET 62% · GATE 38%',
  notes: [
    'OS (NET U5) is NET-only credit — a full unit in one week is realistic: it is highly definitional in NET papers.',
    'GATE DA PYQ audit: discrete distributions (Bernoulli/binomial/Poisson/geometric) + CLT = ~6–8 marks per paper.',
  ],
  milestone: 'Phase checkpoint: 60-Q across 4 units at 65%+ · rank units by accuracy',
  days: [
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'os', 'OS: Processes, Threads & CPU Scheduling (U5)', ['System calls, process states, IPC client–server', 'Threads: user/kernel models, multicore issues', 'Scheduling: FCFS/SJF/RR/priority — compute avg waiting & turnaround']),
      b(S2, 70, 'drill', 'NET', 'os', 'Drill: Gantt Charts & Scheduling Numericals', ['4 schedulers on the same arrival set', '15 MCQs: context switch, dispatcher, schedulability']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Data Interpretation (U-VII)', ['10 timed questions', 'Mixed chart types; unit traps']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Bernoulli, Binomial & Geometric', ['Bernoulli/binomial: E, Var, indicator tricks (25-Q54 p̂)', 'Geometric from floor-of-exponential (25-Q41 archetype)', 'Memoryless property intuition before formulas']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'os', 'OS: Synchronization & Deadlocks (U5)', ['Critical section, Peterson, semaphores, monitors', 'Producer-consumer/reader-writer patterns; deadlock quadruple', 'Banker\u2019s algorithm by hand']),
      b(S2, 70, 'drill', 'NET', 'os', 'Drill: Semaphore Traces + Banker', ['Trace 3 semaphore sequences; find safe sequence ×2', '15 MCQs: race conditions, mutex vs binary semaphore']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Reasoning (U-V/VI)', ['10 timed questions', 'Mixed mathematical + logical reasoning']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Poisson & the e-Limits', ['Poisson pmf; limit of e^(−n)Σn^k/k! type (26-Q45)', 'Poisson scaling: thinning & superposition', 'Mixed discrete problem set ×15']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'os', 'OS: Memory Management (U5)', ['Contiguous allocation, fragmentation; paging: address split, EAT', 'Demand paging, page replacement (FIFO/LRU/optimal) by hand', 'Segmentation, thrashing, working set']),
      b(S2, 70, 'drill', 'NET', 'os', 'Drill: Page Replacement + Address Translation', ['Same reference string under FIFO/LRU/optimal', '15 MCQs: EAT, TLB, fragmentation arithmetic']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Reading Comprehension (U-III)', ['2 timed passages', 'Precision answering: text-bound claims only']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Sum & Product Rules for RVs', ['Sums of iid RVs; mgf intuition (no deep theory needed)', 'Expectation of geometric sums Σ2^−i 3^−j (26-Q35 style)', 'Conditional expectation in game/retry problems']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'os', 'OS: Storage, Files, I/O, Security, VM + Linux/Windows (U5)', ['Disk scheduling (SSTF/SCAN/C-SCAN) by hand; RAID levels', 'File allocation, free-space, directory implementation', 'Access matrix, program/system threats; hypervisor types; Linux kernel modules']),
      b(S2, 70, 'drill', 'NET', 'os', 'Drill: Disk Scheduling + Security Recall', ['Same queue under 4 schedulers; compare seek distances', '25 MCQs: security, VM, Linux/Windows facts']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: ICT (U-VIII)', ['10 timed questions', 'E-governance, video-conferencing, SWAYam/MOOCs']),
      b(S4, 50, 'theory', 'GATE', 'dsa', 'DSA: Divide & Conquer + Recurrences (U7/GATE S4)', ['Mergesort/quicksort: partition counts, first/last pivot traces (26-Q15)', 'Master method + cases; T(n)=T(n/2)+c vs 2T(n/2)+c discrimination', 'Lower bounds: comparison-tree argument for sorting']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'dsa', 'DSA: DP, Greedy, Backtracking, Branch & Bound (U7)', ['DP: LCS, knapsack, matrix chain — build tables by hand', 'Greedy proofs of exchange argument (interval scheduling)', 'Backtracking vs B&B: state-space trees']),
      b(S2, 70, 'drill', 'NET', 'dsa', 'Drill: DP Table + Greedy Trace', ['LCS table on 5×5 strings; 0/1 knapsack table', '15 MCQs: technique-to-problem matching']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Teaching Aptitude (U-I)', ['10 timed questions', 'Levels of teaching, evaluation in CBCS']),
      b(S4, 50, 'practice', 'GATE', 'ps', 'P&S: Discrete RV Problem Set (25)', ['Binomial/Poisson/geometric mixed, closed book', 'Flag slow ones for Saturday']),
      nightCap(),
    ]},
    satTest('OS (complete) + DSA-3 (DP/greedy) + discrete RVs', ['Phase checkpoint: 60-Q, 4 units, 65%+']),
    sunday('Stage Week 4: TOC-1 + COA-1 notes, continuous-RV formula sheet',
      b(SU2, 45, 'revision', 'NET', 'p1', 'Paper 1 Deep Dive: DI Technique Lab', ['Approximation & percentage-fraction conversion table', 'Two full DI sets with per-question timing log'])),
  ],
}

// ── Week 4 ───────────────────────────────────────────────────────────────────
const W4: WeekSpec = {
  week: 4, phase: 1,
  title: 'TOC-1 (Regular + CFL) + COA-1 (Logic & datapath) · GATE Continuous Random Variables',
  focus: 'NET 62% · GATE 38%',
  notes: [
    'TOC (NET U8) rewards exact constructions: NET asks DFA/PDA grammar questions; GATE DA rarely does — bank it for NET, keep GATE slot on continuous distributions (~8 marks/paper).',
    'Bayes & counting drill Saturday target: 80% — these repeat every GATE DA paper.',
  ],
  milestone: 'Bayes & counting drill at 80% · 40-Q test at 65%+',
  days: [
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'toc', 'TOC: Regular Languages (U8)', ['DFA/NFA/ε-NFA; subset construction; regex ⇄ automata', 'Pumping lemma: prove non-regularity ×2 by hand', 'Closure properties; Myhill-Nerode idea; lexical analysis link']),
      b(S2, 70, 'drill', 'NET', 'toc', 'Drill: DFA Design & Pumping', ['Design DFAs for 4 languages; convert 1 NFA', '15 MCQs: closure, decidability of regular questions']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Data Interpretation (U-VII)', ['10 timed questions', 'Keep the daily unbroken streak']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Uniform & Exponential', ['Uniform: area computations P(X≥Y) geometry (24-Q56)', 'Exponential: memoryless P(X>s+t|X>s)=P(X>t) (26-Q34, 25-Q21)', 'λ from E/Var relations: 5E(X)=Var(X) (24-Q57)']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'toc', 'TOC: Context-Free Languages (U8)', ['CFG derivations, parse trees; ambiguity detection', 'CNF & GNF conversions; closure properties of CFL', 'PDA/NPDA: accept-by-final-state vs empty-stack']),
      b(S2, 70, 'drill', 'NET', 'toc', 'Drill: CFG ⇄ PDA + Normal Forms', ['Write CFG for 3 languages; convert 1 to CNF', '15 MCQs: ambiguity, inherent ambiguity, CFL closures']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Communication (U-IV)', ['10 timed questions', 'Verbal/non-verbal, intercultural, classroom']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Normal & Standardisation', ['Normal CDF/complement discipline (24-Q11 facts)', 'X=aZ+b: recover a,b from E, E[(X−EX)Z], Var (25-Q20)', 't₁ vs Normal density/CDF ordering (26-Q28)']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'coa', 'COA: Digital Logic & Data Representation (U2)', ['Gates, K-maps, combinational: adders/decoders/MUX', 'Flip-flops, counters, registers; number systems & complements', 'IEEE-754 idea; error-detection codes; arithmetic algorithms']),
      b(S2, 70, 'drill', 'NET', 'coa', 'Drill: K-maps + Number Conversions', ['Simplify 3 four-variable K-maps', '15 MCQs: 1\u2019s/2\u2019s complement, range, overflow']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Reasoning (U-V)', ['10 timed questions', 'Number/letter series, codes, relationships']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Joint Distributions & Correlation', ['Joint pdf with triangular support; E[Y|X=x] (24-Q59)', 'Correlation of conditional-uniform construction (26-Q63)', 'Covariance of Bernoulli indicators (24-Q65)']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'coa', 'COA: Basic Organization, Micro-ops, Control (U2)', ['RTL, bus & memory transfers; instruction cycle + interrupts', 'Microprogrammed control: address sequencing', 'Assembler passes, program loops, subroutines (basic computer)']),
      b(S2, 70, 'drill', 'NET', 'coa', 'Drill: Instruction Cycle Trace', ['Trace fetch-decode-execute for 3 instructions', '20 recall MCQs: registers, timing, I/O programming']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Logical Reasoning (U-VI)', ['10 timed questions', 'Structure of arguments, mood & figure']),
      b(S4, 50, 'practice', 'GATE', 'ps', 'P&S: Continuous RV Problem Set (25)', ['Uniform/exponential/normal mixed', 'Memoryless ×5 at minimum']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'toc', 'TOC: Revision Bridge + Regex Engineering (U8)', ['Regular vs CFL boundary: which pump works where', 'Regex↔DFA speed runs', '20 mixed TOC MCQs under time cap']),
      b(S2, 70, 'drill', 'NET', 'toc', 'Drill: TOC Timed Set (Exit)', ['25 Q, 45 min', 'Below 70% → re-derive closures table tonight']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: People & Environment (U-IX)', ['10 timed questions', 'Pollutants, SDGs, energy resources']),
      b(S4, 50, 'drill', 'GATE', 'ps', 'P&S: Bayes + Counting Recap Set', ['15 Bayes problems, timed', 'Counting recap ×10 (stars-bars/inclusion-exclusion)']),
      nightCap(),
    ]},
    satTest('TOC-1, COA-1, continuous random variables', ['Target 65%+']),
    sunday('Stage Week 5: Discrete-1 + COA-2 notes; inference one-pager',
      b(SU2, 45, 'revision', 'GATE', 'ps', 'P&S Formula Sheet v1 (cold-write)', ['Write distributions/expectations/CDF facts from memory', 'Correct in second colour; star gaps'])),
  ],
}

// ── Week 5 ───────────────────────────────────────────────────────────────────
const W5: WeekSpec = {
  week: 5, phase: 1,
  title: 'Discrete Structures + COA-2 (Pipeline & Memory) · GATE CLT, Estimation & Tests',
  focus: 'NET 62% · GATE 38%',
  notes: [
    'PYQ audit: CLT, chi-square identities, sample-mean/proportion behaviour and test selection = recurring GATE DA marks (25-Q40, 26-Q53, 24-Sample-Q53).',
    'NET U1 discrete structures is 10 questions of easy-to-medium recall — highest ROI unit of the NET-only set.',
  ],
  milestone: 'CLT/hypothesis problem set at 80% · 40-Q test at 65%+',
  days: [
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'disc', 'Discrete: Logic, Sets & Relations (U1)', ['Propositional equivalences, normal forms, inference rules', 'Predicates & quantifiers; nested-quantifier translation traps', 'Relations: properties, equivalence classes, partial orders; Hasse diagrams']),
      b(S2, 70, 'drill', 'NET', 'disc', 'Drill: Tautologies & Equivalences', ['Truth-table speed runs; which are tautologies (24-Q29 style)', '15 MCQs: relation properties, poset identification']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Teaching Aptitude (U-I)', ['10 timed questions', 'Off-line vs on-line methods; ICT-based support']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: CLT & Sampling Distributions', ['CLT: standardise then read Φ (25-Q40 Bernoulli-CLT)', 'Sampling distribution of the mean; √n X̄ facts', 'Chi-square identities: ΣXi²~χ²(n), Σ(Xi−X̄)²~χ²(n−1) (26-Q53)']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'disc', 'Discrete: Counting, Induction & Probability (U1)', ['Permutations/combinations with constraints; inclusion–exclusion', 'Pigeonhole; induction proofs ×2', 'Bayes + discrete probability (doubles as GATE revision)']),
      b(S2, 70, 'drill', 'NET', 'disc', 'Drill: Counting Sprint', ['20 mixed counting problems, 2 minutes each', 'GATE-style subset-product & integer-solutions variants']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Data Interpretation (U-VII)', ['10 timed questions', 'Two-chart cross-reading']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Estimation — Bias, MLE, Consistency', ['Sample variance unbiased vs MLE of σ² (24-Sample-Q53)', 'MLE for Bernoulli/exponential by differentiation', 'E[p̂]=p, Var(p̂)→0 as n grows (25-Q54)']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'disc', 'Discrete: Graph Theory + Boolean Algebra (U1)', ['Walks/paths/circuits; Euler vs Hamiltonian; planarity', 'Graph colouring; bipartite; trees, prefix codes, cut-sets', 'Boolean function representation & simplification']),
      b(S2, 70, 'drill', 'NET', 'disc', 'Drill: Graph Facts + Colouring', ['Colour two graphs minimally (24-Q2 GA-style)', '15 MCQs: Euler/Hamilton conditions, spanning trees']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Reading Comprehension (U-III)', ['2 timed passages']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Hypothesis Testing — z, t, χ²', ['Which test when: sample size & variance knowledge', 'Goodness-of-fit & independence for χ²', 'Confidence intervals: build & interpret ×5']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'coa', 'COA: Pipelining, Memory Hierarchy & Multiprocessors (U2)', ['Pipeline stages, hazards, speedup; vector/array processors', 'Cache: mapping, hit ratio, EAT; virtual memory & MMU', 'Multiprocessors: interconnection, arbitration, cache coherence']),
      b(S2, 70, 'drill', 'NET', 'coa', 'Drill: Pipeline Speedup + Cache EAT', ['5 speedup computations; 5 EAT with hit ratios', '20 MCQs: coherence protocols, vector processing']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Research Aptitude (U-II)', ['10 timed questions', 'Positivism vs post-positivism; referencing styles']),
      b(S4, 50, 'practice', 'GATE', 'ps', 'P&S: CLT + Tests Problem Set (25)', ['CLT approximations, test selection, CI builds', 'Exit bar: 80%']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'disc', 'Discrete: Group Theory + LP/PERT (U1)', ['Groups, subgroups, Lagrange; homomorphism/isomorphism', 'Rings, integral domains, fields — classify structures', 'PERT-CPM: critical path & slack by hand (NET favourite)']),
      b(S2, 70, 'drill', 'NET', 'disc', 'Drill: Algebra Structures + Critical Path', ['Classify 6 structures (group/ring/field)', 'One PERT network: ES/EF/LS/LF, critical path']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Higher Education (U-X)', ['10 timed questions', 'Ancient institutions, post-independence evolution, policies']),
      b(S4, 50, 'drill', 'GATE', 'ps', 'P&S: Inference Mixed Timed Set', ['20 Q, 35 min: CLT/tests/estimation mixed', 'Every miss → error log with root cause']),
      nightCap(),
    ]},
    satTest('Discrete structures, COA-2, CLT/estimation/tests', ['Target 65%+']),
    sunday('Stage Week 6: PL & Graphics + TOC-2 notes; LA-I kit',
      b(SU2, 45, 'revision', 'GATE', 'ps', 'P&S Sheet v2 + Distribution Decision Tree', ['One flowchart: which distribution/test applies?', 'Cold-write, correct, keep for mock mornings'])),
  ],
}

// ── Week 6 ───────────────────────────────────────────────────────────────────
const W6: WeekSpec = {
  week: 6, phase: 1,
  title: 'Prog. Languages & Graphics + TOC-2 (TM & Compilers) · GATE Linear Algebra I',
  focus: 'NET 58% · GATE 42%',
  notes: [
    'NET U3/U8 finish here; GATE evenings begin Linear Algebra — PYQ audit shows ~7–8 LA questions per GATE DA paper (≈12%).',
    'Parse-table drill and TM constructions are NET staples: practise by construction, not by reading.',
  ],
  milestone: 'Parse-table drill done · TM construction ×2 · 40-Q 65%+ · LinAlg I quiz',
  days: [
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'plg', 'PL: C, C++, OOP & Translation (U3)', ['C: pointers, arrays, functions, files, preprocessor', 'C++: classes, virtual functions, templates, exceptions', 'Paradigms; binding times; compiler vs interpreter; loaders/linkers']),
      b(S2, 70, 'drill', 'NET', 'plg', 'Drill: C/C++ Output Tracing', ['10 pointer/struct traces', '15 MCQs: OOP pillars, virtual dispatch, storage classes']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: DI (U-VII)', ['10 timed questions']),
      b(S4, 50, 'theory', 'GATE', 'la', 'LA-I: Vectors, Rank & Systems', ['Rank-nullity; Gaussian elimination complexity (25-Q12)', 'Consistency by pivot counts: unique/none/infinite (24-Q48, 25-Q13)', 'Subspace tests: span vs constraints (24-Q47)']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'plg', 'Graphics: Algorithms, Transforms, Curves (U3)', ['Line/circle algorithms; scan-line fill; clipping (Cohen–Sutherland)', '2D/3D transforms & homogeneous matrices', 'Bezier/B-spline control points; illumination basics']),
      b(S2, 70, 'drill', 'NET', 'plg', 'Drill: Transform Matrices & Fill', ['Write rotation/scale/translate matrices; compose two', '15 MCQs: algorithms, visibility, spline properties']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Communication (U-IV)', ['10 timed questions']),
      b(S4, 50, 'theory', 'GATE', 'la', 'LA-I: Matrices, Eigen & Diagonalisation', ['Eigen pipeline: det(A−λI); trace = Σλ, det = Πλ (24-Sample-Q25)', 'Rotation periodicity: M^2026 via θ=2π/5 (26-Q21)', 'Trace condition puzzles: Σγ=1+√2 (26-Q46)']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'toc', 'TOC: Turing Machines & Undecidability (U8)', ['TM variants; universal TM; Church-Turing thesis', 'Recursive vs RE languages; Chomsky hierarchy placement', 'Halting problem, PCP, Rice\u2019s idea; diagonalisation']),
      b(S2, 70, 'drill', 'NET', 'toc', 'Drill: TM Constructions + Decidability', ['Build TMs for 2 simple languages', '15 MCQs: decidability table, hierarchy inclusions']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Logical Reasoning (U-VI)', ['10 timed questions', 'Pramanas quick-recall (card from W2)']),
      b(S4, 50, 'theory', 'GATE', 'la', 'LA-I: Orthogonality, Gram & Definiteness', ['Orthonormal sets ⇒ independent (25-Q25); Gram matrix Aij=xiᵀxj PD (25-Q38)', 'Orthogonal matrix: |Ax|=|x| ⇒ eigenvalues ±1 (25-Q52)', 'Quadratic forms & leading minors vs eigenvalues']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'toc', 'Compilers: Parsing & Semantic Analysis (U8)', ['Top-down: LL(1) table construction, FIRST/FOLLOW', 'Bottom-up: LR/LALR item sets; shift-reduce conflicts', 'SDD/SDT: S-attributed vs L-attributed; type checking']),
      b(S2, 70, 'drill', 'NET', 'toc', 'Drill: Parse Tables (Exit Milestone)', ['Build LL(1) table for one grammar; spot conflicts in another', '15 MCQs: phases of compiler, intermediate forms']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: ICT (U-VIII)', ['10 timed questions']),
      b(S4, 50, 'practice', 'GATE', 'la', 'LA-I: Eigen & Rank Problem Set (20)', ['Eigen/det/trace mix', 'Consistency ×5; subspaces ×5']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'plg', 'Web Tech + Intermediate Code & Optimization (U3/U8)', ['HTML/XML/scripting; servlets/applets (recall level)', 'Three-address code; activation records; parameter passing', 'Loop & peephole optimization; symbol tables']),
      b(S2, 70, 'drill', 'NET', 'mixed', 'Drill: PL + Compiler Mixed Set', ['25 MCQs across U3 remainder + U8 tail', 'Everything ≥ recall speed: 60 seconds each']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Teaching Aptitude (U-I)', ['10 timed questions']),
      b(S4, 50, 'test', 'GATE', 'la', 'LinAlg I Consolidation Quiz (20 Q)', ['Exit bar: 16/20', 'Eigen/rank/consistency/definiteness mixed']),
      nightCap(),
    ]},
    satTest('PL & Graphics, TOC-2/Compilers, Linear Algebra I', ['Target 65%+']),
    sunday('Stage Week 7: Networks + SE + AI sweep kit; LA-II sheet',
      b(SU2, 45, 'revision', 'NET', 'p1', 'Paper 1 Deep Dive: Environment — Acts & Protocols', ['EP Act 1986, NAPCC, Montreal/Kyoto/Paris, Rio, CBD, ISA', 'Timeline card + one-liner bank'])),
  ],
}

// ── Week 7 ───────────────────────────────────────────────────────────────────
const W7: WeekSpec = {
  week: 7, phase: 1,
  title: 'Networks + SE + AI Sweep · GATE Linear Algebra II · NET Baseline Mock',
  focus: 'NET 58% · GATE 42%',
  notes: [
    'Coverage completes this week: 100% of the NET syllabus touched at least once.',
    'LA-II focuses on the projection-matrix family — 2024/25/26 papers each carried 2–3 such questions (M=In−11ᵀ/n, Rayleigh quotient, uuᵀ).',
    'Saturday is the full-syllabus baseline mock — its score calibrates every Phase 2 decision.',
  ],
  milestone: 'Baseline mock (100 Q, timed) recorded · every unit touched at least once',
  days: [
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'net', 'Networks-1: Fundamentals & Data Link (U9)', ['Transmission modes; Nyquist & Shannon capacity', 'Encoding, modulation, multiplexing (FDMA/TDMA/CDMA)', 'Error control: CRC/checksum/Hamming; sliding window GBN/SR; HDLC; CSMA-CD vs CA']),
      b(S2, 70, 'drill', 'NET', 'net', 'Drill: Capacity & Window Numericals', ['10 Nyquist/Shannon computations', '5 sliding-window efficiency problems']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: DI (U-VII)', ['10 timed questions']),
      b(S4, 50, 'theory', 'GATE', 'la', 'LA-II: Projection Matrices', ['P²=P ⇒ eigen 0/1, trace = rank (26-Q52, 24-Sample-Q49)', 'M = In − (1/n)11ᵀ: symmetric, idempotent, trace n−1 (26-Q52/Q65)', 'Projection onto orthonormal span: A = Σxixiᵀ (25-Q50)']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'net', 'Networks-2: IP, Transport, Security & Mobile (U9)', ['IPv4 classful/classless + subnetting; IPv6; fragmentation; ARP', 'TCP/UDP/SCTP: flow, error, congestion; ports table', 'Crypto: DES/AES/RSA, signatures, VPN, firewalls; GSM/CDMA, mobile IP; cloud SaaS/PaaS/IaaS; IoT']),
      b(S2, 70, 'drill', 'NET', 'net', 'Drill: The Subnetting Ritual', ['20-problem subnetting drill — reflex speed', 'Port-table flashcards: 15 protocols']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Reasoning (U-V/VI)', ['10 timed questions', 'Puzzles under 90 seconds each']),
      b(S4, 50, 'theory', 'GATE', 'la', 'LA-II: In+xx\u1D40 Family & Rayleigh Quotient', ['Eigen of In+xx\u1D40 with x\u1D40x=1 (25-Q28)', 'max x\u1D40Ax over \u2016x\u2016=1 equals \u03BBmax (26-Q65, 24-Sample-Q65)', 'Determinant/rank consequences; A\u207B\u00B9 eigenvalue signs']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'se', 'Software Engineering (U6)', ['Process models: waterfall → agile family (XP, Scrum, DSDM, FDD, Crystal)', 'Requirements & SRS; cohesion/coupling ordering; architectural patterns', 'McCall & ISO 9126; LOC/FP estimation; COCOMO organic/semi/embedded', 'Testing: V&V, cyclomatic complexity, white/black box, alpha/beta, regression; SCM & reverse engineering']),
      b(S2, 70, 'drill', 'NET', 'se', 'Drill: SE Recall + COCOMO', ['30 MCQs — pure recall unit', '5 COCOMO effort computations by hand']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Comprehension (U-III)', ['2 timed passages', 'Accuracy over speed — exam approaches']),
      b(S4, 50, 'theory', 'GATE', 'la', 'LA-II: SVD & Singular Values', ['\u03C3\u1D62 = \u221Aeigen(A\u1D40A); \u03C3 of uu\u1D40 = \u2016u\u2016\u00B2 (24-Q61)', 'SVD vs eigenvalue trap; singular vectors are orthogonal', 'Rank = count of non-zero \u03C3; spectral norm = \u03C3max']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'ai', 'Artificial Intelligence (NET U10)', ['Agents; state-space search: BFS/DFS/best-first/A* + admissibility', 'Minimax & alpha-beta with pruning counts; hill-climbing failure modes', 'KR: logic, semantic nets, frames, scripts; expert systems; uncertainty handling', 'Planning STRIPS; NLP parsing; fuzzy sets & inference; GA cycle; perceptron/MLP/SOM/Hopfield']),
      b(S2, 70, 'drill', 'NET', 'ai', 'Drill: Search & Logic Hand-Simulation', ['Minimax + alpha-beta trace on a game tree', 'Fuzzy set operations; GA pipeline ordering quiz']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: ICT (U-VIII)', ['10 timed questions', 'ICT two-pager condensed — final version']),
      b(S4, 50, 'practice', 'GATE', 'la', 'LA-II: SVD & Projection Problem Set', ['20 problems: SVD, projections, partition matrices', 'Time each — max 4 minutes']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'revision', 'NET', 'mixed', 'Full-Syllabus Sweep + Fact-Sheet Cold-Writes', ['Sweep all 10 units from fact sheets only', 'Cold-write 3 weakest fact sheets from memory', 'Corrections in second colour = weekend targets']),
      b(S2, 70, 'drill', 'NET', 'mixed', 'Mixed 30-Q Timed Set', ['All units, exam pacing', 'Zero-blank habit: answer everything']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Teaching Aptitude (U-I)', ['10 timed questions', 'Pre-mock warm-up']),
      b(S4, 50, 'test', 'GATE', 'la', 'LinAlg II Consolidation Quiz (20 Q)', ['Eigen/SVD/projections/quadratic forms mixed', 'Exit bar: 16/20']),
      nightCap(),
    ]},
    { kind: 'saturday', blocks: [
      b('09:00 – 11:00', 120, 'test', 'NET', 'mixed', 'NET BASELINE MOCK 0 — Paper 2, 100 Q (120 min)', ['Full pattern, timed, morning start', 'Record the score — Phase 2 reference point', 'Answer all 100: zero-blank doctrine from mock 1']),
      b('11:15 – 12:45', 90, 'review', 'NET', 'mixed', 'Mock Autopsy', ['Score split by unit; tag every error: known / shaky / unknown', 'Guess-quality audit; time audit: where did 120 minutes go?']),
      b(SA3, 75, 'admin', 'BOTH', 'mixed', 'Gap List + Phase 2 Patch Plan', ['Three weakest units named', 'Each gets a dated repair slot in Weeks 8–9']),
      b(SA4, 60, 'revision', 'GATE', 'la', 'GATE LA Formula-Sheet Pass', ['Eigen/SVD/projection sheet written from memory', 'Correct against notes; star gaps']),
    ]},
    sunday('Plan Phase 2: mock cadence, PYQ set order, Paper 1 full sets'),
  ],
}

// ── Phase 2 helpers ──────────────────────────────────────────────────────────
const pyqDay = (set: string, setSubs: string[], gateTopic: string, gateSubs: string[], p1: string): DaySpec => ({
  kind: 'weekday',
  blocks: [
    b(P1, 120, 'test', 'NET', 'mixed', set, setSubs),
    b(P2, 60, 'review', 'NET', 'mixed', 'Same-Day Review: Score, Tag, Route', ['Score & split by unit', 'Tag every error: concept gap / trap / misread / time pressure', 'Concept gaps get a 72-hour re-solve date']),
    b(S3, 25, 'practice', 'NET', 'p1', `Paper 1 Mini-Set: ${p1}`, ['10 timed questions', 'Drip continues until exam week']),
    b(P4, 35, 'revision', 'GATE', 'la', gateTopic, gateSubs),
    b(P5, 30, 'drill', 'NET', 'mixed', 'Error-Log Patching', ['Re-solve today\u2019s concept-gap misses', 'Update the trap list']),
  ],
})

// ── Week 8 ───────────────────────────────────────────────────────────────────
const W8: WeekSpec = {
  week: 8, phase: 2,
  title: 'NET PYQ Sets 1–4 (2023–2026 Papers) · GATE LA Maintenance',
  focus: 'NET 76% · GATE 24%',
  notes: [
    'PYQ sets are solved as papers, then unit-wise: coverage diagnosis, not just score.',
    'Official GATE plans rest this month too — 35 min of LA/flashcards keeps February alive.',
  ],
  milestone: '4 Paper 2 sets solved + reviewed same day · re-solve accuracy 70%+',
  days: [
    pyqDay('PYQ Set 1 — Paper 2 (100 Q, 120 min)', ['Use the 2026 paper first — closest to current pattern', 'Zero blanks: attempt everything', 'Flag >60s questions for pass 2'], 'GATE: LA Flashcards + Eigen Warm-ups', ['Eigen/SVD flashcard sweep', '10 eigenvalue warm-up problems'], 'Data Interpretation'),
    pyqDay('PYQ Set 2 — Paper 2 (100 Q, 120 min)', ['2025 paper', 'Same-day review is non-negotiable', 'Tag: concept / trap / misread / time'], 'GATE: LA Formula Sheet Cold-Write', ['Write the LA sheet from memory, 20 min', 'Correct & star gaps'], 'Reasoning'),
    pyqDay('PYQ Set 3 — Paper 2 (100 Q, 120 min)', ['2024 paper', 'Track time-per-question distribution', 'Watch for repeated trap patterns'], 'GATE: Quadratic Forms Drills', ['10 definiteness/quadratic-form problems', 'Leading minors vs eigenvalues trap'], 'Comprehension'),
    pyqDay('PYQ Set 4 — Paper 2 (100 Q, 120 min)', ['2023 paper', 'Compare scores against the 250+ budget ledger', 'Route every lost mark into the error log'], 'GATE: P&S Distribution Flashcards', ['Distribution family sweep', 'Memoryless & Poisson-scaling traps'], 'ICT'),
    { kind: 'weekday', blocks: [
      b(P1, 120, 'drill', 'NET', 'mixed', 'Error-Log Patching: Two Weakest Units', ['Unit-wise re-drill of flagged topics', 'Open notes allowed; build from errors']),
      b(P2, 60, 'review', 'NET', 'mixed', 'Topic Re-Drill Verification', ['Re-test: 15 questions on patched topics', 'Below 70%? The topic stays in the queue']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Teaching Aptitude (U-I)', ['10 timed questions', 'Concept-set recap continues']),
      b(P4, 35, 'drill', 'GATE', 'la', 'GATE: LA Mixed Mini-Set', ['15 mixed LA problems, timed', 'Anything slow → error log']),
      b(P5, 30, 'admin', 'NET', 'mixed', 'Week Review + Trap List Update', ['Top 10 recurring mistakes on one page', 'Trap list read before every mock from now on']),
    ]},
    { kind: 'saturday', blocks: [
      b(SA1, 90, 'practice', 'NET', 'mixed', 'Unit-Wise Re-Drill: Weakest 2 Units (open notes)', ['Untangle PYQ sets by topic, not by paper', 'Tag every question: known / shaky / unknown']),
      b(SA2, 60, 'revision', 'NET', 'p1', 'Paper 1 Full Set 1 — 50 Q (60 min, timed)', ['Full-length Paper 1 under the clock', 'Score against the 44/50 target']),
      b(SA3, 75, 'review', 'NET', 'p1', 'Paper 1 Review + Memory-Module Work', ['Review every miss', 'Teaching/research aptitude fact sheets expanded']),
      b(SA4, 60, 'revision', 'BOTH', 'mixed', 'Fact Sheets + GATE LA Pass', ['Fact-sheet expansion from the week\u2019s errors', 'GATE LA flashcards (15 min)']),
    ]},
    { kind: 'sunday', blocks: [
      b(SU1, 60, 'test', 'NET', 'p1', 'Paper 1 Full Set 2 — 50 Q (60 min, timed)', ['Second full set this week', 'Trend vs Set 1 — improvement is the metric']),
      b(SU2, 45, 'review', 'NET', 'p1', 'Paper 1 Set 2 Review', ['Review + error log', 'Memory modules: second cold-write due end of W8']),
      b(SU3, 45, 'admin', 'BOTH', 'mixed', 'Plan Week 9', ['Sets 5–8 order (post-2023 first)', 'Combined Mock A on Saturday', 'GATE: 15-min daily maintenance only']),
    ]},
  ],
}

// ── Week 9 ───────────────────────────────────────────────────────────────────
const W9: WeekSpec = {
  week: 9, phase: 2,
  title: 'NET PYQ Sets 5–8 + Combined Mock A · GATE LA-II Drills',
  focus: 'NET 76% · GATE 24%',
  notes: [
    'Sets 5–8 use post-2023 papers first — closest to the current NTA pattern.',
    'Saturday\u2019s combined mock is the full-session rehearsal: P1 + P2, 180 minutes, 9:00 AM.',
  ],
  milestone: '8 Paper 2 sets + 4 Paper 1 sets done · combined mock recorded vs the 250+ budget',
  days: [
    pyqDay('PYQ Set 5 — Paper 2 (100 Q, 120 min)', ['2022 cycle', 'Checkpoint at 60 min: 50+ attempted', 'Harvest recall questions at first sight'], 'GATE: SVD Revision', ['SVD 10-problem refresher', 'Flashcards: singular vs eigen'], 'Data Interpretation'),
    pyqDay('PYQ Set 6 — Paper 2 (100 Q, 120 min)', ['2021 cycle', 'Elimination sweep at the end: every blank answered', 'Guess quality: log which paid off'], 'GATE: LA Timed Mini (20 Q)', ['25-minute timed set', 'Exit bar: 16/20'], 'Reasoning'),
    pyqDay('PYQ Set 7 — Paper 2 (100 Q, 120 min)', ['2020 cycle', 'Compare trap patterns across all sets so far', 'Error log: close what re-solves cold'], 'GATE: P&S Counting Recap', ['15 counting problems', 'Bayes partition refresher'], 'Comprehension'),
    pyqDay('PYQ Set 8 — Paper 2 (100 Q, 120 min)', ['2019 cycle', 'Unit-wise split recorded per set', 'Weak-unit accuracy re-tested'], 'GATE: Bayes Recap Set', ['15 Bayes problems, timed', 'CLT one-pager read'], 'ICT'),
    { kind: 'weekday', blocks: [
      b(P1, 120, 'drill', 'NET', 'mixed', 'Repair Cycle Day 1: Weakest Unit', ['Re-derive theory from notes', 'Re-solve the original wrong problems']),
      b(P2, 60, 'drill', 'NET', 'mixed', 'Repair Cycle: 5 Fresh Problems', ['Same sub-topic, fresh problems', 'Paper + visible clock']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Teaching Aptitude (U-I)', ['10 timed questions', 'Memory sheet second cold-write tonight']),
      b(P4, 35, 'revision', 'GATE', 'mixed', 'GATE: Flashcards Only', ['LA + P&S + Calc cards sweep', 'Low load — NET peaks this week']),
      b(P5, 30, 'admin', 'NET', 'mixed', 'Combined-Mock Prep', ['Mock A logistics: timing, sheets, water', 'Pass-plan recap: P1 → harvest → earn → sweep']),
    ]},
    { kind: 'saturday', blocks: [
      b('09:00 – 12:00', 180, 'test', 'NET', 'mixed', 'COMBINED MOCK A — Paper 1 (50 Q) + Paper 2 (100 Q), 180 min', ['Full session rehearsal at shift timing (9:00 AM)', 'P1 in ≤50 min, then P2 in three passes', 'Zero-blank audit in the final 8 minutes']),
      b('12:20 – 13:50', 90, 'review', 'NET', 'mixed', 'Three-Layer Autopsy', ['Score anatomy vs the 250+ budget line by line', 'Error taxonomy: concept / calculation / misread / time / guess', 'Time audit: reconstruct where 180 minutes went']),
      b(SA3, 75, 'revision', 'NET', 'mixed', 'Fact-Sheet Sweep: Units 1–5', ['Read-aloud sweep, fact sheets 1–5', 'Star anything that hesitated']),
      b(SA4, 60, 'admin', 'BOTH', 'mixed', 'Repair Queue + GATE Check-In', ['Weak-unit accuracy re-tested; below 70% → queue with deadline', 'GATE LA trend note — one honest sentence']),
    ]},
    { kind: 'sunday', blocks: [
      b(SU1, 60, 'admin', 'NET', 'mixed', 'Error-Log Triage + 72h Re-solves', ['All entries from the week re-attempted cold', 'Repeat offenders starred for exam-morning reading']),
      b(SU2, 45, 'revision', 'NET', 'mixed', 'Fact-Sheet Sweep: Units 6–10 + Paper 1 Sheets', ['Units 6–10 read-aloud', 'P1 memory sheets third cold-write prep']),
      b(SU3, 45, 'admin', 'BOTH', 'mixed', 'Plan Week 10 (Mock Week)', ['Mocks 1–3 on Mon/Wed/Fri mornings', 'Off-day template: review + fact sheets + repairs', 'GATE drops to flashcards-only until Dec 14']),
    ]},
  ],
}

// ── Week 10 ──────────────────────────────────────────────────────────────────
const W10: WeekSpec = {
  week: 10, phase: 2,
  title: 'NET Mocks 1–3 + Fact Sheets 1–5 · GATE Maintenance',
  focus: 'NET 88% · GATE 12%',
  notes: [
    'Mock days: 9:00–12:00 exam conditions, 90-minute autopsy, light evening sweep.',
    'Off days (Tue/Thu): review follow-up, fact sheets, error repairs — the marks are manufactured here.',
  ],
  milestone: '3 mocks logged with trending scores · 5 fact sheets complete',
  days: [
    { kind: 'weekday', blocks: [
      b('09:00 – 12:00', 180, 'test', 'NET', 'mixed', 'MOCK 1 — Full P1+P2 Session (180 min, shift timing)', ['Official pattern, both papers back-to-back', 'Checkpoints: P1 done by 0:50; 70+ of P2 by 2:20', 'Zero blanks by 2:45']),
      b('12:20 – 13:50', 90, 'review', 'NET', 'mixed', 'Autopsy 1: Calibration', ['Unit-wise anatomy vs the ledger; name 3 weakest units', 'P1→P2 time split check', 'Error taxonomy + time audit']),
      b('20:45 – 21:15', 30, 'revision', 'NET', 'mixed', 'Nightly Fact Sweep', ['Fact-sheet read-aloud, 2 units', 'Trap list read']),
    ]},
    { kind: 'weekday', blocks: [
      b('09:00 – 12:00', 180, 'drill', 'NET', 'mixed', 'Mock 1 Follow-Up + Fact Sheets 1–2', ['Re-solve all wrong/guessed questions from scratch', 'Fact sheets 1–2 (Discrete, COA) refined', 'Routed repairs on calibration targets']),
      b('20:15 – 20:40', 25, 'drill', 'NET', 'p1', 'Paper 1 Mini-Set: Weak Module', ['10 questions from your weakest P1 module', 'Memory-sheet correction pass']),
      b('20:45 – 21:15', 30, 'revision', 'NET', 'mixed', 'Nightly Fact Sweep', ['Fact-sheet read-aloud + trap list']),
      b('21:20 – 21:50', 30, 'admin', 'GATE', 'mixed', 'GATE Pulse (15–20 min)', ['Flashcard sweep: LA/P&S/Calc', 'One-line log: energy & streak check']),
    ]},
    { kind: 'weekday', blocks: [
      b('09:00 – 12:00', 180, 'test', 'NET', 'mixed', 'MOCK 2 — Full P1+P2 Session (180 min)', ['Pattern-hunt mock: repeat errors, guess quality, time sinks', 'Same shift timing, same setup']),
      b('12:20 – 13:50', 90, 'review', 'NET', 'mixed', 'Autopsy 2: Pattern Detection', ['Repeat-error detection against the log', 'Guess-quality audit; time-per-question distribution', 'Compare vs Mock 1: what moved?']),
      b('20:45 – 21:15', 30, 'revision', 'NET', 'mixed', 'Nightly Fact Sweep', ['2 fact sheets + trap list']),
    ]},
    { kind: 'weekday', blocks: [
      b('09:00 – 12:00', 180, 'drill', 'NET', 'mixed', 'Mock 2 Follow-Up + Fact Sheets 3–4', ['Cold re-solves from Mock 2', 'Fact sheets 3–4 refined', 'Repair queue: weak-unit theory re-derivation']),
      b('20:15 – 20:40', 25, 'drill', 'NET', 'p1', 'Paper 1 Mini-Set: Weak Module', ['10 questions, timed', 'If mini-set average < 36/50, add weekend second set']),
      b('20:45 – 21:15', 30, 'revision', 'NET', 'mixed', 'Nightly Fact Sweep', ['2 fact sheets + trap list']),
      b('21:20 – 21:50', 30, 'admin', 'GATE', 'mixed', 'GATE Pulse', ['Flashcards + one 10-problem mini-drill']),
    ]},
    { kind: 'weekday', blocks: [
      b('09:00 – 12:00', 180, 'test', 'NET', 'mixed', 'MOCK 3 — Full P1+P2 Session (180 min)', ['Performance mock: full three-pass protocol', 'Target: trending up from Mock 2']),
      b('12:20 – 13:50', 90, 'review', 'NET', 'mixed', 'Autopsy 3: Performance Audit', ['Blank-question sweep must reach zero', 'Section timing vs pass-plan checkpoints', 'Ledger update: P1 target 88+, P2 168+']),
      b('20:45 – 21:15', 30, 'revision', 'NET', 'mixed', 'Nightly Fact Sweep', ['2 fact sheets + trap list']),
    ]},
    { kind: 'saturday', blocks: [
      b(SA1, 120, 'drill', 'NET', 'mixed', 'Mock 3 Follow-Up + Fact Sheet 5', ['Cold re-solves + routed repairs', 'Fact sheet 5 finalised', 'Weakest-unit patch from error log']),
      b(SA2, 60, 'revision', 'NET', 'p1', 'Paper 1 Formula & Scheme Cards', ['DI/reasoning formula cards', 'Higher-ed + environment timeline sheets refreshed']),
      b(SA3, 75, 'drill', 'NET', 'mixed', 'Weak-Unit Patch Block', ['Repair-cycle day: re-derive, re-drill, re-test', 'Exit: 10-question mini-set ≥ 7 correct']),
      b(SA4, 60, 'admin', 'BOTH', 'mixed', 'Week Audit', ['Mock trend: 1→2→3 recorded', 'GATE maintenance check: streak intact?']),
    ]},
    sunday('Plan Week 11: Mocks 4–5, taper protocol, exam-day logistics'),
  ],
}

// ── Week 11 ──────────────────────────────────────────────────────────────────
const W11: WeekSpec = {
  week: 11, phase: 2,
  title: 'NET Mocks 4–5 + Taper · NET EXAM WEEK',
  focus: 'NET 92% · GATE 8%',
  notes: [
    'Intensity comes down while consistency stays up. No new material from D-4 onward.',
    'Sleep shifts earlier by 30 minutes each night; a rested candidate beats a crammed one.',
  ],
  milestone: 'NET EXAM — Paper 1 first, two-pass Paper 2, zero blanks',
  days: [
    { kind: 'weekday', blocks: [
      b('09:00 – 12:00', 180, 'test', 'NET', 'mixed', 'MOCK 4 — Full Session (180 min)', ['Performance rehearsal under exam physiology', 'Target: 235+ raw before guessing recovery']),
      b('12:20 – 13:50', 90, 'review', 'NET', 'mixed', 'Autopsy 4', ['Zero-blank sweep verification', 'Final strategy adjustments only — no new tactics']),
      b('20:45 – 21:15', 30, 'revision', 'NET', 'mixed', 'Nightly Fact Sweep', ['Fact sheets + trap list']),
    ]},
    { kind: 'weekday', blocks: [
      b('09:00 – 12:00', 180, 'revision', 'NET', 'mixed', 'Fact Sheets 6–10 + Weakest-Unit Final Patch', ['Fact sheets completed & final', 'Last repair cycle on the weakest unit', 'Trap-list full read']),
      b('20:15 – 20:40', 25, 'revision', 'NET', 'p1', 'Paper 1 Memory Sheets — Final Cold-Write', ['All memory modules written from memory', 'Corrections starred only']),
      b('20:45 – 21:15', 30, 'revision', 'NET', 'mixed', 'Light Sweep', ['Flashcards + acronyms']),
    ]},
    { kind: 'weekday', blocks: [
      b('09:00 – 12:00', 180, 'test', 'NET', 'mixed', 'MOCK 5 — Final Dress Rehearsal (180 min)', ['Exact wake time, exact food, exact session start', 'Result matters least of all five — confidence protection only']),
      b('12:20 – 13:50', 90, 'review', 'NET', 'mixed', 'Two-Page Review Note', ['Five rules to your future self', 'Nothing more — no deep autopsy today']),
      b('20:45 – 21:15', 30, 'revision', 'NET', 'mixed', 'Light Sweep', ['Fact sheets, flashcards, port table']),
    ]},
    { kind: 'weekday', blocks: [
      b('09:00 – 11:30', 150, 'revision', 'NET', 'mixed', 'Light Revision Only', ['Paper 1 formulas & acronyms', 'Fact-sheet read-through, 2 units', 'NO new material under any circumstances']),
      b('20:15 – 20:40', 25, 'revision', 'NET', 'p1', 'Paper 1 Cards', ['Light 25-minute card sweep']),
      b('20:45 – 21:15', 30, 'admin', 'NET', 'mixed', 'Logistics Check', ['Admit card printout, ID, centre route, backup plan', 'Sleep shift: in bed 30 min earlier']),
    ]},
    { kind: 'weekday', blocks: [
      b('09:00 – 10:30', 90, 'revision', 'NET', 'mixed', 'Lightest Day: Cards + 2 Weakest Fact Sheets', ['Morning only', 'No timed work today']),
      b('20:15 – 20:40', 25, 'revision', 'NET', 'p1', 'Paper 1 Cards (final)', ['One-liners + SDG/HE timeline']),
      b('20:45 – 21:15', 30, 'admin', 'NET', 'mixed', 'Exam Eve Protocol', ['Pack the folder; read the one-page strategy sheet', 'No study after dinner; sleep by 22:30']),
    ]},
    { kind: 'saturday', blocks: [
      b('09:00 – 09:30', 30, 'revision', 'NET', 'p1', 'Morning Flashcards Only (30 min)', ['Strategy sheet read once', 'Water, walk, calm']),
      b('10:00 – 10:30', 30, 'admin', 'NET', 'mixed', 'Final Logistics + Rest', ['Centre route & timing final check', 'Rest is part of the plan — take it fully']),
      b('20:00 – 20:30', 30, 'admin', 'NET', 'mixed', 'Early Night Protocol', ['Everything staged for tomorrow', 'Sleep by 22:00 — 7+ hours is a performance aid']),
    ]},
    { kind: 'exam', blocks: [
      b('06:30 – 06:50', 20, 'admin', 'NET', 'p1', 'Wake · Light Breakfast · Flashcards Only', ['No new material', 'Port table + SDG one-liners']),
      b('07:30 – 09:00', 90, 'admin', 'NET', 'mixed', 'Travel & Reporting', ['Arrive 90 minutes early', 'Restroom before entry; no syllabus reading at the gate']),
      b('09:00 – 12:00', 180, 'exam', 'NET', 'mixed', 'UGC NET EXAM — Paper 1 + Paper 2', ['P1 first (≤55 min): answer everything, flag the rest', 'P2 pass 1 (harvest): instantly-knowns, flag the rest — 70+ attempted', 'P2 pass 2 (earn): work flagged numericals on paper', 'Elimination sweep + zero-blank audit: final 8 minutes']),
      b('13:00 – 13:30', 30, 'admin', 'BOTH', 'mixed', 'Post-Exam Acknowledgment', ['Whatever it says: 48 hours of acknowledgment, then the Linear Algebra textbook', 'The February mission was never suspended — only sequenced']),
    ]},
  ],
}

export const WEEKS_A: WeekSpec[] = [W1, W2, W3, W4, W5, W6, W7, W8, W9, W10, W11]

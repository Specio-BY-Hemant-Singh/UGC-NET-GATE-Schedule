// ─────────────────────────────────────────────────────────────────────────────
// Weeks 1–11 · Phase 1 (Coverage Sprint) + Phase 2 (NET PYQ Marathon & Exam)
// Primary track: UGC NET Dec 2026 · GATE math rides the evening parallel slot
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
  title: 'Launch: DBMS-1 + DSA-1 · GATE Counting Foundations',
  focus: 'NET 62% · GATE 38%',
  notes: [
    'NET is the primary track until mid-December; GATE math rides the 20:45 slot daily.',
    'Phone stays outside the room during the 06:30 and 19:00 blocks.',
    'Start the error log today — one row per mistake, filled the same day it happened.',
  ],
  milestone: 'Mixed 40-Q test at 70%+ · SQL drill set solved under 25 min',
  days: [
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'dbms', 'DBMS: ER Model & Relational Model', ['ER modelling: entities, attributes, relationships, keys', 'Integrity constraints: entity, referential, domain', 'Three-schema architecture & data independence'], 'Notes in your own words + 1 worked example per concept'),
      b(S2, 70, 'drill', 'NET', 'dbms', 'Drill: ER & Relational Model MCQs', ['15 unit-mapped MCQs under a time cap', 'Log every miss immediately']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Data Interpretation', ['10 timed questions (25-min cap)', 'Tables, charts, ratios & percentages'], 'Read stems before the data'),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Counting — Permutations', ['Linear, circular, with repetition', 'Case-analysis method for GATE-style problems'], '20 hand-solved problems'),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'dbms', 'Relational Algebra & Tuple Calculus', ['RA: selection, projection, joins, renaming', 'Set vs bag semantics; tuple calculus'], 'Translate 10 English queries to RA, then to SQL'),
      b(S2, 70, 'drill', 'NET', 'dbms', 'Drill: RA → SQL Translation', ['10 translation queries, paper first', 'Time each under 3 minutes']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Logical Reasoning', ['10 timed questions', 'Series, syllogisms, seating puzzles']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Combinations & Distributions', ['Combinations with cases; distributing objects', 'Identical vs distinct — the classic GATE fork'], '15 problems'),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'dbms', 'SQL Deep: Joins, Aggregates, Nesting', ['Inner/outer joins, GROUP BY, HAVING', 'Nested queries, views; NULL behaviour traps'], 'Write each query twice: once in SQL, once in RA'),
      b(S2, 70, 'drill', 'NET', 'dbms', 'SQL Output Drill (Exit Milestone)', ['15 SQL output-prediction questions', 'Solve the full set under 25 minutes']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Reading Comprehension', ['2 timed passages', 'Answers live in the text, not in inference']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Inclusion–Exclusion & Pigeonhole', ['Inclusion-exclusion for 2–3 sets', 'Pigeonhole principle applications'], '15 problems'),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'dsa', 'Complexity, Recurrences + Arrays & Linked Lists', ['Asymptotics: O, \u03A9, \u0398; best/worst cases', 'Recurrences via the master method', 'Arrays, sparse matrices, singly/doubly linked lists']),
      b(S2, 70, 'drill', 'NET', 'dsa', 'Drill: Complexity + Linked List MCQs', ['15 questions: complexity + output tracing', 'Hand-trace 3 linked-list operations']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: ICT', ['10 timed questions', 'Hardware/software categories, e-governance']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Probability Axioms & Events', ['Sample space, axioms, events', 'Independent vs mutually exclusive events'], '15 problems'),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'dsa', 'Stacks, Queues + Sorting & Searching', ['Stacks, queues, priority queues', 'Selection, bubble, insertion sort + complexity tables', 'Linear & binary search boundary cases']),
      b(S2, 70, 'drill', 'NET', 'dsa', 'Drill: Hand-Simulate Every Sort', ['Trace each sort on a 7-element array', '15 MCQs on outputs & stability']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Teaching Aptitude', ['10 timed questions', 'Learner characteristics, teaching methods, evaluation']),
      b(S4, 50, 'practice', 'GATE', 'ps', 'P&S: Counting Problem Set', ['25 counting problems, notes closed', 'Mark the slow ones for Saturday']), 
      nightCap(),
    ]},
    satTest('Everything so far: DBMS, DSA, counting & probability basics', ['Target 70%+ (exit milestone)']),
    sunday('Stage Week 2 materials: DBMS-2 + DSA-2 notes, Bayes problem set',
      b(SU2, 45, 'admin', 'NET', 'p1', 'Full Exam Map Walkthrough (30 min)', ['Read the 10-unit NET syllabus top to bottom', 'Mark comfort level per unit: known / shaky / unknown', 'Keep this map — it feeds Sunday audits all campaign'])),
  ],
}

// ── Week 2 ───────────────────────────────────────────────────────────────────
const W2: WeekSpec = {
  week: 2, phase: 1,
  title: 'DBMS-2 (Normalisation & Transactions) + DSA-2 (Trees & Graphs) · GATE Bayes',
  focus: 'NET 62% · GATE 38%',
  notes: [
    'Normalisation and Bayes are both procedure-heavy — drill by hand, not by reading.',
    'Every theory hour carries a same-day MCQ tax; the 19:00 block exists for exactly that.',
  ],
  milestone: 'Normalisation speed drill: 3 problems in 20 min · 40-Q test at 70%+',
  days: [
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'dbms', 'Functional Dependencies & Normalisation', ['FDs, attribute closure, minimal cover', '1NF → 2NF → 3NF → BCNF with decompositions', 'Lossless join & dependency-preservation checks']),
      b(S2, 70, 'drill', 'NET', 'dbms', 'Normalisation Speed Drill', ['3 full normalisation problems in 20 min (exit milestone)', 'Then 10 MCQs on normal forms']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Data Interpretation', ['10 timed questions', 'Growth rates, averages, ratio traps']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Joint, Marginal & Conditional Probability', ['Joint distributions from tables', 'Marginalisation; conditional probability discipline']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'dbms', 'Transactions & Concurrency', ['ACID; transaction states; logs & recovery', '2PL, conflict vs view serializability', 'Deadlock handling: prevention, avoidance, detection']),
      b(S2, 70, 'drill', 'NET', 'dbms', 'Drill: Concurrency & Recovery MCQs', ['15 questions incl. schedule-conflict checks', 'Draw precedence graphs for 3 schedules']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Reasoning', ['10 timed questions', 'Mixed mathematical + logical reasoning']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Bayes Theorem', ['Bayes with partition diagrams', 'Prior vs likelihood discipline — the classic trap'], 'Draw the partition tree first, always'),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'dbms', 'Warehousing, Mining & NoSQL Survey', ['Star/snowflake schemas, hierarchies, measures', 'OLAP vs OLTP; association rules, classification, clustering', 'NoSQL families & CAP; Hadoop/HDFS/MapReduce one-liners']),
      b(S2, 70, 'drill', 'NET', 'dbms', 'Drill: Warehousing & Mining MCQs', ['15 questions: roll-ups, measures, taxonomy', 'Fact-sheet: mining algorithms on one page']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Comprehension', ['2 timed passages', 'Underline evidence before answering']),
      b(S4, 50, 'practice', 'GATE', 'ps', 'P&S: Bayes Problem Set', ['25 Bayes problems: partitions & tree diagrams', 'Solve every variant twice — fresh, then cold']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'dsa', 'Trees: BST, AVL, B & B+ Trees', ['BST operations; all four traversals', 'AVL rotations: LL, RR, LR, RL', 'B/B+ tree order, insertion, fan-out arithmetic']),
      b(S2, 70, 'drill', 'NET', 'dsa', 'Drill: Trace AVL Rotations', ['Hand-run 5 insertion sequences', '10 B/B+ tree MCQs incl. order computation']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: ICT', ['10 timed questions', 'ICT in education; initiatves recap']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Bayes Traps + Conditional Expectation', ['P(A|B) vs P(B|A) discipline', 'E[Y|X] and variance decomposition identities']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'dsa', 'Graphs: Traversals, MST, Shortest Paths', ['BFS/DFS + applications; topological sort', 'Prim & Kruskal; Dijkstra, Bellman-Ford, Floyd-Warshall', 'Max-flow basics']),
      b(S2, 70, 'drill', 'NET', 'dsa', 'Drill: Hand-Run Graphs', ['BFS/DFS/Dijkstra by hand on an 8-node graph', '15 MCQs: MST edges & shortest-path outputs']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Research Aptitude', ['10 timed questions', 'Sampling, hypothesis, validity & reliability']),
      b(S4, 50, 'drill', 'GATE', 'ps', 'P&S: Probability Quiz Prep (20 Q)', ['Mixed counting + Bayes timed set', 'Fix the two slowest problem types tonight']),
      nightCap(),
    ]},
    satTest('DBMS (full) + DSA (trees/graphs) + Bayes', ['Two older topics mixed in: counting, complexity']),
    sunday('Stage Week 3: OS notes, Banker\u2019s template, expectation problem set'),
  ],
}

// ── Week 3 ───────────────────────────────────────────────────────────────────
const W3: WeekSpec = {
  week: 3, phase: 1,
  title: 'OS Complete + DSA-3 (DP & Recurrences) · GATE Discrete RVs',
  focus: 'NET 62% · GATE 38%',
  notes: [
    'OS numericals are ritual skills: Gantt charts, page traces, Banker\u2019s runs — done by hand.',
    'If you cannot do the computation on paper in 90 seconds, it is not yet learned.',
  ],
  milestone: 'Phase checkpoint: 60-Q across 4 units at 65%+ · rank units by accuracy',
  days: [
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'os', 'Processes, Threads & CPU Scheduling', ['Processes & IPC; threads and models', 'FCFS, SJF, SRTF, RR — Gantt charts + waiting/turnaround', 'Convoy effect, starvation']),
      b(S2, 70, 'drill', 'NET', 'os', 'Scheduling Numericals', ['5 full Gantt charts computed by hand', 'Compare average waiting times across algorithms']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Data Interpretation', ['10 timed questions', 'Speed comes from cadence — twice weekly is the rule']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Discrete RVs — PMF & Expectation', ['PMF & CDF; expectation of transformations', 'E[aX+b], Var rules, indicator tricks']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'os', 'Synchronisation & Deadlocks', ['Semaphores, Peterson\u2019s solution, monitors', 'Producer-consumer, readers-writers, dining philosophers', 'Deadlock conditions + Banker\u2019s algorithm']),
      b(S2, 70, 'drill', 'NET', 'os', 'Drill: Banker\u2019s Runs + Sync MCQs', ['2 full Banker\u2019s algorithm runs by hand', '15 sync MCQs incl. semaphore value traces']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Reasoning', ['10 timed questions', 'Direction sense, blood relations, coding-decoding']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Conditional Expectation & Variance', ['E[Y|X] with partitions', 'Law of total variance — worked examples']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'os', 'Memory Management & Storage', ['Paging, segmentation, TLB; Belady\u2019s anomaly', 'Page replacement: FIFO, LRU, Optimal', 'Disk scheduling SSTF/SCAN/C-SCAN; RAID levels']),
      b(S2, 70, 'drill', 'NET', 'os', 'Page-Replacement Traces', ['4 reference strings traced by hand', 'Fault counts compared across policies']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Comprehension', ['2 timed passages', 'Time discipline: 7 minutes per passage max']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Bernoulli, Binomial & Uniform', ['Bernoulli & binomial: at-least/at-most cases', 'Complement rule for \u201Cat least one\u201D questions']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'dsa', 'DP, Greedy & Backtracking', ['DP vs greedy; LCS, knapsack, matrix chain', 'When greedy fails — exchange argument', 'Backtracking: n-queens, subset sum']),
      b(S2, 70, 'drill', 'NET', 'dsa', 'Drill: 12 DP/Greedy Problems', ['Classify each as DP or greedy + why', 'Solve 5 fully by hand']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: ICT', ['10 timed questions', 'Cloud models SaaS/PaaS/IaaS; IoT one-liners']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Descriptive Statistics', ['Mean/median/mode on grouped data', 'Std dev, correlation & covariance computations']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'dsa', 'Recurrences, String Matching + Phase Sweep', ['Master-method cases; substitution checks', 'KMP & Rabin-Karp at concept level', 'Quick sweep of Weeks 1–3 for the checkpoint']),
      b(S2, 70, 'drill', 'NET', 'mixed', 'Phase Checkpoint Prep Set', ['30-Q mixed timed drill across the four core units', 'Log every miss with a root cause']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Teaching Aptitude', ['10 timed questions', 'NTA recycles conceptual anchors — note repeats']),
      b(S4, 50, 'practice', 'GATE', 'ps', 'P&S: Expectation Problem Set', ['20 expectation/variance problems, notes closed', 'Flag anything over 4 minutes']),
      nightCap(),
    ]},
    satTest('Phase checkpoint week: DBMS + DSA + OS + recurrences', ['60 questions, 90 minutes — the Phase 1 core gate']),
    sunday('Rank units by accuracy; weakest unit earns Phase-2 patch hours'),
  ],
}

// ── Week 4 ───────────────────────────────────────────────────────────────────
const W4: WeekSpec = {
  week: 4, phase: 1,
  title: 'TOC-1 (Regular Languages) + COA-1 · GATE Continuous RVs',
  focus: 'NET 62% · GATE 38%',
  notes: [
    'TOC rewards construction over reading: DFAs you build are questions you own.',
    'Continuous distributions: memorise every PDF and its mean/variance — flashcard material.',
  ],
  milestone: 'Bayes & counting drill at 80% · 40-Q test at 65%+',
  days: [
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'toc', 'Regular Languages: DFA/NFA, Regex, Pumping Lemma', ['DFA & NFA design; subset construction', 'Minimization; regular expressions; Arden\u2019s theorem', 'Pumping lemma & closure properties']),
      b(S2, 70, 'drill', 'NET', 'toc', 'Drill: Construct Automata', ['5 DFAs designed from scratch', '2 NFA→DFA subset constructions by hand']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Data Interpretation', ['10 timed questions', 'Data tables with multi-step ratios']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Continuous RVs — PDF/CDF', ['PDF, CDF, conditional PDF', 'Uniform & exponential; memoryless property (trap)']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'toc', 'CFG, PDA & CFL Properties', ['CFG ambiguity; CNF & GNF conversions', 'PDA & NPDA; equivalence with CFG', 'CFL closure properties']),
      b(S2, 70, 'drill', 'NET', 'toc', 'Drill: Grammar Conversions', ['2 grammars → CNF by hand', '2 grammars → GNF by hand']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Reasoning', ['10 timed questions', 'Syllogisms with Venn sketches']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Uniform, Exponential & Poisson', ['Poisson process scaling with interval length (trap)', 'Exponential: memoryless drills']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'coa', 'COA-1: Number Systems & K-Maps', ['Bases, complements, IEEE 754, Hamming codes', 'K-map simplification up to 4 variables', 'Combinational circuits: adders, MUX, decoders']),
      b(S2, 70, 'drill', 'NET', 'coa', 'Drill: IEEE 754 & K-Maps', ['10 IEEE 754 / Hamming numericals by hand', '8 K-map problems incl. don\u2019t-cares']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Comprehension', ['2 timed passages', 'Note the question\u2019s own vocabulary']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Normal & Standard Normal', ['Standardisation drills; z-table fluency', 'Symmetry & interval computations']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'coa', 'COA-1: Flip-Flops, Counters & Sequential Circuits', ['SR, JK, D, T flip-flops; excitation tables', 'Counters & registers; sequence detection', 'Timing diagrams']),
      b(S2, 70, 'drill', 'NET', 'coa', 'Drill: Sequential Circuits', ['10 flip-flop/counter numericals', 'Draw state diagrams for 3 counters']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: ICT', ['10 timed questions', 'Memory-module cadence maintained']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: t & Chi-Squared Distributions', ['When t vs z: sample-size conditions', 'Chi-squared: shape & uses preview']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'drill', 'NET', 'mixed', 'TOC + COA Mixed Drill', ['40-Q timed set across both units', 'Every miss → error log with root cause']),
      b(S2, 70, 'review', 'NET', 'mixed', 'Error Re-solve: This Week\u2019s Misses', ['Re-solve cold, no notes', 'Pattern check: which sub-topic repeats?']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Teaching Aptitude', ['10 timed questions', 'Teaching methods & models recap']),
      b(S4, 50, 'practice', 'GATE', 'ps', 'P&S: Continuous Distributions Set', ['25 mixed problems: uniform/exp/Poisson/normal', 'Notes closed after first 10']),
      nightCap(),
    ]},
    satTest('TOC-1 + COA-1 + continuous distributions', ['Include 5 previous-year style questions']),
    sunday('Stage Week 5: logic sets, cache templates, inference toolkit notes'),
  ],
}

// ── Week 5 ───────────────────────────────────────────────────────────────────
const W5: WeekSpec = {
  week: 5, phase: 1,
  title: 'Discrete-1 + COA-2 (Pipeline & Cache) · GATE CLT & Inference',
  focus: 'NET 62% · GATE 38%',
  notes: [
    'The hardest GATE week of Phase 1 — protect it. CLT + inference pay out every DA paper.',
    'Cache mapping and subnetting later this week are the two most repeated numerical formats.',
  ],
  milestone: 'CLT/hypothesis problem set at 80% · 40-Q test at 65%+',
  days: [
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'disc', 'Discrete-1: Logic & Relations', ['Propositional & predicate logic; normal forms', 'Inference rules; quantifiers', 'Sets, relations: equivalence, partial orders, Hasse diagrams, lattices']),
      b(S2, 70, 'drill', 'NET', 'disc', 'Drill: Logic Conversions', ['20 conversions: CNF/DNF, inference steps', 'Draw Hasse diagrams for 3 posets']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Data Interpretation', ['10 timed questions', 'Multi-chart questions — label before computing']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Central Limit Theorem', ['CLT statement & applicability vs exact binomial', 'Sampling distribution of the mean', 'Standardisation drills']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'disc', 'Discrete-1: Counting, Induction & Bayes Numericals', ['Pigeonhole, permutations & combinations', 'Inclusion-exclusion; induction proofs', 'Bayes\u2019 theorem numericals']),
      b(S2, 70, 'drill', 'NET', 'disc', 'Drill: Counting & Probability Set', ['30 problems, 80% accuracy target', 'Untimed first pass, timed second pass']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Reasoning', ['10 timed questions', 'Clock/calendar problems count too']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: Confidence Intervals', ['CI construction & interpretation', 'Margin of error arithmetic']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'coa', 'COA-2: Addressing Modes & Control Unit', ['Every addressing mode + effective-address computation', 'Instruction cycle, interrupts & priority', 'Microprogrammed control; RISC vs CISC']),
      b(S2, 70, 'drill', 'NET', 'coa', 'Drill: Effective-Address Numericals', ['12 addressing-mode computations by hand', '90-second rule per computation']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Comprehension', ['2 timed passages', 'Flag >60s questions, move on']),
      b(S4, 50, 'theory', 'GATE', 'ps', 'P&S: z-Test & t-Test', ['Test selection: when z, when t', 'One-sample & two-sample worked flows']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'coa', 'COA-2: Pipelining, Cache, Virtual Memory & I/O', ['Pipeline hazards, forwarding, speedup numericals', 'Cache: direct/associative/set-associative + hit ratios', 'Virtual memory & MMU; interrupts & DMA cycle-stealing']),
      b(S2, 70, 'drill', 'NET', 'coa', 'Drill: Cache & Pipeline Timing', ['6 cache-mapping address splits by hand', '4 pipeline speedup computations']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: ICT', ['10 timed questions', 'E-governance initiative names — flashcard check']),
      b(S4, 50, 'practice', 'GATE', 'ps', 'P&S: Chi-Squared Test + Mixed', ['Goodness-of-fit & independence worked examples', '20-problem mixed inference set']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'drill', 'NET', 'mixed', 'COA + Discrete Mixed Drill', ['40-Q timed set across both', 'Error log: tag every miss']),
      b(S2, 70, 'review', 'NET', 'mixed', 'Error Re-solve: Cold', ['Yesterday\u2019s misses re-solved without notes', 'Build the trap list: absolute statements, unit slips']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Teaching Aptitude', ['10 timed questions', 'Research aptitude 5-question add-on']),
      b(S4, 50, 'practice', 'GATE', 'ps', 'P&S: Inference Mixed Set (30)', ['z/t/chi + CI + CLT all together', 'Simulates exam conditions — timed']),
      nightCap(),
    ]},
    satTest('Discrete-1 + COA-2 + inference toolkit', ['This test closes the heaviest GATE math block']),
    sunday('Stage Week 6: C output-prediction sets, parse-table templates'),
  ],
}

// ── Week 6 ───────────────────────────────────────────────────────────────────
const W6: WeekSpec = {
  week: 6, phase: 1,
  title: 'PL & Graphics + TOC-2 (TM & Compilers) · GATE Linear Algebra I',
  focus: 'NET 60% · GATE 40%',
  notes: [
    'C output-prediction is the single most bankable question format in Unit 3 — daily reps.',
    'Linear Algebra I opens the GATE-exclusive spine; vector spaces first, mechanics later.',
  ],
  milestone: 'Parse-table drill done · TM construction ×2 · 40-Q 65%+ · LinAlg I quiz',
  days: [
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'plg', 'C Deep: Pointers, Storage Classes, Structures', ['Pointers & pointer arithmetic; arrays vs pointers', 'Storage classes; call semantics', 'Structures, unions, file handling, preprocessor']),
      b(S2, 70, 'drill', 'NET', 'plg', 'Drill: C Output Prediction', ['15 output-prediction questions', 'Solve on paper before checking — always']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Data Interpretation', ['10 timed questions', 'Maintain the twice-weekly cadence']),
      b(S4, 50, 'theory', 'GATE', 'la', 'LA: Vector Spaces & Subspaces', ['Vector spaces, subspaces, span', 'Linear dependence/independence', 'Basis & dimension intuition']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'plg', 'C++ & OOP + Web Basics', ['Inheritance forms; compile-time vs runtime polymorphism', 'Constructors, destructors, overloading, virtual functions', 'Templates, exceptions; Java/servlets/applets + HTML/XML at definition level']),
      b(S2, 70, 'drill', 'NET', 'plg', 'Drill: OOP Concept Matching', ['10 OOP output/concept questions', 'Virtual-function dispatch traced by hand']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Reasoning', ['10 timed questions', 'Mix in 2 number-series items']),
      b(S4, 50, 'theory', 'GATE', 'la', 'LA: Systems of Equations & Elimination', ['Gaussian elimination; consistency conditions', '20 hand-eliminations scheduled this week']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'plg', 'Computer Graphics', ['DDA & Bresenham; mid-point circle & ellipse', '2D transforms as matrices; window-to-viewport', 'Clipping: Cohen-Sutherland, Liang-Barsky; Bezier/B-spline; Phong vs Gouraud']),
      b(S2, 70, 'drill', 'NET', 'plg', 'Drill: Graphics Numericals', ['6 Bresenham computations by hand', '2 transform-matrix multiplications']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Comprehension', ['2 timed passages', 'Keep under 7 minutes each']),
      b(S4, 50, 'theory', 'GATE', 'la', 'LA: Rank, Nullity & Determinants', ['Rank-nullity accounting', 'Determinant properties & computations', '30 rank/nullity/consistency problems scheduled']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'toc', 'TOC-2: Turing Machines & Undecidability', ['TM variants; universal TM; Church-Turing thesis', 'Recursive vs recursively enumerable; Chomsky hierarchy', 'Halting problem, PCP, Rice\u2019s theorem']),
      b(S2, 70, 'drill', 'NET', 'toc', 'Drill: TM Construction', ['Construct TMs for 2 sample problems', 'Chomsky hierarchy sheet: one example language per level']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: ICT', ['10 timed questions', 'Hardware categories + OS basics']),
      b(S4, 50, 'practice', 'GATE', 'la', 'LA-I Problem Set', ['20 hand-eliminations + rank/nullity problems', 'Notes closed for the last 10']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'toc', 'Compilers: Parsing & Code Generation', ['Phases; left-recursion removal & left factoring', 'LL(1) FIRST/FOLLOW; LR(0), SLR(1), CLR(1), LALR(1)', 'SDT attributes; runtime, intermediate code, optimisation']),
      b(S2, 70, 'drill', 'NET', 'toc', 'Drill: Parse-Table Construction', ['2 LL(1) tables + 2 SLR(1) tables by hand', 'A parse table you built is a question you own']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Teaching Aptitude', ['10 timed questions', 'Evaluation systems recap']),
      b(S4, 50, 'test', 'GATE', 'la', 'LinAlg I Timed Quiz (20 Q)', ['Closed book, 40 minutes', 'Anything below 16/20 enters Saturday repair']),
      nightCap(),
    ]},
    satTest('PL & Graphics + TOC-2 + compilers', ['Add 5 Bresenham/transform items to the test']),
    sunday('Stage Week 7: networks subnetting drill, COCOMO notes, AI trace tables'),
  ],
}

// ── Week 7 ───────────────────────────────────────────────────────────────────
const W7: WeekSpec = {
  week: 7, phase: 1,
  title: 'Networks + SE + AI · GATE Linear Algebra II · NET Baseline Mock',
  focus: 'NET 58% · GATE 42%',
  notes: [
    'Coverage completes this week: 100% of the NET syllabus touched at least once.',
    'Saturday is the full-syllabus baseline mock — its score calibrates every Phase 2 decision.',
  ],
  milestone: 'Baseline mock (100 Q, timed) recorded · every unit touched at least once',
  days: [
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'net', 'Networks-1: Fundamentals & Data Link', ['Transmission modes; Nyquist & Shannon capacity', 'Encoding, modulation, multiplexing', 'Error control: parity, CRC, checksum, Hamming', 'OSI vs TCP-IP protocol-per-layer map; sliding window (GBN/SR)']),
      b(S2, 70, 'drill', 'NET', 'net', 'Drill: Capacity & Window Numericals', ['10 Nyquist/Shannon computations', '5 sliding-window problems']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Data Interpretation', ['10 timed questions', 'Final cadence week — keep it unbroken']),
      b(S4, 50, 'theory', 'GATE', 'la', 'LA-II: Eigenvalues & Diagonalisation', ['Eigenvalues/vectors; diagonalisation conditions', '35 eigen/SVD problems scheduled this week']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'net', 'Networks-2: IP, Routing, Transport & Security', ['IPv4 classful/classless + subnetting; IPv6; fragmentation; ARP', 'Distance-vector vs link-state; TCP/UDP/SCTP, congestion', 'Ports table; DES/AES/RSA, Diffie-Hellman, signatures, VPNs', 'GSM, mobile IP, WLANs, MANETs; SaaS/PaaS/IaaS; IoT']),
      b(S2, 70, 'drill', 'NET', 'net', 'Drill: The Subnetting Ritual', ['20-problem subnetting drill — reflex speed', 'Port-table flashcards: 15 protocols']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Reasoning', ['10 timed questions', 'Puzzles under 90 seconds each']),
      b(S4, 50, 'theory', 'GATE', 'la', 'LA-II: Projections & Quadratic Forms', ['Projection matrices; P\u00B2 = P consequences', 'Orthogonal + idempotent ⇒ symmetric projection', 'Quadratic forms & definiteness']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'se', 'Software Engineering', ['Process models: waterfall → agile family (XP, Scrum, DSDM, FDD, Crystal)', 'Requirements & SRS; cohesion/coupling ordering', 'McCall & ISO 9126; LOC/FP; COCOMO organic/semi/embedded', 'Testing: V&V, cyclomatic complexity, black/white box, alpha/beta, regression']),
      b(S2, 70, 'drill', 'NET', 'se', 'Drill: SE Recall + COCOMO', ['30 MCQs — pure recall unit', '5 COCOMO effort computations by hand']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Comprehension', ['2 timed passages', 'Accuracy over speed now — exam approaches']),
      b(S4, 50, 'theory', 'GATE', 'la', 'LA-II: LU Decomposition & SVD', ['LU mechanics; SVD singular values vs eigenvalues (trap)', '\u03A3 entries are sq. roots of eigenvalues of A\u1D40A']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'theory', 'NET', 'ai', 'Artificial Intelligence (NET Unit 10)', ['Agents; state-space search: BFS, DFS, best-first, A* + admissibility', 'Hill climbing failure modes; minimax & alpha-beta with pruning counts', 'KR: logic, semantic nets, frames, scripts; expert systems', 'Planning STRIPS; NLP parsing; fuzzy sets; GA cycle; perceptron/MLP/SOM/Hopfield']),
      b(S2, 70, 'drill', 'NET', 'ai', 'Drill: Search & Logic Hand-Simulation', ['Minimax + alpha-beta trace on a game tree', 'Fuzzy set operations; GA pipeline ordering quiz']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: ICT', ['10 timed questions', 'ICT two-pager condensed — final version']),
      b(S4, 50, 'practice', 'GATE', 'la', 'LA-II: SVD & Projection Problem Set', ['20 problems: SVD, projections, partition matrices', 'Time each — max 4 minutes']),
      nightCap(),
    ]},
    { kind: 'weekday', blocks: [
      b(S1, 120, 'revision', 'NET', 'mixed', 'Full-Syllabus Sweep + Fact-Sheet Cold-Writes', ['Sweep all 10 units from fact sheets only', 'Cold-write 3 weakest fact sheets from memory', 'Corrections in second colour = weekend targets']),
      b(S2, 70, 'drill', 'NET', 'mixed', 'Mixed 30-Q Timed Set', ['All units, exam pacing', 'Zero-blank habit: answer everything']),
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Teaching Aptitude', ['10 timed questions', 'Final pre-mock GA warm-up']),
      b(S4, 50, 'test', 'GATE', 'la', 'LinAlg II Consolidation Quiz (20 Q)', ['Eigen/SVD/projections/quadratic forms mixed', 'Exit bar: 16/20']),
      nightCap(),
    ]},
    { kind: 'saturday', blocks: [
      b('09:00 – 11:00', 120, 'test', 'NET', 'mixed', 'NET BASELINE MOCK 0 — Paper 2, 100 Q (120 min)', ['Full pattern, timed, morning start', 'Record the score — it is the Phase 2 reference point', 'Answer all 100: zero-blank doctrine from mock 1']),
      b('11:15 – 12:45', 90, 'review', 'NET', 'mixed', 'Mock Autopsy', ['Score split by unit; tag every error: known / shaky / unknown', 'Guess-quality audit: how many elimination guesses landed', 'Time audit: where did the 120 minutes go?']),
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
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Teaching Aptitude', ['10 timed questions', 'Concept-set recap continues']),
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
      b(S3, 25, 'practice', 'NET', 'p1', 'Paper 1 Mini-Set: Teaching Aptitude', ['10 timed questions', 'Memory sheet second cold-write tonight']),
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
      b('20:45 – 21:15', 30, 'revision', 'NET', 'mixed', 'Nightly Fact Sweep (35 min template)', ['Fact-sheet read-aloud, 2 units', 'Trap list read']),
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

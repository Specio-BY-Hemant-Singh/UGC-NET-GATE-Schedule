// ─────────────────────────────────────────────────────────────────────────────
// Mission Dual — plan types, subjects, habits and date helpers
// Merged from: GATE 2027 DA "Mission 95+" + "95+ Blueprint" and
// UGC NET Dec 2026 CS "Mission 250+" + "250+ Blueprint"
// Daily budget: 4.75 h weekdays · 4.5–5 h Saturday · 2.5 h Sunday
// ─────────────────────────────────────────────────────────────────────────────

export type Exam = 'NET' | 'GATE' | 'BOTH'

export type BlockKind =
  | 'theory'
  | 'practice'
  | 'drill'
  | 'test'
  | 'review'
  | 'revision'
  | 'admin'
  | 'exam'

export interface BlockSpec {
  s: string // slot label e.g. "06:30 – 08:30"
  m: number // minutes
  k: BlockKind
  e: Exam
  sub: SubjectId
  t: string // topic / task title
  st: string[] // subtopics / focus points
  task?: string // how-to instruction line
}

export interface DaySpec {
  kind: 'weekday' | 'saturday' | 'sunday' | 'mock' | 'exam'
  blocks: BlockSpec[]
}

export interface WeekSpec {
  week: number
  phase: 1 | 2 | 3 | 4
  title: string
  focus: string // e.g. "NET 62% · GATE 38%"
  notes: string[] // week guidance
  milestone: string // exit criterion
  days: DaySpec[] // exactly 7
}

// ── Subjects ────────────────────────────────────────────────────────────────
export type SubjectId =
  | 'dbms'
  | 'dsa'
  | 'os'
  | 'toc'
  | 'coa'
  | 'disc'
  | 'net'
  | 'plg'
  | 'se'
  | 'ai'
  | 'p1'
  | 'ps'
  | 'la'
  | 'calc'
  | 'ml'
  | 'ga'
  | 'mixed'

export interface SubjectMeta {
  id: SubjectId
  name: string
  exam: Exam
  color: string // tailwind color token name
}

export const SUBJECTS: Record<SubjectId, SubjectMeta> = {
  dbms: { id: 'dbms', name: 'DBMS & Warehousing', exam: 'BOTH', color: 'emerald' },
  dsa: { id: 'dsa', name: 'DSA / Programming', exam: 'BOTH', color: 'teal' },
  os: { id: 'os', name: 'Operating Systems', exam: 'NET', color: 'green' },
  toc: { id: 'toc', name: 'TOC & Compilers', exam: 'NET', color: 'violet' },
  coa: { id: 'coa', name: 'Computer Architecture', exam: 'NET', color: 'orange' },
  disc: { id: 'disc', name: 'Discrete Structures', exam: 'NET', color: 'lime' },
  net: { id: 'net', name: 'Networks', exam: 'NET', color: 'fuchsia' },
  plg: { id: 'plg', name: 'Prog. Languages & Graphics', exam: 'NET', color: 'pink' },
  se: { id: 'se', name: 'Software Engineering', exam: 'NET', color: 'rose' },
  ai: { id: 'ai', name: 'Artificial Intelligence', exam: 'BOTH', color: 'cyan' },
  p1: { id: 'p1', name: 'Paper 1 (General)', exam: 'NET', color: 'slate' },
  ps: { id: 'ps', name: 'Probability & Statistics', exam: 'GATE', color: 'red' },
  la: { id: 'la', name: 'Linear Algebra', exam: 'GATE', color: 'amber' },
  calc: { id: 'calc', name: 'Calculus & Optimization', exam: 'GATE', color: 'yellow' },
  ml: { id: 'ml', name: 'Machine Learning', exam: 'GATE', color: 'purple' },
  ga: { id: 'ga', name: 'General Aptitude (GATE)', exam: 'GATE', color: 'stone' },
  mixed: { id: 'mixed', name: 'Mixed / Both', exam: 'BOTH', color: 'sky' },
}

// tailwind class sets per color token (chip = soft bg + strong text)
export const COLOR_CLASSES: Record<string, { chip: string; dot: string; soft: string }> = {
  emerald: {
    chip: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    dot: 'bg-emerald-500',
    soft: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
  teal: {
    chip: 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300',
    dot: 'bg-teal-500',
    soft: 'bg-teal-50 dark:bg-teal-950/30',
  },
  green: {
    chip: 'bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300',
    dot: 'bg-green-500',
    soft: 'bg-green-50 dark:bg-green-950/30',
  },
  violet: {
    chip: 'bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300',
    dot: 'bg-violet-500',
    soft: 'bg-violet-50 dark:bg-violet-950/30',
  },
  orange: {
    chip: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300',
    dot: 'bg-orange-500',
    soft: 'bg-orange-50 dark:bg-orange-950/30',
  },
  lime: {
    chip: 'bg-lime-100 text-lime-800 dark:bg-lime-950/60 dark:text-lime-300',
    dot: 'bg-lime-500',
    soft: 'bg-lime-50 dark:bg-lime-950/30',
  },
  fuchsia: {
    chip: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950/60 dark:text-fuchsia-300',
    dot: 'bg-fuchsia-500',
    soft: 'bg-fuchsia-50 dark:bg-fuchsia-950/30',
  },
  pink: {
    chip: 'bg-pink-100 text-pink-800 dark:bg-pink-950/60 dark:text-pink-300',
    dot: 'bg-pink-500',
    soft: 'bg-pink-50 dark:bg-pink-950/30',
  },
  rose: {
    chip: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
    dot: 'bg-rose-500',
    soft: 'bg-rose-50 dark:bg-rose-950/30',
  },
  cyan: {
    chip: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300',
    dot: 'bg-cyan-500',
    soft: 'bg-cyan-50 dark:bg-cyan-950/30',
  },
  slate: {
    chip: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
    dot: 'bg-slate-500',
    soft: 'bg-slate-100 dark:bg-slate-900/40',
  },
  red: {
    chip: 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300',
    dot: 'bg-red-500',
    soft: 'bg-red-50 dark:bg-red-950/30',
  },
  amber: {
    chip: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
    dot: 'bg-amber-500',
    soft: 'bg-amber-50 dark:bg-amber-950/30',
  },
  yellow: {
    chip: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-300',
    dot: 'bg-yellow-500',
    soft: 'bg-yellow-50 dark:bg-yellow-950/30',
  },
  purple: {
    chip: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300',
    dot: 'bg-purple-500',
    soft: 'bg-purple-50 dark:bg-purple-950/30',
  },
  stone: {
    chip: 'bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-300',
    dot: 'bg-stone-500',
    soft: 'bg-stone-100 dark:bg-stone-900/40',
  },
  sky: {
    chip: 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300',
    dot: 'bg-sky-500',
    soft: 'bg-sky-50 dark:bg-sky-950/30',
  },
}

// ── Daily habits (non-negotiables from both plans) ──────────────────────────
export interface HabitDef {
  id: string
  label: string
  desc: string
}

export const HABITS: HabitDef[] = [
  { id: 'sleep', label: '7+ hrs sleep', desc: 'Sleep is a performance aid, not a luxury' },
  { id: 'morning', label: 'Morning block on time', desc: 'Started within 15 min of plan' },
  { id: 'flashcards', label: 'Flashcards (D1 rep)', desc: 'Same-day cards made & swept' },
  { id: 'errorlog', label: 'Error log updated', desc: 'One row per miss, root cause tagged' },
  { id: 'p1ga', label: 'P1 / GA drill', desc: '25-min Paper 1 or 15-min GA set' },
  { id: 'code', label: 'Coding touch', desc: '15 min code tracing — daily' },
  { id: 'exercise', label: 'Exercise 20–30 min', desc: 'Sustainability beats hero days' },
  { id: 'plan', label: 'Tomorrow planned', desc: '3 lines: priorities for next day' },
]

// ── Dates ───────────────────────────────────────────────────────────────────
export const PLAN_START_ISO = '2026-09-28' // Monday
export const PLAN_END_ISO = '2027-02-07'
export const NET_EXAM_ISO = '2026-12-13' // expected mid-December window
export const GATE_EXAM_ISO = '2027-02-07' // expected first weekend of February

export const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function isoToDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

export function addDays(iso: string, days: number): string {
  const dt = isoToDate(iso)
  dt.setUTCDate(dt.getUTCDate() + days)
  return dt.toISOString().slice(0, 10)
}

export function formatISO(iso: string): string {
  const dt = isoToDate(iso)
  return `${dt.getUTCDate()} ${MONTHS[dt.getUTCMonth()]} ${dt.getUTCFullYear()}`
}

export function formatISODay(iso: string): string {
  const dt = isoToDate(iso)
  return `${dt.getUTCDate()} ${MONTHS[dt.getUTCMonth()]}`
}

export function todayISO(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date())
}

export function daysBetween(fromISO: string, toISO: string): number {
  return Math.round((isoToDate(toISO).getTime() - isoToDate(fromISO).getTime()) / 86400000)
}

// returns [week 1-19, dayIndex 0-6] if today is inside the plan window
export function locateToday(): { week: number; day: number } | null {
  const t = todayISO()
  if (t < PLAN_START_ISO || t > PLAN_END_ISO) return null
  const offset = daysBetween(PLAN_START_ISO, t)
  const week = Math.floor(offset / 7) + 1
  const day = offset % 7
  return { week: Math.min(19, Math.max(1, week)), day }
}

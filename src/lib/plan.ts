// ─────────────────────────────────────────────────────────────────────────────
// Plan index — expands week specs into dated days & keyed blocks,
// plus derived stats helpers.
// ─────────────────────────────────────────────────────────────────────────────
import {
  BlockSpec, DaySpec, Exam, PLAN_START_ISO, SubjectId, WeekSpec, addDays, formatISODay, formatISO,
} from './plan-types'
import { WEEKS_A } from './plan-weeks-a'
import { WEEKS_B } from './plan-weeks-b'

export * from './plan-types'

export const PHASES: Record<number, { name: string; short: string }> = {
  1: { name: 'Phase 1 · Coverage Sprint (NET primary)', short: 'Coverage' },
  2: { name: 'Phase 2 · NET PYQ Marathon & Exam', short: 'NET Peak' },
  3: { name: 'Phase 3 · GATE Foundation Completion', short: 'GATE Build' },
  4: { name: 'Phase 4 · GATE Mock Sprint & Exam', short: 'GATE Peak' },
}

export interface PlanBlock extends BlockSpec {
  key: string
}

export interface PlanDay extends DaySpec {
  date: string // ISO
  dateLabel: string // "28 Sep"
  fullLabel: string // "28 Sep 2026"
  dayName: string
  blocks: PlanBlock[]
  minutes: number
}

export interface PlanWeek extends WeekSpec {
  phaseName: string
  startDate: string
  endDate: string
  rangeLabel: string
  days: PlanDay[]
  minutes: number
}

function buildWeek(spec: WeekSpec): PlanWeek {
  const monday = addDays(PLAN_START_ISO, (spec.week - 1) * 7)
  const days: PlanDay[] = spec.days.map((d: DaySpec, di) => {
    const date = addDays(monday, di)
    const blocks: PlanBlock[] = d.blocks.map((blk, bi) => ({
      ...blk,
      key: `w${String(spec.week).padStart(2, '0')}-d${di}-b${bi}`,
    }))
    return {
      ...d,
      date,
      dateLabel: formatISODay(date),
      fullLabel: formatISO(date),
      dayName: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][di],
      blocks,
      minutes: blocks.reduce((a, x) => a + x.m, 0),
    }
  })
  return {
    ...spec,
    phaseName: PHASES[spec.phase].name,
    startDate: monday,
    endDate: addDays(monday, 6),
    rangeLabel: `${formatISODay(monday)} – ${formatISODay(addDays(monday, 6))}, ${monday.slice(0, 4)}`,
    days,
    minutes: days.reduce((a, d) => a + d.minutes, 0),
  }
}

export const WEEKS: PlanWeek[] = [...WEEKS_A, ...WEEKS_B].map(buildWeek)

export const ALL_BLOCKS: PlanBlock[] = WEEKS.flatMap((w) => w.days.flatMap((d) => d.blocks))

export const TOTAL_TASKS = ALL_BLOCKS.length
export const TOTAL_MINUTES = ALL_BLOCKS.reduce((a, x) => a + x.m, 0)

// subject-level aggregation for progress bars
export interface SubjectStat {
  id: SubjectId
  name: string
  exam: Exam
  total: number
  minutes: number
}

export const SUBJECT_STATS: SubjectStat[] = (() => {
  const map = new Map<SubjectId, SubjectStat>()
  for (const blk of ALL_BLOCKS) {
    const cur = map.get(blk.sub) ?? {
      id: blk.sub, name: '', exam: 'BOTH' as Exam, total: 0, minutes: 0,
    }
    cur.total += 1
    cur.minutes += blk.m
    map.set(blk.sub, cur)
  }
  return [...map.values()].sort((a, b) => b.total - a.total)
})()

// exam-level aggregation
export const EXAM_STATS: { exam: Exam; total: number; minutes: number }[] = (() => {
  const acc: Record<Exam, { total: number; minutes: number }> = {
    NET: { total: 0, minutes: 0 },
    GATE: { total: 0, minutes: 0 },
    BOTH: { total: 0, minutes: 0 },
  }
  for (const blk of ALL_BLOCKS) {
    acc[blk.e].total += 1
    acc[blk.e].minutes += blk.m
  }
  return (['NET', 'GATE', 'BOTH'] as Exam[]).map((exam) => ({ exam, ...acc[exam] }))
})()

export const KIND_LABEL: Record<BlockSpec['k'], string> = {
  theory: 'Theory',
  practice: 'Practice',
  drill: 'Drill',
  test: 'Test',
  review: 'Review',
  revision: 'Revision',
  admin: 'Admin',
  exam: 'EXAM',
}

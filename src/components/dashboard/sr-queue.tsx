'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Spaced-Repetition Queue — the D1 / D3 / D7 / D21 loop from both exam plans.
// Due dates derive from each block's completion timestamp (API updatedAt, or
// the local mirror's stamp); blocks without any stamp fall back to their
// planned day, so imported or legacy data still lands in the queue.
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo } from 'react'
import { ALL_BLOCKS, SUBJECTS, addDays, formatISODay, WEEKS, type SubjectId } from '@/lib/plan'
import { COLOR_CLASSES } from '@/lib/plan-types'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { AlarmClock, CalendarClock, CheckCircle2, History } from 'lucide-react'

const INTERVALS = [1, 3, 7, 21] as const

// blockKey → subject / title / planned date
const BLOCK_INFO = new Map(ALL_BLOCKS.map((b) => [b.key, { sub: b.sub, t: b.t }]))
const BLOCK_PLAN_DATE = new Map<string, string>(
  WEEKS.flatMap((w) => w.days.flatMap((d) => d.blocks.map((b) => [b.key, d.date] as const)))
)

const KOLKATA_DATE = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' })

/** ISO timestamp → "YYYY-MM-DD" in Asia/Kolkata. */
function stampToDate(stamp: string): string {
  try {
    return KOLKATA_DATE.format(new Date(stamp))
  } catch {
    return stamp.slice(0, 10)
  }
}

interface SrItem {
  key: string
  title: string
  sub: SubjectId
  interval: number
  due: string
}

export default function SrQueue({
  completions,
  completionsAt,
  today,
}: {
  completions: Set<string>
  completionsAt: Record<string, string>
  today: string
}) {
  const { overdue, dueToday, upcoming, countsDueToday, countsOverdue } = useMemo(() => {
    const items: SrItem[] = []
    for (const key of completions) {
      const info = BLOCK_INFO.get(key)
      if (!info) continue
      // completion date: real timestamp → else the block's planned day
      const base = completionsAt[key] ? stampToDate(completionsAt[key]) : (BLOCK_PLAN_DATE.get(key) ?? today)
      for (const n of INTERVALS) {
        items.push({ key, title: info.t, sub: info.sub as SubjectId, interval: n, due: addDays(base, n) })
      }
    }
    const overdueItems = items.filter((i) => i.due < today)
    const todayItems = items.filter((i) => i.due === today)
    const upcomingItems = items
      .filter((i) => i.due > today && i.due <= addDays(today, 3))
      .sort((a, b) => a.due.localeCompare(b.due))
    const byInterval = (list: SrItem[]) =>
      Object.fromEntries(INTERVALS.map((n) => [n, list.filter((i) => i.interval === n).length])) as Record<number, number>
    return {
      overdue: overdueItems.sort((a, b) => a.due.localeCompare(b.due)),
      dueToday: todayItems,
      upcoming: upcomingItems,
      countsDueToday: byInterval(todayItems),
      countsOverdue: byInterval(overdueItems),
    }
  }, [completions, completionsAt, today])

  const totalDue = overdue.length + dueToday.length

  const Row = ({ item, tone }: { item: SrItem; tone: 'rose' | 'teal' | 'stone' }) => {
    const c = COLOR_CLASSES[SUBJECTS[item.sub]?.color ?? 'sky']
    return (
      <div className="flex items-center gap-2 rounded-lg border border-stone-200/80 bg-card px-2 py-1.5 dark:border-stone-800">
        <span className={cn('size-1.5 shrink-0 rounded-full', c.dot)} />
        <span className="min-w-0 flex-1 truncate text-[11px] font-medium">{item.title}</span>
        <Badge
          variant="outline"
          className={cn(
            'shrink-0 rounded-full px-1.5 py-0 text-[9px] font-bold',
            tone === 'rose' && 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300',
            tone === 'teal' && 'border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-300',
            tone === 'stone' && 'text-stone-500 dark:text-stone-400',
          )}
        >
          D{item.interval}
        </Badge>
        <span className="shrink-0 text-[9px] text-stone-400 dark:text-stone-500">{formatISODay(item.due)}</span>
      </div>
    )
  }

  return (
    <div className="space-y-3 px-4 pb-4">
      {/* Interval chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        {totalDue === 0 ? (
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="size-3.5" /> Loop clear — nothing due today
          </span>
        ) : (
          <>
            {overdue.length > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                <History className="size-3" /> {overdue.length} overdue
              </span>
            )}
            <span className="flex items-center gap-1 rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
              <AlarmClock className="size-3" /> {dueToday.length} due today
            </span>
            {INTERVALS.map((n) => (
              <span
                key={n}
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[9px] font-bold',
                  countsDueToday[n] + countsOverdue[n] > 0
                    ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900'
                    : 'bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500',
                )}
                title={`D${n} reps: ${countsDueToday[n]} due today, ${countsOverdue[n]} overdue`}
              >
                D{n}·{countsDueToday[n] + countsOverdue[n]}
              </span>
            ))}
          </>
        )}
      </div>

      <div className="max-h-72 space-y-2 overflow-y-auto pr-1 [scrollbar-width:thin]">
        {/* Overdue */}
        {overdue.length > 0 && (
          <div>
            <p className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-rose-700 dark:text-rose-400">
              <History className="size-3" /> Overdue — re-solve cold, then close the error log
            </p>
            <div className="space-y-1">
              {overdue.slice(0, 12).map((i) => (
                <Row key={`${i.key}-${i.interval}`} item={i} tone="rose" />
              ))}
              {overdue.length > 12 && (
                <p className="pl-1 text-[10px] text-stone-400">+{overdue.length - 12} more overdue items…</p>
              )}
            </div>
          </div>
        )}

        {/* Due today */}
        {dueToday.length > 0 && (
          <div>
            <p className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-teal-700 dark:text-teal-400">
              <AlarmClock className="size-3" /> Due today ({formatISODay(today)})
            </p>
            <div className="space-y-1">
              {dueToday.map((i) => (
                <Row key={`${i.key}-${i.interval}`} item={i} tone="teal" />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div>
            <p className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              <CalendarClock className="size-3" /> Next 3 days
            </p>
            <div className="space-y-1">
              {upcoming.slice(0, 8).map((i) => (
                <Row key={`${i.key}-${i.interval}`} item={i} tone="stone" />
              ))}
            </div>
          </div>
        )}

        {totalDue === 0 && upcoming.length === 0 && (
          <div className="rounded-xl border border-dashed border-stone-300 py-6 text-center dark:border-stone-700">
            <p className="text-xs text-muted-foreground">Complete blocks to build your D1/D3/D7/D21 revision loop.</p>
            <p className="mt-1 max-w-[240px] text-[10px] text-stone-400 dark:text-stone-500">
              Every completed block schedules four revisit reps — the loop both exam plans treat as non-negotiable.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

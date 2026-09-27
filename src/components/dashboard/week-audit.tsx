'use client'

// Weekly audit ritual — every plan ends the week with a Sunday review loop.
// Persisted per week (setting key `audit:W{n}`), with live status chips so the
// checklist starts half-honest: the block-% item self-reports from real data.

import { useCallback, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { loadSettingsMap, saveSetting } from '@/lib/store'
import { motion } from 'framer-motion'
import { CalendarCheck2, ClipboardCheck, RotateCcw } from 'lucide-react'

interface AuditItem {
  id: string
  label: string
  hint: string
  live?: (ctx: { weekPct: number }) => { text: string; tone: 'good' | 'warn' } | null
}

const ITEMS: AuditItem[] = [
  {
    id: 'blocks',
    label: 'Weekly blocks ≥ 90% done',
    hint: 'The plan survives on volume — an unfinished week compounds',
    live: ({ weekPct }) =>
      weekPct >= 90
        ? { text: `${weekPct}% now`, tone: 'good' }
        : { text: `${weekPct}% now`, tone: 'warn' },
  },
  {
    id: 'errors',
    label: 'Error log reviewed — every miss has a root cause',
    hint: 'concept / process / judgement / trap — tag it before you forget',
  },
  {
    id: 'redrill',
    label: 'Top 3 misses re-solved from scratch, no notes',
    hint: 'The error log is only worth its re-drill loop',
  },
  {
    id: 'sr',
    label: 'SR queue cleared — zero overdue D1/D3/D7/D21 reps',
    hint: 'Open the SR Queue tab and drain it to zero',
  },
  {
    id: 'sheet',
    label: 'Formula / one-pager sheet updated for this week',
    hint: 'Ten lines now beats forty before the exam',
  },
  {
    id: 'next',
    label: 'Next week planned: mock scheduled + weak-topic list',
    hint: 'Write the two weakest topics at the top of next week',
  },
]

const KEY = (week: number) => `audit:W${week}`

export default function WeekAudit({
  week, weekPct, isSunday,
}: {
  week: number
  weekPct: number
  isSunday: boolean
}) {
  const [done, setDone] = useState<Set<string>>(new Set())
  const [loadedWeek, setLoadedWeek] = useState(week)

  useEffect(() => {
    let alive = true
    loadSettingsMap().then((settings) => {
      if (!alive) return
      try {
        const arr = JSON.parse(settings[KEY(week)] ?? '[]')
        setDone(new Set(Array.isArray(arr) ? arr.filter((x) => typeof x === 'string') : []))
      } catch {
        setDone(new Set())
      }
      setLoadedWeek(week)
    })
    return () => { alive = false }
  }, [week])

  const toggle = useCallback(
    (id: string, next: boolean) => {
      setDone((prev) => {
        const s = new Set(prev)
        if (next) s.add(id)
        else s.delete(id)
        saveSetting(KEY(week), JSON.stringify([...s]))
        return s
      })
    },
    [week],
  )

  const resetWeek = useCallback(() => {
    setDone(new Set())
    saveSetting(KEY(week), '[]')
  }, [week])

  const count = ITEMS.filter((i) => done.has(i.id)).length
  const allDone = count === ITEMS.length
  // Until the new week's state arrives, show items unchecked instead of the
  // previous week's ticks (week is switching).
  const shown = loadedWeek === week ? done : new Set<string>()
  const shownCount = ITEMS.filter((i) => shown.has(i.id)).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'rounded-2xl border p-4 shadow-sm transition-colors',
        allDone
          ? 'border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/25'
          : isSunday
            ? 'border-teal-300 bg-teal-50/50 dark:border-teal-800 dark:bg-teal-950/20'
            : 'border-stone-200/80 bg-card dark:border-stone-800',
      )}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <ClipboardCheck className={cn('size-4', allDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-500 dark:text-stone-400')} />
        <h3 className="text-sm font-semibold">Weekly Audit · W{week}</h3>
        {isSunday && (
          <span className="flex items-center gap-1 rounded-full bg-teal-600 px-2 py-0.5 text-[9px] font-bold text-white">
            <CalendarCheck2 className="size-2.5" /> SUNDAY RITUAL
          </span>
        )}
        <span className={cn(
          'ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums',
          allDone && loadedWeek === week
            ? 'bg-emerald-500 text-white'
            : 'bg-stone-200 text-stone-600 dark:bg-stone-800 dark:text-stone-300',
        )}>
          {shownCount}/{ITEMS.length}
        </span>
        {shownCount > 0 && (
          <button
            onClick={resetWeek}
            aria-label="Reset weekly audit"
            title="Reset this week's audit"
            className="grid size-6 place-items-center rounded-md text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-stone-800 dark:hover:text-stone-300"
          >
            <RotateCcw className="size-3" />
          </button>
        )}
      </div>

      <ul className="space-y-1.5">
        {ITEMS.map((item) => {
          const checked = shown.has(item.id)
          const live = item.live?.({ weekPct })
          return (
            <li key={item.id}>
              <label
                className={cn(
                  'group flex cursor-pointer items-start gap-2.5 rounded-xl border p-2 transition-all',
                  checked
                    ? 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/20'
                    : 'border-transparent bg-stone-50 hover:border-stone-200 dark:bg-stone-900/50 dark:hover:border-stone-700',
                )}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(v) => toggle(item.id, v === true)}
                  aria-label={`Audit: ${item.label}`}
                  className="mt-0.5 size-4 shrink-0 rounded-md data-[state=checked]:border-emerald-600 data-[state=checked]:bg-emerald-600"
                />
                <span className="min-w-0 flex-1">
                  <span className={cn(
                    'block text-xs font-semibold leading-snug',
                    checked && 'text-emerald-700 line-through decoration-emerald-400/70 dark:text-emerald-300',
                  )}>
                    {item.label}
                  </span>
                  <span className="mt-0.5 block text-[10px] leading-snug text-stone-400 dark:text-stone-500">{item.hint}</span>
                </span>
                {live && !checked && (
                  <span className={cn(
                    'shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold tabular-nums',
                    live.tone === 'good'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
                  )}>
                    {live.text}
                  </span>
                )}
              </label>
            </li>
          )
        })}
      </ul>

      {allDone && loadedWeek === week ? (
        <p className="mt-2.5 rounded-lg bg-emerald-100/80 px-2.5 py-1.5 text-center text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
          Week audited &amp; sealed — carry the weak-topic list into W{Math.min(19, week + 1)}
        </p>
      ) : (
        <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-stone-200/70 dark:bg-stone-800">
          <div className="h-full rounded-full bg-teal-500 transition-all duration-300" style={{ width: `${(shownCount / ITEMS.length) * 100}%` }} />
        </div>
      )}
    </motion.div>
  )
}

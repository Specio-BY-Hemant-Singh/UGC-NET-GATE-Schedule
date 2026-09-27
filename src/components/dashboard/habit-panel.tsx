'use client'

import { COLOR_CLASSES } from '@/lib/plan-types'
import { addDays, formatISODay, type HabitDef } from '@/lib/plan'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCheck, Flame, MoonStar, PenLine, RefreshCcw, Scissors, AlarmClock, Dumbbell, ListTodo, BookOpenCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const HABIT_ICONS: Record<string, LucideIcon> = {
  sleep: MoonStar,
  morning: AlarmClock,
  flashcards: BookOpenCheck,
  errorlog: PenLine,
  p1ga: RefreshCcw,
  code: Scissors,
  exercise: Dumbbell,
  plan: ListTodo,
}

interface HabitPanelProps {
  date: string
  habits: HabitDef[]
  log: Set<string>
  onToggle: (date: string, habitId: string, next: boolean) => void
  streak: number
}

export default function HabitPanel({ date, habits, log, onToggle, streak }: HabitPanelProps) {
  const key = (d: string, id: string) => `${d}|${id}`
  const doneCount = habits.filter((h) => log.has(key(date, h.id))).length
  const allDone = doneCount === habits.length

  const last7 = Array.from({ length: 7 }, (_, i) => addDays(date, -(6 - i)))

  const toggleAll = (next: boolean) => {
    for (const h of habits) onToggle(date, h.id, next)
  }

  return (
    <Card className="rounded-2xl border-stone-200/80 shadow-sm dark:border-stone-800">
      <CardHeader className="flex flex-row flex-wrap items-center gap-2 pb-2 pt-4">
        <div className="min-w-0 flex-1">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            Daily Habits
            <span className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700 dark:bg-orange-950/60 dark:text-orange-300">
              <Flame className="size-3" /> {streak}d streak
            </span>
          </CardTitle>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {formatISODay(date)} · {doneCount}/{habits.length} done · 6+ keeps the streak alive
          </p>
        </div>
        <Button
          variant={allDone ? 'outline' : 'secondary'}
          size="sm"
          className="h-8 gap-1 rounded-lg text-xs"
          onClick={() => toggleAll(!allDone)}
        >
          <CheckCheck className="size-3.5" />
          {allDone ? 'Clear' : 'All done'}
        </Button>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid grid-cols-2 gap-2">
          {habits.map((h) => {
            const done = log.has(key(date, h.id))
            const Icon = HABIT_ICONS[h.id] ?? RefreshCcw
            return (
              <button
                key={h.id}
                onClick={() => onToggle(date, h.id, !done)}
                aria-pressed={done}
                title={h.desc}
                className={cn(
                  'flex items-start gap-2 rounded-xl border p-2.5 text-left transition-all',
                  done
                    ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40'
                    : 'border-stone-200 bg-card hover:border-stone-300 hover:shadow-sm dark:border-stone-800 dark:hover:border-stone-700',
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border',
                    done
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-stone-300 text-transparent dark:border-stone-700',
                  )}
                >
                  <Icon className="size-3" />
                </span>
                <span className="min-w-0">
                  <span className={cn('block truncate text-xs font-semibold', done && 'text-emerald-800 dark:text-emerald-300')}>
                    {h.label}
                  </span>
                  <span className="block truncate text-[10px] text-muted-foreground">{h.desc}</span>
                </span>
              </button>
            )
          })}
        </div>

        {/* 7-day matrix */}
        <div className="mt-4">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-stone-500 dark:text-stone-400">
            Last 7 days
          </p>
          <div className="overflow-x-auto [scrollbar-width:thin]">
            <table className="w-full min-w-[300px] border-separate border-spacing-y-1">
              <tbody>
                {habits.map((h) => (
                  <tr key={h.id}>
                    <td className="w-24 max-w-28 truncate pr-1 text-[10px] font-medium text-muted-foreground">{h.label}</td>
                    {last7.map((d) => {
                      const done = log.has(key(d, h.id))
                      return (
                        <td key={d} className="text-center">
                          <span
                            title={`${h.label} · ${d}`}
                            className={cn(
                              'inline-block size-2.5 rounded-full',
                              done ? COLOR_CLASSES.emerald.dot : 'bg-stone-200 dark:bg-stone-800',
                            )}
                          />
                        </td>
                      )
                    })}
                  </tr>
                ))}
                <tr>
                  <td className="pt-0.5 text-[10px] text-muted-foreground" />
                  {last7.map((d) => (
                    <td key={d} className="pt-0.5 text-center text-[8px] font-semibold text-muted-foreground">
                      {formatISODay(d).split(' ')[0]}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

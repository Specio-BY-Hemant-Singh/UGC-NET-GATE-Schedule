'use client'

import { useMemo } from 'react'
import { KIND_LABEL, PHASES, SUBJECTS, type PlanWeek, type SubjectId, type SubjectMeta } from '@/lib/plan'
import { COLOR_CLASSES } from '@/lib/plan-types'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  BookOpen, Crosshair, Flag, ListChecks, PenLine, RotateCcw, Target, Timer,
} from 'lucide-react'
import type { BlockKind, Exam } from '@/lib/plan'

const KIND_ICON: Record<BlockKind, typeof BookOpen> = {
  theory: BookOpen,
  practice: PenLine,
  drill: Crosshair,
  test: Timer,
  review: RotateCcw,
  revision: RotateCcw,
  admin: ListChecks,
  exam: Flag,
}

const EXAM_STYLES: Record<Exam, string> = {
  NET: 'border-teal-300 bg-teal-50 text-teal-800 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-300',
  GATE: 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
  BOTH: 'border-violet-300 bg-violet-50 text-violet-800 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-300',
}

const PHASE_BADGE: Record<number, string> = {
  1: 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
  2: 'border-teal-300 bg-teal-50 text-teal-800 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-300',
  3: 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
  4: 'border-orange-300 bg-orange-50 text-orange-800 dark:border-orange-800 dark:bg-orange-950/50 dark:text-orange-300',
}

const DAY_TONE: Record<string, string> = {
  weekday: 'border-stone-200 bg-card dark:border-stone-800',
  saturday: 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/20',
  sunday: 'border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-900/40',
  mock: 'border-amber-300 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-950/25',
  exam: 'border-rose-300 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/30',
}

const DAY_LABEL: Record<string, string> = {
  weekday: 'Weekday grid · 4.75 h',
  saturday: 'Saturday · consolidation',
  sunday: 'Sunday · light maintenance',
  mock: 'MOCK DAY · full-length rehearsal',
  exam: 'EXAM DAY',
}

const COLOR_MAP: Record<string, { chip: string; dot: string; soft: string }> = Object.fromEntries(
  Object.entries(SUBJECTS).map(([id, meta]) => [id, COLOR_CLASSES[meta.color] ?? COLOR_CLASSES.sky])
)

interface WeekViewProps {
  week: PlanWeek
  dayIndex: number
  onDayChange: (d: number) => void
  completions: Set<string>
  onToggleBlock: (key: string, next: boolean) => void
  onSetDay: (keys: string[], next: boolean) => void
  today: string
}

export default function WeekView({
  week, dayIndex, onDayChange, completions, onToggleBlock, onSetDay, today,
}: WeekViewProps) {
  const dayCounts = useMemo(
    () => week.days.map((d) => d.blocks.filter((b) => completions.has(b.key)).length),
    [week, completions]
  )
  const sel = week.days[dayIndex]
  const allDone = sel && sel.blocks.length > 0 && sel.blocks.every((b) => completions.has(b.key))
  const isToday = sel?.date === today

  return (
    <div className="space-y-3">
      {/* Week overview card */}
      <Card className="rounded-2xl border-stone-200/80 shadow-sm dark:border-stone-800">
        <CardHeader className="flex flex-row flex-wrap items-start gap-2 pb-2 pt-4">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-1.5">
              <Badge variant="outline" className={cn('rounded-full border px-2 py-0.5 text-[10px] font-bold', PHASE_BADGE[week.phase])}>
                {PHASES[week.phase].short}
              </Badge>
              <span className="text-[11px] font-medium text-muted-foreground">
                Week {week.week} · {week.rangeLabel}
              </span>
              <Badge variant="outline" className="rounded-full border-stone-300 px-2 py-0.5 text-[10px] font-semibold text-stone-600 dark:border-stone-700 dark:text-stone-400">
                {week.focus}
              </Badge>
            </div>
            <CardTitle className="text-base leading-snug sm:text-lg">{week.title}</CardTitle>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold leading-none">
              {(week.minutes / 60).toFixed(1)}
              <span className="ml-0.5 text-xs font-medium text-muted-foreground">h / wk</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="mb-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/70 p-2.5 dark:border-amber-900 dark:bg-amber-950/30">
            <Target className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-400">Exit milestone</p>
              <p className="text-xs font-medium text-amber-900 dark:text-amber-200">{week.milestone}</p>
            </div>
          </div>
          <ul className="space-y-1">
            {week.notes.map((n, i) => (
              <li key={i} className="flex gap-2 text-xs text-muted-foreground">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-stone-400 dark:bg-stone-600" />
                {n}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Day tabs */}
      <div className="grid grid-cols-7 gap-1.5">
        {week.days.map((d, i) => {
          const total = d.blocks.length
          const done = dayCounts[i]
          const active = i === dayIndex
          const full = total > 0 && done === total
          return (
            <button
              key={i}
              onClick={() => onDayChange(i)}
              className={cn(
                'relative rounded-xl border px-1 py-2 text-center transition-all',
                active
                  ? 'border-stone-900 bg-stone-900 text-white shadow-md dark:border-white dark:bg-white dark:text-stone-900'
                  : 'border-stone-200 bg-card hover:border-stone-400 dark:border-stone-800',
                d.date === today && !active && 'ring-2 ring-teal-400 ring-offset-1 dark:ring-offset-stone-950',
              )}
            >
              <div className="text-[10px] font-semibold uppercase tracking-wide opacity-80">{d.dayName.slice(0, 3)}</div>
              <div className={cn('text-[11px] font-bold', active ? 'opacity-90' : 'text-muted-foreground')}>{d.dateLabel}</div>
              <div className="mt-1 flex justify-center gap-0.5">
                {Array.from({ length: Math.min(total, 6) }).map((_, bi) => (
                  <span
                    key={bi}
                    className={cn(
                      'size-1 rounded-full',
                      bi < Math.min(done, 6)
                        ? active ? 'bg-white dark:bg-stone-900' : 'bg-emerald-500'
                        : active ? 'bg-white/30 dark:bg-stone-300' : 'bg-stone-300 dark:bg-stone-700',
                    )}
                  />
                ))}
              </div>
              {full && <span className="absolute right-1 top-1 size-1.5 rounded-full bg-emerald-500" title="Day complete" />}
            </button>
          )
        })}
      </div>

      {/* Day card */}
      {sel && (
        <Card className={cn('rounded-2xl border shadow-sm', DAY_TONE[sel.kind])}>
          <CardHeader className="flex flex-row flex-wrap items-center gap-2 pb-3 pt-4">
            <div className="min-w-0 flex-1">
              <CardTitle className="flex flex-wrap items-center gap-2 text-base">
                {sel.dayName}
                <span className="text-sm font-normal text-muted-foreground">{sel.fullLabel}</span>
                {isToday && (
                  <Badge className="rounded-full bg-teal-600 px-2 py-0.5 text-[10px] font-bold hover:bg-teal-600">TODAY</Badge>
                )}
              </CardTitle>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {DAY_LABEL[sel.kind]} · {sel.blocks.length} blocks · {(sel.minutes / 60).toFixed(2)} h
              </p>
            </div>
            <Button
              variant={allDone ? 'outline' : 'secondary'}
              size="sm"
              className="h-8 rounded-lg text-xs"
              onClick={() => onSetDay(sel.blocks.map((b) => b.key), !allDone)}
            >
              {allDone ? 'Reset day' : 'Complete day'}
            </Button>
          </CardHeader>
          <CardContent className="space-y-2.5 pb-4">
            {sel.blocks.map((blk, bi) => {
              const done = completions.has(blk.key)
              const KindIcon = KIND_ICON[blk.k]
              const subj = SUBJECTS[blk.sub as SubjectId] as SubjectMeta | undefined
              const subjColor = COLOR_MAP[blk.sub] ?? COLOR_MAP.mixed
              return (
                <motion.div
                  key={blk.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(bi * 0.05, 0.3), duration: 0.28, ease: 'easeOut' }}
                  className={cn(
                    'flex gap-3 rounded-xl border border-stone-200/80 bg-card p-3 transition-all dark:border-stone-800',
                    done ? 'opacity-65' : 'hover:border-stone-300 hover:shadow-sm dark:hover:border-stone-700',
                    blk.k === 'exam' && 'border-rose-300 dark:border-rose-800',
                  )}
                >
                  <Checkbox
                    checked={done}
                    onCheckedChange={(v) => onToggleBlock(blk.key, v === true)}
                    aria-label={`Mark "${blk.t}" as ${done ? 'incomplete' : 'complete'}`}
                    className="mt-0.5 size-5 shrink-0 rounded-full data-[state=checked]:border-emerald-600 data-[state=checked]:bg-emerald-600"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded-md bg-stone-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                        {blk.s}
                      </span>
                      <span className={cn('rounded-md px-1.5 py-0.5 text-[10px] font-bold', subjColor.chip)}>
                        {subj?.name ?? blk.sub}
                      </span>
                      <Badge variant="outline" className={cn('rounded-full px-1.5 py-0 text-[9px] font-bold', EXAM_STYLES[blk.e])}>
                        {blk.e}
                      </Badge>
                      <span className="flex items-center gap-1 text-[10px] font-medium text-stone-500 dark:text-stone-400">
                        <KindIcon className="size-3" /> {KIND_LABEL[blk.k]}
                      </span>
                      <span className="text-[10px] text-stone-400 dark:text-stone-500">{blk.m} min</span>
                    </div>
                    <p className={cn('mt-1.5 text-sm font-semibold leading-snug', done && 'line-through decoration-stone-400')}>
                      {blk.t}
                    </p>
                    <ul className="mt-1 space-y-0.5">
                      {blk.st.map((s, si) => (
                        <li key={si} className="flex gap-1.5 text-xs leading-relaxed text-stone-600 dark:text-stone-400">
                          <span className="mt-[7px] size-1 shrink-0 rounded-full bg-stone-300 dark:bg-stone-600" />
                          {s}
                        </li>
                      ))}
                    </ul>
                    {blk.task && (
                      <p className="mt-1.5 rounded-md bg-stone-50 px-2 py-1 text-[11px] italic text-stone-500 dark:bg-stone-900/60 dark:text-stone-400">
                        {blk.task}
                      </p>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

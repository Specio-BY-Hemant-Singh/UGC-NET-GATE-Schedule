'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ALL_BLOCKS, EXAM_STATS, HABITS, KIND_LABEL, NET_EXAM_ISO, GATE_EXAM_ISO, PHASES, SUBJECTS,
  SUBJECT_STATS, TOTAL_MINUTES, TOTAL_TASKS, WEEKS, addDays, daysBetween, locateToday,
  todayISO, type BlockKind, type Exam, type SubjectId,
} from '@/lib/plan'
import { COLOR_CLASSES } from '@/lib/plan-types'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import WeekView from './week-view'
import HabitPanel from './habit-panel'
import ErrorLogPanel from './error-log-panel'
import MockLedger from './mock-ledger'
import PatternIntelCard from './pattern-intel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BookOpen, CalendarCheck2, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Crosshair,
  Flag, Flame, GraduationCap, ListChecks, Moon, PenLine, RotateCcw, Sun, Target, Timer,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'

const MINUTES_BY_KEY: Map<string, number> = new Map(ALL_BLOCKS.map((b) => [b.key, b.m]))

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

const PHASE_TONE: Record<number, string> = {
  1: 'bg-emerald-500',
  2: 'bg-teal-500',
  3: 'bg-amber-500',
  4: 'bg-orange-500',
}

function useCountdown(iso: string): number {
  return useMemo(() => daysBetween(todayISO(), iso), [iso])
}

function ExamCountdown({ label, iso, tone }: { label: string; iso: string; tone: 'teal' | 'amber' }) {
  const days = useCountdown(iso)
  const chip =
    tone === 'teal'
      ? 'border-teal-300 bg-teal-50 text-teal-800 dark:border-teal-800 dark:bg-teal-950/60 dark:text-teal-300'
      : 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
  const dot = tone === 'teal' ? 'bg-teal-500' : 'bg-amber-500'
  return (
    <Badge variant="outline" className={cn('gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold', chip)}>
      <span className={cn('size-1.5 rounded-full', dot)} />
      {label} · {days >= 0 ? `D-${days}` : 'done'}
    </Badge>
  )
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      className="size-8 rounded-lg"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <Moon className="hidden size-4 dark:block" />
      <Sun className="size-4 dark:hidden" />
    </Button>
  )
}

function StatCard({
  icon: Icon, label, children,
}: { icon: typeof Clock3; label: string; children: React.ReactNode }) {
  return (
    <Card className="rounded-2xl border-stone-200/80 shadow-sm dark:border-stone-800">
      <CardHeader className="flex flex-row items-center gap-2 pb-1 pt-3">
        <Icon className="size-4 text-stone-500 dark:text-stone-400" />
        <CardTitle className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">{children}</CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const { toast } = useToast()
  const [completions, setCompletions] = useState<Set<string>>(new Set())
  const [habits, setHabits] = useState<Set<string>>(new Set())
  const [loaded, setLoaded] = useState(false)
  const [week, setWeek] = useState<number>(() => locateToday()?.week ?? 1)
  const [day, setDay] = useState<number>(() => locateToday()?.day ?? 0)
  const [syncedAt, setSyncedAt] = useState<Date | null>(null)

  const today = todayISO()
  const located = locateToday()

  // ── initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    let alive = true
    Promise.all([
      fetch('/api/progress').then((r) => r.json()),
      fetch('/api/habits').then((r) => r.json()),
      fetch('/api/settings').then((r) => r.json()),
    ])
      .then(([p, h, s]: [{ completions?: { blockKey: string }[] }, { habits?: { date: string; habitId: string }[] }, { settings?: Record<string, string> }]) => {
        if (!alive) return
        setCompletions(new Set((p.completions ?? []).map((x) => x.blockKey)))
        setHabits(new Set((h.habits ?? []).map((x) => `${x.date}|${x.habitId}`)))
        const lw = Number(s.settings?.lastWeek)
        const ld = Number(s.settings?.lastDay)
        if (lw >= 1 && lw <= 19) setWeek(lw)
        if (ld >= 0 && ld <= 6) setDay(ld)
        setSyncedAt(new Date())
        setLoaded(true)
      })
      .catch(() => {
        if (alive) {
          toast({ title: 'Could not load saved progress', description: 'Working offline — changes will not persist.', variant: 'destructive' })
          setLoaded(true)
        }
      })
    return () => { alive = false }
  }, [])

  // ── persist last location ────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'lastWeek', value: String(week) }),
    }).catch(() => {})
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'lastDay', value: String(day) }),
    }).catch(() => {})
  }, [week, day, loaded])

  const toggleBlock = useCallback(
    (key: string, next: boolean) => {
      setCompletions((prev) => {
        const s = new Set(prev)
        if (next) s.add(key)
        else s.delete(key)
        return s
      })
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockKey: key, completed: next }),
      })
        .then(() => setSyncedAt(new Date()))
        .catch(() => {
          setCompletions((prev) => {
            const s = new Set(prev)
            if (next) s.delete(key)
            else s.add(key)
            return s
          })
          toast({ title: 'Save failed', description: 'Progress change was rolled back.', variant: 'destructive' })
        })
    },
    [toast]
  )

  const setDayBlocks = useCallback(
    (keys: string[], next: boolean) => {
      setCompletions((prev) => {
        const s = new Set(prev)
        for (const k of keys) {
          if (next) s.add(k)
          else s.delete(k)
        }
        return s
      })
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: keys.map((blockKey) => ({ blockKey, completed: next })) }),
      })
        .then(() => setSyncedAt(new Date()))
        .catch(() => toast({ title: 'Save failed', variant: 'destructive' }))
    },
    [toast]
  )

  const toggleHabit = useCallback(
    (date: string, habitId: string, next: boolean) => {
      const key = `${date}|${habitId}`
      setHabits((prev) => {
        const s = new Set(prev)
        if (next) s.add(key)
        else s.delete(key)
        return s
      })
      fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, habitId, done: next }),
      })
        .then(() => setSyncedAt(new Date()))
        .catch(() => {
          setHabits((prev) => {
            const s = new Set(prev)
            if (next) s.delete(key)
            else s.add(key)
            return s
          })
          toast({ title: 'Save failed', variant: 'destructive' })
        })
    },
    [toast]
  )

  // ── derived stats ─────────────────────────────────────────────────────────
  const doneMinutes = useMemo(() => {
    let m = 0
    for (const k of completions) m += MINUTES_BY_KEY.get(k) ?? 0
    return m
  }, [completions])

  const weekPlan = WEEKS[week - 1]
  const weekDone = useMemo(
    () => weekPlan.days.reduce((a, d) => a + d.blocks.filter((b) => completions.has(b.key)).length, 0),
    [weekPlan, completions]
  )
  const weekTotal = weekPlan.days.reduce((a, d) => a + d.blocks.length, 0)

  const habitKey = (date: string, id: string) => `${date}|${id}`
  const habitsDoneOn = useCallback((date: string) => HABITS.filter((h) => habits.has(habitKey(date, h.id))).length, [habits])

  const streak = useMemo(() => {
    let s = 0
    let cursor = today
    if (habitsDoneOn(cursor) < HABITS.length - 2) cursor = addDays(cursor, -1)
    while (habitsDoneOn(cursor) >= HABITS.length - 2 && s < 365) {
      s += 1
      cursor = addDays(cursor, -1)
    }
    return s
  }, [habitsDoneOn, today])

  const subjectProgress = useMemo(() => {
    const doneMap = new Map<SubjectId, number>()
    for (const blk of ALL_BLOCKS) if (completions.has(blk.key)) doneMap.set(blk.sub, (doneMap.get(blk.sub) ?? 0) + 1)
    return SUBJECT_STATS.map((s) => ({ ...s, done: doneMap.get(s.id) ?? 0 }))
  }, [completions])

  const examProgress = useMemo(() => {
    const doneMap = new Map<Exam, number>()
    for (const blk of ALL_BLOCKS) if (completions.has(blk.key)) doneMap.set(blk.e, (doneMap.get(blk.e) ?? 0) + 1)
    return EXAM_STATS.map((s) => ({ ...s, done: doneMap.get(s.exam) ?? 0 }))
  }, [completions])

  const overallPct = TOTAL_TASKS ? Math.round((completions.size / TOTAL_TASKS) * 100) : 0
  const weekPct = weekTotal ? Math.round((weekDone / weekTotal) * 100) : 0
  const plannedHours = Math.round(TOTAL_MINUTES / 60)
  const doneHours = Math.round(doneMinutes / 60)

  const goToday = () => {
    if (located) {
      setWeek(located.week)
      setDay(located.day)
    } else {
      toast({
        title: today < '2026-09-28' ? 'The campaign starts 28 Sep 2026' : 'The plan window has ended (7 Feb 2027)',
        description: 'Showing Week 1 — use the week pills to navigate.',
      })
      setWeek(1)
      setDay(0)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-stone-100 via-background to-background dark:from-stone-950 dark:via-background dark:to-background">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-background/85 backdrop-blur-md dark:border-stone-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-stone-900 text-white shadow-sm dark:bg-white dark:text-stone-900">
            <GraduationCap className="size-5" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold tracking-tight sm:text-lg">Mission Dual — Exam Command Center</h1>
            <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
              GATE 2027 DA · 95+ &nbsp;×&nbsp; UGC NET Dec 2026 CS · 250+ &nbsp;·&nbsp; 19-week merged execution plan
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <ExamCountdown label="NET" iso={NET_EXAM_ISO} tone="teal" />
            <ExamCountdown label="GATE" iso={GATE_EXAM_ISO} tone="amber" />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-10 pt-5">
        {/* ── Stat cards ───────────────────────────────────────────────────── */}
        <section aria-label="Progress overview" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {([
              <StatCard key="p" icon={CheckCircle2} label="Overall Progress">
                <div className="flex items-end gap-1.5">
                  <span className="text-2xl font-bold leading-none">{overallPct}%</span>
                  <span className="pb-0.5 text-[11px] text-muted-foreground">{completions.size}/{TOTAL_TASKS} blocks</span>
                </div>
                <Progress value={overallPct} className="mt-2 h-1.5" />
              </StatCard>,
              <StatCard key="h" icon={Clock3} label="Hours Banked">
                <div className="flex items-end gap-1.5">
                  <span className="text-2xl font-bold leading-none">{doneHours}h</span>
                  <span className="pb-0.5 text-[11px] text-muted-foreground">of ~{plannedHours}h planned</span>
                </div>
                <Progress value={plannedHours ? (doneMinutes / TOTAL_MINUTES) * 100 : 0} className="mt-2 h-1.5" />
              </StatCard>,
              <StatCard key="s" icon={Flame} label="Habit Streak">
                <div className="flex items-end gap-1.5">
                  <span className="text-2xl font-bold leading-none">{streak}</span>
                  <span className="pb-0.5 text-[11px] text-muted-foreground">day{streak === 1 ? '' : 's'} · 6 of 8 required</span>
                </div>
                <div className="mt-2 flex gap-1">
                  {Array.from({ length: 7 }).map((_, i) => {
                    const d = addDays(today, -(6 - i))
                    const ok = habitsDoneOn(d) >= HABITS.length - 2
                    return <span key={d} className={cn('h-1.5 flex-1 rounded-full', ok ? 'bg-emerald-500' : 'bg-stone-200 dark:bg-stone-800')} />
                  })}
                </div>
              </StatCard>,
              <StatCard key="w" icon={Target} label={`This Week · W${week}`}>
                <div className="flex items-end gap-1.5">
                  <span className="text-2xl font-bold leading-none">{weekPct}%</span>
                  <span className="pb-0.5 text-[11px] text-muted-foreground">{weekDone}/{weekTotal} blocks</span>
                </div>
                <Progress value={weekPct} className="mt-2 h-1.5" />
              </StatCard>,
          ] as React.ReactNode[]).map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35, ease: 'easeOut' }}
            >
              {card}
            </motion.div>
          ))}
        </section>

        {/* ── Exam split ───────────────────────────────────────────────────── */}
        <Card className="mt-3 rounded-2xl border-stone-200/80 shadow-sm dark:border-stone-800">
          <CardContent className="grid gap-3 p-4 sm:grid-cols-3">
            {examProgress.map((e) => {
              const pct = e.total ? Math.round((e.done / e.total) * 100) : 0
              return (
                <div key={e.exam}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <Badge variant="outline" className={cn('rounded-full border px-2 py-0.5 text-[10px] font-semibold', EXAM_STYLES[e.exam])}>
                      {e.exam === 'BOTH' ? 'Shared units' : e.exam}
                    </Badge>
                    <span className="font-medium text-muted-foreground">{e.done}/{e.total}</span>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* ── Pattern intelligence (PYQ-calibrated) ────────────────────────── */}
        <PatternIntelCard />

        {/* ── Week navigator ───────────────────────────────────────────────── */}
        <section aria-label="Week navigation" className="mt-5">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-stone-700 dark:text-stone-300">Campaign Timeline · Week 1 → 19</h2>
            <div className="hidden items-center gap-2.5 text-[10px] font-medium text-muted-foreground md:flex">
              {(['Coverage', 'NET Peak', 'GATE Build', 'GATE Peak'] as const).map((label, i) => (
                <span key={label} className="flex items-center gap-1">
                  <span className={cn('size-1.5 rounded-full', ['bg-emerald-500', 'bg-teal-500', 'bg-amber-500', 'bg-orange-500'][i])} />
                  {label}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" className="h-8 gap-1 rounded-lg" onClick={() => setWeek((w) => Math.max(1, w - 1))} disabled={week <= 1}>
                <ChevronLeft className="size-3.5" /> Prev
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1 rounded-lg" onClick={() => setWeek((w) => Math.min(19, w + 1))} disabled={week >= 19}>
                Next <ChevronRight className="size-3.5" />
              </Button>
              <Button size="sm" className="h-8 gap-1.5 rounded-lg bg-stone-900 hover:bg-stone-700 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200" onClick={goToday}>
                <CalendarCheck2 className="size-3.5" /> Today
              </Button>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]">
            {WEEKS.map((w) => {
              const total = w.days.reduce((a, d) => a + d.blocks.length, 0)
              const done = w.days.reduce((a, d) => a + d.blocks.filter((b) => completions.has(b.key)).length, 0)
              const pct = total ? Math.round((done / total) * 100) : 0
              const active = w.week === week
              const isNow = located?.week === w.week
              return (
                <button
                  key={w.week}
                  onClick={() => { setWeek(w.week) }}
                  aria-current={active}
                  className={cn(
                    'group relative w-[104px] shrink-0 rounded-xl border p-2.5 text-left transition-all',
                    active
                      ? 'border-stone-900 bg-stone-900 text-white shadow-md dark:border-white dark:bg-white dark:text-stone-900'
                      : 'border-stone-200 bg-card hover:border-stone-400 hover:shadow-sm dark:border-stone-800',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">W{w.week}</span>
                    <span className={cn('size-1.5 rounded-full', PHASE_TONE[w.phase])} title={PHASES[w.phase].name} />
                  </div>
                  <div className={cn('mt-0.5 truncate text-[10px]', active ? 'text-white/70 dark:text-stone-600' : 'text-muted-foreground')}>
                    {w.rangeLabel}
                  </div>
                  <div className={cn('mt-1.5 h-1 overflow-hidden rounded-full', active ? 'bg-white/25 dark:bg-stone-300' : 'bg-stone-200 dark:bg-stone-800')}>
                    <div className={cn('h-full rounded-full', active ? 'bg-white dark:bg-stone-900' : 'bg-emerald-500')} style={{ width: `${pct}%` }} />
                  </div>
                  {isNow && (
                    <span className="absolute -top-1.5 -right-1.5 rounded-full bg-teal-500 px-1.5 py-0.5 text-[8px] font-bold text-white shadow">
                      NOW
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        {/* ── Week + Day + Habits ──────────────────────────────────────────── */}
        {!loaded ? (
          <div className="mt-5 space-y-3">
            <Skeleton className="h-36 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        ) : (
          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_340px]">
            <WeekView
              week={weekPlan}
              dayIndex={day}
              onDayChange={setDay}
              completions={completions}
              onToggleBlock={toggleBlock}
              onSetDay={setDayBlocks}
              today={today}
            />
            <div className="space-y-4">
              <HabitPanel
                date={weekPlan.days[day]?.date ?? today}
                habits={HABITS}
                log={habits}
                onToggle={toggleHabit}
                streak={streak}
              />
              <Card className="rounded-2xl border-stone-200/80 shadow-sm dark:border-stone-800">
                <Tabs defaultValue="errors">
                  <TabsList className="mx-4 mt-4 grid w-[calc(100%-2rem)] grid-cols-2 rounded-xl bg-stone-100 dark:bg-stone-800/70">
                    <TabsTrigger value="errors" className="gap-1.5 rounded-lg text-xs font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-stone-900">
                      <Crosshair className="size-3.5" /> Error Log
                    </TabsTrigger>
                    <TabsTrigger value="mocks" className="gap-1.5 rounded-lg text-xs font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-stone-900">
                      <Flag className="size-3.5" /> Mock Ledger
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="errors" className="mt-3">
                    <ErrorLogPanel week={week} date={weekPlan.days[day]?.date ?? today} />
                  </TabsContent>
                  <TabsContent value="mocks" className="mt-3">
                    <MockLedger />
                  </TabsContent>
                </Tabs>
              </Card>
              {/* Subject progress */}
              <Card className="rounded-2xl border-stone-200/80 shadow-sm dark:border-stone-800">
                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="text-sm font-semibold">Subject Mastery Map</CardTitle>
                </CardHeader>
                <CardContent className="max-h-72 space-y-2.5 overflow-y-auto pb-4 pr-2 [scrollbar-width:thin]">
                  {subjectProgress.map((s) => {
                    const pct = s.total ? Math.round((s.done / s.total) * 100) : 0
                    const c = COLOR_CLASSES[SUBJECTS[s.id]?.color ?? 'sky']
                    return (
                      <div key={s.id}>
                        <div className="mb-1 flex items-center justify-between gap-2 text-[11px]">
                          <span className="flex min-w-0 items-center gap-1.5">
                            <span className={cn('size-1.5 shrink-0 rounded-full', c.dot)} />
                            <span className="truncate font-medium">{s.name}</span>
                          </span>
                          <span className="shrink-0 text-muted-foreground">{s.done}/{s.total}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                          <div className={cn('h-full rounded-full transition-all', c.dot)} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      {/* ── Sticky footer ──────────────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-stone-200 bg-background dark:border-stone-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>19 weeks · ~{plannedHours} hrs · two syllabi, one calendar — merged from your four curated plans.</p>
          <p className="flex items-center gap-1.5">
            <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
            Progress saved automatically{syncedAt ? ` · synced ${syncedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}` : ''}
          </p>
        </div>
      </footer>
    </div>
  )
}

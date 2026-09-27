'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { formatISODay, todayISO } from '@/lib/plan'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronDown, Crosshair, Flag, Layers, Plus, Trash2, TrendingUp, TriangleAlert, X,
} from 'lucide-react'
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  loadMocks, createMockRemote, deleteMockRemote, updateMockSectionsRemote, localId,
  type MockSectionScore, type StoredMock,
} from '@/lib/store'
import { GATE_SECTION_WEIGHTS } from '@/lib/pyq-intel'

interface MockScore {
  id: string
  label: string
  exam: 'NET' | 'GATE'
  score: number
  max: number
  takenOn: string
  sections?: MockSectionScore[] | null
}

// Targets from the two plans: NET 250+/300 · GATE 95+/100
const TARGETS: Record<'NET' | 'GATE', number> = { NET: 250 / 3, GATE: 95 }

const EXAM_CHIP: Record<'NET' | 'GATE', string> = {
  NET: 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300',
  GATE: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
}

// ── PYQ marks-budget per section (share of the paper the section should earn) ─
interface SectionBudget {
  budgetPct: number // target % of that section's own marks? No — share of TOTAL paper
  color: string
  note?: string
}

const GATE_ALIASES: [RegExp, string][] = [
  [/^(p&s|ps|prob|probability|stats|statistics)/, 'ps'],
  [/^(ml|machine)/, 'ml'],
  [/^(dbms|db|database|warehous|dw)/, 'dbms'],
  [/^(dsa|algo|algorithms|ds)/, 'dsa'],
  [/^(la|linear|linalg)/, 'la'],
  [/^(ai|artificial)/, 'ai'],
  [/^(py|python|pdsa)/, 'py'],
  [/^(calc|calculus|math)/, 'calc'],
  [/^(ga|general aptitude|aptitude)/, 'ga'],
]

const GATE_BUDGET: Record<string, SectionBudget> = {
  ...Object.fromEntries(
    GATE_SECTION_WEIGHTS.map((w) => [
      w.id,
      { budgetPct: w.share, color: w.color, note: w.note } as SectionBudget,
    ]),
  ),
  ga: { budgetPct: 15, color: 'bg-stone-400', note: 'General Aptitude is 15 marks — cheap points, one-pass banking strategy' },
}

const NET_BUDGET: Record<string, SectionBudget> = {
  p1: { budgetPct: 33.3, color: 'bg-slate-500', note: 'Paper 1 = 50 Q · 100 marks of the 300 total' },
  p2: { budgetPct: 66.7, color: 'bg-teal-500', note: 'Paper 2 CS = 100 Q · 200 marks — the main event' },
}

const NET_ALIASES: [RegExp, string][] = [
  [/^(p1|paper ?1|general|teaching|apt)/, 'p1'],
  [/^(p2|paper ?2|cs|cs&p2|subject)/, 'p2'],
]

function normalizeSection(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9&]/g, '')
}

function budgetFor(exam: 'NET' | 'GATE', name: string): { id: string; label: string; budget: SectionBudget } | null {
  const n = normalizeSection(name)
  if (exam === 'GATE') {
    for (const [re, id] of GATE_ALIASES) if (re.test(n)) return { id, label: name, budget: GATE_BUDGET[id] }
  } else {
    for (const [re, id] of NET_ALIASES) if (re.test(n)) return { id, label: name, budget: NET_BUDGET[id] }
  }
  return null
}

// default section templates per exam (one click → prefill rows)
const GATE_TEMPLATE = ['GA', 'P&S', 'ML', 'DBMS+DW', 'DSA', 'LA', 'AI', 'Python', 'Calc']
const NET_TEMPLATE = ['Paper 1', 'Paper 2 CS']

export default function MockLedger() {
  const [mocks, setMocks] = useState<MockScore[]>([])
  const [loaded, setLoaded] = useState(false)
  const [exam, setExam] = useState<'NET' | 'GATE'>('GATE')
  const [label, setLabel] = useState('')
  const [score, setScore] = useState('')
  const [max, setMax] = useState('')
  const [takenOn, setTakenOn] = useState(todayISO())
  const [saving, setSaving] = useState(false)
  const [withSections, setWithSections] = useState(false)
  const [secRows, setSecRows] = useState<MockSectionScore[]>([])
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  useEffect(() => {
    let alive = true
    loadMocks().then((rows) => {
      if (alive) {
        setMocks(rows as MockScore[])
        setLoaded(true)
      }
    })
    return () => { alive = false }
  }, [])

  const prefillTemplate = useCallback(() => {
    setSecRows(exam === 'GATE'
      ? GATE_TEMPLATE.map((name) => ({ name, score: 0, max: 0 }))
      : NET_TEMPLATE.map((name) => ({ name, score: 0, max: 0 })))
  }, [exam])

  const addMock = useCallback(async () => {
    const s = Number(score)
    const m = Number(max)
    if (!label.trim() || !Number.isFinite(s) || !Number.isFinite(m) || m <= 0 || s < 0 || s > m || saving) return
    const validSecs = secRows.filter((r) => r.name.trim() && r.max > 0)
    setSaving(true)
    try {
      const fallbackId = localId()
      const { id } = await createMockRemote(
        { label, exam, score: s, max: m, takenOn, sections: withSections && validSecs.length ? validSecs : null },
        fallbackId,
      )
      setMocks((prev) => [...prev, { id, label, exam, score: s, max: m, takenOn, sections: withSections && validSecs.length ? validSecs : null }])
      setLabel('')
      setScore('')
      setMax('')
      setSecRows([])
      setWithSections(false)
    } finally {
      setSaving(false)
    }
  }, [label, exam, score, max, takenOn, saving, withSections, secRows])

  const removeMock = useCallback(async (id: string) => {
    setMocks((prev) => {
      const next = prev.filter((m) => m.id !== id)
      deleteMockRemote(id, next as StoredMock[])
      return next
    })
  }, [])

  const clearSections = useCallback(async (id: string) => {
    setMocks((prev) => {
      const next = prev.map((m) => (m.id === id ? { ...m, sections: null } : m))
      updateMockSectionsRemote(id, [], next as StoredMock[])
      return next
    })
  }, [])

  const toggleExpand = useCallback((id: string) => {
    setExpanded((prev) => {
      const s = new Set(prev)
      if (s.has(id)) s.delete(id)
      else s.add(id)
      return s
    })
  }, [])

  const pct = (m: MockScore) => (m.max ? (m.score / m.max) * 100 : 0)

  const series = useMemo(
    () =>
      (['NET', 'GATE'] as const).map((ex) => {
        const rows = mocks
          .filter((m) => m.exam === ex)
          .map((m, i) => ({ name: m.label.slice(0, 12), p: Math.round(pct(m) * 10) / 10, idx: i }))
        const latest = rows.length ? rows[rows.length - 1].p : null
        const best = rows.length ? Math.max(...rows.map((r) => r.p)) : null
        return { exam: ex, rows, latest, best, count: rows.length }
      }),
    [mocks]
  )

  // ── Section Command Map: avg score % per standard section vs PYQ budget ────
  const sectionMap = useMemo(() => {
    const acc = new Map<string, { label: string; scores: number[]; budget: SectionBudget }>()
    for (const m of mocks) {
      if (m.exam !== exam || !m.sections) continue
      for (const s of m.sections) {
        const hit = budgetFor(exam, s.name)
        const key = hit ? hit.id : `raw:${normalizeSection(s.name)}`
        const entry = acc.get(key) ?? {
          label: hit ? (GATE_SECTION_WEIGHTS.find((w) => w.id === hit.id)?.name ?? s.name) : s.name,
          scores: [],
          budget: hit ? hit.budget : { budgetPct: -1, color: 'bg-stone-400' },
        }
        entry.scores.push(s.max > 0 ? (s.score / s.max) * 100 : 0)
        acc.set(key, entry)
      }
    }
    return [...acc.entries()]
      .map(([id, e]) => {
        const avg = e.scores.reduce((a, b) => a + b, 0) / e.scores.length
        const gap = e.budget.budgetPct >= 0 ? avg - e.budget.budgetPct : null
        return { id, label: e.label, avg, budget: e.budget, gap, n: e.scores.length }
      })
      .sort((a, b) => (a.gap ?? 0) - (b.gap ?? 0))
  }, [mocks, exam])

  const visible = useMemo(() => [...mocks].reverse(), [mocks])
  const withSectionsCount = mocks.filter((m) => m.sections?.length).length

  return (
    <div className="space-y-3">
      {/* Add form */}
      <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-2.5 dark:border-stone-800 dark:bg-stone-900/40">
        <div className="mb-2 flex gap-1">
          {(['NET', 'GATE'] as const).map((ex) => (
            <button
              key={ex}
              onClick={() => setExam(ex)}
              className={cn(
                'flex-1 rounded-lg px-2 py-1 text-[10px] font-bold transition-all',
                exam === ex ? EXAM_CHIP[ex] + ' ring-1 ring-stone-300 dark:ring-stone-600' : 'bg-stone-200/70 text-stone-500 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400'
              )}
            >
              {ex}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-[1fr_58px_58px] gap-1.5">
          <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Mock name (e.g. Mock 3 / S1 P&S)" className="h-8 rounded-lg text-xs" aria-label="Mock name" />
          <Input value={score} onChange={(e) => setScore(e.target.value)} type="number" min="0" placeholder="Score" className="h-8 rounded-lg text-xs" aria-label="Score" />
          <Input value={max} onChange={(e) => setMax(e.target.value)} type="number" min="1" placeholder="Max" className="h-8 rounded-lg text-xs" aria-label="Max marks" />
        </div>
        <div className="mt-1.5 flex gap-1.5">
          <Input value={takenOn} onChange={(e) => setTakenOn(e.target.value)} type="date" className="h-8 rounded-lg text-[11px] text-muted-foreground" aria-label="Date taken" />
          <Button size="sm" className="h-8 shrink-0 gap-1 rounded-lg bg-stone-900 px-3 hover:bg-stone-700 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200" onClick={addMock} disabled={saving || !label.trim() || !score || !max}>
            <Plus className="size-3.5" /> Log
          </Button>
        </div>

        {/* Section breakdown toggle + editor */}
        <button
          onClick={() => setWithSections((v) => !v)}
          className={cn(
            'mt-2 flex w-full items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[10px] font-semibold transition-colors',
            withSections
              ? 'border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300'
              : 'border-stone-200 bg-card text-stone-500 hover:border-stone-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400',
          )}
          aria-expanded={withSections}
        >
          <Layers className="size-3" />
          {withSections ? 'Section breakdown ON — rows below will be saved' : 'Add section-wise breakdown (optional)'}
        </button>
        <AnimatePresence initial={false}>
          {withSections && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-1.5 space-y-1">
                {secRows.map((r, i) => (
                  <div key={i} className="grid grid-cols-[1fr_52px_52px_20px] items-center gap-1">
                    <Input
                      value={r.name}
                      onChange={(e) => setSecRows((p) => p.map((x, xi) => (xi === i ? { ...x, name: e.target.value } : x)))}
                      placeholder="Section"
                      className="h-7 rounded-md text-[11px]"
                      aria-label={`Section ${i + 1} name`}
                    />
                    <Input
                      value={r.score || ''}
                      onChange={(e) => setSecRows((p) => p.map((x, xi) => (xi === i ? { ...x, score: Number(e.target.value) || 0 } : x)))}
                      type="number" min="0" placeholder="got"
                      className="h-7 rounded-md text-[11px]"
                      aria-label={`Section ${i + 1} score`}
                    />
                    <Input
                      value={r.max || ''}
                      onChange={(e) => setSecRows((p) => p.map((x, xi) => (xi === i ? { ...x, max: Number(e.target.value) || 0 } : x)))}
                      type="number" min="0" placeholder="of"
                      className="h-7 rounded-md text-[11px]"
                      aria-label={`Section ${i + 1} max`}
                    />
                    <button
                      onClick={() => setSecRows((p) => p.filter((_, xi) => xi !== i))}
                      aria-label={`Remove section ${i + 1}`}
                      className="grid size-5 place-items-center rounded text-stone-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-1.5">
                  <Button variant="outline" size="sm" className="h-7 flex-1 gap-1 rounded-lg text-[10px]" onClick={() => setSecRows((p) => [...p, { name: '', score: 0, max: 0 }])}>
                    <Plus className="size-3" /> Row
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 flex-1 gap-1 rounded-lg text-[10px]" onClick={prefillTemplate}>
                    <Layers className="size-3" /> {exam} template
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Trend charts */}
      {loaded && mocks.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {series.map((s) => (
            <div key={s.exam} className="rounded-xl border border-stone-200 p-2 dark:border-stone-800">
              <div className="mb-1 flex items-center justify-between">
                <span className={cn('rounded-full px-1.5 py-0.5 text-[9px] font-bold', EXAM_CHIP[s.exam])}>{s.exam}</span>
                <span className="text-[9px] text-muted-foreground">
                  {s.latest !== null ? `latest ${s.latest}%` : 'no data'}
                  {s.best !== null ? ` · best ${s.best}%` : ''}
                </span>
              </div>
              {s.rows.length > 0 ? (
                <div className="h-[76px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={s.rows} margin={{ top: 4, right: 2, bottom: 0, left: 2 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-stone-200 dark:text-stone-800" vertical={false} />
                      <XAxis dataKey="idx" hide />
                      <YAxis domain={[0, 100]} hide />
                      <Tooltip
                        contentStyle={{ fontSize: 10, borderRadius: 8, padding: '4px 8px' }}
                        formatter={(value) => [`${value}%`, 'Score']}
                      />
                      <ReferenceLine y={TARGETS[s.exam]} stroke="#f59e0b" strokeDasharray="4 3" strokeWidth={1.2} />
                      <Line type="monotone" dataKey="p" stroke={s.exam === 'NET' ? '#14b8a6' : '#f59e0b'} strokeWidth={2} dot={{ r: 2.5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="grid h-[76px] place-items-center text-[10px] text-stone-400">—</div>
              )}
              <p className="mt-0.5 text-center text-[9px] text-stone-400 dark:text-stone-500">
                target {Math.round(TARGETS[s.exam])}% · {s.count} logged
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Section Command Map — where you actually lose the rank */}
      {loaded && withSectionsCount > 0 && sectionMap.length > 0 && (
        <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-2.5 dark:border-violet-900 dark:bg-violet-950/25">
          <div className="mb-2 flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-violet-800 dark:text-violet-300">
              <Layers className="size-3.5" /> Section Command Map · {exam}
            </p>
            <span className="text-[9px] font-medium text-violet-500 dark:text-violet-400">{withSectionsCount} breakdown{withSectionsCount === 1 ? '' : 's'}</span>
          </div>
          <div className="space-y-2">
            {sectionMap.slice(0, 6).map((s) => {
              const weak = s.gap !== null && s.gap < -10
              return (
                <div key={s.id}>
                  <div className="mb-0.5 flex items-baseline justify-between gap-2 text-[10px]">
                    <span className="truncate font-semibold text-stone-700 dark:text-stone-300">{s.label}</span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">
                      {Math.round(s.avg)}%{s.budget.budgetPct >= 0 && <span className="text-stone-400 dark:text-stone-500"> · PYQ {s.budget.budgetPct}%</span>}
                    </span>
                  </div>
                  <div className="relative h-2 overflow-hidden rounded-full bg-stone-200/80 dark:bg-stone-800">
                    <div
                      className={cn('h-full rounded-full transition-all', weak ? 'bg-rose-400 dark:bg-rose-500' : 'bg-violet-400 dark:bg-violet-500')}
                      style={{ width: `${Math.min(100, Math.max(2, s.avg))}%` }}
                    />
                    {s.budget.budgetPct >= 0 && (
                      <span
                        className="absolute top-[-2px] h-[14px] w-0.5 rounded bg-stone-800 dark:bg-white"
                        style={{ left: `${Math.min(99, s.budget.budgetPct)}%` }}
                        title={`PYQ marks budget: ${s.budget.budgetPct}%`}
                      />
                    )}
                  </div>
                  {weak && (
                    <p className="mt-0.5 flex items-start gap-1 text-[9px] leading-snug text-rose-600 dark:text-rose-400">
                      <TriangleAlert className="mt-0.5 size-2.5 shrink-0" />
                      {s.budget.note ?? 'Below the marks budget — schedule a repair block this week.'}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
          <p className="mt-2 text-center text-[9px] text-violet-500 dark:text-violet-400">
            sorted by gap vs PYQ marks budget · weakest first — feed these into next week&apos;s drills
          </p>
        </div>
      )}

      {/* List */}
      {!loaded ? (
        <div className="space-y-1.5">
          {[0, 1].map((i) => (
            <div key={i} className="h-9 animate-pulse rounded-lg bg-stone-100 dark:bg-stone-800" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-stone-300 py-6 text-center dark:border-stone-700">
          <Flag className="size-5 text-stone-300 dark:text-stone-600" />
          <p className="text-xs text-muted-foreground">No mock scores yet.</p>
          <p className="max-w-[230px] text-[10px] text-stone-400 dark:text-stone-500">
            Log every sectional and mock — judge progress on the trend line, never on a single score.
          </p>
        </div>
      ) : (
        <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1 [scrollbar-width:thin]">
          <AnimatePresence initial={false}>
            {visible.map((m) => {
              const p = Math.round(pct(m) * 10) / 10
              const gap = Math.round((p - TARGETS[m.exam]) * 10) / 10
              const open = expanded.has(m.id)
              return (
                <motion.div
                  key={m.id}
                  layout
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.18 }}
                  className="group rounded-lg border border-stone-200 bg-card p-2 dark:border-stone-800"
                >
                  <div className="flex items-center gap-2">
                    <span className={cn('shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold', EXAM_CHIP[m.exam])}>{m.exam}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-stone-700 dark:text-stone-300">{m.label}</p>
                      <p className="text-[9px] text-stone-400 dark:text-stone-500">{formatISODay(m.takenOn)} · {m.score}/{m.max}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className={cn('text-xs font-bold', gap >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-600 dark:text-stone-300')}>
                        {p}%
                      </span>
                      <p className={cn('text-[9px] font-medium', gap >= 0 ? 'text-emerald-500' : 'text-rose-500')}>
                        {gap >= 0 ? `+${gap}` : gap} vs target
                      </p>
                    </div>
                    {m.sections?.length ? (
                      <button
                        onClick={() => toggleExpand(m.id)}
                        aria-label={open ? 'Hide section breakdown' : 'Show section breakdown'}
                        aria-expanded={open}
                        className="grid size-5 shrink-0 place-items-center rounded text-violet-500 transition-transform hover:bg-violet-50 dark:hover:bg-violet-950/40"
                      >
                        <ChevronDown className={cn('size-3.5 transition-transform', open && 'rotate-180')} />
                      </button>
                    ) : null}
                    <button
                      onClick={() => removeMock(m.id)}
                      aria-label="Delete mock score"
                      className="grid size-5 shrink-0 place-items-center rounded text-stone-300 opacity-0 transition-opacity hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                  <AnimatePresence initial={false}>
                    {open && m.sections?.length ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 space-y-1 border-t border-dashed border-stone-200 pt-2 dark:border-stone-700">
                          {m.sections.map((s, si) => {
                            const sp = s.max > 0 ? Math.round((s.score / s.max) * 100) : 0
                            const hit = budgetFor(m.exam as 'NET' | 'GATE', s.name)
                            const ok = !hit || sp >= hit.budget.budgetPct - 10
                            return (
                              <div key={si} className="flex items-center gap-2">
                                <span className="w-20 shrink-0 truncate text-[9px] font-semibold text-stone-500 dark:text-stone-400">{s.name}</span>
                                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                                  <div className={cn('h-full rounded-full', ok ? 'bg-emerald-400 dark:bg-emerald-500' : 'bg-rose-400 dark:bg-rose-500')} style={{ width: `${Math.min(100, sp)}%` }} />
                                </div>
                                <span className="w-12 shrink-0 text-right text-[9px] tabular-nums text-stone-500 dark:text-stone-400">{s.score}/{s.max}</span>
                              </div>
                            )
                          })}
                          <button onClick={() => clearSections(m.id)} className="text-[9px] text-stone-400 underline-offset-2 hover:text-rose-500 hover:underline dark:text-stone-500">
                            remove breakdown
                          </button>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {loaded && mocks.some((m) => m.exam === 'GATE') && (
        <p className="flex items-center justify-center gap-1 rounded-lg bg-stone-100 px-2 py-1 text-center text-[10px] text-stone-500 dark:bg-stone-900/60 dark:text-stone-400">
          <TrendingUp className="size-3" /> Judge yourself on the Mock 5→6 trend, never on Mocks 1–2
          <Crosshair className="ml-0.5 size-3" />
        </p>
      )}
    </div>
  )
}

'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { formatISODay, todayISO } from '@/lib/plan'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AnimatePresence, motion } from 'framer-motion'
import { Crosshair, Flag, Plus, Trash2, TrendingUp } from 'lucide-react'
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface MockScore {
  id: string
  label: string
  exam: 'NET' | 'GATE'
  score: number
  max: number
  takenOn: string
}

// Targets from the two plans: NET 250+/300 · GATE 95+/100
const TARGETS: Record<'NET' | 'GATE', number> = { NET: 250 / 3, GATE: 95 }

const EXAM_CHIP: Record<'NET' | 'GATE', string> = {
  NET: 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300',
  GATE: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
}

export default function MockLedger() {
  const [mocks, setMocks] = useState<MockScore[]>([])
  const [loaded, setLoaded] = useState(false)
  const [exam, setExam] = useState<'NET' | 'GATE'>('GATE')
  const [label, setLabel] = useState('')
  const [score, setScore] = useState('')
  const [max, setMax] = useState('')
  const [takenOn, setTakenOn] = useState(todayISO())
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/mocks')
      .then((r) => r.json())
      .then((j: { mocks?: MockScore[] }) => {
        setMocks(j.mocks ?? [])
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  const addMock = useCallback(async () => {
    const s = Number(score)
    const m = Number(max)
    if (!label.trim() || !Number.isFinite(s) || !Number.isFinite(m) || m <= 0 || s < 0 || s > m || saving) return
    setSaving(true)
    try {
      const res = await fetch('/api/mocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label, exam, score: s, max: m, takenOn }),
      })
      const j: { mock?: MockScore } = await res.json()
      if (j.mock) {
        setMocks((prev) => [...prev, j.mock as MockScore])
        setLabel('')
        setScore('')
        setMax('')
      }
    } finally {
      setSaving(false)
    }
  }, [label, exam, score, max, takenOn, saving])

  const removeMock = useCallback(async (id: string) => {
    setMocks((prev) => prev.filter((m) => m.id !== id))
    await fetch(`/api/mocks?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {})
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

  const visible = useMemo(() => [...mocks].reverse(), [mocks])

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
              return (
                <motion.div
                  key={m.id}
                  layout
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.18 }}
                  className="group flex items-center gap-2 rounded-lg border border-stone-200 bg-card p-2 dark:border-stone-800"
                >
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
                  <button
                    onClick={() => removeMock(m.id)}
                    aria-label="Delete mock score"
                    className="grid size-5 shrink-0 place-items-center rounded text-stone-300 opacity-0 transition-opacity hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100 dark:hover:bg-rose-950/40"
                  >
                    <Trash2 className="size-3" />
                  </button>
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

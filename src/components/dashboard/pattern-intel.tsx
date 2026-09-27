'use client'

import { useState } from 'react'
import {
  GATE_ANATOMY, GATE_ARCHETYPES, GATE_META, GATE_SECTION_WEIGHTS,
  NET_ARCHETYPES, NET_META, NET_UNIT_WEIGHTS,
} from '@/lib/pyq-intel'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BarChart3, ChevronDown, GraduationCap, Lightbulb, Network, TriangleAlert } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Tab = 'gate' | 'net'

export default function PatternIntelCard() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('gate')

  return (
    <Card className="mt-3 overflow-hidden rounded-2xl border-stone-200/80 shadow-sm dark:border-stone-800">
      <CardContent className="p-0">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-stone-50 dark:hover:bg-stone-900/40"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
              <BarChart3 className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">Pattern Intelligence</p>
              <p className="text-[11px] text-muted-foreground">
                Calibrated from real GATE DA 2024–26 papers + real NET Dec 2025 / June 2025 shifts
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden rounded-full text-[10px] font-semibold sm:inline-flex">
              P&amp;S ≈ 28% · ML ≈ 16% · DBMS ≈ 14%
            </Badge>
            <ChevronDown className={cn('size-4 text-muted-foreground transition-transform', open && 'rotate-180')} />
          </div>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-stone-200/70 dark:border-stone-800"
            >
              <div className="p-4">
                {/* Tab switch */}
                <div className="mb-4 grid grid-cols-2 gap-1.5 rounded-xl bg-stone-100 p-1 dark:bg-stone-800/70">
                  <button
                    onClick={() => setTab('gate')}
                    className={cn(
                      'flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all',
                      tab === 'gate' ? 'bg-white text-stone-900 shadow-sm dark:bg-stone-900 dark:text-white' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <GraduationCap className="size-3.5" /> GATE 2027 DA
                  </button>
                  <button
                    onClick={() => setTab('net')}
                    className={cn(
                      'flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all',
                      tab === 'net' ? 'bg-white text-stone-900 shadow-sm dark:bg-stone-900 dark:text-white' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <Network className="size-3.5" /> UGC NET Dec 2026
                  </button>
                </div>

                {tab === 'gate' ? (
                  <div className="space-y-4">
                    {/* Paper anatomy */}
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Paper anatomy · {GATE_META.duration} · {GATE_META.total} marks
                      </p>
                      <div className="flex h-7 overflow-hidden rounded-lg">
                        {GATE_ANATOMY.map((s) => (
                          <div
                            key={s.label}
                            style={{ width: `${(s.marks / GATE_META.total) * 100}%` }}
                            className={cn('flex items-center justify-center text-[10px] font-bold text-white', s.tone)}
                            title={`${s.label} — ${s.marks} marks`}
                          >
                            {s.marks}
                          </div>
                        ))}
                      </div>
                      <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                        {GATE_ANATOMY.map((s) => `${s.label} (${s.questions})`).join(' · ')}
                      </p>
                      <p className="mt-1 text-[11px] font-medium text-amber-700 dark:text-amber-400">{GATE_META.types}</p>
                    </div>

                    {/* Section weights */}
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Section weight · share of the 85 technical marks
                      </p>
                      <div className="space-y-1.5">
                        {GATE_SECTION_WEIGHTS.map((s) => (
                          <div key={s.id} className="flex items-center gap-2">
                            <span className={cn('h-2 w-2 shrink-0 rounded-full', s.color)} />
                            <span className="w-44 shrink-0 truncate text-xs font-medium">{s.name}</span>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
                              <div className={cn('h-full rounded-full', s.color)} style={{ width: `${(s.share / 30) * 100}%` }} />
                            </div>
                            <span className="w-24 shrink-0 text-right text-[11px] font-semibold text-muted-foreground">
                              {s.share}% · {s.questions}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Archetypes */}
                    <div>
                      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <Lightbulb className="size-3.5 text-amber-500" /> Repeat archetypes ({GATE_META.papers})
                      </p>
                      <div className="max-h-64 space-y-2.5 overflow-y-auto pr-2 [scrollbar-width:thin]">
                        {GATE_ARCHETYPES.map((a) => (
                          <div key={a.section} className="rounded-xl border border-stone-200/80 p-2.5 dark:border-stone-800">
                            <p className="mb-1 text-[11px] font-bold">{a.section}</p>
                            <ul className="space-y-0.5">
                              {a.items.map((it) => (
                                <li key={it} className="flex gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
                                  <span className="mt-[5px] size-1 shrink-0 rounded-full bg-stone-400" />
                                  {it}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* NET paper facts */}
                    <div className="rounded-xl border border-stone-200/80 p-3 dark:border-stone-800">
                      <p className="text-xs font-bold">Paper 2 · Computer Science &amp; Applications (code 87)</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{NET_META.p2}</p>
                      <p className="mt-1.5 text-xs font-bold">Paper 1 · General (Teaching &amp; Research Aptitude)</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{NET_META.p1}</p>
                      <div className="mt-2 grid gap-1 text-[11px] leading-relaxed text-muted-foreground">
                        <p><span className="font-semibold text-foreground">Mode:</span> {NET_META.mode}</p>
                        <p><span className="font-semibold text-foreground">Attempts:</span> {NET_META.attempts}</p>
                        <p><span className="font-semibold text-foreground">Difficulty:</span> {NET_META.difficulty}</p>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {NET_META.units.map((u) => (
                          <Badge key={u} variant="outline" className="rounded-full text-[10px] font-medium">
                            {u}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* NET unit weights (real Dec 2025) */}
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Unit weights &amp; attempts · real Dec 2025 paper
                      </p>
                      <div className="space-y-1.5">
                        {NET_UNIT_WEIGHTS.map((s) => (
                          <div key={s.id} className="flex items-center gap-2">
                            <span className={cn('h-2 w-2 shrink-0 rounded-full', s.color)} />
                            <span className="w-40 shrink-0 truncate text-xs font-medium" title={s.note}>{s.unit}</span>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
                              <div className={cn('h-full rounded-full', s.color)} style={{ width: s.tier === 'High' ? '100%' : s.tier === 'Medium' ? '66%' : '40%' }} />
                            </div>
                            <span className="w-28 shrink-0 text-right text-[11px] font-semibold text-muted-foreground">
                              {s.tier} · {s.questions}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* NET archetypes */}
                    <div>
                      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <Lightbulb className="size-3.5 text-amber-500" /> Observed archetypes ({NET_META.papers})
                      </p>
                      <div className="max-h-64 space-y-2.5 overflow-y-auto pr-2 [scrollbar-width:thin]">
                        {NET_ARCHETYPES.map((a) => (
                          <div key={a.section} className="rounded-xl border border-stone-200/80 p-2.5 dark:border-stone-800">
                            <p className="mb-1 text-[11px] font-bold">{a.section}</p>
                            <ul className="space-y-0.5">
                              {a.items.map((it) => (
                                <li key={it} className="flex gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
                                  <span className="mt-[5px] size-1 shrink-0 rounded-full bg-stone-400" />
                                  {it}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Scheduling watch */}
                    <div className="rounded-xl border border-orange-200 bg-orange-50 p-3 dark:border-orange-900/60 dark:bg-orange-950/30">
                      <p className="flex items-center gap-1.5 text-xs font-bold text-orange-800 dark:text-orange-300">
                        <TriangleAlert className="size-3.5" /> Exam-window watch
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-orange-800/90 dark:text-orange-200/80">{NET_META.window}</p>
                      <p className="mt-2 text-[10px] text-orange-700/70 dark:text-orange-300/60">{NET_META.papers}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

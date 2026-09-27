'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { SUBJECTS, type SubjectId } from '@/lib/plan'
import { COLOR_CLASSES } from '@/lib/plan-types'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatISODay } from '@/lib/plan'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCheck, Inbox, Plus, Trash2, Undo2 } from 'lucide-react'
import {
  loadErrors, createErrorRemote, updateErrorRemote, deleteErrorRemote, mirrorErrors, localId, type StoredError,
} from '@/lib/store'

interface ErrorEntry {
  id: string
  date: string
  week: number
  subject: string
  category: string
  note: string
  resolved: boolean
}

const CATEGORIES = [
  { id: 'concept', label: 'Concept gap', chip: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' },
  { id: 'process', label: 'Process slip', chip: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' },
  { id: 'judgement', label: 'Judgement', chip: 'bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300' },
  { id: 'trap', label: 'Trap', chip: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300' },
] as const

const FILTERS = ['all', 'open', 'resolved'] as const

interface ErrorLogPanelProps {
  week: number
  date: string
}

export default function ErrorLogPanel({ week, date }: ErrorLogPanelProps) {
  const [entries, setEntries] = useState<ErrorEntry[]>([])
  const [loaded, setLoaded] = useState(false)
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all')
  const [category, setCategory] = useState<string>('concept')
  const [subject, setSubject] = useState<string>('mixed')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let alive = true
    loadErrors().then((rows) => {
      if (alive) {
        setEntries(rows as ErrorEntry[])
        setLoaded(true)
      }
    })
    return () => { alive = false }
  }, [])

  const addEntry = useCallback(async () => {
    if (!note.trim() || saving) return
    setSaving(true)
    try {
      const fallbackId = localId()
      const { id } = await createErrorRemote({ date, week, subject, category, note }, fallbackId)
      setEntries((prev) => {
        const next = [{ id, date, week, subject, category, note, resolved: false }, ...prev]
        mirrorErrors(next as StoredError[])
        return next
      })
      setNote('')
    } finally {
      setSaving(false)
    }
  }, [note, saving, date, week, subject, category])

  const toggleResolved = useCallback(async (id: string, resolved: boolean) => {
    setEntries((prev) => {
      const next = prev.map((e) => (e.id === id ? { ...e, resolved } : e))
      updateErrorRemote(id, resolved, next as StoredError[])
      return next
    })
  }, [])

  const removeEntry = useCallback(async (id: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== id)
      deleteErrorRemote(id, next as StoredError[])
      return next
    })
  }, [])

  const counts = useMemo(
    () => ({
      all: entries.length,
      open: entries.filter((e) => !e.resolved).length,
      resolved: entries.filter((e) => e.resolved).length,
    }),
    [entries]
  )

  const visible = useMemo(
    () =>
      entries
        .filter((e) => (filter === 'all' ? true : filter === 'open' ? !e.resolved : e.resolved))
        .sort((a, b) => Number(a.resolved) - Number(b.resolved)),
    [entries, filter]
  )

  const subjectName = (id: string) => SUBJECTS[id as SubjectId]?.name ?? id

  return (
    <div className="space-y-3">
      {/* Add form */}
      <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-2.5 dark:border-stone-800 dark:bg-stone-900/40">
        <div className="mb-2 flex flex-wrap gap-1">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-bold transition-all',
                category === c.id ? c.chip + ' ring-1 ring-stone-300 dark:ring-stone-600' : 'bg-stone-200/70 text-stone-500 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400'
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger className="h-8 w-[110px] shrink-0 rounded-lg text-[11px]" aria-label="Subject">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(SUBJECTS).map((s) => (
                <SelectItem key={s.id} value={s.id} className="text-xs">
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addEntry()}
            placeholder="What went wrong and why?"
            className="h-8 rounded-lg text-xs"
            aria-label="Error description"
          />
          <Button size="sm" className="h-8 shrink-0 gap-1 rounded-lg bg-stone-900 px-2.5 hover:bg-stone-700 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200" onClick={addEntry} disabled={saving || !note.trim()}>
            <Plus className="size-3.5" />
          </Button>
        </div>
        <p className="mt-1.5 text-[10px] text-muted-foreground">
          Logged to Week {week} · {formatISODay(date)} — only a cold re-solve closes an entry.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors',
              filter === f
                ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900'
                : 'bg-stone-100 text-stone-500 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400'
            )}
          >
            {f} · {counts[f]}
          </button>
        ))}
      </div>

      {/* List */}
      {!loaded ? (
        <div className="space-y-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-10 animate-pulse rounded-lg bg-stone-100 dark:bg-stone-800" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-stone-300 py-6 text-center dark:border-stone-700">
          <Inbox className="size-5 text-stone-300 dark:text-stone-600" />
          <p className="text-xs text-muted-foreground">
            {filter === 'all' ? 'No mistakes logged yet.' : `No ${filter} entries.`}
          </p>
          <p className="max-w-[220px] text-[10px] text-stone-400 dark:text-stone-500">
            One row per miss: tag the root cause the same day, re-solve cold within 72 h.
          </p>
        </div>
      ) : (
        <div className="max-h-64 space-y-1.5 overflow-y-auto pr-1 [scrollbar-width:thin]">
          <AnimatePresence initial={false}>
            {visible.map((e) => {
              const cat = CATEGORIES.find((c) => c.id === e.category)
              return (
                <motion.div
                  key={e.id}
                  layout
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.18 }}
                  className={cn(
                    'group flex items-start gap-2 rounded-lg border border-stone-200 bg-card p-2 dark:border-stone-800',
                    e.resolved && 'opacity-55',
                  )}
                >
                  <button
                    onClick={() => toggleResolved(e.id, !e.resolved)}
                    aria-label={e.resolved ? 'Reopen entry' : 'Mark resolved'}
                    className={cn(
                      'mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border transition-colors',
                      e.resolved
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-stone-300 text-transparent hover:border-emerald-500 hover:text-emerald-400 dark:border-stone-700',
                    )}
                  >
                    <CheckCheck className="size-3" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1">
                      {cat && <Badge variant="outline" className={cn('rounded-full border-0 px-1.5 py-0 text-[9px] font-bold', cat.chip)}>{cat.label}</Badge>}
                      <span className="text-[10px] font-semibold text-stone-600 dark:text-stone-300">{subjectName(e.subject)}</span>
                      <span className="text-[9px] text-stone-400 dark:text-stone-500">W{e.week} · {formatISODay(e.date)}</span>
                    </div>
                    <p className={cn('mt-0.5 break-words text-xs leading-snug text-stone-700 dark:text-stone-300', e.resolved && 'line-through')}>
                      {e.note}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => removeEntry(e.id)}
                      aria-label="Delete entry"
                      className="grid size-5 place-items-center rounded text-stone-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                    >
                      {e.resolved ? <Trash2 className="size-3" /> : <Undo2 className="size-3 rotate-90" />}
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {counts.open > 0 && (
        <p className={cn('rounded-lg px-2 py-1 text-center text-[10px] font-semibold', COLOR_CLASSES.rose.chip)}>
          {counts.open} open · Sunday triage re-solves everything cold
        </p>
      )}
    </div>
  )
}

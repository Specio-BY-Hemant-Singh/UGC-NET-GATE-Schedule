'use client'

// Focus timer — preset cycles mirror the plan's own slot rhythm:
//   50/10  → the standard theory-slot unit (06:30–08:30 mornings run 2 of these)
//   25/5   → the P1 / GA daily drip
//   90/15  → one full mock section, exam-condition
// Session count persists per-day so the streak card sees real deep-work volume.

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Pause, Play, RotateCcw, Timer } from 'lucide-react'

type Preset = { focus: number; brk: number; label: string }

const PRESETS: Preset[] = [
  { focus: 50 * 60, brk: 10 * 60, label: '50/10 Deep work' },
  { focus: 25 * 60, brk: 5 * 60, label: '25/5 Sprint' },
  { focus: 90 * 60, brk: 15 * 60, label: '90/15 Mock section' },
]

const LS_KEY = 'md:focus'
const todayStr = () => new Date().toISOString().slice(0, 10)

// Tiny external store over localStorage so the session counter survives
// reloads and never fights hydration (server snapshot = 0).
const listeners = new Set<() => void>()

function readSessions(): number {
  try {
    const raw = window.localStorage.getItem(LS_KEY)
    if (!raw) return 0
    const j = JSON.parse(raw) as { date: string; n: number }
    return j.date === todayStr() ? j.n : 0
  } catch {
    return 0
  }
}

function writeSessions(n: number) {
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify({ date: todayStr(), n }))
  } catch {
    /* private mode */
  }
  listeners.forEach((l) => l())
}

function subscribeSessions(cb: () => void) {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

function chime() {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const play = (freq: number, at: number, dur: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.0001, at)
      gain.gain.exponentialRampToValueAtTime(0.18, at + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, at + dur)
      osc.connect(gain).connect(ctx.destination)
      osc.start(at)
      osc.stop(at + dur)
    }
    const t = ctx.currentTime
    play(880, t, 0.16)
    play(1174.66, t + 0.18, 0.22)
    setTimeout(() => ctx.close().catch(() => {}), 700)
  } catch {
    /* audio unavailable */
  }
}

function fmt(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const R = 46
const CIRC = 2 * Math.PI * R

export default function FocusTimer() {
  const [presetIdx, setPresetIdx] = useState(0)
  const [phase, setPhase] = useState<'focus' | 'break'>('focus')
  const [remaining, setRemaining] = useState(PRESETS[0].focus)
  const [running, setRunning] = useState(false)
  const sessions = useSyncExternalStore(
    subscribeSessions,
    () => (typeof window === 'undefined' ? 0 : readSessions()),
    () => 0,
  )
  const deadline = useRef<number | null>(null)

  const preset = PRESETS[presetIdx]
  const total = phase === 'focus' ? preset.focus : preset.brk

  const advancePhase = useCallback(() => {
    chime()
    setPhase((p) => {
      if (p === 'focus') {
        writeSessions(readSessions() + 1)
        return 'break'
      }
      return 'focus'
    })
  }, [])

  useEffect(() => {
    if (!running) return
    deadline.current = Date.now() + remaining * 1000
    const id = window.setInterval(() => {
      const left = Math.max(0, Math.round(((deadline.current ?? 0) - Date.now()) / 1000))
      setRemaining(left)
      if (left <= 0) {
        window.clearInterval(id)
        setRunning(false)
        advancePhase()
      }
    }, 300)
    return () => window.clearInterval(id)
    // `remaining` is captured once via deadline.current when the effect mounts;
    // ticking updates it through setRemaining without recreating the interval.
  }, [running, advancePhase])

  const switchPhase = useCallback((p: 'focus' | 'break') => {
    setRunning(false)
    setPhase(p)
    setRemaining(p === 'focus' ? PRESETS[presetIdx].focus : PRESETS[presetIdx].brk)
  }, [presetIdx])

  const pickPreset = useCallback((i: number) => {
    setRunning(false)
    setPresetIdx(i)
    setPhase('focus')
    setRemaining(PRESETS[i].focus)
  }, [])

  const reset = useCallback(() => {
    setRunning(false)
    switchPhase(phase)
  }, [phase, switchPhase])

  const pctDone = total > 0 ? 1 - remaining / total : 0
  const isBreak = phase === 'break'

  return (
    <div className="rounded-2xl border border-stone-200/80 bg-card p-4 shadow-sm dark:border-stone-800">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold">
          <Timer className="size-4 text-stone-500 dark:text-stone-400" /> Focus Timer
        </h3>
        <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-600 tabular-nums dark:bg-stone-800 dark:text-stone-300" title="Completed focus sessions today">
          {sessions} session{sessions === 1 ? '' : 's'} today
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Ring */}
        <div className="relative shrink-0">
          <svg width="104" height="104" viewBox="0 0 104 104" className="-rotate-90">
            <circle cx="52" cy="52" r={R} fill="none" strokeWidth="7" className="stroke-stone-200 dark:stroke-stone-800" />
            <circle
              cx="52" cy="52" r={R} fill="none" strokeWidth="7" strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - pctDone)}
              className={cn('transition-[stroke-dashoffset] duration-300', isBreak ? 'stroke-teal-400' : 'stroke-orange-400')}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <p className={cn('text-lg font-bold leading-none tabular-nums', isBreak && 'text-teal-600 dark:text-teal-400')}>
                {fmt(remaining)}
              </p>
              <p className="mt-0.5 text-[8px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">
                {isBreak ? 'break' : 'focus'}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="grid grid-cols-3 gap-1">
            {PRESETS.map((p, i) => (
              <button
                key={p.label}
                onClick={() => pickPreset(i)}
                className={cn(
                  'rounded-md px-1 py-1 text-[9px] font-bold leading-tight transition-colors',
                  i === presetIdx
                    ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900'
                    : 'bg-stone-100 text-stone-500 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700',
                )}
                title={p.label}
              >
                {p.label.split(' ')[0]}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            <Button
              size="sm"
              className="h-8 flex-1 gap-1 rounded-lg bg-stone-900 text-xs hover:bg-stone-700 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200"
              onClick={() => setRunning((r) => !r)}
              aria-label={running ? 'Pause timer' : 'Start timer'}
            >
              {running ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              {running ? 'Pause' : remaining === total ? 'Start' : 'Resume'}
            </Button>
            <Button variant="outline" size="icon" className="size-8 rounded-lg" onClick={reset} aria-label="Reset timer" title="Reset current phase">
              <RotateCcw className="size-3.5" />
            </Button>
          </div>
          <p className="truncate text-[9px] text-stone-400 dark:text-stone-500">
            {isBreak
              ? 'Stand up, water, look far — no feeds'
              : `${preset.label} — one slot at a time, phone face-down`}
          </p>
        </div>
      </div>
    </div>
  )
}

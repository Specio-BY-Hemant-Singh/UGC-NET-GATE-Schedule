'use client'
// ─────────────────────────────────────────────────────────────────────────────
// Unified persistence layer: API (SQLite + Prisma) with automatic localStorage
// fallback and an always-fresh local mirror.
//
// Why: the app must survive on ANY host.
//  - Railway/Render/Fly with a persistent disk → full API sync (cross-device).
//  - Vercel/serverless or offline usage → localStorage keeps every change.
// The mirror is written on every mutation (both modes), so reads can always
// fall back to it, and API loads union-merge offline edits back in.
// ─────────────────────────────────────────────────────────────────────────────

export type StoreMode = 'api' | 'local'

const LS = {
  completions: 'md:completions',
  habits: 'md:habits',
  settings: 'md:settings',
  errors: 'md:errors',
  mocks: 'md:mocks',
} as const

// ── mode broadcast ───────────────────────────────────────────────────────────
let mode: StoreMode = 'api'
const listeners = new Set<(m: StoreMode) => void>()

function setMode(m: StoreMode) {
  if (m === mode) return
  mode = m
  listeners.forEach((l) => l(m))
}

export function getStoreMode(): StoreMode {
  return mode
}

export function onStoreModeChange(cb: (m: StoreMode) => void): () => void {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

// ── localStorage helpers (SSR-safe) ──────────────────────────────────────────
function lsGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function lsSet(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* quota / private mode — ignore */
  }
}

export function localId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `local-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

// ── progress blocks ──────────────────────────────────────────────────────────
export async function saveBlocks(items: { blockKey: string; completed: boolean }[]): Promise<void> {
  const cur = new Set(lsGet<string>(LS.completions, []))
  for (const it of items) {
    if (it.completed) cur.add(it.blockKey)
    else cur.delete(it.blockKey)
  }
  lsSet(LS.completions, [...cur])
  try {
    const res = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    })
    if (!res.ok) throw new Error(String(res.status))
    setMode('api')
  } catch {
    setMode('local')
  }
}

// ── habits ───────────────────────────────────────────────────────────────────
export async function saveHabits(items: { date: string; habitId: string; done: boolean }[]): Promise<void> {
  const cur = new Set(lsGet<string>(LS.habits, []))
  for (const it of items) {
    if (it.done) cur.add(`${it.date}|${it.habitId}`)
    else cur.delete(`${it.date}|${it.habitId}`)
  }
  lsSet(LS.habits, [...cur])
  try {
    const res = await fetch('/api/habits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    })
    if (!res.ok) throw new Error(String(res.status))
    setMode('api')
  } catch {
    setMode('local')
  }
}

// ── settings (key-value) ─────────────────────────────────────────────────────
export async function saveSetting(key: string, value: string): Promise<void> {
  const cur = lsGet<Record<string, string>>(LS.settings, {})
  cur[key] = value
  lsSet(LS.settings, cur)
  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    })
    if (!res.ok) throw new Error(String(res.status))
    setMode('api')
  } catch {
    setMode('local')
  }
}

// ── load everything (API first, offline-merged fallback) ────────────────────
export interface LoadResult {
  completions: string[] // blockKeys
  habits: string[] // "date|habitId"
  settings: Record<string, string>
}

export async function loadAll(): Promise<LoadResult> {
  try {
    const [p, h, s] = await Promise.all([
      fetch('/api/progress').then((r) => (r.ok ? r.json() : Promise.reject(new Error('progress')))),
      fetch('/api/habits').then((r) => (r.ok ? r.json() : Promise.reject(new Error('habits')))),
      fetch('/api/settings').then((r) => (r.ok ? r.json() : Promise.reject(new Error('settings')))),
    ])
    setMode('api')
    const apiC: string[] = (p.completions ?? []).map((x: { blockKey: string }) => x.blockKey)
    const apiH: string[] = (h.habits ?? []).map((x: { date: string; habitId: string }) => `${x.date}|${x.habitId}`)
    const apiS: Record<string, string> = s.settings ?? {}
    const localC = lsGet<string[]>(LS.completions, [])
    const localH = lsGet<string[]>(LS.habits, [])
    const localS = lsGet<Record<string, string>>(LS.settings, {})
    // union-merge: offline additions survive; mirror is kept fresh on every
    // write so this equals the API state whenever the API stayed reachable.
    const merged: LoadResult = {
      completions: [...new Set([...apiC, ...localC])],
      habits: [...new Set([...apiH, ...localH])],
      settings: { ...localS, ...apiS },
    }
    lsSet(LS.completions, merged.completions)
    lsSet(LS.habits, merged.habits)
    lsSet(LS.settings, merged.settings)
    // push offline-only edits back to the API (fire and forget)
    const extraC = merged.completions.filter((k) => !apiC.includes(k))
    const extraH = merged.habits.filter((k) => !apiH.includes(k))
    if (extraC.length) {
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: extraC.map((blockKey) => ({ blockKey, completed: true })) }),
      }).catch(() => {})
    }
    if (extraH.length) {
      fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: extraH.map((k) => { const [date, habitId] = k.split('|'); return { date, habitId, done: true } }) }),
      }).catch(() => {})
    }
    return merged
  } catch {
    setMode('local')
    return {
      completions: lsGet<string[]>(LS.completions, []),
      habits: lsGet<string[]>(LS.habits, []),
      settings: lsGet<Record<string, string>>(LS.settings, {}),
    }
  }
}

// ── error log entries ────────────────────────────────────────────────────────
export interface StoredError {
  id: string
  date: string
  week: number
  subject: string
  category: string
  note: string
  resolved: boolean
}

export async function loadErrors(): Promise<StoredError[]> {
  try {
    const res = await fetch('/api/errors')
    if (!res.ok) throw new Error(String(res.status))
    const j: { entries?: StoredError[] } = await res.json()
    const entries = j.entries ?? []
    lsSet(LS.errors, entries) // fresh mirror
    setMode('api')
    return entries
  } catch {
    setMode('local')
    return lsGet<StoredError[]>(LS.errors, [])
  }
}

/** Mirror the full current list (no API op — used after local-only creates). */
export function mirrorErrors(mirror: StoredError[]) {
  lsSet(LS.errors, mirror)
}

/** Mirror the full current list, then try the API op. */
async function persistErrorsApi(op: Promise<Response>, mirror: StoredError[]) {
  lsSet(LS.errors, mirror)
  try {
    const res = await op
    if (!res.ok) throw new Error(String(res.status))
    setMode('api')
  } catch {
    setMode('local')
  }
}

export function createErrorRemote(payload: Omit<StoredError, 'id' | 'resolved'>, fallbackId: string): Promise<{ id: string }> {
  return fetch('/api/errors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then(async (res) => {
      if (!res.ok) throw new Error(String(res.status))
      const j: { entry?: { id: string } } = await res.json()
      setMode('api')
      return { id: j.entry?.id ?? fallbackId }
    })
    .catch(() => {
      setMode('local')
      return { id: fallbackId }
    })
}

export function updateErrorRemote(id: string, resolved: boolean, mirror: StoredError[]) {
  return persistErrorsApi(
    fetch('/api/errors', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, resolved }) }),
    mirror,
  )
}

export function deleteErrorRemote(id: string, mirror: StoredError[]) {
  return persistErrorsApi(fetch(`/api/errors?id=${encodeURIComponent(id)}`, { method: 'DELETE' }), mirror)
}

// ── mock scores ──────────────────────────────────────────────────────────────
export interface StoredMock {
  id: string
  label: string
  exam: string
  score: number
  max: number
  takenOn: string
}

export async function loadMocks(): Promise<StoredMock[]> {
  try {
    const res = await fetch('/api/mocks')
    if (!res.ok) throw new Error(String(res.status))
    const j: { mocks?: StoredMock[] } = await res.json()
    const mocks = j.mocks ?? []
    lsSet(LS.mocks, mocks)
    setMode('api')
    return mocks
  } catch {
    setMode('local')
    return lsGet<StoredMock[]>(LS.mocks, [])
  }
}

async function persistMocksApi(op: Promise<Response>, mirror: StoredMock[]) {
  lsSet(LS.mocks, mirror)
  try {
    const res = await op
    if (!res.ok) throw new Error(String(res.status))
    setMode('api')
  } catch {
    setMode('local')
  }
}

export function createMockRemote(payload: Omit<StoredMock, 'id'>, fallbackId: string): Promise<{ id: string }> {
  return fetch('/api/mocks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then(async (res) => {
      if (!res.ok) throw new Error(String(res.status))
      const j: { mock?: { id: string } } = await res.json()
      setMode('api')
      return { id: j.mock?.id ?? fallbackId }
    })
    .catch(() => {
      setMode('local')
      return { id: fallbackId }
    })
}

export function deleteMockRemote(id: string, mirror: StoredMock[]) {
  return persistMocksApi(fetch(`/api/mocks?id=${encodeURIComponent(id)}`, { method: 'DELETE' }), mirror)
}

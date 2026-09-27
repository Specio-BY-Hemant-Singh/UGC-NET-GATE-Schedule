import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export interface MockSection {
  name: string
  score: number
  max: number
}

/** Validate an optional section-breakdown payload. Returns null when absent/invalid. */
export function parseSections(raw: unknown): MockSection[] | null | undefined {
  if (raw === undefined || raw === null || raw === '') return raw === undefined ? undefined : null
  if (!Array.isArray(raw)) return undefined
  const out: MockSection[] = []
  for (const s of raw) {
    if (!s || typeof s !== 'object') return undefined
    const o = s as Record<string, unknown>
    const name = typeof o.name === 'string' ? o.name.trim() : ''
    const score = Number(o.score)
    const max = Number(o.max)
    if (!name || !Number.isFinite(score) || !Number.isFinite(max) || max <= 0 || score < 0 || score > max) {
      return undefined
    }
    out.push({ name: name.slice(0, 60), score, max })
  }
  return out.length ? out : null // empty array → clear
}

// GET → all mock scores (chronological)
export async function GET() {
  try {
    const mocks = await db.mockScore.findMany({ orderBy: [{ takenOn: 'asc' }, { createdAt: 'asc' }] })
    return NextResponse.json({ mocks })
  } catch (err) {
    console.error('GET /api/mocks failed', err)
    return NextResponse.json({ error: 'Failed to load mock scores' }, { status: 500 })
  }
}

// POST → create { label, exam, score, max, takenOn, sections? }
export async function POST(req: NextRequest) {
  try {
    const b = await req.json()
    const score = Number(b.score)
    const max = Number(b.max)
    if (
      typeof b.label !== 'string' ||
      !b.label.trim() ||
      (b.exam !== 'NET' && b.exam !== 'GATE') ||
      !Number.isFinite(score) ||
      !Number.isFinite(max) ||
      max <= 0 ||
      score < 0 ||
      score > max
    ) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }
    let sectionsJson: string | null = null
    if (b.sections !== undefined && b.sections !== null && b.sections !== '') {
      const secs = parseSections(b.sections)
      if (secs === undefined) return NextResponse.json({ error: 'Invalid section payload' }, { status: 400 })
      sectionsJson = secs ? JSON.stringify(secs) : null
    }
    const mock = await db.mockScore.create({
      data: {
        label: b.label.trim().slice(0, 120),
        exam: b.exam,
        score,
        max,
        takenOn: typeof b.takenOn === 'string' && b.takenOn ? b.takenOn : new Date().toISOString().slice(0, 10),
        sections: sectionsJson,
      },
    })
    return NextResponse.json({ mock }, { status: 201 })
  } catch (err) {
    console.error('POST /api/mocks failed', err)
    return NextResponse.json({ error: 'Failed to save mock score' }, { status: 500 })
  }
}

// PATCH → { id, sections } update the section breakdown of an existing mock
export async function PATCH(req: NextRequest) {
  try {
    const b = await req.json()
    if (typeof b.id !== 'string' || !b.id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }
    const secs = parseSections(b.sections)
    if (secs === undefined) return NextResponse.json({ error: 'Invalid section payload' }, { status: 400 })
    const mock = await db.mockScore.update({
      where: { id: b.id },
      data: { sections: secs ? JSON.stringify(secs) : null },
    })
    return NextResponse.json({ mock })
  } catch (err) {
    console.error('PATCH /api/mocks failed', err)
    return NextResponse.json({ error: 'Failed to update mock score' }, { status: 500 })
  }
}

// DELETE → ?id=
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    await db.mockScore.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/mocks failed', err)
    return NextResponse.json({ error: 'Failed to delete mock score' }, { status: 500 })
  }
}

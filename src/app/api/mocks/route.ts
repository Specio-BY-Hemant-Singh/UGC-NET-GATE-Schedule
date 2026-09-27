import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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

// POST → create { label, exam, score, max, takenOn }
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
    const mock = await db.mockScore.create({
      data: {
        label: b.label.trim().slice(0, 120),
        exam: b.exam,
        score,
        max,
        takenOn: typeof b.takenOn === 'string' && b.takenOn ? b.takenOn : new Date().toISOString().slice(0, 10),
      },
    })
    return NextResponse.json({ mock }, { status: 201 })
  } catch (err) {
    console.error('POST /api/mocks failed', err)
    return NextResponse.json({ error: 'Failed to save mock score' }, { status: 500 })
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

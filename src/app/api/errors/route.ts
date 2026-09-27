import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET → all error entries (newest first)
export async function GET() {
  try {
    const entries = await db.errorEntry.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ entries })
  } catch (err) {
    console.error('GET /api/errors failed', err)
    return NextResponse.json({ error: 'Failed to load error log' }, { status: 500 })
  }
}

// POST → create { date, week, subject, category, note }
export async function POST(req: NextRequest) {
  try {
    const b = await req.json()
    if (
      typeof b.date !== 'string' ||
      typeof b.week !== 'number' ||
      typeof b.subject !== 'string' ||
      typeof b.category !== 'string' ||
      typeof b.note !== 'string' ||
      !b.note.trim()
    ) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }
    const entry = await db.errorEntry.create({
      data: {
        date: b.date,
        week: b.week,
        subject: b.subject,
        category: b.category,
        note: b.note.trim().slice(0, 500),
      },
    })
    return NextResponse.json({ entry }, { status: 201 })
  } catch (err) {
    console.error('POST /api/errors failed', err)
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 })
  }
}

// PATCH → toggle resolved { id, resolved }
export async function PATCH(req: NextRequest) {
  try {
    const { id, resolved } = await req.json()
    if (typeof id !== 'string' || typeof resolved !== 'boolean') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }
    const entry = await db.errorEntry.update({ where: { id }, data: { resolved } })
    return NextResponse.json({ entry })
  } catch (err) {
    console.error('PATCH /api/errors failed', err)
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 })
  }
}

// DELETE → ?id=
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    await db.errorEntry.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/errors failed', err)
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 })
  }
}

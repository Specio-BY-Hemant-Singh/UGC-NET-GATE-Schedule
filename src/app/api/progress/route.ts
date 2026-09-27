import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET → all completions
export async function GET() {
  try {
    const rows = await db.taskCompletion.findMany({
      where: { completed: true },
      select: { blockKey: true, updatedAt: true },
    })
    return NextResponse.json({ completions: rows })
  } catch (err) {
    console.error('GET /api/progress failed', err)
    return NextResponse.json({ error: 'Failed to load progress' }, { status: 500 })
  }
}

// POST → upsert one { blockKey, completed } or many { items: [...] }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const items: { blockKey: string; completed: boolean }[] = Array.isArray(body.items)
      ? body.items
      : [body]

    if (!items.length || items.some((i) => typeof i.blockKey !== 'string' || typeof i.completed !== 'boolean')) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    await db.$transaction(
      items.map((i) =>
        db.taskCompletion.upsert({
          where: { blockKey: i.blockKey },
          create: { blockKey: i.blockKey, completed: i.completed },
          update: { completed: i.completed },
        })
      )
    )
    return NextResponse.json({ ok: true, count: items.length })
  } catch (err) {
    console.error('POST /api/progress failed', err)
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 })
  }
}

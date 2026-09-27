import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET → all habit logs (only done=true keeps payload small)
export async function GET() {
  try {
    const rows = await db.habitLog.findMany({
      where: { done: true },
      select: { date: true, habitId: true },
    })
    return NextResponse.json({ habits: rows })
  } catch (err) {
    console.error('GET /api/habits failed', err)
    return NextResponse.json({ error: 'Failed to load habits' }, { status: 500 })
  }
}

// POST → upsert { date, habitId, done } or many { items: [...] }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const items: { date: string; habitId: string; done: boolean }[] = Array.isArray(body.items)
      ? body.items
      : [body]

    if (
      !items.length ||
      items.some((i) => typeof i.date !== 'string' || typeof i.habitId !== 'string' || typeof i.done !== 'boolean')
    ) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    await db.$transaction(
      items.map((i) =>
        db.habitLog.upsert({
          where: { date_habitId: { date: i.date, habitId: i.habitId } },
          create: { date: i.date, habitId: i.habitId, done: i.done },
          update: { done: i.done },
        })
      )
    )
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('POST /api/habits failed', err)
    return NextResponse.json({ error: 'Failed to save habit' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET → all settings as a key/value map
export async function GET() {
  try {
    const rows = await db.appSetting.findMany()
    const map: Record<string, string> = {}
    for (const r of rows) map[r.key] = r.value
    return NextResponse.json({ settings: map })
  } catch (err) {
    console.error('GET /api/settings failed', err)
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 })
  }
}

// POST → upsert { key, value }
export async function POST(req: NextRequest) {
  try {
    const { key, value } = await req.json()
    if (typeof key !== 'string' || typeof value !== 'string') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }
    await db.appSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('POST /api/settings failed', err)
    return NextResponse.json({ error: 'Failed to save setting' }, { status: 500 })
  }
}

// Schedule audit — validates every detail of the 19-week plan
import { WEEKS, ALL_BLOCKS, TOTAL_TASKS, TOTAL_MINUTES } from '../src/lib/plan'
import { PLAN_START_ISO, PLAN_END_ISO, NET_EXAM_ISO, GATE_EXAM_ISO, SUBJECTS, addDays, daysBetween, isoToDate } from '../src/lib/plan-types'

type Issue = { sev: 'ERROR' | 'WARN'; msg: string }
const issues: Issue[] = []
const err = (m: string) => issues.push({ sev: 'ERROR', msg: m })
const warn = (m: string) => issues.push({ sev: 'WARN', msg: m })

// ── 1. Structure ────────────────────────────────────────────────────────────
if (WEEKS.length !== 19) err(`Expected 19 weeks, got ${WEEKS.length}`)
WEEKS.forEach((w) => {
  if (w.days.length !== 7) err(`W${w.week}: ${w.days.length} days (expected 7)`)
  if (!w.title) err(`W${w.week}: missing title`)
  if (!w.milestone) err(`W${w.week}: missing milestone`)
  if (!w.notes || w.notes.length === 0) warn(`W${w.week}: no notes`)
})

// ── 2. Date continuity & day-of-week correctness ────────────────────────────
WEEKS.forEach((w) => {
  w.days.forEach((d, di) => {
    const expected = addDays(PLAN_START_ISO, (w.week - 1) * 7 + di)
    if (d.date !== expected) err(`W${w.week} day${di}: date ${d.date} ≠ expected ${expected}`)
  })
})
const firstDay = isoToDate(WEEKS[0].days[0].date).getUTCDay()
if (firstDay !== 1) err(`Plan start ${WEEKS[0].days[0].date} is not a Monday (UTC day=${firstDay})`)

// plan end must equal W19 Sunday
const lastDate = WEEKS[18].days[6].date
if (lastDate !== PLAN_END_ISO) err(`W19 Sunday ${lastDate} ≠ PLAN_END_ISO ${PLAN_END_ISO}`)

// ── 3. Exam dates land on the right week/day ────────────────────────────────
const netWeek = WEEKS.find((w) => w.days.some((d) => d.date === NET_EXAM_ISO))
const gateWeek = WEEKS.find((w) => w.days.some((d) => d.date === GATE_EXAM_ISO))
if (!netWeek) err(`NET exam date ${NET_EXAM_ISO} not inside plan window`)
else {
  const di = netWeek.days.findIndex((d) => d.date === NET_EXAM_ISO)
  const d = netWeek.days[di]
  if (d.dayName !== 'Sunday') warn(`NET exam ${NET_EXAM_ISO} is a ${d.dayName} (expected Sunday)`)
  const examBlocks = d.blocks.filter((b) => b.k === 'exam')
  if (examBlocks.length === 0) err(`NET exam day (${d.date}) has NO 'exam' kind block`)
  else console.log(`✓ NET exam on W${netWeek.week} ${d.dayName} ${d.date} — ${examBlocks.length} exam block(s): ${examBlocks.map((b) => b.t).join(' | ')}`)
}
if (!gateWeek) err(`GATE exam date ${GATE_EXAM_ISO} not inside plan window`)
else {
  const di = gateWeek.days.findIndex((d) => d.date === GATE_EXAM_ISO)
  const d = gateWeek.days[di]
  if (d.dayName !== 'Sunday') warn(`GATE exam ${GATE_EXAM_ISO} is a ${d.dayName} (expected Sunday)`)
  const examBlocks = d.blocks.filter((b) => b.k === 'exam')
  if (examBlocks.length === 0) err(`GATE exam day (${d.date}) has NO 'exam' kind block`)
  else console.log(`✓ GATE exam on W${gateWeek.week} ${d.dayName} ${d.date} — ${examBlocks.length} exam block(s): ${examBlocks.map((b) => b.t).join(' | ')}`)
}

// any exam-kind blocks outside exam days?
ALL_BLOCKS.forEach((b) => {
  if (b.k === 'exam' && b.key !== undefined) {
    const wk = parseInt(b.key.slice(1, 3), 10)
    const day = WEEKS[wk - 1].days[parseInt(b.key.slice(5, 6), 10)]
    if (day.date !== NET_EXAM_ISO && day.date !== GATE_EXAM_ISO) err(`'exam' block outside exam day: ${b.key} @ ${day.date} — ${b.t}`)
  }
})

// ── 4. Block integrity ──────────────────────────────────────────────────────
const keys = new Set<string>()
let dupKeys = 0
let noTask = 0
ALL_BLOCKS.forEach((b) => {
  if (keys.has(b.key)) { err(`Duplicate block key: ${b.key}`); dupKeys++ }
  keys.add(b.key)
  if (!b.s) err(`${b.key}: missing slot label`)
  if (!b.m || b.m <= 0 || Number.isNaN(b.m)) err(`${b.key}: bad minutes ${b.m}`)
  if (!b.t) err(`${b.key}: missing title`)
  if (!b.st || b.st.length === 0) err(`${b.key}: no subtopics`)
  if (!SUBJECTS[b.sub]) err(`${b.key}: unknown subject '${b.sub}'`)
  if (!b.task) noTask++ // optional — st[] carries instructions
})
console.log(`\nBlocks: ${TOTAL_TASKS} unique=${keys.size} dup=${dupKeys} (no explicit task line: ${noTask} — st[] carries instructions, OK)`)

// ── 5. Daily minute budgets vs the 4–5 h cap (exam days whitelisted) ────────
const CAP = 300 // 5 h hard cap
WEEKS.forEach((w) => w.days.forEach((d) => {
  if (d.kind === 'exam') return // exam day: travel + exam + post-exam is inherently > 5 h
  if (d.minutes > CAP) err(`${d.date} (W${w.week} ${d.dayName}): ${d.minutes} min — exceeds 5h cap`)
}))

// ── 6. Slot overlap + slot/minutes consistency + kind/dayName sanity ────────
WEEKS.forEach((w) => w.days.forEach((d) => {
  const parsed = d.blocks.map((b) => {
    const m = b.s.match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/)
    if (!m) return null
    return { start: +m[1] * 60 + +m[2], end: +m[3] * 60 + +m[4] }
  })
  for (let i = 1; i < parsed.length; i++) {
    const prev = parsed[i - 1]; const cur = parsed[i]
    if (!prev || !cur) continue
    if (cur.start < prev.end) warn(`${d.date} overlap: "${d.blocks[i - 1].s}" & "${d.blocks[i].s}"`)
  }
  parsed.forEach((p, i) => {
    if (p) {
      const dur = p.end - p.start
      if (Math.abs(dur - d.blocks[i].m) > 5) warn(`${d.date} slot "${d.blocks[i].s}" duration ${dur}m ≠ minutes ${d.blocks[i].m}`)
    }
  })
  if (d.kind === 'sunday' && d.dayName !== 'Sunday') err(`${d.date}: kind=sunday but dayName=${d.dayName}`)
  if (d.kind === 'saturday' && d.dayName !== 'Saturday') err(`${d.date}: kind=saturday but dayName=${d.dayName}`)
  if (d.kind === 'mock' && d.dayName === 'Sunday') err(`${d.date}: kind=mock on a Sunday`)
  if (d.kind === 'exam' && d.dayName !== 'Sunday') warn(`${d.date}: kind=exam but dayName=${d.dayName}`)
}))

// ── 7. Subject validity & usage ─────────────────────────────────────────────
const subjUsage = new Map<string, number>()
ALL_BLOCKS.forEach((b) => subjUsage.set(b.sub, (subjUsage.get(b.sub) ?? 0) + b.m))
console.log('\nSubject hours:')
;[...subjUsage.entries()].sort((a, b) => b[1] - a[1]).forEach(([s, min]) => {
  console.log(`  ${SUBJECTS[s as keyof typeof SUBJECTS].name.padEnd(30)} ${(min / 60).toFixed(1)} h`)
})
Object.keys(SUBJECTS).forEach((s) => { if (!subjUsage.has(s as any)) warn(`Subject '${s}' defined but NEVER used in any block`) })

// ── 8. Phase ordering sanity ────────────────────────────────────────────────
const phases = WEEKS.map((w) => w.phase)
for (let i = 1; i < phases.length; i++) {
  if (phases[i] < phases[i - 1]) err(`Phase regression at W${i + 1}: ${phases[i]} after ${phases[i - 1]}`)
}
console.log(`\nPhases: ${phases.join(',')}`)

// ── 9. Weekly totals table ──────────────────────────────────────────────────
console.log('\nWeek map:')
WEEKS.forEach((w) => console.log(`  W${String(w.week).padStart(2, '0')} ${w.startDate}→${w.endDate}  P${w.phase}  ${(w.minutes / 60).toFixed(2)}h  ${w.title.slice(0, 58)}`))

// ── 10. Exam offsets ────────────────────────────────────────────────────────
const netOff = daysBetween(PLAN_START_ISO, NET_EXAM_ISO)
const gateOff = daysBetween(PLAN_START_ISO, GATE_EXAM_ISO)
console.log(`\nNET exam day-offset: ${netOff} (week ${Math.floor(netOff / 7) + 1})`)
console.log(`GATE exam day-offset: ${gateOff} (week ${Math.floor(gateOff / 7) + 1})`)

// ── Summary ─────────────────────────────────────────────────────────────────
console.log(`\nTotal: ${TOTAL_TASKS} blocks · ${(TOTAL_MINUTES / 60).toFixed(1)} h`)
console.log(`\n═══ ISSUES: ${issues.filter((i) => i.sev === 'ERROR').length} errors, ${issues.filter((i) => i.sev === 'WARN').length} warnings ═══`)
issues.forEach((i) => console.log(`${i.sev === 'ERROR' ? '✗' : '⚠'} ${i.msg}`))
if (issues.filter((i) => i.sev === 'ERROR').length === 0) console.log('\n✅ NO ERRORS — schedule is structurally sound')

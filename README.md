# Mission Dual — Exam Command Center

A **19-week, evidence-calibrated preparation dashboard** for running **GATE 2027 (DA — Data Science & AI)** and **UGC NET Dec 2026 (Computer Science & Applications)** in parallel on a working professional's schedule: **4–5 study hours/day** (7 h sleep + 8 h work preserved), including weekends.

> One calendar. Two syllabi. 549 timed study blocks · ~587 hours · zero guesswork about what to do next.

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Prisma](https://img.shields.io/badge/Prisma-SQLite-darkgreen) ![Tailwind](https://img.shields.io/badge/TailwindCSS-4-38bdf8) ![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-New%20York-black)

---

## 🌐 Live app

**→ https://specio-by-hemant-singh.github.io/UGC-NET-GATE-Schedule/ ←**

Open it on your phone or laptop and start ticking blocks. The GitHub Pages build runs fully client-side — progress, habits, error log and mock scores persist in **your browser's localStorage** (amber *local mode* indicator in the footer). Moving devices? Use the in-app **Export/Import JSON backup**. For server-side SQLite sync across devices, deploy the Railway/Docker way below — every push to `main` auto-redeploys Pages via the included GitHub Actions workflow.

## Why this exists

Cramming two national-level exams together usually fails because of *decision fatigue*, not lack of effort. This dashboard removes the daily "what do I study now?" question:

- **Every day is pre-planned to the minute** — 5–6 timed blocks with topic, subtopics, and drill instructions.
- **Every block is calibrated against real papers** — GATE DA 2024/2025/2026 PYQs question-by-question, and UGC NET Dec 2025 (exam of 2 Jan 2026) + June 2025 shift analyses.
- **Progress is one click** — tick a block, see hours banked, streaks, and subject mastery update live.

## Features

| Area | What you get |
|---|---|
| 📅 Daily schedule | 06:30–22:00 weekday grid (4.75 h), Saturday consolidation, Sunday light maintenance, dedicated MOCK & EXAM day layouts |
| 🧭 Week navigator | W1→W19 pills with phase dots (Coverage → NET Peak → GATE Build → GATE Peak), per-week progress bars, NOW marker, live countdowns to both exams |
| ✅ Progress tracking | Per-block checkmarks, bulk day complete/reset, hours banked, overall/weekly %, subject mastery map, NET/GATE/shared split — persisted automatically |
| 🔁 Habit tracker | 8 non-negotiables (sleep, flashcards D1, error log, P1/GA drill, coding touch, exercise, planning), 7-day dot matrix, streak engine |
| 🧯 Error log | Concept / process / judgement / trap taxonomy — the core feedback loop of both exam plans |
| 📊 Mock ledger | NET + GATE mock score series with target lines (NET 250+/300 · GATE 95+/100) and trend chart |
| 🧠 Pattern Intelligence | Collapsible PYQ-intel card: GATE DA paper anatomy & section weights, NET unit weights from the real Dec 2025 paper, repeat question archetypes with paper citations, exam-window watch |
| 💾 Storage modes | SQLite via Prisma **with automatic localStorage fallback** — works on any host, even fully offline |
| 🌗 Dark mode, mobile-first, sticky footer, keyboard-accessible checks | |

## The 19-week campaign at a glance

| Phase | Weeks | Focus |
|---|---|---|
| **1 · Coverage Sprint** | W1–W7 | 100% of NET Paper-2 touched once + Paper-1 daily drips; GATE math (P&S → Linear Algebra) rides the 20:45 parallel slot |
| **2 · NET Peak** | W8–W11 | 8 NET PYQ sets, 5 full mocks, taper — **NET exam (Sun 13 Dec 2026)** |
| **3 · GATE Build** | W12–W15 | P&S inference, Calculus, ML, AI, DBMS/warehousing full sweep + consolidation test |
| **4 · GATE Peak** | W16–W19 | PYQ sectionals, 6 full mocks, marks-budget audit, final revision — **GATE exam (Sun 7 Feb 2027)** |

Daily budget: **weekdays 4.75 h · Saturday ~5 h · Sunday 2.5 h** (exam days excepted). Run `bun run audit:schedule` to re-verify every date, hour budget, slot overlap and block key yourself.

## Tech stack

- **Next.js 16** (App Router) + **TypeScript 5**
- **Tailwind CSS 4** + **shadcn/ui** (New York) + Lucide icons + Framer Motion
- **Prisma ORM + SQLite** (`db/custom.db`)
- Plan data lives in typed TS modules (`src/lib/plan-*.ts`) — the schedule is code, auditable and diffable.

## Quick start

```bash
# 1. Clone + install
git clone https://github.com/Specio-BY-Hemant-Singh/UGC-NET-GATE-Schedule.git
cd UGC-NET-GATE-Schedule
bun install            # or: npm install

# 2. Environment
cp .env.example .env   # default DATABASE_URL works out of the box

# 3. Database (SQLite — creates db/custom.db)
bunx prisma db push

# 4. Run
bun run dev            # http://localhost:3000
```

> npm works fine too: `npm install && npx prisma db push && npm run dev`.

## Scripts

| Command | What it does |
|---|---|
| `bun run dev` | Dev server on port 3000 |
| `bun run build` / `bun run start` | Production build (standalone output) & serve |
| `bun run lint` | ESLint |
| `bun run db:push` | Push `prisma/schema.prisma` to SQLite |
| `bun run audit:schedule` | **Full schedule audit** — 19 weeks × 7 days, date continuity, exam-day placement, 5 h/day cap, slot overlaps, duplicate keys, subject usage |

## Deployment

The app ships with an **API + localStorage hybrid persistence layer** (`src/lib/store.ts`). Every write goes to an always-fresh localStorage mirror *and* the API; reads prefer the API and union-merge offline edits. Practical consequences:

- Host with a persistent disk → full server sync.
- Serverless host (or offline) → everything still persists locally in the browser; the footer shows which mode is active.

### GitHub Pages (zero-config, already wired)

Every push to `main` triggers `.github/workflows/deploy-pages.yml`: it builds a **static export** (`EXPORT_BUILD=1`, API routes excluded) and publishes it. Progress persists per-browser via localStorage — nothing to configure. Manual re-runs: repo **Actions → Deploy to GitHub Pages → Run workflow**.

### Railway (server-side SQLite + cross-device sync)

1. Push the repo to GitHub → **New Project → Deploy from GitHub** on [Railway](https://railway.app).
2. Add a **Volume** and mount it at `/app/db`.
3. Set env var `DATABASE_URL=file:/app/db/custom.db`.
4. Deploy — `nixpacks.toml` (included) runs `prisma generate`, builds, and runs `prisma db push` on start so the schema always exists on the volume.

### Docker (any host: Fly.io, Render, Koyeb, VPS)

```bash
docker build -t mission-dual .
docker run -p 3000:3000 -v mission-dual-db:/app/db -e DATABASE_URL=file:/app/db/custom.db mission-dual
```

### Vercel / Netlify (serverless)

Deploy with zero config. SQLite file storage is not persistent on serverless — the app automatically falls back to **localStorage mode** (amber indicator in the footer). All features keep working on one device.

> **Why not Streamlit?** Streamlit is a Python data-app framework — this project is a React/Next.js product with client interactivity, API routes and a database, which Streamlit cannot express well. The deploy targets above cover the same "push to GitHub → public URL" workflow with a first-class fit.

## Project structure

```
prisma/schema.prisma        # TaskCompletion · HabitLog · AppSetting · ErrorEntry · MockScore
db/custom.db                # SQLite (gitignored)
src/lib/plan-types.ts       # types, 17 subjects, 8 habits, date helpers (Asia/Kolkata)
src/lib/plan-weeks-a.ts     # W1–W11 block data (PYQ-cited subtopics)
src/lib/plan-weeks-b.ts     # W12–W19 block data
src/lib/plan.ts             # expands 549 dated, keyed blocks + derived stats
src/lib/pyq-intel.ts        # GATE + NET pattern intelligence data
src/lib/store.ts            # API + localStorage hybrid persistence
src/app/api/*               # progress · habits · settings · errors · mocks
src/components/dashboard/*  # dashboard · week-view · habit-panel · error-log · mock-ledger · pattern-intel
scripts/audit-schedule.ts   # the schedule auditor
nixpacks.toml / Dockerfile  # deployment configs
```

## Exam-pattern sources (what "calibrated" means)

- **GATE DA**: official papers 2024 (IISc), 2024 Sample (IISc), 2025 (IIT Roorkee), 2026 (IIT Guwahati) — audited question-by-question (paper anatomy, section weights, ~30 repeat archetypes, cited in-app).
- **UGC NET CS**: Dec 2025 cycle analysis (exam of 2 Jan 2026, shift 1) with unit-wise question distribution, June 2025 shift-level Paper-1 hotspots (Indian Logic, ICT, SDG, NEP, Bloom's taxonomy…), and the official archive [ugcnetonline.in](https://ugcnetonline.in/ugc_net_previous_question_papers.php) (Subject 87).
- **Exam-window watch**: recent "Dec" cycles have run into early January (Dec 2025 CS exam ran 2 Jan 2026). The plan anchors NET at 13 Dec 2026 and keeps slack in the taper — check the orange note in Pattern Intelligence.

## License

[MIT](./LICENSE)

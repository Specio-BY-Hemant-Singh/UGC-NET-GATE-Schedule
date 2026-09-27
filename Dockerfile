# ── build ────────────────────────────────────────────────────────────────────
FROM oven/bun:1 AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json bun.lock ./
COPY prisma ./prisma
RUN bun install --frozen-lockfile

COPY . .
RUN bunx prisma generate && bun run build

# ── runtime ──────────────────────────────────────────────────────────────────
FROM oven/bun:1-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# Override with a volume-mounted path in production:
#   docker run -v mission-dual-db:/app/db -e DATABASE_URL=file:/app/db/custom.db ...
ENV DATABASE_URL=file:/app/db/custom.db

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
# Prisma client + CLI (for `prisma db push` on first boot with a fresh volume)
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma
RUN mkdir -p db

EXPOSE 3000

# Ensure the schema exists on a fresh volume, then serve
CMD ["sh", "-c", "./node_modules/.bin/prisma db push --accept-data-loss || true; bun .next/standalone/server.js"]

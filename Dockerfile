# syntax=docker/dockerfile:1

# Multi-stage build for the Next.js standalone server with automated migrations.
#
# Stages:
#   deps      – install the full dependency tree once, from the lockfile
#   builder   – run `next build` (needs devDependencies: React Compiler, Tailwind)
#   runner    – the runtime image: standalone server, non-root, auto-migrates on startup

ARG NODE_IMAGE=node:24-alpine

# ---------------------------------------------------------------------------
# deps — resolved dependency tree, cached on the lockfile alone
# ---------------------------------------------------------------------------
FROM ${NODE_IMAGE} AS deps
WORKDIR /app

# libc6-compat covers prebuilt native addons that expect glibc symbols on musl.
RUN apk add --no-cache libc6-compat

ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    CI=true
RUN corepack enable

# Only the manifests, so editing source never invalidates the install layer.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,target=/pnpm/store,sharing=locked \
    pnpm install --frozen-lockfile

# ---------------------------------------------------------------------------
# builder — produce .next/standalone
# ---------------------------------------------------------------------------
FROM ${NODE_IMAGE} AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    CI=true \
    NEXT_TELEMETRY_DISABLED=1
RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* values are substituted into the client bundle at build time, so
# they must arrive as build args — setting them at `docker run` does nothing.
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_UMAMI_WEBSITE_ID
ARG NEXT_PUBLIC_UMAMI_URL
ARG NEXT_PUBLIC_UMAMI_SCRIPT_URL
ARG NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL} \
    NEXT_PUBLIC_UMAMI_WEBSITE_ID=${NEXT_PUBLIC_UMAMI_WEBSITE_ID} \
    NEXT_PUBLIC_UMAMI_URL=${NEXT_PUBLIC_UMAMI_URL} \
    NEXT_PUBLIC_UMAMI_SCRIPT_URL=${NEXT_PUBLIC_UMAMI_SCRIPT_URL} \
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=${NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}

# The real values are injected by Coolify as runtime env.
ENV DATABASE_URL=postgresql://build:build@127.0.0.1:5432/build \
    BETTER_AUTH_SECRET=placeholder-only-for-build-not-a-real-secret

RUN pnpm build

# ---------------------------------------------------------------------------
# migrator-deps — the two packages scripts/migrate.mjs needs at runtime
#
# `next build` only traces what the app's own pages and routes import.
# drizzle-orm/node-postgres/migrator is imported by neither, so it never lands
# in .next/standalone and the entrypoint's `node scripts/migrate.mjs` fails with
# ERR_MODULE_NOT_FOUND. Install just those two packages (with their transitive
# deps) into a self-contained tree instead of hand-copying pieces of the pnpm
# store. Versions are pinned to package.json to keep this in step with the app.
# ---------------------------------------------------------------------------
FROM ${NODE_IMAGE} AS migrator-deps
WORKDIR /migrator

RUN apk add --no-cache libc6-compat

# Read the versions out of package.json rather than repeating them here, so a
# dependency bump cannot leave the migrator on a different drizzle-orm than the
# app. Staged in /tmp so npm treats /migrator as an empty project.
COPY package.json /tmp/app-package.json
RUN npm install --omit=dev --no-package-lock --no-audit --no-fund \
      "drizzle-orm@$(node -p "require('/tmp/app-package.json').dependencies['drizzle-orm']")" \
      "pg@$(node -p "require('/tmp/app-package.json').dependencies.pg")"

# ---------------------------------------------------------------------------
# runner — the deployed image
# ---------------------------------------------------------------------------
FROM ${NODE_IMAGE} AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Non-root. Fixed uid/gid so bind-mounted files keep predictable ownership
# across hosts.
RUN addgroup -S -g 1001 nodejs \
    && adduser -S -D -u 1001 -G nodejs nextjs

# public/ is served by the standalone server but is not traced into it.
COPY --from=builder /app/public ./public
# standalone contains server.js plus a minimal, traced node_modules.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Static assets are likewise excluded from the trace and must be copied.
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Migrations & startup entrypoint (runs drizzle migrations before server.js)
COPY --chown=nextjs:nodejs drizzle ./drizzle
COPY --chown=nextjs:nodejs scripts/migrate.mjs ./scripts/migrate.mjs
# Sits beside migrate.mjs so Node resolves its imports here. Kept out of
# /app/node_modules so it cannot shadow the traced tree server.js runs against.
COPY --from=migrator-deps --chown=nextjs:nodejs /migrator/node_modules ./scripts/node_modules
COPY --chmod=755 docker-entrypoint.sh ./docker-entrypoint.sh

USER nextjs
EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]

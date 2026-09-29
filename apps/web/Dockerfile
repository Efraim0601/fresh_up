# Squelette Dockerfile pour apps/web (Phase 1 scaffolding).
# A completer/valider en Phase 1 une fois le premier build Next.js stable
# (multi-stage build, standalone output, etc.).
FROM node:20-alpine AS base
WORKDIR /repo

FROM base AS deps
COPY package.json pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate
RUN pnpm install --filter @fresh-up/web...

FROM deps AS build
COPY . .
RUN pnpm --filter @fresh-up/web build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /repo/apps/web ./apps/web
COPY --from=build /repo/node_modules ./node_modules
WORKDIR /repo/apps/web
EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]

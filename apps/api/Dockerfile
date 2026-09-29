# Squelette Dockerfile pour apps/api (Phase 1 scaffolding).
# A completer/valider en Phase 1 une fois le premier build NestJS stable.
FROM node:20-alpine AS base
WORKDIR /repo

FROM base AS deps
COPY package.json pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate
RUN pnpm install --filter @fresh-up/api...

FROM deps AS build
COPY . .
RUN pnpm --filter @fresh-up/api prisma:generate
RUN pnpm --filter @fresh-up/api build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /repo/apps/api ./apps/api
COPY --from=build /repo/node_modules ./node_modules
WORKDIR /repo/apps/api
EXPOSE 4000
CMD ["node", "dist/main.js"]

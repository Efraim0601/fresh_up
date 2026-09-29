# @fresh-up/api

Backend NestJS + Prisma + PostgreSQL. Auth JWT + roles (Admin/Client/Tailor).

## Dev

```bash
cp ../../.env.example ../../.env   # si pas deja fait
docker compose -f ../../docker-compose.yml up -d postgres
pnpm install
pnpm --filter @fresh-up/api prisma:generate
pnpm --filter @fresh-up/api prisma:migrate
pnpm --filter @fresh-up/api start:dev
# ou depuis la racine : pnpm dev:api
```

`GET /health` retourne `{ status: "ok" }` une fois l'app demarree.

## Structure

```
src/
├── main.ts            Bootstrap Nest
├── app.module.ts        Module racine
└── app.controller.ts    Health check
prisma/
└── schema.prisma        Modele de donnees (voir docs/ARCHITECTURE.md)
```

Modules metier (`fabrics`, `garment-models`, `measurements`, `designs`,
`orders`, `payments`, `storage`, `auth`, `notifications`) a ajouter en Phase
1/2 - voir `../../docs/PHASE1_TASKS.md`.

# Fresh Up

Plateforme web (mobile first, PWA) permettant a un client de parcourir des
tissus, habiller un mannequin 3D avec la texture reelle du tissu,
personnaliser un vetement, et envoyer la commande a un couturier avec une
fiche technique complete.

Trois roles : **Admin/vendeur**, **Client**, **Couturier**. Voir le cahier des
charges complet dans `docs/ARCHITECTURE.md`.

> Etat actuel : **Phase 1 - scaffolding**. Ce depot contient l'architecture,
> la structure du monorepo et des squelettes d'applications vides. Aucune
> fonctionnalite metier n'est encore implementee. Voir
> `docs/PHASE1_TASKS.md` pour la liste des taches restantes.

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) - architecture technique,
  structure du monorepo, choix techniques, decisions ouvertes.
- [`docs/PHASE1_TASKS.md`](docs/PHASE1_TASKS.md) - liste detaillee des taches
  pour terminer la Phase 1 (prototype).
- [`docs/3D_ASSET_SPEC.md`](docs/3D_ASSET_SPEC.md) - specification exacte du
  format des assets 3D (mannequins, vetements) a destination de l'infographiste
  3D.

## Structure du monorepo

```
fresh_up/
├── apps/
│   ├── web/          Next.js (App Router) + TypeScript + Tailwind + R3F/drei, PWA
│   ├── api/           NestJS + Prisma + PostgreSQL (backend metier, auth, roles)
│   └── ai-service/    FastAPI (Python) - microservice IA (parse-outfit, inspiration image)
├── packages/
│   └── config/        Config partagee (tsconfig, eslint) entre apps TS
├── docs/               Documentation d'architecture et specifications
├── docker-compose.yml  Environnement de dev local (Postgres, MinIO, Ollama)
└── .env.example        Toutes les variables d'environnement documentees
```

## Demarrage rapide (dev)

Prerequis : Node.js >= 20, pnpm >= 9, Python >= 3.11, Docker (pour Postgres/MinIO).

```bash
cp .env.example .env
docker compose up -d postgres minio

pnpm install
pnpm dev:web     # front sur http://localhost:3000
pnpm dev:api     # backend sur http://localhost:4000
pnpm dev:ai      # microservice IA sur http://localhost:8000
```

Chaque app a aussi son propre `README.md` avec les details specifiques.

## Stack imposee

- **Front** : Next.js (App Router), TypeScript, Tailwind CSS, React Three
  Fiber + drei, PWA installable, mobile first (360px).
- **Back** : Node.js (NestJS) + PostgreSQL + Prisma, auth JWT, roles.
- **Stockage** : S3-compatible (MinIO en dev, OVH/Scaleway/AWS en prod).
- **IA** : microservice separe (Python/FastAPI), `/ai/parse-outfit` (niveau 1,
  obligatoire), `/ai/inspiration-image` (niveau 2, phase 3).
- **Deploiement** : Docker Compose pour le dev, CI simple.

Priorite aux technologies open source ; licence de chaque modele/bibliotheque
a verifier avant usage commercial (voir `docs/ARCHITECTURE.md`).

## Decisions ouvertes (a trancher par le proprietaire)

- **Paiement / devise / pays** : non specifie. Module de paiement concu comme
  une interface pluggable (`PAYMENT_PROVIDER` dans `.env`), provider `mock`
  par defaut en phase 1. Voir `docs/ARCHITECTURE.md#paiement`.
- **Budget / infra de production** : non specifie. Phase 1 concue pour tourner
  entierement en local/gratuit (Docker Compose, sans dependance payante).
  Le GPU pour l'IA niveau 2 est repousse a la phase 3.

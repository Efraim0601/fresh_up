# Architecture technique - Fresh Up

Ce document traduit le cahier des charges en architecture concrete pour la
Phase 1 (prototype) et pose les bases pour les Phases 2 et 3. Il est la
reference technique du depot ; toute deviation par rapport au cahier des
charges doit y etre justifiee.

## 1. Vue d'ensemble

```
                     ┌────────────────────────┐
                     │        Client           │
                     │  (navigateur mobile,     │
                     │   PWA installable)       │
                     └───────────┬──────────────┘
                                 │ HTTPS
                     ┌───────────▼──────────────┐
                     │   apps/web (Next.js)      │
                     │   App Router + R3F/drei   │
                     │   Tailwind, PWA            │
                     └───────────┬──────────────┘
                    REST/JSON    │      REST/JSON
              ┌──────────────────┴───────────────────┐
   ┌──────────▼─────────────┐          ┌──────────────▼───────────────┐
   │  apps/api (NestJS)       │          │  apps/ai-service (FastAPI)    │
   │  Auth JWT + roles        │          │  /ai/parse-outfit (niveau 1)  │
   │  Business logic          │          │  /ai/inspiration-image (v2)   │
   │  Prisma ORM               │          │  Ollama / vLLM (LLM local)    │
   └──────────┬───────┬──────┘          └───────────────────────────────┘
              │       │
    ┌─────────▼──┐ ┌──▼───────────────┐
    │ PostgreSQL │ │ Stockage S3-      │
    │ (Prisma)   │ │ compatible        │
    │            │ │ (images, PBR,     │
    │            │ │  GLB)             │
    └────────────┘ └───────────────────┘
```

Trois services deployables independamment : `web`, `api`, `ai-service`, plus
deux dependances d'infra : PostgreSQL et un stockage S3-compatible (MinIO en
dev). `ai-service` est volontairement isole du `api` pour pouvoir le scaler /
le remplacer / le desactiver sans toucher au coeur metier, et pour permettre
un futur deploiement sur un runtime GPU distinct (Modal/RunPod en phase 3).

## 2. Monorepo

Gestionnaire de paquets : **pnpm workspaces** (leger, rapide, pas de service
cloud requis - contrairement a un remote cache Turborepo/Nx qui impliquerait
une dependance externe non necessaire en phase 1). Turborepo pourra etre
ajoute plus tard si le nombre de packages partages augmente ; la structure
`apps/*` + `packages/*` est deja compatible.

```
fresh_up/
├── apps/
│   ├── web/              Next.js 14+ (App Router), TS, Tailwind, R3F/drei, PWA
│   ├── api/               NestJS, Prisma, PostgreSQL, JWT auth
│   └── ai-service/        FastAPI (Python 3.11+), pydantic, Ollama client
├── packages/
│   └── config/            tsconfig + eslint partages entre apps/web et apps/api
├── docs/                   Documentation (ce fichier, tasks, spec 3D)
├── docker-compose.yml
├── .env.example
└── package.json            Racine pnpm workspace
```

Pourquoi NestJS en app separee plutot que des routes API Next.js : le cahier
des charges autorise les deux ("NestJS ou routes Next.js"). NestJS est retenu
car (a) la logique metier est significative (calcul de metrage, machine a
etats des commandes, roles, reservation de stock) et beneficie d'une
structure modulaire (modules/services/controllers/guards) plus qu'un
ensemble de route handlers ; (b) cela permet de deployer/scaler le front et
le back independamment ; (c) cela facilite les tests unitaires du metier sans
dependre du runtime Next. Reevaluable si la complexite ne le justifie pas.

## 3. Front-end (`apps/web`)

- **Next.js App Router + TypeScript strict.**
- **Tailwind CSS**, design mobile first (viewport de depart 360px), barre
  d'onglets en bas (`Accueil / Catalogue / Atelier / Commandes / Compte`),
  gros boutons, peu de texte.
- **React Three Fiber + drei** pour la scene 3D (mannequin + vetements).
  Chargement des GLB via `useGLTF` (drei) avec Suspense + fallback loader.
  Draco/meshopt decoders charges via CDN ou self-hosted (a trancher en phase
  1 selon la taille du bundle).
- **PWA** : manifest.json + service worker (via `next-pwa` ou implementation
  manuelle Workbox), installable, cache des assets statiques et des GLB
  recemment consultes pour navigation hors-ligne partielle.
- **i18n** : francais uniquement en phase 1 (conformement aux reponses du
  proprietaire), mais les chaines de caractere sont deja isolees dans un
  dossier `src/i18n/fr.ts` pour ne pas bloquer un ajout ulterieur.
- **Etat client** : Zustand (ou Context API) pour l'etat du mannequin en
  cours d'edition (mesures, tissu selectionne, options de vetement) -
  decision a valider en phase 1, non bloquante pour le scaffolding.

### Arborescence prevue (a completer en Phase 1/2)

```
apps/web/
├── src/
│   ├── app/                 Routes App Router (/, /catalogue, /atelier, /commandes, /compte)
│   ├── components/
│   │   └── three/            Scene R3F, Mannequin, GarmentPiece, Lighting, Controls
│   ├── lib/                  Client API (fetch typed), helpers
│   ├── stores/                Zustand stores (design en cours, mesures)
│   └── i18n/                  Chaines FR
├── public/
│   └── models/                GLB de secours + vignettes
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 4. Backend metier (`apps/api`)

- **NestJS + TypeScript strict + Prisma + PostgreSQL.**
- **Auth** : JWT (access + refresh token), guards par role
  (`ADMIN`, `CLIENT`, `TAILOR`), decorateurs `@Roles()`.
- **Modules previsionnels** (Phase 2, pas codes en Phase 1) :
  `auth`, `users`, `fabrics`, `garment-models`, `measurements`, `designs`,
  `orders`, `payments` (interface pluggable), `storage` (client S3),
  `notifications` (stub whatsapp/sms).
- **Prisma** : schema unique dans `apps/api/prisma/schema.prisma`, migrations
  versionnees dans `apps/api/prisma/migrations`.
- **Validation** : `class-validator` / `zod` sur les DTO d'entree.
- **Stockage** : `@aws-sdk/client-s3` (compatible MinIO et tout endpoint
  S3), redimensionnement d'image via `sharp` a l'upload (miniatures,
  formats WebP).

### Modele de donnees (Prisma) - vue Phase 1/2

Voir `apps/api/prisma/schema.prisma` pour la version scaffoldee (squelette,
champs principaux, pas encore de migration appliquee). Entites : `User`,
`Fabric`, `GarmentModel`, `GarmentOption`, `Measurement`, `Design`, `Order`,
`OrderEvent`, avec les statuts de commande definis dans le cahier des
charges (`DRAFT → VALIDATED → PAID → MEASUREMENTS_CONFIRMED → CUTTING →
SEWING → FITTING → READY → DELIVERED`).

## 5. Service IA (`apps/ai-service`)

- **Python 3.11 + FastAPI + Pydantic** (schemas de sortie valides, coherent
  avec le cahier des charges qui autorise Python/FastAPI ou Node).
- **`POST /ai/parse-outfit`** (Phase 2, obligatoire) : description libre en
  francais -> JSON structure (`type`, `coupe`, `manches`, `col`, `longueur`,
  `confiance`). Backend LLM open source via **Ollama** (Qwen2.5 7B / Mistral
  7B / Llama 3.1 8B, a choisir en phase 2 selon perf/empreinte memoire
  disponible sur l'infra retenue). **Repli obligatoire par regles/mots-cles**
  si Ollama indisponible (`AI_PARSE_OUTFIT_FALLBACK_ENABLED`), pour ne jamais
  bloquer l'atelier client.
- **`POST /ai/inspiration-image`** (Phase 3, optionnel) : SDXL ou FLUX.1
  schnell (jamais FLUX.1 dev - licence non commerciale), IP-Adapter sur photo
  de tissu, file asynchrone, quota par client, GPU a la demande
  (Modal/RunPod). Image explicitement etiquetee "inspiration", jamais comme
  rendu final fidele.
- **Niveau 3** (MediaPipe Pose cote client, phase 3) : n'implique pas
  `ai-service`, tourne dans le navigateur (`apps/web`), propose des mesures
  que le couturier valide - pas de traitement serveur des images corporelles.

En phase 1, `ai-service` est un squelette FastAPI avec les deux routes
definies et un `503`/reponse de repli explicite ("non implemente en phase
1"), pour que le contrat d'API soit stable des le depart.

## 6. Paiement

Decision ouverte (pays/devise/prestataire non tranches par le proprietaire).
Architecture retenue : interface `PaymentProvider` dans `apps/api` avec une
implementation `MockPaymentProvider` (phase 1/2, aucune vraie transaction)
et des implementations futures `StripeProvider` (carte) et
`MobileMoneyProvider` (Orange Money/Wave/MTN MoMo via adaptateur generique),
selectionnees par la variable d'environnement `PAYMENT_PROVIDER`. La devise
est configurable (`PAYMENT_CURRENCY`, `XAF` par defaut a titre d'exemple, a
confirmer). Aucun montant, aucune devise, aucun prestataire ne doit etre
code en dur dans le domaine metier (`Order.price` reste un entier en unite
mineure + code devise ISO 4217).

## 7. Stockage S3-compatible

MinIO en dev (`docker-compose.yml`), n'importe quel endpoint S3-compatible en
prod (OVH Object Storage, Scaleway, AWS S3...). Trois buckets logiques :
`fresh-up-fabrics` (photos + textures PBR generees), `fresh-up-garments`
(GLB des modeles de vetements), `fresh-up-renders` (captures 3D figees des
commandes validees). Redimensionnement/format d'image gere par `apps/api`
a l'upload (pas de traitement cote client).

## 8. Deploiement / CI

- **Dev** : `docker-compose.yml` (profils `default` = infra seule postgres +
  minio, `ai` = + ollama, `full` = + web/api/ai-service conteneurises).
  Aucune dependance payante requise pour faire tourner la Phase 1.
- **CI** : `.github/workflows/ci.yml` (squelette Phase 1) - install, lint,
  typecheck, build sur chaque PR. Tests et deploiement continu a enrichir en
  Phase 2.

## 9. Securite / RGPD

- Auth JWT, hashage des mots de passe (argon2/bcrypt), guards de role sur
  chaque endpoint sensible.
- Les mesures corporelles (`Measurement`) sont des donnees personnelles
  sensibles au sens RGPD : acces restreint au client proprietaire, au
  couturier assigne et a l'admin ; a documenter dans une politique de
  retention/suppression en Phase 2 (droit a l'effacement).
- Validation stricte de toutes les entrees (DTO NestJS + zod/pydantic cote
  ai-service).
- Licences : verifier explicitement la licence de chaque modele IA et
  bibliotheque 3D avant tout usage commercial (voir note FLUX.1 schnell vs
  dev ci-dessus ; MakeHuman/MPFB sont sous licence AGPL/CC0 selon les assets -
  a verifier actif par actif avant integration).

## 10. Decisions ouvertes (a confirmer par le proprietaire)

1. **Paiement / devise / pays de lancement** - non specifie. Voir section 6.
2. **Budget / infra de production** - non specifie. Hypothese par defaut :
   demarrage bootstrap, priorite aux outils gratuits/open source en phase 1,
   depense GPU (IA niveau 2) repoussee en phase 3.
3. **Choix definitif du LLM local** (Qwen2.5 7B vs Mistral 7B vs Llama 3.1
   8B) - a trancher en phase 2 selon les ressources serveur disponibles.
4. **Turborepo/Nx** - non ajoute en phase 1 (pnpm workspaces suffit),
   reevaluable si le monorepo grossit.

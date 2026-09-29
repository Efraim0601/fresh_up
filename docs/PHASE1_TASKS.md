# Phase 1 - Liste de taches (Prototype)

Objectif de la Phase 1 (rappel du cahier des charges) : **monorepo, Docker
Compose, un mannequin, 3 vetements, 5 tissus, curseurs de mesures,
changement de tissu en direct**. But : valider le realisme et la performance
sur telephone, avant d'investir dans l'auth, le catalogue complet, l'IA, le
paiement (Phase 2).

## Etat au demarrage (cette PR)

- [x] Repo initialise, architecture documentee (`docs/ARCHITECTURE.md`)
- [x] Squelette monorepo pnpm workspaces (`apps/web`, `apps/api`,
      `apps/ai-service`)
- [x] `docker-compose.yml` dev (Postgres, MinIO, Ollama optionnel)
- [x] `.env.example` complet
- [x] Specification des assets 3D pour l'infographiste
      (`docs/3D_ASSET_SPEC.md`)
- [x] Scene R3F minimale avec mannequin de secours (mesh primitif) qui
      s'affiche au `npm run dev`
- [x] Schema Prisma initial (squelette, sans migration appliquee)
- [x] CI squelette (lint/build sur PR)

## Reste a faire pour cloturer la Phase 1

### Mannequin 3D et rendu

- [ ] Recuperer/produire un mannequin de secours un peu plus fini (proportions
      humaines de base) en remplacement du placeholder primitif actuel, tant
      que les vrais assets ne sont pas livres par l'infographiste
- [ ] Integrer le premier mannequin reel (corps parametrique, un seul genre
      pour commencer) exporte par l'infographiste selon
      `docs/3D_ASSET_SPEC.md`, avec morph targets (taille, poitrine, taille,
      hanches, epaules, bras, jambes)
- [ ] Cablier les curseurs de mesures (`apps/web`) aux morph targets via
      `useGLTF` + manipulation des `influence` de `morphTargetDictionary`
- [ ] Modeliser/integrer 3 vetements de base (ex: chemise manches courtes,
      chemise manches longues, jupe) partageant le squelette/morph targets du
      corps
- [ ] Pipeline changement de tissu = remplacement du materiau
      (`MeshStandardMaterial` avec textures PBR) sans recharger le GLB
- [ ] Vues predefinies (face, dos, profil), controles tactiles
      (rotation/zoom/pincement via drei `OrbitControls`), eclairage neutre +
      ombres douces
- [ ] Verifier le budget de performance sur un telephone milieu de gamme reel
      (pas seulement desktop) : poids GLB < 5 Mo/vetement, FPS stable

### Tissus

- [ ] Definir/produire 5 tissus placeholder (photo + metadonnees : nom,
      categorie, matiere, couleurs, prix/m, largeur de rouleau)
- [ ] Pipeline (meme minimal/manuel en phase 1) photo -> texture tileable +
      cartes PBR (albedo, normal, roughness) - automatisation complete
      repoussee en Phase 2 ("ajout rapide d'un tissu" cote admin)
- [ ] Stocker les 5 tissus + textures dans MinIO (bucket
      `fresh-up-fabrics`) et les exposer via l'API (endpoint simple, meme non
      authentifie en phase 1)

### Backend / API

- [ ] Finaliser et appliquer la premiere migration Prisma
      (`apps/api/prisma/schema.prisma` -> `prisma migrate dev`)
- [ ] Endpoint minimal `GET /fabrics` (liste des 5 tissus) pour alimenter le
      front - sans auth en phase 1 (l'auth/roles arrivent en Phase 2)
- [ ] Endpoint minimal `GET /garment-models` (les 3 vetements) avec leurs
      options de base
- [ ] Client S3 (`apps/api`) : upload + redimensionnement d'image (sharp) -
      suffisant pour les 5 tissus de demo

### Front-end

- [ ] Ecran "Atelier mannequin" minimal : mannequin en haut, selecteur de
      tissu en bas (les 5 tissus), curseurs de mesures
- [ ] Connexion au endpoint `GET /fabrics` / `GET /garment-models` de
      `apps/api` (remplacer les donnees mock du scaffold)
- [ ] Verifier le rendu mobile first des le viewport 360px
- [ ] PWA installable de base (manifest + service worker minimal)

### Infra / DX

- [ ] Verifier que `docker compose up -d postgres minio` + `pnpm install` +
      `pnpm dev:web/dev:api/dev:ai` fonctionne de bout en bout sur une machine
      propre (pas seulement celle du createur du scaffold)
- [ ] Ajouter un `Dockerfile` reel pour `apps/web` et `apps/api` (actuellement
      references par `docker-compose.yml` profil `full` mais pas encore
      ecrits - a faire des que les apps ont un premier build stable)
- [ ] Documenter le workflow d'ajout d'un tissu/vetement pour les tests (README
      dedie par app)
- [ ] Verifier/corriger le workflow CI (`.github/workflows/ci.yml`, squelette
      non encore execute) - notamment `prisma generate` avant le build de
      `apps/api`, et une config eslint reelle pour `apps/api`

## Hors scope Phase 1 (rappel, pour eviter le scope creep)

- Auth/roles, catalogue complet, admin, IA (tous niveaux), calcul de
  metrage automatique, paiement reel, notifications - Phase 2.
- Images d'inspiration IA, plusieurs couturiers, mesures par photo, avis
  clients, statistiques - Phase 3.

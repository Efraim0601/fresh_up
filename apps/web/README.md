# @fresh-up/web

Front-end Next.js (App Router) + TypeScript + Tailwind + React Three Fiber,
PWA mobile first.

## Dev

```bash
pnpm install
pnpm --filter @fresh-up/web dev
# ou depuis la racine : pnpm dev:web
```

Ouvrir http://localhost:3000 - la page d'accueil affiche une scene 3D avec un
mannequin de secours (primitives Three.js, voir
`src/components/three/FallbackMannequin.tsx`). Voir
`../../docs/3D_ASSET_SPEC.md` pour le format des vrais assets a venir, et
`../../docs/PHASE1_TASKS.md` pour la suite.

## Structure

```
src/
├── app/                Routes App Router
├── components/three/    Scene R3F, mannequin, (futur: vetements, materiaux)
├── lib/                 (a venir) client API typed vers apps/api
├── stores/               (a venir) etat du design en cours (Zustand)
└── i18n/                 (a venir) chaines FR isolees
```

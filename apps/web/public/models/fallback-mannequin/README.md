# Mannequin de secours

Ce dossier est prevu pour accueillir un futur GLB de secours (mesh simple,
sans valeur anatomique) si on decide d'en charger un via `useGLTF` plutot que
de le construire en primitives Three.js codees en dur.

Pour l'instant (Phase 1, ce scaffold), le mannequin de secours est genere
directement en code : voir
`apps/web/src/components/three/FallbackMannequin.tsx`. Aucun fichier GLB
n'est requis pour que `pnpm dev:web` affiche une scene 3D.

Quand les vrais assets seront livres par l'infographiste (voir
`docs/3D_ASSET_SPEC.md`), ils remplaceront ce composant par un chargement GLB
reel avec morph targets et squelette.

# Specification des assets 3D - a l'attention de l'infographiste

Ce document fixe le format attendu pour les mannequins et vetements 3D, afin
que les assets produits s'integrent sans rework dans `apps/web` (React Three
Fiber). Merci de suivre ces regles des le premier export, meme pour un
brouillon - cela evite des allers-retours couteux.

## 1. Pipeline recommande

MakeHuman / MPFB (Blender) -> export GLB. Toute autre chaine d'outils est
acceptable tant que le fichier GLB final respecte les contraintes ci-dessous.

> Licence : verifier la licence exacte des assets MakeHuman/MPFB utilises
> (corps de base, textures fournies par l'outil) avant tout usage commercial.
> Ne pas reutiliser telles quelles des textures d'exemple non libres de
> droits.

## 2. Echelle et orientation

- **Unites** : metres reels. Un mannequin adulte moyen doit mesurer environ
  **1.65 a 1.80 m** de haut dans le fichier (pas de mise a l'echelle
  arbitraire type "1 unite = 1 cm").
- **Origine** : au sol, entre les deux pieds (0, 0, 0).
- **Axe vertical** : Y-up (convention glTF standard). Si l'export vient de
  Blender (Z-up), utiliser l'export glTF officiel qui fait la conversion
  automatiquement - ne jamais livrer un asset Z-up brut.
- **Face avant** : le mannequin regarde vers +Z.

## 3. Morph targets (blend shapes)

Nommage exact requis (respect de la casse), pour que le code front
(`apps/web/src/components/three`) puisse cibler chaque cle sans mapping
manuel par asset :

| Nom du morph target | Controle client correspondant       | Plage attendue |
|----------------------|--------------------------------------|-----------------|
| `morph_height`        | Taille (stature)                     | 0 (min) - 1 (max) |
| `morph_bust`           | Tour de poitrine                     | 0 - 1 |
| `morph_waist`          | Tour de taille                       | 0 - 1 |
| `morph_hips`            | Tour de hanches                      | 0 - 1 |
| `morph_shoulders`      | Largeur d'epaules                    | 0 - 1 |
| `morph_arm_length`     | Longueur des bras                    | 0 - 1 |
| `morph_leg_length`     | Longueur des jambes                  | 0 - 1 |

Regles :
- Chaque morph target est normalise entre 0 et 1 (influence glTF standard),
  jamais en valeurs absolues (cm). La conversion cm <-> influence se fait
  cote front a partir de bornes min/max documentees par mannequin (a fournir
  par l'infographiste dans un petit fichier `meta.json` accompagnant chaque
  GLB, ex: `{ "morph_height": { "minCm": 150, "maxCm": 195 } }`).
- Les morph targets doivent etre presents et fonctionnels a 0 ET a 1 sans
  deformations visuelles (auto-intersections, etirements de texture) aux
  extremes realistes.
- Les vetements qui partagent le squelette du corps doivent exposer les
  **memes morph targets, avec les memes noms**, pour rester coherents quand
  le corps est deforme (sinon le vetement "flotte" hors du corps).

## 4. Squelette (skinning)

- Un seul squelette de reference par genre (`skeleton_male.glb`,
  `skeleton_female.glb` en interne), partage par le corps et par toutes les
  pieces de vetement modulaires (corsage, manches, cols, jupes, pantalons).
- Skinning standard glTF (`JOINTS_0` / `WEIGHTS_0`), 4 joints max par vertex.
- Nommage des os coherent entre corps et vetements (meme squelette source
  reexporte, jamais reconstruit independamment par vetement).

## 5. UV et motifs a l'echelle reelle

- **UV non chevauchants**, dans l'espace [0,1], avec une correspondance
  **metrique connue** : fournir, par piece de patron (devant, dos, manche...),
  la taille reelle en cm que represente le carre UV [0,1]x[0,1] (ou un ratio
  texel/cm constant sur l'ensemble du vetement). Cette information est
  indispensable pour que les motifs de tissu (wax, rayures, carreaux)
  conservent leur taille reelle une fois appliques (pas de motif "geant" ou
  "minuscule" selon la piece).
- Privilegier un **texel density homogene** sur tout le vetement (eviter
  qu'une manche ait une densite UV tres differente du corsage).
- Raccord des motifs : indiquer dans les metadonnees si un raccord
  (repeat) est attendu a une couture donnee (utile plus tard pour le calcul
  de metrage et le rendu, meme si non exploite en Phase 1).

## 6. Materiaux et textures (PBR)

- **Un seul material slot par piece de vetement**, pour permettre le
  remplacement de tissu par simple substitution de material (`albedo`,
  `normal`, `roughness`) sans recharger le GLB.
- Textures livrees separement du GLB (le pipeline de generation de texture a
  partir d'une photo de tissu est gere par `apps/api`/`apps/ai-service`, pas
  par l'infographiste) : `albedo.webp` (ou `.ktx2`), `normal.webp/.ktx2`,
  `roughness.webp/.ktx2`.
- Resolution de reference pour les textures placeholder : 1024x1024 (pourra
  monter a 2048 pour les tissus a motif fin en Phase 2).
- Compression texture cote runtime : **KTX2** (Basis Universal) prefere,
  **WebP** acceptable en repli. Pas de PNG/JPEG non compresse en prod.

## 7. Poids et compression du fichier

- **< 5 Mo par vetement GLB**, compression **Draco** (geometrie) ou
  **meshopt** activee a l'export. Draco est recommande par defaut (support
  large, bon ratio) ; meshopt est acceptable si le pipeline de build web le
  supporte mieux (a valider en Phase 1 selon les decodeurs charges cote
  `apps/web`).
- Poids indicatif pour le mannequin de base (corps + squelette + morph
  targets, sans vetement) : viser aussi **< 5 Mo**.
- Nombre de triangles indicatif (a ajuster selon les mesures reelles sur
  mobile en Phase 1) : **15 000 - 30 000 triangles** pour le corps complet,
  **5 000 - 15 000** par piece de vetement. Objectif : fluidite sur telephone
  milieu de gamme, pas photorealisme desktop.

## 8. Reglages d'export GLB (recapitulatif pratique, Blender)

Lors de l'export glTF 2.0 (`.glb`) depuis Blender :

- Format : **glTF Binary (.glb)**
- Include : Selected Objects (pour exporter corps et vetements separement)
- Transform : **+Y Up** (conversion automatique depuis Blender Z-up)
- Geometry : appliquer les modifiers, UVs, Normals, Vertex Colors si utilises
- Compression : activer **Draco mesh compression** (niveau 6-7 par defaut)
- Skinning : inclure Armatures + Skinning si le mesh est rigge
- Shape Keys : inclure les shape keys en cochant "Shape Keys" -> ce sont les
  morph targets nommes selon la section 3 (nommer les shape keys Blender
  exactement comme dans le tableau avant export)
- Materials : exporter en PBR (Principled BSDF), textures **non embarquees**
  dans le GLB si possible (fichiers separes, pour permettre le remplacement
  de materiau cote runtime sans re-export)

## 9. Livraison

Pour chaque asset livre, fournir :

1. Le fichier `.glb` (corps ou piece de vetement)
2. Un `meta.json` avec les bornes min/max (cm) de chaque morph target
   utilise, et le ratio texel/cm par piece de patron (section 5)
3. Une capture d'ecran de reference (face, dos, profil) pour verification
   visuelle rapide avant integration

## 10. Mannequin de secours actuel (dev)

En attendant les premiers exports reels, `apps/web` embarque un mannequin de
secours **primitif** (capsule + spheres, sans morph targets ni squelette) --
voir `apps/web/public/models/fallback-mannequin/README.md`. Il sert
uniquement a valider que le pipeline de rendu R3F fonctionne de bout en bout
(chargement GLB, materiaux, controles tactiles) ; il n'a aucune valeur
esthetique ni anatomique et sera remplace des que possible.

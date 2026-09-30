"use client";

/**
 * Mannequin de secours (Phase 1, dev uniquement).
 *
 * Ce mesh est construit uniquement a partir de primitives Three.js (capsule +
 * spheres), SANS morph targets ni squelette. Il n'a aucune valeur anatomique
 * ni esthetique : son seul but est de valider que le pipeline de rendu R3F
 * (scene, camera, lumieres, controles tactiles) fonctionne de bout en bout
 * avant que les vrais assets GLB (voir docs/3D_ASSET_SPEC.md) soient livres
 * par l'infographiste 3D.
 *
 * A remplacer par un vrai GLB (useGLTF depuis drei) des que le premier
 * mannequin reel est disponible - voir docs/PHASE1_TASKS.md.
 *
 * `fabricColor` (Phase 1) : couleur unie appliquee au buste + bassin pour
 * simuler en direct le changement de tissu, en attendant le vrai pipeline de
 * texture PBR (remplacement du materiau sans recharger le mesh/GLB, cf.
 * docs/ARCHITECTURE.md).
 */
export interface FallbackMannequinProps {
  fabricColor?: string;
}

export function FallbackMannequin({ fabricColor }: FallbackMannequinProps) {
  const garmentColor = fabricColor ?? "#c96f4c";

  return (
    <group position={[0, 0, 0]}>
      {/* Tete */}
      <mesh position={[0, 1.62, 0]} castShadow>
        <sphereGeometry args={[0.11, 24, 24]} />
        <meshStandardMaterial color="#e8c9a8" roughness={0.6} />
      </mesh>

      {/* Buste (habille du tissu selectionne) */}
      <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.16, 0.45, 8, 16]} />
        <meshStandardMaterial color={garmentColor} roughness={0.7} />
      </mesh>

      {/* Bassin (habille du tissu selectionne) */}
      <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.14, 0.15, 8, 16]} />
        <meshStandardMaterial color={garmentColor} roughness={0.7} />
      </mesh>

      {/* Bras */}
      {[-1, 1].map((side) => (
        <mesh
          key={`arm-${side}`}
          position={[0.26 * side, 1.1, 0]}
          rotation={[0, 0, (Math.PI / 16) * side]}
          castShadow
        >
          <capsuleGeometry args={[0.045, 0.55, 6, 12]} />
          <meshStandardMaterial color="#e8c9a8" roughness={0.6} />
        </mesh>
      ))}

      {/* Jambes */}
      {[-1, 1].map((side) => (
        <mesh key={`leg-${side}`} position={[0.09 * side, 0.35, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.65, 6, 12]} />
          <meshStandardMaterial color="#241611" roughness={0.8} />
        </mesh>
      ))}

      {/* Sol de reference (ombre douce) */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.9, 32]} />
        <meshStandardMaterial color="#f0e8df" roughness={1} />
      </mesh>
    </group>
  );
}

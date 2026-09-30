"use client";

import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { FallbackMannequin } from "./FallbackMannequin";

/**
 * Scene 3D minimale de l'atelier mannequin (Phase 1).
 *
 * Controles tactiles : rotation/zoom via OrbitControls (drei), qui gere
 * nativement le pinch-to-zoom sur mobile. Eclairage neutre + ombres douces
 * via ContactShadows + Environment preset "city" en attendant un HDRI dedie.
 *
 * Remplacer <FallbackMannequin /> par le vrai mannequin (GLB + morph
 * targets, cf. docs/3D_ASSET_SPEC.md) des que disponible.
 *
 * `fabricColor` : propage la couleur du tissu selectionne dans le catalogue
 * jusqu'au materiau du mannequin. Change en direct (prop React) sans jamais
 * remonter le <Canvas> ni recharger le mesh - cf. "changement de tissu sans
 * recharger le modele" dans docs/PHASE1_TASKS.md.
 */
export interface MannequinSceneProps {
  fabricColor?: string;
}

export function MannequinScene({ fabricColor }: MannequinSceneProps) {
  return (
    <div className="h-[60vh] w-full min-h-[320px] touch-none">
      <Canvas
        shadows
        camera={{ position: [0, 1.1, 2.4], fov: 35 }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[2, 4, 3]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        <Suspense fallback={null}>
          <FallbackMannequin fabricColor={fabricColor} />
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.4}
            scale={2.5}
            blur={2}
            far={2}
          />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={1.2}
          maxDistance={4}
          target={[0, 1, 0]}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
    </div>
  );
}

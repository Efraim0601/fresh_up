"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Fabric } from "@/lib/api";
import { FabricCatalog } from "./FabricCatalog";

// La scene R3F utilise le canvas WebGL - chargee cote client uniquement.
const MannequinScene = dynamic(
  () =>
    import("@/components/three/MannequinScene").then(
      (mod) => mod.MannequinScene,
    ),
  { ssr: false },
);

/**
 * Ecran "Atelier mannequin" minimal (Phase 1) : mannequin en haut, catalogue
 * de tissus en bas. Selectionner un tissu met a jour en direct la couleur du
 * mannequin (etat leve ici, transmis en prop) sans recharger la scene 3D.
 */
export function FabricAtelier() {
  const [selectedFabric, setSelectedFabric] = useState<Fabric | null>(null);

  return (
    <>
      <MannequinScene fabricColor={selectedFabric?.couleurHex ?? undefined} />

      <section className="flex-1">
        <h2 className="px-4 pt-4 text-sm font-medium text-brand-dark">
          Catalogue de tissus
        </h2>
        <FabricCatalog
          selectedFabricId={selectedFabric?.id ?? null}
          onSelect={setSelectedFabric}
        />
      </section>
    </>
  );
}

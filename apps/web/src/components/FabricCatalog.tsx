"use client";

import { useEffect, useState } from "react";
import { Fabric, fetchFabrics } from "@/lib/api";

interface FabricCatalogProps {
  selectedFabricId: string | null;
  onSelect: (fabric: Fabric) => void;
}

type LoadState = "loading" | "ready" | "error";

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 0,
});

/**
 * Catalogue mobile-first des tissus (Phase 1 : etat charge cote client).
 * Grille de vignettes tactiles - nom, prix/m, pastille de couleur - qui
 * pilotent la couleur du mannequin 3D sans recharger la scene.
 */
export function FabricCatalog({
  selectedFabricId,
  onSelect,
}: FabricCatalogProps) {
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    let cancelled = false;

    fetchFabrics()
      .then((data) => {
        if (cancelled) return;
        setFabrics(data);
        setState("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (state === "loading") {
    return (
      <p className="px-4 py-6 text-sm text-gray-500">
        Chargement du catalogue de tissus...
      </p>
    );
  }

  if (state === "error") {
    return (
      <p className="px-4 py-6 text-sm text-red-600">
        Catalogue indisponible pour le moment. Reessayez plus tard.
      </p>
    );
  }

  if (fabrics.length === 0) {
    return (
      <p className="px-4 py-6 text-sm text-gray-500">
        Aucun tissu disponible pour le moment.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-3 px-4 py-4 sm:grid-cols-3">
      {fabrics.map((fabric) => {
        const isSelected = fabric.id === selectedFabricId;

        return (
          <li key={fabric.id}>
            <button
              type="button"
              onClick={() => onSelect(fabric)}
              aria-pressed={isSelected}
              className={`flex w-full flex-col items-start gap-2 rounded-xl border p-3 text-left transition ${
                isSelected
                  ? "border-brand bg-brand/5 ring-2 ring-brand"
                  : "border-gray-200 bg-white"
              }`}
            >
              <span
                className="h-10 w-10 rounded-full border border-black/10"
                style={{ backgroundColor: fabric.couleurHex ?? "#cccccc" }}
                aria-hidden
              />
              <span className="text-sm font-medium text-brand-dark">
                {fabric.name}
              </span>
              <span className="text-xs text-gray-500">
                {currencyFormatter.format(fabric.pricePerMeter)}{" "}
                {fabric.currency}/m
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

// Client API minimal cote front - un fetch typé par ressource, pas de
// generation automatique en Phase 1 (voir docs/ARCHITECTURE.md#3-front-end-appsweb).

export interface Fabric {
  id: string;
  name: string;
  category: string; // "homme" | "femme" | "mixte"
  material: string;
  colors: string[];
  couleurHex: string | null;
  pricePerMeter: number;
  currency: string;
  rollWidthCm: number;
  imageUrl: string | null;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

/**
 * Recupere le catalogue de tissus depuis `apps/api` (`GET /fabrics`).
 * Ne lance jamais d'exception : l'appelant gere l'etat vide/erreur pour ne
 * pas faire planter l'UI si l'API est injoignable (cf. brief Phase 1).
 */
export async function fetchFabrics(): Promise<Fabric[]> {
  const response = await fetch(`${API_BASE_URL}/fabrics`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Erreur API fabrics (${response.status})`);
  }

  return (await response.json()) as Fabric[];
}

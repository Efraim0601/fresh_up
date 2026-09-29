import dynamic from "next/dynamic";

// La scene R3F utilise le canvas WebGL - chargee cote client uniquement.
const MannequinScene = dynamic(
  () =>
    import("@/components/three/MannequinScene").then(
      (mod) => mod.MannequinScene,
    ),
  { ssr: false },
);

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-semibold text-brand-dark">Fresh Up</h1>
        <p className="text-sm text-brand-dark/70">
          Prototype Phase 1 - mannequin de secours (assets reels a venir).
        </p>
      </header>

      <MannequinScene />

      <section className="flex-1 px-4 py-4">
        <p className="text-sm text-gray-600">
          Ici viendront le selecteur de tissu, les curseurs de mesures et le
          champ &laquo;&nbsp;decrivez votre tenue&nbsp;&raquo; (voir
          docs/PHASE1_TASKS.md).
        </p>
      </section>

      <nav className="sticky bottom-0 flex justify-around border-t border-gray-200 bg-white py-3 text-xs text-gray-500">
        <span className="font-medium text-brand">Accueil</span>
        <span>Catalogue</span>
        <span>Atelier</span>
        <span>Commandes</span>
        <span>Compte</span>
      </nav>
    </main>
  );
}

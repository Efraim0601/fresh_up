import { FabricAtelier } from "@/components/FabricAtelier";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-semibold text-brand-dark">Fresh Up</h1>
        <p className="text-sm text-brand-dark/70">
          Choisissez un tissu pour habiller le mannequin en direct.
        </p>
      </header>

      <FabricAtelier />

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

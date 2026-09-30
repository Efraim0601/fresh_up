// Seed Phase 1 : 5 tissus placeholder pour alimenter le catalogue et le
// mannequin 3D (couleur unie en attendant le pipeline photo -> texture PBR,
// voir docs/PHASE1_TASKS.md). Execution : `pnpm --filter @fresh-up/api prisma:seed`
// (ou `npx prisma db seed` depuis apps/api), avec DATABASE_URL pointant vers
// la base cible.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface FabricSeed {
  name: string;
  category: "homme" | "femme" | "mixte";
  material: string;
  colors: string[];
  couleurHex: string;
  pricePerMeter: number; // unite mineure XAF (1 XAF = 1 unite, pas de sous-unite)
  stockMeters: number;
  rollWidthCm: number;
}

const fabrics: FabricSeed[] = [
  {
    name: "Wax imprime bleu",
    category: "femme",
    material: "wax",
    colors: ["bleu", "blanc"],
    couleurHex: "#1d4ed8",
    pricePerMeter: 4500,
    stockMeters: 42.5,
    rollWidthCm: 118,
  },
  {
    name: "Coton uni blanc",
    category: "mixte",
    material: "coton",
    colors: ["blanc"],
    couleurHex: "#f8fafc",
    pricePerMeter: 2500,
    stockMeters: 60,
    rollWidthCm: 150,
  },
  {
    name: "Bazin brode bordeaux",
    category: "homme",
    material: "bazin",
    colors: ["bordeaux", "or"],
    couleurHex: "#7f1d1d",
    pricePerMeter: 8000,
    stockMeters: 25,
    rollWidthCm: 180,
  },
  {
    name: "Lin naturel beige",
    category: "mixte",
    material: "lin",
    colors: ["beige"],
    couleurHex: "#d6c2a1",
    pricePerMeter: 5200,
    stockMeters: 33,
    rollWidthCm: 140,
  },
  {
    name: "Soie imprimee vert emeraude",
    category: "femme",
    material: "soie",
    colors: ["vert emeraude", "dore"],
    couleurHex: "#047857",
    pricePerMeter: 12000,
    stockMeters: 15.5,
    rollWidthCm: 110,
  },
];

async function main() {
  for (const fabric of fabrics) {
    const existing = await prisma.fabric.findFirst({
      where: { name: fabric.name },
    });

    if (existing) {
      await prisma.fabric.update({
        where: { id: existing.id },
        data: fabric,
      });
    } else {
      await prisma.fabric.create({ data: fabric });
    }
  }

  // eslint-disable-next-line no-console
  console.log(`Seed termine : ${fabrics.length} tissus (crees/mis a jour).`);
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

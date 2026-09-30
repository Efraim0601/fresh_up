import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

// Module global : PrismaService injectable dans n'importe quel module metier
// sans le reimporter partout (fabrics aujourd'hui, garment-models/orders/...
// en Phase 2).
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

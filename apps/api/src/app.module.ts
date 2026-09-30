import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { FabricsModule } from "./fabrics/fabrics.module";

// Modules metier restants (garment-models, orders, auth, ...) a ajouter en
// Phase 2 - voir docs/PHASE1_TASKS.md et docs/ARCHITECTURE.md#4-backend-metier-appsapi
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env"],
    }),
    PrismaModule,
    FabricsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

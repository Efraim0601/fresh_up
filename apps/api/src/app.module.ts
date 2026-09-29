import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";

// Modules metier (fabrics, garment-models, orders, auth, ...) a ajouter en
// Phase 1/2 - voir docs/PHASE1_TASKS.md et docs/ARCHITECTURE.md#4-backend-metier-appsapi
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env"],
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

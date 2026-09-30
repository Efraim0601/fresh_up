import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

// Service Prisma partage entre modules metier (fabrics, garment-models, ...).
// Un seul PrismaClient par process, connecte/deconnecte avec le cycle de vie
// de l'application Nest - voir docs/ARCHITECTURE.md#4-backend-metier-appsapi.
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}

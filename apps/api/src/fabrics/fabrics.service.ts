import { Injectable } from "@nestjs/common";
import { Fabric } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class FabricsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Fabric[]> {
    return this.prisma.fabric.findMany({
      orderBy: { createdAt: "asc" },
    });
  }
}
